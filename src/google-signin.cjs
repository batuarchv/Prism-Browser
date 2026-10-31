// Google sign-in (0.47.3). Google turns away sign-in from browsers built on Electron ("Couldn't sign you in. This
// browser or app may not be secure"), whatever the user agent says, and asks such apps not to work around it. Prism
// doesn't disguise itself. Instead the person can bring the Google sign-in they already have in Chrome, Arc or another
// Chromium browser on this Mac: after a confirmation and macOS's own Keychain prompt, only Google's cookies are copied
// into Prism. Nothing in the other browser changes, and no cookie value is logged or kept anywhere else.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const migrate=require('./browser-migrate.cjs');const {decryptV10}=require('./arc-import.cjs');

const GOOGLE_HOST=/(^|\.)(google\.(com|[a-z]{2,3}|com?\.[a-z]{2})|youtube\.com|gmail\.com)$/;
const isGoogleHost=host=>GOOGLE_HOST.test(String(host||'').replace(/^\./,'').toLowerCase());
function isRejected(url){try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='accounts.google.com'&&/\/signin\/(v2\/)?rejected/.test(u.pathname);}catch{return false;}}
const exists=file=>{try{fs.accessSync(file,fs.constants.R_OK);return true;}catch{return false;}};
function cookieFile(root,profile){return [path.join(root,profile,'Network','Cookies'),path.join(root,profile,'Cookies')].find(exists)||null;}
// Reads a private copy (the browser may hold the database open). Values stay encrypted here.
async function readRows(file){
 const dir=await fs.promises.mkdtemp(path.join(os.tmpdir(),'prism-google-'));
 try{const copy=path.join(dir,'db');await fs.promises.copyFile(file,copy);const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(copy,{readOnly:true});
  try{const version=Number(db.prepare("SELECT value FROM meta WHERE key='version'").get()?.value||0);
   const rows=db.prepare('SELECT host_key, top_frame_site_key, name, value, encrypted_value, path, CAST(expires_utc AS TEXT) AS expires_utc, is_secure, is_httponly, has_expires, samesite FROM cookies').all().filter(r=>isGoogleHost(r.host_key));
   return {version,rows};}finally{db.close();}}
 finally{await fs.promises.rm(dir,{recursive:true,force:true});}
}
const signedIn=rows=>rows.some(r=>/(^|\.)google\.com$/.test(r.host_key)&&['SID','__Secure-1PSID'].includes(r.name));
// Browsers and profiles on this Mac that hold a Google sign-in. Only cookie names are looked at.
async function sources(home=os.homedir()){
 const out=[];
 for(const source of migrate.detect({home,applications:[]})){
  const entry=migrate.CHROMIUM.find(b=>b[0]===source.id);if(!entry)continue;const root=migrate.rootOf(entry,home);
  for(const profile of source.profiles){const file=cookieFile(root,profile.id);if(!file)continue;
   try{if(signedIn((await readRows(file)).rows))out.push({browser:source.id,name:source.name,profile:profile.id,profileName:profile.name,label:source.name+(source.profiles.length>1?' · '+profile.name:'')});}catch{}}
 }
 return out;
}
// Chromium cookie rows → Electron cookies. Partitioned and expired cookies are left out.
function toCookies(rows,version,key,now=Date.now()){
 const cookies=[];let skipped=0;
 for(const row of rows){
  try{
   if(!isGoogleHost(row.host_key)||row.top_frame_site_key){skipped++;continue;}
   const expiry=Number(row.expires_utc)/1e6-11644473600;if(row.has_expires&&expiry<=now/1000){skipped++;continue;}
   const value=row.encrypted_value?.length?decryptV10(row.encrypted_value,key,version>=24?row.host_key:undefined):row.value;
   const host=row.host_key.replace(/^\./,'');
   const cookie={url:(row.is_secure?'https://':'http://')+host+(row.path||'/'),name:row.name,value,path:row.path||'/',secure:!!row.is_secure,httpOnly:!!row.is_httponly,sameSite:({'-1':'unspecified',0:'no_restriction',1:'lax',2:'strict'})[row.samesite]||'unspecified'};
   if(row.host_key.startsWith('.'))cookie.domain=row.host_key;if(row.has_expires)cookie.expirationDate=expiry;cookies.push(cookie);
  }catch{skipped++;}
 }
 return {cookies,skipped};
}
// Copies one profile's Google sign-in into a Prism session. macOS asks before the browser's key is handed over.
async function bring({browser,profile,ses,home=os.homedir(),keychainKey=migrate.keychainKey}){
 const entry=migrate.CHROMIUM.find(b=>b[0]===browser);if(!entry)throw Error('Unknown browser.');
 const file=cookieFile(migrate.rootOf(entry,home),profile);if(!file)throw Error(entry[1]+' has no sign-ins to bring over.');
 const {version,rows}=await readRows(file);if(!signedIn(rows))throw Error('You aren’t signed in to Google in '+entry[1]+'.');
 const key=await keychainKey(browser);let result;try{result=toCookies(rows,version,key);}finally{key.fill(0);}
 let set=0;for(const cookie of result.cookies){try{await ses.cookies.set(cookie);set++;}catch{}}
 await ses.cookies.flushStore();return {cookies:set};
}
module.exports={GOOGLE_HOST,isGoogleHost,isRejected,signedIn,sources,toCookies,bring};
