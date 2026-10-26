// 0.39.2 (PRISM_TEST_FLOW=tab-favorite-flow.cjs): dragging a tab onto Favorites makes it a favorite, and the + next to
// Close all tabs opens a new tab.
const assert=require('node:assert/strict'),fs=require('node:fs');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,snapshot,library})=>{const js=c=>win.webContents.executeJavaScript(c);
 try{await js('typeof finishSetup==="function"&&finishSetup()');}catch{}await wait(800);
 const t=makeTab('https://example.com/',true);await wait(2500);
 const before=snapshot().tabs.length;await js(`document.getElementById('section-new-tab').click()`);await wait(600);assert.equal(snapshot().tabs.length,before+1,'+ opens a new tab');
 const pts=await js(`(()=>{const row=document.querySelector('#tabs .tab[data-tab-id="${t.id}"]').getBoundingClientRect(),fav=document.getElementById('favorites').getBoundingClientRect();return {x:row.left+60,y:row.top+row.height/2,fx:fav.left+30,fy:fav.top+10}})()`);
 const send=(type,x,y)=>win.webContents.sendInputEvent({type,x:Math.round(x),y:Math.round(y),button:'left',clickCount:1});
 send('mouseDown',pts.x,pts.y);for(let i=1;i<=12;i++){send('mouseMove',pts.x,pts.y-i*4);await wait(16);}
 const ready=await js(`(()=>{const f=document.getElementById('favorites');const r=f.getBoundingClientRect();return {ready:f.classList.contains('tab-drop-ready'),x:r.left+30,y:r.top+20}})()`);
 for(let i=1;i<=10;i++){send('mouseMove',pts.x+(ready.x-pts.x)*i/10,pts.y-48+(ready.y-pts.y+48)*i/10);await wait(16);}await wait(200);
 fs.writeFileSync('/private/tmp/claude-501/tab-fav-drag.png',(await win.webContents.capturePage()).toPNG());
 send('mouseUp',ready.x,ready.y);await wait(800);
 const fav=library().bookmarks.find(b=>b.favorite&&b.url==='https://example.com/');assert.ok(ready.ready,'favorites shows a drop target');assert.ok(fav,'tab became a favorite');assert.equal(snapshot().tabs.find(x=>x.id===t.id)?.favoriteId,fav.id,'the tab is the favorite page');
 fs.writeFileSync('/private/tmp/claude-501/tab-fav-after.png',(await win.webContents.capturePage()).toPNG());
 console.log(JSON.stringify({ok:true}));if(process.env.PRISM_TEST_FLOW?.includes('tab-favorite'))app.exit(0);};
