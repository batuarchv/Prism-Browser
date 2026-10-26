// 0.27 trackpad gestures in the running app (smoke profile, local pages only): two-finger swipe back and forward,
// a page that scrolls sideways keeps its own swipe, swipe on the sidebar switches spaces, and Close all tabs with undo.
const assert=require('node:assert/strict'),http=require('node:http');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=6000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
// A trackpad swipe: a burst of trusted horizontal wheel events through the DevTools protocol (sendInputEvent does not
// reach WebContentsViews). DOM deltaX: negative is fingers moving right.
async function swipe(wc,x,y,deltaX,steps=14){await deltas(wc,x,y,Array(steps).fill(deltaX));}
async function deltas(wc,x,y,list){const own=!wc.debugger.isAttached();if(own)wc.debugger.attach('1.3');
 try{for(const deltaX of list){await wc.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mouseWheel',x,y,deltaX,deltaY:0});await delay(16);}}finally{if(own)wc.debugger.detach();}await delay(450);}
exports.run=async({win,action,snapshot,makeTab,selectTab,settings,setNaturalScroll})=>{
 const page=(title,body='')=>`<!doctype html><title>${title}</title><body style="margin:0;height:100vh">${body}</body>`;
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});
  const port=server.address().port;
  if(req.url==='/frame')return res.end(page('frame',`<iframe src="http://localhost:${port}/inner" style="position:fixed;inset:0;width:100vw;height:100vh;border:0"></iframe>`));
  if(req.url==='/inner')return res.end(page('inner','<div style="height:100vh;background:#fc0"></div>'));
  res.end(req.url==='/wide'?page('wide','<div id="w" style="overflow-x:auto;width:100vw;height:100vh"><div style="width:5000px;height:10px"></div></div>'):page(req.url.slice(1)));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const loaded=async t=>{await eventually(()=>!t.loading&&t.view?.webContents.getURL(),'page load');await delay(300);};
 try{
  await win.webContents.executeJavaScript("if(typeof onboardingOpen!=='undefined'&&onboardingOpen)document.getElementById('setup-skip').click()");await delay(400);
  const t=makeTab(base+'/one');await loaded(t);selectTab(t.id);const wc=t.view.webContents;
  await wc.loadURL(base+'/two');await loaded(t);
  const [w,h]=t.view.getBounds?[t.view.getBounds().width,t.view.getBounds().height]:[600,400];
  await swipe(wc,w/2,h/2,-30);
  await eventually(()=>wc.getURL().endsWith('/one'),'two-finger swipe right goes back');await loaded(t);
  await swipe(wc,w/2,h/2,30);
  await eventually(()=>wc.getURL().endsWith('/two'),'two-finger swipe left goes forward');await loaded(t);
  // Turned off in Settings, the same swipe does nothing.
  settings.trackpadGestures=false;await swipe(wc,w/2,h/2,-30);assert.ok(wc.getURL().endsWith('/two'),'gestures off');settings.trackpadGestures=true;
  // A sideways-scrolling page keeps the swipe for itself.
  await wc.loadURL(base+'/wide');await loaded(t);await wc.executeJavaScript(`document.getElementById('w').scrollLeft=1000`);
  await swipe(wc,w/2,h/2,-30);await delay(300);
  assert.ok(wc.getURL().endsWith('/wide'),'horizontal scroller is not hijacked');
  assert.ok(await wc.executeJavaScript(`document.getElementById('w').scrollLeft<1000`),'the page scrolled instead');
  // 0.39.3: a page that is all one cross-origin frame (a video, a map, an embedded app) still swipes back.
  await wc.loadURL(base+'/one');await loaded(t);await wc.loadURL(base+'/frame');await loaded(t);await delay(300);
  await swipe(wc,w/2,h/2,-30);
  await eventually(()=>wc.getURL().endsWith('/one'),'two-finger swipe back over an iframe');await loaded(t);
  // With natural scrolling off the wheel deltas flip, but fingers moving right still go back.
  setNaturalScroll(false);await wc.loadURL(base+'/two');await loaded(t);
  await swipe(wc,w/2,h/2,30);await eventually(()=>wc.getURL().endsWith('/one'),'swipe back with natural scrolling off');await loaded(t);
  setNaturalScroll(true);
  // One flick goes back one page: the momentum that arrives on the page it went back to does not go back again.
  for(const p of ['/a','/b','/c']){await wc.loadURL(base+p);await loaded(t);}
  await deltas(wc,w/2,h/2,[-3,-8,-16,-24,-30,-30,...Array.from({length:40},(_,i)=>-30*Math.pow(.92,i+1))]);
  await eventually(()=>wc.getURL().endsWith('/b'),'flick goes back once');await delay(1200);assert.ok(wc.getURL().endsWith('/b'),'and only once');
  // Swipe on the sidebar, as between macOS desktops: fingers left go to the next space, right come back.
  const start=snapshot().space;assert.equal(start,'personal');
  await swipe(win.webContents,120,400,30);await eventually(()=>snapshot().space==='work','sidebar swipe to the next space');
  await swipe(win.webContents,120,400,-30);await eventually(()=>snapshot().space==='personal','sidebar swipe back');
  // 0.39.3: the space changes even while the window can't animate (busy, hidden or covered). Before, the switch waited for a
  // slide-out animation, which a paused window never finished: the intermittent 'sidebar swipe to the next space'.
  // A paused animation stands in for that window here (a hidden window also stops taking input, so it can't be swiped).
  const pause=on=>win.webContents.executeJavaScript(on?`(()=>{const a=Element.prototype.animate;window.__animate=a;Element.prototype.animate=function(...x){const r=a.apply(this,x);if(this.matches('#sidebar .sidebar-scroll'))r.pause();return r;};})()`:`if(window.__animate)Element.prototype.animate=window.__animate;0`);
  await pause(true);
  try{await swipe(win.webContents,120,400,30);await eventually(()=>snapshot().space==='work','sidebar swipe while the window cannot animate');}
  finally{await pause(false);await delay(300);}
  await swipe(win.webContents,120,400,-30);await eventually(()=>snapshot().space==='personal','sidebar swipe back after showing');
  // Close all tabs keeps pinned tabs; undo reopens the rest.
  const extra=[makeTab(base+'/three'),makeTab(base+'/four')];for(const x of extra)await loaded(x);
  const open=()=>snapshot().tabs.filter(x=>!x.pinned&&!x.favoriteId&&x.url),urls=open().map(x=>x.url).sort();assert.ok(urls.length>=3);
  // Earlier smoke steps leave typed input in a tab, which (rightly) asks before closing; reload it to clear the draft.
  for(const row of snapshot().tabs.filter(x=>x.url?.endsWith('/draft'))){selectTab(row.id);const draft=require('electron').webContents.fromId(snapshot().activeWebContentsId);draft?.reload();await delay(600);}
  await win.webContents.executeJavaScript(`document.getElementById('close-all-tabs').click()`);
  await eventually(()=>open().length===0,'Close all tabs closed the unpinned tabs');
  // The new tab left behind shows only the live glass logo, the wordmark under it and the bar (0.39): no past sites.
  assert.equal(await win.webContents.executeJavaScript(`!!document.getElementById('home-closed')`),false,'no recently closed list on the new tab');
  await win.webContents.executeJavaScript(`typeof closePanel==='function'&&panel?closePanel():null`);await delay(400);
  const home=await win.webContents.executeJavaScript(`(()=>{const logo=document.querySelector('.welcome-logo').getBoundingClientRect(),word=document.querySelector('.welcome-wordmark').getBoundingClientRect(),page=document.getElementById('welcome').getBoundingClientRect();return {wordBelow:word.top>=logo.bottom-1,centred:Math.abs((logo.left+logo.right)/2-(page.left+page.right)/2)<2,shown:getComputedStyle(document.getElementById('welcome')).visibility==='visible'&&getComputedStyle(document.getElementById('welcome')).display!=='none',live:!!document.querySelector('#welcome canvas.glass-logo')}})()`);
  assert.deepEqual(home,{wordBelow:true,centred:true,shown:true,live:true});
  {await delay(1200);const dir=require('node:path').resolve(__dirname,'../reports/'+require('../package.json').version);require('node:fs').mkdirSync(dir,{recursive:true});require('node:fs').writeFileSync(require('node:path').join(dir,'new-tab.png'),(await win.webContents.capturePage()).toPNG());}
  await action('reopen');await eventually(()=>open().length===1,'a closed tab reopens');
  for(let i=1;i<urls.length;i++)await action('reopen');
  await eventually(()=>JSON.stringify(open().map(x=>x.url).sort())===JSON.stringify(urls),'⇧⌘T brought them back');
  return ['two-finger swipe back/forward','swipe respects horizontal scrollers and the setting','swipe over an iframe, with natural scrolling off, no double back','sidebar swipe switches spaces (also when the window cannot animate)','close all tabs with reopen','new tab: centred logo, wordmark and bar only'];
 }finally{server.close();}
};
// Run alone (PRISM_TEST_FLOW=gesture-flow.cjs), the flow reports and quits; repeat it to check for flakiness.
if(process.env.PRISM_TEST_FLOW?.includes('gesture-flow')){const run=exports.run;exports.run=async context=>{const app=require('electron').app;
 try{const checks=await run(context);console.log(JSON.stringify({ok:true,checks}));app.exit(0);}catch(error){console.error('GESTURE FAIL',error.message);app.exit(1);}};}
