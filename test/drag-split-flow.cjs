// 0.31.0: popover toggling, keyboard focus return, tab drag-to-reorder and drag-to-split (PRISM_TEST_FLOW=drag-split-flow.cjs).
const http=require('node:http'),assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,tabs,toolWindows,snapshot})=>{let server;try{
 server=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end('<title>Site '+q.url+'</title><h1>'+q.url+'</h1>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 for(const p of ['/a','/b','/c'])makeTab(base+p);await wait(1500);const wc=win.webContents,js=code=>wc.executeJavaScript(code);
 const click=async(x,y)=>{for(const type of ['mouseDown','mouseUp'])wc.sendInputEvent({type,x,y,button:'left',clickCount:1});await wait(500);};
 const key=(target,k)=>{target.sendInputEvent({type:'keyDown',keyCode:k});if(k==='Enter')target.sendInputEvent({type:'char',keyCode:'\r'});target.sendInputEvent({type:'keyUp',keyCode:k});};
 const b=JSON.parse(await js("JSON.stringify(document.getElementById('space-button').getBoundingClientRect())"));
 await click(b.x+40,b.y+b.height/2);await wait(500);assert(toolWindows.visible(),'spaces popover opens');
 await click(b.x+40,b.y+b.height/2);assert(!toolWindows.visible(),'clicking the space button again closes it');
 await click(b.x+40,b.y+b.height/2);await wait(400);wc.focus();await wait(300);assert(!toolWindows.visible(),'focus moving to the window closes it');await wait(500);console.log('ok - popover toggles and closes on outside focus');
 await js("document.getElementById('space-button').focus()");key(wc,'Enter');await wait(800);assert.equal(await js("document.getElementById('space-button').getAttribute('aria-expanded')"),'true');
 key(toolWindows.get().webContents,'Escape');await wait(600);assert.equal(await js('document.activeElement.id'),'space-button','Esc returns focus to the button');console.log('ok - keyboard open, aria-expanded, Esc returns focus');
 const rows=async()=>JSON.parse(await js("JSON.stringify([...document.querySelectorAll('#tabs > .tab')].map(e=>{const r=e.getBoundingClientRect();return {id:+e.dataset.tabId,x:r.x,y:r.y,h:r.height,text:e.textContent}}))"));
 const drag=async(from,points)=>{wc.sendInputEvent({type:'mouseDown',x:from.x,y:from.y,button:'left',clickCount:1});for(const p of points){wc.sendInputEvent({type:'mouseMove',x:p[0],y:p[1],button:'left',modifiers:['leftButtonDown']});await wait(35);}await wait(500);const last=points.at(-1);wc.sendInputEvent({type:'mouseUp',x:last[0],y:last[1],button:'left',clickCount:1});await wait(900);};
 let r=await rows();const a=r.find(x=>x.text.includes('/a')),c=r.find(x=>x.text.includes('/c'));const sx=a.x+60,sy=a.y+a.h/2;
 await drag({x:sx,y:sy},Array.from({length:10},(_,i)=>[sx,sy+(c.y-a.y+8)*(i+1)/10]));
 const order=tabs.filter(t=>t.url?.startsWith(base)).map(t=>new URL(t.url).pathname);assert.deepEqual(order,['/b','/c','/a'],'dragging /a below /c reorders');console.log('ok - drag to reorder');
 r=await rows();const bRow=r.find(x=>x.text.includes('/b'));const [w,h]=win.getContentSize(),bx=bRow.x+60,by=bRow.y+bRow.h/2;
 await drag({x:bx,y:by},[...Array.from({length:12},(_,i)=>[bx+(w-120-bx)*(i+1)/12,by+(h/2-by)*(i+1)/12]),[w-100,h/2]]);
 const split=snapshot().split,bTab=tabs.find(t=>t.url===base+'/b');assert(split&&split.mode==='vertical'&&split.ids[1]===bTab.id,'dropping on the right opens it on the right');console.log('ok - drag onto the page opens split view');
 console.log(JSON.stringify({passed:true}));server.close();app.exit(0);
}catch(e){console.error('FAILED',e);server?.close();app.exit(1);}};
