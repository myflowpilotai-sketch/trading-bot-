const signals=[
 {time:'19:25',date:'2026-09-09 19:25',dir:'LONG',entry:'2,650.42',sl:'2,644.17',tp:'2,662.92',rr:'2.0',result:'OPEN'},
 {time:'18:10',date:'2026-09-09 18:10',dir:'SHORT',entry:'2,648.30',sl:'2,654.10',tp:'2,636.70',rr:'2.0',result:'WIN'},
 {time:'15:45',date:'2026-09-09 15:45',dir:'LONG',entry:'2,641.90',sl:'2,635.80',tp:'2,654.10',rr:'2.0',result:'WIN'},
 {time:'13:20',date:'2026-09-09 13:20',dir:'SHORT',entry:'2,638.55',sl:'2,644.20',tp:'2,627.25',rr:'2.0',result:'LOSS'},
 {time:'10:05',date:'2026-09-09 10:05',dir:'LONG',entry:'2,632.80',sl:'2,627.00',tp:'2,644.40',rr:'2.0',result:'WIN'}
];

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function row(s){return `<tr><td>${s.time}</td><td class="${s.dir==='LONG'?'dir-long':'dir-short'}">${s.dir}</td><td>${s.entry}</td><td>${s.sl}</td><td>${s.tp}</td><td>1:${s.rr}</td><td class="${s.result==='OPEN'?'result-open':s.result==='WIN'?'result-win':'result-loss'}">${s.result}</td></tr>`}
function allRow(s){return `<tr><td>${s.date}</td><td class="${s.dir==='LONG'?'dir-long':'dir-short'}">${s.dir}</td><td>${s.entry}</td><td>${s.sl}</td><td>${s.tp}</td><td>1:${s.rr}</td><td>BULLISH</td><td>BULLISH</td><td>BOS</td><td>CONFIRMÉ</td><td class="${s.result==='OPEN'?'result-open':s.result==='WIN'?'result-win':'result-loss'}">${s.result}</td></tr>`}
$('#signalTable').innerHTML=signals.map(row).join('');
$('#allSignals').innerHTML=signals.map(allRow).join('');

$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
$$('[data-view-target]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewTarget)));
function showView(id){
  $$('.view').forEach(v=>v.classList.remove('active-view'));
  $(`#${id}`).classList.add('active-view');
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  if(id==='dashboard') setTimeout(()=>chart.resize($('#chart').clientWidth,500),20);
}

// Lightweight Charts: illustrative paper-trading visualization.
const chart=LightweightCharts.createChart($('#chart'),{
  layout:{background:{type:'solid',color:'#0b1622'},textColor:'#72899d'},
  grid:{vertLines:{color:'#142536'},horzLines:{color:'#142536'}},
  rightPriceScale:{borderColor:'#203447'},
  timeScale:{borderColor:'#203447',timeVisible:true,secondsVisible:false},
  crosshair:{mode:LightweightCharts.CrosshairMode.Normal}
});
const candles=chart.addCandlestickSeries({upColor:'#21d49a',downColor:'#ff6376',borderVisible:false,wickUpColor:'#21d49a',wickDownColor:'#ff6376'});
const now=Math.floor(Date.now()/1000)-60*5*80; let p=2640; const data=[];
for(let i=0;i<80;i++){const t=now+i*300;const drift=(Math.sin(i/8)*.55)+(Math.cos(i/15)*.28)+(.03);const open=p;const close=p+drift+(Math.random()-.5)*2.0;const high=Math.max(open,close)+Math.random()*1.7;const low=Math.min(open,close)-Math.random()*1.5;data.push({time:t,open:+open.toFixed(2),high:+high.toFixed(2),low:+low.toFixed(2),close:+close.toFixed(2)});p=close}
candles.setData(data);
const entryLine=candles.createPriceLine({price:2650.42,color:'#5fa9ff',lineWidth:1,lineStyle:2,axisLabelVisible:true,title:'ENTRY'});
const stopLine=candles.createPriceLine({price:2644.17,color:'#ff6376',lineWidth:1,lineStyle:2,axisLabelVisible:true,title:'SL'});
const targetLine=candles.createPriceLine({price:2662.92,color:'#21d49a',lineWidth:1,lineStyle:2,axisLabelVisible:true,title:'TP'});
const markers=data.slice(-5).map((d,i)=>({time:d.time,position:i===4?'belowBar':'aboveBar',color:i===4?'#21d49a':'#f3bd55',shape:i===4?'arrowUp':'circle',text:i===4?'LONG':'BOS'}));
candles.setMarkers(markers);
chart.timeScale().fitContent();
window.addEventListener('resize',()=>chart.resize($('#chart').clientWidth,$('#chart').clientHeight));

$('#refreshBtn').addEventListener('click',e=>{e.currentTarget.textContent='✓';setTimeout(()=>e.currentTarget.textContent='↻',800);});

// Demo ticker animation — intentionally not presented as a live broker feed.
setInterval(()=>{
  const base=2650.42+(Math.sin(Date.now()/13000)*1.9)+(Math.random()-.5)*.35;
  $('#price').textContent=base.toFixed(2);
  $('#pnl').textContent=`+$${(Math.max(0,(base-2649.2)*3.1)).toFixed(2)}`;
},2500);
