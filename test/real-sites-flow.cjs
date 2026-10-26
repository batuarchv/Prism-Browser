// Dev benchmark on real sites (needs the internet; PRISM_TEST_FLOW=real-sites-flow.cjs): eight sites as tabs, then the
// main process profiled for 10 s at idle, blocked requests per site, per-tab and per-process CPU and memory, and tab
// switch times. 0.33.1 used it to find Shield's slow rule lookups and CNN's retry loop; compare against an older build.
const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,selectTab,tabs})=>{
 const B=require('../src/blocker.cjs').Blocker.prototype,od=B.decide,reqs=new Map();let counting=false;B.decide=function(d,p){const r=od.call(this,d,p);if(counting){let h='?';try{h=new URL(d.webContents?.getURL()||'').hostname}catch{};const k=h+' '+(r.cancel?'block':r.redirectURL?'redir':'ok');reqs.set(k,(reqs.get(k)||0)+1);}return r;};
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 const sites=['https://www.youtube.com/','https://x.com/explore','https://www.theverge.com/','https://www.cnn.com/','https://www.reddit.com/','https://www.bbc.com/news','https://github.com/trending','https://en.wikipedia.org/wiki/Prism'];
 const metrics=()=>app.getAppMetrics();const t0=performance.now();const opened=[];
 for(const url of sites){const t=makeTab(url,true);opened.push(t);await wait(2500);}
 await wait(8000);
 // Idle CPU over 10 s with all tabs open, the last one in front; the main process is profiled meanwhile.
 const inspector=require('node:inspector');const session=new inspector.Session();session.connect();const post=(m,p)=>new Promise((res,rej)=>session.post(m,p||{},(e,r)=>e?rej(e):res(r)));
 await post('Profiler.enable');await post('Profiler.start');metrics();counting=true;await wait(10000);counting=false;const idle=metrics();
 console.log('REQS idle 10s',JSON.stringify([...reqs].sort((a,b)=>b[1]-a[1]).slice(0,20)));
 const pidUrl=new Map(tabs.filter(t=>t.view).map(t=>[t.view.webContents.getOSProcessId(),t.url]));console.log('TABCPU',JSON.stringify(idle.filter(p=>pidUrl.has(p.pid)).map(p=>[pidUrl.get(p.pid).slice(8,40),+p.cpu.percentCPUUsage.toFixed(1)])));const {profile}=await post('Profiler.stop');
 {const self=new Map();const byId=new Map(profile.nodes.map(n=>[n.id,n]));const dt=profile.timeDeltas;const total=dt.reduce((a,b)=>a+b,0);profile.samples.forEach((id,i)=>{const n=byId.get(id);const f=n.callFrame;const k=(f.functionName||'(anon)')+' '+f.url.split('/').slice(-1)[0]+':'+f.lineNumber;self.set(k,(self.get(k)||0)+(dt[i]||0));});
  console.log('PROFILE total ms',(total/1000).toFixed(0));console.log([...self].sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>(v/1000).toFixed(0)+'ms '+k).join('\n'));}
 const byType=list=>{const out={};for(const p of list){const k=p.type==='Tab'?(p.pid===win.webContents.getOSProcessId()?'shell':'tab'):p.type;out[k]=out[k]||{cpu:0,memMB:0};out[k].cpu+=p.cpu.percentCPUUsage;out[k].memMB+=p.memory.workingSetSize/1024;}for(const k in out){out[k].cpu=+out[k].cpu.toFixed(1);out[k].memMB=Math.round(out[k].memMB);}return out;};
 // Switching tabs: time until the shell has painted the new selection.
 const switches=[];metrics();for(let round=0;round<2;round++)for(const t of opened){const s=performance.now();selectTab(t.id);await win.webContents.executeJavaScript('new Promise(r=>{requestAnimationFrame(()=>requestAnimationFrame(r));setTimeout(r,300)})');switches.push(performance.now()-s);await wait(300);}
 const busy=metrics();switches.sort((a,b)=>a-b);
 console.log('REAL',JSON.stringify({idle:byType(idle),switching:byType(busy),switchMedianMs:+switches[switches.length>>1].toFixed(1),switchP90Ms:+switches[Math.floor(switches.length*.9)].toFixed(1),awake:tabs.filter(t=>t.view).length,totalMs:Math.round(performance.now()-t0)}));
 app.exit(0);};
