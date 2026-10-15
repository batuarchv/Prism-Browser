const {ipcRenderer}=require('electron');
// No bridge is exposed to websites. Only user-submitted, top-level HTTPS forms qualify.
if(process.isMainFrame){addEventListener('submit',event=>{
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
