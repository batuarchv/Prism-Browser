// Local beta feed: pinned Ed25519 signature + archive hash. Never accepts a remote URL.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
// Electron treats app.asar as a virtual directory; removal must use the real filesystem.
const disk=process.versions.electron?require('original-fs'):fs;
const {execFile,spawn}=require('node:child_process'),{promisify}=require('node:util');const exec=promisify(execFile);
function newer(a,b){const parse=v=>/^\d+\.\d+\.\d+$/.test(v||'')?v.split('.').map(Number):null;const x=parse(a),y=parse(b);if(!x||!y)return false;for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]>y[i];}return false;}
function verifyManifest(envelope,key,current){
 if(typeof envelope?.payload!=='string'||envelope.payload.length>4096||typeof envelope.signature!=='string'||!crypto.verify(null,Buffer.from(envelope.payload),key,Buffer.from(envelope.signature,'base64')))throw Error('Local update signature is invalid.');
 const m=JSON.parse(envelope.payload);if(m.bundleID!=='local.prism.browser'||m.arch!=='arm64'||!/^Prism-Electron-\d+\.\d+\.\d+\.zip$/.test(m.file)||! /^[a-f0-9]{64}$/.test(m.sha256)||!Number.isSafeInteger(m.size)||m.size<1||m.size>1024**3)throw Error('Invalid local update manifest.');
 return newer(m.version,current)?m:null;
}
async function digest(file){const hash=crypto.createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);return hash.digest('hex');}
function createLocalUpdater({app,config,onChange=()=>{}}){
 const enabled=app.isPackaged&&process.platform==='darwin'&&config.enabled===true&&path.isAbsolute(config.directory||'')&&!!config.publicKey;
 let status=enabled?'idle':'setup-required',version=null,busy=false,latest=null;
 const failure=path.join(app.getPath('userData'),'local-update-failed-version'),transaction=path.join(app.getPath('userData'),'local-update-transaction.json');
 function snapshot(){return {status,configured:enabled,channel:'local beta',source:'local',currentVersion:app.getVersion(),version};}
 function change(s){status=s;onChange();}
 async function check(){if(!enabled||busy)return snapshot();busy=true;change('checking');try{const file=path.join(config.directory,'latest.json');if(!fs.existsSync(file)){change('current');return snapshot();}if(fs.statSync(file).size>8192)throw Error('Oversized update manifest.');latest=verifyManifest(JSON.parse(await fs.promises.readFile(file,'utf8')),config.publicKey,app.getVersion());if(latest&&fs.existsSync(failure)&&(await fs.promises.readFile(failure,'utf8')).trim()===latest.version)throw Error('The last installation failed.');version=latest?.version||null;change(latest?'ready':'current');}catch{latest=null;change('error');}finally{busy=false;}return snapshot();}
 async function install(){if(!enabled||busy||!latest)return false;busy=true;change('downloading');let root;
 try{
  const bundle=path.resolve(app.getPath('exe'),'../../..'),parent=path.dirname(bundle);
  if(path.basename(bundle)!=='Prism.app'||!['/Applications',path.join(app.getPath('home'),'Applications')].includes(parent)||fs.lstatSync(bundle).isSymbolicLink())throw Error('Install Prism in Applications first.');
  await fs.promises.access(parent,fs.constants.W_OK);const archive=path.join(config.directory,latest.file),stat=await fs.promises.stat(archive);
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
 async function startup(){if(!enabled)return false;await check();return status==='ready'&&await install();}
 async function healthy(){try{const t=JSON.parse(await fs.promises.readFile(transaction,'utf8')),bundle=path.resolve(app.getPath('exe'),'../../..');if(t.version!==app.getVersion()||t.bundle!==bundle||path.dirname(t.root)!==path.dirname(bundle)||!path.basename(t.root).startsWith('.prism-update-'))return;await disk.promises.rm(t.root,{recursive:true,force:true});await fs.promises.unlink(transaction);await fs.promises.rm(failure,{force:true});}catch{}}
 return {snapshot,check,install,startup,healthy,schedule(){},close(){}};
}
module.exports={createLocalUpdater,verifyManifest,newer,digest};
