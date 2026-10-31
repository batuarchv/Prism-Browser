const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createAccounts}=require('../src/accounts.cjs');
const safeStorage={isAsyncEncryptionAvailable:async()=>true,encryptStringAsync:async v=>Buffer.from('enc:'+v),decryptStringAsync:async b=>({result:b.toString().slice(4),shouldReEncrypt:false})};
function server(log){return async(url,options)=>{log.push({url,auth:options.headers.Authorization});const route=new URL(url).pathname;const body=route.endsWith('/auth/verify')?{token:'t-1',sessionId:'s-1',account:{revision:1}}:{account:{revision:2}};return {ok:true,status:200,json:async()=>body};};}
test('account session is saved encrypted with the async API and reused after restart',async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prism-account-'));const file=path.join(dir,'account-session.enc'),log=[];try{
 const first=createAccounts({file,safeStorage,fetchImpl:server(log)});await first.verify({challengeId:'c',code:'123456'});
 assert.equal(fs.readFileSync(file,'utf8'),'enc:{"token":"t-1","sessionId":"s-1"}');assert.equal(fs.statSync(file).mode&0o777,0o600);
 const second=createAccounts({file,safeStorage,fetchImpl:server(log)});await second.refresh();assert.equal(log.at(-1).auth,'Bearer t-1');
}finally{fs.rmSync(dir,{recursive:true,force:true});}});
test('without Keychain encryption no session is created',async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prism-account-'));const log=[];try{const a=createAccounts({file:path.join(dir,'s.enc'),safeStorage:{...safeStorage,isAsyncEncryptionAvailable:async()=>false},fetchImpl:server(log)});await assert.rejects(a.verify({challengeId:'c',code:'1'}),/Keychain/);assert.equal(log.length,0);}finally{fs.rmSync(dir,{recursive:true,force:true});}});
