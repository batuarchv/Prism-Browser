const {trimImages}=require('./performance.cjs');
const fs=require('node:fs');const path=require('node:path');const {randomUUID}=require('node:crypto');
const {dialog,BrowserWindow,nativeImage,shell}=require('electron');
function writeJSON(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value),{mode:0o600});fs.renameSync(file+'.tmp',file);}
function readJSON(file,fallback){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return fallback;}}
function uniqueFile(directory,filename){const base=path.basename(filename).replace(/[\x00-\x1f]/g,'')||'Download';const ext=path.extname(base);const stem=base.slice(0,base.length-ext.length);let file=path.join(directory,base),i=1;while(fs.existsSync(file))file=path.join(directory,`${stem} (${i++})${ext}`);return file;}
function createServices({app,ses,window,settings,saveSettings,emit,smoke,privateMode=false,onDownloadComplete=()=>{}}){
 const downloadsFile=path.join(app.getPath('userData'),'downloads.json');const imagesFile=path.join(app.getPath('userData'),'site-images.json');
 const live=new Map();let downloads=(privateMode?[]:readJSON(downloadsFile,[])).map(d=>({...d,active:false,naming:false,state:['progressing','paused'].includes(d.state)?'interrupted':d.state}));
 let images=privateMode?{}:trimImages(readJSON(imagesFile,{}),settings.leanMemory?2*1024*1024:4*1024*1024),imageRevision=0;
 // Icons and preview cards are written a moment after they change, off the main thread, instead of rewriting the
 // whole file synchronously for each one (0.35); anything pending is written when Prism closes.
 let imagesTimer=null,imagesWriting=Promise.resolve();
 function writeImagesSoon(){if(smoke||privateMode)return;clearTimeout(imagesTimer);imagesTimer=setTimeout(()=>{imagesTimer=null;const data=JSON.stringify(images);imagesWriting=imagesWriting.then(async()=>{await fs.promises.mkdir(path.dirname(imagesFile),{recursive:true});await fs.promises.writeFile(imagesFile+'.tmp',data,{mode:0o600});await fs.promises.rename(imagesFile+'.tmp',imagesFile);}).catch(()=>{});},1500);imagesTimer.unref?.();}
 function flushImages(){if(!imagesTimer)return;clearTimeout(imagesTimer);imagesTimer=null;try{writeJSON(imagesFile,images);}catch{}}
 function changedImages(){images=trimImages(images,settings.leanMemory?2*1024*1024:4*1024*1024);imageRevision++;writeImagesSoon();}
const popupWindows=new Set();let lastEmit=0;
 const persistDownloads=()=>{if(!smoke)writeJSON(downloadsFile,downloads.slice(0,150));};
 // Each extension's own icon (largest declared size up to 128 px, under 256 KB) as an inline image, cached per version.
 const extensionIcons=new Map();
 function extensionIcon(loaded){const m=loaded?.manifest;if(!m)return null;const key=loaded.id+'@'+m.version;if(extensionIcons.has(key))return extensionIcons.get(key);let icon=null;
  try{const icons=m.icons||m.action?.default_icon||m.browser_action?.default_icon;const entries=typeof icons==='string'?[[128,icons]]:Object.entries(icons||{}).map(([size,file])=>[Number(size),file]).filter(([size,file])=>size<=128&&typeof file==='string').sort((a,b)=>b[0]-a[0]);
   const file=entries[0]&&path.resolve(loaded.path,entries[0][1].replace(/^\/+/,''));const type=file&&{'.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(file).toLowerCase()];
   if(type&&file.startsWith(path.resolve(loaded.path)+path.sep)&&fs.statSync(file).size<262144)icon='data:'+type+';base64,'+fs.readFileSync(file).toString('base64');}catch{}
  extensionIcons.set(key,icon);return icon;}
 function extensionRows(){return settings.extensions.map(e=>{const loaded=ses.extensions.getExtension(e.id);const m=loaded?.manifest;return {...e,loaded:!!loaded,hasPopup:!!(m?.action?.default_popup||m?.browser_action?.default_popup),hasSidePanel:!!(m?.side_panel||m?.permissions?.includes('sidePanel')),serviceWorker:!!m?.background?.service_worker,hasOptions:!!(m?.options_page||m?.options_ui?.page),icon:extensionIcon(loaded),description:typeof m?.description==='string'&&!m.description.startsWith('__MSG_')?m.description.slice(0,200):''};});}
 async function loadExtension(record){try{const extension=await ses.extensions.loadExtension(record.path,{allowFileAccess:false});record.id=extension.id;record.name=extension.name;record.version=extension.version;record.error='';record.enabled=true;return extension;}catch(error){record.error=error.message;return null;}}
 async function restoreExtensions(){for(const record of settings.extensions)if(record.enabled)await loadExtension(record);saveSettings();emit();}
 async function reviewExtension(manifest,name=manifest.name){
  const permissions=[...(manifest.permissions||[]),...(manifest.host_permissions||[]),...(manifest.content_scripts||[]).flatMap(x=>x.matches||[])];
  const answer=await dialog.showMessageBox(window(),{type:'question',message:`Add ${name}?`,detail:'Requested access:\n'+([...new Set(permissions)].join('\n').slice(0,3000)||'No permissions declared')+'\n\nSome Chrome APIs are not available in Prism. Native messaging may let this extension communicate with installed desktop applications. Apple Passwords could not connect to its native helper in this Prism build.',buttons:['Cancel','Add extension'],defaultId:0,cancelId:0});return answer.response===1;
 }
 // activeTab (0.44): in Chrome, clicking an extension's button, its right-click item or its shortcut lets it read and
 // change the page you are on. Electron has no such per-click grant, so extensions built on it (Save to Cosmos, Google
 // Translate, clippers, readers) failed with "Cannot access contents of the page". Prism gives an extension that asks for
 // activeTab access to pages instead: its manifest copy in Prism's own folder gains <all_urls> and it is loaded again.
 const ACTIVE_TAB_MARK='prism_active_tab_hosts';
 function grantActiveTab(extension){try{const m=extension.manifest||{},perms=Array.isArray(m.permissions)?m.permissions:[],hosts=m.manifest_version===3?(Array.isArray(m.host_permissions)?m.host_permissions:[]):perms;
  if(!perms.includes('activeTab')||m[ACTIVE_TAB_MARK]||hosts.some(h=>h==='<all_urls>'||h==='*://*/*'))return false;const own=[path.join(app.getPath('userData'),'store-extensions'),path.join(app.getPath('userData'),'extensions')].some(dir=>extension.path.startsWith(dir+path.sep));if(!own)return false;
  const file=path.join(extension.path,'manifest.json'),raw=JSON.parse(fs.readFileSync(file,'utf8'));raw[ACTIVE_TAB_MARK]=true;
  if(raw.manifest_version===3)raw.host_permissions=[...new Set([...(raw.host_permissions||[]),'<all_urls>'])];else raw.permissions=[...new Set([...(raw.permissions||[]),'<all_urls>'])];
  fs.writeFileSync(file,JSON.stringify(raw,null,1));return true;}catch{return false;}}
 const regranting=new Set();
 ses.extensions.on('extension-loaded',(_event,extension)=>{if(regranting.has(extension.id)||!grantActiveTab(extension))return;regranting.add(extension.id);
  setTimeout(async()=>{try{if(ses.extensions.getExtension(extension.id)){ses.extensions.removeExtension(extension.id);await ses.extensions.loadExtension(extension.path,{allowFileAccess:false});}}catch{}finally{regranting.delete(extension.id);}},0);});
 ses.extensions.on('extension-loaded',(_event,extension)=>{const store=path.join(app.getPath('userData'),'store-extensions')+path.sep;if(extension.path.startsWith(store)){const existing=settings.extensions.find(e=>e.id===extension.id);const record={id:extension.id,path:extension.path,source:'Chrome Web Store',name:extension.name,version:extension.version,enabled:true,error:''};if(existing)Object.assign(existing,record);else settings.extensions.push(record);saveSettings();emit();}});
 async function installExtension(directory,review=true){
  const manifestFile=path.join(directory,'manifest.json');if(!fs.existsSync(manifestFile)||fs.statSync(manifestFile).size>1024*1024)throw Error('Choose an unpacked extension folder containing manifest.json.');
  const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));if(![2,3].includes(manifest.manifest_version)||typeof manifest.name!=='string')throw Error('Unsupported extension manifest.');
  if(settings.extensions.some(e=>e.source===directory))throw Error('This extension is already installed.');
  if(review&&!await reviewExtension(manifest))return;
  const target=path.join(app.getPath('userData'),'extensions',randomUUID());
  let total=0,count=0;function validateTree(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);const info=fs.lstatSync(file);if(info.isSymbolicLink())throw Error('Extension folders must not contain symbolic links.');if(++count>20000)throw Error('Extension contains too many files.');if(info.isDirectory())validateTree(file);else{total+=info.size;if(total>256*1024*1024)throw Error('Extension is larger than 256 MB.');}}}validateTree(directory);
  fs.cpSync(directory,target,{recursive:true});
  const record={id:randomUUID(),path:target,source:directory,name:manifest.name,version:manifest.version,enabled:true,error:''};
  const extension=await loadExtension(record);settings.extensions.push(record);saveSettings();emit();if(!extension)throw Error(record.error);return extension;
 }
 // The extension's own popup or options page, resolved inside the extension and nowhere else.
 function extensionPage(id,command){
  const e=ses.extensions.getExtension(id);if(!e)throw Error('Enable the extension first.');const m=e.manifest;const resource=command==='options'?(m.options_page||m.options_ui?.page):(m.action?.default_popup||m.browser_action?.default_popup);if(!resource)throw Error('This extension has no '+command+' page.');
  const url=new URL(resource,e.url.endsWith('/')?e.url:e.url+'/');if(url.protocol!=='chrome-extension:'||url.hostname!==id)throw Error('Invalid extension page.');return url.href;
 }
 async function extensionAction(command,id,anchor){
  if(command==='add'){const result=await dialog.showOpenDialog(window(),{title:'Choose an unpacked Chrome extension',properties:['openDirectory']});if(!result.canceled)await installExtension(result.filePaths[0]);return;}
  const record=settings.extensions.find(e=>e.id===id);if(!record)return;
  if(command==='remove'){if(ses.extensions.getExtension(id))ses.extensions.removeExtension(id);if(record.source==='Chrome Web Store'&&/^[a-p]{32}$/.test(id)){const dir=path.join(app.getPath('userData'),'store-extensions',id);if(fs.existsSync(dir)){const archive=path.join(app.getPath('userData'),'removed-extensions');fs.mkdirSync(archive,{recursive:true});fs.renameSync(dir,path.join(archive,id+'-'+Date.now()));}}settings.extensions=settings.extensions.filter(e=>e!==record);saveSettings();emit();return;}
  if(command==='toggle'){if(record.enabled){ses.extensions.removeExtension(id);record.enabled=false;}else await loadExtension(record);saveSettings();emit();return;}
  if(command==='reload'){if(ses.extensions.getExtension(id))ses.extensions.removeExtension(id);await loadExtension(record);saveSettings();emit();return;}
  if(command==='popup'||command==='options'){
   const e=ses.extensions.getExtension(id),url=new URL(extensionPage(id,command));
   // From the toolbar, an extension's panel opens frameless right under the Extensions button (anchor = button in screen
   // points), sized to its content and closed when it loses focus, as in Chrome. Otherwise it opens as a regular window.
   const panel=command==='popup'&&anchor&&[anchor.right,anchor.bottom].every(Number.isFinite);
   const popup=new BrowserWindow({parent:window(),width:command==='options'?800:panel?360:440,height:command==='options'?650:panel?420:580,title:e.name,show:false,...(panel?{frame:false,roundedCorners:true,resizable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,hasShadow:true,x:Math.round(anchor.right-360),y:Math.round(anchor.bottom+6)}:{}),webPreferences:{session:ses,nodeIntegration:false,contextIsolation:true,sandbox:true,...(panel?{enablePreferredSizeMode:true}:{})}});
   if(panel){for(const old of popupWindows)if(old!==popup&&old.prismPanel&&!old.isDestroyed())old.close();popup.prismPanel=true;
    popup.webContents.on('preferred-size-changed',(_event,size)=>{if(popup.isDestroyed())return;const width=Math.max(160,Math.min(800,Math.ceil(size.width))),height=Math.max(60,Math.min(600,Math.ceil(size.height)));popup.setBounds({x:Math.round(anchor.right-width),y:Math.round(anchor.bottom+6),width,height});});
    popup.on('blur',()=>{setTimeout(()=>{if(!popup.isDestroyed()&&!popup.isFocused()&&!popup.webContents.isDevToolsOpened())popup.close();},120);});}popupWindows.add(popup);popup.on('closed',()=>popupWindows.delete(popup));popup.webContents.setWindowOpenHandler(()=>({action:'deny'}));popup.webContents.on('will-navigate',(event,destination)=>{if(!destination.startsWith('chrome-extension://'+id+'/'))event.preventDefault();});await popup.loadURL(url.href);popup.show();
  }
 }
 ses.on('will-download',(_event,item,source)=>{
  const record={id:randomUUID(),name:item.getFilename(),pageTitle:privateMode?'':String(source?.getTitle()||'').slice(0,250),mime:item.getMimeType(),url:item.getURL(),path:'',received:0,total:item.getTotalBytes(),state:'progressing',active:true,startedAt:Date.now()};downloads.unshift(record);downloads=downloads.slice(0,150);live.set(record.id,item);
  const directory=settings.downloadDirectory||app.getPath('downloads');fs.mkdirSync(directory,{recursive:true});
  const proposed=uniqueFile(directory,item.getFilename());
  // Files go straight to Downloads (0.44, like Safari), Private too; "Ask where to save each file" is off unless chosen.
  // The old askDownloadLocation key (on by default before 0.44) is dropped, so it no longer asks for existing profiles.
  if(settings.askWhereToSave&&!privateMode)item.setSaveDialogOptions({defaultPath:proposed,title:'Save download'});else item.setSavePath(proposed);
  const update=()=>{record.received=item.getReceivedBytes();record.total=item.getTotalBytes();record.path=item.getSavePath();record.state=item.isPaused()?'paused':item.getState();record.canResume=item.canResume();};
  item.on('updated',()=>{update();const now=Date.now();if(now-lastEmit>150){lastEmit=now;emit();}});
  item.once('done',(_e,state)=>{update();record.state=state;record.active=false;record.finishedAt=Date.now();live.delete(record.id);persistDownloads();emit();if(state==='completed'&&!privateMode)onDownloadComplete(record.id);if(!window()?.isDestroyed())window()?.setProgressBar(-1);});
  emit();persistDownloads();
 });
 async function downloadAction(command,id){
  if(command==='clear'){downloads=downloads.filter(d=>live.has(d.id));persistDownloads();emit();return;}
  const d=downloads.find(d=>d.id===id);if(!d)return;const item=live.get(id);
  if(command==='pause'&&item){item.pause();d.state='paused';}
  if(command==='resume'&&item&&item.canResume()){item.resume();d.state='progressing';}
  if(command==='cancel'&&item)item.cancel();
  if(command==='retry'&&!item&&/^https?:\/\//.test(d.url))ses.downloadURL(d.url);
  if(command==='reveal'&&d.path&&fs.existsSync(d.path))shell.showItemInFolder(d.path);
  if(command==='open'&&d.state==='completed'){if(!fs.existsSync(d.path))throw Error('This file has been moved or deleted.');const error=await shell.openPath(d.path);if(error)throw Error(error);}
  emit();persistDownloads();
 }
 async function chooseDownloadDirectory(){const result=await dialog.showOpenDialog(window(),{properties:['openDirectory','createDirectory'],defaultPath:settings.downloadDirectory||app.getPath('downloads')});if(!result.canceled){settings.downloadDirectory=result.filePaths[0];saveSettings();emit();}}
 // A favicon.ico often wraps PNG images; the largest one is used when macOS cannot read the .ico itself.
 function icoPng(buffer){try{if(buffer.readUInt16LE(0)!==0||buffer.readUInt16LE(2)!==1)return null;let best=null;for(let i=0,n=buffer.readUInt16LE(4);i<n&&i<32;i++){const o=6+i*16,size=buffer.readUInt32LE(o+8),at=buffer.readUInt32LE(o+12),w=buffer[o]||256;if(at+size>buffer.length)continue;const data=buffer.subarray(at,at+size);if(data.readUInt32BE(0)===0x89504e47&&(!best||w>best.w))best={w,data};}return best?.data||null;}catch{return null;}}
 function storeIcon(url,buffer){try{let icon=nativeImage.createFromBuffer(buffer);if(icon.isEmpty()){const png=icoPng(buffer);if(png)icon=nativeImage.createFromBuffer(png);}if(icon.isEmpty())return;url=new URL(url).origin;images[url]={...images[url],icon:icon.resize({width:48,height:48}).toDataURL()};}catch{}}
 function importArcIcons(bookmarks){
  try{const file=path.join(app.getPath('appData'),'Arc/User Data/Default/Favicons');if(!fs.existsSync(file))return;const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(file,{readOnly:true});try{const query=db.prepare('SELECT b.image_data FROM icon_mapping m JOIN favicon_bitmaps b ON b.icon_id=m.icon_id WHERE m.page_url=? ORDER BY b.width DESC LIMIT 1');for(const b of bookmarks){if(images[new URL(b.url).origin]?.icon)continue;const row=query.get(b.url);if(row?.image_data?.length<256000)storeIcon(b.url,Buffer.from(row.image_data));}}finally{db.close();}changedImages();}catch{}
 }
 const pendingIcons=new Set();
 async function favicon(url,iconURL){
  if(!/^https?:\/\//.test(iconURL)||pendingIcons.has(url)||images[new URL(url).origin]?.icon)return;pendingIcons.add(url);
  try{const response=await ses.fetch(iconURL,{credentials:'omit',signal:AbortSignal.timeout(5000)});if(!response.ok)return;const reader=response.body.getReader();const parts=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>256000){await reader.cancel();return;}parts.push(Buffer.from(value));}storeIcon(url,Buffer.concat(parts));changedImages();emit();}catch{}finally{pendingIcons.delete(url);}
 }
 // Favorites and pinned bookmarks get their icon without waiting for a visit (0.35): the site's own favicon is asked
 // for in the background, two at a time, without cookies. Since 0.39.4 a site whose icon is not at a fixed address
 // (only declared by <link rel=icon> in its page, often on a CDN) gets that one, and a site that failed (offline at
 // launch) is tried again after 20 minutes instead of never again until Prism restarts.
 const iconTried=new Map();
 async function readIcon(url){const response=await ses.fetch(url,{credentials:'omit',signal:AbortSignal.timeout(5000)});const type=response.headers.get('content-type')||'';if(!response.ok||/text\/html/.test(type))return null;const buffer=Buffer.from(await response.arrayBuffer());return buffer.length&&buffer.length<=256000?buffer:null;}
 async function declaredIcons(origin){const response=await ses.fetch(origin+'/',{credentials:'omit',signal:AbortSignal.timeout(6000)});if(!response.ok||!/text\/html/.test(response.headers.get('content-type')||''))return [];
  const html=(await response.text()).slice(0,400000),found=[];
  for(const tag of html.match(/<link\b[^>]*>/gi)||[]){const rel=/\brel\s*=\s*["']?([^"'>]+)/i.exec(tag)?.[1]?.toLowerCase()||'',href=/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);if(!/(^|\s)(icon|apple-touch-icon(-precomposed)?)(\s|$)/.test(rel)||!href)continue;
   const value=(href[1]??href[2]??href[3]).replace(/&amp;/g,'&');if(/\.svg(\?|$)|^data:image\/svg/i.test(value))continue;try{const url=new URL(value,response.url||origin+'/');if(/^(https?|data):$/.test(url.protocol))found.push({url:url.href,touch:rel.includes('apple'),size:Math.max(0,...(/\bsizes\s*=\s*["']?(\d+)/i.exec(tag)?.slice(1).map(Number)||[0]))});}catch{}}
  return found.sort((a,b)=>Number(b.touch)-Number(a.touch)||b.size-a.size).map(x=>x.url).slice(0,4);}
 async function warmIcons(urls){if(privateMode)return;const now=Date.now();const origins=[...new Set(urls.map(u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.origin:null;}catch{return null;}}).filter(o=>o&&!images[o]?.icon&&now-(iconTried.get(o)||0)>20*60000))].slice(0,60);for(const o of origins)iconTried.set(o,now);
  const store=(origin,buffer)=>{const before=images[origin]?.icon;storeIcon(origin,buffer);if(images[origin]?.icon&&images[origin].icon!==before){changedImages();emit();}};
  const next=async()=>{while(origins.length){const origin=origins.shift();
   for(const file of ['/apple-touch-icon.png','/favicon.ico']){if(images[origin]?.icon)break;try{const buffer=await readIcon(origin+file);if(buffer)store(origin,buffer);}catch{}}
   if(!images[origin]?.icon)try{for(const url of await declaredIcons(origin)){if(images[origin]?.icon)break;try{const buffer=url.startsWith('data:')?nativeImage.createFromDataURL(url).toPNG():await readIcon(url);if(buffer?.length)store(origin,buffer);}catch{}}}catch{}}};
  await Promise.all([next(),next()]);}
 const thumbnailTimes=new Map(),pendingThumbnails=new Map();let imageGeneration=0;
 async function thumbnail(tab){if(settings.favoriteStyle!=='cards'||!tab.view||tab.loading||tab.space==='private')return;const url=tab.url,wc=tab.view.webContents,generation=imageGeneration;
 if(pendingThumbnails.has(url))return pendingThumbnails.get(url);if(Date.now()-(thumbnailTimes.get(url)||0)<60000)return;
 const job=(async()=>{try{const image=await require('./thumbnail-capture.cjs').captureThumbnail(tab);if(!image||image.isEmpty()||generation!==imageGeneration||settings.favoriteStyle!=='cards'||tab.url!==url||tab.view?.webContents!==wc)return;
 const size=image.getSize(),height=Math.max(1,Math.min(200,Math.round(size.height*300/Math.max(1,size.width))));
 images[url]={...images[url],thumbnail:'data:image/jpeg;base64,'+image.resize({width:300,height}).toJPEG(60).toString('base64')};
 thumbnailTimes.delete(url);thumbnailTimes.set(url,Date.now());while(thumbnailTimes.size>200)thumbnailTimes.delete(thumbnailTimes.keys().next().value);changedImages();emit();}catch{}finally{pendingThumbnails.delete(url);}})();pendingThumbnails.set(url,job);return job;}

 function clearImages(){imageGeneration++;images={};thumbnailTimes.clear();changedImages();emit();}
 return {persistDownloads,reviewExtension,extensionRows,extensionPage,restoreExtensions,installExtension,extensionAction,downloadAction,chooseDownloadDirectory,downloads:()=>downloads,images:()=>images,imageRevision:()=>imageRevision,importArcIcons,favicon,thumbnail,warmIcons,clearImages,close:()=>{flushImages();if(privateMode){for(const item of live.values())item.cancel();downloads=[];live.clear();}persistDownloads();for(const w of popupWindows)w.close();},hasActiveDownloads:()=>live.size>0};
}
module.exports={createServices,uniqueFile};
