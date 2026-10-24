const {ipcRenderer}=require('electron');
// No bridge is exposed to websites. Only user-submitted HTTPS forms qualify, on the page or in a sign-in frame (Apple
// Account's form lives in a frame from idmsa.apple.com); the login is saved for that frame's own origin.
{addEventListener('submit',event=>{
 if(!event.isTrusted||location.protocol!=='https:'||!(event.target instanceof HTMLFormElement))return;
 const form=event.target;const visible=el=>el.getClientRects().length&&!el.disabled;
 if(new URL(form.action||location.href,location.href).origin!==location.origin)return;
 const passwords=[...form.querySelectorAll('input[type="password"]')].filter(visible);
 if(passwords.length!==1||passwords[0].autocomplete==='new-password'||!passwords[0].value)return;
 const preferred=[...form.querySelectorAll('input[autocomplete="username"],input[type="email"]')].filter(visible);
 const users=preferred.length?preferred:[...form.querySelectorAll('input[type="text"],input:not([type])')].filter(visible);
 if(users.length>1)return;const username=users[0];
 ipcRenderer.send('prism-login-submitted',{origin:location.origin,username:username?.value||'',password:passwords[0].value});
},true);}
// Focus suggestions are requested only following a real pointer/keyboard interaction.
// Websites receive no account metadata and have no IPC bridge.
if(process.isMainFrame){
 let gesture=0,open=false,selected=false,timer;
 const request=()=>{if(Date.now()-gesture>1000||location.protocol!=='https:')return;const e=document.activeElement;if(!(e instanceof HTMLInputElement))return;const ac=e.autocomplete.toLowerCase().trim().split(/\s+/).at(-1);if(!['username','cc-name','cc-number','cc-exp','cc-exp-month','cc-exp-year'].includes(ac)&&!['password','email'].includes(e.type))return;if(['new-password','one-time-code','cc-csc'].includes(ac)||/(cvv|cvc|security.?code|otp|verification)/i.test(e.name+' '+e.id))return;ipcRenderer.send('prism-autofill-focus');};
 ipcRenderer.on('prism-autofill-filled',()=>{gesture=0;clearTimeout(timer);open=false;selected=false;});
 ipcRenderer.on('prism-autofill-visibility',(_event,value)=>{open=!!value;selected=false;});
 addEventListener('pointerdown',event=>{if(!event.isTrusted)return;gesture=Date.now();clearTimeout(timer);if(open)ipcRenderer.send('prism-autofill-dismiss');timer=setTimeout(request,0);},true);
 addEventListener('focusin',()=>{clearTimeout(timer);timer=setTimeout(request,0);},true);
 addEventListener('keydown',event=>{if(!event.isTrusted)return;gesture=Date.now();if(open&&['ArrowDown','ArrowUp','Escape'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();if(event.key==='Escape')ipcRenderer.send('prism-autofill-dismiss');else{selected=true;ipcRenderer.send('prism-autofill-key',event.key);}return;}if(open&&event.key==='Enter'&&selected){event.preventDefault();event.stopImmediatePropagation();ipcRenderer.send('prism-autofill-key','Enter');}else if(open&&event.key!=='Shift'){ipcRenderer.send('prism-autofill-dismiss');}},true);
 addEventListener('scroll',()=>{if(open)ipcRenderer.send('prism-autofill-dismiss');},true);
 addEventListener('pagehide',()=>{clearTimeout(timer);open=false;});
}
// Web Share: navigator.share hands a title, text and URL (never files) to the macOS share menu, only during a user gesture.
// The page-facing shim lives in the main world; this isolated world re-checks the gesture before asking the browser.
if(process.isMainFrame){
 require('electron').webFrame.executeJavaScript(`(()=>{if(navigator.share)return;let next=0;const pending=new Map();
  addEventListener('prism-share-result',event=>{const [id,ok]=String(event.detail).split(':'),entry=pending.get(id);if(!entry)return;pending.delete(id);ok==='1'?entry[0]():entry[1](new DOMException('Share canceled','AbortError'));});
  const clean=data=>({title:typeof data?.title==='string'?data.title.slice(0,500):'',text:typeof data?.text==='string'?data.text.slice(0,5000):'',url:data?.url==null?'':new URL(String(data.url),location.href).href});
  const valid=data=>{const d=clean(data);if(!/^(https?|mailto):/.test(d.url||'https:'))throw new TypeError('Only web and mail links can be shared.');return d;};
  Object.defineProperty(Navigator.prototype,'canShare',{configurable:true,writable:true,value:function canShare(data){try{const d=valid(data);return !data?.files?.length&&!!(d.title||d.text||d.url);}catch{return false;}}});
  Object.defineProperty(Navigator.prototype,'share',{configurable:true,writable:true,value:function share(data){
   if(!navigator.userActivation?.isActive)return Promise.reject(new DOMException('Must be handling a user gesture to perform a share request.','NotAllowedError'));
   if(data?.files?.length)return Promise.reject(new DOMException('Sharing files is not supported.','NotAllowedError'));
   let d;try{d=valid(data);}catch(error){return Promise.reject(error);}if(!d.title&&!d.text&&!d.url)return Promise.reject(new TypeError('Nothing to share.'));
   const id=String(++next);return new Promise((resolve,reject)=>{pending.set(id,[resolve,reject]);dispatchEvent(new CustomEvent('prism-share',{detail:id+'\\n'+JSON.stringify(d)}));});}});})()`).catch(()=>{});
 addEventListener('prism-share',event=>{const raw=String(event.detail||''),cut=raw.indexOf('\n'),id=raw.slice(0,cut);let data;try{data=JSON.parse(raw.slice(cut+1));}catch{return;}
  const reply=ok=>dispatchEvent(new CustomEvent('prism-share-result',{detail:id+':'+(ok?1:0)}));
  if(!navigator.userActivation?.isActive)return reply(false);ipcRenderer.invoke('prism-share',data).then(reply,()=>reply(false));});
}
// Passkeys (src/passkeys.cjs): before a page's navigator.credentials.create/get for a passkey runs, Prism asks for
// Touch ID and attaches its authenticator for that site. The main-world shim only asks; this isolated world checks a
// recent user gesture (or, for autofill-style requests, focus on a "webauthn" field) before asking the browser.
if(process.isMainFrame){
 require('electron').webFrame.executeJavaScript(`(()=>{const c=navigator.credentials;if(!c||!window.PublicKeyCredential)return;let next=0;const pending=new Map();
  addEventListener('prism-passkey-result',event=>{const [id,answer]=String(event.detail).split(':'),entry=pending.get(id);if(!entry)return;pending.delete(id);entry(answer);});
  const ask=(kind,rpId,mediation)=>new Promise(resolve=>{const id=String(++next);pending.set(id,resolve);dispatchEvent(new CustomEvent('prism-passkey',{detail:id+'\\n'+JSON.stringify({kind,rpId,mediation})}));});
  const denied=()=>new DOMException('The operation either timed out or was not allowed.','NotAllowedError');
  for(const kind of ['create','get']){const original=c[kind].bind(c);
   Object.defineProperty(c,kind,{configurable:true,writable:true,value:async function(options){
    if(!options||!options.publicKey)return original(options);
    const pk=options.publicKey,rpId=String((kind==='create'?pk.rp&&pk.rp.id:pk.rpId)||location.hostname),mediation=String(options.mediation||'');
    const answer=await ask(kind,rpId,mediation);
    if(answer==='ok'){const o={...options};if(mediation==='conditional')delete o.mediation;return original(o);}
    throw denied();}});}})()`).catch(()=>{});
 let lastGesture=0,conditional=null;const reply=(id,answer)=>dispatchEvent(new CustomEvent('prism-passkey-result',{detail:id+':'+answer}));
 for(const type of ['pointerdown','keydown'])addEventListener(type,event=>{if(event.isTrusted)lastGesture=Date.now();},true);
 addEventListener('prism-passkey',event=>{const raw=String(event.detail||''),cut=raw.indexOf('\n'),id=raw.slice(0,cut);let data;try{data=JSON.parse(raw.slice(cut+1));}catch{return;}
  const ask=extra=>ipcRenderer.invoke('prism-passkey',{...data,...extra}).catch(()=>'denied');
  if(data.kind==='get'&&data.mediation==='conditional'){ask({}).then(answer=>{if(answer==='conditional')conditional={id,data};else reply(id,'denied');});return;}
  if(Date.now()-lastGesture>5000&&!navigator.userActivation?.isActive)return reply(id,'denied');
  ask({}).then(answer=>reply(id,answer));});
 // Autofill-style sign-in: focusing a field marked "webauthn" offers the saved passkey (with Touch ID).
 addEventListener('focusin',event=>{const el=event.target;if(!conditional||!(el instanceof HTMLInputElement)||!/\bwebauthn\b/i.test(el.autocomplete)||Date.now()-lastGesture>2000)return;
  const {id,data}=conditional;conditional=null;ipcRenderer.invoke('prism-passkey',{...data,activate:true}).catch(()=>'denied').then(answer=>{if(answer==='ok')reply(id,'ok');else conditional={id,data};});},true);
}
// Picture in Picture: a page entering it asks the browser first, so the site controls can show and block it.
{require('electron').webFrame.executeJavaScript(`(()=>{const proto=window.HTMLVideoElement&&HTMLVideoElement.prototype,original=proto&&proto.requestPictureInPicture;if(!original)return;let next=0;const pending=new Map();
  addEventListener('prism-pip-result',event=>{const [id,ok]=String(event.detail).split(':'),done=pending.get(id);if(done){pending.delete(id);done(ok==='1');}});
  Object.defineProperty(proto,'requestPictureInPicture',{configurable:true,writable:true,value:async function requestPictureInPicture(){const id=String(++next);
   const ok=await new Promise(resolve=>{pending.set(id,resolve);dispatchEvent(new CustomEvent('prism-pip',{detail:id}));});
   if(!ok)throw new DOMException('Picture in Picture is turned off for this site.','NotAllowedError');return original.call(this);}});})()`).catch(()=>{});
 addEventListener('prism-pip',event=>{const id=String(event.detail||'');ipcRenderer.invoke('prism-pip').catch(()=>true).then(ok=>dispatchEvent(new CustomEvent('prism-pip-result',{detail:id+':'+(ok?1:0)})));});}
