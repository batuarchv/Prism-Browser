// Prism resource audit: realistic multi-site fixture, per-process memory and CPU.
const fs=require('node:fs'),http=require('node:http');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const page=(n,adHost)=>`<!doctype html><title>Site ${n}</title><style>.spin{width:40px;height:40px;background:#48f;animation:s 1s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style>
<h1>Site ${n}</h1><div class=spin></div><div id=feed></div><iframe src="http://${adHost}/ad" width=300 height=250></iframe>
<script>window.heap=[];for(let i=0;i<40000;i++)heap.push({i,s:'item '+i+' '+Math.random()});
const f=document.getElementById('feed');for(let i=0;i<3000;i++){const d=document.createElement('div');d.textContent='Row '+i;f.appendChild(d);}
let k=0;setInterval(()=>{k++;document.title='Site ${n} '+(k%10);},250);
requestAnimationFrame(function r(){k++;requestAnimationFrame(r);});</script>`;
const ad=`<!doctype html><body style="margin:0;background:#fe8"><canvas id=c width=300 height=250></canvas><script>const x=c.getContext('2d');let t=0;setInterval(()=>{t++;x.fillStyle='hsl('+t%360+',80%,60%)';x.fillRect(0,0,300,250);},50);window.a=new Uint8Array(4<<20).fill(1);</script>`;
exports.run=async({app,win,makeTab,selectTab,sleepTab,tabs,settings,toolWindows})=>{
 const servers=[];
 async function serve(host){const s=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end(q.url==='/ad'?ad:page(host,'127.0.9.9:'+adPort));});await new Promise(r=>s.listen(host==='127.0.9.9'?adPort:0,host,r));servers.push(s);return host+':'+s.address().port;}
 const adPort=18000+Math.floor(Math.random()*1000);await serve('127.0.9.9');
 const hosts=[];for(let i=1;i<=10;i++)hosts.push(await serve('127.0.0.'+(i+1)));
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 function label(pid){if(win.webContents.getOSProcessId()===pid)return 'shell';for(const t of tabs){try{if(t.view?.webContents.getOSProcessId()===pid)return 'tab';}catch{}}return null;}
 const report={version:require('../package.json').version,env:{leanMemory:settings.leanMemory,sleepMinutes:settings.sleepMinutes,maxAwakeTabs:settings.maxAwakeTabs},samples:[]};
 async function sample(name,ms=6000){app.getAppMetrics();await wait(ms);const m=app.getAppMetrics();const groups={};let mem=0,cpu=0;
  for(const p of m){const g=(label(p.pid)||(p.type==='Tab'?'renderer-other':p.type)).replace(/ /g,'');groups[g]??={n:0,mib:0,cpu:0};groups[g].n++;groups[g].mib+=p.memory.workingSetSize/1024;groups[g].cpu+=p.cpu.percentCPUUsage;mem+=p.memory.workingSetSize/1024;cpu+=p.cpu.percentCPUUsage;}
  for(const g of Object.values(groups)){g.mib=Math.round(g.mib);g.cpu=+g.cpu.toFixed(1);}
  const s={name,awake:tabs.filter(t=>t.view).length,processes:m.length,mib:Math.round(mem),cpu:+cpu.toFixed(1),groups};report.samples.push(s);console.log('SAMPLE '+JSON.stringify(s));}
 await wait(3000);await sample('idle-shell');
 for(const h of hosts){const t=makeTab('http://'+h+'/');const d=Date.now()+15000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await wait(50);}
 await wait(2000);await sample('10-tabs-awake');
 await sample('10-tabs-awake-2');
 const active=tabs.find(t=>t.view&&t.id===tabs.at(-1).id);for(const t of tabs)if(t!==active)t.lastUsed=Date.now()-10*60000;
 // let the normal background sweep act (30s timer) rather than forcing it
 await wait(32000);await sample('after-sweep');
 for(const t of [...tabs])if(t!==active)await sleepTab(t,true);await wait(2000);await sample('one-awake');
 fs.writeFileSync(process.env.PRISM_AUDIT_REPORT||require('node:path').join(require('node:os').tmpdir(),'prism-audit.json'),JSON.stringify(report,null,1));
 for(const s of servers)s.close();app.exit(0);
};
