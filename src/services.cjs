const {trimImages}=require('./performance.cjs');
const fs=require('node:fs');const path=require('node:path');const {randomUUID}=require('node:crypto');
const {dialog,BrowserWindow,nativeImage,shell}=require('electron');
function writeJSON(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value),{mode:0o600});fs.renameSync(file+'.tmp',file);}
function readJSON(file,fallback){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return fallback;}}
function uniqueFile(directory,filename){const base=path.basename(filename).replace(/[\x00-\x1f]/g,'')||'Download';const ext=path.extname(base);const stem=base.slice(0,base.length-ext.length);let file=path.join(directory,base),i=1;while(fs.existsSync(file))file=path.join(directory,`${stem} (${i++})${ext}`);return file;}
function createServices({app,ses,window,settings,saveSettings,emit,smoke,privateMode=false,onDownloadComplete=()=>{}}){
 const downloadsFile=path.join(app.getPath('userData'),'downloads.json');const imagesFile=path.join(app.getPath('userData'),'site-images.json');
 const live=new Map();let downloads=(privateMode?[]:readJSON(downloadsFile,[])).map(d=>({...d,active:false,state:['progressing','paused'].includes(d.state)?'interrupted':d.state}));
 let images=privateMode?{}:trimImages(readJSON(imagesFile,{}),settings.leanMemory?2*1024*1024:4*1024*1024),imageRevision=0;
 function changedImages(){images=trimImages(images,settings.leanMemory?2*1024*1024:4*1024*1024);imageRevision++;if(!smoke)writeJSON(imagesFile,images);}
const popupWindows=new Set();let lastEmit=0;
 const persistDownloads=()=>{if(!smoke)writeJSON(downloadsFile,downloads.slice(0,150));};
 // Each extension's own icon (largest declared size up to 128 px, under 256 KB) as an inline image, cached per version.
 const extensionIcons=new Map();
 function extensionIcon(loaded){const m=loaded?.manifest;if(!m)return null;const key=loaded.id+'@'+m.version;if(extensionIcons.has(key))return extensionIcons.get(key);let icon=null;
  try{const icons=m.icons||m.action?.default_icon||m.browser_action?.default_icon;const entries=typeof icons==='string'?[[128,icons]]:Object.entries(icons||{}).map(([size,file])=>[Number(size),file]).filter(([size,file])=>size<=128&&typeof file==='string').sort((a,b)=>b[0]-a[0]);
   const file=entries[0]&&path.resolve(loaded.path,entries[0][1].replace(/^\/+/,''));const type=file&&{'.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(file).toLowerCase()];
   if(type&&file.startsWith(path.resolve(loaded.path)+path.sep)&&fs.statSync(file).size<262144)icon='data:'+type+';base64,'+fs.readFileSync(file).toString('base64');}catch{}
  extensionIcons.set(key,icon);return icon;}
 function extensionRows(){return settings.extensions.map(e=>{const loaded=ses.extensions.getExtension(e.id);const m=loaded?.manifest;return {...e,loaded:!!loaded,hasPopup:!!(m?.action?.default_popup||m?.browser_action?.default_popup),hasSidePanel:!!(m?.side_panel||m?.permissions?.includes('sidePanel')),hasOptions:!!(m?.options_page||m?.options_ui?.page),icon:extensionIcon(loaded),description:typeof m?.description==='string'&&!m.description.startsWith('__MSG_')?m.description.slice(0,200):''};});}
 async function loadExtension(record){try{const extension=await ses.extensions.loadExtension(record.path,{allowFileAccess:false});record.id=extension.id;record.name=extension.name;record.version=extension.version;record.error='';record.enabled=true;return extension;}catch(error){record.error=error.message;return null;}}
 async function restoreExtensions(){for(const record of settings.extensions)if(record.enabled)await loadExtension(record);saveSettings();emit();}
 async function reviewExtension(manifest,name=manifest.name){
  const permissions=[...(manifest.permissions||[]),...(manifest.host_permissions||[]),...(manifest.content_scripts||[]).flatMap(x=>x.matches||[])];
  const answer=await dialog.showMessageBox(window(),{type:'question',message:`Add ${name}?`,detail:'Requested access:\n'+([...new Set(permissions)].join('\n').slice(0,3000)||'No permissions declared')+'\n\nSome Chrome APIs are not available in Prism. Native messaging may let this extension communicate with installed desktop applications. Apple Passwords could not connect to its native helper in this Prism build.',buttons:['Cancel','Add extension'],defaultId:0,cancelId:0});return answer.response===1;
 }
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
  if(settings.askDownloadLocation||privateMode)item.setSaveDialogOptions({defaultPath:proposed,title:privateMode?'Save Private download — file remains after Private ends':'Save download'});else item.setSavePath(proposed);
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
 function storeIcon(url,buffer){try{const icon=nativeImage.createFromBuffer(buffer);if(icon.isEmpty())return;url=new URL(url).origin;images[url]={...images[url],icon:icon.resize({width:48,height:48}).toDataURL()};}catch{}}
 function importArcIcons(bookmarks){
  try{const file=path.join(app.getPath('appData'),'Arc/User Data/Default/Favicons');if(!fs.existsSync(file))return;const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(file,{readOnly:true});try{const query=db.prepare('SELECT b.image_data FROM icon_mapping m JOIN favicon_bitmaps b ON b.icon_id=m.icon_id WHERE m.page_url=? ORDER BY b.width DESC LIMIT 1');for(const b of bookmarks){if(images[new URL(b.url).origin]?.icon)continue;const row=query.get(b.url);if(row?.image_data?.length<256000)storeIcon(b.url,Buffer.from(row.image_data));}}finally{db.close();}changedImages();}catch{}
 }
 const pendingIcons=new Set();
 async function favicon(url,iconURL){
  if(!/^https?:\/\//.test(iconURL)||pendingIcons.has(url)||images[new URL(url).origin]?.icon)return;pendingIcons.add(url);
  try{const response=await ses.fetch(iconURL,{credentials:'omit',signal:AbortSignal.timeout(5000)});if(!response.ok)return;const reader=response.body.getReader();const parts=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>256000){await reader.cancel();return;}parts.push(Buffer.from(value));}storeIcon(url,Buffer.concat(parts));changedImages();emit();}catch{}finally{pendingIcons.delete(url);}
 }
 const thumbnailTimes=new Map(),pendingThumbnails=new Map();let imageGeneration=0;
 async function thumbnail(tab){if(settings.favoriteStyle!=='cards'||!tab.view||tab.loading||tab.space==='private')return;const url=tab.url,wc=tab.view.webContents,generation=imageGeneration;
 if(pendingThumbnails.has(url))return pendingThumbnails.get(url);if(Date.now()-(thumbnailTimes.get(url)||0)<60000)return;
 const job=(async()=>{try{const image=await require('./thumbnail-capture.cjs').captureThumbnail(tab);if(!image||image.isEmpty()||generation!==imageGeneration||settings.favoriteStyle!=='cards'||tab.url!==url||tab.view?.webContents!==wc)return;
 const size=image.getSize(),height=Math.max(1,Math.min(200,Math.round(size.height*300/Math.max(1,size.width))));
 images[url]={...images[url],thumbnail:'data:image/jpeg;base64,'+image.resize({width:300,height}).toJPEG(60).toString('base64')};
 thumbnailTimes.delete(url);thumbnailTimes.set(url,Date.now());while(thumbnailTimes.size>200)thumbnailTimes.delete(thumbnailTimes.keys().next().value);changedImages();emit();}catch{}finally{pendingThumbnails.delete(url);}})();pendingThumbnails.set(url,job);return job;}

 function clearImages(){imageGeneration++;images={};thumbnailTimes.clear();changedImages();emit();}
 return {persistDownloads,reviewExtension,extensionRows,extensionPage,restoreExtensions,installExtension,extensionAction,downloadAction,chooseDownloadDirectory,downloads:()=>downloads,images:()=>images,imageRevision:()=>imageRevision,importArcIcons,favicon,thumbnail,clearImages,close:()=>{if(privateMode){for(const item of live.values())item.cancel();downloads=[];live.clear();}persistDownloads();for(const w of popupWindows)w.close();},hasActiveDownloads:()=>live.size>0};
}
module.exports={createServices,uniqueFile};
