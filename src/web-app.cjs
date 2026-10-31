'use strict';
// Web apps in the Dock (0.45), the app side. A bundle made by web-apps.cjs starts Prism's code with its own
// Info.plist; main.cjs sees the PrismWebApp keys and hands over to run() here before anything else starts. The app is
// one site in one window: its own sign-ins (its own profile folder), Dock icon, badge and notifications. Links to
// other sites open in Prism; sign-in pages and popups stay in the app so logging in with Google or Apple works.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {readPlist}=require('./web-apps.cjs');
const BAR=38;
// The bundle's own Info.plist, or null when this is Prism itself.
function fromBundle(execPath=process.execPath){if(process.platform!=='darwin'&&!process.env.PRISM_WEB_APPS_ANY)return null;
 const info=readPlist(path.resolve(execPath,'..','..','Info.plist'));if(!info?.PrismWebAppID||!/^https?:\/\//i.test(info.PrismWebAppURL||''))return null;
 return {id:info.PrismWebAppID,name:info.PrismWebAppName||'Web App',url:info.PrismWebAppURL,host:info.PrismHostApp||'',data:info.PrismWebAppData||''};}
// Same site: the same registrable-looking domain (mail.google.com and google.com belong together).
const base=host=>String(host||'').replace(/^www\./,'').split('.').slice(-2).join('.');
function sameSite(a,b){try{return base(new URL(a).hostname)===base(new URL(b).hostname);}catch{return false;}}
const SIGN_IN=/(^|\.)(accounts|login|signin|auth|sso|id|oauth|appleid)\.|(^|\.)(okta|auth0|microsoftonline|onelogin)\.|\/(oauth2?|signin|login|sso|authorize)\b/i;
function signIn(url){try{const u=new URL(url);return SIGN_IN.test(u.hostname+u.pathname);}catch{return false;}}
function run(info){const {app,BaseWindow,WebContentsView,Menu,dialog,shell,session,nativeTheme,systemPreferences,ipcMain}=require('electron');
 const {execFile}=require('node:child_process');
 app.setName(info.name);
 app.userAgentFallback=app.userAgentFallback.replace(/ Electron\/\S+/,'').replace(/ Prism\/\S+/i,'');
 const data=info.data||path.join(app.getPath('appData'),'Prism Web Apps',info.id);app.setPath('userData',data);app.setPath('sessionData',data);
 if(!app.requestSingleInstanceLock()){app.quit();return;}
 const status=process.env.PRISM_WEB_APP_STATUS||'';const report=extra=>{if(status)try{fs.writeFileSync(status,JSON.stringify({name:app.getName(),id:info.id,userData:app.getPath('userData'),pid:process.pid,...extra}));}catch{}};
 const boundsFile=path.join(data,'window.json');const windows=new Set();
 // Links that leave the app open in Prism (in development, Prism is Electron.app and simply gets the link).
 function openInPrism(url){if(!/^https?:\/\//i.test(url))return;if(info.host&&fs.existsSync(info.host))execFile('open',['-a',info.host,url],error=>{if(error)shell.openExternal(url);});else shell.openExternal(url);}
 function permissions(ses){
  const ask=async(origin,what)=>{const {response}=await dialog.showMessageBox({type:'question',buttons:['Allow','Don’t Allow'],defaultId:0,cancelId:1,message:`Allow ${origin} to use your ${what}?`});return response===0;};
  ses.setPermissionRequestHandler(async(wc,permission,done,details)=>{let origin='';try{origin=new URL(details.requestingUrl||wc.getURL()).host;}catch{}
   if(['notifications','clipboard-sanitized-write','clipboard-read','fullscreen','pointerLock','keyboardLock','idle-detection','window-management'].includes(permission))return done(true);
   if(permission==='media'){const kinds=details.mediaTypes||[];const what=kinds.includes('video')&&kinds.includes('audio')?'camera and microphone':kinds.includes('video')?'camera':'microphone';if(!await ask(origin,what))return done(false);
    for(const kind of kinds){if(kind==='video'||kind==='audio'){try{if(!await systemPreferences.askForMediaAccess(kind==='video'?'camera':'microphone'))return done(false);}catch{}}}return done(true);}
   if(permission==='geolocation')return done(await ask(origin,'location'));done(false);});}
 function savedBounds(){try{const b=JSON.parse(fs.readFileSync(boundsFile,'utf8'));if([b.x,b.y,b.width,b.height].every(Number.isFinite))return b;}catch{}return {width:1200,height:820};}
 function newWindow(url=info.url,{child=false,features=null,opened=null}={}){
  const win=new BaseWindow({...(child?{width:features?.width||520,height:features?.height||680}:savedBounds()),minWidth:420,minHeight:300,titleBarStyle:'hiddenInset',trafficLightPosition:{x:14,y:13},show:false,title:info.name,backgroundColor:nativeTheme.shouldUseDarkColors?'#1e1e20':'#f6f6f7'});
  const bar=new WebContentsView({webPreferences:{preload:path.join(__dirname,'web-app-preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});
  // A popup's page is made by Chromium with its opener; the view takes it as given (sign-in answers its opener).
  const site=new WebContentsView(opened?{webContents:opened.webContents,webPreferences:opened.webPreferences}:{webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,session:session.defaultSession,spellcheck:true}});
  win.contentView.addChildView(site);win.contentView.addChildView(bar);
  const layout=()=>{const [w,h]=win.getContentSize();bar.setBounds({x:0,y:0,width:w,height:BAR});site.setBounds({x:0,y:BAR,width:w,height:Math.max(0,h-BAR)});};
  win.on('resize',layout);layout();const wc=site.webContents;win._prism={bar,site};windows.add(win);
  const send=()=>{if(bar.webContents.isDestroyed()||wc.isDestroyed())return;bar.webContents.send('web-app-state',{name:info.name,title:wc.getTitle()||info.name,url:wc.getURL(),back:wc.navigationHistory.canGoBack(),forward:wc.navigationHistory.canGoForward(),loading:wc.isLoading(),dark:nativeTheme.shouldUseDarkColors,away:!sameSite(wc.getURL(),info.url)});};
  for(const e of ['did-start-loading','did-stop-loading','did-navigate','did-navigate-in-page','page-title-updated'])wc.on(e,send);
  bar.webContents.on('did-finish-load',send);bar.webContents.loadFile(path.join(__dirname,'web-app-bar.html')).catch(()=>{});
  // Badge: the unread count many sites put in their title, "(3) Inbox".
  wc.on('page-title-updated',(_e,title)=>{win.setTitle(title||info.name);if(child)return;const n=/^\((\d+)\+?\)|\((\d+)\)\s*$/.exec(title||'');app.dock?.setBadge(n?String(n[1]||n[2]):'');});
  wc.on('will-navigate',(event,url)=>{if(!/^https?:/i.test(url))return;if(child||sameSite(url,info.url)||sameSite(url,wc.getURL())||signIn(url))return;event.preventDefault();openInPrism(url);});
  wc.setWindowOpenHandler(({url,disposition,features:raw})=>{if(!/^https?:|^about:blank/i.test(url))return {action:'deny'};
   // Popups (sign-in with Google, Apple, pay) stay with the app so they can answer the page.
   if(disposition==='new-window'||signIn(url)||url.startsWith('about:blank')){const f={};for(const part of String(raw||'').split(',')){const [k,v]=part.split('=');if(/^(width|height)$/.test(k?.trim()))f[k.trim()]=Math.max(300,Math.min(1600,+v||0));}
    return {action:'allow',createWindow:options=>{const popup=newWindow(null,{child:true,features:f,opened:options});return popup._prism.site.webContents;},outlivesOpener:false};}
   if(sameSite(url,info.url)){newWindow(url);return {action:'deny'};}openInPrism(url);return {action:'deny'};});
  wc.on('did-finish-load',()=>{if(!child)report({loaded:true,url:wc.getURL(),title:wc.getTitle(),windows:windows.size});});
  wc.on('render-process-gone',(_e,details)=>{if(details.reason!=='clean-exit')wc.reload();});
  const saveBounds=()=>{if(child||win.isDestroyed()||win.isFullScreen())return;try{fs.mkdirSync(data,{recursive:true});fs.writeFileSync(boundsFile,JSON.stringify(win.getNormalBounds()));}catch{}};
  let timer;win.on('move',()=>{clearTimeout(timer);timer=setTimeout(saveBounds,400);});win.on('resize',()=>{clearTimeout(timer);timer=setTimeout(saveBounds,400);});
  win.on('closed',()=>{windows.delete(win);saveBounds();for(const v of [bar,site])if(!v.webContents.isDestroyed())v.webContents.close();});
  wc.once('ready-to-show',()=>win.show());setTimeout(()=>{if(!win.isDestroyed()&&!win.isVisible())win.show();},1500);
  if(url)wc.loadURL(url).catch(()=>{});return win;}
 const focused=()=>[...windows].find(w=>w.isFocused())||[...windows].at(-1)||null;
 const site=()=>focused()?._prism?.site.webContents||null;
 ipcMain.on('web-app-command',(event,name)=>{const win=[...windows].find(w=>w._prism.bar.webContents===event.sender);const wc=win?._prism.site.webContents;if(!wc||wc.isDestroyed())return;
  if(name==='back'&&wc.navigationHistory.canGoBack())wc.navigationHistory.goBack();else if(name==='forward'&&wc.navigationHistory.canGoForward())wc.navigationHistory.goForward();
  else if(name==='reload')wc.isLoading()?wc.stop():wc.reload();else if(name==='home')wc.loadURL(info.url).catch(()=>{});else if(name==='prism')openInPrism(wc.getURL());});
 function menu(){const go=fn=>()=>{const wc=site();if(wc&&!wc.isDestroyed())fn(wc);};
  Menu.setApplicationMenu(Menu.buildFromTemplate([
   {label:info.name,submenu:[{role:'about'},{type:'separator'},{role:'services'},{type:'separator'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]},
   {label:'File',submenu:[{label:'New Window',accelerator:'CmdOrCtrl+N',click:()=>newWindow()},{label:'Open in Prism',accelerator:'CmdOrCtrl+Shift+O',click:go(wc=>openInPrism(wc.getURL()))},{label:'Copy Link',accelerator:'CmdOrCtrl+Shift+C',click:go(wc=>require('electron').clipboard.writeText(wc.getURL()))},{type:'separator'},{role:'close'}]},
   {role:'editMenu'},
   {label:'View',submenu:[{label:'Reload',accelerator:'CmdOrCtrl+R',click:go(wc=>wc.reload())},{label:'Back',accelerator:'CmdOrCtrl+[',click:go(wc=>wc.navigationHistory.canGoBack()&&wc.navigationHistory.goBack())},{label:'Forward',accelerator:'CmdOrCtrl+]',click:go(wc=>wc.navigationHistory.canGoForward()&&wc.navigationHistory.goForward())},{label:'Home',accelerator:'CmdOrCtrl+Shift+H',click:go(wc=>wc.loadURL(info.url))},{type:'separator'},
    {label:'Zoom In',accelerator:'CmdOrCtrl+=',click:go(wc=>wc.setZoomLevel(Math.min(5,wc.getZoomLevel()+.5)))},{label:'Zoom Out',accelerator:'CmdOrCtrl+-',click:go(wc=>wc.setZoomLevel(Math.max(-3,wc.getZoomLevel()-.5)))},{label:'Actual Size',accelerator:'CmdOrCtrl+0',click:go(wc=>wc.setZoomLevel(0))},{type:'separator'},{role:'togglefullscreen'}]},
   {role:'windowMenu'}]));}
 app.on('second-instance',()=>{const w=focused();if(w){if(w.isMinimized())w.restore();w.show();w.focus();}else newWindow();});
 app.on('activate',()=>{if(!windows.size)newWindow();});
 app.on('window-all-closed',()=>{if(status)app.quit();});
 app.on('open-url',(event,url)=>{event.preventDefault();if(sameSite(url,info.url))newWindow(url);else openInPrism(url);});
 app.whenReady().then(()=>{permissions(session.defaultSession);menu();newWindow();report({ready:true});
  if(status&&process.env.PRISM_WEB_APP_QUIT_AFTER)setTimeout(()=>app.quit(),+process.env.PRISM_WEB_APP_QUIT_AFTER||3000);});
 nativeTheme.on('updated',()=>{for(const w of windows)w._prism.bar.webContents.send('web-app-state',{dark:nativeTheme.shouldUseDarkColors});});}
module.exports={fromBundle,run,sameSite,signIn};
