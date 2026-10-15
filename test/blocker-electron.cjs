const {app,BrowserWindow,session}=require('electron');const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict'),path=require('node:path');
app.setPath('userData',path.join(app.getPath('temp'),'prism-blocker-test-'+process.pid));
const {Blocker}=require('../src/blocker.cjs');const {NetworkFilter,CosmeticFilter}=require('@ghostery/adblocker');
app.whenReady().then(async()=>{let server,w;try{
 let hits=0;server=http.createServer((req,res)=>{if(req.url==='/prism-test-ad.js'){hits++;res.setHeader('Content-Type','text/javascript');res.end('window.adBuffer=new Uint8Array(64*1024*1024);window.adBuffer.fill(17);');}else if(req.url==='/content.js'){res.setHeader('Content-Type','text/javascript');res.end('window.contentLoaded=true');}else{res.end('<!doctype html><div class="sponsor">Advertisement</div><h1>Useful content</h1><script src="/prism-test-ad.js"></script><script src="/content.js"></script>');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const before=process.memoryUsage(),start=performance.now(),b=new Blocker();const loadMs=performance.now()-start,after=process.memoryUsage();
 b.engine.update({newNetworkFilters:[NetworkFilter.parse('/prism-test-ad.js$script')],newCosmeticFilters:[CosmeticFilter.parse('127.0.0.1##.sponsor')]});
 const ses=session.fromPartition('blocker-test-'+process.pid);b.bind(ses);w=new BrowserWindow({show:false,webPreferences:{session:ses,sandbox:true,contextIsolation:true}});b.attach(w.webContents);
 async function measure(){await w.loadURL(url);await new Promise(r=>setTimeout(r,300));const data=await w.webContents.executeJavaScript('({content:!!window.contentLoaded,ad:!!window.adBuffer,hidden:getComputedStyle(document.querySelector(".sponsor")).display==="none"})');return {...data,memoryMiB:(app.getAppMetrics().find(p=>p.pid===w.webContents.getOSProcessId())?.memory.workingSetSize||0)/1024};}
 const blocked=await measure();assert.equal(hits,0);assert.equal(blocked.content,true);assert.equal(blocked.ad,false);assert.equal(blocked.hidden,true);assert.ok(b.snapshot(url,false,w.webContents.id).blocked>=1);
 b.toggleSite(url);const paused=await measure();assert.equal(hits,1);assert.equal(paused.ad,true);assert.equal(paused.hidden,false);
 b.toggleSite(url);const restored=await measure();assert.equal(hits,1);assert.equal(restored.ad,false);
 const report={passed:true,engineLoadMs:loadMs,engineHeapDeltaMiB:(after.heapUsed-before.heapUsed)/1048576,engineRSSDeltaMiB:(after.rss-before.rss)/1048576,blocked,paused,restored,note:'Synthetic local page with a 64 MiB ad script. Single-run process working set; not a real-world savings estimate.'};fs.writeFileSync(path.join(__dirname,'../reports/blocker-0.14.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }catch(e){console.error(e);process.exitCode=1;}finally{w?.destroy();server?.close();app.exit(process.exitCode||0);}});
