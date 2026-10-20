// Beta updates: pinned Ed25519 signature + archive hash. Sources are the local feed directory and, when configured, one GitHub repository's releases.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
// Electron treats app.asar as a virtual directory; removal must use the real filesystem.
const disk=process.versions.electron?require('original-fs'):fs;
const {execFile,spawn}=require('node:child_process'),{promisify}=require('node:util');const exec=promisify(execFile);
// The local feed path may start with ~ so the config holds no user name.
function feedDirectory(dir){return typeof dir==='string'&&dir.startsWith('~/')?path.join(require('node:os').homedir(),dir.slice(2)):dir;}
function newer(a,b){const parse=v=>/^\d+\.\d+\.\d+$/.test(v||'')?v.split('.').map(Number):null;const x=parse(a),y=parse(b);if(!x||!y)return false;for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]>y[i];}return false;}
function verifyManifest(envelope,key,current){
 if(typeof envelope?.payload!=='string'||envelope.payload.length>4096||typeof envelope.signature!=='string'||!crypto.verify(null,Buffer.from(envelope.payload),key,Buffer.from(envelope.signature,'base64')))throw Error('Local update signature is invalid.');
 const m=JSON.parse(envelope.payload);if(m.bundleID!=='local.prism.browser'||m.arch!=='arm64'||!/^Prism-Electron-\d+\.\d+\.\d+\.zip$/.test(m.file)||! /^[a-f0-9]{64}$/.test(m.sha256)||!Number.isSafeInteger(m.size)||m.size<1||m.size>1024**3)throw Error('Invalid local update manifest.');
 return newer(m.version,current)?m:null;
}
async function digest(file){const hash=crypto.createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);return hash.digest('hex');}
function createLocalUpdater({app,config,onChange=()=>{},fetch,platform=process.platform}){
 const localFeed=path.isAbsolute(feedDirectory(config.directory)||'')?feedDirectory(config.directory):null;
 let github=null;try{if(config.github?.enabled===true)github=require('./github-update-source.cjs').createGitHubSource({repository:config.github.repository,...(fetch?{fetch}:{})});}catch{}
 const enabled=app.isPackaged&&platform==='darwin'&&config.enabled===true&&!!config.publicKey&&(!!localFeed||!!github);
 let status=enabled?'idle':'setup-required',version=null,busy=false,latest=null,timer=null;
 const failure=path.join(app.getPath('userData'),'local-update-failed-version'),transaction=path.join(app.getPath('userData'),'local-update-transaction.json');
 // GitHub downloads wait here, with their signed manifest, until the next launch or "Restart and install".
 const downloads=path.join(app.getPath('userData'),'updates'),pending=path.join(downloads,'pending.json');
 function snapshot(){return {status,configured:enabled,channel:'beta',source:github?'github':'local',repository:github?.repository||null,currentVersion:app.getVersion(),version};}
 async function readManifest(file){if((await fs.promises.stat(file)).size>8192)throw Error('Oversized update manifest.');return JSON.parse(await fs.promises.readFile(file,'utf8'));}
 async function downloaded(){if(!fs.existsSync(pending))return null;try{const m=verifyManifest(await readManifest(pending),config.publicKey,app.getVersion()),archive=m&&path.join(downloads,m.file);if(m&&fs.existsSync(archive)&&(await fs.promises.stat(archive)).size===m.size)return {...m,archive};}catch{}await disk.promises.rm(downloads,{recursive:true,force:true}).catch(()=>{});return null;}
 function change(s){status=s;onChange();}
 // Collects every valid newer manifest and keeps the newest. A source that fails or is tampered with contributes nothing.
 async function check({network=true}={}){if(!enabled||busy)return snapshot();busy=true;change('checking');let failed=false;const found=[];
  try{
   if(localFeed){try{const file=path.join(localFeed,'latest.json');if(fs.existsSync(file)){const m=verifyManifest(await readManifest(file),config.publicKey,app.getVersion());if(m)found.push({...m,archive:path.join(localFeed,m.file)});}}catch{failed=true;}}
   if(github){const ready=await downloaded();if(ready)found.push(ready);
    if(network){try{const envelope=await github.manifest(),m=verifyManifest(envelope,config.publicKey,app.getVersion());
     if(m&&!found.some(x=>x.version===m.version&&x.archive.startsWith(downloads))&&!found.some(x=>!newer(m.version,x.version))){change('downloading');await disk.promises.rm(downloads,{recursive:true,force:true});await fs.promises.mkdir(downloads,{recursive:true,mode:0o700});const archive=path.join(downloads,m.file);await github.download(m,archive);await fs.promises.writeFile(pending,JSON.stringify(envelope),{mode:0o600});found.push({...m,archive});}}
     catch{failed=true;await fs.promises.rm(path.join(downloads,'pending.json'),{force:true}).catch(()=>{});}}}
   latest=found.reduce((best,m)=>!best||newer(m.version,best.version)?m:best,null);
   if(latest&&fs.existsSync(failure)&&(await fs.promises.readFile(failure,'utf8')).trim()===latest.version)throw Error('The last installation failed.');
   version=latest?.version||null;change(latest?'ready':failed?'error':'current');
  }catch{latest=null;change('error');}finally{busy=false;}return snapshot();}
 async function install(){if(!enabled||busy||!latest)return false;busy=true;change('downloading');let root;
 try{
  const bundle=path.resolve(app.getPath('exe'),'../../..'),parent=path.dirname(bundle);
  if(path.basename(bundle)!=='Prism.app'||!['/Applications',path.join(app.getPath('home'),'Applications')].includes(parent)||fs.lstatSync(bundle).isSymbolicLink())throw Error('Install Prism in Applications first.');
  await fs.promises.access(parent,fs.constants.W_OK);const archive=latest.archive,stat=await fs.promises.stat(archive);
  if(stat.size!==latest.size||await digest(archive)!==latest.sha256)throw Error('Update archive did not match its signature.');
  root=await fs.promises.mkdtemp(path.join(parent,'.prism-update-'));const localArchive=path.join(root,'update.zip');await fs.promises.copyFile(archive,localArchive);
  if(await digest(localArchive)!==latest.sha256)throw Error('Update changed during staging.');
  await exec('/usr/bin/ditto',['-x','-k','--norsrc','--noextattr',localArchive,root],{timeout:60000});const staged=path.join(root,'Prism.app');
  await exec('/usr/bin/codesign',['--verify','--deep','--strict',staged],{timeout:30000});
  const plist=path.join(staged,'Contents/Info.plist');for(const [key,value]of [['CFBundleIdentifier','local.prism.browser'],['CFBundleShortVersionString',latest.version]]){const r=await exec('/usr/libexec/PlistBuddy',['-c','Print '+key,plist]);if(r.stdout.trim()!==value)throw Error('Update bundle identity mismatch.');}
  await fs.promises.unlink(localArchive);await fs.promises.mkdir(app.getPath('userData'),{recursive:true});await fs.promises.writeFile(transaction,JSON.stringify({root,version:latest.version,bundle}),{mode:0o600});
  const helper=path.join(root,'install.sh');await fs.promises.writeFile(helper,await fs.promises.readFile(path.join(__dirname,'local-update-install.sh')),{mode:0o600});
  const child=spawn('/bin/sh',[helper,String(process.pid),bundle,root,failure,latest.version],{detached:true,stdio:'ignore'});await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});child.unref();return true;
 }catch{if(root)await disk.promises.rm(root,{recursive:true,force:true}).catch(()=>{});change('error');return false;}finally{busy=false;}}
 // Launch never waits on the network: it installs only what the local feed or an earlier background download already holds.
 async function startup(){if(!enabled)return false;await check({network:false});return status==='ready'&&await install();}
 function schedule(automatic){clearTimeout(timer);timer=null;if(!enabled||!github||!automatic)return;const run=()=>{check().catch(()=>{}).finally(()=>{timer=setTimeout(run,6*3600000);timer.unref?.();});};timer=setTimeout(run,20000);timer.unref?.();}
 async function healthy(){try{const t=JSON.parse(await fs.promises.readFile(transaction,'utf8')),bundle=path.resolve(app.getPath('exe'),'../../..');if(t.version!==app.getVersion()||t.bundle!==bundle||path.dirname(t.root)!==path.dirname(bundle)||!path.basename(t.root).startsWith('.prism-update-'))return;await disk.promises.rm(t.root,{recursive:true,force:true});await fs.promises.unlink(transaction);await fs.promises.rm(failure,{force:true});await disk.promises.rm(downloads,{recursive:true,force:true});}catch{}}
 return {snapshot,check,install,startup,healthy,schedule,close(){clearTimeout(timer);timer=null;}};
}
module.exports={createLocalUpdater,verifyManifest,newer,digest,feedDirectory};
