// 0.45 web apps in the Dock (smoke profile, local site, temp folders): Prism reads the site's name, start page and
// icon from its manifest and makes a tile; on a Mac "Add to Dock…" builds the app bundle, which starts as its own app
// (own bundle id, name and profile) and loads the site. Everywhere, the app side (web-app.cjs) runs the site in its own
// window and own profile. Nothing is written to ~/Applications.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn,execFileSync}=require('node:child_process');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(150);}}
const read=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}};
exports.run=async({app,win,makeTab,selectTab,action,webApps})=>{
 const {nativeImage,BrowserWindow}=require('electron');
 // A 512 px icon with a solid square (fills the tile) in the site's manifest.
 const px=Buffer.alloc(512*512*4);for(let i=0;i<px.length;i+=4){px[i]=230;px[i+1]=120;px[i+2]=40;px[i+3]=255;}
 const icon=nativeImage.createFromBitmap(px,{width:512,height:512}).toPNG();
 const manifest=JSON.stringify({name:'Glass Mail for Teams',short_name:'Glass Mail',start_url:'/inbox?source=pwa',background_color:'#ffffff',icons:[{src:'/icon-512.png',sizes:'512x512',type:'image/png'}]});
 const server=http.createServer((q,r)=>{if(q.url==='/icon-512.png'){r.writeHead(200,{'Content-Type':'image/png'});r.end(icon);return;}
  if(q.url==='/manifest.json'){r.writeHead(200,{'Content-Type':'application/manifest+json'});r.end(manifest);return;}
  r.writeHead(200,{'Content-Type':'text/html'});r.end(`<!doctype html><title>(3) Inbox - Glass Mail</title><link rel="manifest" href="/manifest.json"><link rel="icon" href="/icon-512.png"><h1>Inbox ${q.url}</h1><a id="away" href="https://example.org/">away</a>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'prism-web-app-'));const children=[];
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
  const t=makeTab(base+'/inbox/42');selectTab(t.id);await eventually(()=>t.view&&!t.view.webContents.isLoading()&&/Inbox/.test(t.view.webContents.getTitle()),'site loaded');
  const about=await require('../src/web-apps.cjs').describe(t.view.webContents,BrowserWindow);
  assert.equal(about.name,'Glass Mail','the manifest short name');assert.equal(about.url,base+'/inbox?source=pwa','the manifest start page');
  const tile=nativeImage.createFromBuffer(about.icon||Buffer.alloc(0));assert.deepEqual(tile.getSize(),{width:1024,height:1024},'a 1024 px tile');
  const bitmap=tile.toBitmap();const at=(x,y)=>[...bitmap.subarray((y*1024+x)*4,(y*1024+x)*4+4)];
  assert.ok(at(512,512)[3]===255&&at(512,512)[0]>200&&at(512,512)[2]<80,'the icon fills the middle: '+at(512,512));assert.equal(at(4,4)[3],0,'the corners are clear');
  fs.mkdirSync(path.resolve(__dirname,'../reports'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../reports/web-app-icon.png'),about.icon);
  if(process.platform==='darwin'){
   assert.equal(webApps().dir,process.env.PRISM_WEB_APPS_DIR,'smoke builds into the temp folder only');
   const t0=Date.now();const made=await action('add-to-dock');made.ms=Date.now()-t0;assert.ok(made?.ok,'added: '+JSON.stringify(made));const bundle=made.app.path;
   assert.equal(path.basename(bundle),'Glass Mail.app');const c=path.join(bundle,'Contents');
   for(const f of ['Info.plist','Resources/icon.icns','Resources/prism-web-app.json','Frameworks'])assert.ok(fs.existsSync(path.join(c,f)),f);
   assert.ok(!fs.lstatSync(path.join(c,'Frameworks')).isSymbolicLink(),'the framework is cloned, not linked (macOS refuses linked helpers)');
   const info=require('../src/web-apps.cjs').readPlist(path.join(c,'Info.plist'));assert.equal(info.PrismWebAppURL,base+'/inbox?source=pwa');assert.equal(info.PrismWebAppName,'Glass Mail');
   assert.deepEqual(webApps().list().map(a=>a.name),['Glass Mail']);assert.equal(webApps().findFor(base+'/other').id,made.app.id,'found again by site');
   const again=await action('add-to-dock');assert.equal(again.app.path,bundle,'adding again updates the same app');
   console.log('web app built in '+made.ms+' ms');
   execFileSync('codesign',['--verify',bundle]);console.log('bundle signature ok');
   // Started through LaunchServices, as a Dock click does.
   const status=path.join(temp,'status.json');
   execFileSync('open',['-n','--env','PRISM_WEB_APP_STATUS='+status,'--env','PRISM_WEB_APP_QUIT_AFTER=9000',bundle]);
   await eventually(()=>read(status)?.loaded,'the web app loaded its site',30000);const s=read(status);console.log('web app status: '+JSON.stringify(s));
   assert.equal(s.name,'Glass Mail');assert.equal(s.url,base+'/inbox?source=pwa');assert.ok(s.userData.includes(made.app.id),'its own profile');
   const seen=execFileSync('lsappinfo',['find','bundleid=local.prism.webapp.'+made.app.id]).toString().trim();console.log('lsappinfo: '+seen);assert.ok(seen,'macOS sees it as its own app');
   await eventually(()=>!execFileSync('lsappinfo',['find','bundleid=local.prism.webapp.'+made.app.id]).toString().trim(),'the web app quit',20000);
  }else{
   // The app side by itself: a second Electron process running web-app.cjs with its own profile.
   const status=path.join(temp,'status.json'),entry=path.join(temp,'entry.cjs');
   fs.writeFileSync(entry,`require(${JSON.stringify(path.resolve(__dirname,'../src/web-app.cjs'))}).run({id:'test',name:'Glass Mail',url:${JSON.stringify(base+'/inbox?source=pwa')},host:'',data:${JSON.stringify(path.join(temp,'data'))}});`);
   const child=spawn(process.execPath,['--no-sandbox',entry],{env:{...process.env,PRISM_WEB_APP_STATUS:status,PRISM_WEB_APP_QUIT_AFTER:'4000',ELECTRON_RUN_AS_NODE:''},stdio:'inherit'});children.push(child);
   await eventually(()=>read(status)?.loaded,'the web app loaded its site',30000);const s=read(status);console.log('web app status: '+JSON.stringify(s));
   assert.equal(s.name,'Glass Mail');assert.equal(s.url,base+'/inbox?source=pwa');assert.equal(s.userData,path.join(temp,'data'));
   await new Promise(r=>child.once('exit',r));}
  console.log('web app flow passed');
 }finally{for(const c of children)try{c.kill();}catch{}server.close();fs.rmSync(temp,{recursive:true,force:true});app.exit(0);}
};
