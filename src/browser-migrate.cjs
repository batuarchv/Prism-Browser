// One-click import from Chrome, Arc, Safari and other Chromium browsers on this Mac (0.42): bookmarks, saved
// passwords and history. Read-only: each database is copied into a private temporary folder before SQLite opens it, so a
// running browser's locks never block the import and nothing is ever written back. Passwords are decrypted in memory
// with the browser's own Keychain key (macOS asks first) and only handed to the caller, which re-encrypts them into
// Prism's vault. Safari's passwords live in iCloud Keychain, which no app can read; they come over through a Passwords
// app export instead.
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');
const {execFile}=require('node:child_process');const {promisify}=require('node:util');
const {bookmark,webURL,arcBookmarks}=require('./library.cjs');const {bookmarkFile}=require('./browser-import.cjs');
const {decryptV10}=require('./arc-import.cjs');const {credential}=require('./password-data.cjs');
const HISTORY_LIMIT=2000;
// id, name, data folder (under ~/Library/Application Support), Keychain item, app bundle (for its icon).
const CHROMIUM=[
 ['chrome','Google Chrome','Google/Chrome','Chrome Safe Storage','Google Chrome.app'],
 ['arc','Arc','Arc/User Data','Arc Safe Storage','Arc.app'],
 ['brave','Brave','BraveSoftware/Brave-Browser','Brave Safe Storage','Brave Browser.app'],
 ['edge','Microsoft Edge','Microsoft Edge','Microsoft Edge Safe Storage','Microsoft Edge.app'],
 // 0.47. These keep their data in less settled places, so a few known spellings are tried in turn.
 ['dia','Dia',['Dia/User Data','Dia'],['Dia Safe Storage'],'Dia.app'],
 ['atlas','ChatGPT Atlas',['com.openai.atlas/browser-data/host','com.openai.atlas/browser-data/host/user-data','com.openai.atlas','ChatGPT Atlas'],['ChatGPT Atlas Safe Storage','Atlas Safe Storage','ChatGPT Safe Storage'],'ChatGPT Atlas.app'],
 ['helium','Helium',['net.imput.helium','Helium'],['Helium Storage Key','Helium Safe Storage'],'Helium.app'],
 // 0.47.1. Opera keeps one profile straight in its data folder rather than in Default.
 ['opera-gx','Opera GX','com.operasoftware.OperaGX',['Opera GX Safe Storage','Opera Safe Storage'],'Opera GX.app'],
 ['opera','Opera','com.operasoftware.Opera',['Opera Safe Storage'],'Opera.app'],
 ['vivaldi','Vivaldi','Vivaldi',['Vivaldi Safe Storage'],'Vivaldi.app']
];
const list=value=>Array.isArray(value)?value:[value];
// The first candidate folder that holds Chromium profiles.
function rootOf(entry,home){const roots=list(entry[2]).map(folder=>path.join(support(home),folder));return roots.find(root=>chromiumProfiles(root).length)||roots[0];}
const exists=file=>{try{fs.accessSync(file,fs.constants.R_OK);return true;}catch{return false;}};
const support=home=>path.join(home,'Library','Application Support');
// Chromium stores times as microseconds since 1601; Safari as seconds since 2001.
const chromeTime=value=>Math.round(Number(value)/1000-11644473600000);
const safariTime=value=>Math.round((Number(value)+978307200)*1000);

// Opens a private copy of a SQLite database (plus its -wal/-journal) and closes and removes it afterwards.
async function withCopy(file,fn){
 if(!exists(file))return null;
 const dir=await fs.promises.mkdtemp(path.join(os.tmpdir(),'prism-import-'));
 try{
  const copy=path.join(dir,'db');await fs.promises.copyFile(file,copy);
  for(const suffix of ['-wal','-journal'])if(exists(file+suffix))await fs.promises.copyFile(file+suffix,copy+suffix);
  await fs.promises.chmod(dir,0o700);
  const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(copy);
  try{return fn(db);}finally{db.close();}
 }finally{await fs.promises.rm(dir,{recursive:true,force:true});}
}

function chromiumProfiles(root){
 let names={};try{names=JSON.parse(fs.readFileSync(path.join(root,'Local State'),'utf8')).profile?.info_cache||{};}catch{}
 let dirs=[];try{dirs=fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^(Default|Profile \d+)$/.test(e.name)).map(e=>e.name);}catch{}
 return dirs.sort((a,b)=>a==='Default'?-1:b==='Default'?1:Number(a.slice(8))-Number(b.slice(8))).slice(0,12).map(dir=>{
  const base=path.join(root,dir);
  return {id:dir,name:String(names[dir]?.name||dir).slice(0,80),bookmarks:exists(path.join(base,'Bookmarks')),passwords:exists(path.join(base,'Login Data')),history:exists(path.join(base,'History'))};
 }).filter(p=>p.bookmarks||p.passwords||p.history).concat(dirs.length?[]:rootProfile(root));
}
// Opera's single profile lives in the data folder itself; it is listed as profile '.'.
function rootProfile(root){const has=file=>exists(path.join(root,file));const p={id:'.',name:'Default',bookmarks:has('Bookmarks'),passwords:has('Login Data'),history:has('History')};return p.bookmarks||p.passwords||p.history?[p]:[];}

// /Applications/Safari.app is a link into the system's Cryptex volume; its icon comes from the real bundle.
const safariApp=()=>{try{return fs.realpathSync('/Applications/Safari.app');}catch{return '/Applications/Safari.app';}};
// Lists the browsers found on this Mac and which kinds of data each profile has. Reads no secrets.
function detect({home=os.homedir(),applications=['/Applications',path.join(home,'Applications')]}={}){
 const app=bundle=>applications.map(dir=>path.join(dir,bundle)).find(exists)||null;
 const found=[],missing=[];
 for(const [id,name,folder,,bundle] of CHROMIUM){
  const root=rootOf([id,name,folder],home);const profiles=chromiumProfiles(root);
  // Arc keeps its sidebar (pinned tabs, favorites, folders) outside its Chromium profile.
  if(id==='arc'&&profiles[0]&&exists(path.join(support(home),'Arc','StorableSidebar.json')))profiles[0].bookmarks=true;
  if(profiles.length)found.push({id,name,app:app(bundle),profiles});
  else missing.push({id,name,installed:!!app(bundle)});
 }
 const safari=path.join(home,'Library','Safari');
 if(exists(safari)||app('Safari.app')||exists('/Applications/Safari.app')){
  // Without Full Disk Access macOS refuses to let any app read ~/Library/Safari.
  let access=true;try{fs.readdirSync(safari);}catch(error){access=error.code==='ENOENT'?true:false;}
  found.push({id:'safari',name:'Safari',app:safariApp(),needsAccess:!access,profiles:[{id:'Default',name:'Safari',bookmarks:!access||exists(path.join(safari,'Bookmarks.plist')),history:!access||exists(path.join(safari,'History.db')),passwords:false}]});
 }
 // Browsers Prism can import from that have no data here: listed so people see what's supported (0.47.1).
 Object.defineProperty(found,'missing',{value:missing});
 return found;
}

// Minimal binary property list reader (bplist00), enough for Safari's Bookmarks.plist.
function parseBinaryPlist(buffer){
 if(buffer.subarray(0,8).toString('latin1')!=='bplist00')throw Error('Safari bookmarks are not in the expected format.');
 const trailer=buffer.subarray(buffer.length-32);const offsetSize=trailer[6],refSize=trailer[7];
 const count=Number(trailer.readBigUInt64BE(8)),top=Number(trailer.readBigUInt64BE(16)),table=Number(trailer.readBigUInt64BE(24));
 if(count>2e6||table+count*offsetSize>buffer.length)throw Error('Safari bookmarks file is damaged.');
 const uint=(at,size)=>{let n=0;for(let i=0;i<size;i++)n=n*256+buffer[at+i];return n;};
 const offset=i=>uint(table+i*offsetSize,offsetSize);
 const read=(index,depth)=>{
  if(depth>64||index>=count)throw Error('Safari bookmarks file is damaged.');
  let at=offset(index);const marker=buffer[at++],type=marker>>4;let size=marker&15;
  if(type===0)return size===8?false:size===9?true:null;
  if(type===1)return uint(at,1<<size);
  if(type===2)return size===2?buffer.readFloatBE(at):buffer.readDoubleBE(at);
  if(type===3)return new Date((buffer.readDoubleBE(at)+978307200)*1000);
  if(size===15&&[4,5,6,10,13].includes(type)){const intSize=1<<(buffer[at]&15);size=uint(at+1,intSize);at+=1+intSize;}
  if(type===4)return buffer.subarray(at,at+size);
  if(type===5)return buffer.subarray(at,at+size).toString('latin1');
  if(type===6)return Buffer.from(buffer.subarray(at,at+size*2)).swap16().toString('utf16le');
  if(type===8)return {uid:uint(at,size+1)};
  if(type===10)return Array.from({length:size},(_,i)=>read(uint(at+i*refSize,refSize),depth+1));
  if(type===13){const out={};for(let i=0;i<size;i++)out[read(uint(at+i*refSize,refSize),depth+1)]=read(uint(at+(size+i)*refSize,refSize),depth+1);return out;}
  throw Error('Safari bookmarks file is damaged.');
 };
 return read(top,0);
}

function safariBookmarks(root){
 const result=[];
 const walk=(node,folders,depth)=>{
  if(depth>40||result.length>=20000)return;
  if(node.WebBookmarkType==='WebBookmarkTypeLeaf'){const url=webURL(node.URLString);if(url)result.push(bookmark({url,title:node.URIDictionary?.title||node.Title||url,folder:folders.join(' / ')}));return;}
  if(node.WebBookmarkType==='WebBookmarkTypeProxy')return;
  const title=node.Title==='BookmarksBar'?'Favorites':node.Title==='BookmarksMenu'?'':node.Title==='com.apple.ReadingList'?'Reading List':node.Title||'';
  const next=depth===0||!title?folders:[...folders,title];
  for(const child of Array.isArray(node.Children)?node.Children:[])walk(child,next,depth+1);
 };
 walk(root,[],0);return result.map(b=>({...b,source:'Safari'}));
}

function chromiumHistory(db){return db.prepare("SELECT url,title,CAST(last_visit_time AS TEXT) AS t FROM urls WHERE hidden=0 AND (url LIKE 'https://%' OR url LIKE 'http://%') ORDER BY last_visit_time DESC LIMIT "+HISTORY_LIMIT).all().map(r=>({url:r.url,title:r.title,visitedAt:chromeTime(r.t)}));}
function safariHistory(db){return db.prepare("SELECT i.url AS url,(SELECT v.title FROM history_visits v WHERE v.history_item=i.id ORDER BY v.visit_time DESC LIMIT 1) AS title,MAX(v.visit_time) AS t FROM history_items i JOIN history_visits v ON v.history_item=i.id WHERE i.url LIKE 'https://%' OR i.url LIKE 'http://%' GROUP BY i.id ORDER BY t DESC LIMIT "+HISTORY_LIMIT).all().map(r=>({url:r.url,title:r.title,visitedAt:safariTime(r.t)}));}
function cleanHistory(rows){
 const seen=new Set(),out=[];
 for(const r of rows){const url=webURL(r.url);if(!url||seen.has(url)||!Number.isFinite(r.visitedAt))continue;try{const u=new URL(url);if(u.username||u.password)continue;}catch{continue;}seen.add(url);out.push({url,title:String(r.title||url).slice(0,500),visitedAt:Math.min(r.visitedAt,Date.now())});}
 return out;
}

// Reads one profile. Logins stay encrypted here; decrypt them with decryptLogins() once the person has confirmed.
async function collect({browser,profile='Default',kinds={bookmarks:true,passwords:true,history:true},home=os.homedir()}){
 const out={bookmarks:[],history:[],logins:[],skipped:0};
 if(browser==='safari'){
  const root=path.join(home,'Library','Safari');
  try{
   if(kinds.bookmarks&&exists(path.join(root,'Bookmarks.plist')))out.bookmarks=safariBookmarks(parseBinaryPlist(await fs.promises.readFile(path.join(root,'Bookmarks.plist'))));
   if(kinds.history)out.history=cleanHistory(await withCopy(path.join(root,'History.db'),safariHistory)||[]);
  }catch(error){if(error.code==='EPERM'||error.code==='EACCES')throw Object.assign(Error('Prism needs Full Disk Access to read Safari. Allow it in System Settings, then try again.'),{needsAccess:true});throw error;}
  return out;
 }
 const entry=CHROMIUM.find(b=>b[0]===browser);if(!entry)throw Error('Unknown browser.');
 const root=rootOf(entry,home);const found=chromiumProfiles(root).find(p=>p.id===profile);if(!found)throw Error(entry[1]+' profile was not found.');
 const dir=path.join(root,profile);
 if(kinds.bookmarks){
  if(browser==='arc'){const file=path.join(support(home),'Arc','StorableSidebar.json');if(exists(file))out.bookmarks=arcBookmarks(JSON.parse(await fs.promises.readFile(file,'utf8')));}
  else if(found.bookmarks){const file=path.join(dir,'Bookmarks');if((await fs.promises.stat(file)).size>20*1024*1024)throw Error('Bookmark file exceeds 20 MB.');try{out.bookmarks=bookmarkFile(await fs.promises.readFile(file,'utf8'),entry[1]);}catch(error){if(!/No HTTP/.test(error.message))throw error;}}
 }
 if(kinds.history)try{out.history=cleanHistory(await withCopy(path.join(dir,'History'),chromiumHistory)||[]);}catch{}
 if(kinds.passwords)out.logins=await withCopy(path.join(dir,'Login Data'),db=>db.prepare('SELECT origin_url,username_value,password_value FROM logins WHERE blacklisted_by_user=0').all())||[];
 return out;
}

// The browser's Keychain key ("Chrome Safe Storage" etc.). macOS asks the person before handing it over.
async function keychainKey(browser){
 const entry=CHROMIUM.find(b=>b[0]===browser);if(!entry)throw Error('Unknown browser.');
 for(const service of list(entry[3]))try{const {stdout}=await promisify(execFile)('/usr/bin/security',['find-generic-password','-s',service,'-w'],{encoding:'buffer',maxBuffer:16384,timeout:120000});
  let password=stdout;if(password.at(-1)===10)password=password.subarray(0,-1);const key=crypto.pbkdf2Sync(password,'saltysalt',1003,16,'sha1');stdout.fill(0);return key;
 }catch{}
 throw Error('Prism couldn’t read '+entry[1]+'’s password key. Choose Allow when macOS asks, then try again.');
}
// Only HTTPS logins are kept, matching what Prism's vault accepts.
function decryptLogins(rows,key){
 const credentials=[];let skipped=0;
 for(const row of rows){try{const item=credential({origin:new URL(row.origin_url).origin,username:row.username_value||'',password:decryptV10(row.password_value,key)});if(item)credentials.push(item);else skipped++;}catch{skipped++;}}
 return {credentials,skipped};
}
// Adds logins Prism doesn't have yet; a login already saved in Prism is never replaced.
function addCredentials(existing,incoming){const keys=new Set(existing.map(e=>e.origin+'\0'+e.username));const added=[];for(const e of incoming){const k=e.origin+'\0'+e.username;if(keys.has(k))continue;keys.add(k);added.push(e);}return {entries:[...existing,...added],added:added.length};}
// Newest visit wins; the result keeps Prism's history limit.
function mergeHistory(current,incoming,limit=HISTORY_LIMIT){
 const map=new Map();for(const r of [...current,...incoming]){const prior=map.get(r.url);if(!prior||r.visitedAt>prior.visitedAt)map.set(r.url,prior&&!r.title?{...r,title:prior.title}:r);}
 const merged=[...map.values()].sort((a,b)=>b.visitedAt-a.visitedAt).slice(0,limit);const known=new Set(current.map(r=>r.url));
 return {history:merged,added:merged.filter(r=>!known.has(r.url)).length};
}
module.exports={CHROMIUM,detect,collect,keychainKey,decryptLogins,addCredentials,mergeHistory,parseBinaryPlist,safariBookmarks,chromeTime,safariTime};
