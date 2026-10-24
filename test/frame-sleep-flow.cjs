const http=require('node:http'),assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,makeTab,sleepTab,tabs})=>{
 const inner=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end(q.url==='/form'?'<input id=i value="">':'<p>ad</p>');});await new Promise(r=>inner.listen(0,'127.0.0.7',r));const ip='127.0.0.7:'+inner.address().port;
 const outer=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end('<h1>x</h1><iframe src="http://'+ip+q.url+'"></iframe>');});await new Promise(r=>outer.listen(0,'127.0.0.8',r));const op='http://127.0.0.8:'+outer.address().port;
 const ad=makeTab(op+'/ad'),form=makeTab(op+'/form'),typed=makeTab(op+'/form');makeTab(op+'/ad');
 for(const t of tabs){const d=Date.now()+10000;while((t.loading||!t.view?.webContents.getURL())&&Date.now()<d)await wait(50);}await wait(800);
 const f=typed.view.webContents.mainFrame.framesInSubtree.find(x=>x!==typed.view.webContents.mainFrame);await f.executeJavaScript('i.value="hello"');
 const r=[await sleepTab(ad,true),await sleepTab(form,true),await sleepTab(typed,true)];console.log('FRAMESLEEP',JSON.stringify(r));
 assert.deepEqual(r,[true,true,false]);console.log('FRAMESLEEP ok');inner.close();outer.close();app.exit(0);};
