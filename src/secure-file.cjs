'use strict';
const fs=require('node:fs'),path=require('node:path');
// An encrypted JSON file on safeStorage's async API (0.42; the sync calls are deprecated in Electron 45 and go away
// later). load() decrypts once; read() then answers from memory, so callers keep their read-check-write steps
// synchronous. write() changes memory at once and saves in order in the background; a failed save puts memory back
// to what is on disk and rejects the returned promise. Files written by the old sync API decrypt unchanged.
function createSecureFile({file,safeStorage,fallback=()=>[],onError=()=>{}}){
 let data,saved,failed=null,lastError=null,loading=null,saving=Promise.resolve(),available=null;
 const unavailable=()=>Error('macOS Keychain encryption is unavailable.');
 async function ensureAvailable(){if(available===null)available=await safeStorage.isAsyncEncryptionAvailable();if(!available)throw unavailable();}
 async function persist(value){await ensureAvailable();const encrypted=await safeStorage.encryptStringAsync(JSON.stringify(value));await fs.promises.mkdir(path.dirname(file),{recursive:true});await fs.promises.writeFile(file+'.tmp',encrypted,{mode:0o600});await fs.promises.rename(file+'.tmp',file);}
 function load(){
  return loading??=(async()=>{failed=null;
   let raw;try{raw=await fs.promises.readFile(file);}catch(error){if(error.code!=='ENOENT')throw error;}
   if(!raw){if(data===undefined)data=saved=fallback();return;}
   await ensureAvailable();const {result,shouldReEncrypt}=await safeStorage.decryptStringAsync(raw);
   if(data!==undefined)return;data=saved=JSON.parse(result);
   if(shouldReEncrypt)write(data).catch(()=>{});
  })().catch(error=>{loading=null;failed=error;throw error;});
 }
 function read(){if(data===undefined)throw failed||Error('Saved data is still unlocking. Try again in a moment.');return structuredClone(data);}
 function write(value){
  if(available===false)throw unavailable();
  const snapshot=structuredClone(value);data=snapshot;loading??=Promise.resolve();
  const job=saving.then(()=>persist(snapshot)).then(()=>{saved=snapshot;},error=>{if(data===snapshot)data=saved;if(data===undefined)loading=null;lastError=error;onError(error);throw error;});
  saving=job.catch(()=>{});return job;
 }
 // flush() waits for queued saves and reports the last failed one once. reload() is for test flows that write fixtures.
 return {load,read,write,loaded:()=>data!==undefined,async reload(){await saving;data=saved=undefined;loading=null;return load();},async flush(){await saving;const error=lastError;lastError=null;if(error)throw error;}};
}
module.exports={createSecureFile};
