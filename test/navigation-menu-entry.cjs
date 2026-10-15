const Module=require('node:module'),original=Module._load;
process.argv.push('--smoke-test');Module._load=function(request){if(request==='../test/smoke.cjs'){Module._load=original;return {run};}return original.apply(this,arguments);};
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(check){const end=Date.now()+12000;while(!await check()){if(Date.now()>end)throw Error('Timed out');await delay(40);}}
async function run({app,win,action,snapshot,tabs,toolWindows,services}){
 const {Menu,clipboard,ClipboardItem}=require('electron');const savedClipboard=await Promise.all((await clipboard.read()).filter(item=>item.types.length).map(async item=>new ClipboardItem(Object.fromEntries(await Promise.all(item.types.map(async type=>[type,await item.getType(type)]))))));let menu;const popup=Menu.prototype.popup;Menu.prototype.popup=function(){menu=this;};
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>';
 let port,postBody='';const server=http.createServer((req,res)=>{
  if(req.url==='/image.svg'){res.setHeader('Content-Type','image/svg+xml');res.end(svg);return;}
  if(req.url==='/post'){req.on('data',chunk=>postBody+=chunk);}
  if(req.url==='/redirect'){res.writeHead(302,{Location:`http://localhost:${port}/destination`});res.end();return;}
  res.setHeader('Content-Type','text/html');res.end(`<title>Navigation fixture</title><img src="/image.svg"><p id="words">A useful phrase</p><input id="input" value="Editable text"><a id="same" href="/inside">Inside</a><a id="outside" href="http://localhost:${port}/destination">Outside</a><a id="redirect" href="/redirect">Redirect</a><form method="POST" action="http://localhost:${port}/post"><input name="sample" value="retained"><button id="submit">Submit</button></form>`);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));port=server.address().port;const home=`http://127.0.0.1:${port}/`;
 try{
  await win.webContents.executeJavaScript('finishSetup()');
  await action('save-bookmark',{id:'fixture-favorite',title:'Favorite fixture',url:home,favorite:true});
  await action('open-bookmark','fixture-favorite');let favorite=tabs.find(t=>t.favoriteId==='fixture-favorite');await until(()=>favorite.view&&!favorite.loading&&favorite.url===home);
  let wc=favorite.view.webContents;await until(()=>wc.executeJavaScript('document.images[0]?.complete'));
  wc.sendInputEvent({type:'mouseDown',button:'right',x:30,y:30,clickCount:1});wc.sendInputEvent({type:'mouseUp',button:'right',x:30,y:30,clickCount:1});await until(()=>menu?.items.some(x=>x.label==='Copy Image'));
  menu.items.find(x=>x.label==='Copy Image').click();await until(()=>clipboard.has('image/png'));
  await menu.items.find(x=>x.label==='Copy Image Address').click();assert.equal(await clipboard.readText(),home+'image.svg');
  await wc.executeJavaScript("const sel=getSelection();sel.selectAllChildren(document.getElementById('words'))");
  menu=null;wc.sendInputEvent({type:'mouseDown',button:'right',x:35,y:127,clickCount:1});wc.sendInputEvent({type:'mouseUp',button:'right',x:35,y:127,clickCount:1});await until(()=>menu?.items.some(x=>x.label?.startsWith('Search Google')));
  await wc.executeJavaScript("document.getElementById('same').click()");await until(()=>favorite.url===home+'inside'&&!favorite.loading);assert.equal(favorite.favoriteId,'fixture-favorite');
  const count=tabs.length;await wc.executeJavaScript("document.getElementById('outside').click()");await until(()=>favorite.url.includes('localhost')&&!favorite.loading);assert.equal(favorite.favoriteId,'fixture-favorite');assert.equal(tabs.length,count);
  await action('open-bookmark','fixture-favorite');assert.equal(snapshot().activeId,favorite.id);assert.equal(snapshot().bookmarks.find(b=>b.id==='fixture-favorite').url,home);
  const favoriteURL=favorite.url;await action('navigate',`http://localhost:${port}/typed`);const typed=tabs.find(t=>t.id===snapshot().activeId);await until(()=>typed.view&&!typed.loading);assert.notEqual(typed.id,favorite.id);assert.equal(favorite.url,favoriteURL);assert.equal(typed.favoriteId,undefined);
  await action('open-bookmark','fixture-favorite');assert.equal(snapshot().activeId,favorite.id);await action('navigate',favoriteURL);assert.equal(snapshot().activeId,favorite.id);
  await until(()=>!favorite.loading);await wc.executeJavaScript("document.getElementById('submit').click()");await until(()=>postBody.includes('sample=retained'));assert.equal(favorite.favoriteId,'fixture-favorite');
  const windowCount=require('electron').BrowserWindow.getAllWindows().length;
  await win.webContents.executeJavaScript("openPanel('appearance')");assert.equal(require('electron').BrowserWindow.getAllWindows().length,windowCount);assert.equal(await win.webContents.executeJavaScript("document.getElementById('panel-preview').hidden"),true);
  await win.webContents.executeJavaScript("act('set-setting',{key:'theme',value:'dark'})");assert.equal(snapshot().settings.theme,'dark');
  const extDir=path.join(app.getPath('userData'),'quick-extension');fs.mkdirSync(extDir);fs.writeFileSync(path.join(extDir,'manifest.json'),JSON.stringify({manifest_version:3,name:'Quick toggle fixture',version:'1.0'}));const installed=await services.installExtension(extDir,false);
  await win.webContents.executeJavaScript("openPanel('quick-extensions')");await until(()=>win.webContents.executeJavaScript("!!document.querySelector('#extension-list input')"));await win.webContents.executeJavaScript("document.querySelector('#extension-list input').click()");await until(()=>snapshot().extensions.find(e=>e.id===installed.id)?.enabled===false);
  await win.webContents.executeJavaScript("document.querySelector('#extension-list input').click()");await until(()=>snapshot().extensions.find(e=>e.id===installed.id)?.enabled===true);
  await new Promise(r=>setTimeout(r,200));fs.writeFileSync(path.join(__dirname,'../reports/quick-extensions-0.15.3.png'),(await win.webContents.capturePage()).toPNG());
  await win.webContents.executeJavaScript("openPanel('extensions')");assert.equal(await win.webContents.executeJavaScript("document.getElementById('preferences').dataset.mode"),'settings');
  await win.webContents.executeJavaScript("openPanel('quick-downloads')");assert.equal(await win.webContents.executeJavaScript("document.getElementById('preferences').dataset.mode"),'downloads');await win.webContents.executeJavaScript('closePanel()');assert.equal(favorite.view.getVisible(),true);assert.equal(await win.webContents.executeJavaScript("document.getElementById('panel-preview').hasAttribute('src')"),false);
  await win.webContents.executeJavaScript("document.activeElement.blur();dismissSuggestions()");
  await action('set-setting',{key:'reduceMotion',value:false});
  await action('save-bookmark',{id:'motion-fixture',title:'Animated favorite',url:home+'motion',favorite:true});
  await until(()=>win.webContents.executeJavaScript("!!document.querySelector('[data-favorite-id=motion-fixture]')"));
  await new Promise(r=>setTimeout(r,250));assert.equal(await win.webContents.executeJavaScript("document.querySelector('[data-favorite-id=motion-fixture]').getAnimations().length"),0,'animations release after finishing');
  await action('set-setting',{key:'reduceMotion',value:true});await action('save-bookmark',{id:'motion-fixture',title:'Animated favorite',url:home+'motion',favorite:false});
  await until(()=>win.webContents.executeJavaScript("!!document.querySelector('#bookmarks [data-favorite-id=motion-fixture]')"));assert.equal(await win.webContents.executeJavaScript("document.querySelector('#bookmarks [data-favorite-id=motion-fixture]').getAnimations().length"),0,'reduced motion suppresses bookmark movement');
  await win.webContents.executeJavaScript("showSetup();for(let i=0;i<4;i++)document.getElementById('setup-next').click()");assert.equal(await win.webContents.executeJavaScript("!!document.getElementById('setup-make-default')"),true);assert.equal((await action('make-default-browser')).available,false,'test cannot change the default browser');await win.webContents.executeJavaScript('finishSetup()');
  const report={passed:true,checks:['image and text context menus','site links remain in favorite tab','saved favorite URL unchanged','different typed URL opens a normal tab','same typed URL reuses favorite','POST remains in favorite','in-browser panels create no extra window','page snapshot released on close','quick extension toggles','compact downloads panel','animation cleanup and reduced motion','default-browser welcome step without system mutation']};fs.writeFileSync(path.join(__dirname,'../reports/navigation-menu-0.15.3.json'),JSON.stringify(report,null,2));console.log(report);
 }finally{Menu.prototype.popup=popup;server.close();await clipboard.write(savedClipboard);}
 app.exit(0);
}
require(process.env.PRISM_TEST_MAIN||'../src/main.cjs');
