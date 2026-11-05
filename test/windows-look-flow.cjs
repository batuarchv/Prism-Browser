// Windows build check (Windows build, 0.50): a page, Settings → Appearance, Private and the command bar with the solid surfaces
// used off the Mac. HOLD=ms keeps each step up so a screenshot can be taken; the flow fails if Private can't load.
const assert=require('node:assert/strict'),http=require('node:http');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,action,snapshot,commandBar})=>{
 const hold=+(process.env.HOLD||0);const step=async name=>{console.log('STEP '+name);await wait(hold||800);};
 const server=http.createServer((_q,res)=>{res.setHeader('Content-Type','text/html');res.end('<title>Windows fixture</title><body style="font:16px system-ui;padding:40px"><h1>Prism on Windows</h1><p>Page content.</p>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`;
 const s=snapshot();console.log('GLASS',s.glass,'PANEL',s.panelGlass,'SOLID',s.system.reduceTransparency,'PLATFORM',s.system.platform);
 if(process.platform!=='darwin'){assert.equal(s.system.reduceTransparency,true);assert.equal(s.panelGlass,false);}
 const platform=await win.webContents.executeJavaScript('document.documentElement.dataset.platform');console.log('DATA-PLATFORM',platform);
 makeTab(url);await step('page');
 const hint=await win.webContents.executeJavaScript(`document.body.innerText.match(/(Ctrl|⌘)\\+?\\s?K/)?.[0]||''`);console.log('NEW TAB HINT',hint);
 await action('open-tool',{section:'appearance'});await step('settings');await action('close-tools');
 await action('space','private');const t=makeTab(url);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Private page did not load')),15000);t.view.webContents.once('did-finish-load',()=>{clearTimeout(timer);resolve();});});
 console.log('PRIVATE TITLE',t.view.webContents.getTitle(),'NETWORK',JSON.stringify(snapshot().privateNetwork));await step('private');await action('space','personal');
 await commandBar().open();await step('beam');
 await action('lens-window').catch(e=>console.log('LENS',e.message));await step('lens');
 server.close();console.log('WINDOWS LOOK OK');app.exit(0);};
