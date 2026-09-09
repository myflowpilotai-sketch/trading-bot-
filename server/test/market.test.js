import test from 'node:test';import assert from 'node:assert/strict';import {bucketStart,updateCandle,validateCandles} from '../market/candles.js';
test('M5 bucket is stable',()=>assert.equal(bucketStart(Date.UTC(2026,8,9,18,42,31),'M5'),Date.UTC(2026,8,9,18,40)));
test('tick updates current candle',()=>{const t={mid:3345,timestamp:'2026-09-09T18:42:31Z'};const c=updateCandle(null,t,'M5');const n=updateCandle(c,{mid:3346,timestamp:'2026-09-09T18:43:01Z'},'M5');assert.equal(n.close,3346);assert.equal(n.high,3346);});
test('quality rejects invalid OHLC',()=>assert.equal(validateCandles([{time:1,open:2,high:1,low:2,close:2,volume:1}]).ok,false));
