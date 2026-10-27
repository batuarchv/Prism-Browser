#!/usr/bin/env node
// Before/after table from scripts/perf-audit.cjs reports: `node scripts/perf-compare.cjs before1.json,before2.json after1.json,after2.json`.
// Several runs per side are merged by taking the median of every number, so one noisy run does not decide a result.
const fs=require('node:fs');
const [beforeArg,afterArg]=process.argv.slice(2);if(!beforeArg||!afterArg){console.error('usage: perf-compare.cjs <before.json[,…]> <after.json[,…]>');process.exit(1);}
const load=list=>list.split(',').map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
function merge(values){const nums=values.filter(v=>typeof v==='number');if(nums.length===values.length&&nums.length){const s=[...nums].sort((a,b)=>a-b);return s[s.length>>1];}
 if(values.every(v=>v&&typeof v==='object'&&!Array.isArray(v))){const out={};for(const k of new Set(values.flatMap(Object.keys)))out[k]=merge(values.map(v=>v[k]).filter(v=>v!==undefined));return out;}return values[0];}
const sampleMap=r=>Object.fromEntries((r.audit?.samples||[]).map(s=>[s.name,s]));
const side=list=>{const runs=load(list);return {n:runs.length,startup:merge(runs.map(r=>r.startup?.median).filter(Boolean)),idle:merge(runs.map(r=>r.audit?.idle).filter(Boolean)),interactions:merge(runs.map(r=>r.audit?.interactions).filter(Boolean)),samples:merge(runs.map(sampleMap)),real:merge(runs.map(r=>r.realSites).filter(r=>r&&!r.error))};};
const A=side(beforeArg),B=side(afterArg);
const fmt=v=>v===undefined||v===null?'–':typeof v==='number'?String(+v.toFixed(2)):String(v);
const delta=(a,b)=>typeof a==='number'&&typeof b==='number'&&a!==0?((b-a)/Math.abs(a)*100).toFixed(0)+'%':'';
const rows=[];const row=(name,a,b)=>rows.push(`| ${name} | ${fmt(a)} | ${fmt(b)} | ${delta(a,b)} |`);
const head=title=>rows.push('',`**${title}** (before: ${A.n} run${A.n>1?'s':''}, after: ${B.n} run${B.n>1?'s':''}, medians)`,'','| Measure | Before | After | Change |','|---|---:|---:|---:|');
if(A.startup&&B.startup){head('Startup, ms after launch');for(const k of Object.keys(A.startup))row(k,A.startup[k],B.startup[k]);}
for(const scenario of ['1-tab','10-tabs']){const a=A.idle?.[scenario],b=B.idle?.[scenario];if(!a||!b)continue;head(`Idle 60 s, ${scenario}`);
 for(const k of ['cpu','residentMiB','privateMiB','energy','wakeupsPerSec'])row('total '+k,a.total[k],b.total[k]);
 for(const g of [...new Set([...Object.keys(a.groups),...Object.keys(b.groups)])])for(const k of ['cpu','privateMiB','energy','wakeupsPerSec'])row(g+' '+k,a.groups[g]?.[k],b.groups[g]?.[k]);}
if(A.interactions&&B.interactions){head('Frames in the browser window (deltas between frames)');
 for(const [name,a] of Object.entries(A.interactions)){const b=B.interactions[name]||{};const pairs=name==='swipeBack'?[['page',a.page,b.page],['window',a.ui,b.ui]]:[['',a,b]];
  for(const [part,x,y] of pairs)if(x)for(const k of ['frames','p95','max','over8_3','over16_7'])row(`${name}${part?' '+part:''} ${k}`,x[k],y?.[k]);
  if(a.openMs)row(name+' open ms (first, warm)',a.openMs.join?a.openMs.join(' / '):a.openMs,b.openMs?.join?b.openMs.join(' / '):b.openMs);}}
head('Memory snapshots (resident MiB, all processes)');for(const k of Object.keys(A.samples||{}))row(k+' (awake '+fmt(A.samples[k].awake)+'/'+fmt(B.samples?.[k]?.awake)+')',A.samples[k].mib,B.samples?.[k]?.mib);
if(A.real&&B.real){head('Real sites (8 tabs, internet)');for(const k of ['idle','switching'])for(const g of Object.keys(A.real[k]||{}))for(const m of ['cpu','memMB'])row(`${k} ${g} ${m}`,A.real[k][g]?.[m],B.real[k]?.[g]?.[m]);row('tab switch median ms',A.real.switchMedianMs,B.real.switchMedianMs);row('tab switch p90 ms',A.real.switchP90Ms,B.real.switchP90Ms);}
console.log(rows.join('\n'));
