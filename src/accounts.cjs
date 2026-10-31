'use strict';
const fs=require('node:fs');
const path=require('node:path');
// Fixed loopback endpoint until a production HTTPS service is configured and reviewed.
function createAccounts({file,safeStorage,fetchImpl=fetch}){
 let session=null,current=null,revision=null;
 // safeStorage's async API since 0.42; sessions saved by the older sync calls decrypt unchanged.
 async function load(){if(session)return;let raw;try{raw=await fs.promises.readFile(file);}catch(error){if(error.code==='ENOENT')return;throw error;}if(!await safeStorage.isAsyncEncryptionAvailable())throw Error('Unlock macOS Keychain to use your account.');const value=JSON.parse((await safeStorage.decryptStringAsync(raw)).result);session??=value;}
 function clear(){session=null;current=null;revision=null;fs.rmSync(file,{force:true});}
 async function request(route,method='GET',body){
  await load();let response;
  try{response=await fetchImpl('http://127.0.0.1:43127/v1'+route,{method,redirect:'error',headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(8000)});}catch{throw Error('Local account server is offline. Your local profile is unchanged.');}
  const data=await response.json();if(response.status===401&&session)clear();if(!response.ok)throw Error(data.error||'Account request failed.');return data;
 }
 return {
  snapshot(){return {mode:'local-development',account:current,connected:!!current};},
  async start(email){return request('/auth/start','POST',{email});},
  async verify(value){
   if(!await safeStorage.isAsyncEncryptionAvailable())throw Error('macOS Keychain encryption is required.');
   const data=await request('/auth/verify','POST',{challengeId:value.challengeId,code:value.code,deviceName:'Prism on '+require('node:os').hostname()});
   const next={token:data.token,sessionId:data.sessionId};
   try{fs.mkdirSync(path.dirname(file),{recursive:true});const encrypted=await safeStorage.encryptStringAsync(JSON.stringify(next));fs.writeFileSync(file+'.tmp',encrypted,{mode:0o600});fs.renameSync(file+'.tmp',file);}catch(error){session=next;try{await request('/logout','POST',{});}finally{session=null;}throw error;}
   session=next;current=data.account;revision=current.revision;return {account:current};
  },
  async refresh(){const data=await request('/account');current=data.account;revision=current.revision;return {account:current};},
  async upload(value){if(revision===null)throw Error('Refresh your account first.');const data=await request('/profile','PUT',{revision,profile:{name:value.name,theme:value.theme}});current=data.account;revision=current.revision;return {account:current};},
  async devices(){return request('/devices');},
  async revoke(id){const result=await request('/devices/'+encodeURIComponent(id),'DELETE',{});if(id===session?.sessionId)clear();return result;},
  async logout(){await request('/logout','POST',{});clear();return {message:'Signed out on this device.'};},
  async remove(email){const result=await request('/account','DELETE',{confirmEmail:email});clear();return result;},
  async export(){return request('/export');}
 };
}
module.exports={createAccounts};
