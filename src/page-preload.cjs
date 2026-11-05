const {ipcRenderer}=require('electron');
// No bridge is exposed to websites. Only user-submitted HTTPS forms qualify, on the page or in a sign-in frame (Apple
// Account's form lives in a frame from idmsa.apple.com); the login is saved for that frame's own origin.
{const visible=el=>!!el.getClientRects().length&&!el.disabled&&getComputedStyle(el).visibility!=='hidden';
 // A sign-in counts when the form is submitted, or (0.50) when Return is pressed in it or its sign-in button is clicked:
 // many sites sign in with script and never fire submit. A step that only asks for the username (Google, Apple) is
 // remembered by Prism for the password step that follows.
 const scopeOf=el=>el?.closest?.('form')||document;let last='',lastAt=0;
 function capture(scope,trusted){if(!trusted||location.protocol!=='https:')return;
  if(scope instanceof HTMLFormElement&&new URL(scope.action||location.href,location.href).origin!==location.origin)return;
  const passwords=[...scope.querySelectorAll('input[type="password"]')].filter(visible);
  const preferred=[...scope.querySelectorAll('input[autocomplete~="username"],input[autocomplete~="email"],input[type="email"]')].filter(visible);
  const users=preferred.length?preferred:[...scope.querySelectorAll('input[type="text"],input:not([type])')].filter(visible).filter(e=>!/search|query|code|otp/i.test(e.name+' '+e.id+' '+e.placeholder));
  if(!passwords.length){if(preferred.length===1&&preferred[0].value&&preferred[0].value.length<=320)ipcRenderer.send('prism-login-username',{origin:location.origin,username:preferred[0].value});return;}
  if(passwords.length!==1||/new-password|one-time-code/.test(passwords[0].autocomplete)||!passwords[0].value)return;
  if(users.length>1)return;const username=users[0];const key=(username?.value||'')+'\n'+passwords[0].value;if(key===last&&Date.now()-lastAt<3000)return;last=key;lastAt=Date.now();
  ipcRenderer.send('prism-login-submitted',{origin:location.origin,username:username?.value||'',password:passwords[0].value});}
 addEventListener('submit',event=>{if(event.target instanceof HTMLFormElement)capture(event.target,event.isTrusted);},true);
 addEventListener('keydown',event=>{if(event.key!=='Enter'||!(event.target instanceof HTMLInputElement))return;const t=event.target;if(t.type==='password'||/email|text|^$/.test(t.type)&&scopeOf(t).querySelector('input[type="password"],input[autocomplete~="username"],input[type="email"]'))capture(scopeOf(t),event.isTrusted);},true);
 addEventListener('click',event=>{const b=event.target?.closest?.('button,input[type="submit"],input[type="button"],[role="button"]');if(!b||b.type==='reset')return;const scope=scopeOf(b);if(!scope.querySelector('input[type="password"],input[autocomplete~="username"],input[type="email"]'))return;
  // Outside a form, only a button that reads like signing in or going on counts (not "show password" and such).
  if(scope===document&&!/sign|log|continue|next|submit|giriş|devam|ileri|oturum|connex|entrar|iniciar|weiter|увійти|далі/i.test((b.textContent||b.value||b.getAttribute('aria-label')||'').trim()))return;capture(scope,event.isTrusted);},true);}
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
// Peek (0.32): Shift-click a link to open it in Peek; plain link clicks are reported so a pinned tab's link to another
// site can open in Peek (main.cjs peekLink). Only the link's address is sent, and only after a real click.
if(process.isMainFrame){addEventListener('click',event=>{
 if(!event.isTrusted||event.button!==0)return;const a=event.composedPath().find(el=>el instanceof HTMLAnchorElement&&el.href);if(!a||a.hasAttribute('download'))return;
 let url;try{url=new URL(a.href,location.href).href;}catch{return;}if(!/^https?:/.test(url))return;
 if(event.shiftKey&&!event.metaKey&&!event.altKey&&!event.ctrlKey){event.preventDefault();ipcRenderer.send('prism-peek',url);return;}
 if(!event.metaKey&&!event.altKey&&!event.ctrlKey&&!event.shiftKey)ipcRenderer.send('prism-link',url);},true);}
// Scroll position for session restore (0.40): sent when the page stops scrolling, at most once a second, instead of
// the browser asking every 5 s. Only the top frame's own scroll counts; the browser checks the address it belongs to.
if(process.isMainFrame){let last=0,timer=null;
 const report=()=>{timer=null;last=Date.now();ipcRenderer.send('prism-scrolled',{url:location.href,x:scrollX,y:scrollY});};
 addEventListener('scrollend',event=>{if(event.target!==document||timer)return;timer=setTimeout(report,Math.max(0,1000-(Date.now()-last)));},{passive:true});
 addEventListener('pagehide',()=>{clearTimeout(timer);timer=null;});}
