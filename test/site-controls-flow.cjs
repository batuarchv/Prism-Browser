// 0.28 site controls in the running app (smoke profile, local page): a permission row appears only after the site
// asks; Allow/Ask/Block per site; per-site zoom survives a reload; Erase hides similar elements (⌥-click), stays hidden
// after a reload and Restore brings them back; the popover renders under the site icon.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({win,action,makeTab,selectTab,settings,toolWindows})=>{
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(`<!doctype html><title>site</title><body style="margin:0;font:16px sans-serif">
  <div id="keep" style="height:80px">Keep</div>${Array.from({length:5},(_,i)=>`<div class="promo" style="height:60px;margin:8px;background:#fc0">Promo ${i}</div>`).join('')}</body>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const site=`http://localhost:${server.address().port}`;
 const loaded=async t=>{await eventually(()=>!t.loading&&t.view?.webContents.getURL(),'page load');await delay(400);};
 try{
  const t=makeTab(site+'/');selectTab(t.id);await loaded(t);const wc=t.view.webContents;
  assert.deepEqual((await action('site-info')).permissions,[],'no permission rows before the site asks');
  await wc.executeJavaScript('Notification.requestPermission()',true);
  await eventually(async()=>(await action('site-info')).permissions.some(p=>p.permission==='notifications'),'row appears after the site asks');
  let info=await action('site-permission',{permission:'notifications',decision:'allow'});assert.equal(info.permissions.find(p=>p.permission==='notifications').decision,'allow');
  // Picture in Picture: the row appears once the page tries it; blocked, the page is refused.
  const pip=`(()=>{const v=document.createElement('video');document.body.append(v);return v.requestPictureInPicture().then(()=>'ok',e=>e.name+':'+e.message)})()`;
  await wc.executeJavaScript(pip,true);await eventually(async()=>(await action('site-info')).permissions.some(p=>p.permission==='pip'),'Picture in Picture row appears after the page tries it');
  await action('site-permission',{permission:'pip',decision:'block'});assert.match(await wc.executeJavaScript(pip,true),/turned off for this site/);
  // Zoom, remembered for the site.
  info=await action('site-zoom',{direction:1});assert.equal(info.zoom,110);wc.reload();await loaded(t);
  await eventually(()=>Math.abs(wc.getZoomFactor()-1.1)<.01,'zoom kept after reload');assert.equal(settings.siteZoom[site],1.1);
  info=await action('site-zoom',{direction:0});assert.equal(info.zoom,100);assert.equal(settings.siteZoom[site],undefined);
  // Erase: ⌥-click on one promo hides all five; Esc ends the mode.
  const erasing=action('site-erase');await delay(500);
  const r=await wc.executeJavaScript(`(()=>{const b=document.querySelector('.promo').getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
  wc.debugger.attach('1.3');try{
   await wc.debugger.sendCommand('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x,y:r.y,modifiers:1});await delay(150);
   const shown=await wc.executeJavaScriptInIsolatedWorld(998,[{code:'1'}]);void shown;
   for(const type of ['mousePressed','mouseReleased'])await wc.debugger.sendCommand('Input.dispatchMouseEvent',{type,x:r.x,y:r.y,button:'left',clickCount:1,modifiers:1});await delay(200);
   for(const type of ['keyDown','keyUp'])await wc.debugger.sendCommand('Input.dispatchKeyEvent',{type,key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  }finally{wc.debugger.detach();}
  info=await erasing;assert.ok(info.hidden>=1,'hidden selector saved');
  const visible=()=>wc.executeJavaScript(`[...document.querySelectorAll('.promo')].filter(e=>getComputedStyle(e).display!=='none').length+':'+getComputedStyle(document.getElementById('keep')).display`);
  assert.equal(await visible(),'0:block','all similar promos hidden, the rest kept');
  wc.reload();await loaded(t);await eventually(async()=>await visible()==='0:block','still hidden after reload');
  info=await action('site-erase-restore');await loaded(t);await eventually(async()=>(await visible()).startsWith('5:'),'restored');
  // The popover itself.
  await win.webContents.executeJavaScript(`openPanel('quick-site')`);await eventually(async()=>toolWindows.visible()&&toolWindows.section()==='quick-site'&&!toolWindows.get().webContents.isLoading()&&await toolWindows.get().webContents.executeJavaScript(`document.querySelectorAll('[data-pane=site] .site-row').length>=3`),'popover rendered');
  await delay(500);const dir=path.resolve(__dirname,'../reports/'+require('../package.json').version);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'site-controls.png'),(await toolWindows.get().webContents.capturePage()).toPNG());
  await action('site-permissions-reset');await win.webContents.executeJavaScript('closePanel()');
  return ['permission row appears after the site asks','Picture in Picture shown after use, blockable','per-site permission decision','per-site zoom kept after reload','erase similar elements, kept after reload, restored','site controls popover'];
 }finally{server.close();}
};
