import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const PORT = process.env.PORT || 8080;
const WEBHOOK_SECRET = process.env.TRADINGVIEW_WEBHOOK_SECRET || '';
const startedAt = Date.now();

let state = {
  symbol: 'XAUUSD',
  timeframe: 'M5',
  mode: 'PAPER',
  live: false,
  price: null,
  updatedAt: null,
  signal: null,
  positions: [],
  history: []
};

function broadcast(message) {
  const payload = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(payload);
  }
}

function normalizeSignal(body) {
  const side = String(body.side || body.direction || '').toUpperCase();
  if (!['LONG', 'SHORT'].includes(side)) throw new Error('side must be LONG or SHORT');
  const entry = Number(body.entry);
  const sl = Number(body.sl);
  const tp = Number(body.tp);
  if (![entry, sl, tp].every(Number.isFinite)) throw new Error('entry, sl and tp are required');
  return {
    id: `SIG-${Date.now()}`,
    symbol: body.symbol || 'XAUUSD',
    timeframe: body.timeframe || 'M5',
    side,
    entry,
    sl,
    tp,
    rr: Number(body.rr) || Math.abs((tp - entry) / (entry - sl)),
    regimeH4: body.regimeH4 || null,
    biasH1: body.biasH1 || null,
    bosM15: Boolean(body.bosM15),
    confirmedM5: Boolean(body.confirmedM5),
    atrRatio: Number(body.atrRatio) || null,
    session: body.session ?? true,
    timestamp: new Date().toISOString()
  };
}

app.get('/health', (_req, res) => res.json({ ok: true, mode: state.mode, uptime: Date.now() - startedAt }));
app.get('/api/state', (_req, res) => res.json(state));
app.get('/api/signals', (_req, res) => res.json({ data: state.signal ? [state.signal] : [] }));
app.get('/api/trades', (_req, res) => res.json({ data: state.history }));

app.post('/webhook/tradingview', (req, res) => {
  if (WEBHOOK_SECRET && req.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  try {
    const signal = normalizeSignal(req.body);
    state.signal = signal;
    state.updatedAt = signal.timestamp;
    broadcast({ type: 'signal', data: signal });
    return res.status(202).json({ ok: true, signal });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
});

app.post('/api/market', (req, res) => {
  const price = Number(req.body.price);
  if (!Number.isFinite(price)) return res.status(400).json({ ok: false, error: 'price required' });
  state.price = price;
  state.updatedAt = new Date().toISOString();
  broadcast({ type: 'market', data: { symbol: state.symbol, price, timestamp: state.updatedAt } });
  res.json({ ok: true });
});

app.post('/api/trades', (req, res) => {
  const trade = { id: `TRD-${Date.now()}`, ...req.body, timestamp: new Date().toISOString() };
  state.history.unshift(trade);
  state.history = state.history.slice(0, 500);
  broadcast({ type: 'trade', data: trade });
  res.status(201).json({ ok: true, trade });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', socket => socket.send(JSON.stringify({ type: 'state', data: state })));

server.listen(PORT, () => console.log(`Live terminal backend listening on ${PORT}`));
