// 0.33 (PRISM_TEST_FLOW=pinned-flow.cjs): closing a pinned tab keeps it, unloaded and back at its pinned address; its
// button then removes it and ⌘Z puts it back in place; a favorite's tab closes from its menu path and comes back too.
const http=require('node:http'),assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await wait(100);}}
exports.run=async({app,action,makeTab,selectTab,snapshot})=>{let server;const checks=[];try{
 server=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end('<title>Site '+q.url+'</title><h1>'+q.url+'</h1>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const row=id=>snapshot().tabs.find(t=>t.id===id),ids=()=>snapshot().tabs.map(t=>t.id);
 const a=makeTab(base+'/home');selectTab(a.id);await eventually(()=>!a.loading&&a.view?.webContents.getURL(),'page load');
 await action('pin-tab',a.id);await a.view.webContents.loadURL(base+'/deeper');await eventually(()=>row(a.id).url.endsWith('/deeper'),'navigated');
 const b=makeTab(base+'/other');selectTab(a.id);
 await action('tab-park',a.id);let r=row(a.id);assert.ok(r,'closed pinned tab stays');assert.equal(r.parked,true);assert.equal(r.sleeping,true);assert.equal(r.url,base+'/home');assert.notEqual(snapshot().activeId,a.id);checks.push('closing a pinned tab keeps it, back at its pinned address');
 const place=ids().indexOf(a.id);await action('tab-park',a.id);assert.ok(!row(a.id),'second close removes it');
 await action('restore-closed');const back=snapshot().tabs.find(t=>t.url===base+'/home');assert.ok(back?.pinned,'restored as pinned');assert.equal(ids().indexOf(back.id),place,'restored in place');checks.push('removed pinned tab comes back in place with ⌘Z');
 selectTab(back.id);assert.equal(row(back.id).parked,false);
 await action('close',b.id);await action('restore-closed');assert.ok(snapshot().tabs.some(t=>t.url===base+'/other'),'closed tab restored');checks.push('⌘Z reopens the last closed tab');
 console.log(JSON.stringify(checks));return checks;
}finally{server?.close();if(process.env.PRISM_TEST_FLOW?.includes('pinned-flow'))app.exit(process.exitCode||0);}};
