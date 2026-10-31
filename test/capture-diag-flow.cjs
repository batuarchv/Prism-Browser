// Diagnostic (Electron upgrades): what capturePage returns for a tab view and the window.
const http=require('node:http');const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,selectTab})=>{
 const server=http.createServer((q,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end('<body style="background:#3a7bd5"><h1>Card</h1>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const t=makeTab('http://127.0.0.1:'+server.address().port+'/one');const d=Date.now()+10000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await delay(100);selectTab(t.id);win.show();win.focus();await delay(1500);
 const tryCap=async(label,wc)=>{for(let i=0;i<3;i++){try{const img=await wc.capturePage();console.log('CAP',label,i,'ok',JSON.stringify(img.getSize()),'empty',img.isEmpty());}catch(e){console.log('CAP',label,i,'error',e?.message||String(e),e?.name);}await delay(500);}};
 console.log('CAP visible',t.view._prismVisible,JSON.stringify(t.view.getBounds()),'winVisible',win.isVisible());
 await tryCap('tab',t.view.webContents);await tryCap('window',win.webContents);
 const b=t.view.getBounds();t.view.setBounds({...b,width:b.width-1});await delay(50);t.view.setBounds(b);await delay(300);await tryCap('tab-after-nudge',t.view.webContents);
 server.close();app.exit(0);
};
