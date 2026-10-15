const {cleanTitle,tidyOrder,splitBounds,normalizeProfile,pipScript}=require('./workspace.cjs');
const {createTabSelection}=require("./tab-selection.cjs");const tabSelection=createTabSelection();
const {budgetCandidates,createStateTransport}=require('./performance.cjs');
const {visit,closedTabs,cleanURL}=require('./browsing.cjs');
const {createPermissions}=require('./site-permissions.cjs');
const recentlyClosed=closedTabs();let permissions;
let find={open:false,query:'',matches:0,active:0,requestId:0};
const {autoUpdater, app, BrowserWindow, WebContentsView, ipcMain, session, Menu, dialog, safeStorage, nativeTheme, systemPreferences, shell, clipboard} = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const {normalizeAddress, canSleep} = require('./policy.cjs');
const {webURL,mergeBookmarks,bookmark}=require('./library.cjs');
const {renameFolder,removeFolder,folderNames}=require('./folders.cjs');
const {loadArc,arcKey,importSecrets}=require('./arc-import.cjs');
const {normalizeSettings,setting,moveBefore}=require('./settings.cjs');
const {ElectronChromeExtensions}=require('electron-chrome-extensions');
const {installChromeWebStore}=require('electron-chrome-web-store');
const {createPasswords}=require('./passwords.cjs');
const {createServices}=require('./services.cjs');
const {Blocker}=require('./blocker.cjs');let blocker;
const {PrivateNetwork}=require('./private-network.cjs');
const {SPACES,normalTabs,inSpace}=require('./spaces.cjs');
const {favoriteTab,opensNewFavoriteTab}=require('./favorite-tabs.cjs');
const {pageMenu}=require('./page-menu.cjs');
const {createSessionStore,captureSnapshot,navigationRecord,scrollRecord,url:recoveryURL}=require('./session-recovery.cjs');
const {bookmarkFile}=require('./browser-import.cjs');
const {randomUUID}=require('node:crypto');
const {commitWithUndo,restoreCheckpoint}=require('./import-checkpoint.cjs');
const {defaults:defaultTheme,validateTheme}=require('./theme-tokens.cjs');
const {defaultBrowserStatus,requestDefaultBrowser,externalURL}=require('./default-browser.cjs');
const {createUpdater}=require('./updater.cjs');
const {translate}=require('./locales.js');
let updater,localUpdater,installUpdateRequested=false;
let externalReady=false;const pendingExternal=[];
function receiveExternal(value){const assistant=require('./assistant-links.cjs').assistantAction(value);if(assistant){if(!externalReady){if(pendingExternal.length<20)pendingExternal.push(value);return;}if(assistant==='downloads')win.webContents.send('open-panel','quick-downloads');else if(assistant==='chatgpt')makeTab('https://chatgpt.com/',true,'personal');else makeTab('',true,'personal');win.show();win.focus();return;}const url=externalURL(value);if(!url)return;if(!externalReady){if(pendingExternal.length<20)pendingExternal.push(url);return;}makeTab(url,true,'personal');if(win.isMinimized())win.restore();win.show();win.focus();}
app.on('open-url',(event,url)=>{event.preventDefault();receiveExternal(url);});
const smoke = process.argv.includes('--smoke-test');
const restartTest=smoke&&/^[a-f0-9-]{36}$/.test(process.env.PRISM_TEST_RESTART_ID||'');
app.setName('Prism');
if(smoke&&process.env.PRISM_TEST_COMPATIBILITY==='1')app.commandLine.appendSwitch('use-fake-device-for-media-stream');
app.setPath('userData', path.join(smoke ? app.getPath('temp') : app.getPath('appData'), smoke ? (restartTest?'prism-restart-'+process.env.PRISM_TEST_RESTART_ID:'prism-smoke-' + process.pid) : 'Prism Prototype'));
const settingsFile=path.join(app.getPath('userData'),'settings.json');
let rawSettings={};try{rawSettings=JSON.parse(fs.readFileSync(settingsFile,'utf8'));}catch{}
if(smoke&&process.env.PRISM_TEST_HARDWARE_OFF==='1')rawSettings.hardwareAcceleration=false;
const settings=normalizeSettings(rawSettings);if(settings.leanMemory)app.commandLine.appendSwitch('disk-cache-size',String(128*1024*1024));if(smoke)settings.onboardingComplete=true;const launchHardwareAcceleration=settings.hardwareAcceleration,launchLeanMemory=settings.leanMemory;
const themeFile=path.join(app.getPath('userData'),'design-theme.json');let designTheme=structuredClone(defaultTheme);try{designTheme=validateTheme(JSON.parse(fs.readFileSync(themeFile,'utf8')));}catch{}
const customThemeFile=path.join(app.getPath('userData'),'custom-design-theme.json');let customTheme=structuredClone(designTheme);try{customTheme=validateTheme(JSON.parse(fs.readFileSync(customThemeFile,'utf8')));}catch{}
function saveDesign(value,preset=false){designTheme=validateTheme(value);if(!preset){customTheme=structuredClone(designTheme);}if(!smoke){fs.mkdirSync(path.dirname(customThemeFile),{recursive:true});fs.writeFileSync(customThemeFile+'.tmp',JSON.stringify(customTheme),{mode:0o600});fs.renameSync(customThemeFile+'.tmp',customThemeFile);}if(!smoke){fs.mkdirSync(path.dirname(themeFile),{recursive:true});fs.writeFileSync(themeFile+'.tmp',JSON.stringify(designTheme,null,2),{mode:0o600});fs.renameSync(themeFile+'.tmp',themeFile);}emit();}
if(!launchHardwareAcceleration)app.disableHardwareAcceleration();
if(!smoke&&!app.requestSingleInstanceLock())app.quit();
function saveSettings(){if(smoke)return;fs.mkdirSync(path.dirname(settingsFile),{recursive:true});fs.writeFileSync(settingsFile+'.tmp',JSON.stringify(settings),{mode:0o600});fs.renameSync(settingsFile+'.tmp',settingsFile);}
let extensionApi,passwords,ai,autofill,wallet,pageAssistant;
let space='personal',privateSession,privateNetwork,privateServices;
const selectedInSpace={};
let toolWindows,inspector;let split=null;let tidyUndo=null;
const profileFile=path.join(app.getPath('userData'),'profile.json');let profileExists=!smoke&&fs.existsSync(profileFile);let profile={name:'',email:'',theme:'Glacier',createdAt:null};if(!smoke)try{profile=normalizeProfile(JSON.parse(fs.readFileSync(profileFile,'utf8')));}catch{}
const accounts=require('./accounts.cjs').createAccounts({file:path.join(app.getPath('userData'),'account-session.enc'),safeStorage});
let gmailTimer,gmailGeneration=0;let memoryManager;let services,resizeWidth=null,closingApproved=false,restartRequested=false;
let library={bookmarks:[],folders:[],history:[],theme:'light',importReport:null}, overlay=false, importing=false;
let htmlFullscreen=null;
function exitPageFullscreen(){const wc=htmlFullscreen;htmlFullscreen=null;if(wc&&!wc.isDestroyed())wc.executeJavaScript('document.fullscreenElement ? document.exitFullscreen() : undefined').catch(()=>{});layout();}
function allowFullscreen(wc){return !!wc&&!wc.isDestroyed()&&!overlay&&tabs.some(t=>t.id===activeId&&t.view?.webContents===wc)&&/^https?:/.test(wc.getURL());}
let win, tabs = [], activeId = null, nextId = 1, timer,scrollTimer,restoringSession=true, glass = 'Frosted glass', quitting = false;
const storeFile = path.join(app.getPath('userData'), 'tabs.json');
const sessionStore=createSessionStore({file:storeFile,enabled:!smoke||restartTest||process.env.PRISM_TEST_RECOVERY==='1',onError:()=>{console.warn('Prism could not save the session; the previous snapshot is retained.');emit();}});
const libraryFile=path.join(app.getPath('userData'),'library.json');
const vaultFile=path.join(app.getPath('userData'),'passwords.enc');
const walletFile=path.join(app.getPath('userData'),'cards.enc');
function readCards(){if(!fs.existsSync(walletFile))return [];return JSON.parse(safeStorage.decryptString(fs.readFileSync(walletFile)));}
function saveLibrary(){if(smoke)return;fs.mkdirSync(path.dirname(libraryFile),{recursive:true});fs.writeFileSync(libraryFile+'.tmp',JSON.stringify(library),{mode:0o600});fs.renameSync(libraryFile+'.tmp',libraryFile);}
function saveEncrypted(file,data){if(!safeStorage.isEncryptionAvailable())throw Error('macOS Keychain encryption is unavailable.');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',safeStorage.encryptString(JSON.stringify(data)),{mode:0o600});fs.renameSync(file+'.tmp',file);}
function readVault(){if(!fs.existsSync(vaultFile))return [];return JSON.parse(safeStorage.decryptString(fs.readFileSync(vaultFile)));}
function importStore(kind){
 const file=path.join(app.getPath('userData'),'import-'+kind+'-undo.enc');
 return {read:()=>kind==='passwords'?readVault():structuredClone(library),write:async value=>{if(kind==='passwords')saveEncrypted(vaultFile,value);else{library=value;saveLibrary();}},saveCheckpoint:value=>saveEncrypted(file,value),load:()=>JSON.parse(safeStorage.decryptString(fs.readFileSync(file)))};
}
async function undoImported(kind){const store=importStore(kind),checkpoint=store.load();const choice=await dialog.showMessageBox(win,{message:'Undo the last '+kind+' import?',detail:'Undo is available only if the imported data has not changed since then.',buttons:['Cancel','Undo import'],defaultId:0,cancelId:0});if(choice.response!==1)return;await restoreCheckpoint({...store,checkpoint});emit();return {message:'Import undone.'};}
const browserPartition = smoke ? 'persist:smoke' : 'persist:prism';
const shellURL = require('node:url').pathToFileURL(path.join(__dirname, 'index.html')).href;
const tracker = `(() => { if (!globalThis.__prismTracking) { globalThis.__prismTracking = true; globalThis.__prismDirty = false; addEventListener('input', () => globalThis.__prismDirty = true, true); } return {frames:document.querySelectorAll('iframe,frame').length>0, dirty: !!globalThis.__prismDirty, pip:!!document.pictureInPictureElement, media: [...document.querySelectorAll('audio,video')].some(m => !m.paused && !m.ended)}; })()`;
function accent(){const colors={sage:'#65826e',blue:'#507fad',violet:'#9275b5',rose:'#ad737c',graphite:'#747c86'};return colors[settings.tint]||'#'+systemPreferences.getAccentColor().slice(0,6);}
function accessibility(){return {reduceTransparency:settings.reduceTransparency||nativeTheme.prefersReducedTransparency,highContrast:settings.highContrast||nativeTheme.shouldUseHighContrastColors};}
function applyAppearance(){
  if(nativeTheme.themeSource!==settings.theme)nativeTheme.themeSource=settings.theme;
  if(!win||win.isDestroyed())return;
  try{glass=require('./native/glass.node').configure(win.getNativeWindowHandle(),accessibility().reduceTransparency?'solid':settings.material,accent(),settings.radius);}catch{glass='Native frosted glass';win.setVibrancy(accessibility().reduceTransparency?'under-window':'sidebar');}
}
function snapshot() {
  const active = tabs.find(t => t.id === activeId);
  const privateMode=space==='private';
  return {account:privateMode?null:accounts.snapshot(),profile:privateMode?null:profile,split,inspecting:!!inspector?.isOpen(),ai:privateMode?null:ai?.snapshot(),updates:updater?.snapshot(),version:require('../package.json').version,blocking:blocker?.snapshot(active?.url,privateMode,active?.view?.webContents.id),space,privateNetwork:privateNetwork?.snapshot(),tabs: tabs.filter(t=>inSpace(t,space)).map(({view,recovery,restoring,scrollCapturePending, ...t}) => ({...t,title:t.customTitle||t.title, sleeping: !view && !!t.url})), activeId, glass,settings:{...settings,extensions:undefined},system:{...accessibility(),dark:nativeTheme.shouldUseDarkColors,accent:privateMode?'#9275b5':accent(),hardwareAcceleration:launchHardwareAcceleration,gpu:app.getGPUFeatureStatus(),restartRequired:settings.hardwareAcceleration!==launchHardwareAcceleration||settings.leanMemory!==launchLeanMemory},extensions:privateMode?[]:services?.extensionRows()||[],downloads:(privateMode?privateServices:services)?.downloads()||[],imageRevision:privateMode?'private':'normal-'+(services?.imageRevision()||0),images:privateMode?{}:services?.images()||{},passwords:privateMode?{message:'Password vault is disabled in Private.'}:passwords?.status()||{},browserPartition:privateMode?'private-disabled':browserPartition,activeWebContentsId:privateMode?-1:active?.view?.webContents.id||-1,bookmarks:privateMode?[]:library.bookmarks,folders:privateMode?[]:library.folders,theme:library.theme,importReport:privateMode?null:library.importReport,importing,sessionRecovery:sessionStore.status(),
    find,designTheme,chromium: process.versions.chrome, live: tabs.filter(t => t.view).length,
    canBack: !!active?.view?.webContents.navigationHistory.canGoBack(), canForward: !!active?.view?.webContents.navigationHistory.canGoForward()};
}
const stateTransport=createStateTransport();let emitPending=false;
function emit() { if(emitPending)return;emitPending=true;setImmediate(()=>{emitPending=false;if(win&&!win.isDestroyed()&&!win.webContents.isDestroyed())win.webContents.send('state',stateTransport.prepare(snapshot()));toolWindows?.publish();}); }
function persist() {
  if(restoringSession)return;
  sessionStore.schedule(captureSnapshot(tabs,activeId,selectedInSpace));
}
function captureNavigation(t){
 if(t.space==='private'||t.restoring||!t.view?.webContents||t.view.webContents.isDestroyed())return;
 const wc=t.view.webContents,current=recoveryURL(wc.getURL());if(!current||current!==recoveryURL(t.url))return;
 try{const navigation=navigationRecord({entries:wc.navigationHistory.getAllEntries(),index:wc.navigationHistory.getActiveIndex()},current,t.title);const scroll=scrollRecord(t.recovery?.scroll,current);t.recovery={navigation,...(scroll?{scroll}:{})};}catch{}
}
async function captureScroll(t){
 if(!t||t.space==='private'||!t.view||t.loading||t.restoring||t.scrollCapturePending)return false;
 const view=t.view,wc=view.webContents,version=t.navigationVersion;if(wc.isDestroyed())return false;
 t.scrollCapturePending=true;
 try{
  const value=await Promise.race([wc.executeJavaScriptInIsolatedWorld(999,[{code:'({url:location.href,x:scrollX,y:scrollY})'}]),new Promise(resolve=>{const timeout=setTimeout(()=>resolve(null),1000);timeout.unref?.();})]);
  if(t.view!==view||wc.isDestroyed()||t.navigationVersion!==version||t.restoring)return false;
  const scroll=scrollRecord(value,recoveryURL(t.url));if(!scroll||JSON.stringify(scroll)===JSON.stringify(t.recovery?.scroll))return false;
  captureNavigation(t);t.recovery={...t.recovery,scroll};persist();return true;
 }catch{return false;}finally{t.scrollCapturePending=false;}
}
function restoreSession(saved){
 restoringSession=true;
 try{
  if(saved)for(const item of saved.tabs){const t=makeTab(item.url,false,item.space);t.title=item.title;t.customTitle=item.customTitle||'';t.keepAwake=item.keepAwake;t.pinned=item.pinned;t.recovery={navigation:item.navigation,scroll:item.scroll};if(item.favoriteId&&library.bookmarks.some(b=>b.id===item.favoriteId))t.favoriteId=item.favoriteId;}
  if(tabs.length)selectTab(tabs[Math.max(0,Math.min(saved?.activeIndex||0,tabs.length-1))].id);else makeTab();
 }finally{restoringSession=false;persist();}
}
function layout() {
 if(!win||win.isDestroyed())return;
 const [w,h]=win.getContentSize(),left=settings.sidebarCollapsed?6:Math.min(resizeWidth??settings.sidebarWidth,w-400);
 if(split&&!split.ids.every(id=>tabs.some(t=>t.id===id&&inSpace(t,space))))split=null;
 const bar=split||inspector?.isOpen()?34:0,extra=find.open?42:0,inspectorWidth=0;
 const area={x:left,y:44+bar+extra,width:Math.max(1,w-left-6-(inspectorWidth?inspectorWidth+8:0)),height:Math.max(1,h-50-bar-extra)};
 const pair=split?splitBounds(area,split.mode,split.ratio):null;
 const buttonY=settings.sidebarCollapsed?15:23;if(win._prismButtonY!==buttonY){win.setWindowButtonPosition({x:22,y:buttonY});win._prismButtonY=buttonY;}
 for(const t of tabs)if(t.view){const full=htmlFullscreen===t.view.webContents;const visible=!overlay&&(htmlFullscreen?full:split?split.ids.includes(t.id):t.id===activeId);const bounds=full?{x:0,y:0,width:w,height:h}:pair&&split.ids.includes(t.id)?pair[split.ids.indexOf(t.id)]:area;const radius=full?0:10;if(t.view._prismRadius!==radius){t.view.setBorderRadius(radius);t.view._prismRadius=radius;}const key=JSON.stringify(bounds);if(visible&&t.view._prismBounds!==key){t.view.setBounds(bounds);t.view._prismBounds=key;}if(t.view._prismVisible!==visible){t.view.setVisible(visible);t.view._prismVisible=visible;}}
 inspector?.layout({x:w-inspectorWidth-6,y:44+bar,width:Math.max(1,inspectorWidth),height:Math.max(1,h-50-bar)},!overlay&&!htmlFullscreen);
}

function queueFavoriteThumbnail(t){if(t&&t.space!=='private'&&settings.favoriteStyle==='cards'&&library.bookmarks.some(b=>b.favorite&&b.url===t.url))setImmediate(()=>services?.thumbnail(t));}
function allowedTabURL(url){try{const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)||(parsed.protocol==='chrome-extension:'&&!!session.fromPartition(browserPartition).extensions.getExtension(parsed.hostname))||url==='about:blank';}catch{return false;}}
function makeTab(url = '', activate = true,tabSpace=space) {
  const t = {id:nextId++, space:tabSpace,pinned:false,navigationVersion:0,url, title:url ? new URL(url).hostname : 'New tab', view:null,lastUsed:Date.now(),keepAwake:false,audible:false,loading:false,dirty:false,error:''};
  tabs.push(t); if (activate) selectTab(t.id); else emit(); return t;
}
function attach(t) {
  if (t.view || !t.url) return;
  const isPrivate=t.space==='private';
  const view = new WebContentsView({webPreferences:{session:isPrivate?privateSession:session.fromPartition(browserPartition),disableDialogs:smoke,safeDialogs:true,...(!isPrivate?{preload:path.join(__dirname,'page-preload.cjs')}:{ }),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,allowRunningInsecureContent:false}});
  view.setBorderRadius(10);t.view = view; win.contentView.addChildView(view); layout();
  const wc = view.webContents;blocker?.attach(wc,isPrivate);if(!isPrivate)extensionApi?.addTab(wc,win);wc.setZoomFactor(settings.pageZoom);
  if(isPrivate)wc.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');
  wc.setWindowOpenHandler(({url}) => {if (/^https?:\/\//i.test(url)) makeTab(url,true,t.space); return {action:'deny'};});
  wc.on('enter-html-full-screen',()=>{if(!allowFullscreen(wc)){wc.executeJavaScript('document.exitFullscreen()').catch(()=>{});return;}autofill?.dismiss();htmlFullscreen=wc;layout();});
  wc.on('leave-html-full-screen',()=>{if(htmlFullscreen===wc){htmlFullscreen=null;layout();}});
  wc.on('will-navigate', (event,url) => {if (!allowedTabURL(url)) event.preventDefault();});
  wc.on('will-redirect', (event,url,_inPlace,main) => {if (!allowedTabURL(url)) event.preventDefault();});
  wc.on('focus',()=>{if(split?.ids.includes(t.id)&&t.id!==activeId)selectTab(t.id);});
  wc.on('context-menu',(_event,params)=>{if(t.view!==view||t.id!==activeId)return;const items=pageMenu({wc,params,clipboard,inspect:()=>inspector.open(wc,params),pip:()=>togglePiP(t,params.frame),translate:isPrivate?null:()=>action('page-ai-open-selection'),openTab:(url,activate=true)=>makeTab(url,activate,t.space),bookmark:isPrivate?null:()=>{if(t.id===activeId)action('bookmark-current');},extensions:isPrivate?[]:extensionApi?.getContextMenuItems(wc,params)||[]});Menu.buildFromTemplate(items).popup({window:win});});
  wc.on('page-title-updated', (_e,title) => {t.title=title;if(!isPrivate){const row=library.history.find(x=>x.url===cleanURL(wc.getURL()));if(row){row.title=String(title).slice(0,500);saveLibrary();}}emit();});
  wc.on('did-start-loading', () => {t.loading=true; t.error=''; emit();});
  wc.on('did-start-navigation',(_event,_url,inPlace,main)=>{if(main){if(t.id===activeId){pageAssistant?.cancel();if(toolWindows?.section()==='page-assistant')toolWindows.closeAll();}if(htmlFullscreen===wc)exitPageFullscreen();if(t.id===activeId){passwords?.cancelPicker();autofill?.dismiss();}if(!inPlace)t.navigationVersion++;}});
  wc.on('did-stop-loading', () => {t.loading=false; emit();if(!isPrivate&&t.id===activeId&&library.bookmarks.some(b=>b.favorite&&b.url===t.url))services?.thumbnail(t);});
  wc.on('page-favicon-updated',(_event,urls)=>{if(!isPrivate&&/^https?:/.test(t.url)&&library.bookmarks.some(b=>new URL(b.url).origin===new URL(t.url).origin)&&urls[0])services?.favicon(t.url,urls[0]);});
  wc.on('dom-ready', () => {wc.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]).catch(()=>{});});
  const navigated = (_event,_url,main=true) => {if(!main)return;t.url=wc.getURL();t.dirty=false;captureNavigation(t);if(!isPrivate){library.history=visit(library.history,t);saveLibrary();}if(t.id===activeId)closeFind(false);emit();persist();};
  wc.on('did-navigate',()=>navigated()); wc.on('did-navigate-in-page', navigated);
  wc.on('found-in-page',(_event,result)=>{if(t.id===activeId&&find.open&&result.requestId===find.requestId){find.matches=result.matches;find.active=result.activeMatchOrdinal;emit();}});
  wc.on('media-started-playing', () => {t.audible=true; emit();});
  wc.on('media-paused', () => {t.audible=wc.isCurrentlyAudible(); emit();});
  wc.on('did-fail-load', (_e,code,description,_url,main) => {if (main && code!==-3) {t.error=description; emit();}});
  wc.on('render-process-gone', (_e,details) => {t.error='Page stopped: '+details.reason; dispose(t); emit();});
  wc.on('before-input-event', (event,input) => {
    if(input.type==='keyDown'&&(input.meta||input.control)&&input.shift&&input.key.toLowerCase()==='c'){event.preventDefault();action('copy-page-url');return;}
    if ((input.meta || input.control) && ['l','t','w','r','d','f','y'].includes(input.key.toLowerCase()) && input.type==='keyDown') {
      event.preventDefault(); command(input.shift&&input.key.toLowerCase()==='t'?'reopen':input.key.toLowerCase());
    }
  });
  if(isPrivate){const network=privateNetwork;network.ensureStarted().then(()=>{if(t.view===view&&!wc.isDestroyed())return wc.loadURL(t.url);}).catch(error=>{if(t.view===view){t.error=error.message;emit();}});}else loadNormal(t,view);
}
async function loadNormal(t,view){
 const wc=view.webContents,saved=t.recovery,nav=navigationRecord(saved?.navigation,recoveryURL(t.url),t.title);t.restoring=true;
 try{if(saved?.navigation&&nav)await wc.navigationHistory.restore(nav);else await wc.loadURL(t.url);if(t.view!==view||wc.isDestroyed())return;const scroll=scrollRecord(saved?.scroll,recoveryURL(wc.getURL()));if(scroll)await wc.executeJavaScriptInIsolatedWorld(999,[{code:`scrollTo(${scroll.x},${scroll.y})`}]);}
 catch(error){if(t.view===view&&!wc.isDestroyed())t.error=error.message;}
 finally{if(t.view===view&&view.webContents&&!wc.isDestroyed()){t.restoring=false;captureNavigation(t);persist();emit();}}
}
function dispose(t) {
  if(inspector?.owner()===t.view?.webContents)inspector.close();
  if(htmlFullscreen===t.view?.webContents)exitPageFullscreen();
  if(t.id===activeId)autofill?.dismiss();
  captureNavigation(t);if(t.id===activeId)passwords?.cancelPicker();
  const view=t.view; if (!view) return;
  t.view=null; t.loading=false; t.audible=false;
  win?.contentView.removeChildView(view);
  if (!view.webContents.isDestroyed()) {if(t.space!=='private')extensionApi?.removeTab(view.webContents);view.webContents.close();}
}
function selectTab(id) {
  if(id!==activeId){inspector?.close();if(split){const target=tabs.find(t=>t.id===id);if(!target?.url||!inSpace(target,space))split=null;else if(!split.ids.includes(id)){split.ids[split.ids.indexOf(activeId)===1?1:0]=id;}}gmailGeneration++;toolWindows?.closeAll();if(htmlFullscreen)exitPageFullscreen();}
  autofill?.dismiss();
  const t=tabs.find(t=>t.id===id); if (!t) return;
  const old=tabs.find(t=>t.id===activeId); if (old){old.lastUsed=Date.now();captureScroll(old);}
  if(id!==activeId){closeFind(false);passwords?.closeManager();}
  space=t.space||'personal';tabSelection.select(t.id);selectedInSpace[space]=id;activeId=id; t.lastUsed=Date.now(); attach(t); if(t.view&&space!=='private')extensionApi?.selectTab(t.view.webContents);layout(); emit(); persist();queueFavoriteThumbnail(t);
}
async function sleepTab(t, manual=false) {
  if (!t?.view||t.id===activeId||split?.ids.includes(t.id)||t.keepAwake||t.loading||t.audible) return false;
  if(!manual&&Date.now()-t.lastUsed<settings.sleepMinutes*60000)return false;
  const view=t.view,wc=view.webContents,version=t.navigationVersion;
  try {const state=await wc.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]); if(state.pip)return false;t.dirty=state.dirty;t.frames=state.frames;t.capturing=wc.isBeingCaptured(); t.audible=state.media || wc.isCurrentlyAudible();} catch {return false;}
  if(t.view!==view||wc.isDestroyed()||t.navigationVersion!==version)return false;
  if (!manual && Date.now()-t.lastUsed<settings.sleepMinutes*60000)return false;
  if(split?.ids.includes(t.id))return false;
  if (!canSleep(t, activeId, Date.now(), true)) return false;
  await captureScroll(t);if(t.view!==view||t.id===activeId||split?.ids.includes(t.id)||t.navigationVersion!==version)return false;dispose(t);persist();emit();return true;
}
async function enforceAwakeBudget(){if(!settings.maxAwakeTabs)return;for(const t of budgetCandidates(tabs,activeId)){if(quitting||tabs.filter(t=>t.view).length<=settings.maxAwakeTabs)break;await sleepTab(t,true);}}
async function closeTab(id) {
  const t=tabs.find(t=>t.id===id); if (!t) return;
  if (t.view) {
    try {const state=await t.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]);
      if (state.dirty) {const result=await dialog.showMessageBox(win,{type:'question',message:'Close this tab and discard your input?',buttons:['Keep tab','Discard input'],defaultId:0,cancelId:0}); if(result.response!==1)return;}
    } catch {}
  }
  if(!tabs.includes(t))return;
  recentlyClosed.push(t);if(id===activeId)closeFind(false);
  if(split?.ids.includes(id))split=null;tabSelection.remove(id);const index=tabs.indexOf(t); dispose(t); tabs.splice(index,1);
  if(activeId===id){const remaining=tabs.filter(x=>inSpace(x,space));if(remaining.length)selectTab(tabSelection.previous(remaining).id);else makeTab();}
  emit(); persist();
}
function closeFind(focus=true){const wc=tabs.find(t=>t.id===activeId)?.view?.webContents;if(wc&&!wc.isDestroyed()){wc.stopFindInPage('clearSelection');if(focus)wc.focus();}find={open:false,query:'',matches:0,active:0,requestId:0};layout();emit();}
function command(key) {
  if(key==='f'){if(!tabs.find(t=>t.id===activeId)?.view)return;find.open=true;layout();emit();win.webContents.focus();win.webContents.send('open-panel','find');}
  if(key==='y')win.webContents.send('open-panel','history');
  if(key==='reopen')action('reopen');
  if (key==='l') {win.webContents.focus(); win.webContents.send('focus-address');}
  if (key==='t') {makeTab(); command('l');}
  if (key==='w') closeTab(activeId);
  if (key==='d') action('bookmark-current');
  if (key==='r') tabs.find(t=>t.id===activeId)?.view?.webContents.reload();
}
async function togglePiP(t,frame){
 if(!t?.view)return {error:'Open a video first.'};try{return frame?await frame.executeJavaScript(pipScript,true):await t.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:pipScript}],true);}catch{return {error:'This video cannot enter picture-in-picture. Its site or player may restrict it.'};}
}
async function action(name,value) {
 if(name==='copy-page-url'){const tab=tabs.find(t=>t.id===activeId);if(!tab?.url)return {error:'Open a page first.'};await clipboard.writeText(tab.url);return {message:'Page link copied.'};}
 if(name.startsWith('account-')){
  if(space==='private')return {error:'Accounts are unavailable in Private.'};
  try{
   let result;
   if(name==='account-start')result=await accounts.start(value);
   else if(name==='account-verify')result=await accounts.verify(value);
   else if(name==='account-refresh')result=await accounts.refresh();
   else if(name==='account-upload')result=await accounts.upload(profile);
   else if(name==='account-devices')result=await accounts.devices();
   else if(name==='account-revoke')result=await accounts.revoke(String(value));
   else if(name==='account-logout')result=await accounts.logout();
   else if(name==='account-delete')result=await accounts.remove(value);
   else if(name==='account-export'){const data=await accounts.export();const choice=await dialog.showSaveDialog(win,{defaultPath:'Prism-account.json',filters:[{name:'JSON',extensions:['json']}]});if(!choice.canceled&&choice.filePath)fs.writeFileSync(choice.filePath,JSON.stringify(data,null,2),{mode:0o600});result={message:choice.canceled?'Export cancelled.':'Account exported.'};}
   else if(name==='account-download'){const {account}=await accounts.refresh();result=await action('profile-save',{name:account.profile.name,email:account.email,theme:account.profile.theme});}
   emit();return result;
  }catch(error){emit();return {error:error.message};}
 }
 if(name==='profile-save'){if(space==='private')return {error:'Profile is unavailable in Private.'};const next=normalizeProfile({...value,createdAt:profile.createdAt||(profileExists?null:new Date().toISOString())});if(!smoke){fs.mkdirSync(path.dirname(profileFile),{recursive:true});fs.writeFileSync(profileFile+'.tmp',JSON.stringify(next),{mode:0o600});fs.renameSync(profileFile+'.tmp',profileFile);}profile=next;profileExists=true;const {prismPresets,presetTheme}=require('./theme-presets.js');saveDesign(presetTheme(prismPresets.find(p=>p.name===profile.theme)),true);emit();return {message:'Profile saved on this Mac.'};}
 if(name==='profile-open'){if(space==='private')return {error:'Profile connections are unavailable in Private.'};const urls={gmail:'https://mail.google.com/',chatgpt:'https://chatgpt.com/',gemini:'https://gemini.google.com/'};if(urls[value]){const existing=tabs.find(t=>t.space==='personal'&&t.url.startsWith(urls[value]));if(existing)selectTab(existing.id);else makeTab(urls[value],true,'personal');}return;}
 if(name==='tab-rename'){const target=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!target)return;target.customTitle=cleanTitle(value.title);persist();emit();return;}
 if(name==='tab-menu'){const target=tabs.find(t=>t.id===value&&inSpace(t,space));if(!target)return;Menu.buildFromTemplate([{label:target.pinned?'Unpin tab':'Pin tab',click:()=>action('pin-tab',target.id)},{label:'Rename tab…',click:()=>{selectTab(target.id);toolWindows.open('workspace');}},{label:'Use page title',enabled:!!target.customTitle,click:()=>action('tab-rename',{id:target.id,title:''})},{label:'Split with current tab',enabled:target.id!==activeId&&!!target.url,click:()=>action('split-start',{id:target.id,mode:'vertical'})}]).popup({window:win});return;}
 if(name==='tabs-tidy'){tidyUndo=tabs.map(t=>t.id);tabs=tidyOrder(tabs,space);persist();emit();return {message:'Tabs arranged by site. Pinned tabs stay in place.'};}
 if(name==='tabs-untidy'){if(tidyUndo){const ranks=new Map(tidyUndo.map((id,i)=>[id,i]));tabs.sort((a,b)=>(ranks.get(a.id)??Infinity)-(ranks.get(b.id)??Infinity));tidyUndo=null;persist();emit();}return;}
 if(name==='split-start'){const current=tabs.find(t=>t.id===activeId),other=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!current?.url||!other?.url||current===other)return {error:'Choose two different open pages.'};inspector?.close();split={ids:[current.id,other.id],mode:value.mode==='horizontal'?'horizontal':'vertical',ratio:.5};attach(other);toolWindows?.closeAll();layout();emit();return;}
 if(name==='split-end'){split=null;layout();emit();return;}
 if(name==='split-mode'&&split){split.mode=value==='horizontal'?'horizontal':'vertical';layout();emit();return;}
 if(name==='split-ratio'&&split){if(typeof value==='number'&&Number.isFinite(value)){split.ratio=Math.max(.25,Math.min(.75,value));layout();emit();}return;}
 if(name==='split-swap'&&split){split.ids.reverse();layout();emit();return;}
 if(name==='inspect'){const tab=tabs.find(t=>t.id===activeId);if(!tab?.view)return {error:'Open a page first.'};toolWindows?.closeAll();inspector.open(tab.view.webContents);return;}
 if(name==='inspect-close'){inspector.close();return;}
 if(name==='pip')return togglePiP(tabs.find(t=>t.id===activeId));

  if(name==='autofill-dismiss'){autofill?.dismiss();return;}
  if(name?.startsWith('wallet-')){if(space==='private')return {error:'Cards are disabled in Private.'};if(name==='wallet-list')return wallet.list();if(name==='wallet-save'){wallet.save(value);return {message:'Card saved encrypted on this Mac.'};}if(name==='wallet-remove'){wallet.remove(value);return;}}
  if(name==='page-ai-open-selection'){if(space==='private')return {error:'Translation is disabled in Private.'};await toolWindows.open('page-assistant');toolWindows.get()?.webContents.send('open-panel','translate-selection');return;}
  if(name==='page-ai-preview')return pageAssistant.prepare(value);
  if(name==='page-ai-run')return pageAssistant.run(value);
  if(name==='page-ai-cancel'){pageAssistant.cancel();return;}
  if(name==='ai-status')return ai.status();
  if(name==='ai-save-key')return ai.saveKey(value);
  if(name==='ai-clear-key'){pageAssistant.cancel();return ai.clearKey();}
  if(name==='ai-rename-suggest')return ai.suggest(value?.id);
  if(name==='ai-rename-apply')return ai.apply(value);
  if(name==='open-chatgpt'){if(space==='private')return {error:'AI is disabled in Private.'};makeTab('https://chatgpt.com/',true,'personal');return;}
  if(name==='open-shortcuts'){await shell.openPath('/System/Applications/Shortcuts.app');return;}
  if(name==='update-check')return updater.check();
  if(name==='update-install'){if(updater.snapshot().status!=='ready')return;installUpdateRequested=true;win.close();return;}
  const t=tabs.find(t=>t.id===activeId);
  if(name==='blocker-toggle'||name==='blocker-site'){if(name==='blocker-toggle')blocker.toggle(value);else blocker.toggleSite(t?.url,space==='private');emit();return {message:'Protection changed. Reload the page to apply cosmetic changes.'};}
  if(name.startsWith('password-')){if(space==='private')return {error:'Password vault is disabled in Private.'};const methods={'password-list':'list','password-begin-edit':'beginEdit','password-reveal':'reveal','password-update':'update','password-delete':'remove','password-pick':'resolvePicker','password-close-edit':'closeEdit','password-close-manager':'closeManager'};if(methods[name])return passwords[methods[name]](value);}
  if(name==='reopen'){const saved=recentlyClosed.pop(space);if(!saved)return {message:'No closed tabs in this space.'};const existing=saved.favoriteId&&tabs.find(x=>x.space===space&&x.favoriteId===saved.favoriteId);if(existing){selectTab(existing.id);return;}const tab=makeTab(saved.url,false,space);Object.assign(tab,saved);if(!library.bookmarks.some(b=>b.id===tab.favoriteId))delete tab.favoriteId;selectTab(tab.id);return;}
  if(name==='find-close'){closeFind(value!==false);return;}
  if(name==='find'&&t?.view){const query=String(value?.query||'').slice(0,500);if(!query){t.view.webContents.stopFindInPage('clearSelection');find.query='';find.matches=0;find.active=0;emit();return;}find.open=true;const next=query===find.query&&!!value?.next;find.query=query;find.requestId=t.view.webContents.findInPage(query,{forward:value?.forward!==false,findNext:!next});layout();emit();return;}
  if(name==='history-list')return space==='private'?[]:library.history.filter(x=>(x.title+' '+x.url).toLowerCase().includes(String(value||'').toLowerCase())).slice(0,200);
  if(name==='history-open'){if(space!=='private'&&cleanURL(value))makeTab(cleanURL(value));return;}
  if(name==='history-remove'){if(space!=='private'){library.history=library.history.filter(x=>x.url!==value);saveLibrary();}return;}
  if(name==='history-clear'){if(space==='private')return;const answer=await dialog.showMessageBox(win,{message:'Clear browsing history?',detail:'This also removes history suggestions. Bookmarks and sign-ins are kept.',buttons:['Cancel','Clear history'],defaultId:0,cancelId:0});if(answer.response===1){library.history=[];saveLibrary();}return;}
  if(name==='permissions-list')return space==='private'?[]:permissions.rows();
  if(name==='permission-reset'){if(space!=='private'&&value){permissions.reset(value.origin,value.permission);return {message:'Permission reset. Reload the site to end existing access.'};}return;}
  if(name==='gmail-add'&&space!=='private'){const existing=library.bookmarks.find(b=>require('./gmail.cjs').gmailURL(b.url));if(existing)existing.favorite=true;else library.bookmarks.push(bookmark({title:'Gmail',url:'https://mail.google.com/mail/u/0/#inbox',favorite:true}));saveLibrary();emit();return {message:'Gmail is in Favorites. Open it and sign in to load your inbox.'};}
  if(name==='gmail-hover-keep'){clearTimeout(gmailTimer);return;}
  if(name==='gmail-hover-end'){gmailGeneration++;clearTimeout(gmailTimer);gmailTimer=setTimeout(()=>{if(toolWindows?.section()==='quick-gmail')toolWindows.closeAll();},400);return;}
  if(name==='gmail-hover'&&space!=='private'&&settings.gmailPreview){const b=library.bookmarks.find(b=>b.id===value?.id&&b.favorite);const gmail=require('./gmail.cjs');if(!b||!gmail.gmailURL(b.url)||toolWindows.visible()&&toolWindows.section()!=='quick-gmail')return;clearTimeout(gmailTimer);const generation=++gmailGeneration;const tab=favoriteTab(tabs,b,space);let data;try{data=await gmail.preview(tab);}catch{data={messages:[],message:'Open Gmail to refresh your inbox.'};}if(space==='private'||generation!==gmailGeneration)return;await toolWindows.open('quick-gmail',value.anchor);toolWindows.get()?.webContents.send('gmail-preview',{...data,id:b.id});return;}
  if(name==='gmail-open'&&space!=='private'){const b=library.bookmarks.find(b=>b.id===value);if(!b||!require('./gmail.cjs').gmailURL(b.url))return;toolWindows.closeAll();const target=favoriteTab(tabs,b,space)||makeTab(b.url,false);target.favoriteId=b.id;selectTab(target.id);const u=new URL(b.url);u.hash='inbox';await target.view?.webContents.loadURL(u.href);return;}
  if(name==='memory-trim'){await memoryManager.trim();return {message:'Eligible idle tabs released and disposable HTTP cache cleared.'};}
  if(name==='performance-stats'){const metrics=app.getAppMetrics();return {memoryMiB:metrics.reduce((n,p)=>n+p.memory.workingSetSize/1024,0),cpuPercent:metrics.reduce((n,p)=>n+p.cpu.percentCPUUsage,0),awake:tabs.filter(t=>t.view).length,sleeping:tabs.filter(t=>!t.view&&t.url).length,processes:metrics.map(p=>({type:p.type,memoryMiB:p.memory.workingSetSize/1024})).sort((a,b)=>b.memoryMiB-a.memoryMiB)};}
  if(name==='apply-design-preset'){saveDesign(value,true);return;}
  if(name==='restore-custom-theme'){saveDesign(customTheme);return;}
  if(name==='default-browser-status')return defaultBrowserStatus(app);
  if(name==='make-default-browser')return smoke?{available:false,isDefault:false,message:'Default-browser changes are disabled in tests.'}:requestDefaultBrowser(app);
  if(name==='open-default-settings'){if(!smoke)await shell.openExternal('x-apple.systempreferences:com.apple.Desktop-Settings.extension');return;}
  if(name==='finish-onboarding'){settings.onboardingComplete=true;saveSettings();emit();return;}
  if(name==='import-chrome'){if(space==='private')throw Error('Import in Personal or Work.');const root=path.join(app.getPath('appData'),'Google/Chrome');let profiles;try{profiles=(await fs.promises.readdir(root,{withFileTypes:true})).filter(e=>e.isDirectory()&&/^(Default|Profile \d+)$/.test(e.name)&&fs.existsSync(path.join(root,e.name,'Bookmarks'))).map(e=>e.name).slice(0,12);}catch{throw Error('Chrome profiles were not found. Use a bookmarks HTML export instead.');}if(!profiles.length)throw Error('No Chrome bookmarks found. Use a bookmarks HTML export instead.');const choice=await dialog.showMessageBox(win,{message:'Choose a Chrome profile',buttons:['Cancel',...profiles],cancelId:0,defaultId:0});if(choice.response===0)return;const profile=profiles[choice.response-1];if(!profile)return;const file=path.join(root,profile,'Bookmarks');if((await fs.promises.stat(file)).size>20*1024*1024)throw Error('Bookmark file exceeds 20 MB.');return importBookmarks(bookmarkFile(await fs.promises.readFile(file,'utf8'),'Chrome'),'Chrome '+profile);}
  if(name==='import-bookmark-file'){if(space==='private')throw Error('Import in Personal or Work.');const chosen=await dialog.showOpenDialog(win,{title:'Import bookmarks from Chrome, Safari or another browser',properties:['openFile'],filters:[{name:'Bookmark HTML or JSON',extensions:['html','htm','json']}]});if(chosen.canceled)return {message:'Import canceled.'};const file=chosen.filePaths[0];if(fs.statSync(file).size>20*1024*1024)throw Error('Choose an export smaller than 20 MB.');return importBookmarks(bookmarkFile(await fs.promises.readFile(file,'utf8')),'Browser export');}
  if(name==='set-design-theme'){saveDesign(value);return;}
  if(name==='reset-design-theme'){saveDesign(defaultTheme);return;}
  if(name==='import-design-theme'){const choice=await dialog.showOpenDialog(win,{properties:['openFile'],filters:[{name:'Prism theme',extensions:['json']}]});if(!choice.canceled){if(fs.statSync(choice.filePaths[0]).size>65536)throw Error('Theme file is too large.');saveDesign(JSON.parse(fs.readFileSync(choice.filePaths[0],'utf8')));}return;}
  if(name==='export-design-theme'){const choice=await dialog.showSaveDialog(win,{defaultPath:'Prism-theme.json',filters:[{name:'Prism theme',extensions:['json']}]});if(!choice.canceled)fs.writeFileSync(choice.filePath,JSON.stringify(designTheme,null,2),{mode:0o600});return;}
  if(name==='space'){pageAssistant?.cancel();split=null;inspector?.close();if(!SPACES.includes(value))throw Error('Invalid space');space=value;const next=tabs.find(x=>x.id===selectedInSpace[space])||tabs.find(x=>inSpace(x,space));if(next)selectTab(next.id);else makeTab();return;}
  if(name==='end-private'){await endPrivate();return {message:'Private session cleared. Saved downloads remain on disk.'};}
  if(name==='private-network'){if(space!=='private')throw Error('Open Private first.');for(const tab of tabs.filter(x=>x.space==='private'))dispose(tab);await privateNetwork.setMode(value?.mode,value?.profile);emit();return;}
  if(name==='pin-tab'){const target=tabs.find(x=>x.id===value);if(target&&inSpace(target,space)){target.pinned=!target.pinned;persist();emit();}return;}
  if(space==='private'&&['import-arc','fill-password','save-password','import-passwords','bookmark-current','save-bookmark','folder','folder-menu','rename-folder','remove-folder','bookmark-move','open-bookmark','bookmark-menu','extension','web-store','import-native','undo-import','undo-password-import'].includes(name))return {error:'This action is available in Personal or Work.'};
  if(name==='undo-import')return undoImported('bookmarks');
  if(name==='undo-password-import')return undoImported('passwords');
  if(name==='import-native')return importNative();
  if(name==='set-setting'&&value&&typeof value.key==='string'){const valid=setting(value.key,value.value);if(valid===undefined)throw Error('Invalid setting');settings[value.key]=valid;if(value.key==='theme')library.theme=valid;saveSettings();if(value.key==='autofillSuggestions')autofill?.dismiss();if(value.key==='language')setupMenu();if(value.key==='automaticUpdates')updater?.schedule(valid);if(['theme','material','tint','radius','reduceTransparency','highContrast'].includes(value.key))applyAppearance();if(value.key==='pageZoom')for(const tab of tabs)tab.view?.webContents.setZoomFactor(valid);layout();emit();if(value.key==='favoriteStyle')queueFavoriteThumbnail(t);return;}
  if(name==='begin-resize'){const image=t?.view?await t.view.webContents.capturePage():null;overlay=true;layout();return image&&!image.isEmpty()?image.resize({width:1000}).toDataURL():null;}
  if(name==='resize-sidebar'&&typeof value==='number'){resizeWidth=setting('sidebarWidth',value);layout();return;}
  if(name==='finish-resize'){if(resizeWidth!==null)settings.sidebarWidth=resizeWidth;resizeWidth=null;saveSettings();layout();emit();return;}
  if(name==='tab-reorder'&&value){const moved=tabs.find(x=>x.id===value.id),before=tabs.find(x=>x.id===value.beforeId);if(!moved||!inSpace(moved,space)||(before&&!inSpace(before,space)))return;if(before)moved.pinned=!!before.pinned;tabs.splice(0,tabs.length,...moveBefore(tabs,value.id,value.beforeId));persist();emit();return;}
  if(name==='bookmark-move'&&value){const b=library.bookmarks.find(x=>x.id===value.id);if(!b)return;if(typeof value.favorite==='boolean')b.favorite=value.favorite;if(typeof value.folder==='string'&&(value.folder===''||library.folders.includes(value.folder))){b.folder=value.folder;b.favorite=false;}library.bookmarks=moveBefore(library.bookmarks,b.id,value.beforeId);saveLibrary();emit();return;}
  if(name==='extension'&&value){await services.extensionAction(value.command,value.id);return;}
  if(name==='download'&&value){await (space==='private'?privateServices:services).downloadAction(value.command,value.id);return;}
  if(name==='download-directory'){await services.chooseDownloadDirectory();return;}
  if(name==='clear-previews'){services.clearImages();return {message:'Favorite images cleared from this Mac.'};}
  if(name==='restart'){persist();saveSettings();if(smoke)return;restartRequested=true;win.close();return;}
  if (name==='overlay') {if(value){autofill?.dismiss();if(htmlFullscreen)exitPageFullscreen();}overlay=!!value;layout();if(!overlay)queueFavoriteThumbnail(t);return {activeId};}
  if (name==='theme') {settings.theme=nativeTheme.shouldUseDarkColors?'light':'dark';library.theme=settings.theme;applyAppearance();saveSettings();saveLibrary();emit();return;}
  if (name==='suggest'&&typeof value==='string') {if(space==='private')return [];const query=value.toLowerCase().slice(0,200);const seen=new Set();return [...library.bookmarks,...library.history].filter(x=>{if(!query||seen.has(x.url)||!(x.title+' '+x.url).toLowerCase().includes(query))return false;seen.add(x.url);return true;}).slice(0,8).map(({title,url})=>({title,url}));}
  if (name==='bookmark-current'&&t?.url) {const existing=library.bookmarks.find(b=>b.url===t.url);if(existing)library.bookmarks=library.bookmarks.filter(b=>b.id!==existing.id);else library.bookmarks.push(bookmark({url:t.url,title:t.title}));saveLibrary();emit();return;}
  if (name==='save-bookmark'&&value&&typeof value==='object') {const entry=bookmark(value);const index=library.bookmarks.findIndex(x=>x.id===entry.id);if(index<0)library.bookmarks.push(entry);else library.bookmarks[index]=entry;if(entry.folder&&!library.folders.includes(entry.folder))library.folders.push(entry.folder);saveLibrary();emit();return;}
  if (name==='folder'&&typeof value==='string'&&value.trim()) {const folder=value.trim().slice(0,200);if(!library.folders.includes(folder))library.folders.push(folder);saveLibrary();emit();return;}
  if(name==='rename-folder'){renameFolder(library,value?.from,value?.to);saveLibrary();emit();return;}
  if(name==='remove-folder'){removeFolder(library,value);saveLibrary();emit();return;}
  if(name==='folder-menu'&&folderNames(library).includes(value)){Menu.buildFromTemplate([
    {label:'Rename folder…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',{kind:'folder',originalFolder:value,title:value});}},
    {label:'Add bookmark…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',{folder:value});}},
    {type:'separator'},{label:'Remove folder, keep bookmarks',click:()=>{removeFolder(library,value);saveLibrary();emit();}}
  ]).popup({window:win});return;}
  if (name==='open-bookmark') {const b=library.bookmarks.find(b=>b.id===value);if(b){const target=favoriteTab(tabs,b,space)||makeTab(b.url,false);target.favoriteId=b.id;selectTab(target.id);}return;}
  if (name==='bookmark-menu') {const b=library.bookmarks.find(b=>b.id===value);if(!b)return;Menu.buildFromTemplate([
    {label:b.favorite?'Remove from Favorites':'Add to Favorites',click:()=>{b.favorite=!b.favorite;saveLibrary();emit();}},
    {label:'Edit bookmark…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',b);}},
    {label:'Move to folder',submenu:[{label:'Pinned',click:()=>{b.folder='';b.favorite=false;saveLibrary();emit();}},...library.folders.map(folder=>({label:folder,click:()=>{b.folder=folder;b.favorite=false;saveLibrary();emit();}}))]},
    {type:'separator'},{label:'Remove bookmark',click:()=>{library.bookmarks=library.bookmarks.filter(x=>x.id!==b.id);saveLibrary();emit();}}
  ]).popup({window:win});return;}
  if (name==='import-arc') return importArc();
  if (name==='fill-password') return passwords.fill(t);
  if(name==='save-password')return passwords.saveCurrent(t);
  if(name==='import-passwords')return passwords.importCSV();
  if(name==='apple-passwords'){const error=await shell.openPath('/System/Applications/Passwords.app');if(error)throw Error(error);return;}
  if(name==='web-store'){makeTab('https://chromewebstore.google.com/');return;}
  if(name==='show-welcome'){win.show();win.focus();win.webContents.send('open-panel','welcome');return;}
  if(name==='panel-preview'){const view=t?.view;if(!view)return null;const image=await view.webContents.capturePage();if(t.view!==view||t.id!==activeId)return null;return image.isEmpty()?null:image.resize({width:Math.min(1600,image.getSize().width)}).toDataURL();}
  if(name==='open-tool'){autofill?.dismiss();if(htmlFullscreen)exitPageFullscreen();return toolWindows.open(value?.section||'appearance');}
  if(name==='close-tools'){toolWindows.closeAll();return;}
  if (name==='state') {emit(); return;}
  if (name==='new') {makeTab(); command('l');}
  if (name==='select' && Number.isInteger(value)) selectTab(value);
  if (name==='close' && Number.isInteger(value)) await closeTab(value);
  if (name==='navigate' && typeof value==='string' && value.length<8192) {
    const url=normalizeAddress(value); if (!url) return {error:'Use an HTTP or HTTPS address, or enter a search.'};
    if(opensNewFavoriteTab(t,library.bookmarks.find(b=>b.id===t?.favoriteId),url)){makeTab(url,true,t.space);persist();return;}
    if (t) {t.url=url;t.error=''; if (t.view)t.view.webContents.loadURL(url).catch(()=>{});else attach(t);emit();persist();}
  }
  if (name==='back' && t?.view?.webContents.navigationHistory.canGoBack()) t.view.webContents.navigationHistory.goBack();
  if (name==='forward' && t?.view?.webContents.navigationHistory.canGoForward()) t.view.webContents.navigationHistory.goForward();
  if (name==='reload') {if(t?.view)t.view.webContents.reload();else if(t)attach(t);}
  if (name==='protect' && t) {t.keepAwake=!t.keepAwake;emit();persist();}
  if (name==='sleep') {let count=0; for (const tab of [...tabs]) if(await sleepTab(tab,true))count++;return {message:count ? `${count} background tab${count===1?'':'s'} put to sleep.` : 'No eligible background tabs. Playing media, edited forms, and protected tabs stay awake.'};}
}
async function importBookmarks(items,source){
 const merged=mergeBookmarks(library.bookmarks,items);
 const choice=await dialog.showMessageBox(win,{message:'Import '+source+' bookmarks?',detail:merged.added+' new bookmarks from '+items.length+' entries. Existing logins and sessions are kept. Cache is rebuilt by Chromium.',buttons:['Cancel','Import'],defaultId:0,cancelId:0});
 if(choice.response!==1)return;
 const next={...library,bookmarks:merged.bookmarks,folders:[...new Set([...library.folders,...items.map(b=>b.folder).filter(Boolean)])],importReport:{source,bookmarks:merged.added,completedAt:new Date().toISOString()}};
 await commitWithUndo({...importStore('bookmarks'),next});emit();
 return {message:'Imported '+merged.added+' bookmarks. Undo is available in Settings → Imports.'};
}
async function importArc(){
 if(space==='private'||importing)return;importing=true;emit();
 try{const {arcBookmarks}=require('./library.cjs');const file=path.join(app.getPath('appData'),'Arc','StorableSidebar.json');return await importBookmarks(arcBookmarks(JSON.parse(fs.readFileSync(file,'utf8'))),'Arc');}
 catch(error){return {error:error.message};}finally{importing=false;emit();}
}
async function importNative(){
 const file=path.join(app.getPath('appData'),'Prism Native Preview','session-v2.json');
 const document=JSON.parse(fs.readFileSync(file,'utf8'));
 const items=(document.favorites||[]).filter(b=>b.space!=='private'&&b.space!=='privateSpace'&&webURL(b.url)).map(b=>bookmark({id:'native:'+b.id,url:b.url,title:b.title,favorite:b.isFavorite!==false,folder:[b.sourceSpace,b.folder].filter(Boolean).join(' / ')}));
 return importBookmarks(items,'Native Preview');
}
function setupPrivate(){
 privateSession=session.fromPartition('private-'+randomUUID(),{cache:false});
 privateSession.setPermissionRequestHandler((wc,p,cb)=>cb(p==='fullscreen'&&allowFullscreen(wc)));privateSession.setPermissionCheckHandler((wc,p)=>p==='fullscreen'&&allowFullscreen(wc));
 privateNetwork=new PrivateNetwork({session:privateSession,changed:emit,filter:details=>blocker.check(details,true)});
 privateServices=createServices({app,ses:privateSession,window:()=>win,settings,saveSettings,emit,smoke:true,privateMode:true});
}
async function endPrivate(){
 if(privateNetwork?.busy)throw Error('Wait for the Private network change to finish.');
 for(const tab of tabs.filter(t=>t.space==='private'))dispose(tab);
 tabs=tabs.filter(t=>t.space!=='private');privateServices?.close();await privateNetwork?.close();
 await privateSession?.clearStorageData();await privateSession?.clearCache();await privateSession?.clearAuthCache();
 blocker.clearPrivate();setupPrivate();if(space==='private')await action('space','personal');emit();
}
function setupMenu() {
  const localize=items=>items.map(item=>({...item,...(item.label?{label:translate(settings.language,item.label)}:{}),...(item.submenu?{submenu:localize(item.submenu)}:{})}));
  Menu.setApplicationMenu(Menu.buildFromTemplate(localize([
    {label:'Prism',submenu:[{role:'about'},{label:'Check for Updates…',click:()=>{win.webContents.send('open-panel','updates');updater.check();}},{label:'Settings…',accelerator:'CmdOrCtrl+,',click:()=>win.webContents.send('open-panel','appearance')},{type:'separator'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]},
    {label:'File',submenu:[{label:'New tab',accelerator:'CmdOrCtrl+T',click:()=>command('t')},{label:'Close tab',accelerator:'CmdOrCtrl+W',click:()=>command('w')},{label:'Reopen closed tab',accelerator:'CmdOrCtrl+Shift+T',click:()=>command('reopen')}]},
    {label:'Edit',submenu:[{label:'Copy page link',accelerator:'Control+Shift+C',click:()=>action('copy-page-url')},{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},
    {label:'Bookmarks',submenu:[{label:'Bookmark this page',accelerator:'CmdOrCtrl+D',click:()=>action('bookmark-current')},{label:'Import from Arc…',click:()=>importArc()}]},
    {label:'View',submenu:[{label:'Tabs & layout',click:()=>win.webContents.send('open-panel','workspace')},{label:'Profile',click:()=>win.webContents.send('open-panel','profile')},{label:'Inspect page',accelerator:'CmdOrCtrl+Alt+I',click:()=>action('inspect')},{label:'Picture in picture',click:()=>action('pip')},{label:'Translate selected text',click:()=>action('page-ai-open-selection')},{label:'Page assistant',click:()=>win.webContents.send('open-panel','page-assistant')},{label:'AI & assistants',click:()=>win.webContents.send('open-panel','ai')},{label:'Find in page',accelerator:'CmdOrCtrl+F',click:()=>command('f')},{label:'History',accelerator:'CmdOrCtrl+Y',click:()=>command('y')},{label:'Site permissions',click:()=>win.webContents.send('open-panel','permissions')},{label:'Address bar',accelerator:'CmdOrCtrl+L',click:()=>command('l')},{label:'Reload page',accelerator:'CmdOrCtrl+R',click:()=>command('r')},{role:'togglefullscreen'}]},
    {label:'Downloads',submenu:[{label:'Show downloads',accelerator:'CmdOrCtrl+J',click:()=>win.webContents.send('open-panel','downloads')}]},
    {label:'Window',submenu:[{role:'minimize'},{role:'zoom'}]}
  ])));
}
app.whenReady().then(async()=>{
  if(!smoke){localUpdater=require('./local-updater.cjs').createLocalUpdater({app,config:require('./local-update-config.json'),onChange:()=>{if(win)emit();}});if(settings.automaticUpdates&&await localUpdater.startup()){app.exit(0);return;}}
  if(!smoke){try{library={...library,...JSON.parse(fs.readFileSync(libraryFile,'utf8'))};}catch{}}
  if(!fs.existsSync(settingsFile)&&!smoke)settings.theme=library.theme||'system';
  nativeTheme.themeSource=settings.theme;
  const ses=session.fromPartition(browserPartition);
  const permissionFile=path.join(app.getPath('userData'),'site-permissions.json');let savedPermissions=[];if(!smoke)try{savedPermissions=JSON.parse(fs.readFileSync(permissionFile,'utf8'));}catch{}
  permissions=createPermissions({load:savedPermissions,tabFor:wc=>tabs.find(t=>t.id===activeId&&t.view?.webContents===wc),save:rows=>{if(!smoke){fs.mkdirSync(path.dirname(permissionFile),{recursive:true});fs.writeFileSync(permissionFile+'.tmp',JSON.stringify(rows),{mode:0o600});fs.renameSync(permissionFile+'.tmp',permissionFile);}},prompt:async(site,keys)=>{const answer=await dialog.showMessageBox(win,{message:site+' wants access to '+keys.join(' and '),detail:'Your choice applies to this site in Personal and Work. macOS may require additional permission.',buttons:['Not now','Block','Allow'],defaultId:0,cancelId:0});return ['ask','block','allow'][answer.response];}});
  ses.setPermissionRequestHandler((wc,p,cb,d)=>{if(p==='fullscreen'){cb(allowFullscreen(wc));return;}permissions.request(wc,p,cb,d).catch(()=>{});});
  ses.on('select-webauthn-account',require('./passkey-selection.cjs').passkeyHandler({activeTab:()=>tabs.find(t=>t.id===activeId),choose:async(origin,accounts)=>{const choice=await dialog.showMessageBox(win,{message:'Choose a passkey',detail:origin,buttons:['Cancel',...accounts.map(a=>String(a.name||a.displayName||'Saved account').slice(0,200))],defaultId:0,cancelId:0});return accounts[choice.response-1]?.credentialId;}}));
  ses.setPermissionCheckHandler((wc,p,url,d)=>p==='fullscreen'?allowFullscreen(wc):permissions.check(wc,p,url,d));
  extensionApi=new ElectronChromeExtensions({license:'GPL-3.0',session:ses,
    createTab:async details=>{if(details.url&&!allowedTabURL(details.url))throw Error('Unsupported tab URL.');const t=makeTab(details.url||'https://www.google.com/',details.active!==false,space==='private'?'personal':space);attach(t);return [t.view.webContents,win];},
    selectTab:wc=>{const t=tabs.find(t=>t.view?.webContents===wc);if(t)selectTab(t.id);},
    removeTab:wc=>{const t=tabs.find(t=>t.view?.webContents===wc);if(t)return closeTab(t.id);},
    requestPermissions:async()=>false
  });
  ElectronChromeExtensions.handleCRXProtocol(session.defaultSession);
  services=createServices({app,ses,window:()=>win,settings,saveSettings,emit,smoke,onDownloadComplete:id=>ai?.enqueue(id)});
  blocker=new Blocker({file:path.join(app.getPath('userData'),'blocking.json'),changed:emit});blocker.bind(ses);
  setupPrivate();
  ai=require('./ai.cjs').createAI({app,safeStorage,settings,emit,downloads:()=>services.downloads(),saveDownloads:()=>services.persistDownloads(),isPrivate:()=>space==='private'});
  passwords=createPasswords({app,window:()=>win,settings,readVault,writeVault:entries=>saveEncrypted(vaultFile,entries),importVault:next=>commitWithUndo({...importStore('passwords'),next}),activeTab:()=>tabs.find(t=>t.id===activeId),emit,customPicker:true});
  pageAssistant=require('./page-assistant.cjs').createPageAssistant({activeTab:()=>tabs.find(t=>t.id===activeId),isPrivate:()=>space==='private',getKey:()=>ai.pageKey()});
  ipcMain.on('prism-login-submitted',(event,value)=>{const t=tabs.find(t=>t.view?.webContents===event.sender);if(!t||t.space==='private'||t.id!==activeId||event.senderFrame!==event.sender.mainFrame)return;passwords.offer(t,value,event.senderFrame.url).catch(()=>{});});
  await installChromeWebStore({session:ses,extensionsPath:path.join(app.getPath('userData'),'store-extensions'),loadExtensions:false,autoUpdate:false,beforeInstall:async details=>({action:await services.reviewExtension(details.manifest,details.localizedName)?'allow':'deny'})});
  win=new BrowserWindow({width:1240,height:820,minWidth:800,minHeight:560,title:'Prism',titleBarStyle:'hiddenInset',trafficLightPosition:{x:22,y:23},transparent:true,backgroundColor:'#00000000',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  toolWindows=require('./tool-windows.cjs').createToolWindows({WebContentsView,parent:()=>win,snapshot,onClosed:key=>{pageAssistant?.cancel();if(key==='settings')passwords?.closeManager();}});
  ipcMain.handle('action',(event,name,value)=>{
    const tool=toolWindows.trusted(event);
    if(tool){if(name==='overlay'||name==='find-close')return {activeId};if(name==='panel-size'){toolWindows.size(value);return;}if(name==='close-tool'){toolWindows.closeAll();return;}return action(name,value);}
    if(!win||win.isDestroyed()||event.sender!==win.webContents || event.senderFrame!==win.webContents.mainFrame || event.senderFrame.url!==shellURL)throw new Error('Untrusted sender');
    return action(name,value);
  });
  wallet=require('./wallet.cjs').createWallet({read:readCards,write:rows=>saveEncrypted(walletFile,rows)});
  autofill=require('./autofill.cjs').createAutofill({WebContentsView,ipcMain,window:()=>win,activeTab:()=>tabs.find(t=>t.id===activeId),readVault,wallet,settings,nativeTheme,isOverlay:()=>overlay||toolWindows?.visible()});
  win.on('blur',()=>autofill.dismiss());
  updater=localUpdater?.snapshot().configured?localUpdater:createUpdater({autoUpdater,app,config:require('./update-config.json'),onChange:emit});updater.schedule(settings.automaticUpdates);
  memoryManager=require('./memory-manager.cjs').createMemoryManager({app,session:ses,settings,tabs:()=>tabs,activeId:()=>activeId,sleepTab});
  inspector=require('./inspector.cjs').createInspector({WebContentsView,parent:()=>win,changed:()=>{layout();emit();}});
  setupMenu(); await win.loadFile(path.join(__dirname,'index.html'));
  applyAppearance();
  nativeTheme.on('updated',()=>{applyAppearance();emit();});
  await services.restoreExtensions();
  if(!smoke)services.importArcIcons(library.bookmarks);
  win.setWindowButtonVisibility(true);
  restoreSession(!smoke||restartTest?sessionStore.load():null);
  win.on('leave-full-screen',()=>{if(htmlFullscreen)exitPageFullscreen();layout();});
  win.on('enter-full-screen',layout);
  win.on('resize',()=>{autofill?.dismiss();layout();toolWindows?.layout();});
  win.on('close',async event=>{
    if(closingApproved||smoke)return;event.preventDefault();
    let dirty=false;for(const t of tabs){if(t.view)try{const status=await t.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]);dirty ||= status.dirty;}catch{}}
    if(dirty||services.hasActiveDownloads()||privateServices.hasActiveDownloads()){const answer=await dialog.showMessageBox(win,{type:'question',message:'Close Prism?',detail:dirty?'Some tabs contain unsaved input. Closing will discard it.':'Downloads are still running. Closing will interrupt them.',buttons:['Keep browsing','Close Prism'],defaultId:0,cancelId:0});if(answer.response!==1){restartRequested=false;installUpdateRequested=false;return;}}
    for(const t of tabs){captureNavigation(t);await captureScroll(t);}persist();sessionStore.flush();if(installUpdateRequested&&localUpdater?.snapshot().configured){if(await localUpdater.install()){services.close();privateServices.close();await privateNetwork.close().catch(()=>{});app.exit(0);return;}installUpdateRequested=false;emit();return;}closingApproved=true;services.close();privateServices.close();await privateNetwork.close();if(installUpdateRequested){updater.install();return;}if(restartRequested)app.relaunch();win.close();
  });
  win.on('closed',()=>{quitting=true;autofill?.destroy();updater?.close();toolWindows.destroy(); clearInterval(timer);clearInterval(scrollTimer);sessionStore.close();for(const t of tabs)if(t.view&&!t.view.webContents.isDestroyed())t.view.webContents.close();win=null;app.quit();});
  let sweeping=false;timer=setInterval(async()=>{if(sweeping)return;sweeping=true;try{for(const t of [...tabs]){if(quitting)break;await sleepTab(t);}if(!quitting){await enforceAwakeBudget();await memoryManager?.sweep();}}finally{sweeping=false;}},30000);
  scrollTimer=setInterval(()=>{captureScroll(tabs.find(t=>t.id===activeId));},5000);
  win.webContents.on('did-finish-load',()=>{passwords?.closeManager();stateTransport.reset();emit();});
  win.show();localUpdater?.healthy(); emit();externalReady=true;for(const url of pendingExternal.splice(0))receiveExternal(url);
  if(process.argv.includes('--import-arc')&&!smoke) importArc().then(result=>console.log('Arc import:',JSON.stringify(result)));
  if(smoke) require(process.env.PRISM_TEST_PRIVATE_PUBLIC==='1'?'../test/private-public-flow.cjs':restartTest?'../test/restart-flow.cjs':process.env.PRISM_TEST_COMPATIBILITY==='1'?'../test/compatibility-flow.cjs':process.env.PRISM_PERFORMANCE==='1'?'../test/performance-flow.cjs':process.env.PRISM_TEST_CREDENTIALS==='1'?'../test/credentials-flow.cjs':process.env.PRISM_TEST_RECOVERY==='1'?'../test/recovery-flow.cjs':process.env.PRISM_TEST_BASICS==='1'?'../test/basics-flow.cjs':process.env.PRISM_BENCHMARK==='1'?'../test/benchmark.cjs':process.env.PRISM_TEST_STORE==='1'?'../test/store.cjs':'../test/smoke.cjs').run({app,win,makeTab,selectTab,sleepTab,enforceAwakeBudget,action,snapshot,tabs,settings,services,passwords,autofill,wallet,ai,toolWindows,inspector,sessionStore,captureScroll,restoreSession,dispose,privateController:()=>privateNetwork}).catch(error=>{console.error(error);app.exit(1);});
});
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
app.on('window-all-closed',()=>app.quit());
