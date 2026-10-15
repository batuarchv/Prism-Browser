// Read-only Arc migration. Secret values never leave memory except re-encrypted
// into Prism's vault or passed directly to Chromium's local cookie store.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const {execFile}=require('node:child_process');const {promisify}=require('node:util');
const {arcBookmarks}=require('./library.cjs');
function decryptV10(bytes,key,host){
  const input=Buffer.from(bytes);if(input.subarray(0,3).toString()!=='v10')throw Error('Unsupported Arc encryption format');
  const cipher=crypto.createDecipheriv('aes-128-cbc',key,Buffer.alloc(16,32));let plain=Buffer.concat([cipher.update(input.subarray(3)),cipher.final()]);
  if(host!==undefined){const digest=crypto.createHash('sha256').update(host).digest();if(plain.length<32||!crypto.timingSafeEqual(plain.subarray(0,32),digest))throw Error('Cookie integrity check failed');plain=plain.subarray(32);}
  return plain.toString('utf8');
}
function readDatabase(file,fn){if(!fs.existsSync(file))return null;const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(file,{readOnly:true});try{return fn(db);}finally{db.close();}}
function loadArc(root,profile='Default'){
  if(!['Default','Profile 1','Profile 2'].includes(profile))throw Error('Unsupported profile');
  let bookmarks=[];try{bookmarks=arcBookmarks(JSON.parse(fs.readFileSync(path.join(root,'StorableSidebar.json'),'utf8')));}catch{}
  const directory=path.join(root,'User Data',profile);
  const logins=readDatabase(path.join(directory,'Login Data'),db=>db.prepare('SELECT origin_url, signon_realm, username_value, password_value FROM logins WHERE blacklisted_by_user=0').all())||[];
  let cookieFile=path.join(directory,'Network','Cookies');if(!fs.existsSync(cookieFile))cookieFile=path.join(directory,'Cookies');
  const cookies=readDatabase(cookieFile,db=>({version:Number(db.prepare("SELECT value FROM meta WHERE key='version'").get()?.value||0),rows:db.prepare('SELECT host_key, top_frame_site_key, name, value, encrypted_value, path, CAST(expires_utc AS TEXT) AS expires_utc, is_secure, is_httponly, has_expires, samesite FROM cookies').all()}))||{version:0,rows:[]};
  // Arc may keep its History database locked while running. History is optional
  // for migration; don't let that prevent readable bookmarks or credentials
  // from being imported.
  let history=[];try{history=readDatabase(path.join(directory,'History'),db=>db.prepare("SELECT url,title,CAST(last_visit_time AS TEXT) AS last_visit_time FROM urls WHERE url LIKE 'https://%' OR url LIKE 'http://%' ORDER BY last_visit_time DESC LIMIT 5000").all())||[];}catch{}
  return {bookmarks,logins,cookies,history};
}
async function arcKey(){
  try{const {stdout}=await promisify(execFile)('/usr/bin/security',['find-generic-password','-s','Arc Safe Storage','-w'],{encoding:'buffer',maxBuffer:16384,timeout:120000});
    let password=stdout;if(password.at(-1)===10)password=password.subarray(0,-1);const key=crypto.pbkdf2Sync(password,'saltysalt',1003,16,'sha1');stdout.fill(0);return key;
  }catch{throw Error('Arc Keychain access was not available. Allow the macOS request, then retry Import from Arc.');}
}
async function importSecrets(data,key,ses){
  const report={passwords:0,passwordsSkipped:0,cookies:0,cookiesSkipped:0};const credentials=[];
  for(const row of data.logins){try{const u=new URL(row.origin_url);if(!['http:','https:'].includes(u.protocol))throw Error();const password=decryptV10(row.password_value,key);if(!password)throw Error();credentials.push({origin:u.origin,username:row.username_value,password});report.passwords++;}catch{report.passwordsSkipped++;}}
  for(const row of data.cookies.rows){
    try{
      // Partitioned cookies cannot be faithfully migrated through Electron's API.
      if(row.top_frame_site_key){report.cookiesSkipped++;continue;}
      const expiry=Number(row.expires_utc)/1e6-11644473600;if(row.has_expires&&expiry<=Date.now()/1000){report.cookiesSkipped++;continue;}
      const value=row.encrypted_value?.length?decryptV10(row.encrypted_value,key,data.cookies.version>=24?row.host_key:undefined):row.value;
      const host=row.host_key.replace(/^\./,'');const cookie={url:(row.is_secure?'https://':'http://')+host+(row.path||'/'),name:row.name,value,path:row.path||'/',secure:!!row.is_secure,httpOnly:!!row.is_httponly,sameSite:({'-1':'unspecified',0:'no_restriction',1:'lax',2:'strict'})[row.samesite]||'unspecified'};
      if(row.host_key.startsWith('.'))cookie.domain=row.host_key;if(row.has_expires)cookie.expirationDate=expiry;
      await ses.cookies.set(cookie);report.cookies++;
    }catch{report.cookiesSkipped++;}
  }
  await ses.cookies.flushStore();return {credentials,report};
}
module.exports={decryptV10,loadArc,arcKey,importSecrets};
