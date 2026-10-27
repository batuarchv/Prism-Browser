// Prism resource audit (PRISM_TEST_FLOW=perf-audit-flow.cjs; run the whole set with `node scripts/perf-audit.cjs <label>`).
// 0.31: a realistic multi-site fixture (10 sites with ad iframes), per-process memory and CPU.
// 0.40: one JSON with idle CPU and memory per process for 1 and 10 tabs over 60 s (Electron's metrics for CPU and
// resident memory, macOS `footprint` for private memory, `top` for Energy Impact and idle wakeups), frame times in the
// browser window while scrolling 50 tabs, switching spaces, opening Beam and Settings, and in the page while swiping
// back. PRISM_AUDIT_MODE=startup only records when each launch step happened (used against a saved one-tab session).
const fs=require('node:fs'),http=require('node:http'),{execFile}=require('node:child_process');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const page=(n,adHost)=>`<!doctype html><title>Site ${n}</title><style>.spin{width:40px;height:40px;background:#48f;animation:s 1s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style>
<h1>Site ${n}</h1><div class=spin></div><div id=feed></div><iframe src="http://${adHost}/frame" width=300 height=250></iframe>
<script>window.heap=[];for(let i=0;i<40000;i++)heap.push({i,s:'item '+i+' '+Math.random()});
const f=document.getElementById('feed');for(let i=0;i<3000;i++){const d=document.createElement('div');d.textContent='Row '+i;f.appendChild(d);}
let k=0;setInterval(()=>{k++;document.title='Site ${n} '+(k%10);},250);
requestAnimationFrame(function r(){k++;requestAnimationFrame(r);});</script>`;
const ad=`<!doctype html><body style="margin:0;background:#fe8"><canvas id=c width=300 height=250></canvas><script>const x=c.getContext('2d');let t=0;setInterval(()=>{t++;x.fillStyle='hsl('+t%360+',80%,60%)';x.fillRect(0,0,300,250);},50);window.a=new Uint8Array(4<<20).fill(1);</script>`;
// A quiet article (the front tab while idling): text, an image-sized block, no timers.
const article=n=>`<!doctype html><title>Article ${n}</title><body style="font:16px/1.5 -apple-system;max-width:680px;margin:40px auto"><h1>Article ${n}</h1>${'<p>Prism keeps the window light while you read. '.repeat(1)+Array.from({length:60},(_,i)=>'<p>Paragraph '+i+': '+'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(4)+'</p>').join('')}`;
const run=(file,args,ms=90000)=>new Promise(resolve=>execFile(file,args,{timeout:ms,maxBuffer:8<<20},(error,out)=>resolve(error&&!out?'':String(out))));
// `top` over `seconds`: the second sample's CPU % and Energy Impact ("POWER") cover the interval; idle wakeups are a
// running count (with a +/- mark), so the rate is the difference between the two samples.
async function topSample(pids,seconds){const out=await run('/usr/bin/top',['-l','2','-s',String(seconds),'-stats','pid,cpu,idlew,power',...pids.flatMap(p=>['-pid',String(p)])],(seconds+20)*1000);
 const parse=block=>{const rows={};for(const line of (block||'').split('\n')){const m=line.trim().match(/^(\d+)\s+([\d.]+)\s+(\d+)[+-]?\s+([\d.]+)/);if(m)rows[m[1]]={cpu:+m[2],idlew:+m[3],power:+m[4]};}return rows;};
 const blocks=out.split(/^PID\s+%CPU.*$/m),first=parse(blocks[1]),last=parse(blocks.at(-1));
 for(const [pid,row] of Object.entries(last))row.idlew=Math.max(0,row.idlew-(first[pid]?.idlew??row.idlew));return last;}
// Private memory as Activity Monitor counts it (phys_footprint), in MiB.
async function footprints(pids){const out=await run('/usr/bin/footprint',pids.map(String));const rows={};
 for(const m of out.matchAll(/\[(\d+)\]:.*?Footprint:\s*([\d.]+)\s*(KB|MB|GB)/g))rows[m[1]]=+m[2]*{KB:1/1024,MB:1,GB:1024}[m[3]];return rows;}
const stats=d=>{const s=[...d].sort((a,b)=>a-b),q=p=>s.length?+s[Math.min(s.length-1,Math.floor(s.length*p))].toFixed(1):0;
 return {frames:s.length,p50:q(.5),p95:q(.95),max:q(1),over8_3:s.filter(x=>x>8.8).length,over16_7:s.filter(x=>x>17.2).length,over33:s.filter(x=>x>33.8).length};};
const recorder=`(()=>{const r=window.__prismFrames={d:[],on:true,last:0};const loop=t=>{if(r.last)r.d.push(t-r.last);r.last=t;if(r.on)requestAnimationFrame(loop);};requestAnimationFrame(loop);return true;})()`;
async function frames(wcs,work){const live=wcs.filter(wc=>wc&&!wc.isDestroyed());await Promise.all(live.map(wc=>wc.executeJavaScript(recorder).catch(()=>{})));await wait(100);
 await work();const out=await Promise.all(live.map(wc=>wc.executeJavaScript('(()=>{const r=window.__prismFrames;if(!r)return [];r.on=false;return r.d;})()').catch(()=>[])));return out.map(stats);}
async function wheel(wc,x,y,list,key='deltaY',gap=16){const own=!wc.debugger.isAttached();if(own)wc.debugger.attach('1.3');
 try{for(const d of list){await wc.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mouseWheel',x,y,deltaX:key==='deltaX'?d:0,deltaY:key==='deltaY'?d:0});await wait(gap);}}finally{if(own)wc.debugger.detach();}}
exports.run=async({app,win,bootMarks,makeTab,selectTab,sleepTab,tabs,settings,toolWindows,action,commandBar,sessionStore})=>{
 const mode=process.env.PRISM_AUDIT_MODE||'full',reportFile=process.env.PRISM_AUDIT_REPORT||require('node:path').join(require('node:os').tmpdir(),'prism-audit.json');
 const stage=name=>console.log('STAGE '+name+' '+Math.round(performance.now()));
 if(mode==='seed'){const t=makeTab(process.env.PRISM_AUDIT_URL,true);const d=Date.now()+15000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await wait(50);await wait(500);sessionStore.flush();console.log('SEEDED '+t.url);app.exit(0);return;}
 if(mode==='startup'){const d=Date.now()+20000;while(!bootMarks['first-tab-load']&&Date.now()<d)await wait(20);
  const paints=await win.webContents.executeJavaScript('performance.getEntriesByType("paint").map(e=>({name:e.name,at:performance.timeOrigin+e.startTime}))').catch(()=>[]);
  const fcp=paints.find(p=>p.name==='first-contentful-paint')?.at,t0=Number(process.env.PRISM_LAUNCH_T0)||bootMarks.main,rel=v=>v?Math.round(v-t0):null;
  const out={launchToMain:rel(bootMarks.main),ready:rel(bootMarks.ready),window:rel(bootMarks.window),readyToShow:rel(bootMarks['ready-to-show']),shellLoaded:rel(bootMarks['shell-loaded']),sidebarFirstPaint:rel(fcp),shown:rel(bootMarks.shown),firstTabLoad:rel(bootMarks['first-tab-load'])};
  console.log('STARTUP '+JSON.stringify(out));app.exit(0);return;}
 // One local server; each fixture site is its own *.localhost name (Chromium resolves these to this Mac and keeps them
 // apart as sites, so each gets its own renderer as real sites do). macOS has no 127.0.0.2… addresses unless aliased.
 const servers=[];let port;
 const server=http.createServer((q,res)=>{const host=String(q.headers.host||'').split(':')[0];res.setHeader('Content-Type','text/html');res.end(q.url==='/frame'?ad:q.url.startsWith('/article')?article(q.url.slice(8)||'1'):page(host,'widgets.localhost:'+port));});
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});servers.push(server);port=server.address().port;
 const hosts=Array.from({length:10},(_,i)=>'site'+(i+1)+'.localhost:'+port),reader='reader.localhost:'+port;
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 app.focus?.({steal:true});win.focus();stage('setup');
 const {screen,BrowserWindow}=require('electron');const display=screen.getDisplayMatching(win.getBounds());
 function label(pid,type){if(type==='Browser')return 'main';if(type==='GPU')return 'gpu';if(win.webContents.getOSProcessId()===pid)return 'browser-ui';
  try{if(toolWindows.get()?.webContents.getOSProcessId()===pid)return 'tool-surface';}catch{}
  for(const t of tabs){try{if(t.view?.webContents.getOSProcessId()===pid)return 'tabs';}catch{}}
  for(const w of BrowserWindow.getAllWindows()){try{if(w!==win&&w.webContents.getOSProcessId()===pid)return 'surfaces';}catch{}}
  return type==='Tab'?'renderer-other':type.replace(/ /g,'').toLowerCase();}
 const report={version:require('../package.json').version,date:new Date().toISOString(),display:{hz:display.displayFrequency,scale:display.scaleFactor,size:display.size},env:{leanMemory:settings.leanMemory,sleepMinutes:settings.sleepMinutes,maxAwakeTabs:settings.maxAwakeTabs,hardwareAcceleration:settings.hardwareAcceleration},samples:[],idle:{},interactions:{}};
 async function sample(name,ms=6000){app.getAppMetrics();await wait(ms);const m=app.getAppMetrics();const groups={};let mem=0,cpu=0;
  for(const p of m){const g=label(p.pid,p.type);groups[g]??={n:0,mib:0,cpu:0};groups[g].n++;groups[g].mib+=p.memory.workingSetSize/1024;groups[g].cpu+=p.cpu.percentCPUUsage;mem+=p.memory.workingSetSize/1024;cpu+=p.cpu.percentCPUUsage;}
  for(const g of Object.values(groups)){g.mib=Math.round(g.mib);g.cpu=+g.cpu.toFixed(1);}
  const s={name,awake:tabs.filter(t=>t.view).length,processes:m.length,mib:Math.round(mem),cpu:+cpu.toFixed(1),groups};report.samples.push(s);console.log('SAMPLE '+JSON.stringify(s));return s;}
 // Idle for `seconds`: CPU % (Electron, averaged over the window), resident and private memory, Energy Impact and idle
 // wakeups per second (top), grouped by role: main, gpu, browser-ui, tabs, tool-surface, surfaces, network/utility.
 async function idle(name,seconds){stage('idle '+name);const before=app.getAppMetrics();const pids=before.map(p=>p.pid);
  const [top]=await Promise.all([topSample(pids,seconds),wait(seconds*1000)]);const m=app.getAppMetrics(),foot=await footprints(m.map(p=>p.pid));const groups={};
  for(const p of m){const g=label(p.pid,p.type),row=groups[g]??={n:0,cpu:0,residentMiB:0,privateMiB:0,energy:0,wakeupsPerSec:0};const tp=top[p.pid]||{};row.n++;row.cpu+=p.cpu.percentCPUUsage;row.residentMiB+=p.memory.workingSetSize/1024;row.privateMiB+=foot[p.pid]||0;row.energy+=tp.power||0;row.wakeupsPerSec+=(tp.idlew||0)/seconds;}
  const total={n:0,cpu:0,residentMiB:0,privateMiB:0,energy:0,wakeupsPerSec:0};
  for(const row of Object.values(groups)){for(const k in total)total[k]+=row[k];for(const k of ['cpu','energy','wakeupsPerSec'])row[k]=+row[k].toFixed(2);for(const k of ['residentMiB','privateMiB'])row[k]=Math.round(row[k]);}
  for(const k of ['cpu','energy','wakeupsPerSec'])total[k]=+total[k].toFixed(2);for(const k of ['residentMiB','privateMiB'])total[k]=Math.round(total[k]);
  const out={seconds,awake:tabs.filter(t=>t.view).length,tabs:tabs.length,total,groups};report.idle[name]=out;console.log('IDLE '+name+' '+JSON.stringify(out));return out;}
 const shell=win.webContents,[cw,ch]=win.getContentSize();
 // 1 tab: a quiet article in front, given time to settle (deferred startup work, favicon fetches).
 const front=makeTab('http://'+reader+'/article1',true);{const d=Date.now()+15000;while((front.loading||!front.view?.webContents.getURL())&&Date.now()<d)await wait(50);}
 await wait(8000);await idle('1-tab',Number(process.env.PRISM_AUDIT_IDLE_S)||60);
 // 10 tabs: the ten fixture sites (spinner, timers, rAF, an animated ad frame), each loaded, the article back in front.
 stage('open 10');for(const h of hosts){const t=makeTab('http://'+h+'/');const d=Date.now()+15000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await wait(50);}
 selectTab(front.id);await wait(5000);await idle('10-tabs',Number(process.env.PRISM_AUDIT_IDLE_S)||60);
 // Interactions: frame deltas in the browser window (and the page while swiping).
 stage('frames sidebar');for(let i=0;i<50;i++)makeTab('http://'+hosts[i%10]+'/?row='+i,false);await wait(1500);
 const sx=Math.round(Math.min(settings.sidebarWidth||260,300)/2),sy=Math.round(ch*.6);
 [report.interactions.sidebarScroll]=await frames([shell],async()=>{await wheel(shell,sx,sy,Array(40).fill(60));await wheel(shell,sx,sy,Array(40).fill(-60));await wait(300);});
 stage('frames spaces');const added=await action('space-add',{name:'Audit'});const home=settings.spaces[0].id;await action('space',home);await wait(800);
 [report.interactions.spaceSwitch]=await frames([shell],async()=>{for(let i=0;i<6;i++){await action('space',i%2?home:added.id);await wait(700);}});
 await action('space',home);await wait(500);selectTab(front.id);await wait(800);
 stage('frames beam');const beamOpen=[];
 [report.interactions.beamOpen]=await frames([shell],async()=>{for(let i=0;i<3;i++){const s=performance.now();await commandBar().open();beamOpen.push(Math.round(performance.now()-s));await wait(600);commandBar().hide();await wait(500);}});
 report.interactions.beamOpen.openMs=beamOpen;
 stage('frames settings');const settingsOpen=[];
 [report.interactions.settingsOpen]=await frames([shell],async()=>{for(let i=0;i<3;i++){const s=performance.now();await action('open-tool',{section:'appearance'});settingsOpen.push(Math.round(performance.now()-s));await wait(700);await action('close-tools');await wait(500);}});
 report.interactions.settingsOpen.openMs=settingsOpen;
 stage('frames swipe');{const wc=front.view.webContents;await wc.loadURL('http://'+reader+'/article2');await wait(800);const [w,h]=front.view.getBounds?[front.view.getBounds().width,front.view.getBounds().height]:[800,600];
  // A short swipe that does not go back (the page draws the arrow and lets it go), then a full one (the page is replaced).
  const [page]=await frames([wc],async()=>{await wheel(wc,Math.round(w/2),Math.round(h/2),Array(6).fill(-10),'deltaX');await wait(900);});
  const [ui]=await frames([shell],async()=>{await wheel(wc,Math.round(w/2),Math.round(h/2),Array(14).fill(-30),'deltaX');await wait(900);});
  report.interactions.swipeBack={page,ui,wentBack:/article1$/.test(wc.getURL())};}
 await sample('after-interactions',3000);
 // Hidden tabs should be hidden pages (throttled, not drawn); closed surfaces should be gone 25 s later.
 report.hiddenTabs=await Promise.all(tabs.filter(t=>t.view&&t!==front).map(t=>t.view.webContents.executeJavaScript('document.visibilityState').catch(()=>'?'))).then(v=>v.reduce((n,x)=>(n[x]=(n[x]||0)+1,n),{}));
 stage('surfaces idle');await wait(25000);await sample('surfaces-idle-25s',3000);
 // 0.31 samples: the sleep sweep and a manual sleep of everything but the front tab.
 for(const t of tabs)if(t!==front)t.lastUsed=Date.now()-10*60000;
 stage('sweep');await wait(32000);await sample('after-sweep');
 for(const t of [...tabs])if(t!==front)await sleepTab(t,true);await wait(2000);await sample('one-awake');
 fs.writeFileSync(reportFile,JSON.stringify(report,null,1));stage('done');
 for(const s of servers)s.close();app.exit(0);
};
