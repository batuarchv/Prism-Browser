// 0.33 (PRISM_TEST_FLOW=pinned-flow.cjs): closing a pinned tab keeps it, unloaded and back at its pinned address; its
// button then removes it and ⌘Z puts it back in place; ⌘Z also reopens a closed tab; pointing at a sleeping tab wakes it.
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
 // 0.33.2: pointing at a sleeping tab wakes it in the background, without switching to it.
 await action('set-setting',{key:'leanMemory',value:false});// so a busy test Mac's memory pressure does not veto it
 const sleeper=makeTab(base+'/sleeper',false);assert.equal(row(sleeper.id).sleeping,true);const front=snapshot().activeId;await action('tab-warm',sleeper.id);assert.ok(sleeper.view,'woken');assert.equal(snapshot().activeId,front,'still on the same tab');await eventually(()=>!sleeper.view.webContents.isLoading(),'warm page loaded');checks.push('pointing at a sleeping tab wakes it in the background');
 // 0.35: a middle click on a link opens it in the background, right after the tab it came from.
 const linkPage=makeTab(base+'/links',true);await eventually(()=>!linkPage.loading&&linkPage.view?.webContents.getURL(),'link page');
 await linkPage.view.webContents.executeJavaScript(`document.body.innerHTML='<a id="l" href="/target" style="display:block;font-size:40px;padding:20px">Target</a>';1`);
 const box=await linkPage.view.webContents.executeJavaScript(`(()=>{const r=document.getElementById('l').getBoundingClientRect();return {x:Math.round(r.x+20),y:Math.round(r.y+20)}})()`);
 for(const type of ['mouseDown','mouseUp'])linkPage.view.webContents.sendInputEvent({type,x:box.x,y:box.y,button:'middle',clickCount:1});
 await eventually(()=>snapshot().tabs.some(t=>t.url.endsWith('/target')),'background tab opened');const bg=snapshot().tabs.find(t=>t.url.endsWith('/target'));
 assert.equal(snapshot().activeId,linkPage.id,'stayed on the page');assert.equal(ids().indexOf(bg.id),ids().indexOf(linkPage.id)+1,'right after its opener');assert.equal(bg.sleeping,false,'already loading');checks.push('middle click opens a link in the background next to its tab');
 console.log(JSON.stringify(checks));return checks;
}finally{server?.close();if(process.env.PRISM_TEST_FLOW?.includes('pinned-flow'))app.exit(process.exitCode||0);}};
