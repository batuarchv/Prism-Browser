const reportDir=require('node:path').resolve(__dirname,'../reports');require('node:fs').mkdirSync(reportDir,{recursive:true});
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {BrowserWindow}=require('electron');const {installExtension}=require('electron-chrome-web-store');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,snapshot})=>{
 const watchdog=setTimeout(()=>{console.log('Store test timed out');app.exit(1);},60000);
 const server=require('node:http').createServer((_q,r)=>r.end('<html><head><title>Extension test</title></head><body style="background:white;color:black"><h1>Prism extension test</h1></body></html>'));await new Promise(r=>server.listen(0,'127.0.0.1',r));const tab=makeTab('http://127.0.0.1:'+server.address().port+'/');const ses=tab.view.webContents.session;
 ses.serviceWorkers.on('console-message',(_event,details)=>{if(details.level===3)console.log('Worker diagnostic:',JSON.stringify(details));});
 const folder=path.join(app.getPath('userData'),'store-extensions');
 for(const id of ['eimadpbcbfnmbkopoojfekhnkhdbieeh','pejdijmoenmkgeppbflobdenhhabjlaj']){
  console.log('Installing',id);await installExtension(id,{session:ses,extensionsPath:folder});const ext=ses.extensions.getExtension(id);assert.ok(ext);assert.ok(snapshot().extensions.some(e=>e.id===id));
  console.log('Loaded',id);const popup=ext.manifest.action?.default_popup||ext.manifest.browser_action?.default_popup;assert.ok(popup);
  const probe=new BrowserWindow({show:true,width:500,height:600,webPreferences:{session:ses,disableDialogs:true,sandbox:true,contextIsolation:true,nodeIntegration:false}});probe.webContents.on('console-message',(_e,level,message)=>console.log('Popup diagnostic:',message));console.log('Opening popup',id);await probe.loadURL(new URL(popup,ext.url.endsWith('/')?ext.url:ext.url+'/').href);await delay(4500);
  if(id==='pejdijmoenmkgeppbflobdenhhabjlaj')console.log('Apple runtime API:',await probe.webContents.executeJavaScript("(()=>{try{chrome.runtime.onMessage.addListener(()=>{});return 'available';}catch(e){return String(e);}})()"));const text=await Promise.race([probe.webContents.executeJavaScript('document.body.innerText'),delay(5000).then(()=>{throw Error('Popup script timed out');})]);fs.writeFileSync(path.join(reportDir,id==='pejdijmoenmkgeppbflobdenhhabjlaj'?'apple-passwords-test.png':'store-extension-test.png'),(await probe.webContents.capturePage()).toPNG());
  console.log(JSON.stringify({name:ext.name,id,version:ext.version,popupText:text.slice(0,2000),nativeMessaging:ext.manifest.permissions?.includes('nativeMessaging')}));
  if(id==='eimadpbcbfnmbkopoojfekhnkhdbieeh'){assert.match(text,/Brightness/);tab.view.webContents.reload();let applied=false;for(let n=0;n<20;n++){await delay(500);applied=await tab.view.webContents.executeJavaScript("!!document.querySelector('style.darkreader')");if(applied)break;}assert.ok(applied,'Dark Reader applies styles to the local page');console.log('Dark Reader content styling:',applied);if(!applied)console.log('Page diagnostic:',await tab.view.webContents.executeJavaScript("JSON.stringify({url:location.href,title:document.title,html:document.documentElement.outerHTML.slice(0,200)})"));}probe.close();
 }
 await win.webContents.executeJavaScript("openPanel('extensions')");await delay(500);fs.writeFileSync(path.join(reportDir,'extensions-preview.png'),(await win.webContents.capturePage()).toPNG());
 console.log('Official store packages downloaded, loaded, registered and popups rendered.');clearTimeout(watchdog);server.close();app.exit(0);
};
