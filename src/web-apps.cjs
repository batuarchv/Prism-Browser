'use strict';
// Web apps in the Dock (0.45), the Prism side. File → Add to Dock… turns the site in the tab into a small Mac app in
// ~/Applications, as Safari does: its own name, icon, window and place in the Dock and ⌘-Tab. The bundle is an APFS
// clone of Prism.app (copy-on-write, so it takes almost no disk space) with its own Info.plist and the site's icon,
// signed again ad hoc. macOS will not start helpers from a framework linked in from another bundle, so it is cloned,
// not linked. After a Prism update refresh() clones the new Prism again. The app itself runs src/web-app.cjs with its
// own sign-ins.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {execFile}=require('node:child_process');
const run=(cmd,args)=>new Promise((resolve,reject)=>execFile(cmd,args,{timeout:30000},(error,stdout,stderr)=>error?reject(Object.assign(error,{stderr})):resolve(stdout)));
const xml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const safeName=name=>String(name||'Web App').replace(/[\/:\\\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,60)||'Web App';
// The host bundle (Prism.app, or Electron.app while developing) and its launcher binary.
function host(execPath=process.execPath){const contents=path.resolve(execPath,'..','..');return {bundle:path.dirname(contents),contents,exe:path.basename(execPath),execPath};}
function plist({exe,id,name,url,hostBundle,data,version}){const entries={CFBundleDevelopmentRegion:'en',CFBundleExecutable:exe,CFBundleIdentifier:'local.prism.webapp.'+id,CFBundleInfoDictionaryVersion:'6.0',CFBundleName:exe,CFBundleDisplayName:name,CFBundleIconFile:'icon.icns',CFBundlePackageType:'APPL',CFBundleShortVersionString:version,CFBundleVersion:version,LSMinimumSystemVersion:'12.0',NSPrincipalClass:'AtomApplication',NSHighResolutionCapable:true,NSSupportsAutomaticGraphicsSwitching:true,
  NSCameraUsageDescription:name+' can use your camera when you allow it.',NSMicrophoneUsageDescription:name+' can use your microphone when you allow it.',PrismWebAppID:id,PrismWebAppName:name,PrismWebAppURL:url,PrismHostApp:hostBundle,...(data?{PrismWebAppData:data}:{})};
 const value=v=>v===true?'<true/>':v===false?'<false/>':`<string>${xml(v)}</string>`;
 return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n${Object.entries(entries).map(([k,v])=>`<key>${k}</key>${value(v)}`).join('\n')}\n</dict></plist>\n`;}
// Reads the PrismWebApp* keys of an app's Info.plist (our own plain format).
function readPlist(file){try{const text=fs.readFileSync(file,'utf8'),out={};for(const m of text.matchAll(/<key>(PrismWebApp\w*|PrismHostApp|CFBundleExecutable)<\/key><string>([^<]*)<\/string>/g))out[m[1]]=m[2].replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');return out;}catch{return null;}}
function createWebApps({dir=path.join(os.homedir(),'Applications'),data=null,version='1.0',appPath=null,makeIcon}){
 const marker=path.join('Resources','prism-web-app.json');
 const appsIn=()=>{try{return fs.readdirSync(dir).filter(f=>f.endsWith('.app')&&!f.endsWith('.partial.app')).map(f=>path.join(dir,f)).filter(p=>fs.existsSync(path.join(p,'Contents',marker)));}catch{return [];}};
 function list(){return appsIn().map(p=>{const info=readPlist(path.join(p,'Contents','Info.plist'))||{};return {path:p,id:info.PrismWebAppID,name:info.PrismWebAppName,url:info.PrismWebAppURL};}).filter(a=>a.id);}
 function findFor(url){let origin='';try{origin=new URL(url).origin;}catch{return null;}return list().find(a=>{try{return new URL(a.url).origin===origin;}catch{return false;}})||null;}
 // Clones the host app into bundle (copy-on-write on APFS, a plain copy elsewhere), then makes it the web app's own.
 async function wire(bundle,h,{plistText,png=null,icns=null}){fs.rmSync(bundle,{recursive:true,force:true});
  try{await run('cp',['-cR',h.bundle,bundle]);}catch{fs.rmSync(bundle,{recursive:true,force:true});await run('cp',['-R',h.bundle,bundle]);}
  const c=path.join(bundle,'Contents'),res=path.join(c,'Resources');
  for(const entry of fs.readdirSync(res))if(entry.endsWith('.icns')||entry==='default_app.asar')fs.rmSync(path.join(res,entry),{recursive:true,force:true});
  // While developing, the host is Electron.app: a small app folder starts Prism's source.
  if(appPath){fs.rmSync(path.join(res,'app'),{recursive:true,force:true});fs.mkdirSync(path.join(res,'app'));
   fs.writeFileSync(path.join(res,'app','package.json'),JSON.stringify({name:'prism-web-app',version,main:'index.cjs'}));fs.writeFileSync(path.join(res,'app','index.cjs'),'require('+JSON.stringify(path.join(appPath,'src','main.cjs'))+');\n');}
  fs.rmSync(path.join(c,'_CodeSignature'),{recursive:true,force:true});
  fs.writeFileSync(path.join(c,'Info.plist'),plistText);fs.writeFileSync(path.join(c,'PkgInfo'),'APPL????');
  if(icns)fs.writeFileSync(path.join(res,'icon.icns'),icns);else if(png)await writeIcon(png,path.join(res,'icon.icns'));
  fs.writeFileSync(path.join(c,marker),JSON.stringify({launcher:stamp(h.execPath),host:h.bundle}));
  // codesign refuses Finder info and other extended attributes, which a copy can carry.
  if(process.platform==='darwin'){await run('xattr',['-cr',bundle]).catch(()=>{});
   try{await run('codesign',['--force','--sign','-',bundle]);}catch(error){console.error('Prism web app signing: '+String(error.stderr||error.message).trim());await run('codesign',['--force','--deep','--sign','-',bundle]).catch(e=>console.error('Prism web app deep signing: '+String(e.stderr||e.message).trim()));}}}
 const stamp=file=>{try{const s=fs.statSync(file);return s.size+':'+Math.round(s.mtimeMs);}catch{return '';}};
 // Builds the app. icon: a PNG buffer (1024 px), made by the caller from the site's icon.
 async function create({url,name,icon}){if(!/^https?:\/\//i.test(url))throw Error('Only websites can be added to the Dock.');
  const h=host();if(process.platform!=='darwin'&&!process.env.PRISM_WEB_APPS_ANY)throw Error('Web apps need macOS.');
  fs.mkdirSync(dir,{recursive:true});name=safeName(name);const existing=findFor(url);
  const id=existing?.id||crypto.createHash('sha256').update(new URL(url).origin+':'+Date.now()).digest('hex').slice(0,12);
  let bundle=existing?.path||path.join(dir,name+'.app');if(!existing&&fs.existsSync(bundle))bundle=path.join(dir,name+' ('+id.slice(0,4)+').app');
  const temp=bundle.replace(/\.app$/,'.partial.app');
  await wire(temp,h,{plistText:plist({exe:h.exe,id,name,url,hostBundle:h.bundle,data:data?path.join(data,id):null,version}),png:icon});
  fs.rmSync(bundle,{recursive:true,force:true});fs.renameSync(temp,bundle);
  // LaunchServices learns the new app (name and icon) at once.
  if(process.platform==='darwin'){try{await run('/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister',['-f',bundle]);}catch{}try{const now=new Date();fs.utimesSync(bundle,now,now);}catch{}}
  return {id,name,url,path:bundle};}
 async function writeIcon(png,file){const {nativeImage}=require('electron');const image=nativeImage.createFromBuffer(png);if(image.isEmpty())return;
  const set=file.replace(/\.icns$/,'.iconset');fs.mkdirSync(set,{recursive:true});
  for(const size of [16,32,128,256,512]){fs.writeFileSync(path.join(set,`icon_${size}x${size}.png`),image.resize({width:size,height:size,quality:'best'}).toPNG());fs.writeFileSync(path.join(set,`icon_${size}x${size}@2x.png`),image.resize({width:size*2,height:size*2,quality:'best'}).toPNG());}
  try{if(process.platform==='darwin')await run('iconutil',['-c','icns',set,'-o',file]);}finally{fs.rmSync(set,{recursive:true,force:true});}}
 // After a Prism update the launcher copied into each app may no longer match Prism's framework: copy it again.
 async function refresh(){const h=host();let updated=0;for(const app of list()){try{const c=path.join(app.path,'Contents');const mark=JSON.parse(fs.readFileSync(path.join(c,marker),'utf8'));
   if(mark.launcher===stamp(h.execPath)&&mark.host===h.bundle)continue;
   const plistText=fs.readFileSync(path.join(c,'Info.plist'),'utf8').replace(/(<key>PrismHostApp<\/key><string>)[^<]*/,`$1${xml(h.bundle)}`).replace(/(<key>CFBundleExecutable<\/key><string>)[^<]*/,`$1${xml(h.exe)}`).replace(/(<key>CFBundleName<\/key><string>)[^<]*/,`$1${xml(h.exe)}`).replace(/(<key>CFBundle(Short)?Version(String)?<\/key><string>)[^<]*/g,`$1${xml(version)}`);
   let icns=null;try{icns=fs.readFileSync(path.join(c,'Resources','icon.icns'));}catch{}
   const temp=app.path.replace(/\.app$/,'.partial.app');await wire(temp,h,{plistText,icns});fs.rmSync(app.path,{recursive:true,force:true});fs.renameSync(temp,app.path);updated++;}catch{}}return updated;}
 async function open(app){if(process.platform==='darwin')await run('open',[app.path]);}
 return {create,list,findFor,refresh,open,dir};
}
// The squircle tile behind a site icon, drawn in a hidden window (a 1024 px PNG). A large icon that fills its own
// square (or a maskable one) fills the tile; one with clear corners, or a small favicon, sits inside it.
async function tileIcon(BrowserWindow,source,{background='#ffffff'}={}){const win=new BrowserWindow({show:false,width:64,height:64,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,offscreen:true,javascript:true}});
 try{await win.loadURL('data:text/html,<canvas id=c width=1024 height=1024></canvas>');
  const data=await win.webContents.executeJavaScript(`new Promise(done=>{const img=new Image();img.onload=()=>{const c=document.getElementById('c'),x=c.getContext('2d');const r=1024*.2237,m=100,s=1024-m*2;
   const probe=document.createElement('canvas');probe.width=probe.height=64;const p=probe.getContext('2d');p.drawImage(img,0,0,64,64);const a=[[1,1],[62,1],[1,62],[62,62]].map(([u,v])=>p.getImageData(u,v,1,1).data[3]);const full=a.every(v=>v>200);
   const big=Math.min(img.naturalWidth||512,img.naturalHeight||512)>=150;const g=big?(full?s:s*.78):s*.56,o=(1024-g)/2;
   x.save();x.beginPath();x.roundRect(m,m,s,s,r);x.closePath();x.shadowColor='rgba(0,0,0,.28)';x.shadowBlur=28;x.shadowOffsetY=12;x.fillStyle=${JSON.stringify(background)};x.fill();x.restore();
   x.save();x.beginPath();x.roundRect(m,m,s,s,r);x.clip();x.imageSmoothingQuality='high';x.drawImage(img,o,o,g,g);x.restore();done(c.toDataURL('image/png'));};img.onerror=()=>done('');img.src=${JSON.stringify(source)};})`);
  return data?Buffer.from(data.split(',')[1],'base64'):null;}finally{win.destroy();}}
// What the page says about itself: names, its manifest and its icons (read in an isolated world).
const PAGE=`(()=>{const m=n=>document.querySelector('meta[name="'+n+'"],meta[property="'+n+'"]')?.content||'';const abs=h=>{try{return new URL(h,location.href).href}catch{return ''}};
 return {title:document.title,site:m('apple-mobile-web-app-title')||m('application-name')||m('og:site_name'),theme:m('theme-color'),manifest:abs(document.querySelector('link[rel=manifest]')?.getAttribute('href')||''),
  icons:[...document.querySelectorAll('link[rel]')].filter(l=>/(^|\\s)(icon|apple-touch-icon|apple-touch-icon-precomposed)(\\s|$)/i.test(l.rel)).map(l=>({src:abs(l.getAttribute('href')||''),sizes:l.getAttribute('sizes')||'',apple:/apple/i.test(l.rel),type:l.type||''})).filter(i=>i.src)};})()`;
const color=v=>/^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(String(v||'').trim())?String(v).trim():'';
function nameFrom({manifest,page,url}){const host=(()=>{try{return new URL(url).hostname.replace(/^www\./,'');}catch{return '';}})();
 const titled=String(page.title||'').split(/\s+[|–—·-]\s+/).map(s=>s.trim()).filter(Boolean);
 const fromHost=host.split('.').slice(-2,-1)[0]||host;return safeName(manifest?.short_name||manifest?.name||page.site||(titled.length>1&&titled.at(-1).length<=24?titled.at(-1):'')||(fromHost?fromHost[0].toUpperCase()+fromHost.slice(1):'Web App'));}
// Name, start page and a 1024 px tile for the site in wc. Every fetch uses the tab's own session.
async function describe(wc,BrowserWindow){const url=wc.getURL(),ses=wc.session;const page=await wc.executeJavaScriptInIsolatedWorld(1998,[{code:PAGE}]).catch(()=>null)||{};
 let manifest=null;if(page.manifest){try{const r=await ses.fetch(page.manifest);if(r.ok)manifest=await r.json();}catch{}}
 let start=url;try{if(manifest?.start_url){const s=new URL(manifest.start_url,page.manifest);if(s.origin===new URL(url).origin&&/^https?:$/.test(s.protocol))start=s.href;}}catch{}
 const size=v=>Math.max(0,...String(v||'').split(/\s+/).map(x=>parseInt(x,10)||0));const svg=v=>/svg/i.test(v||'');
 const list=[];for(const i of Array.isArray(manifest?.icons)?manifest.icons:[]){try{const purpose=String(i.purpose||'any');list.push({src:new URL(i.src,page.manifest).href,size:size(i.sizes)||(svg(i.type||i.src)?1024:0),rank:/maskable/.test(purpose)?4:3});}catch{}}
 for(const i of page.icons||[])list.push({src:i.src,size:size(i.sizes)||(i.apple?180:svg(i.type||i.src)?512:32),rank:i.apple?2:1});
 try{list.push({src:new URL('/favicon.ico',url).href,size:16,rank:0});}catch{}
 list.sort((a,b)=>(b.size>=150)-(a.size>=150)||b.rank-a.rank||b.size-a.size);
 let source='';for(const icon of list.slice(0,6)){try{const r=await ses.fetch(icon.src);if(!r.ok)continue;const type=(r.headers.get('content-type')||'').split(';')[0].trim()||(svg(icon.src)?'image/svg+xml':'image/png');if(!/^image\//.test(type))continue;
   const bytes=Buffer.from(await r.arrayBuffer());if(!bytes.length||bytes.length>4e6)continue;source=`data:${type};base64,${bytes.toString('base64')}`;break;}catch{}}
 const name=nameFrom({manifest,page,url});const background=color(manifest?.background_color)||'#ffffff';
 // No icon at all: the first letter on the site's color.
 if(!source){const fill=color(manifest?.theme_color)||color(page.theme)||'#5e5ce6';source='data:image/svg+xml;base64,'+Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${xml(fill)}"/><text x="512" y="690" font-family="-apple-system,Helvetica,sans-serif" font-size="520" font-weight="600" text-anchor="middle" fill="#fff">${xml(name[0].toUpperCase())}</text></svg>`).toString('base64');}
 const icon=await tileIcon(BrowserWindow,source,{background}).catch(()=>null);return {name,url:start,icon};}
module.exports={createWebApps,readPlist,plist,host,safeName,tileIcon,describe,nameFrom};
