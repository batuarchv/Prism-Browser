// Prism passkeys. Electron has no platform authenticator (no Touch ID, no iCloud Keychain: those need Apple's browser
// passkey entitlement, which an ad-hoc signed app cannot have), so a passkey request would wait forever. Prism is the
// authenticator instead: when a page asks to create or use a passkey (page-preload.cjs), Prism asks for Touch ID,
// then attaches Chromium's built-in WebAuthn authenticator (DevTools protocol) to that tab only, loaded with that
// site's passkeys only. New and used passkeys are saved encrypted with macOS Keychain (safeStorage), and the
// authenticator is removed as soon as the request finishes. Nothing is attached without a fresh Touch ID approval.
const crypto=require('node:crypto');

// The relying party must be the page's host or a parent domain of it (as WebAuthn itself requires).
function validRp(rpId,url){try{const u=new URL(url),host=u.hostname;if(u.protocol!=='https:'&&!(u.protocol==='http:'&&host==='localhost'))return false;
 return typeof rpId==='string'&&rpId.length>0&&rpId.length<=253&&(host===rpId||host.endsWith('.'+rpId))&&rpId.includes('.')===host.includes('.');}catch{return false;}}
// A stored passkey, as Chromium's WebAuthn.Credential (private key PKCS#8, base64), plus when it was created.
function clean(c){if(!c||typeof c.credentialId!=='string'||typeof c.rpId!=='string'||typeof c.privateKey!=='string')return null;
 return {credentialId:c.credentialId,rpId:c.rpId,privateKey:c.privateKey,userHandle:typeof c.userHandle==='string'?c.userHandle:undefined,userName:String(c.userName||'').slice(0,256),
  userDisplayName:String(c.userDisplayName||'').slice(0,256),signCount:Number.isSafeInteger(c.signCount)?c.signCount:0,created:c.created||new Date().toISOString()};}

function createPasskeys({read,write,confirmOwner,tabFor,emit=()=>{},timeout=90000}){
 const sessions=new Map(); // webContents id → {wc,authenticatorId,rpId,timer,onMessage}
 const list=()=>read().map(clean).filter(Boolean);
 function save(rows){write(rows);emit();}
 function store(credential){const c=clean(credential);if(!c)return;const rows=list().filter(r=>r.credentialId!==c.credentialId);const old=list().find(r=>r.credentialId===c.credentialId);rows.push({...c,created:old?.created||c.created});save(rows);}
 async function end(wc){const s=sessions.get(wc.id);if(!s)return;sessions.delete(wc.id);clearTimeout(s.timer);
  try{if(!wc.isDestroyed()&&wc.debugger.isAttached()){wc.debugger.removeListener('message',s.onMessage);await wc.debugger.sendCommand('WebAuthn.removeVirtualAuthenticator',{authenticatorId:s.authenticatorId}).catch(()=>{});wc.debugger.detach();}}catch{}}
 async function attach(wc,rpId){await end(wc);wc.debugger.attach('1.3');await wc.debugger.sendCommand('WebAuthn.enable',{enableUI:false});
  const {authenticatorId}=await wc.debugger.sendCommand('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',ctap2Version:'ctap2_1',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true,hasPrf:true}});
  for(const c of list().filter(r=>r.rpId===rpId))await wc.debugger.sendCommand('WebAuthn.addCredential',{authenticatorId,credential:{credentialId:c.credentialId,isResidentCredential:true,rpId:c.rpId,privateKey:c.privateKey,userHandle:c.userHandle,signCount:c.signCount,userName:c.userName,userDisplayName:c.userDisplayName}});
  // The request finishes with credentialAdded (create) or credentialAsserted (get); then the authenticator goes away.
  const onMessage=(_e,method,params)=>{if(params?.authenticatorId!==authenticatorId)return;
   if(method==='WebAuthn.credentialAdded'||method==='WebAuthn.credentialAsserted'){if(params.credential?.rpId===rpId)store(params.credential);setTimeout(()=>end(wc),500);}};
  wc.debugger.on('message',onMessage);const timer=setTimeout(()=>end(wc),timeout);timer.unref?.();
  sessions.set(wc.id,{wc,authenticatorId,rpId,timer,onMessage});wc.once('destroyed',()=>sessions.delete(wc.id));}
 // A page's request (from page-preload.cjs). Returns 'ok' once the authenticator is ready, 'conditional' to keep an
 // autofill-style request waiting for the user, or 'denied'.
 async function request(event,value){
  const wc=event.sender,tab=tabFor(wc),url=event.senderFrame?.url||'';
  if(!tab||tab.space==='private'||event.senderFrame!==wc.mainFrame||!['create','get'].includes(value?.kind)||!validRp(value.rpId,url))return 'denied';
  const rpId=value.rpId,saved=list().filter(r=>r.rpId===rpId).length;
  if(value.kind==='get'&&value.mediation==='conditional'&&!value.activate)return saved?'conditional':'denied';
  if(value.kind==='get'&&!saved)return 'denied';
  const ok=await confirmOwner(value.kind==='create'?`save a passkey for ${rpId}`:`sign in to ${rpId} with your passkey`);
  if(!ok||wc.isDestroyed()||wc.mainFrame.url!==url)return 'denied';
  try{await attach(wc,rpId);return 'ok';}catch{await end(wc);return 'denied';}
 }
 return {request,list:()=>list().map(({privateKey,...r})=>r),
  remove(credentialId){const rows=list();const next=rows.filter(r=>r.credentialId!==credentialId);if(next.length!==rows.length)save(next);},
  active:()=>sessions.size,close(){for(const s of [...sessions.values()])end(s.wc);}};
}
module.exports={createPasskeys,validRp,clean,id:()=>crypto.randomUUID()};
