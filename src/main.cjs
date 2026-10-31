// 0.45: a web app in the Dock (web-apps.cjs) is this same code started from its own bundle; it runs web-app.cjs only.
{const webApp=require('./web-app.cjs').fromBundle(process.execPath);if(webApp){require('./web-app.cjs').run(webApp);return;}}
const {cleanTitle,tidyOrder,splitBounds,normalizeProfile,pipScript}=require('./workspace.cjs');
const {createTabSelection}=require("./tab-selection.cjs");const tabSelection=createTabSelection();
const {budgetCandidates,createStateTransport}=require('./performance.cjs');
const {visit,closedTabs,cleanURL}=require('./browsing.cjs');
const {createPermissions}=require('./site-permissions.cjs');
const recentlyClosed=closedTabs();let permissions,devices,deviceChooser=null,extensionPermissions=null;
// Startup marks (0.40, wall-clock ms) read by test/perf-audit-flow.cjs: when each step of a launch first happened.
const bootMarks={main:Date.now()};const bootMark=name=>{bootMarks[name]??=Date.now();};
// 0.39.5: answers from pages are awaited for a bounded time. A busy, frozen or hung page used to keep a tab from closing,
// Prism from quitting, and the sleep sweep stuck for good (so no tab ever slept again and memory kept growing).
const within=(work,ms,fallback=null)=>Promise.race([Promise.resolve(work).catch(()=>fallback),new Promise(resolve=>{const t=setTimeout(()=>resolve(fallback),ms);t.unref?.();})]);
const pageState=wc=>within(wc&&!wc.isDestroyed()?wc.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]):null,1500);
let find={open:false,query:'',matches:0,active:0,requestId:0};
const {autoUpdater, app, BrowserWindow, WebContentsView, webContents, nativeImage, ipcMain, session, Menu, dialog, safeStorage, nativeTheme, systemPreferences, shell, clipboard, screen, powerMonitor} = require('electron');
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
// Chromium update check (0.34, chromium-check.cjs): at every launch, unless turned off in Settings → Updates. When an
// Electron release with a newer Chromium appears, a quiet note says so once for that version.
const chromiumCheck=require('./chromium-check.cjs').createChromiumCheck({changed:()=>{if(win)emit();}});
const chromiumNotedFile=path.join(app.getPath('userData'),'chromium-check.json');
function noteChromium(result){if(result?.status!=='available'||!result.nextChromium)return;const key=result.nextChromium;let noted='';try{noted=JSON.parse(fs.readFileSync(chromiumNotedFile,'utf8')).noted||'';}catch{}if(noted===key)return;
 try{fs.writeFileSync(chromiumNotedFile,JSON.stringify({noted:key}),{mode:0o600});}catch{}feedback('chromium-update',Number(key.split('.')[0]));}
const {PrivateNetwork}=require('./private-network.cjs');
const {normalTabs,inSpace,validSpace,fallbackSpace,addSpace,updateSpace,removeSpace,moveSpace}=require('./spaces.cjs');
const {favoriteTab,opensNewFavoriteTab}=require('./favorite-tabs.cjs');
const {pageMenu}=require('./page-menu.cjs');
const {createSessionStore,captureSnapshot,navigationRecord,scrollRecord,url:recoveryURL}=require('./session-recovery.cjs');
const {bookmarkFile}=require('./browser-import.cjs');const migrate=require('./browser-migrate.cjs');
const {randomUUID}=require('node:crypto');
const {commitWithUndo,restoreCheckpoint}=require('./import-checkpoint.cjs');
const {defaults:defaultTheme,validateTheme}=require('./theme-tokens.cjs');
const {defaultBrowserStatus,requestDefaultBrowser,externalURL}=require('./default-browser.cjs');
const {createUpdater}=require('./updater.cjs');
const {translate}=require('./locales.js');
const {createInstagramApp,isInstagramURL}=require('./site-apps.cjs');
let updater,localUpdater,installUpdateRequested=false,updateOverride=null;
let externalReady=false;const pendingExternal=[];
function receiveExternal(value){const assistant=require('./assistant-links.cjs').assistantAction(value);if(assistant){if(!externalReady){if(pendingExternal.length<20)pendingExternal.push(value);return;}if(assistant==='downloads')win.webContents.send('open-panel','quick-downloads');else if(assistant==='chatgpt')makeTab('https://chatgpt.com/',true,homeSpace());else makeTab('',true,homeSpace());win.show();win.focus();return;}const url=externalURL(value);if(!url)return;if(!externalReady){if(pendingExternal.length<20)pendingExternal.push(url);return;}if(settings.linksInLens&&peek){peek.openWindow(url,'personal');return;}makeTab(url,true,'personal');if(win.isMinimized())win.restore();win.show();win.focus();}
app.on('open-url',(event,url)=>{event.preventDefault();receiveExternal(url);});
const smoke = process.argv.includes('--smoke-test');
const restartTest=smoke&&/^[a-f0-9-]{36}$/.test(process.env.PRISM_TEST_RESTART_ID||'');
app.setName('Prism');
// A standard Chrome user agent: sign-in pages (Apple, Google) treat an "Electron/…" token as an unsupported browser.
app.userAgentFallback=app.userAgentFallback.replace(/ Electron\/\S+/,'').replace(/ Prism\/\S+/i,'');
if(smoke&&process.env.PRISM_TEST_COMPATIBILITY==='1')app.commandLine.appendSwitch('use-fake-device-for-media-stream');
app.setPath('userData', path.join(smoke ? app.getPath('temp') : app.getPath('appData'), smoke ? (restartTest?'prism-restart-'+process.env.PRISM_TEST_RESTART_ID:'prism-smoke-' + process.pid) : 'Prism Prototype'));
const settingsFile=path.join(app.getPath('userData'),'settings.json');
let rawSettings={};try{rawSettings=JSON.parse(fs.readFileSync(settingsFile,'utf8'));}catch{}
if(smoke&&process.env.PRISM_TEST_HARDWARE_OFF==='1')rawSettings.hardwareAcceleration=false;
const settings=normalizeSettings(rawSettings);// Lean memory used to cap the HTTP disk cache at 128 MB, which made every sleeping tab reload from the network; the
// cache is on disk, not in memory, so it now keeps up to 1 GB (0.33.2).
if(settings.leanMemory)app.commandLine.appendSwitch('disk-cache-size',String(1024*1024*1024));if(smoke)settings.onboardingComplete=true;const launchHardwareAcceleration=settings.hardwareAcceleration,launchLeanMemory=settings.leanMemory;
const themeFile=path.join(app.getPath('userData'),'design-theme.json');let designTheme=structuredClone(defaultTheme);try{designTheme=validateTheme(JSON.parse(fs.readFileSync(themeFile,'utf8')));}catch{}
const customThemeFile=path.join(app.getPath('userData'),'custom-design-theme.json');let customTheme=structuredClone(designTheme);try{customTheme=validateTheme(JSON.parse(fs.readFileSync(customThemeFile,'utf8')));}catch{}
function saveDesign(value,preset=false){designTheme=validateTheme(value);if(!preset){customTheme=structuredClone(designTheme);}if(!smoke){fs.mkdirSync(path.dirname(customThemeFile),{recursive:true});fs.writeFileSync(customThemeFile+'.tmp',JSON.stringify(customTheme),{mode:0o600});fs.renameSync(customThemeFile+'.tmp',customThemeFile);}if(!smoke){fs.mkdirSync(path.dirname(themeFile),{recursive:true});fs.writeFileSync(themeFile+'.tmp',JSON.stringify(designTheme,null,2),{mode:0o600});fs.renameSync(themeFile+'.tmp',themeFile);}emit();}
if(!launchHardwareAcceleration)app.disableHardwareAcceleration();
if(!smoke&&!app.requestSingleInstanceLock())app.quit();
function saveSettings(){if(smoke)return;fs.mkdirSync(path.dirname(settingsFile),{recursive:true});fs.writeFileSync(settingsFile+'.tmp',JSON.stringify(settings),{mode:0o600});fs.renameSync(settingsFile+'.tmp',settingsFile);}
let extensionApi,sidePanels,passwords,ai,autofill,wallet,pageAssistant;
let space=fallbackSpace(settings.spaces),privateSession,privateNetwork,privateServices,normalNetwork;
// The bypass helper ships inside Prism (0.39), built from Zapret's tpws source (vendor/zapret-tpws, MIT).
const tpwsHelper=app.isPackaged?path.join(process.resourcesPath,'tpws'):path.join(__dirname,'native','tpws');
const siteBypass=require('./site-bypass.cjs').siteBypass({settings,network:()=>normalNetwork});
// Encrypted DNS is app-wide: on while Private's bypass, the normal-space bypass or privacy everywhere needs it.
const dnsWants={private:false,normal:false};
function syncDns(){try{app.configureHostResolver(dnsWants.private||dnsWants.normal||settings.privacyEverywhere?{secureDnsMode:'secure',secureDnsServers:['https://cloudflare-dns.com/dns-query','https://dns.google/dns-query']}:{secureDnsMode:'automatic',secureDnsServers:[]});}catch{}}
// Normal spaces follow Settings → Private network: off, every site, or only the chosen sites and their companions.
let bypassQueue=Promise.resolve();
function applyBypass(){bypassQueue=bypassQueue.then(async()=>{const n=normalNetwork;if(!n)return;const want=settings.bypassNormal,profile=settings.bypassProfile||'standard',s=n.state;
 if(want==='off'){if(s.status!=='idle'&&s.status!=='direct'){await n.setMode('direct');siteBypass.forget();}return;}
 if(s.status==='active'&&s.profile===profile)return n.reroute();await n.setMode('zapret',profile);}).catch(()=>{}).finally(emit);return bypassQueue;}
const homeSpace=()=>fallbackSpace(settings.spaces);
const selectedInSpace={};
let toolWindows,inspector,passkeys,siteControls,surfaces,peek,commandBar,media,pip,reader,webApps;
// Spectrum (0.32, spectrum.cjs): today's sites as a band of light in the sidebar; kept on this Mac, never for Private.
const spectrumFile=path.join(app.getPath('userData'),'spectrum.json');
const {hostOf}=require('./spectrum.cjs');const spectrum=require('./spectrum.cjs').createSpectrum({now:()=>Date.now(),load:()=>{if(smoke)return null;try{return JSON.parse(fs.readFileSync(spectrumFile,'utf8'));}catch{return null;}},save:data=>{if(smoke)return;try{fs.mkdirSync(path.dirname(spectrumFile),{recursive:true});fs.writeFileSync(spectrumFile+'.tmp',JSON.stringify(data),{mode:0o600});fs.renameSync(spectrumFile+'.tmp',spectrumFile);}catch{}}});
// Spectrum's chapter titles (0.33) come from Apple Intelligence on this Mac, asked for only when the day card is opened
// (0.33.1) and the chapters changed, at most every five minutes, and never for Private. Without it, chapters are named from what their sites are for.
let spectrumAsking=null,spectrumAskedAt=0,spectrumAskedKey='';
function spectrumInsights(view){
 if(power.saving||spectrumAsking||!ai||!view.chapters.length||view.insightsFresh||view.insightsKey===spectrumAskedKey&&Date.now()-spectrumAskedAt<30*60000||Date.now()-spectrumAskedAt<5*60000)return;
 const chapters=spectrum.chapters(view.space),offset=Math.max(0,chapters.length-24),key=view.insightsKey;spectrumAskedAt=Date.now();spectrumAskedKey=key;
 const language={en:'English',tr:'Turkish',es:'Spanish',pt:'Portuguese',fr:'French',uk:'Ukrainian'}[settings.language]||'English';
 spectrumAsking=ai.describeDay({language,chapters:chapters.slice(offset).map(c=>({minutes:Math.max(1,Math.round(c.active/60000)),sites:c.sites.slice(0,5).map(s=>s.host),titles:c.titles.slice(0,6).map(x=>x.slice(0,80))}))})
  .then(result=>{if(settings.spectrumInsights===false)return;spectrum.setInsights(key,{titles:[...Array(offset).fill(''),...result.titles],summary:result.summary},view.space);emit();}).catch(()=>{}).finally(()=>{spectrumAsking=null;});
}
function spectrumAction(name,value){
 if(space==='private')return null;
 if(name==='spectrum-view'){const on=settings.spectrumInsights!==false;const view=spectrum.view({usual:on,space:value?.all?'':quiet(space),openHosts:tabs.filter(t=>inSpace(t,space)).map(t=>hostOf(t.url))});if(on&&value?.insights)spectrumInsights(view);return view;}
 if(name==='spectrum-open'&&typeof value?.url==='string'&&/^https:\/\/[a-z0-9.-]+\/$/i.test(value.url)){makeTab(value.url,true,space);persist();return;}
 const time=Number(value?.time);if(!Number.isFinite(time))return null;const moment=spectrum.at(time,value?.all?'':space);
 if(name==='spectrum-at')return moment;
 if(name==='spectrum-restore'&&moment){const open=new Set(tabs.filter(t=>inSpace(t,space)).map(t=>t.url));let count=0;for(const item of moment.tabs)if(!open.has(item.url)){const t=makeTab(item.url,false,space);t.title=item.title||t.title;open.add(item.url);count++;}persist();emit();return {message:count?(count===1?'1 tab is back, asleep until you open it.':count+' tabs are back, asleep until you open them.'):'Those tabs are already open.'};}
 return null;
}const passkeyFile=path.join(app.getPath('userData'),'passkeys.enc');
// Encrypted files (passwords, cards, passkeys, import undo) use safeStorage's async API through secure-file.cjs (0.42):
// decrypted once after launch, read from memory, saved in order in the background and flushed before quit.
const {createSecureFile}=require('./secure-file.cjs'),secureFiles=new Map();
function secureFile(file,fallback){if(!secureFiles.has(file))secureFiles.set(file,createSecureFile({file,safeStorage,fallback,onError:error=>console.error('Prism could not save '+path.basename(file)+': '+error.message)}));return secureFiles.get(file);}
function readPasskeys(){const store=secureFile(passkeyFile);return store.loaded()?store.read():[];}let split=null;let tidyUndo=null;
const profileFile=path.join(app.getPath('userData'),'profile.json');let profileExists=!smoke&&fs.existsSync(profileFile);let profile={name:'',email:'',theme:'Glacier',createdAt:null};if(!smoke)try{profile=normalizeProfile(JSON.parse(fs.readFileSync(profileFile,'utf8')));}catch{}
const accounts=require('./accounts.cjs').createAccounts({file:path.join(app.getPath('userData'),'account-session.enc'),safeStorage});
let gmailTimer,gmailGeneration=0;let memoryManager;let services,resizeWidth=null,closingApproved=false,closingWindow=false,restartRequested=false;
let library={bookmarks:[],folders:[],history:[],theme:'light',importReport:null}, overlay=false, importing=false;
let htmlFullscreen=null;
function exitPageFullscreen(){const wc=htmlFullscreen;htmlFullscreen=null;if(wc&&!wc.isDestroyed())wc.executeJavaScript('document.fullscreenElement ? document.exitFullscreen() : undefined').catch(()=>{});layout();}
function allowFullscreen(wc){return !!wc&&!wc.isDestroyed()&&!overlay&&tabs.some(t=>t.id===activeId&&t.view?.webContents===wc)&&/^https?:/.test(wc.getURL());}
let win, tabs = [], activeId = null, nextId = 1, timer,restoringSession=true, glass = 'Frosted glass', quitting = false, instagramApp;
const storeFile = path.join(app.getPath('userData'), 'tabs.json');
const sessionStore=createSessionStore({file:storeFile,enabled:!smoke||restartTest||process.env.PRISM_TEST_RECOVERY==='1',onError:()=>{console.warn('Prism could not save the session; the previous snapshot is retained.');emit();}});
const libraryFile=path.join(app.getPath('userData'),'library.json');
const vaultFile=path.join(app.getPath('userData'),'passwords.enc');
const walletFile=path.join(app.getPath('userData'),'cards.enc');
function readCards(){return secureFile(walletFile).read();}
// A page that has just become a favorite (dragged onto Favorites, Add to Favorites, moved up from Pinned) gets its
// preview card now instead of at its next visit (0.39.3).
function queueMissingPreview(){try{const t=tabs.find(x=>x.id===activeId);if(t?.url&&!services?.images()?.[t.url]?.thumbnail)queueFavoriteThumbnail(t);}catch{}}
// Favorites and pinned bookmarks without a stored icon (also ones saved by an older Prism, or never opened) get it fetched.
function warmFavoriteIcons(){return services?services.warmIcons(library.bookmarks.map(b=>b.url)).catch(()=>{}):Promise.resolve();}
let libraryTimer=null;function saveLibrary(){queueMissingPreview();if(smoke||libraryTimer)return;libraryTimer=setTimeout(()=>{flushLibrary();warmFavoriteIcons();},1500);}
function flushLibrary(){if(!libraryTimer)return;clearTimeout(libraryTimer);libraryTimer=null;fs.mkdirSync(path.dirname(libraryFile),{recursive:true});fs.writeFileSync(libraryFile+'.tmp',JSON.stringify(library),{mode:0o600});fs.renameSync(libraryFile+'.tmp',libraryFile);}
function saveEncrypted(file,data){return secureFile(file).write(data);}
async function savedTo(file,result){await secureFile(file).flush();return result;}
function readVault(){return secureFile(vaultFile).read();}
function importStore(kind){
 const file=path.join(app.getPath('userData'),'import-'+kind+'-undo.enc');
 return {read:()=>kind==='passwords'?readVault():structuredClone(library),write:async value=>{if(kind==='passwords')await saveEncrypted(vaultFile,value);else{library=value;saveLibrary();}},saveCheckpoint:value=>secureFile(file,()=>null).write(value),load:async()=>{const store=secureFile(file,()=>null);await store.load();return store.read();}};
}
async function undoImported(kind){const store=importStore(kind),checkpoint=await store.load();if(!checkpoint)return {error:'There is no import to undo.'};const choice=await dialog.showMessageBox(win,{message:'Undo the last '+kind+' import?',detail:'Undo is available only if the imported data has not changed since then.',buttons:['Cancel','Undo import'],defaultId:0,cancelId:0});if(choice.response!==1)return;await restoreCheckpoint({...store,checkpoint});emit();return {message:'Import undone.'};}
const browserPartition = smoke ? 'persist:smoke' : 'persist:prism';
// Force click on a link opens it in Lens (0.47). glass.node arms only while Chromium reports a link under the pointer.
let hoverLink={url:''};
function nativeGlass(){try{return require('./native/glass.node');}catch{return null;}}
function armForceClick(){nativeGlass()?.armForceClick?.(!!(hoverLink.url&&settings.forceClickLens!==false&&settings.trackpadGestures!==false));}
function forceClickLens(){const link=hoverLink;if(!link.url||settings.forceClickLens===false)return;peek?.open(link.url,link.space);}
// Each space suggests the pages opened in it (0.47); history from before 0.47 shows in every space.
const spaceHistory=()=>library.history.filter(h=>require('./browsing.cjs').inSpace(h,space));
const shellURL = require('node:url').pathToFileURL(path.join(__dirname, 'index.html')).href;
const {framesHoldState}=require('./frame-state.cjs');
// Unsaved input (0.39): only text someone typed that is still on the page counts, in a text area, a rich editor or a long
// single-line field. Search boxes, sign-in fields, short fields, sent chat messages and submitted forms do not, so
// closing a tab after searching or chatting no longer asks to discard input.
const tracker = `(() => { if (!globalThis.__prismTracking) { globalThis.__prismTracking = true; const typed = globalThis.__prismTyped = new Set();
 const skip = el => { if (el.matches?.('input')) { const t = (el.type||'text').toLowerCase(); if (!['text',''].includes(t)) return true; if (el.closest('[role=search],form[action*=search i]') || /search|query|^q$/i.test(el.name||el.id||'') || ['combobox','searchbox'].includes(el.getAttribute('role')) || /^(username|email|one-time-code|off)$/i.test(el.autocomplete||'')) return true; } return false; };
 addEventListener('input', e => { const el = e.composedPath?.()[0] || e.target; const field = el?.isContentEditable ? (el.closest('[contenteditable]:not([contenteditable=false])')||el) : el; if (field && (field.isContentEditable || field.matches?.('textarea,input')) && !skip(field) && typed.size < 50) typed.add(field); }, true);
 addEventListener('submit', e => { for (const el of [...typed]) if (e.target.contains?.(el)) typed.delete(el); }, true); }
 const kept = el => { if (!el.isConnected || !el.getClientRects().length) return false; if (el.isContentEditable) return (el.innerText||'').trim().length > 0; const v = (el.value||'').trim(); if (!v || v === (el.defaultValue||'').trim()) return false; return el.matches('textarea') || v.length >= 40; };
 return {frames:document.querySelectorAll('iframe,frame').length>0, dirty: [...globalThis.__prismTyped].some(kept), pip:!!document.pictureInPictureElement, media: [...document.querySelectorAll('audio,video')].some(m => !m.paused && !m.ended)}; })()`;
function accent(){const colors={sage:'#65826e',blue:'#507fad',violet:'#9275b5',rose:'#ad737c',graphite:'#747c86'};return colors[settings.tint]||'#'+systemPreferences.getAccentColor().slice(0,6);}
// Settings, site controls, Spaces and the other surfaces over the page sit in their own borderless child panel with
// native Liquid Glass behind them (0.43): Chromium draws every web view of a window into one layer, so glass inside the
// main window could only cover them. The surface turns translucent only once the glass is there (panelGlass).
let panelGlass=false;
function panelHost(host){let result='none';
 try{const kind=require('./native/glass.node').popover?.(host.getNativeWindowHandle());if(smoke)console.log('popover window: '+kind);}catch{}
 try{const material=accessibility().reduceTransparency||settings.material==='solid'?'solid':settings.material==='clear'?'clear':'regular';if(material!=='solid')result=require('./native/glass.node').configure(host.getNativeWindowHandle(),material,accent(),16);}catch{result='none';}
 // Test runs on other systems can pretend the glass is there to check the translucent styles.
 if(smoke&&process.env.PRISM_TEST_PANEL_GLASS)result='Native Liquid Glass';
 const on=/^Native/.test(result);if(on!==panelGlass){panelGlass=on;toolWindows?.publish();}}
function accessibility(){return {reduceTransparency:settings.reduceTransparency||nativeTheme.prefersReducedTransparency,highContrast:settings.highContrast||nativeTheme.shouldUseHighContrastColors};}
// Power saving (0.40): on battery, in Low Power Mode or while macOS is running hot, background tabs sleep after half
// their usual time (at least a minute), the glass logo rests instead of turning, favorite preview cards are not
// captured and Spectrum does not ask Apple Intelligence or Claude to name chapters. Everything returns on power.
// Electron has no Low Power Mode API, so `pmset -g` is read when the power source changes and when Prism becomes
// active (at most every 30 s); nothing polls.
const power={battery:false,lowPower:false,thermal:'nominal',readAt:0};
function powerSaving(){return power.battery||power.lowPower||power.thermal==='serious'||power.thermal==='critical';}
function powerChanged(){const before=power.saving;power.saving=powerSaving();if(before!==power.saving&&win)emit();}
function readLowPower(force=false){if(!force&&Date.now()-power.readAt<30000)return;power.readAt=Date.now();require('node:child_process').execFile('/usr/bin/pmset',['-g'],{timeout:3000},(error,out)=>{if(error)return;power.lowPower=/^\s*lowpowermode\s+1\b/m.test(String(out));powerChanged();});}
// Smoke runs behave as if plugged in (PRISM_TEST_POWER=real keeps the Mac's real power state): Electron 45 reports
// battery power correctly where 44 said "on AC", so flows that check previews or the turning logo would fail on battery.
function watchPower(){if(smoke&&process.env.PRISM_TEST_POWER!=='real')return;try{power.battery=powerMonitor.isOnBatteryPower();power.thermal=powerMonitor.getCurrentThermalState?.()||'nominal';}catch{}powerChanged();
 for(const event of ['on-battery','on-ac'])powerMonitor.on(event,()=>{power.battery=event==='on-battery';powerChanged();readLowPower(true);});
 powerMonitor.on('thermal-state-change',details=>{power.thermal=details?.state||power.thermal;powerChanged();});
 app.on('did-become-active',()=>readLowPower());readLowPower(true);}
function applyAppearance(){
  if(nativeTheme.themeSource!==settings.theme)nativeTheme.themeSource=settings.theme;
  if(!win||win.isDestroyed())return;
  try{glass=require('./native/glass.node').configure(win.getNativeWindowHandle(),accessibility().reduceTransparency?'solid':settings.material,accent(),settings.radius);}catch{glass='Native frosted glass';win.setVibrancy(accessibility().reduceTransparency?'under-window':'sidebar');}
}
// Private protections everywhere (0.35, Settings → Prism Shield): ordinary spaces keep no history and no Spectrum, hide
// this Mac's local network address from WebRTC and look names up over encrypted DNS. Cookies and sign-ins stay.
function quiet(tabSpace){return settings.privacyEverywhere?'private':tabSpace;}
function applyPrivacyEverywhere(){const on=!!settings.privacyEverywhere;syncDns();
 for(const t of tabs)if(t.view&&t.space!=='private'&&!t.view.webContents.isDestroyed())t.view.webContents.setWebRTCIPHandlingPolicy(on?'default_public_interface_only':'default');if(on)spectrum.focus(false,'','private');}
function snapshot() {
  const active = tabs.find(t => t.id === activeId);
  const privateMode=space==='private';
  return {naturalScroll,popover:{open:toolWindows?.visible()?toolWindows.section():null,returnTo:popoverReturn},account:privateMode?null:accounts.snapshot(),profile:privateMode?null:profile,split,inspecting:!!inspector?.isOpen(),ai:privateMode?null:ai?.snapshot(),updates:updateOverride||updater?.snapshot(),version:require('../package.json').version,blocking:blocker?.snapshot(active?.url,privateMode,active?.view?.webContents.id),space,privateNetwork:privateNetwork?.snapshot(),normalNetwork:normalNetwork?{...normalNetwork.snapshot(),hosts:siteBypass.hosts().length}:null,tabs: tabs.filter(t=>inSpace(t,space)).map(({view,recovery,restoring,scrollCapturePending,returns,linkClick,openedBy, ...t}) => ({...t,title:t.customTitle||t.title, sleeping: !view && !!t.url,reader:!!reader?.isOn(t.id)})), activeId, glass,panelGlass,settings:{...settings,extensions:undefined},system:{...accessibility(),powerSaving:!!power.saving,dark:nativeTheme.shouldUseDarkColors,accent:privateMode?'#9275b5':accent(),hardwareAcceleration:launchHardwareAcceleration,gpu:app.getGPUFeatureStatus(),restartRequired:settings.hardwareAcceleration!==launchHardwareAcceleration||settings.leanMemory!==launchLeanMemory},extensions:privateMode?[]:services?.extensionRows()||[],sidePanel:privateMode?null:sidePanels?.snapshot()||null,downloads:(privateMode?privateServices:services)?.downloads()||[],imageRevision:privateMode?'private':'normal-'+(services?.imageRevision()||0),images:privateMode?{}:services?.images()||{},passwords:privateMode&&!settings.privatePasswords?{message:'Password vault is disabled in Private.'}:passwords?.status()||{},browserPartition:privateMode?'private-disabled':browserPartition,activeWebContentsId:privateMode?-1:active?.view?.webContents.id||-1,bookmarks:privateMode?[]:library.bookmarks,folders:privateMode?[]:library.folders,folderIcons:privateMode?{}:library.folderIcons||{},theme:library.theme,importReport:privateMode?null:library.importReport,importing,sessionRecovery:sessionStore.status(),recentlyClosed:privateMode?[]:recentlyClosed.list(space),spaceTabs:tabs.reduce((n,t)=>{const k=t.space||'personal';n[k]=(n[k]||0)+1;return n;},{}),
    find,designTheme,chromium: process.versions.chrome,chromiumCheck:chromiumCheck.snapshot(), live: tabs.filter(t => t.view).length,archived:privateMode?0:(library.archive||[]).filter(e=>e.space===space).length,spectrum:privateMode?null:spectrum.revision(),media:privateMode?null:media?.snapshot()||null,compactReveal,pip:pip?.snapshot()||null,

    canBack: !!active?.view?.webContents.navigationHistory.canGoBack(), canForward: !!active?.view?.webContents.navigationHistory.canGoForward()};
}
const stateTransport=createStateTransport({held:true});let emitTimer=null,emitDue=0,lastEmit=0;
// Page title changes (tickers, unread counters) reach the shell at most every 500 ms; everything else goes at once.
function emit() { queueEmit(0); }
function emitLazy() { queueEmit(500); }
function queueEmit(gap) { const due=Math.max(Date.now(),lastEmit+gap);if(emitTimer&&emitDue<=due)return;if(emitTimer){clearTimeout(emitTimer.timeout);clearImmediate(emitTimer.immediate);}emitDue=due;const wait=due-Date.now();emitTimer=wait>0?{timeout:setTimeout(sendState,wait)}:{immediate:setImmediate(sendState)}; }
function sendState() { emitTimer=null;lastEmit=Date.now();if(win&&!win.isDestroyed()&&!win.webContents.isDestroyed()&&!stateTransport.held)win.webContents.send('state',stateTransport.prepare(snapshot()));toolWindows?.publish(); }
function persist() {
  if(restoringSession)return;
  sessionStore.schedule(captureSnapshot(tabs,activeId,selectedInSpace));if(!settings.privacyEverywhere)spectrum.moment(tabs);
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
  if(saved)for(const item of saved.tabs){const t=makeTab(item.url,false,validSpace(settings.spaces,item.space)?item.space:homeSpace());t.title=item.title;t.customTitle=item.customTitle||'';t.keepAwake=item.keepAwake;t.pinned=item.pinned;if(t.pinned){t.home=item.home||item.url;t.homeTitle=item.homeTitle||item.title;t.parked=!!item.parked;}if(Number.isFinite(item.lastUsed)&&item.lastUsed<=Date.now())t.lastUsed=item.lastUsed;t.recovery={navigation:item.navigation,scroll:item.scroll};if(item.favoriteId&&library.bookmarks.some(b=>b.id===item.favoriteId))t.favoriteId=item.favoriteId;}
  if(tabs.length)selectTab(tabs[Math.max(0,Math.min(saved?.activeIndex||0,tabs.length-1))].id);else makeTab();
 }finally{restoringSession=false;persist();}
}
const preconnected=new Map();function preconnect(url){try{const {protocol,origin}=new URL(url);if(!/^https?:$/.test(protocol)||Date.now()-(preconnected.get(origin)||0)<30000)return;preconnected.delete(origin);preconnected.set(origin,Date.now());if(preconnected.size>100)preconnected.delete(preconnected.keys().next().value);session.fromPartition(browserPartition).preconnect({url:origin,numSockets:1});}catch{}}
let pageArea=null,popoverReturn=null,popoverSeq=0;
// With the address bar in the sidebar (0.32) there is no toolbar above the page; a collapsed sidebar brings the toolbar back.
// Compact mode (0.32, compact-ui.js): no toolbar and no sidebar until the pointer reaches the window's left edge; the
// sidebar (with the address bar in it) then slides back and leaves again when the pointer does.
let compactReveal=false;
function toolbarTop(){return settings.compactMode||settings.addressBar==='sidebar'&&!settings.sidebarCollapsed?6:44;}
// 0.40.1: tabs stay in the window's view tree and are only hidden again. Taking hidden tabs out of the tree (0.40.0)
// made Prism crash and quit on its own.
function showTabView(view,visible){view.setVisible(visible);}
// Reader (0.45): after a page loads, a cheap check decides whether the address bar offers Reader. Pages that build
// their article late (single-page sites) are checked again a moment later.
const readerTimers=new WeakMap();
function readerProbe(t){clearTimeout(readerTimers.get(t));if(!reader||!/^https?:/.test(t.url||''))return;const run=async later=>{const wc=t.view?.webContents;if(!wc||wc.isDestroyed()||wc.isLoading()&&!later)return;const able=await reader.probe(wc);if(!tabs.includes(t))return;
 if(able!==!!t.readerable){t.readerable=able;if(inSpace(t,space))emitLazy();}if(!able&&!later){const timer=setTimeout(()=>run(true),2500);timer.unref?.();readerTimers.set(t,timer);}};const timer=setTimeout(()=>run(false),600);timer.unref?.();readerTimers.set(t,timer);}
function layout() {
 if(!win||win.isDestroyed())return;
 const [w,h]=win.getContentSize(),left=(settings.compactMode?!compactReveal:settings.sidebarCollapsed)?6:Math.min(resizeWidth??settings.sidebarWidth,w-400);
 if(split&&!split.ids.every(id=>tabs.some(t=>t.id===id&&inSpace(t,space))))split=null;
 const bar=split||inspector?.isOpen()?34:0,extra=find.open?42:0,inspectorWidth=0,top=toolbarTop();
 const panelWidth=space==='private'?0:sidePanels?.reserve()||0;
 const area={x:left,y:top+bar+extra,width:Math.max(1,w-left-6-panelWidth-(inspectorWidth?inspectorWidth+8:0)),height:Math.max(1,h-top-6-bar-extra)};pageArea=area;
 const pair=split?splitBounds(area,split.mode,split.ratio):null;
 const buttonY=15;if(win._prismButtonY!==buttonY){win.setWindowButtonPosition?.({x:22,y:buttonY});win._prismButtonY=buttonY;}
 const buttons=!(settings.compactMode&&!compactReveal);if(win._prismButtons!==buttons){win.setWindowButtonVisibility?.(buttons);win._prismButtons=buttons;}
 for(const t of tabs)if(t.view&&!t.pip){const full=htmlFullscreen===t.view.webContents;const visible=!overlay&&(htmlFullscreen?full:split?split.ids.includes(t.id):t.id===activeId);const bounds=full?{x:0,y:0,width:w,height:h}:pair&&split.ids.includes(t.id)?pair[split.ids.indexOf(t.id)]:area;const radius=full?0:10;if(t.view._prismRadius!==radius){t.view.setBorderRadius(radius);t.view._prismRadius=radius;}const key=JSON.stringify(bounds);if(visible&&t.view._prismBounds!==key){t.view.setBounds(bounds);t.view._prismBounds=key;}if(t.view._prismVisible!==visible){showTabView(t.view,visible);t.view._prismVisible=visible;}}
 sidePanels?.place(area,!overlay&&!htmlFullscreen&&space!=='private');reader?.place(area,!overlay&&!htmlFullscreen&&!split,activeId);peek?.follow();
 inspector?.layout({x:w-inspectorWidth-6,y:top+bar,width:Math.max(1,inspectorWidth),height:Math.max(1,h-top-6-bar)},!overlay&&!htmlFullscreen);
}

// Toolbar click on an extension without a popup, as in Chrome: openPanelOnActionClick toggles its side panel, otherwise
// chrome.action.onClicked goes to the extension (Claude opens its panel from there). With neither, Prism toggles the panel.
// An MV3 extension's service worker may be asleep (or still starting after install), and its onClicked listener is
// only known once it runs: wake it and give it up to two seconds before deciding there is no listener (0.34).
async function sideAction(id){
 const router=extensionApi.ctx.router,listens=()=>(router.listeners?.get('browserAction.onClicked')||[]).some(l=>l.extensionId===id);
 if(!listens()&&!sidePanels.behavior(id).openPanelOnActionClick){const ext=services.extensionRows().find(e=>e.id===id);const ses=session.fromPartition(browserPartition);
  if(ext?.serviceWorker){try{await ses.serviceWorkers.startWorkerForScope('chrome-extension://'+id+'/');}catch{}for(let i=0;i<20&&!listens();i++)await new Promise(r=>setTimeout(r,100));}}
 const t=tabs.find(t=>t.id===activeId),listening=listens();
 if(sidePanels.behavior(id).openPanelOnActionClick||(!listening&&sidePanels.has(id))){sidePanels.toggle(id);return true;}
 if(!t?.view||t.space==='private')return {error:'Open a page first.'};
 router.sendEvent(id,'browserAction.onClicked',extensionApi.ctx.store.tabDetailsCache.get(t.view.webContents.id)||{id:t.view.webContents.id});return true;
}
// "What's New" after an update: a small native window whose glass logo turns in first (the update sequence), then the
// release items from the bundled RELEASE notes. Shown once per version; Settings → Updates reopens it.
// Trackpad gestures (0.27): two-finger swipe between pages (src/gesture-preload.cjs), three-finger swipe, pinch and
// smart zoom. They follow Prism's setting and macOS's "Swipe between pages" (on unless the user turned it off).
let systemSwipe=true,naturalScroll=true;
const off=out=>/^\s*(0|false|no)\s*$/i.test(out);
// Swipes follow the fingers, so they need macOS's natural scrolling setting (on unless turned off) to read wheel deltas.
function readSystemSwipe(){const run=require('node:child_process').execFile;run('/usr/bin/defaults',['read','-g','AppleEnableSwipeNavigateWithScrolls'],(error,out)=>{systemSwipe=error?true:!off(out);});
 run('/usr/bin/defaults',['read','-g','com.apple.swipescrolldirection'],(error,out)=>{const value=error?true:!off(out);if(value!==naturalScroll){naturalScroll=value;emit();}});}
// Added to each frame of a page as it loads (0.39.3): frame preloads run in the top frame only, and the top frame never
// sees wheel events (or even the pointer) over a cross-origin frame, so a frame passes its sideways wheel events up to it, with whether it could scroll that way itself. It only reports
// wheel deltas the top frame would otherwise not see; at worst a frame could fake a swipe, which is no more than its
// own history.back().
const swipeForwarder=`(()=>{if(window.__prismSwipeForward||window===top)return;window.__prismSwipeForward=1;let until=0;
 const can=(t,dx)=>{const ok=n=>dx>0?n.scrollLeft+n.clientWidth<n.scrollWidth-1:n.scrollLeft>0;
  for(let n=t instanceof Element?t:null;n;n=n.parentElement||(n.getRootNode() instanceof ShadowRoot?n.getRootNode().host:null))if(n.scrollWidth>n.clientWidth+1&&/(auto|scroll|overlay)/.test(getComputedStyle(n).overflowX)&&ok(n))return true;
  const p=document.scrollingElement;return !!p&&p.scrollWidth>p.clientWidth+1&&ok(p);};
 addEventListener('wheel',e=>{if(!e.isTrusted||e.ctrlKey)return;const now=performance.now();if(!e.deltaX&&now>until)return;until=now+250;
  try{top.postMessage({prismSwipeWheel:1,dx:e.deltaX,dy:e.deltaY,l:can(e.target,-1),r:can(e.target,1),prevented:e.defaultPrevented},'*');}catch{}},{passive:true});})();`;
const swipeEnabled=()=>settings.trackpadGestures&&systemSwipe;
function registerGestures(ses){ses.registerPreloadScript({id:'prism-gestures',type:'frame',filePath:path.join(__dirname,'gesture-preload.cjs')});ses.registerPreloadScript({id:'prism-shield',type:'frame',filePath:path.join(__dirname,'shield-preload.cjs')});}
function applyPinch(wc){if(wc&&!wc.isDestroyed())wc.setVisualZoomLevelLimits(1,settings.trackpadGestures?3:1).catch(()=>{});}
function swipeRequest(event,value){const t=tabs.find(t=>t.view?.webContents===event.sender);if(!t||(t.id!==activeId&&!split?.ids.includes(t.id))||event.senderFrame!==event.sender.mainFrame)return null;
 const history=event.sender.navigationHistory;
 // The arrow wears the space's colour (or the theme's accent) and follows light/dark (0.38.2).
 if(value?.type==='query'){const sp=settings.spaces.find(x=>x.id===t.space),hex=/^#[0-9a-f]{6}$/i.test(sp?.color||'')?sp.color:t.space==='private'?'#9275b5':accent();return {accent:hex,dark:nativeTheme.shouldUseDarkColors,enabled:swipeEnabled(),natural:naturalScroll,back:history.canGoBack(),forward:history.canGoForward(),reduceMotion:!!settings.reduceMotion||systemPreferences.getAnimationSettings().prefersReducedMotion};}
 // A swipe now goes as soon as it is clearly past the line (0.44), so the rest of the same finger movement lands on the
 // page it went to; a second swipe within 700 ms is taken as that remainder and ignored.
 if(value?.type==='go'&&swipeEnabled()){const now=Date.now();if(now-(t.swipedAt||0)<700)return null;t.swipedAt=now;if(value.dir==='back'&&history.canGoBack())history.goBack();else if(value.dir==='forward'&&history.canGoForward())history.goForward();}
 return null;}
// The window opens where it was last closed (0.40), if that place is still on a connected display; else at 1240×820.
const frameFile=path.join(app.getPath('userData'),'window-frame.json');let frameTimer=null;
function windowFrame(){const fallback={width:1240,height:820};if(smoke)return fallback;try{const f=JSON.parse(fs.readFileSync(frameFile,'utf8'));if(![f.x,f.y,f.width,f.height].every(Number.isFinite)||f.width<760||f.height<560)return fallback;
 const area=screen.getDisplayMatching(f).workArea,overlap=Math.min(f.x+f.width,area.x+area.width)-Math.max(f.x,area.x)>=200&&Math.min(f.y+f.height,area.y+area.height)-Math.max(f.y,area.y)>=100;return overlap?{x:Math.round(f.x),y:Math.round(f.y),width:Math.round(f.width),height:Math.round(f.height)}:fallback;}catch{return fallback;}}
function saveFrame(now=false){if(smoke||!win||win.isDestroyed()||win.isFullScreen()||win.isMinimized())return;clearTimeout(frameTimer);frameTimer=null;const write=()=>{try{fs.writeFileSync(frameFile,JSON.stringify(win.getNormalBounds()),{mode:0o600});}catch{}};if(now)write();else{frameTimer=setTimeout(()=>{frameTimer=null;if(win&&!win.isDestroyed())write();},1000);frameTimer.unref?.();}}
let whatsNewWindow=null;
function showWhatsNew(){
 if(whatsNewWindow&&!whatsNewWindow.isDestroyed()){whatsNewWindow.focus();return;}
 const version=require('../package.json').version,flow=require('./update-flow.js');let notes={version,date:'',items:[]};
 try{notes=flow.releaseNotes(fs.readFileSync(path.join(__dirname,'..','RELEASE-'+version+'.md'),'utf8'),version);}catch{}
 // The window shows the six biggest changes (the release notes list them most important first); the full story is a
 // release notes page in a tab (0.36).
 const data={version,date:notes.date,items:notes.items.slice(0,6),more:notes.items.length>6,language:settings.language,dark:nativeTheme.shouldUseDarkColors,reduceMotion:!!settings.reduceMotion||accessibility().reduceMotion};
 const [wx,wy]=win.getPosition(),[ww]=win.getSize(),width=460,height=Math.min(700,420+Math.min(6,notes.items.length)*56);
 whatsNewWindow=new BrowserWindow({parent:win,width,height,x:Math.round(wx+(ww-width)/2),y:wy+90,show:false,resizable:false,minimizable:false,maximizable:false,fullscreenable:false,titleBarStyle:'hiddenInset',vibrancy:'under-window',visualEffectState:'active',transparent:true,backgroundColor:'#00000000',title:translate(settings.language,'What’s New'),webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});
 const wc=whatsNewWindow.webContents;wc.setWindowOpenHandler(()=>({action:'deny'}));wc.on('will-navigate',(e,url)=>{e.preventDefault();if(url===require('./release-notes.cjs').URL){whatsNewWindow?.close();action('release-notes');}});
 whatsNewWindow.once('ready-to-show',()=>whatsNewWindow?.show());whatsNewWindow.once('closed',()=>{whatsNewWindow=null;});
 whatsNewWindow.loadFile(path.join(__dirname,'whats-new.html'),{query:{data:JSON.stringify(data)}}).catch(()=>{});
}
function checkWhatsNew(){
 const decision=require('./update-flow.js').whatsNew({current:require('../package.json').version,seen:settings.whatsNewSeen,onboarded:settings.onboardingComplete});
 if(decision.record){settings.whatsNewSeen=decision.record;saveSettings();}
 if(decision.show&&!smoke)setTimeout(()=>{if(win&&!win.isDestroyed())showWhatsNew();},900);
}
function queueFavoriteThumbnail(t){if(t&&!power.saving&&t.space!=='private'&&settings.favoriteStyle==='cards'&&library.bookmarks.some(b=>b.favorite&&b.url===t.url))setImmediate(()=>services?.thumbnail(t));}
let externalLinks=null;const externalLinkHooks={prompt:p=>externalPrompt(p),open:url=>smoke?Promise.resolve():shell.openExternal(url,{activate:true})};
// Hands app links (a sign-in page returning to myapp://…) to macOS after the user agrees; never navigates the tab to them.
function openExternalLink(wc,url,isPrivate){if(!externalLinks||wc.isDestroyed())return;externalLinks.request({url,from:wc.getURL(),isPrivate,source:wc.id}).catch(()=>{});}
function externalPrompt({app:name,site,canRemember}){const t=text=>translate(settings.language,text),host=site?new URL(site).host:t('This page');if(win&&!win.isDestroyed()&&win.isMinimized())win.restore();win?.focus();return dialog.showMessageBox(win,{type:'question',message:t('Open “{app}”?').replace('{app}',name),detail:t('{site} wants to open this link with {app}.').replace('{site}',host).replace('{app}',name),buttons:[t('Cancel'),t('Open {app}').replace('{app}',name)],defaultId:1,cancelId:0,...(canRemember?{checkboxLabel:t('Always allow {site} to open these links').replace('{site}',host)}:{})}).then(r=>({open:r.response===1,remember:r.checkboxChecked}));}
// OAuth popups keep window.opener so the sign-in page can postMessage back and close itself.
// Open in background (0.35): a middle click, ⌘-click or the link menu opens the page next to the tab it came from and
// starts loading it there, while you stay where you are.
function openInBackground(url,opener){const t=makeTab(url,false,opener.space);const after=tabs.indexOf(opener);if(after>=0){tabs.splice(tabs.indexOf(t),1);let at=after+1;while(tabs[at]&&tabs[at].openedBy===opener.id)at++;tabs.splice(at,0,t);}t.openedBy=opener.id;t.lastUsed=Date.now();
 warming=t;try{attach(t);}finally{warming=null;}const front=tabs.find(x=>x.id===activeId);if(front?.view&&front.space!=='private')extensionApi?.selectTab(front.view.webContents);persist();emit();feedback('background-tab');return t;}
// Google Lens takes an uploaded image as a form post, as Chrome sends it; the new tab makes that request when it loads.
function lensSearch(png){const boundary='----PrismLens'+randomUUID().replace(/-/g,''),body=Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="encoded_image"; filename="image.png"\r\nContent-Type: image/png\r\n\r\n`),png,Buffer.from(`\r\n--${boundary}--\r\n`)]);
 const t=makeTab('https://lens.google.com/',false,space);t.title='Google Lens';t.pendingPost={url:'https://lens.google.com/v3/upload?ep=ccm&s=&st='+Date.now(),body,type:'multipart/form-data; boundary='+boundary};selectTab(t.id);persist();}
// Beam's assistant (0.37, Apple Intelligence since 0.38): a question or a request in plain words. Claude or Apple
// Intelligence picks the tab, bookmark, page or action that does it (from what Beam found), or answers in a few sentences.
async function beamAsk(query){
 if(space==='private'||!ai?.beamName())return {answer:menuLabel('Choose Claude or Apple Intelligence in Settings → AI & assistants to ask Beam.')};
 const candidates=require('./command-bar.cjs').rank(query,commandEntries(query),40).filter(e=>e.kind!=='ai'&&e.kind!=='go').map(e=>({id:e.id,kind:e.kind,title:String(e.title).slice(0,120),...(e.detail?{address:String(e.detail).slice(0,200)}:{})}));
 // The on-device model does best with a short list: what matched the words, then Prism's actions.
 const local=ai.beamName()==='Apple Intelligence',items=[...candidates.slice(0,local?12:40),...commandActions().map(({id,title})=>({id,kind:'action',title})).filter(a=>!candidates.some(c=>c.id===a.id))].slice(0,local?30:80);
 // A plain question is answered, never turned into an action (the on-device model sometimes reached for one).
 const question=/^(what|who|whom|whose|when|where|why|how|which|is|are|was|were|can|could|do|does|did|should|will|would|ne|nasıl|neden|kim|nerede|kaç)\b|\?\s*$/i.test(query.trim());
 try{const result=await ai.beam({request:query,items:question?[]:items});
  if(result.run&&items.some(c=>c.id===result.run)){setImmediate(()=>Promise.resolve(commandRun(result.run,{query,alt:false})).catch(()=>{}));return {ran:true};}
  return {answer:String(result.answer||'').slice(0,4000)||menuLabel('No answer came back.')};
 }catch(error){return {answer:error.message};}
}
function guardPopup(child,t){const wc=child.webContents,isPrivate=t.space==='private';wc.setWindowOpenHandler(({url})=>{if(/^https?:\/\//i.test(url))makeTab(url,true,t.space);else openExternalLink(wc,url,isPrivate);return {action:'deny'};});for(const event of ['will-navigate','will-redirect'])wc.on(event,(e,url)=>{if(!allowedTabURL(url)){e.preventDefault();openExternalLink(wc,url,isPrivate);}});const close=()=>{if(!child.isDestroyed())child.destroy();};win.once('closed',close);child.once('closed',()=>win?.removeListener('closed',close));}
// Granted without a prompt, as in Chrome: Chromium itself requires a click or key press before a page can write the
// clipboard or lock the pointer, and Esc always releases the pointer. Reading the clipboard asks (site-permissions.cjs).
// File access ("fileSystem") follows the file or folder the user just picked in the macOS open/save panel, which is
// the consent; denying it made upload buttons on sites using the File System Access API do nothing.
const openWithoutPrompt=new Set(['clipboard-sanitized-write','pointerLock','fileSystem','display-capture','keyboardLock','speaker-selection']);
function allowedTabURL(url){try{const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)||(parsed.protocol==='chrome-extension:'&&!!session.fromPartition(browserPartition).extensions.getExtension(parsed.hostname))||url==='about:blank';}catch{return false;}}
function pageWebPreferences(isPrivate){return {session:isPrivate?privateSession:session.fromPartition(browserPartition),disableDialogs:smoke,safeDialogs:true,preload:path.join(__dirname,'page-preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,allowRunningInsecureContent:false};}
// Peek (0.32, peek.cjs): a link to another site clicked in a pinned tab or favorite opens over the page instead of
// taking the tab away from its site. The click is reported by page-preload.cjs, so redirects and scripts never peek.
const siteOf=url=>{try{return new URL(url).hostname.split('.').slice(-2).join('.');}catch{return '';}};
function peekLink(t,url){const click=t.linkClick;if(!peek||!(t.pinned||t.favoriteId)||!click||click.url!==url||Date.now()-click.at>2000||!/^https?:/.test(url))return false;if(siteOf(url)===siteOf(t.view?.webContents.getURL()||t.url))return false;t.linkClick=null;return peek.open(url,t.space);}
function makeTab(url = '', activate = true,tabSpace=space) {
  const t = {id:nextId++, space:tabSpace,pinned:false,navigationVersion:0,url, title:url ? new URL(url).hostname : 'New tab', view:null,lastUsed:Date.now(),keepAwake:false,audible:false,loading:false,dirty:false,error:''};
  tabs.push(t); if (activate) selectTab(t.id); else emit(); return t;
}
function attach(t) {
  if (t.view || !t.url) return;
  const isPrivate=t.space==='private';
  const view = new WebContentsView({webPreferences:pageWebPreferences(isPrivate)});
  view.setBorderRadius(10);t.view = view; win.contentView.addChildView(view); layout();
  const wc = view.webContents;blocker?.attach(wc,isPrivate);if(!isPrivate){extensionApi?.addTab(wc,win);devices?.attachBluetooth(wc);}wc.setZoomFactor(settings.pageZoom);applyPinch(wc);
  if(isPrivate)wc.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');else if(settings.privacyEverywhere)wc.setWebRTCIPHandlingPolicy('default_public_interface_only');
  wc.setWindowOpenHandler(({url,disposition}) => {if(disposition==='new-window'&&(/^https?:\/\//i.test(url)||url==='about:blank'||url===''))return {action:'allow',overrideBrowserWindowOptions:{autoHideMenuBar:true,backgroundColor:'#ffffff',fullscreenable:false,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,allowRunningInsecureContent:false}}};if(disposition!=='background-tab'&&peekLink(t,url))return {action:'deny'};if (/^https?:\/\//i.test(url)){if(disposition==='background-tab')openInBackground(url,t);else makeTab(url,true,t.space);} else openExternalLink(wc,url,isPrivate); return {action:'deny'};});
  wc.on('did-create-window',child=>guardPopup(child,t));
  wc.on('enter-html-full-screen',()=>{if(!allowFullscreen(wc)){wc.executeJavaScript('document.exitFullscreen()').catch(()=>{});return;}autofill?.dismiss();htmlFullscreen=wc;layout();});
  wc.on('leave-html-full-screen',()=>{if(htmlFullscreen===wc){htmlFullscreen=null;layout();}});
  wc.on('will-navigate', (event,url) => {if (!allowedTabURL(url)) {event.preventDefault();openExternalLink(wc,url,isPrivate);}else if(peekLink(t,url))event.preventDefault();});
  wc.on('will-redirect', (event,url,_inPlace,main) => {if (!allowedTabURL(url)) {event.preventDefault();if(main)openExternalLink(wc,url,isPrivate);}});
  wc.on('focus',()=>{if(split?.ids.includes(t.id)&&t.id!==activeId)selectTab(t.id);});
  // Force click (0.47): the link under the pointer arms the native deep-press hook; see forceClickLens().
  wc.on('update-target-url',(_e,url)=>{if(t.id!==activeId&&!split?.ids.includes(t.id))return;hoverLink={url:/^https?:\/\//i.test(url||'')?url:'',space:t.space,tab:t.id};armForceClick();});
  wc.on('context-menu',(_event,params)=>{if(t.view!==view||t.id!==activeId)return;const items=pageMenu({wc,params,clipboard,inspect:()=>inspector.open(wc,params),pip:()=>pictureInPicture(t,params.frame),peek:link=>peek?.open(link,t.space),translate:isPrivate?null:()=>action('page-ai-open-selection'),openTab:(url,activate=true)=>activate?makeTab(url,true,t.space):openInBackground(url,t),bookmark:isPrivate?null:()=>{if(t.id===activeId)action('bookmark-current');},extensions:isPrivate?[]:extensionApi?.getContextMenuItems(wc,params)||[]});Menu.buildFromTemplate(items).popup({window:win});});
  // Only a title that changed, on a tab of the space on screen, is sent to the window (0.40); tickers in other spaces and
  // repeated titles used to re-send the whole state.
  wc.on('page-title-updated', (_e,title) => {const changed=t.title!==title;t.title=title;if(t.id===activeId)spectrum.presence(t.url,quiet(t.space),title);if(!isPrivate&&!settings.privacyEverywhere){const row=library.history.find(x=>x.url===cleanURL(wc.getURL()));if(row){row.title=String(title).slice(0,500);saveLibrary();}}if(changed&&inSpace(t,space))emitLazy();});
  wc.on('did-start-loading', () => {const changed=!t.loading||!!t.error;t.loading=true; t.error=''; if(changed)emit();});
  wc.on('did-start-navigation',(_event,_url,inPlace,main)=>{if(main){if(t.id===activeId){pageAssistant?.cancel();if(toolWindows?.section()==='page-assistant')toolWindows.closeAll();}if(htmlFullscreen===wc)exitPageFullscreen();if(t.id===activeId){passwords?.cancelPicker();autofill?.dismiss();}if(!inPlace)t.navigationVersion++;}});
  wc.on('did-frame-finish-load',(_event,isMain,processId,routingId)=>{if(!isMain&&swipeEnabled())try{require('electron').webFrameMain.fromId(processId,routingId)?.executeJavaScript(swipeForwarder).catch(()=>{});}catch{}});
  wc.once('did-finish-load',()=>bootMark('first-tab-load'));
  wc.on('did-stop-loading', () => {const changed=t.loading;t.loading=false; if(changed)emit();if(!isPrivate&&!power.saving&&t.id===activeId&&library.bookmarks.some(b=>b.favorite&&b.url===t.url))services?.thumbnail(t);});
  wc.on('page-favicon-updated',(_event,urls)=>{if(!isPrivate&&/^https?:/.test(t.url)&&library.bookmarks.some(b=>new URL(b.url).origin===new URL(t.url).origin)&&urls[0])services?.favicon(t.url,urls[0]);});
  wc.on('dom-ready', () => {applyPinch(wc);if(!isPrivate)wc.executeJavaScript(require('./media.cjs').TRACK).catch(()=>{});if(!isPrivate)siteControls?.apply(wc).catch(()=>{});wc.executeJavaScriptInIsolatedWorld(999,[{code:tracker}]).catch(()=>{});});
  const navigated = (_event,_url,main=true) => {if(!main)return;// A new page leaves Reader (0.45); an in-page change only when it moves to another path (a single-page site's next article).
    {let moved=_event===undefined;if(!moved)try{moved=new URL(wc.getURL()).pathname!==new URL(t.url||wc.getURL()).pathname;}catch{}if(moved){reader?.close(t.id);t.readerable=false;readerProbe(t);}}t.url=wc.getURL();t.dirty=false;captureNavigation(t);if(t.id===activeId)spectrum.presence(t.url,quiet(t.space));if(!isPrivate&&!settings.privacyEverywhere){library.history=visit(library.history,t);saveLibrary();}if(t.id===activeId)closeFind(false);emit();persist();};
  wc.on('did-navigate',()=>navigated());wc.on('did-finish-load',()=>readerProbe(t)); wc.on('did-navigate-in-page', navigated);
  wc.on('found-in-page',(_event,result)=>{if(t.id===activeId&&find.open&&result.requestId===find.requestId){find.matches=result.matches;find.active=result.activeMatchOrdinal;emit();}});
  wc.on('media-started-playing', () => {t.audible=true; emit();media?.update(t);});
  wc.on('media-paused', () => {t.audible=wc.isCurrentlyAudible(); emit();media?.update(t);});
  wc.on('did-fail-load', (_e,code,description,_url,main) => {if (main && code!==-3) {t.error=description; emit();}});
  wc.on('unresponsive',()=>{t.hung=true;});wc.on('responsive',()=>{t.hung=false;});
  wc.on('render-process-gone', (_e,details) => {t.error='Page stopped: '+details.reason; dispose(t); emit();});
  wc.on('before-input-event', (event,input) => {
    if(input.type==='keyDown'&&(input.meta||input.control)&&input.shift&&input.key.toLowerCase()==='c'){event.preventDefault();action('copy-page-url');return;}
    if ((input.meta || input.control) && ['l','t','k','w','r','d','f','y'].includes(input.key.toLowerCase()) && input.type==='keyDown') {
      event.preventDefault(); command(input.shift&&input.key.toLowerCase()==='t'?'reopen':input.key.toLowerCase());
    }
  });
  if(isPrivate){const network=privateNetwork;network.ensureStarted().then(()=>{if(t.view!==view||wc.isDestroyed())return;const post=t.pendingPost;delete t.pendingPost;return post?wc.loadURL(post.url,{postData:[{type:'rawData',bytes:post.body}],extraHeaders:'Content-Type: '+post.type}):wc.loadURL(t.url);}).catch(error=>{if(t.view===view){t.error=error.message;emit();}});}else loadNormal(t,view);
}
async function loadNormal(t,view){
 const wc=view.webContents,saved=t.recovery,nav=navigationRecord(saved?.navigation,recoveryURL(t.url),t.title);t.restoring=true;
 try{const post=t.pendingPost;delete t.pendingPost;if(post)await wc.loadURL(post.url,{postData:[{type:'rawData',bytes:post.body}],extraHeaders:'Content-Type: '+post.type});else if(saved?.navigation&&nav)await wc.navigationHistory.restore(nav);else await wc.loadURL(t.url);if(t.view!==view||wc.isDestroyed())return;const scroll=scrollRecord(saved?.scroll,recoveryURL(wc.getURL()));if(scroll)await wc.executeJavaScriptInIsolatedWorld(999,[{code:`scrollTo(${scroll.x},${scroll.y})`}]);}
 catch(error){if(t.view===view&&!wc.isDestroyed())t.error=error.message;}
 finally{if(t.view===view&&view.webContents&&!wc.isDestroyed()){t.restoring=false;captureNavigation(t);persist();emit();}}
}
function dispose(t) {
  if(inspector?.owner()===t.view?.webContents)inspector.close();
  if(htmlFullscreen===t.view?.webContents)exitPageFullscreen();
  if(t.id===activeId)autofill?.dismiss();
  captureNavigation(t);if(t.id===activeId)passwords?.cancelPicker();
  const view=t.view; if (!view) return;media?.forget(t.id);
  t.view=null; t.loading=false; t.audible=false;
  win?.contentView.removeChildView(view);
  if (!view.webContents.isDestroyed()) {if(t.space!=='private'){sidePanels?.forgetTab(view.webContents.id);extensionApi?.removeTab(view.webContents);}if(t.hung){t.hung=false;try{view.webContents.forcefullyCrashRenderer();}catch{}}view.webContents.close();}
}
function selectTab(id) {
  if(id!==activeId){inspector?.close();peek?.close();if(split){const target=tabs.find(t=>t.id===id);if(!target?.url||!inSpace(target,space))split=null;else if(!split.ids.includes(id)){split.ids[split.ids.indexOf(activeId)===1?1:0]=id;}}gmailGeneration++;toolWindows?.closeAll();if(htmlFullscreen)exitPageFullscreen();}
  autofill?.dismiss();
  const t=tabs.find(t=>t.id===id); if (!t) return;
  const old=tabs.find(t=>t.id===activeId); if (old){old.lastUsed=Date.now();captureScroll(old);}
  // Picture in picture (0.32): leaving a tab whose video is playing floats the video; coming back to it returns it.
  if(t.pip)pip?.end('return');else if(old&&old.id!==id&&settings.autoPip&&old.view&&old.audible&&!old.pip&&!split?.ids.includes(old.id))pip?.enter(old,{auto:true});
  if(id!==activeId){closeFind(false);passwords?.closeManager();}
  t.parked=false;{const now=Date.now();t.returns=[...(t.returns||[]).filter(x=>now-x<3600000),now].slice(-12);}space=t.space||'personal';tabSelection.select(t.id);selectedInSpace[space]=id;activeId=id; t.lastUsed=Date.now(); attach(t); if(t.view&&space!=='private')extensionApi?.selectTab(t.view.webContents);sidePanels?.sync();layout(); emit(); persist();queueFavoriteThumbnail(t);spectrum.presence(t.url,quiet(t.space),t.title);
}
// How long a tab may sit unused before the idle timer puts it to sleep (0.33.2). Pinned tabs, favorites and tabs you
// keep coming back to (three times in the last hour) get four times the setting and at least 20 minutes, so the tabs
// you live in are not reloaded every time you return to them. Real memory pressure can still put any of them to sleep.
function returnsOften(t,now=Date.now()){return (t.returns||[]).filter(x=>now-x<3600000).length>=3;}
function idleLimit(t){const base=power.saving?Math.max(60000,settings.sleepMinutes*30000):settings.sleepMinutes*60000;return t.pinned||t.favoriteId||returnsOften(t)?Math.max(base*4,20*60000):base;}
async function sleepTab(t, manual=false) {
  if (!t?.view||t.pip||t.id===activeId||split?.ids.includes(t.id)||t.keepAwake||t.loading||t.audible) return false;
  if(!manual&&Date.now()-t.lastUsed<idleLimit(t))return false;
  const view=t.view,wc=view.webContents,version=t.navigationVersion;
  try {const state=await pageState(wc); if(!state||state.pip)return false;t.dirty=state.dirty;t.frames=state.frames&&await within(framesHoldState(wc.mainFrame),1500,true);t.capturing=wc.isBeingCaptured(); t.audible=state.media || wc.isCurrentlyAudible();} catch {return false;}
  if(t.view!==view||wc.isDestroyed()||t.navigationVersion!==version)return false;
  if (!manual && Date.now()-t.lastUsed<idleLimit(t))return false;
  if(split?.ids.includes(t.id))return false;
  if (!canSleep(t, activeId, Date.now(), true)) return false;
  await captureScroll(t);if(t.view!==view||t.id===activeId||split?.ids.includes(t.id)||t.navigationVersion!==version)return false;dispose(t);persist();emit();return true;
}
const {archiveCandidates,addToArchive,normalizeArchive}=require('./archive.cjs');
function archiveIdle(){const idle=archiveCandidates(tabs,{activeId,split:split?.ids,after:settings.archiveAfter});if(!idle.length)return;library.archive=addToArchive(library.archive,idle);for(const t of idle){tabSelection.remove(t.id);tabs.splice(tabs.indexOf(t),1);}saveLibrary();persist();emit();}
function archiveAction(name,value){
 if(space==='private')return {error:'Private does not keep an archive.'};const list=library.archive||[];
 if(name==='archive-list')return list.filter(e=>e.space===space).slice(0,150);
 if(name==='archive-clear'){library.archive=list.filter(e=>e.space!==space);saveLibrary();emit();return;}
 const entry=list.find(e=>e.id===value);if(!entry)return;library.archive=list.filter(e=>e!==entry);saveLibrary();
 if(name==='archive-restore'){const t=makeTab(entry.url,false,validSpace(settings.spaces,entry.space)?entry.space:space);t.title=entry.title;selectTab(t.id);}
 emit();
}
// Command bar (0.32, command-bar.cjs, ⌘K): what it can find and do. Private shows only its own tabs and actions.
function commandActions(){
 const panel=section=>()=>win.webContents.send('open-panel',section),set=(key,value)=>action('set-setting',{key,value}),page=!!tabs.find(t=>t.id===activeId)?.view;
 return [
  ['new-tab','New tab','plus','open blank',()=>action('new')],
  ['reopen','Reopen closed tab','history','undo restore',()=>action('reopen')],
  ['lens-window','New Lens window','expand','quick little small window peek float',()=>action('lens-window')],
  ['tidy','Tidy tabs','archive','clean clear old idle sweep archive',()=>action('tidy')],
  ['tour','Show me around','sparkles','tour guide help tips where welcome',()=>action('tour')],
  ...(page?[['add-to-dock','Add to Dock…','plus','web app install application pwa',()=>action('add-to-dock')]]:[]),
  ...(page?[[ 'reader',reader?.isOn(activeId)?'Hide Reader':'Show Reader','reader','article read clean text',()=>action('reader-toggle')]]:[]),
  ['sidebar',settings.sidebarCollapsed?'Show sidebar':'Hide sidebar','sidebar','toggle',()=>set('sidebarCollapsed',!settings.sidebarCollapsed)],
  ['address',settings.addressBar==='sidebar'?'Move address bar above the page':'Move address bar to the sidebar','sidebar','url toolbar location',()=>set('addressBar',settings.addressBar==='sidebar'?'top':'sidebar')],
  ['compact',settings.compactMode?'Turn off Clear view':'Turn on Clear view','expand','focus hide sidebar toolbar',()=>set('compactMode',!settings.compactMode)],
  ...(page?[['pip','Picture in Picture','pip','video float',()=>action('pip')],['copy','Copy page link','copy','url share',()=>action('copy-page-url')],['bookmark','Bookmark this page','star','save favorite',()=>action('bookmark-current')],['find','Find in page','search','',()=>command('f')],['reload','Reload page','reload','refresh',()=>command('r')]]:[]),
  ['split','Split view','sidebar','side by side two pages',panel('workspace')],
  ['tidy','Organize tabs by site','sort','tidy group',()=>action('tabs-tidy')],
  ['sleep','Sleep background tabs','moon','memory free',()=>action('sleep')],
  ['history','History','history','',()=>command('y')],
  ['downloads','Downloads','download','files',panel('downloads')],
  ['settings','Settings','settings','preferences',panel('appearance')],
  // Settings pages and browser places (0.35), so Beam reaches anything in a few letters.
  ...[['appearance','Appearance','brush','theme look colour dark light glass'],['design','Customize','brush','design theme wallpaper'],['workspace','Tabs & layout','sidebar','tabs sidebar sleep archive'],['performance','Performance','power','memory speed sleep'],['blocking','Prism Shield','shield','ads trackers blocker privacy'],['passwords','Passwords','key','logins credentials'],['extensions','Extensions','extension','add-ons plugins'],['ai','AI & assistants','sparkles','apple intelligence chatgpt'],['private','Private network','lock','zapret proxy private'],['accessibility','Accessibility','accessibility','text size contrast motion'],['updates','Updates','reload','version chromium'],['profile','Profile','folder','account name'],['imports','Imports','download','arc chrome import bookmarks'],['permissions','Site permissions','lock','camera microphone location']].map(([section,title,icon,keywords])=>['open-'+section,title,icon,'settings '+keywords,panel(section)]),
  ['release-notes','Release notes','history','what’s new changes version',()=>action('release-notes')],
  ['image-search','Search with an image','image','picture photo google lens reverse',()=>action('image-search')],
  ['web-store','Chrome Web Store','extension','extensions add install',()=>action('web-store')],
  ['passwords-app','Open Passwords app','key','apple keychain',()=>action('apple-passwords')],
  ['private-tab','New Private tab','lock','incognito',()=>action('space','private').then(()=>makeTab()).catch(()=>{})],
  ['close-all','Close all tabs','close','clear',()=>action('tabs-close',{mode:'all'})],
  ...[...settings.spaces,{id:'private',name:'Private'}].filter(s=>s.id!==space).map(s=>['space-'+s.id,s.name,'folder','space switch go to '+s.name,()=>action('space',s.id)])
 ].map(([id,title,icon,keywords,go])=>({id:'action:'+id,kind:'action',title,icon,keywords,go}));
}
function commandEntries(query){
 const privateMode=space==='private',images=privateMode?{}:services?.images()||{},q=query.trim();
 const image=url=>{try{return images[url]?.icon||images[new URL(url).origin]?.icon||'';}catch{return '';}};
 // How often and how lately each page was visited (history), so Beam ranks the sites you use first (0.44).
 const seen=new Map();if(!privateMode)for(const h of library.history)if(!seen.has(h.url))seen.set(h.url,h);const use=url=>{const h=seen.get(url);return h?{visits:Number(h.visits)||1,visitedAt:h.visitedAt}:{};};
 const open=tabs.filter(t=>inSpace(t,space)&&t.url).map(t=>({id:'tab:'+t.id,kind:'tab',title:t.customTitle||t.title||t.url,detail:t.url,image:image(t.url),lastUsed:t.id===activeId?0:t.lastUsed,...use(t.url)}));
 const actions=commandActions().map(({go,...a})=>a);
 // Nothing typed: the tabs you were just in, then pages you recently visited that are not open, then a few actions.
 if(!q){const recentTabs=open.filter(t=>t.lastUsed).sort((a,b)=>b.lastUsed-a.lastUsed).slice(0,4),openURLs=new Set(open.map(t=>t.detail));
  const recent=privateMode?[]:spaceHistory().filter(h=>!openURLs.has(h.url)).slice(0,8-recentTabs.length).map(h=>({id:'history:'+h.url,kind:'history',title:h.title||h.url,detail:h.url,image:image(h.url),hint:'Recently visited'}));
  return [...recentTabs,...recent,...actions.filter(a=>['action:new-tab','action:reopen'].includes(a.id))];}
 const out=[];const sum=require('./command-bar.cjs').calc(q);if(sum!==null)out.push({id:'calc',kind:'calc',title:'= '+sum,detail:sum,hint:'Copy',icon:'copy'});const url=normalizeAddress(q);if(url&&sum===null){const search=url.startsWith('https://www.google.com/search?');out.push({id:'go',kind:'go',title:search?'Search for “{q}”'.replace('{q}',q.slice(0,80)):url.replace(/^https?:\/\//,''),hint:search?'Search':'Open',icon:search?'search':'external'});}
 {const assistant=!privateMode&&ai?.beamName();if(assistant&&q.length>2)out.push({id:'ai',kind:'ai',title:menuLabel(assistant==='Claude'?'Ask Claude':'Ask Apple Intelligence')+' — '+q.slice(0,80),icon:'sparkles',hint:assistant});}
 out.push(...open);
 if(!privateMode){out.push(...library.bookmarks.map(b=>({id:'bookmark:'+b.id,kind:b.favorite?'favorite':'bookmark',title:b.title||b.url,detail:b.url,image:image(b.url),...use(b.url)})));out.push(...(library.archive||[]).filter(e=>e.space===space).map(e=>({id:'archive:'+e.id,kind:'archive',title:e.title,detail:e.url,image:image(e.url)})));out.push(...spaceHistory().map(h=>({id:'history:'+h.url,kind:'history',title:h.title||h.url,detail:h.url,image:image(h.url),visits:Number(h.visits)||1,visitedAt:h.visitedAt})));}
 out.push(...actions);return out;
}
// Search suggestions in Beam (0.39): as you type, Google's suggestions appear under the top results, the way Google's
// own search box completes a query. Only the typed text is sent, without cookies. Never in Private, with privacy
// everywhere, or with Settings → Search suggestions off.
const suggestCache=new Map();
async function searchSuggestions(query){const q=String(query||'').trim();
 if(space==='private'||settings.privacyEverywhere||settings.searchSuggestions===false||q.length<2||q.length>120||/^[a-z][a-z0-9+.-]*:\/\//i.test(q))return [];
 const key=settings.language+'\n'+q.toLowerCase();if(suggestCache.has(key))return suggestCache.get(key);
 try{const res=await require('electron').net.fetch('https://suggestqueries.google.com/complete/search?client=firefox&ie=utf-8&oe=utf-8&hl='+encodeURIComponent(settings.language||'en')+'&q='+encodeURIComponent(q),{credentials:'omit',signal:AbortSignal.timeout(2500)});
  if(!res.ok)return [];const data=await res.json();const rows=(Array.isArray(data?.[1])?data[1]:[]).filter(s=>typeof s==='string'&&s.trim()).slice(0,6).map(s=>({id:'suggest:'+s.slice(0,200),kind:'suggest',title:s.slice(0,200),icon:'search',hint:'Search'}));
  suggestCache.set(key,rows);if(suggestCache.size>200)suggestCache.delete(suggestCache.keys().next().value);return rows;}catch{return [];}}
function commandRun(id,{query,alt}){
 const [kind,rest]=[id.split(':')[0],id.slice(id.indexOf(':')+1)];
 if(id==='calc'){const sum=require('./command-bar.cjs').calc(query);if(sum!==null){clipboard.writeText(sum);feedback('copied');}return;}
 if(id==='go'){const url=normalizeAddress(query);if(!url)return;if(alt&&tabs.find(t=>t.id===activeId))return action('navigate',query);makeTab(url,true,space);persist();return;}
 if(kind==='tab'){const tabId=Number(rest);if(tabs.some(t=>t.id===tabId&&inSpace(t,space)))selectTab(tabId);return;}
 if(space==='private'&&kind!=='action')return;
 if(kind==='suggest'){const url=normalizeAddress(rest);if(url){makeTab(url,true,space);persist();}return;}
 if(kind==='bookmark')return action('open-bookmark',rest);
 if(kind==='archive')return archiveAction('archive-restore',rest);
 if(kind==='history'&&/^https?:\/\//.test(rest)){makeTab(rest,true,space);persist();return;}
 if(kind==='action')return commandActions().find(a=>a.id===id)?.go();
}
// Over the awake limit, ordinary tabs go to sleep before pinned tabs, favorites and tabs you return to often.
async function enforceAwakeBudget(){if(!settings.maxAwakeTabs)return;const kept=t=>t.pinned||t.favoriteId||returnsOften(t)?1:0;for(const t of budgetCandidates(tabs,activeId).sort((a,b)=>kept(a)-kept(b))){if(quitting||tabs.filter(t=>t.view).length<=settings.maxAwakeTabs)break;await sleepTab(t,true);}}
async function closeTab(id) {
  const t=tabs.find(t=>t.id===id); if (!t) return;
  if (t.view) {
    try {const state=await pageState(t.view.webContents);
      if (state?.dirty) {const result=await dialog.showMessageBox(win,{type:'question',message:'Close this tab and discard your input?',buttons:['Keep tab','Discard input'],defaultId:0,cancelId:0}); if(result.response!==1)return;}
    } catch {}
  }
  if(!tabs.includes(t))return;
  if(t.pip)await within(pip?.end('close'),1500);media?.forget(t.id);reader?.close(t.id);
  recentlyClosed.push(t,tabs.indexOf(t));lastCloseAt=Date.now();if(t.pinned)feedback('pinned-removed');if(id===activeId)closeFind(false);
  if(split?.ids.includes(id))split=null;tabSelection.remove(id);const index=tabs.indexOf(t); dispose(t); tabs.splice(index,1);
  if(activeId===id){const remaining=tabs.filter(x=>inSpace(x,space));if(remaining.length)selectTab(tabSelection.previous(remaining).id);else makeTab();}
  emit(); persist();
}
function closeFind(focus=true){const wc=tabs.find(t=>t.id===activeId)?.view?.webContents;if(wc&&!wc.isDestroyed()){wc.stopFindInPage('clearSelection');if(focus)wc.focus();}find={open:false,query:'',matches:0,active:0,requestId:0};layout();emit();}
// Quiet confirmations for quick actions; the browser window animates them (feedback-ui.js) and respects Reduce Motion.
function feedback(kind,detail){if(win&&!win.isDestroyed())win.webContents.send('prism-feedback',{kind,detail});}
// One step of undo for sidebar edits (closing several tabs, deleting folders or pinned bookmarks, organizing tabs).
// Saved passwords are shown or copied only after Touch ID (or an explicit confirmation on Macs without it).
// The isolated test profile skips the prompt because automated tests cannot touch the sensor.
let clipboardWipe=null;async function confirmOwner(reason){if(smoke)return true;try{if(systemPreferences.canPromptTouchID()){await systemPreferences.promptTouchID(reason);return true;}}catch{return false;}
 const answer=await dialog.showMessageBox(win,{type:'warning',message:translate(settings.language,'Use a saved password?'),detail:translate(settings.language,'This Mac has no Touch ID. Make sure nobody else can see your screen.'),buttons:[translate(settings.language,'Cancel'),translate(settings.language,'Continue')],defaultId:0,cancelId:0});return answer.response===1;}
// Windows that extensions opened with chrome.windows.create; only these can be closed through the extension API.
const extensionWindows=new Set();
// Last position of the toolbar Extensions button, so an extension's panel opens right under it.
let toolbarAnchor=null,spaceIntent=null;
let undoable=null,lastCloseAt=0,warmedAt=0,warming=null;function offerUndo(message,run,count){undoable={run,at:Date.now()};feedback('undo',{message,count});}
// ⌘Z (and ⌃Z) outside a text field brings back what was closed or removed last: the latest sidebar edit that offered Undo,
// or else the last closed tab, favorite or pinned tab, in its old place. In a text field it is the usual Undo.
async function undoKey(){
 const wc=webContents.getFocusedWebContents?.()||BrowserWindow.getFocusedWindow()?.webContents;
 if(wc&&!wc.isDestroyed()){const editing=await wc.executeJavaScriptInIsolatedWorld(999,[{code:'(()=>{const e=document.activeElement;return !!e&&(e.isContentEditable||/^(INPUT|TEXTAREA|SELECT|IFRAME|FRAME)$/.test(e.tagName))})()'}]).catch(()=>false);if(editing){wc.undo();return;}}
 if(undoable&&undoable.at>=lastCloseAt){const pending=undoable;undoable=null;await pending.run();return;}
 const result=await action('reopen');if(result?.message)feedback('nothing-to-restore');
}
// Closing a pinned tab (0.33) keeps it in the sidebar: the page is unloaded and goes back to the address it was pinned
// with. Its close button then removes it; ⌘Z puts a removed one back in place.
async function parkTab(t){
 if(t.view){try{const state=await pageState(t.view.webContents);if(state?.dirty){const result=await dialog.showMessageBox(win,{type:'question',message:translate(settings.language,'Close this tab and discard your input?'),buttons:[translate(settings.language,'Keep tab'),translate(settings.language,'Discard input')],defaultId:0,cancelId:0});if(result.response!==1)return;}}catch{}}
 if(!tabs.includes(t))return;if(t.pip)await within(pip?.end('close'),1500);media?.forget(t.id);if(split?.ids.includes(t.id))split=null;
 const wasActive=t.id===activeId;if(wasActive)closeFind(false);dispose(t);
 if(t.home){t.url=t.home;t.title=t.homeTitle||t.title;}t.recovery=null;t.parked=true;t.error='';
 if(wasActive){const remaining=tabs.filter(x=>inSpace(x,space)&&x!==t&&!x.parked);if(remaining.length)selectTab(tabSelection.previous(remaining).id);else makeTab();}
 emit();persist();feedback('pinned-closed');
}
const sidebarEdit=require('./sidebar-edit.cjs');
const menuLabel=label=>translate(settings.language,label);
function localizedMenu(items){return items.map(item=>({...item,...(item.label?{label:menuLabel(item.label)}:{}),...(item.submenu?{submenu:localizedMenu(item.submenu)}:{})}));}
const zoomSteps=[0.5,0.67,0.75,0.8,0.9,1,1.1,1.25,1.5,1.75,2,2.5,3];
function zoomActive(direction){const t=tabs.find(t=>t.id===activeId),wc=t?.view?.webContents;if(!wc||wc.isDestroyed())return;
 if(t.space!=='private'&&siteControls){siteControls.handle('site-zoom',{direction}).then(r=>{if(r?.zoom)feedback('zoom',r.zoom);}).catch(()=>{});return;}const current=wc.getZoomFactor(),base=settings.pageZoom||1;
 const next=direction===0?base:direction>0?zoomSteps.find(z=>z>current+0.001)??zoomSteps.at(-1):[...zoomSteps].reverse().find(z=>z<current-0.001)??zoomSteps[0];wc.setZoomFactor(next);feedback('zoom',Math.round(next*100));}
function command(key) {
  if(key==='f'){if(!tabs.find(t=>t.id===activeId)?.view)return;find.open=true;layout();emit();win.webContents.focus();win.webContents.send('open-panel','find');}
  if(key==='y')win.webContents.send('open-panel','history');
  if(key==='reopen')action('reopen');
  if (key==='l') {win.webContents.focus(); win.webContents.send('focus-address');}
  // 0.35: ⌘T opens Beam (type an address, search or run anything); ⌘K opens a blank new tab.
  if (key==='t') commandBar?.open();
  if (key==='k') {makeTab(); command('l');}
  if (key==='w') action('tab-park',activeId);
  if (key==='d') action('bookmark-current');
  if (key==='r'){const wc=tabs.find(t=>t.id===activeId)?.view?.webContents;if(wc){wc.reload();feedback('reload');}}
  if (key==='R'){const wc=tabs.find(t=>t.id===activeId)?.view?.webContents;if(wc){wc.reloadIgnoringCache();feedback('hard-reload');}}
}
// Prism's own picture in picture (pip.cjs) for a video on the page; Chromium's for a video inside a frame.
async function pictureInPicture(t,frame){if(!t?.view)return {error:'Open a video first.'};if(pip?.active()===t){await pip.end('return');return;}if(!frame||frame===t.view.webContents.mainFrame){if(await pip?.enter(t))return;}return togglePiP(t,frame);}
async function togglePiP(t,frame){
 if(!t?.view)return {error:'Open a video first.'};try{return frame?await frame.executeJavaScript(pipScript,true):await t.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:pipScript}],true);}catch{return {error:'This video cannot enter picture-in-picture. Its site or player may restrict it.'};}
}
async function action(name,value) {
 if(name.startsWith('archive-'))return archiveAction(name,value);
 if(name.startsWith('spectrum-'))return spectrumAction(name,value);
 if(name==='compact-reveal'){const next=!!value&&!!settings.compactMode;if(next!==compactReveal){compactReveal=next;layout();emit();}return;}
 if(name==='instagram-app-open'){
  const isPrivate=space==='private';
  instagramApp?.open({session:isPrivate?privateSession:session.fromPartition(browserPartition),isPrivate,space});
  return;
 }
 if(name==='copy-page-url'){const tab=tabs.find(t=>t.id===activeId);if(!tab?.url)return {error:'Open a page first.'};// Tracking and share parameters (utm_*, fbclid, YouTube si…) never go to the clipboard (0.43).
 await clipboard.writeText(require('./blocker.cjs').cleanLink(tab.url)||tab.url);feedback('link-copied');return {message:'Page link copied.'};}
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
 if(name==='profile-open'){if(space==='private')return {error:'Profile connections are unavailable in Private.'};const urls={gmail:'https://mail.google.com/',chatgpt:'https://chatgpt.com/',gemini:'https://gemini.google.com/'};if(urls[value]){const home=homeSpace(),existing=tabs.find(t=>t.space===home&&t.url.startsWith(urls[value]));if(existing)selectTab(existing.id);else makeTab(urls[value],true,home);}return;}
 if(name==='tab-rename'){const target=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!target)return;target.customTitle=cleanTitle(value.title);persist();emit();return;}
 if(name==='tab-menu'){const target=tabs.find(t=>t.id===value&&inSpace(t,space));if(!target)return;const favoriteIds=new Set(library.bookmarks.map(b=>b.id));const others=sidebarEdit.closeTargets(tabs,target.id,'others',space,favoriteIds),below=sidebarEdit.closeTargets(tabs,target.id,'below',space,favoriteIds);
  Menu.buildFromTemplate(localizedMenu([
   {label:'Rename tab…',click:()=>win.webContents.send('rename-tab',target.id)},
   {label:'Use page title',enabled:!!target.customTitle,click:()=>action('tab-rename',{id:target.id,title:''})},
   {type:'separator'},
   {label:target.pinned?'Unpin tab':'Pin tab',click:()=>action('pin-tab',target.id)},
   {label:'Duplicate tab',enabled:!!target.url,click:()=>action('tab-duplicate',target.id)},
   {label:'Add to folder',enabled:!!target.url&&space!=='private',submenu:[{label:'Pinned',click:()=>action('tab-to-folder',{id:target.id,folder:''})},...(library.folders.length?[{type:'separator'}]:[]),...library.folders.map(folder=>({label:folder,click:()=>action('tab-to-folder',{id:target.id,folder})}))]},
   {label:'Split with current tab',enabled:target.id!==activeId&&!!target.url,click:()=>action('split-start',{id:target.id,mode:'vertical'})},
   {type:'separator'},
   ...(target.pinned?[...(!target.parked?[{label:'Close tab',click:()=>action('tab-park',target.id)}]:[]),{label:'Remove pinned tab',click:()=>action('close',target.id)}]:[{label:'Close tab',click:()=>action('close',target.id)}]),
   {label:'Close other tabs',enabled:others.length>0,click:()=>action('tabs-close',{id:target.id,mode:'others'})},
   {label:'Close tabs below',enabled:below.length>0,click:()=>action('tabs-close',{id:target.id,mode:'below'})}
  ])).popup({window:win});return;}
 if(name==='tab-duplicate'){const target=tabs.find(t=>t.id===value&&inSpace(t,space));if(!target?.url)return;const copy=makeTab(target.url,true,target.space);if(target.customTitle)copy.customTitle=target.customTitle;persist();emit();feedback('duplicated');return;}
 // 0.39.2: a tab dragged onto Favorites becomes a favorite, and the tab itself becomes that favorite's page.
 if(name==='tab-to-favorite'){const target=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!target?.url||space==='private'||!/^https?:/.test(target.url))return;let b=library.bookmarks.find(x=>x.favorite&&x.url===target.url);
  if(!b){b=bookmark({url:target.url,title:target.customTitle||target.title});b.favorite=true;const at=Number.isInteger(value.index)?Math.max(0,Math.min(value.index,library.bookmarks.filter(x=>x.favorite).length)):Infinity;const favs=library.bookmarks.filter(x=>x.favorite);const before=favs[at];if(before)library.bookmarks.splice(library.bookmarks.indexOf(before),0,b);else library.bookmarks.push(b);}
  target.favoriteId=b.id;target.pinned=false;saveLibrary();persist();emit();feedback('added-to-favorites');return;}
 if(name==='tab-to-folder'){const target=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!target?.url||space==='private')return;const folder=String(value.folder||'').slice(0,200);if(folder&&!library.folders.includes(folder))return;library.bookmarks.push(bookmark({url:target.url,title:target.customTitle||target.title,folder}));saveLibrary();emit();feedback('added-to-folder',folder);return;}
 if(name==='tabs-close'){const anchor=value?.mode==='all'?null:tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!anchor&&value?.mode!=='all')return;const ids=sidebarEdit.closeTargets(tabs,anchor?.id,value.mode,space,new Set(library.bookmarks.map(b=>b.id))).sort((x,y)=>(x===activeId)-(y===activeId));let closed=0;for(const id of ids){const before=tabs.length;await closeTab(id);if(tabs.length<before)closed++;}
  // Close all lands on the new tab page (logo, wordmark, recently closed), even when favourites or pinned tabs stay open.
  if(value.mode==='all'&&closed){const blank=tabs.find(x=>inSpace(x,space)&&!x.url);if(blank)selectTab(blank.id);else makeTab();}
  if(closed)offerUndo('{n} tabs closed',async()=>{for(let i=0;i<closed;i++)await action('reopen');},closed);return;}
 // Toolbar Extensions: open an extension's own panel (action popup) under the Extensions button, as Chrome does.
 if(name==='extension-action'){const id=String(value?.id||'');const ext=services.extensionRows().find(e=>e.id===id&&e.loaded);if(!ext)return {error:'Turn the extension on first.'};toolWindows.closeAll();
  if(!ext.hasPopup&&!ext.hasSidePanel){const tab=tabs.find(t=>t.id===activeId&&t.space!=='private'&&t.view);if(!tab)return {error:'Open a page first.'};try{extensionApi.api.browserAction.activateClick({extensionId:id,tabId:tab.view.webContents.id});}catch(error){return {error:error.message};}return;}
  if(!ext.hasPopup)return sideAction(id);
  const a=toolbarAnchor,[cw]=win.getContentSize(),anchorRect=a?{x:a.left,y:a.y-28,width:Math.max(1,a.x-a.left),height:28}:{x:cw-48,y:8,width:28,height:28};
  // electron-chrome-extensions 4.9's own popup never sizes or shows under Electron 44, so Prism opens the panel itself.
  const content=win.getContentBounds();return services.extensionAction('popup',id,{right:content.x+anchorRect.x+anchorRect.width,bottom:content.y+anchorRect.y+anchorRect.height});}
 if(name==='undo'){const pending=undoable;undoable=null;if(pending)await pending.run();return;}
 if(name==='tabs-tidy'){tidyUndo=tabs.map(t=>t.id);tabs=tidyOrder(tabs,space);persist();emit();offerUndo('Tabs organized by site',()=>action('tabs-untidy'));return {message:'Tabs arranged by site. Pinned tabs stay in place.'};}
 if(name==='tabs-untidy'){if(tidyUndo){const ranks=new Map(tidyUndo.map((id,i)=>[id,i]));tabs.sort((a,b)=>(ranks.get(a.id)??Infinity)-(ranks.get(b.id)??Infinity));tidyUndo=null;persist();emit();}return;}
 if(name==='split-start'){const current=tabs.find(t=>t.id===activeId),other=tabs.find(t=>t.id===value?.id&&inSpace(t,space));if(!current?.url||!other?.url||current===other)return {error:'Choose two different open pages.'};inspector?.close();split={ids:[current.id,other.id],mode:value.mode==='horizontal'?'horizontal':'vertical',ratio:.5};attach(other);toolWindows?.closeAll();layout();emit();return;}
 if(name==='split-end'){split=null;layout();emit();return;}
 // Dragging a tab or favorite over the page: the page is shown as a picture so the sidebar can draw drop zones on it.
 if(name==='prewarm-tool'){toolWindows?.prewarm();return;}
 if(name==='drag-split-begin'){const shown=tabs.find(x=>x.id===activeId),image=shown?.view?await shown.view.webContents.capturePage().catch(()=>null):null;overlay=true;layout();return {image:image&&!image.isEmpty()?image.resize({width:1000}).toDataURL():null,area:pageArea,split:!!split};}
 if(name==='drag-split-end'){overlay=false;layout();return;}
 if(name==='split-drop'&&value){overlay=false;const dragged=tabs.find(x=>x.id===value.id&&inSpace(x,space)&&x.url),side=['left','right','top','bottom'].includes(value.side)?value.side:'center';
  if(!dragged){layout();return {error:'Open a page first.'};}
  if(side==='center'){selectTab(dragged.id);layout();emit();return;}
  const first=side==='left'||side==='top',mode=side==='left'||side==='right'?'vertical':'horizontal';let otherId;
  if(split){otherId=split.ids[first?1:0];if(otherId===dragged.id)otherId=split.ids[first?0:1];}
  else{const active=tabs.find(x=>x.id===activeId);otherId=active&&active!==dragged&&active.url&&inSpace(active,space)?active.id:tabs.filter(x=>x!==dragged&&x.url&&inSpace(x,space)).sort((a,b)=>b.lastUsed-a.lastUsed)[0]?.id;}
  const other=tabs.find(x=>x.id===otherId);if(!other){selectTab(dragged.id);layout();emit();return;}
  inspector?.close();toolWindows?.closeAll();split={ids:first?[dragged.id,other.id]:[other.id,dragged.id],mode,ratio:split?.ratio||.5};attach(other);attach(dragged);selectTab(dragged.id);layout();emit();return;}
 if(name==='split-mode'&&split){split.mode=value==='horizontal'?'horizontal':'vertical';layout();emit();return;}
 if(name==='split-ratio'&&split){if(typeof value==='number'&&Number.isFinite(value)){split.ratio=Math.max(.25,Math.min(.75,value));layout();emit();}return;}
 if(name==='split-swap'&&split){split.ids.reverse();layout();emit();return;}
 if(name==='inspect'){const tab=tabs.find(t=>t.id===activeId);if(!tab?.view)return {error:'Open a page first.'};toolWindows?.closeAll();inspector.open(tab.view.webContents);return;}
 if(name==='inspect-close'){inspector.close();return;}
 if(name==='pip')return pictureInPicture(tabs.find(t=>t.id===activeId));
 if(name==='media'&&typeof value==='string'){if(value==='show'){const id=media?.tabId();if(id!=null)selectTab(id);return;}if(value==='pip'){const tab=tabs.find(x=>x.id===media?.tabId());return tab?pictureInPicture(tab):undefined;}if(['toggle','back','forward','close'].includes(value))return media?.control(value);return;}
 if(name==='pip-return'){const tab=pip?.active();if(tab)await pip.end('return');return;}

  if(name==='autofill-dismiss'){autofill?.dismiss();return;}
  if(name?.startsWith('wallet-')){if(space==='private')return {error:'Cards are disabled in Private.'};if(name==='wallet-list')return wallet.list();if(name==='wallet-save'){wallet.save(value);return savedTo(walletFile,{message:'Card saved encrypted on this Mac.'});}if(name==='wallet-remove'){wallet.remove(value);return savedTo(walletFile);}}
  if(name==='page-ai-open-selection'){if(space==='private')return {error:'Translation is disabled in Private.'};await toolWindows.open('page-assistant');toolWindows.get()?.webContents.send('open-panel','translate-selection');return;}
  if(name==='page-ai-preview')return pageAssistant.prepare(value);
  if(name==='page-ai-run')return pageAssistant.run(value);
  if(name==='page-ai-cancel'){pageAssistant.cancel();return;}
  if(name==='ai-status')return ai.status();
  if(name==='ai-save-key')return ai.saveKey(value);
  if(name==='ai-clear-key'){pageAssistant.cancel();return ai.clearKey();}
  if(name==='ai-rename-suggest')return ai.suggest(value?.id);
  if(name==='ai-rename-apply')return ai.apply(value);
  if(name==='open-chatgpt'){if(space==='private')return {error:'AI is disabled in Private.'};makeTab('https://chatgpt.com/',true,homeSpace());return;}
  if(name==='open-shortcuts'){await shell.openPath('/System/Applications/Shortcuts.app');return;}
  if(name==='update-check'){if(settings.chromiumCheck!==false)chromiumCheck.check().catch(()=>{});return updater.check();}
  if(name==='whats-new'){showWhatsNew();return;}
  if(name==='update-install'){if(updater.snapshot().status!=='ready')return;installUpdateRequested=true;win.close();return;}
  const t=tabs.find(t=>t.id===activeId);
  if(name==='blocker-toggle'||name==='blocker-site'){if(name==='blocker-toggle')blocker.toggle(value);else blocker.toggleSite(t?.url,space==='private');emit();return {message:'Protection changed. Reload the page to apply cosmetic changes.'};}
  // Site controls (src/site-controls.cjs), for the active tab.
  if(name==='site-info')return siteControls.info();
  if(name.startsWith('site-')){const r=await siteControls.handle(name,value);if(r!==null)return r;}
  // Prism passkeys (src/passkeys.cjs): listed without keys; removal asks first.
  if(name==='passkey-list')return space==='private'?{entries:[]}:{entries:passkeys.list()};
  if(name==='passkey-remove'){const row=passkeys.list().find(p=>p.credentialId===value?.id);if(!row)return;const answer=await dialog.showMessageBox(win,{type:'question',message:translate(settings.language,'Remove this passkey?'),detail:row.rpId+'\n'+(row.userName||''),buttons:[translate(settings.language,'Cancel'),translate(settings.language,'Remove')],defaultId:0,cancelId:0});if(answer.response===1){passkeys.remove(row.credentialId);await secureFile(passkeyFile).flush();}return;}
  if(name.startsWith('password-')){if(space==='private')return {error:'Password vault is disabled in Private.'};if(name==='password-add')return savedTo(vaultFile,passwords.add(value));
   if(name==='password-reveal'&&!await confirmOwner('show a saved password'))return {error:'Password not shown.'};
   if(name==='password-copy'){const field=value?.field==='password'?'password':'username';if(field==='password'&&!await confirmOwner('copy a saved password'))return {error:'Password not copied.'};const text=passwords.copy(value?.id,field);clipboard.writeText(text);
    // A copied password leaves the clipboard after a minute unless something else replaced it.
    if(field==='password'){clearTimeout(clipboardWipe);clipboardWipe=setTimeout(()=>{if(clipboard.readText()===text)clipboard.writeText('');},60000);clipboardWipe.unref?.();}feedback(field==='password'?'password-copied':'username-copied');return;}
   const methods={'password-list':'list','password-begin-edit':'beginEdit','password-reveal':'reveal','password-update':'update','password-delete':'remove','password-pick':'resolvePicker','password-close-edit':'closeEdit','password-close-manager':'closeManager'};if(methods[name])return savedTo(vaultFile,await passwords[methods[name]](value));}
  if(name==='reopen'){const saved=recentlyClosed.pop(space,typeof value?.url==='string'?value.url:undefined);if(!saved)return {message:'No closed tabs in this space.'};feedback('reopened');const existing=saved.favoriteId&&tabs.find(x=>x.space===space&&x.favoriteId===saved.favoriteId);if(existing){selectTab(existing.id);return;}const {index,...fields}=saved;const tab=makeTab(saved.url,false,space);Object.assign(tab,fields);if(tab.pinned){tab.parked=false;tab.home=tab.home||tab.url;}if(Number.isInteger(index)){tabs.splice(tabs.indexOf(tab),1);tabs.splice(Math.max(0,Math.min(index,tabs.length)),0,tab);}if(!library.bookmarks.some(b=>b.id===tab.favoriteId))delete tab.favoriteId;selectTab(tab.id);return;}
  if(name==='find-close'){closeFind(value!==false);return;}
  if(name==='find'&&t?.view){const query=String(value?.query||'').slice(0,500);if(!query){t.view.webContents.stopFindInPage('clearSelection');find.query='';find.matches=0;find.active=0;emit();return;}find.open=true;const next=query===find.query&&!!value?.next;find.query=query;find.requestId=t.view.webContents.findInPage(query,{forward:value?.forward!==false,findNext:!next});layout();emit();return;}
  if(name==='history-list')return space==='private'?[]:library.history.filter(x=>(x.title+' '+x.url).toLowerCase().includes(String(value||'').toLowerCase())).slice(0,200);
  if(name==='history-open'){if(space!=='private'&&cleanURL(value))makeTab(cleanURL(value));return;}
  if(name==='history-remove'){if(space!=='private'){library.history=library.history.filter(x=>x.url!==value);saveLibrary();}return;}
  if(name==='history-clear'){if(space==='private')return;const answer=await dialog.showMessageBox(win,{message:'Clear browsing history?',detail:'This also removes history suggestions. Bookmarks and sign-ins are kept.',buttons:['Cancel','Clear history'],defaultId:0,cancelId:0});if(answer.response===1){library.history=[];saveLibrary();}return;}
  if(name==='permissions-list')return space==='private'?[]:[...permissions.rows(),...devices.rows().map(d=>({...d,permission:'device'}))];
  if(name==='device-remove'){if(space!=='private'&&value?.origin)devices.remove(value.origin,value.key);return siteControls?.info();}
  if(name==='print'||name==='save-page'){const tab=tabs.find(t=>t.id===activeId),wc=tab?.view?.webContents;if(!wc||wc.isDestroyed()||!/^(https?|file):/.test(wc.getURL()))return {error:'Open a page first.'};
   if(name==='print'){wc.print({},(ok,reason)=>{if(!ok&&reason&&reason!=='Print job canceled'&&reason!=='cancelled')console.error('Print failed: '+reason);});return;}
   const base=(wc.getTitle()||'Page').replace(/[\\/:*?"<>|]+/g,' ').trim().slice(0,120)||'Page',{canceled,filePath}=await dialog.showSaveDialog(win,{defaultPath:path.join(app.getPath('downloads'),base+'.html'),filters:[{name:translate(settings.language,'Web page, complete'),extensions:['html']}]});
   if(canceled||!filePath)return;try{await wc.savePage(filePath,'HTMLComplete');return {message:translate(settings.language,'Page saved')};}catch(error){return {error:error.message};}}
  if(name==='extension-menu'){extensionMenu(value?.id);return;}
  if(name==='permission-reset'){if(space!=='private'&&value){permissions.reset(value.origin,value.permission);return {message:'Permission reset. Reload the site to end existing access.'};}return;}
  if(name==='gmail-add'&&space!=='private'){const existing=library.bookmarks.find(b=>require('./gmail.cjs').gmailURL(b.url));if(existing)existing.favorite=true;else library.bookmarks.push(bookmark({title:'Gmail',url:'https://mail.google.com/mail/u/0/#inbox',favorite:true}));saveLibrary();emit();return {message:'Gmail is in Favorites. Open it and sign in to load your inbox.'};}
  if(name==='gmail-hover-keep'){clearTimeout(gmailTimer);return;}
  if(name==='gmail-hover-end'){gmailGeneration++;clearTimeout(gmailTimer);gmailTimer=setTimeout(()=>{if(toolWindows?.section()==='quick-gmail')toolWindows.closeAll();},400);return;}
  if(name==='gmail-hover'&&space!=='private'&&settings.gmailPreview){const b=library.bookmarks.find(b=>b.id===value?.id&&b.favorite);const gmail=require('./gmail.cjs');if(!b||!gmail.gmailURL(b.url)||toolWindows.visible()&&toolWindows.section()!=='quick-gmail')return;clearTimeout(gmailTimer);const generation=++gmailGeneration;const tab=favoriteTab(tabs,b,space);let data;try{data=await gmail.preview(tab);}catch{data={messages:[],message:'Open Gmail to refresh your inbox.'};}if(space==='private'||generation!==gmailGeneration)return;await toolWindows.open('quick-gmail',value.anchor);toolWindows.get()?.webContents.send('gmail-preview',{...data,id:b.id});return;}
  if(name==='gmail-open'&&space!=='private'){const b=library.bookmarks.find(b=>b.id===value);if(!b||!require('./gmail.cjs').gmailURL(b.url))return;toolWindows.closeAll();const target=favoriteTab(tabs,b,space)||makeTab(b.url,false);target.favoriteId=b.id;selectTab(target.id);const u=new URL(b.url);u.hash='inbox';await target.view?.webContents.loadURL(u.href);return;}
  if(name==='memory-trim'){toolWindows?.release();await memoryManager.trim();return {message:'Eligible idle tabs released and disposable HTTP cache cleared.'};}
  if(name==='performance-stats'){const metrics=app.getAppMetrics();return {memoryMiB:metrics.reduce((n,p)=>n+p.memory.workingSetSize/1024,0),cpuPercent:metrics.reduce((n,p)=>n+p.cpu.percentCPUUsage,0),awake:tabs.filter(t=>t.view).length,sleeping:tabs.filter(t=>!t.view&&t.url).length,processes:metrics.map(p=>({type:p.type,memoryMiB:p.memory.workingSetSize/1024})).sort((a,b)=>b.memoryMiB-a.memoryMiB)};}
  if(name==='apply-design-preset'){saveDesign(value,true);return;}
  if(name==='restore-custom-theme'){saveDesign(customTheme);return;}
  if(name==='default-browser-status')return defaultBrowserStatus(app);
  if(name==='make-default-browser')return smoke?{available:false,isDefault:false,message:'Default-browser changes are disabled in tests.'}:requestDefaultBrowser(app);
  if(name==='open-default-settings'){if(!smoke)await shell.openExternal('x-apple.systempreferences:com.apple.Desktop-Settings.extension');return;}
  if(name==='finish-onboarding'){settings.onboardingComplete=true;saveSettings();emit();return;}
  if(name==='import-chrome')return importBrowser({browser:'chrome'});
  if(name==='import-sources')return importSources();
  if(name==='import-missing')return space==='private'?[]:migrate.detect({home:importHome(),...(smoke?{applications:[]}:{})}).missing;
  if(name==='import-browser')return importBrowser(value);
  if(name==='import-disk-access'){if(!smoke)await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles');return;}
  if(name==='import-bookmark-file'){if(space==='private')throw Error('Import in Personal or Work.');const chosen=await dialog.showOpenDialog(win,{title:'Import bookmarks from Chrome, Safari or another browser',properties:['openFile'],filters:[{name:'Bookmark HTML or JSON',extensions:['html','htm','json']}]});if(chosen.canceled)return {message:'Import canceled.'};const file=chosen.filePaths[0];if(fs.statSync(file).size>20*1024*1024)throw Error('Choose an export smaller than 20 MB.');return importBookmarks(bookmarkFile(await fs.promises.readFile(file,'utf8')),'Browser export');}
  if(name==='set-design-theme'){saveDesign(value);return;}
  if(name==='reset-design-theme'){saveDesign(defaultTheme);return;}
  if(name==='import-design-theme'){const choice=await dialog.showOpenDialog(win,{properties:['openFile'],filters:[{name:'Prism theme',extensions:['json']}]});if(!choice.canceled){if(fs.statSync(choice.filePaths[0]).size>65536)throw Error('Theme file is too large.');saveDesign(JSON.parse(fs.readFileSync(choice.filePaths[0],'utf8')));}return;}
  if(name==='export-design-theme'){const choice=await dialog.showSaveDialog(win,{defaultPath:'Prism-theme.json',filters:[{name:'Prism theme',extensions:['json']}]});if(!choice.canceled)fs.writeFileSync(choice.filePath,JSON.stringify(designTheme,null,2),{mode:0o600});return;}
  if(name==='space'){pageAssistant?.cancel();split=null;inspector?.close();if(!validSpace(settings.spaces,value))throw Error('Invalid space');if(instagramApp?.isOpen()&&instagramApp.isPrivate()!==(value==='private'))instagramApp.close();space=value;const next=tabs.find(x=>x.id===selectedInSpace[space])||tabs.find(x=>inSpace(x,space));if(next)selectTab(next.id);else makeTab();return;}
  // Spaces (src/spaces.cjs): up to 40 of the user's own, each with a name, an icon and a colour; the spaces popover
  // (spaces-ui.js) switches, creates, customizes and deletes them. Deleting one closes its tabs.
  if(name==='space-add'){const r=addSpace(settings.spaces,value||{});settings.spaces=r.spaces;saveSettings();setupMenu();await action('space',r.space.id);emit();return {id:r.space.id};}
  if(name==='space-update'){const before=settings.spaces.find(s=>s.id===value?.id)?.name;settings.spaces=updateSpace(settings.spaces,value?.id,value||{});saveSettings();if(settings.spaces.find(s=>s.id===value?.id)?.name!==before)setupMenu();emit();return;}
  if(name==='space-move'){settings.spaces=moveSpace(settings.spaces,value?.id,value?.beforeId);saveSettings();setupMenu();emit();return;}
  if(name==='space-remove'){const id=typeof value==='string'?value:value?.id,target=settings.spaces.find(s=>s.id===id);if(!target)return;if(settings.spaces.length<=1)return {error:translate(settings.language,'Keep at least one space.')};
   // The spaces popover asks first (confirmed); anything else gets the native question when the space has open pages.
   if(value?.confirmed!==true&&tabs.some(t=>inSpace(t,target.id)&&t.url)){const answer=await dialog.showMessageBox(win,{type:'question',message:translate(settings.language,'Delete this space?'),detail:'“'+target.name+'” · '+translate(settings.language,'Its open tabs will close.'),buttons:[translate(settings.language,'Cancel'),translate(settings.language,'Delete space')],defaultId:0,cancelId:0});if(answer.response!==1)return;}
   settings.spaces=removeSpace(settings.spaces,target.id);saveSettings();if(space===target.id)await action('space',homeSpace());
   for(const tab of tabs.filter(t=>inSpace(t,target.id)))dispose(tab);tabs=tabs.filter(t=>!inSpace(t,target.id));delete selectedInSpace[target.id];persist();setupMenu();emit();return;}
  // Right-clicking the space switcher opens the popover straight to customizing the current space.
  if(name==='space-intent'){const intent=spaceIntent;spaceIntent=null;return intent;}
  if(name==='space-customize'){const a=value?.anchor;spaceIntent={edit:space==='private'?homeSpace():space};return toolWindows.open('quick-spaces',a&&[a.x,a.y,a.left].every(Number.isFinite)?{x:a.x,y:a.y,left:a.left}:undefined);}
  if(name==='end-private'){await endPrivate();return {message:'Private session cleared. Saved downloads remain on disk.'};}
  if(name==='private-network'){if(space!=='private')throw Error('Open Private first.');for(const tab of tabs.filter(x=>x.space==='private'))dispose(tab);await privateNetwork.setMode(value?.mode,value?.profile);emit();return;}
  if(name==='pin-tab'){const target=tabs.find(x=>x.id===value);if(target&&inSpace(target,space)){target.pinned=!target.pinned;if(target.pinned){target.home=target.url;target.homeTitle=target.title;}else{delete target.home;delete target.homeTitle;target.parked=false;}persist();emit();feedback(target.pinned?'pinned':'unpinned');}return;}
  if(space==='private'&&name==='fill-password'&&!settings.privatePasswords)return {error:'Turn on Use Personal passwords in Private first.'};
  if(space==='private'&&['import-arc','save-password','import-passwords','bookmark-current','save-bookmark','folder','folder-menu','folder-icon','rename-folder','remove-folder','bookmark-move','open-bookmark','bookmark-menu','extension','web-store','import-native','undo-import','undo-password-import'].includes(name))return {error:'This action is available in Personal or Work.'};
  if(name==='undo-import')return undoImported('bookmarks');
  if(name==='undo-password-import')return undoImported('passwords');
  if(name==='import-native')return importNative();
  if(name==='set-setting'&&value&&typeof value.key==='string'){const valid=setting(value.key,value.value);if(valid===undefined)throw Error('Invalid setting');settings[value.key]=valid;if(value.key==='theme')library.theme=valid;saveSettings();if(value.key==='autofillSuggestions')autofill?.dismiss();if(value.key==='privacyEverywhere')applyPrivacyEverywhere();if(['bypassNormal','bypassProfile','bypassSites'].includes(value.key))applyBypass();if(value.key==='language')setupMenu();if(value.key==='automaticUpdates')updater?.schedule(valid);if(['theme','material','tint','radius','reduceTransparency','highContrast'].includes(value.key))applyAppearance();if(value.key==='pageZoom')for(const tab of tabs)tab.view?.webContents.setZoomFactor(valid);if(value.key==='trackpadGestures')for(const tab of tabs)applyPinch(tab.view?.webContents);layout();emit();if(value.key==='favoriteStyle')queueFavoriteThumbnail(t);return;}
  if(name==='begin-resize'){const image=t?.view?await t.view.webContents.capturePage():null;overlay=true;layout();return image&&!image.isEmpty()?image.resize({width:1000}).toDataURL():null;}
  if(name==='resize-sidebar'&&typeof value==='number'){resizeWidth=setting('sidebarWidth',value);layout();return;}
  if(name==='finish-resize'){if(resizeWidth!==null)settings.sidebarWidth=resizeWidth;resizeWidth=null;saveSettings();layout();emit();return;}
  if(name==='tab-reorder'&&value){const moved=tabs.find(x=>x.id===value.id),before=tabs.find(x=>x.id===value.beforeId);if(!moved||!inSpace(moved,space)||(before&&!inSpace(before,space)))return;if(before)moved.pinned=!!before.pinned;tabs.splice(0,tabs.length,...moveBefore(tabs,value.id,value.beforeId));persist();emit();return;}
  if(name==='bookmark-move'&&value){const b=library.bookmarks.find(x=>x.id===value.id);if(!b)return;if(typeof value.favorite==='boolean')b.favorite=value.favorite;if(typeof value.folder==='string'&&(value.folder===''||library.folders.includes(value.folder))){b.folder=value.folder;b.favorite=false;}library.bookmarks=moveBefore(library.bookmarks,b.id,value.beforeId);saveLibrary();emit();return;}
  // Options pages open as tabs, as in Chrome; many expect chrome.tabs.getCurrent() and a full-size page.
  if(name==='extension'&&value?.command==='options'){const url=services.extensionPage(value.id,'options');toolWindows.closeAll();makeTab(url,true,space==='private'?homeSpace():space);return;}
  if(name==='extension'&&value){await services.extensionAction(value.command,value.id);return;}
  if(name==='side-panel-close'){sidePanels?.close();return;}
  if(name==='side-panel-resize'&&typeof value==='number'){sidePanels?.resize(value);return;}
  if(name==='side-panel-finish-resize'){sidePanels?.finishResize();return;}
  if(name==='download'&&value){await (space==='private'?privateServices:services).downloadAction(value.command,value.id);return;}
  if(name==='download-directory'){await services.chooseDownloadDirectory();return;}
  if(name==='clear-previews'){services.clearImages();return {message:'Favorite images cleared from this Mac.'};}
  if(name==='restart'){persist();saveSettings();if(smoke)return;restartRequested=true;win.close();return;}
  if (name==='overlay') {if(value){autofill?.dismiss();if(htmlFullscreen)exitPageFullscreen();}overlay=!!value;layout();if(!overlay)queueFavoriteThumbnail(t);return {activeId};}
  if (name==='theme') {settings.theme=nativeTheme.shouldUseDarkColors?'light':'dark';library.theme=settings.theme;applyAppearance();saveSettings();saveLibrary();emit();return;}
  if (name==='suggest'&&typeof value==='string') {if(space==='private')return [];const query=value.trim().slice(0,200);if(!query)return [];// Same ranking as Beam (0.44): sites you use often and lately first, several words in any order.
   const visits=new Map(spaceHistory().map(h=>[h.url,h]));const rows=[...library.bookmarks.map(b=>({id:'b:'+b.id,kind:b.favorite?'favorite':'bookmark',title:b.title||b.url,detail:b.url,visits:Number(visits.get(b.url)?.visits)||0,visitedAt:visits.get(b.url)?.visitedAt})),...spaceHistory().map(h=>({id:'h:'+h.url,kind:'history',title:h.title||h.url,detail:h.url,visits:Number(h.visits)||1,visitedAt:h.visitedAt}))];
   const results=require('./command-bar.cjs').rank(query,rows,8).map(r=>({title:r.title,url:r.detail}));if(query.length>=2)preconnect(results[0]?.url||'https://www.google.com/');return results;}
  // Web apps in the Dock (0.45): the site in the tab becomes a small Mac app in ~/Applications and opens.
  if(name==='add-to-dock'){if(!/^https?:/i.test(t?.view?.webContents.getURL()||''))return {error:'Open a website first.'};if(space==='private')return {error:'Private pages can’t be added to the Dock.'};
   if(process.platform!=='darwin'&&!process.env.PRISM_WEB_APPS_ANY)return {error:'Web apps need macOS.'};
   try{const about=await require('./web-apps.cjs').describe(t.view.webContents,BrowserWindow);const made=await webApps.create(about);if(!smoke)await webApps.open(made).catch(()=>{});
    feedback('note',{message:'{name} is in your Applications folder. To keep it in the Dock, right-click its icon and choose Options → Keep in Dock.',name:made.name});return {ok:true,app:made};}
   catch(error){return {error:menuLabel('Couldn’t add this site to the Dock.')+' '+String(error?.message||'').slice(0,160)};}}
  // Lens window (0.46, ⌥⌘N): a small glass browser of its own; with an address it opens that page.
  if(name==='lens-window'){peek?.openWindow(typeof value==='string'?value:'',t?.space||space);return {ok:true};}
  // Tidy (0.46): old tabs of this space move to the Archive; one Undo brings them all back.
  if(name==='tidy'){const {tidyCandidates}=require('./archive.cjs');const found=tidyCandidates(tabs,{activeId,split:split?.ids,space:t?.space||space});const gone=[];
   for(const x of found){if(x.view){const page=await pageState(x.view.webContents);if(page?.dirty)continue;}gone.push(x);}
   if(!gone.length)return {message:menuLabel('Nothing to tidy: every tab here was used in the last half hour.')};
   const before=library.archive.slice();library.archive=addToArchive(library.archive,gone);for(const x of gone){dispose(x);tabSelection.remove(x.id);tabs.splice(tabs.indexOf(x),1);}saveLibrary();persist();emit();
   const back=gone.map(x=>({url:x.url,title:x.title,space:x.space}));offerUndo('Tidied {n} tabs',()=>{library.archive=before;for(const b of back){const n=makeTab(b.url,false,b.space);n.title=b.title;}saveLibrary();persist();emit();},gone.length);return {ok:true,count:gone.length};}
  if(name==='tour'){if(win.isMinimized())win.restore();win.show();win.focus();feedback('tour');return {ok:true};}
  if(name==='reader-toggle'){if(!t?.view)return {error:'Open a page first.'};if(reader.isOn(t.id)){reader.close(t.id);return;}const result=await reader.open(t);if(result?.error)return {error:menuLabel(result.error)};layout();emit();return;}
  if (name==='bookmark-current'&&t?.url) {const existing=library.bookmarks.find(b=>b.url===t.url);if(existing)library.bookmarks=library.bookmarks.filter(b=>b.id!==existing.id);else library.bookmarks.push(bookmark({url:t.url,title:t.title}));saveLibrary();emit();feedback(existing?'bookmark-removed':'bookmarked');return;}
  if (name==='save-bookmark'&&value&&typeof value==='object') {const entry=bookmark(value);const index=library.bookmarks.findIndex(x=>x.id===entry.id);if(index<0)library.bookmarks.push(entry);else library.bookmarks[index]=entry;if(entry.folder&&!library.folders.includes(entry.folder))library.folders.push(entry.folder);saveLibrary();emit();return;}
  if (name==='folder'&&typeof value==='string'&&value.trim()) {const folder=value.trim().slice(0,200);if(!library.folders.includes(folder))library.folders.push(folder);saveLibrary();emit();return;}
  if(name==='folder-icon'){require('./folders.cjs').setFolderIcon(library,value?.folder,value?.icon);saveLibrary();emit();return;}
  if(name==='rename-folder'){renameFolder(library,value?.from,value?.to);saveLibrary();emit();return;}
  if(name==='remove-folder'){removeFolder(library,value);saveLibrary();emit();return;}
  if(name==='folder-menu'&&folderNames(library).includes(value)){Menu.buildFromTemplate(localizedMenu([
    {label:'Rename folder…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',{kind:'folder',originalFolder:value,title:value});}},
    {label:'Change symbol…',click:()=>win.webContents.send('edit-bookmark',{kind:'folder-symbol',folder:value})},
    {label:'Add bookmark…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',{folder:value});}},
    {type:'separator'},{label:'Remove folder, keep bookmarks',click:()=>{const before=sidebarEdit.snapshotLibrary(library);removeFolder(library,value);saveLibrary();emit();offerUndo('Folder removed',()=>{sidebarEdit.restoreLibrary(library,before);saveLibrary();emit();});}},
    {label:'Delete folder and its bookmarks',click:()=>{const before=sidebarEdit.snapshotLibrary(library);sidebarEdit.deleteFolderWithBookmarks(library,value);saveLibrary();emit();offerUndo('Folder deleted',()=>{sidebarEdit.restoreLibrary(library,before);saveLibrary();emit();});}}
  ])).popup({window:win});return;}
  if (name==='open-bookmark') {const b=library.bookmarks.find(b=>b.id===value);if(b){const target=favoriteTab(tabs,b,space)||makeTab(b.url,false);target.favoriteId=b.id;selectTab(target.id);}return;}
  if(name==='bookmark-close-tab'){const b=library.bookmarks.find(b=>b.id===value);const open=b&&favoriteTab(tabs,b,space);if(open)await closeTab(open.id);return;}
  if(name==='bookmark-remove'){const b=library.bookmarks.find(b=>b.id===value);if(!b||space==='private')return;const before=sidebarEdit.snapshotLibrary(library);library.bookmarks=library.bookmarks.filter(x=>x.id!==b.id);saveLibrary();emit();offerUndo('Bookmark removed',()=>{sidebarEdit.restoreLibrary(library,before);saveLibrary();emit();});return;}
  if (name==='bookmark-menu') {const b=library.bookmarks.find(b=>b.id===value);if(!b)return;const open=b.favorite&&favoriteTab(tabs,b,space);Menu.buildFromTemplate(localizedMenu([
    // A favorite stays in Favorites when its tab is closed; ⌘Z opens the tab again.
    ...(open?[{label:'Close tab',click:()=>closeTab(open.id)},{type:'separator'}]:[]),
    ...(isInstagramURL(b.url)?[{label:'Open in Instagram Mobile',click:()=>action('instagram-app-open')}]:[]),
    {label:b.favorite?'Remove from Favorites':'Add to Favorites',click:()=>{b.favorite=!b.favorite;saveLibrary();emit();}},
    {label:'Edit bookmark…',click:()=>{overlay=true;layout();win.webContents.send('edit-bookmark',b);}},
    {label:'Move to folder',submenu:[{label:'Pinned',click:()=>{b.folder='';b.favorite=false;saveLibrary();emit();}},...library.folders.map(folder=>({label:folder,click:()=>{b.folder=folder;b.favorite=false;saveLibrary();emit();}}))]},
    {type:'separator'},{label:'Remove bookmark',click:()=>{const before=sidebarEdit.snapshotLibrary(library);library.bookmarks=library.bookmarks.filter(x=>x.id!==b.id);saveLibrary();emit();offerUndo('Bookmark removed',()=>{sidebarEdit.restoreLibrary(library,before);saveLibrary();emit();});}}
  ])).popup({window:win});return;}
  if (name==='import-arc') return importArc();
  if (name==='fill-password') return passwords.fill(t);
  if(name==='save-password')return passwords.saveCurrent(t);
  if(name==='import-passwords')return passwords.importCSV();
  if(name==='apple-passwords'){const error=await shell.openPath('/System/Applications/Passwords.app');if(error)throw Error(error);return;}
  // Apple Passwords (0.47). Apple's iCloud Passwords extension fills and saves through Apple Passwords over native
  // messaging (native-messaging.cjs); this opens its Chrome Web Store page so it can be added to Prism.
  if(name==='icloud-passwords-extension'){makeTab('https://chromewebstore.google.com/detail/icloud-passwords/pejdijmoenmkgeppbflobdenhhabjlaj',true,space==='private'?homeSpace():space);return;}
  // Moving the vault into Apple Passwords: after Touch ID, the logins are written as a Passwords-format CSV in Downloads
  // (readable by you only), the Passwords app is opened with it, and the file is deleted ten minutes later or at quit.
  if(name==='move-to-apple-passwords'){if(privateMode)return {error:'Not available in Private.'};const entries=(await readVault())||[];if(!entries.length)return {message:'There are no saved passwords to move.'};
   if(!await confirmOwner(translate(settings.language,'move your passwords to Apple Passwords')))return;
   const {appleCSV}=require('./password-data.cjs'),file=path.join(app.getPath('downloads'),'Prism Passwords for Apple Passwords.csv');
   await fs.promises.writeFile(file,appleCSV(entries),{mode:0o600});const wipe=()=>{try{fs.unlinkSync(file);}catch{}};const timer=setTimeout(wipe,10*60000);timer.unref?.();app.once('will-quit',wipe);
   if(!smoke)require('node:child_process').execFile('/usr/bin/open',['-a','Passwords',file],()=>{});
   if(!smoke){const answer=await dialog.showMessageBox(win,{type:'info',message:menuLabel('Finish in the Passwords app'),detail:menuLabel('In Passwords, choose File → Import Passwords… and pick “Prism Passwords for Apple Passwords.csv” in Downloads. The file holds readable passwords, so Prism deletes it in 10 minutes.'),buttons:[menuLabel('Done'),menuLabel('Show in Finder')],defaultId:0});if(answer.response===1)shell.showItemInFolder(file);}
   return {message:menuLabel('{n} logins are ready to import into Apple Passwords.').replace('{n}',String(entries.length)),file};}
  if(name==='web-store'){makeTab('https://chromewebstore.google.com/');return;}
  if(name==='show-welcome'){win.show();win.focus();win.webContents.send('open-panel','welcome');return;}
  if(name==='panel-preview'){const view=t?.view;if(!view)return null;const image=await view.webContents.capturePage();if(t.view!==view||t.id!==activeId)return null;return image.isEmpty()?null:image.resize({width:Math.min(1600,image.getSize().width)}).toDataURL();}
  if(name==='open-tool'){autofill?.dismiss();if(htmlFullscreen)exitPageFullscreen();const a=value?.anchor;if(value?.section==='quick-extensions'&&a&&[a.x,a.y,a.left].every(Number.isFinite))toolbarAnchor={x:a.x,y:a.y,left:a.left};const opened=await toolWindows.open(value?.section||'appearance',a&&[a.x,a.y,a.left].every(Number.isFinite)?{x:a.x,y:a.y,left:a.left}:undefined);emit();return opened;}
  if(name==='close-tools'){toolWindows.closeAll();return;}
  if (name==='state') {emit(); return;}
  if (name==='new') {makeTab(); command('l');}
  if (name==='select' && Number.isInteger(value)) selectTab(value);
  if (name==='close' && Number.isInteger(value)) await closeTab(value);
  if(name==='restore-closed')return undoKey();
  // Search with a picture (0.37): a file you choose, or the image on the clipboard, goes to Google Lens in a new tab.
  // Electron 44's clipboard reads text only in the main process, so a pasted image arrives from Beam's own page (bytes).
  if(name==='image-search'){let image;if(value?.bytes instanceof Uint8Array&&value.bytes.length<20*1024*1024)image=nativeImage.createFromBuffer(Buffer.from(value.bytes));else{const pick=await dialog.showOpenDialog(win,{properties:['openFile'],filters:[{name:'Images',extensions:['png','jpg','jpeg','gif','webp','heic','tiff','bmp']}]});if(pick.canceled||!pick.filePaths[0])return;image=nativeImage.createFromPath(pick.filePaths[0]);}
   if(!image||image.isEmpty())return {error:'That image could not be read.'};const {width,height}=image.getSize();if(Math.max(width,height)>1600)image=image.resize(width>=height?{width:1600}:{height:1600});lensSearch(image.toPNG());return;}
  // The address field's own menu (0.37): Paste and Go, then the usual editing commands.
  if(name==='address-menu'){const text=clipboard.readText().trim().slice(0,8192),edit=require('./edit-menu.cjs').editItems({isEditable:true,editFlags:{canUndo:true,canRedo:true,canCut:true,canCopy:true,canPaste:!!text,canSelectAll:true}},{translate:menuLabel});
   Menu.buildFromTemplate([...(text?[{label:menuLabel(normalizeAddress(text)?.startsWith('https://www.google.com/search?')?'Paste and Search':'Paste and Go'),click:()=>{const t=tabs.find(x=>x.id===activeId);if(t?.url)action('navigate',text);else{const url=normalizeAddress(text);if(url){makeTab(url,true,space);persist();}}}},{type:'separator'}]:[]),...edit]).popup({window:win});return;}
  if(name==='release-notes'){const url=require('./release-notes.cjs').URL,target=space==='private'?homeSpace():space,open=tabs.find(t=>t.space===target&&t.url===url);if(open)selectTab(open.id);else{const t=makeTab(url,true,target);t.title=translate(settings.language,'Release notes');}return;}
  // Pointing at a sleeping tab starts waking it (0.33.2), so it is usually ready by the time the click lands; never in
  // Private, for a closed pinned tab, or while macOS is short of memory.
  if(name==='tab-warm'&&Number.isInteger(value)){const target=tabs.find(x=>x.id===value&&inSpace(x,space));if(!target||target.view||!target.url||target.parked||target.space==='private'||Date.now()-warmedAt<400)return;if(settings.leanMemory&&await memoryManager?.underPressure())return;warmedAt=Date.now();target.lastUsed=Date.now();
   // The extension layer makes a new tab active when it does not know the front one; keep the front tab in front.
   warming=target;try{attach(target);}finally{warming=null;}const front=tabs.find(x=>x.id===activeId);if(front?.view&&front.space!=='private')extensionApi?.selectTab(front.view.webContents);emit();return;}
  if(name==='tab-park'&&Number.isInteger(value)){const target=tabs.find(x=>x.id===value&&inSpace(x,space));if(!target)return;if(target.pinned&&!target.parked)await parkTab(target);else await closeTab(target.id);return;}
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
// One-click import from Chrome, Arc, Safari, Brave or Edge (0.42; Settings → Imports and the welcome guide): bookmarks,
// passwords and history in one confirmation. browser-migrate.cjs reads private copies of the browser's files. Logins
// Prism already has are kept, bookmarks and history merge into the library, and each part has its own Undo.
// Tests never read the real browsers: the smoke profile uses PRISM_IMPORT_HOME or an empty folder.
const importHome=()=>smoke?process.env.PRISM_IMPORT_HOME||path.join(app.getPath('temp'),'prism-import-none'):require('node:os').homedir();
const importIcons=new Map();
async function importSources(){
 if(space==='private')return [];
 const sources=migrate.detect({home:importHome(),...(smoke?{applications:[]}:{})});
 for(const source of sources){if(!source.app)continue;if(!importIcons.has(source.app))importIcons.set(source.app,await app.getFileIcon(source.app,{size:'normal'}).then(i=>i.toDataURL()).catch(()=>null));source.icon=importIcons.get(source.app);}
 return sources.map(({app:_,...source})=>({...source,historyOff:!!settings.privacyEverywhere}));
}
async function importBrowser(value={}){
 if(space==='private')return {error:'Import in Personal or Work.'};if(importing)return {error:'An import is already running.'};
 importing=true;emit();
 try{
  const source=migrate.detect({home:importHome(),applications:[]}).find(b=>b.id===value?.browser);if(!source)throw Error('That browser wasn’t found on this Mac.');
  const profile=source.profiles.find(p=>p.id===value.profile)||source.profiles[0];
  const kinds={bookmarks:value.bookmarks!==false&&profile.bookmarks,passwords:value.passwords!==false&&profile.passwords,history:value.history!==false&&profile.history&&!settings.privacyEverywhere};
  if(!kinds.bookmarks&&!kinds.passwords&&!kinds.history)return {error:'Choose what to import.'};
  const data=await migrate.collect({browser:source.id,profile:profile.id,kinds,home:importHome()});
  const bookmarks=mergeBookmarks(library.bookmarks,data.bookmarks),history=migrate.mergeHistory(library.history,data.history);
  const logins=data.logins.filter(row=>String(row.origin_url).startsWith('https://'));
  const label=source.name+(source.profiles.length>1?' · '+profile.name:'');
  const count=(n,one,many)=>n.toLocaleString('en-US')+' '+(n===1?one:many);
  const lines=[bookmarks.added&&count(bookmarks.added,'new bookmark','new bookmarks'),logins.length&&count(logins.length,'saved password','saved passwords'),history.added&&count(history.added,'page','pages')+' from history'].filter(Boolean);
  if(!lines.length)return {message:'Everything from '+label+' is already in Prism.'};
  const choice=await dialog.showMessageBox(win,{type:'question',message:'Import from '+label+'?',detail:lines.join('\n')+(logins.length?'\n\nmacOS will ask to let Prism read '+source.name+'’s passwords. Logins you’ve already saved in Prism are kept.':'')+'\n\nNothing in '+source.name+' changes. You can undo this in Settings → Imports.',buttons:['Cancel','Import'],defaultId:1,cancelId:0});
  if(choice.response!==1)return {message:'Import canceled. Nothing changed.'};
  let added=0;
  if(logins.length){
   const key=await migrate.keychainKey(source.id);let decrypted;try{decrypted=migrate.decryptLogins(logins,key);}finally{key.fill(0);}
   const merged=migrate.addCredentials(await readVault(),decrypted.credentials);added=merged.added;
   if(added){await commitWithUndo({...importStore('passwords'),next:merged.entries});try{await passwords.list();}catch{}}
  }
  if(bookmarks.added||history.added){
   const next={...library,bookmarks:bookmarks.bookmarks,history:history.history,folders:[...new Set([...library.folders,...data.bookmarks.map(b=>b.folder).filter(Boolean)])],importReport:{source:label,bookmarks:bookmarks.added,passwords:added,history:history.added,completedAt:new Date().toISOString()}};
   await commitWithUndo({...importStore('bookmarks'),next});warmFavoriteIcons();
  }
  const done=[bookmarks.added&&count(bookmarks.added,'bookmark','bookmarks'),added&&count(added,'password','passwords'),history.added&&count(history.added,'history page','history pages')].filter(Boolean);
  return {message:done.length?'Imported '+done.join(', ')+' from '+source.name+'.':'Your '+source.name+' logins are already in Prism.',imported:{bookmarks:bookmarks.added,passwords:added,history:history.added}};
 }catch(error){return {error:error.message,...(error.needsAccess?{needsAccess:true}:{})};}
 finally{importing=false;emit();}
}
async function importArc(){return importBrowser({browser:'arc'});}
async function importNative(){
 const file=path.join(app.getPath('appData'),'Prism Native Preview','session-v2.json');
 const document=JSON.parse(fs.readFileSync(file,'utf8'));
 const items=(document.favorites||[]).filter(b=>b.space!=='private'&&b.space!=='privateSpace'&&webURL(b.url)).map(b=>bookmark({id:'native:'+b.id,url:b.url,title:b.title,favorite:b.isFavorite!==false,folder:[b.sourceSpace,b.folder].filter(Boolean).join(' / ')}));
 return importBookmarks(items,'Native Preview');
}
function setupPrivate(){
 privateSession=session.fromPartition('private-'+randomUUID(),{cache:false});registerGestures(privateSession);blocker?.bind(privateSession,true);
 privateSession.setPermissionRequestHandler((wc,p,cb,d)=>{if(openWithoutPrompt.has(p)){cb(true);return;}if(p==='openExternal'){cb(false);if(d?.externalURL)openExternalLink(wc,d.externalURL,true);return;}cb(p==='fullscreen'&&allowFullscreen(wc));});privateSession.setPermissionCheckHandler((wc,p)=>openWithoutPrompt.has(p)||p==='fullscreen'&&allowFullscreen(wc));shareScreen(privateSession);
 privateNetwork=new PrivateNetwork({session:privateSession,changed:emit,helper:tpwsHelper,filter:details=>blocker.decide(details,true),secureDns:on=>{dnsWants.private=on;syncDns();}});
 privateServices=createServices({app,ses:privateSession,window:()=>win,settings,saveSettings,emit,smoke:true,privateMode:true});
}
async function endPrivate(){
 if(privateNetwork?.busy)throw Error('Wait for the Private network change to finish.');
 if(instagramApp?.isPrivate())instagramApp.close();
 for(const tab of tabs.filter(t=>t.space==='private'))dispose(tab);
 tabs=tabs.filter(t=>t.space!=='private');privateServices?.close();await privateNetwork?.close();
 await privateSession?.clearStorageData();await privateSession?.clearCache();await privateSession?.clearAuthCache();
 blocker.clearPrivate();setupPrivate();if(space==='private')await action('space',homeSpace());emit();
}
// Right-click on an extension in the toolbar popover (0.43): the extension's own action menu items (chrome.contextMenus
// with the "action" context) and Prism's Options, Open, Reload, Turn off, Manage and Remove, as in Chrome.
function extensionMenuTemplate(id){const ext=services.extensionRows().find(e=>e.id===String(id||''));if(!ext)return null;const T=text=>translate(settings.language,text),store=extensionApi?.ctx?.store,own=[],seen=new Set();
 if(ext.loaded&&typeof store?.buildMenuItems==='function')for(const type of ['action','browser_action','page_action'])try{for(const item of store.buildMenuItems(id,type)||[]){const k=item.type+'|'+item.label;if(!seen.has(k)){seen.add(k);own.push(item);}}}catch{}
 return [{label:ext.name,enabled:false},...(own.length?[{type:'separator'},...own]:[]),{type:'separator'},
  ...(ext.loaded&&ext.hasOptions?[{label:T('Options'),click:()=>action('extension',{command:'options',id:ext.id}).catch(()=>{})}]:[]),
  ...(ext.loaded&&(ext.hasPopup||ext.hasSidePanel)?[{label:T(ext.hasPopup?'Open popup':'Open side panel'),click:()=>action('extension-action',{id:ext.id}).catch(()=>{})}]:[]),
  ...(ext.enabled?[{label:T('Reload'),click:()=>action('extension',{command:'reload',id:ext.id}).catch(()=>{})}]:[]),
  {label:T(ext.enabled?'Turn off':'Turn on'),click:()=>action('extension',{command:'toggle',id:ext.id}).catch(()=>{})},{type:'separator'},
  {label:T('Manage extensions'),click:()=>win.webContents.send('open-panel','extensions')},
  {label:T('Remove from Prism…'),click:async()=>{const answer=await dialog.showMessageBox(win,{type:'question',message:T('Remove “{name}”?').replace('{name}',ext.name),buttons:[T('Cancel'),T('Remove')],defaultId:0,cancelId:0});if(answer.response===1)action('extension',{command:'remove',id:ext.id}).catch(()=>{});}}];}
function extensionMenu(id){const template=extensionMenuTemplate(id);if(template&&win&&!win.isDestroyed())Menu.buildFromTemplate(template).popup({window:win});}
// Screen sharing (getDisplayMedia, 0.43): macOS 15+ shows its own screen and window picker; older systems get a list.
function shareScreen(ses){ses.setDisplayMediaRequestHandler(async(request,reply)=>{let answered=false;const callback=streams=>{if(answered)return;answered=true;try{reply(streams);}catch{}};try{const {desktopCapturer}=require('electron'),T=text=>translate(settings.language,text);
 const sources=(await desktopCapturer.getSources({types:['screen','window'],thumbnailSize:{width:0,height:0}})).filter(s=>s.name&&!/^Prism$/.test(s.name)).slice(0,9);
 const host=(()=>{try{return new URL(request.securityOrigin||request.frame?.url||'').host;}catch{return '';}})();
 const answer=await dialog.showMessageBox(win,{message:T('{site} wants to share your screen').replace('{site}',host||T('This site')),detail:T('Choose what to share.'),buttons:[T('Cancel'),...sources.map(s=>s.id.startsWith('screen:')?T('Entire screen')+(sources.filter(x=>x.id.startsWith('screen:')).length>1?' · '+s.name:''):s.name.slice(0,60))],defaultId:0,cancelId:0});
 const source=sources[answer.response-1];callback(source?{video:source}:{});}catch{callback({});}},{useSystemPicker:!smoke});}
// HTTP sign-in (Basic/Digest): a small sheet over the window asks for a user name and password.
function signInPrompt(authInfo,wc){return new Promise(resolve=>{const T=text=>translate(settings.language,text),dark=nativeTheme.shouldUseDarkColors,host=authInfo.host+(authInfo.port&&![80,443].includes(authInfo.port)?':'+authInfo.port:'');
 const esc=v=>String(v||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
 const sheet=new BrowserWindow({parent:win,modal:true,width:380,height:250,resizable:false,minimizable:false,maximizable:false,show:false,backgroundColor:dark?'#2c2c2e':'#f2f2f4',webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,javascript:true}});
 const html='<!doctype html><meta charset=utf-8><meta http-equiv="Content-Security-Policy" content="default-src \'none\';style-src \'unsafe-inline\';script-src \'unsafe-inline\'"><style>:root{color-scheme:light dark;font:13px -apple-system,sans-serif}body{margin:0;padding:18px 20px;background:'+(dark?'#2c2c2e':'#f2f2f4')+'}h1{font-size:13px;font-weight:600;margin:0 0 4px}p{margin:0 0 12px;color:'+(dark?'#aeaeb2':'#6e6e73')+';font-size:12px;overflow-wrap:anywhere}input{display:block;width:100%;box-sizing:border-box;height:26px;margin:0 0 8px;padding:0 8px;border-radius:6px;border:.5px solid '+(dark?'#545458':'#c7c7cc')+';background:'+(dark?'#1c1c1e':'#fff')+';color:inherit;font:inherit}div{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}button{height:26px;padding:0 14px;border-radius:6px;border:0;font:inherit;background:'+(dark?'#48484a':'#e5e5ea')+';color:inherit}button[type=submit]{background:#0a84ff;color:#fff}</style>'+
  '<form><h1>'+esc(T('Sign in to {site}').replace('{site}',host))+'</h1><p>'+esc(authInfo.realm?T('The site says: “{realm}”').replace('{realm}',authInfo.realm.slice(0,120)):T('This site needs a user name and password.'))+(authInfo.scheme==='basic'&&authInfo.port!==443&&!authInfo.isProxy?' '+esc(T('Your password is sent without encryption.')):'')+'</p><input name=u autocomplete=username placeholder="'+esc(T('User name'))+'" autofocus><input name=p type=password placeholder="'+esc(T('Password'))+'"><div><button type=button>'+esc(T('Cancel'))+'</button><button type=submit>'+esc(T('Sign In'))+'</button></div></form>'+
  '<script>const f=document.forms[0];f.onsubmit=e=>{e.preventDefault();document.title=JSON.stringify({username:f.u.value,password:f.p.value});};f.querySelector("button[type=button]").onclick=()=>{document.title="cancel"};addEventListener("keydown",e=>{if(e.key==="Escape")document.title="cancel"});</script>';
 let done=false;const finish=answer=>{if(done)return;done=true;resolve(answer);if(!sheet.isDestroyed())sheet.close();};
 sheet.webContents.on('page-title-updated',(e,title)=>{if(title==='cancel')finish(null);else if(title.startsWith('{'))try{finish(JSON.parse(title));}catch{finish(null);}});
 sheet.webContents.setWindowOpenHandler(()=>({action:'deny'}));sheet.webContents.on('will-navigate',e=>e.preventDefault());sheet.on('closed',()=>finish(null));if(wc&&!wc.isDestroyed())wc.once('destroyed',()=>finish(null));
 sheet.once('ready-to-show',()=>sheet.show());sheet.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(html));});}
function setupMenu() {
  const localize=items=>items.map(item=>({...item,...(item.label?{label:translate(settings.language,item.label)}:{}),...(item.submenu?{submenu:localize(item.submenu)}:{})}));
  Menu.setApplicationMenu(Menu.buildFromTemplate(localize([
    {label:'Prism',submenu:[{role:'about'},{label:'Check for Updates…',click:()=>{win.webContents.send('open-panel','updates');updater.check();}},{label:translate(settings.language,'What’s New'),click:()=>showWhatsNew()},{label:'Release Notes',click:()=>action('release-notes')},{label:'Settings…',accelerator:'CmdOrCtrl+,',click:()=>win.webContents.send('open-panel','appearance')},{type:'separator'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]},
    {label:'File',submenu:[{label:'New tab',accelerator:'CmdOrCtrl+K',click:()=>command('k')},{label:'New Lens Window',accelerator:'CmdOrCtrl+Alt+N',click:()=>action('lens-window')},{label:'Tidy Tabs',accelerator:'CmdOrCtrl+Alt+K',click:()=>action('tidy').then(r=>{if(r?.message)feedback('note',{message:r.message});})},{label:'Close tab',accelerator:'CmdOrCtrl+W',click:()=>command('w')},{label:'Reopen closed tab',accelerator:'CmdOrCtrl+Shift+T',click:()=>command('reopen')},{type:'separator'},{label:'Save Page As…',accelerator:'CmdOrCtrl+S',click:()=>action('save-page')},{label:'Print…',accelerator:'CmdOrCtrl+P',click:()=>action('print')},{type:'separator'},{label:'Import From',submenu:[{label:'Another Browser…',click:()=>action('open-tool',{section:'imports'})},{type:'separator'},{label:'Bookmarks File…',click:()=>action('import-bookmark-file').then(r=>{if(r?.error||r?.message)feedback('note',{message:r.error||r.message});},e=>feedback('note',{message:e.message}))},{label:'Passwords File…',click:()=>action('import-passwords').then(r=>{if(r?.error||r?.message)feedback('note',{message:r.error||r.message});},e=>feedback('note',{message:e.message}))}]},{label:'Add to Dock…',click:()=>action('add-to-dock').then(r=>{if(r?.error)feedback('note',{message:r.error});})}]},
    {label:'Edit',submenu:[{label:'Copy page link',accelerator:'Control+Shift+C',click:()=>action('copy-page-url')},{label:'Undo',accelerator:'CmdOrCtrl+Z',click:()=>undoKey()},{label:'Restore closed tab',accelerator:'Control+Z',visible:false,acceleratorWorksWhenHidden:true,click:()=>undoKey()},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'pasteAndMatchStyle'},{role:'delete'},{role:'selectAll'}]},
    {label:'Bookmarks',submenu:[{label:'Bookmark this page',accelerator:'CmdOrCtrl+D',click:()=>action('bookmark-current')},{type:'separator'},{label:'Import from Another Browser…',click:()=>action('open-tool',{section:'imports'})}]},
    {label:'View',submenu:[{label:'Instagram Mobile App',click:()=>action('instagram-app-open')},{type:'separator'},{label:'Tabs & layout',click:()=>win.webContents.send('open-panel','workspace')},{label:'Profile',click:()=>win.webContents.send('open-panel','profile')},{label:'Inspect page',accelerator:'CmdOrCtrl+Alt+I',click:()=>action('inspect')},{label:'Picture in picture',click:()=>action('pip')},{label:'Translate selected text',click:()=>action('page-ai-open-selection')},{label:'Page assistant',click:()=>win.webContents.send('open-panel','page-assistant')},{label:'AI & assistants',click:()=>win.webContents.send('open-panel','ai')},{label:'Find in page',accelerator:'CmdOrCtrl+F',click:()=>command('f')},{label:'Site permissions',click:()=>win.webContents.send('open-panel','permissions')},{label:'Address bar',accelerator:'CmdOrCtrl+L',click:()=>command('l')},{label:'Beam',accelerator:'CmdOrCtrl+T',click:()=>commandBar?.open()},{label:'Clear view',accelerator:'CmdOrCtrl+Alt+S',click:()=>action('set-setting',{key:'compactMode',value:!settings.compactMode})},{label:'Reload page',accelerator:'CmdOrCtrl+R',click:()=>command('r')},{label:'Reload without cache',accelerator:'CmdOrCtrl+Alt+R',click:()=>command('R')},{label:'Show Reader',accelerator:'CmdOrCtrl+Shift+R',click:()=>action('reader-toggle').then(r=>{if(r?.error)feedback('note',{message:r.error});})},{type:'separator'},{label:'Zoom in',accelerator:'CmdOrCtrl+Plus',click:()=>zoomActive(1)},{label:'Zoom in',accelerator:'CmdOrCtrl+=',visible:false,acceleratorWorksWhenHidden:true,click:()=>zoomActive(1)},{label:'Zoom out',accelerator:'CmdOrCtrl+-',click:()=>zoomActive(-1)},{label:'Actual size',accelerator:'CmdOrCtrl+0',click:()=>zoomActive(0)},{role:'togglefullscreen'}]},
    // Spaces: ⌃1…⌃9 go to the first nine (as in the spaces popover), named after them.
    {label:'Spaces',submenu:[{label:'Show all spaces',click:()=>win?.webContents.send('open-panel','quick-spaces')},{type:'separator'},...settings.spaces.slice(0,9).map((s,i)=>({label:s.name,accelerator:'Control+'+(i+1),click:()=>action('space',s.id).catch(()=>{})})),{label:'Private',click:()=>action('space','private').catch(()=>{})}]},
    // History, Window and Help as in Safari (0.40): ⌘[ and ⌘] go back and forward, the Window menu is macOS's own
    // (Minimize, Zoom, Bring All to Front and the window list) and Help has macOS's menu search.
    {label:'History',submenu:[{label:'Back',accelerator:'CmdOrCtrl+[',click:()=>action('back')},{label:'Forward',accelerator:'CmdOrCtrl+]',click:()=>action('forward')},{type:'separator'},{label:'Reopen closed tab',click:()=>command('reopen')},{label:'Show All History',accelerator:'CmdOrCtrl+Y',click:()=>command('y')}]},
    {label:'Downloads',submenu:[{label:'Show downloads',accelerator:'CmdOrCtrl+J',click:()=>win.webContents.send('open-panel','downloads')}]},
    {label:'Window',role:'windowMenu'},
    {label:'Help',role:'help',submenu:[{label:'Release Notes',click:()=>action('release-notes')},{label:'What’s New',click:()=>showWhatsNew()},{type:'separator'},{label:'Show Me Around',click:()=>action('tour')}]}
  ])));
}
app.on('login',(event,wc,details,authInfo,callback)=>{event.preventDefault();signInPrompt(authInfo,wc).then(answer=>answer?callback(answer.username,answer.password):callback(),()=>callback());});
app.whenReady().then(async()=>{bootMark('ready');for(const file of [vaultFile,walletFile,passkeyFile])secureFile(file).load().catch(error=>console.error('Prism could not unlock '+path.basename(file)+': '+error.message));
  app.setAboutPanelOptions({applicationName:'Prism',applicationVersion:require('../package.json').version,iconPath:path.join(__dirname,'..','assets','prism-glass.png')});
  if(!smoke){localUpdater=require('./local-updater.cjs').createLocalUpdater({app,config:require('./local-update-config.json'),onChange:()=>{if(win)emit();}});if(settings.automaticUpdates&&await localUpdater.startup()){app.exit(0);return;}}
  if(!smoke){try{library={...library,...JSON.parse(fs.readFileSync(libraryFile,'utf8'))};}catch{}}library.archive=normalizeArchive(library.archive);library.folderIcons=require('./folders.cjs').normalizeFolderIcons(library.folderIcons);
  if(!fs.existsSync(settingsFile)&&!smoke)settings.theme=library.theme||'system';
  nativeTheme.themeSource=settings.theme;
  const ses=session.fromPartition(browserPartition);
  const permissionFile=path.join(app.getPath('userData'),'site-permissions.json');let savedPermissions=[];if(!smoke)try{savedPermissions=JSON.parse(fs.readFileSync(permissionFile,'utf8'));}catch{}
  const externalFile=path.join(app.getPath('userData'),'external-links.json');let savedExternal=[];if(!smoke)try{savedExternal=JSON.parse(fs.readFileSync(externalFile,'utf8'));}catch{}
  externalLinks=require('./external-links.cjs').createExternalLinks({load:savedExternal,save:rows=>{if(!smoke){fs.mkdirSync(path.dirname(externalFile),{recursive:true});fs.writeFileSync(externalFile+'.tmp',JSON.stringify(rows),{mode:0o600});fs.renameSync(externalFile+'.tmp',externalFile);}},appName:url=>{try{return (app.getApplicationNameForProtocol(url)||'').replace(/\.app$/i,'');}catch{return '';}},prompt:p=>externalLinkHooks.prompt(p),open:url=>externalLinkHooks.open(url)});
  permissions=createPermissions({load:savedPermissions,tabFor:wc=>tabs.find(t=>t.id===activeId&&t.view?.webContents===wc),save:rows=>{if(!smoke){fs.mkdirSync(path.dirname(permissionFile),{recursive:true});fs.writeFileSync(permissionFile+'.tmp',JSON.stringify(rows),{mode:0o600});fs.renameSync(permissionFile+'.tmp',permissionFile);}},prompt:async(site,keys)=>{if(smoke)return 'ask';const T=text=>translate(settings.language,text),names={camera:'your camera',microphone:'your microphone',geolocation:'your location',notifications:'show notifications',clipboard:'your clipboard',midi:'your MIDI devices'};
   const answer=await dialog.showMessageBox(win,{message:T('{site} wants to use {what}').replace('{site}',new URL(site).host).replace('{what}',keys.map(k=>T(names[k]||k)).join(T(' and '))),detail:T('Your choice applies to this site in Personal and Work. macOS may require additional permission.'),buttons:[T('Not now'),T('Block'),T('Allow')],defaultId:2,cancelId:0});return ['ask','block','allow'][answer.response];}});
  // Device access (devices.cjs, 0.43): WebHID, WebUSB, Web Serial and Web Bluetooth with a native chooser.
  const deviceFile=path.join(app.getPath('userData'),'site-devices.json');let savedDevices=[];if(!smoke)try{savedDevices=JSON.parse(fs.readFileSync(deviceFile,'utf8'));}catch{}
  devices=require('./devices.cjs').createDevices({load:savedDevices,enabled:()=>settings.deviceAccess!==false,isPrivate:wc=>tabs.some(t=>t.space==='private'&&t.view?.webContents===wc),translate:text=>translate(settings.language,text),
   save:rows=>{if(!smoke){fs.mkdirSync(path.dirname(deviceFile),{recursive:true});fs.writeFileSync(deviceFile+'.tmp',JSON.stringify(rows),{mode:0o600});fs.renameSync(deviceFile+'.tmp',deviceFile);}},
   choose:async({host,type,names})=>{const T=text=>translate(settings.language,text),kind={hid:'a keyboard, mouse or other input device',usb:'a USB device',serial:'a serial port',bluetooth:'a Bluetooth device'}[type];
    if(deviceChooser)return deviceChooser({host,type,names});
    if(!names.length){await dialog.showMessageBox(win,{type:'info',message:T('{site} wants to connect to {what}').replace('{site}',host).replace('{what}',T(kind)),detail:T('No compatible devices found. Plug the device in (or turn it on) and try again.'+(type==='bluetooth'?' Prism needs Bluetooth access in System Settings → Privacy & Security.':'')),buttons:[T('OK')]});return null;}
    const answer=await dialog.showMessageBox(win,{message:T('{site} wants to connect to {what}').replace('{site}',host).replace('{what}',T(kind)),detail:T('Choose a device. The site can use it until you remove it in its site settings.'),buttons:[T('Cancel'),...names.slice(0,8)],defaultId:0,cancelId:0});return answer.response>0?answer.response-1:null;}});
  const hiddenFile=path.join(app.getPath('userData'),'site-hidden.json');let hiddenMemory={};
  siteControls=require('./site-controls.cjs').createSiteControls({permissions,devices,activeTab:()=>tabs.find(t=>t.id===activeId),settings,saveSettings,translate:text=>translate(settings.language,text),defaultZoom:()=>settings.pageZoom||1,
   readHidden:()=>{if(smoke)return hiddenMemory;try{return JSON.parse(fs.readFileSync(hiddenFile,'utf8'));}catch{return {};}},
   writeHidden:value=>{hiddenMemory=value;if(!smoke){fs.mkdirSync(path.dirname(hiddenFile),{recursive:true});fs.writeFileSync(hiddenFile+'.tmp',JSON.stringify(value),{mode:0o600});fs.renameSync(hiddenFile+'.tmp',hiddenFile);}},
   confirm:async message=>smoke||(await dialog.showMessageBox(win,{type:'question',message,buttons:[translate(settings.language,'Cancel'),translate(settings.language,'Clear')],defaultId:0,cancelId:0})).response===1});
  ses.setPermissionRequestHandler((wc,p,cb,d)=>{if(p==='fullscreen'){cb(allowFullscreen(wc));return;}if(openWithoutPrompt.has(p)){cb(true);return;}if(p==='openExternal'){cb(false);if(d?.externalURL)openExternalLink(wc,d.externalURL,false);return;}permissions.request(wc,p,cb,d).catch(()=>{});});
  ses.on('select-webauthn-account',require('./passkey-selection.cjs').passkeyHandler({activeTab:()=>tabs.find(t=>t.id===activeId),choose:async(origin,accounts)=>{if(accounts.length===1)return accounts[0].credentialId;const choice=await dialog.showMessageBox(win,{message:'Choose a passkey',detail:origin,buttons:['Cancel',...accounts.map(a=>String(a.name||a.displayName||'Saved account').slice(0,200))],defaultId:0,cancelId:0});return accounts[choice.response-1]?.credentialId;}}));
  ses.setPermissionCheckHandler((wc,p,url,d)=>p==='fullscreen'?allowFullscreen(wc):openWithoutPrompt.has(p)||devices.check(wc,p,url)||permissions.check(wc,p,url,d));devices.attach(ses);shareScreen(ses);
  // Registered before electron-chrome-extensions, which freezes `chrome` once its own APIs are in place.
  for(const type of ['frame','service-worker'])ses.registerPreloadScript({id:'prism-extension-compat-'+type,type,filePath:path.join(__dirname,'extension-compat-preload.cjs')});
  registerGestures(ses);
  // chrome.permissions matched the way Chrome matches host patterns; optional permissions ask once (0.44).
  extensionPermissions=require('./extension-permissions.cjs').createExtensionPermissions({file:path.join(app.getPath('userData'),'extension-permissions.json'),
   ask:async({name,permissions,origins})=>{const list=[...permissions,...origins.map(o=>o.replace(/^\*:\/\//,'').replace(/\/\*$/,''))].slice(0,12).join('\n');
    const answer=await dialog.showMessageBox(win,{type:'question',message:menuLabel('Allow {name} more access?').replace('{name}',String(name||'').slice(0,80)),detail:list,buttons:[menuLabel('Don’t Allow'),menuLabel('Allow')],defaultId:1,cancelId:0});return answer.response===1;}});
  extensionApi=new ElectronChromeExtensions({license:'GPL-3.0',session:ses,
    createTab:async details=>{if(details.url&&!allowedTabURL(details.url))throw Error('Unsupported tab URL.');const t=makeTab(details.url||'https://www.google.com/',details.active!==false,space==='private'?homeSpace():space);attach(t);return [t.view.webContents,win];},
    selectTab:wc=>{const t=tabs.find(t=>t.view?.webContents===wc);if(t&&t!==warming)selectTab(t.id);},
    removeTab:wc=>{const t=tabs.find(t=>t.view?.webContents===wc);if(t)return closeTab(t.id);},
    requestPermissions:async(extension,request)=>extensionPermissions?.request(extension,request)??false,
    // chrome.windows.create: extension pages (pop-out vaults, translators, sign-in helpers) get their own sized window
    // registered with the extension API; plain web pages open as Prism tabs instead.
    createWindow:async details=>{const urls=(Array.isArray(details.url)?details.url:[details.url]).filter(u=>typeof u==='string'&&u);const ext=urls.filter(u=>u.startsWith('chrome-extension://')&&allowedTabURL(u));
     if(!ext.length){for(const u of urls)if(/^https?:\/\//i.test(u))makeTab(u,details.focused!==false,space==='private'?homeSpace():space);return win;}
     const [cw,ch]=win.getContentSize(),[wx,wy]=win.getPosition(),width=Math.max(320,Math.min(Number(details.width)||460,1600)),height=Math.max(240,Math.min(Number(details.height)||640,1200));
     const child=new BrowserWindow({width,height,x:Number.isFinite(details.left)?details.left:Math.round(wx+(cw-width)/2),y:Number.isFinite(details.top)?details.top:Math.round(wy+Math.max(40,(ch-height)/3)),show:false,title:'Prism',autoHideMenuBar:true,minimizable:details.type!=='popup',fullscreenable:details.type==='normal',backgroundColor:nativeTheme.shouldUseDarkColors?'#1c1f24':'#ffffff',webPreferences:{session:ses,sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,allowRunningInsecureContent:false}});
     extensionWindows.add(child);child.once('closed',()=>extensionWindows.delete(child));guardPopup(child,{space:space==='private'?homeSpace():space});extensionApi.addTab(child.webContents,child);
     child.webContents.on('page-title-updated',(_e,title)=>child.setTitle(String(title||'Prism').slice(0,200)));
     // Shown (and focused) before loading so chrome.windows.getCurrent() in the page reports this window, not Prism's.
     if(details.state==='maximized')child.maximize();if(details.focused===false)child.showInactive();else{child.show();child.focus();}await child.loadURL(ext[0]).catch(()=>{});return child;},
    removeWindow:window=>{if(extensionWindows.has(window)&&!window.isDestroyed())window.destroy();}
  });
  // electron-chrome-extensions 4.9 passes chrome.windows.create URLs to createWindow unresolved, so "vault.html" would lose
  // its extension. Resolve them against the calling extension first; if the internals change, creation simply falls back.
  {const store=extensionApi.ctx?.store;if(store&&typeof store.createWindow==='function'){const original=store.createWindow.bind(store);
   store.createWindow=(event,details)=>{const base=event?.extension?.url,fix=u=>typeof u==='string'&&base&&!/^[a-z][a-z0-9+.-]*:/i.test(u)?new URL(u,base).href:u;return original(event,details?{...details,url:Array.isArray(details.url)?details.url.map(fix):fix(details.url)}:details);};}}
  extensionPermissions.attach(extensionApi.ctx.router,id=>ses.extensions.getExtension(id));
  // Native messaging that handles large and non-ASCII messages (0.47), e.g. Apple's iCloud Passwords helper.
  try{require('./native-messaging.cjs').attach(extensionApi.ctx.router,{userData:app.getPath('userData')});}catch(error){console.error('native messaging',error);}
  {const browserAction=extensionApi.api?.browserAction;if(browserAction&&typeof browserAction.activateClick==='function'){const original=browserAction.activateClick.bind(browserAction);
   browserAction.activateClick=details=>{const ext=services.extensionRows().find(e=>e.id===details?.extensionId&&e.loaded);if(ext?.hasPopup){action('extension-action',{id:ext.id}).catch(()=>{});return;}return original(details);};}}
  // Extension right-click items outlive a restart (0.44), as in Chrome. Most extensions create them once, in
  // chrome.runtime.onInstalled, which does not run again when Prism starts, so items such as "Save to Cosmos" used to
  // vanish after the first restart. They are kept per extension version; an update starts fresh, as in Chrome.
  {const menusApi=extensionApi.api?.contextMenus;if(menusApi?.menus instanceof Map&&typeof menusApi.addContextItem==='function'){
   const file=path.join(app.getPath('userData'),'extension-menus.json');let saved={},written='';try{saved=JSON.parse(fs.readFileSync(file,'utf8'))||{};written=JSON.stringify(saved);}catch{}
   const save=()=>{for(const ext of ses.extensions.getAllExtensions()){const items=menusApi.menus.get(ext.id);if(items?.size)saved[ext.id]={version:ext.version,items:[...items.values()].slice(0,200).map(p=>JSON.parse(JSON.stringify(p)))};else delete saved[ext.id];}
    const text=JSON.stringify(saved);if(text!==written){written=text;try{fs.writeFileSync(file,text);}catch{}}};
   let timer=null;const later=()=>{clearTimeout(timer);timer=setTimeout(save,1000);timer.unref?.();};
   const add=menusApi.addContextItem.bind(menusApi);menusApi.addContextItem=(id,props)=>{add(id,props);later();};
   // An extension reloaded by Prism (activeTab access, updates, Reload) loses its items when it unloads; they are kept here first.
   const versions=new Map(),drop=menusApi.menus.delete.bind(menusApi.menus);menusApi.menus.delete=id=>{const items=menusApi.menus.get(id);if(items?.size&&versions.has(id))saved[id]={version:versions.get(id),items:[...items.values()].slice(0,200).map(p=>JSON.parse(JSON.stringify(p)))};return drop(id);};
   ses.extensions.on('extension-loaded',(_event,ext)=>{versions.set(ext.id,ext.version);const keep=saved[ext.id];if(!keep)return;if(keep.version!==ext.version){delete saved[ext.id];later();return;}if(menusApi.menus.has(ext.id))return;for(const props of keep.items||[])if(props&&props.id!=null)add(ext.id,props);});
   // Removing items happens inside the library; changes are picked up every few seconds and when Prism quits.
   setInterval(save,5000).unref?.();app.on('before-quit',save);}}
  sidePanels=require('./side-panel.cjs').createSidePanels({ses,window:()=>win,settings,saveSettings,emit,layout,router:extensionApi.ctx.router,activeTabId:()=>{const t=tabs.find(t=>t.id===activeId);return t&&t.space!=='private'&&t.view?t.view.webContents.id:-1;}});
  sidePanels.setOpenTab(url=>makeTab(url,true,space==='private'?homeSpace():space));
  ElectronChromeExtensions.handleCRXProtocol(session.defaultSession);
  services=createServices({app,ses,window:()=>win,settings,saveSettings,emit,smoke,onDownloadComplete:id=>ai?.enqueue(id)});
  blocker=new Blocker({file:path.join(app.getPath('userData'),'blocking.json'),changed:emit});blocker.bind(ses,false,details=>siteBypass.observe(details));normalNetwork=new PrivateNetwork({session:ses,gate:false,direct:true,label:'normal',helper:tpwsHelper,route:siteBypass.route,changed:emit,secureDns:on=>{dnsWants.normal=on;syncDns();}});if(settings.bypassNormal!=='off')applyBypass();require('./release-notes.cjs').register(ses,{root:path.join(__dirname,'..'),version:require('../package.json').version});
  setupPrivate();if(settings.privacyEverywhere)applyPrivacyEverywhere();
  ai=require('./ai.cjs').createAI({app,safeStorage,settings,emit,downloads:()=>services.downloads(),saveDownloads:()=>services.persistDownloads(),isPrivate:()=>space==='private'});
  passwords=createPasswords({app,window:()=>win,settings,readVault,writeVault:entries=>saveEncrypted(vaultFile,entries),importVault:next=>commitWithUndo({...importStore('passwords'),next}),activeTab:()=>tabs.find(t=>t.id===activeId),emit,customPicker:true,confirm:confirmOwner});
  pageAssistant=require('./page-assistant.cjs').createPageAssistant({activeTab:()=>tabs.find(t=>t.id===activeId),isPrivate:()=>space==='private',getKey:()=>ai.pageKey(),getProvider:()=>ai.provider()});
  // Web Share from the active tab's main frame: re-validated here, then shown in the native macOS share menu.
  passkeys=require('./passkeys.cjs').createPasskeys({read:readPasskeys,write:rows=>{if(!secureFile(passkeyFile).loaded())throw Error('Passkeys are still unlocking. Try again in a moment.');return saveEncrypted(passkeyFile,rows);},confirmOwner,tabFor:wc=>tabs.find(t=>t.view?.webContents===wc),emit});
  ipcMain.handle('prism-passkey',(event,value)=>passkeys.request(event,value));
  // Picture in Picture from a page (any frame): allowed unless the user blocked it for the tab's site.
  ipcMain.handle('prism-pip',event=>{const t=tabs.find(t=>t.view?.webContents===event.sender);if(!t||t.space==='private')return true;const site=require('./site-permissions.cjs').origin(event.sender.getURL());return site?permissions.noted(site,'pip'):true;});
  ipcMain.handle('prism-swipe',swipeRequest);
  // Link clicks (for Peek from pinned tabs) and Shift-click to Peek, reported by page-preload.cjs from a tab's top frame.
  const linkSender=(event,url)=>{const t=tabs.find(t=>t.view?.webContents===event.sender);return t&&event.senderFrame===event.sender.mainFrame&&typeof url==='string'&&/^https?:\/\//i.test(url)&&url.length<8192?t:null;};
  ipcMain.on('prism-link',(event,url)=>{const t=linkSender(event,url);if(t)t.linkClick={url,at:Date.now()};});
  ipcMain.on('prism-peek',(event,url)=>{const t=linkSender(event,url);if(t&&(t.id===activeId||split?.ids.includes(t.id)))peek?.open(url,t.space);});readSystemSwipe();app.on('did-become-active',readSystemSwipe);
  ipcMain.handle('prism-share',(event,value)=>{const t=tabs.find(t=>t.view?.webContents===event.sender);if(!t||t.id!==activeId||event.senderFrame!==event.sender.mainFrame||!value||typeof value!=='object')return false;
   const text=v=>typeof v==='string'?v.slice(0,5000):'';let url='';try{if(value.url){const u=new URL(value.url);if(!['http:','https:','mailto:'].includes(u.protocol))return false;url=u.href;}}catch{return false;}
   const texts=[text(value.title),text(value.text)].filter(Boolean);if(!url&&!texts.length)return false;
   return new Promise(resolve=>{try{new (require('electron').ShareMenu)({...(texts.length?{texts}:{}),...(url?{urls:[url]}:{})}).popup({window:win,callback:()=>resolve(true)});}catch{resolve(false);}});});
  // Prism Shield's rules for a starting frame (shield-preload.cjs). A main frame names its own new address; a frame inside
  // a page is judged by the page it sits in.
  const shieldFrame=(event,value)=>{const wc=event.sender;if(!blocker||!value||typeof value.url!=='string'||value.url.length>8192)return null;const privateMode=wc.session===privateSession;return {url:value.url,main:!!value.main,top:value.main?value.url:wc.getURL(),privateMode};};
  ipcMain.on('prism-shield-frame',(event,value)=>{const request=shieldFrame(event,value);try{event.returnValue=request?blocker.frame(request):null;}catch{event.returnValue=null;}});
  ipcMain.handle('prism-shield-dom',(event,value)=>{const request=shieldFrame(event,value);return request?blocker.dom({...request,classes:value.classes,ids:value.ids,hrefs:value.hrefs}):'';});
  ipcMain.on('prism-login-submitted',(event,value)=>{const t=tabs.find(t=>t.view?.webContents===event.sender);if(!t||t.space==='private'||t.id!==activeId||!event.senderFrame||event.senderFrame.top!==event.sender.mainFrame)return;passwords.offer(t,value,event.senderFrame.url).catch(()=>{});});
  // Chrome Web Store extensions update themselves (0.44; checked when Prism becomes active, at most every 3 hours), so
  // they keep up with the sites they work on. An update reloads the extension and its record follows (extension-loaded).
  await installChromeWebStore({session:ses,extensionsPath:path.join(app.getPath('userData'),'store-extensions'),loadExtensions:false,autoUpdate:!smoke,beforeInstall:async details=>({action:await services.reviewExtension(details.manifest,details.localizedName)?'allow':'deny'})});
  win=new BrowserWindow({...windowFrame(),minWidth:760,minHeight:560,title:'Prism',titleBarStyle:'hiddenInset',trafficLightPosition:{x:22,y:15},transparent:true,backgroundColor:'#00000000',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true}});
  instagramApp=createInstagramApp({BrowserWindow,parent:win,chromeVersion:process.versions.chrome,onExternal:(url,isPrivate,tabSpace)=>{makeTab(url,true,isPrivate?'private':tabSpace);if(win?.isMinimized())win.restore();win?.show();win?.focus();}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));bootMark('window');win.once('ready-to-show',()=>bootMark('ready-to-show'));if(process.platform==='darwin')try{nativeGlass()?.forceClick?.(win.getNativeWindowHandle(),()=>forceClickLens());}catch{}
  // Right-click editing in Prism's own fields (0.37, edit-menu.cjs).
  const editMenu=wc=>require('./edit-menu.cjs').attachEditMenu(wc,{Menu,window:()=>win,translate:menuLabel});editMenu(win.webContents);
  win.webContents.on('will-navigate',event=>event.preventDefault());
  toolWindows=require('./tool-windows.cjs').createToolWindows({WebContentsView,parent:()=>win,snapshot,decorate:editMenu,BrowserWindow:process.platform==='darwin'||process.env.PRISM_TEST_PANEL_HOST?BrowserWindow:null,onHost:panelHost,...(smoke?{keepWarmMs:3000}:{}),onClosed:(key,reason,section,wasVisible)=>{pageAssistant?.cancel();if(key==='settings')passwords?.closeManager();if(wasVisible){if(reason!=='blur'&&win&&!win.isDestroyed()){win.webContents.focus();popoverReturn={section,seq:++popoverSeq};}emit();}}});
  ipcMain.handle('action',(event,name,value)=>{
    const tool=toolWindows.trusted(event);
    if(tool){if(name==='overlay'||name==='find-close')return {activeId};if(name==='panel-size'){toolWindows.size(value);return;}if(name==='panel-fit'){toolWindows.fit(Number(value));return;}if(name==='close-tool'){toolWindows.closeAll();return;}return action(name,value);}
    if(!win||win.isDestroyed()||event.sender!==win.webContents || event.senderFrame!==win.webContents.mainFrame || event.senderFrame.url!==shellURL)throw new Error('Untrusted sender');
    return action(name,value);
  });
  wallet=require('./wallet.cjs').createWallet({read:readCards,write:rows=>saveEncrypted(walletFile,rows)});
  autofill=require('./autofill.cjs').createAutofill({WebContentsView,ipcMain,window:()=>win,activeTab:()=>tabs.find(t=>t.id===activeId),readVault,wallet,settings,nativeTheme,isOverlay:()=>overlay||toolWindows?.visible()});
  win.on('blur',()=>autofill.dismiss());
  const front=()=>tabs.find(t=>t.id===activeId);win.on('blur',()=>spectrum.focus(false,'',quiet(space)));win.on('focus',()=>spectrum.focus(true,front()?.url,quiet(space)));
  updater=localUpdater?.snapshot().configured?localUpdater:createUpdater({autoUpdater,app,config:require('./update-config.json'),onChange:emit});updater.schedule(settings.automaticUpdates);if(settings.automaticUpdates&&localUpdater?.snapshot().configured){localUpdater.watchFeed();app.on('did-become-active',()=>localUpdater.resumed());}checkWhatsNew();
  {const mm=require('./memory-manager.cjs');memoryManager=mm.createMemoryManager({app,session:ses,settings,tabs:()=>tabs,activeId:()=>activeId,sleepTab,systemPressure:process.platform==='darwin'?()=>mm.readSystemPressure():undefined});}
  inspector=require('./inspector.cjs').createInspector({WebContentsView,parent:()=>win,changed:()=>{layout();emit();}});
  surfaces=require('./surfaces.cjs').createSurfaces(ipcMain);
  reader=require('./reader.cjs').createReader({WebContentsView,parent:()=>win,surfaces,look:()=>({dark:nativeTheme.shouldUseDarkColors,language:settings.language,reduceMotion:!!settings.reduceMotion||systemPreferences.getAnimationSettings().prefersReducedMotion}),
   openURL:(url,newTab,tabId)=>{const t=tabs.find(x=>x.id===tabId);if(!t||newTab){if(t)openInBackground(url,t);else makeTab(url,true,space);return;}t.view?.webContents.loadURL(url).catch(()=>{});},
   changed:()=>{layout();emit();},prefs:()=>settings.reader,savePrefs:value=>{settings.reader=value;saveSettings();}});
  webApps=require('./web-apps.cjs').createWebApps({dir:process.env.PRISM_WEB_APPS_DIR||undefined,data:process.env.PRISM_WEB_APPS_DATA||null,version:app.getVersion(),appPath:app.isPackaged?null:app.getAppPath()});
  // After an update the launcher copied into each web app is copied again, so they keep starting.
  if(!smoke)setTimeout(()=>webApps.refresh().catch(()=>{}),8000).unref?.();
  commandBar=require('./command-bar.cjs').createCommandBar({BrowserWindow,parent:()=>win,surfaces,entries:commandEntries,run:commandRun,suggest:searchSuggestions,decorate:editMenu,ask:beamAsk,image:bytes=>action('image-search',{bytes}),look:()=>({dark:nativeTheme.shouldUseDarkColors,language:settings.language,reduceMotion:!!settings.reduceMotion||systemPreferences.getAnimationSettings().prefersReducedMotion})});
  media=require('./media.cjs').createMedia({tabs:()=>tabs,visibleIds:()=>split?split.ids:[activeId],emit});
  pip=require('./pip.cjs').createPip({BrowserWindow,WebContentsView,screen,parent:()=>win,surfaces,language:()=>settings.language,savedPlace:()=>settings.pipPlace,savePlace:place=>{settings.pipPlace=place;saveSettings();},onChange:()=>{layout();emit();},reduceMotion:()=>!!settings.reduceMotion||systemPreferences.getAnimationSettings().prefersReducedMotion,
   detach:t=>{win.contentView.removeChildView(t.view);t.view.setVisible(true);t.view._prismVisible=null;t.view._prismBounds=null;t.view._prismRadius=null;},
   attachBack:(t,show)=>{if(!win||win.isDestroyed()||!t.view)return;win.contentView.addChildView(t.view);t.view._prismVisible=null;t.view._prismBounds=null;t.view._prismRadius=null;if(show&&tabs.includes(t))selectTab(t.id);else layout();}});
  peek=require('./peek.cjs').createPeek({BrowserWindow,WebContentsView,parent:()=>win,pageArea:()=>pageArea,webPreferences:tabSpace=>pageWebPreferences(tabSpace==='private'),surfaces,openTab:(url,tabSpace)=>{makeTab(url,true,tabSpace);if(win&&!win.isDestroyed()){win.show();win.focus();}},screen,normalize:normalizeAddress,cleanLink:url=>require('./blocker.cjs').cleanLink(url),copy:text=>{clipboard.writeText(text);feedback('link-copied');},
   glass:host=>{try{if(!accessibility().reduceTransparency&&settings.material!=='solid')require('./native/glass.node').configure(host.getNativeWindowHandle(),settings.material==='clear'?'clear':'regular',accent(),12);}catch{}},
   savedBounds:()=>{try{return JSON.parse(fs.readFileSync(path.join(app.getPath('userData'),'lens-window.json'),'utf8'));}catch{return null;}},saveBounds:b=>{try{fs.writeFileSync(path.join(app.getPath('userData'),'lens-window.json'),JSON.stringify(b));}catch{}},
   configure:(wc,tabSpace)=>{const isPrivate=tabSpace==='private';blocker?.attach(wc,isPrivate);wc.setZoomFactor(settings.pageZoom);applyPinch(wc);if(isPrivate)wc.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');},
   reduceMotion:()=>!!settings.reduceMotion||systemPreferences.getAnimationSettings().prefersReducedMotion,dark:()=>nativeTheme.shouldUseDarkColors,language:()=>settings.language});
  // The window gets state only once its page has loaded (0.39.4): from the start of each load of the shell until it
  // finishes, nothing is sent, then the full state with every icon and card. These are set before the first load; set
  // after it, as before, a state sent while the page was still loading was lost and favorites showed letters.
  win.webContents.on('did-start-navigation',(details,url,inPlace,mainFrame)=>{if((details?.isMainFrame??mainFrame)&&!(details?.isSameDocument??inPlace))stateTransport.hold();});
  win.webContents.on('did-finish-load',()=>{bootMark('shell-loaded');passwords?.closeManager();stateTransport.open();emit();});
  setupMenu(); await win.loadFile(path.join(__dirname,'index.html'));
  applyAppearance();
  nativeTheme.on('updated',()=>{applyAppearance();emit();reader?.restyle();peek?.restyle();});
  // The system accent colour follows System Settings live (0.40), where Prism uses it (no tint and no space colour).
  try{systemPreferences.subscribeNotification('AppleColorPreferencesChangedNotification',()=>setTimeout(()=>{applyAppearance();emit();},50));}catch{}
  watchPower();
  await services.restoreExtensions();
  if(!smoke)services.importArcIcons(library.bookmarks);
  win.setWindowButtonVisibility?.(true);
  restoreSession(!smoke||restartTest?sessionStore.load():null);
  win.on('leave-full-screen',()=>{if(htmlFullscreen)exitPageFullscreen();layout();});
  win.on('enter-full-screen',layout);
  // Popovers and Beam live in child windows; they close when the window goes to the Dock so none of them is left
  // behind as its own Dock item or floating window (0.44).
  win.on('minimize',()=>{toolWindows?.closeAll('minimize');commandBar?.hide?.();});
  // Three-finger swipe (when macOS uses three fingers to swipe between pages): right goes back, left forward.
  win.on('swipe',(_event,direction)=>{if(swipeEnabled()&&(direction==='right'||direction==='left'))action(direction==='right'?'back':'forward');});
  win.on('resize',()=>{autofill?.dismiss();layout();toolWindows?.layout();saveFrame();});win.on('move',()=>saveFrame());
  // The Dock menu (0.40): a new tab or a Private tab without going to the window first.
  app.dock?.setMenu(Menu.buildFromTemplate([{label:menuLabel('New tab'),click:()=>{if(!win)return;win.show();win.focus();makeTab();command('l');}},{label:menuLabel('New Private tab'),click:()=>{if(!win)return;win.show();win.focus();action('space','private').then(()=>{makeTab();command('l');}).catch(()=>{});}}]));
  win.on('close',async event=>{
    saveFrame(true);if(closingApproved||smoke)return;event.preventDefault();if(closingWindow)return;closingWindow=true;try{
    const dirty=(await Promise.all(tabs.filter(t=>t.view).map(t=>pageState(t.view.webContents)))).some(s=>s?.dirty);
    if(dirty||services.hasActiveDownloads()||privateServices.hasActiveDownloads()){const answer=await dialog.showMessageBox(win,{type:'question',message:'Close Prism?',detail:dirty?'Some tabs contain unsaved input. Closing will discard it.':'Downloads are still running. Closing will interrupt them.',buttons:['Keep browsing','Close Prism'],defaultId:0,cancelId:0});if(answer.response!==1){restartRequested=false;installUpdateRequested=false;return;}}
    for(const t of tabs)captureNavigation(t);await within(Promise.all(tabs.map(t=>captureScroll(t))),1500);persist();sessionStore.flush();flushLibrary();await within(Promise.allSettled([...secureFiles.values()].map(store=>store.flush())),2500);if(installUpdateRequested&&localUpdater?.snapshot().configured){if(await localUpdater.install()){services.close();privateServices.close();await privateNetwork.close().catch(()=>{});await normalNetwork?.close().catch(()=>{});app.exit(0);return;}installUpdateRequested=false;emit();return;}closingApproved=true;setTimeout(()=>app.exit(0),8000).unref?.();services.close();privateServices.close();await within(Promise.all([privateNetwork.close(),normalNetwork?.close()]),2500);if(installUpdateRequested){updater.install();return;}if(restartRequested)app.relaunch();win.close();
    }finally{closingWindow=false;}
  });
  win.on('closed',()=>{quitting=true;spectrum.flush();pip?.end('close').catch(()=>{});autofill?.destroy();updater?.close();toolWindows.destroy(); clearInterval(timer);sessionStore.close();flushLibrary();for(const t of tabs)if(t.view&&!t.view.webContents.isDestroyed())t.view.webContents.close();win=null;app.quit();setTimeout(()=>app.exit(0),5000).unref?.();});
  // The sleep sweep (every 30 s) does nothing while no background tab is awake (0.40): no page is asked anything and
  // macOS's memory pressure is not read; only tabs past their archive time are filed away.
  let sweeping=false;timer=setInterval(async()=>{if(sweeping)return;if(!tabs.some(t=>t.view&&t.id!==activeId&&!t.pip)){archiveIdle();return;}sweeping=true;try{for(const t of [...tabs]){if(quitting)break;await sleepTab(t);}if(!quitting){await enforceAwakeBudget();await memoryManager?.sweep();archiveIdle();}}finally{sweeping=false;}},30000);
  // Scroll positions for session restore arrive from the page when a scroll ends (page-preload.cjs, 0.40). They used to
  // be asked for every 5 s, forever, even with the window hidden; tab switches, sleep and quit still ask directly.
  ipcMain.on('prism-scrolled',(event,value)=>{const t=tabs.find(x=>x.view?.webContents===event.sender);if(!t||event.senderFrame!==event.sender.mainFrame||t.space==='private'||t.loading||t.restoring)return;
   const scroll=scrollRecord(value,recoveryURL(t.url));if(!scroll||t.recovery?.scroll&&scroll.x===t.recovery.scroll.x&&scroll.y===t.recovery.scroll.y&&scroll.url===t.recovery.scroll.url)return;captureNavigation(t);t.recovery={...t.recovery,scroll};persist();});
  win.show();bootMark('shown');localUpdater?.healthy(); emit();if(!smoke)setTimeout(warmFavoriteIcons,3000).unref?.();if(!smoke&&settings.chromiumCheck!==false)setTimeout(()=>chromiumCheck.check().then(noteChromium).catch(()=>{}),6000).unref?.();externalReady=true;for(const url of pendingExternal.splice(0))receiveExternal(url);
  if(process.argv.includes('--import-arc')&&!smoke) importArc().then(result=>console.log('Arc import:',JSON.stringify(result)));
  // PRISM_TEST_FLOW=<name> runs one flow from test/ on its own (development; smoke profile only).
  if(smoke) require(process.env.PRISM_TEST_FLOW?'../test/'+path.basename(process.env.PRISM_TEST_FLOW):process.env.PRISM_TEST_PRIVATE_PUBLIC==='1'?'../test/private-public-flow.cjs':restartTest?'../test/restart-flow.cjs':process.env.PRISM_TEST_COMPATIBILITY==='1'?'../test/compatibility-flow.cjs':process.env.PRISM_PERFORMANCE==='1'?'../test/performance-flow.cjs':process.env.PRISM_TEST_CREDENTIALS==='1'?'../test/credentials-flow.cjs':process.env.PRISM_TEST_RECOVERY==='1'?'../test/recovery-flow.cjs':process.env.PRISM_TEST_BASICS==='1'?'../test/basics-flow.cjs':process.env.PRISM_BENCHMARK==='1'?'../test/benchmark.cjs':process.env.PRISM_TEST_STORE==='1'?'../test/store.cjs':'../test/smoke.cjs').run({app,win,bootMarks,makeTab,selectTab,sleepTab,archiveIdle,spectrum,warmFavoriteIcons,pip:()=>pip,media:()=>media,commandBar:()=>commandBar,peek:()=>peek,library:()=>library,enforceAwakeBudget,action,snapshot,tabs,settings,services,passwords,autofill,wallet,ai,toolWindows,inspector,sessionStore,captureScroll,restoreSession,dispose,privateController:()=>privateNetwork,normalNetwork:()=>normalNetwork,sidePanels:()=>sidePanels,showWhatsNew,whatsNewWindow:()=>whatsNewWindow,checkWhatsNew,passkeys:()=>passkeys,secureFile,devices:()=>devices,setDeviceChooser:f=>{deviceChooser=f;},extensionMenuTemplate:id=>extensionMenuTemplate(id),extensionApi:()=>extensionApi,reader:()=>reader,webApps:()=>webApps,setNaturalScroll:value=>{naturalScroll=value;emit();},setUpdateOverride:value=>{updateOverride=value;emit();}}).catch(error=>{console.error(error);app.exit(1);});
});
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
app.on('window-all-closed',()=>app.quit());
