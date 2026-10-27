// A page whose main thread is stuck (0.39.5): closing its tab, and the sleep sweep, must not wait on it forever.
const http=require('node:http');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const hang='<!doctype html><title>Stuck</title><script>setTimeout(()=>{for(;;){}},300)</script>';
exports.run=async({app,makeTab,sleepTab,tabs,action})=>{
 const server=http.createServer((_q,res)=>{res.setHeader('Content-Type','text/html');res.end(hang);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://stuck.localhost:'+server.address().port+'/';
 const result={};const limit=(work,ms)=>Promise.race([work.then(()=>'done'),wait(ms).then(()=>'stuck')]);
 const open=async()=>{const t=makeTab(url);const d=Date.now()+15000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await wait(50);await wait(1200);return t;};
 let t=await open();makeTab('about:blank');t.lastUsed=0;let start=Date.now();
 result.sleep=await limit(sleepTab(t,true),10000);result.sleepMs=Date.now()-start;
 start=Date.now();result.close=await limit(action('close',t.id),10000);result.closeMs=Date.now()-start;result.closed=!tabs.includes(t);
 console.log('HUNG '+JSON.stringify(result));server.close();
 app.exit(result.sleep==='done'&&result.close==='done'&&result.closed?0:1);
};
