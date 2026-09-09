# XAUUSD Live Market Analysis

The GitHub Pages frontend is now an honest market-analysis UI: it does **not** generate random prices and it does not label simulated data as LIVE.

## Architecture

`OANDA v20 / provider adapter -> Market service -> incremental candles -> indicator engine -> multi-timeframe signal engine -> WebSocket -> Lightweight Charts UI`

TradingView Lightweight Charts is used only as the charting engine. It does not provide market data itself, so the server-side provider is responsible for historical OHLC and realtime pricing. TradingView documents this datafeed separation and realtime subscription model. 

## Current provider

The first real provider adapter is OANDA v20 for `XAU_USD`. OANDA documents REST historical candles and an account pricing stream, with separate practice and live endpoints. Credentials remain server-side.

Set `server/.env` from `.env.example`:

- `OANDA_ENABLED=true`
- `OANDA_ENV=practice` for testing, or `live` for a production account
- `OANDA_ACCOUNT_ID=...`
- `OANDA_TOKEN=...`
- `TRADINGVIEW_WEBHOOK_SECRET=...`
- `STALE_MS=5000`

If the provider is not configured, the frontend deliberately shows `NO LIVE DATA SOURCE` / `DISCONNECTED`.

## Frontend deployment

The Pages site can point at a deployed backend by changing `window.MARKET_API_BASE` and `window.MARKET_WS_BASE` in `index.html`. Do not put OANDA tokens or webhook secrets in the frontend.

## Backend

```bash
cd server
npm install
npm run check
npm test
npm start
```

WebSocket endpoint: `/ws`
Health: `/health`
State: `/api/state`
Candles: `/api/candles?timeframe=M5`
Webhook: `POST /webhook/tradingview`

## Honest status

- LIVE chart: **implemented, requires deployed backend + valid provider credentials**
- Simulated LIVE: **removed**
- Historical candles: **implemented through provider adapter**
- Incremental candle updates: **implemented**
- Connection/stale states: **implemented**
- Data quality monitor: **implemented**
- Modular indicators: **implemented (EMA/ATR/RSI primitives)**
- Multi-timeframe signal engine: **implemented as deterministic baseline**
- Paper trading: **UI retained as secondary module; execution engine is not yet wired to persistence**
- Backtest: **schema/UI placeholder; deterministic engine still to be completed**
- Webhook validation/deduplication: **implemented**
- Persistent database: **schema prepared; runtime persistence still to be wired**

No production-live claim is made until a real provider backend is deployed and observed receiving real ticks.
