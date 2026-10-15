const fields=`const visible=e=>!e.disabled&&!e.readOnly&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
const focused=document.activeElement,root=focused instanceof HTMLInputElement&&focused.form?focused.form:document;
const passwords=[...root.querySelectorAll('input[type=password]')].filter(visible);
if(passwords.length>1||passwords.some(e=>e.autocomplete.toLowerCase().split(' ').some(x=>['new-password','one-time-code','cc-csc'].includes(x))||/(cvv|cvc|security.?code|otp|verification)/i.test(e.name+' '+e.id)))return null;
const p=passwords[0],scope=p?.form||(focused instanceof HTMLInputElement?focused.form:null)||document;
const explicit=[...scope.querySelectorAll('input[autocomplete=username]')].filter(visible);
const preferred=explicit.length?explicit:[...scope.querySelectorAll('input[type=email]')].filter(visible);
const other=[...scope.querySelectorAll('input[type=text],input:not([type])')].filter(visible);
const users=preferred.length?preferred:other;if(users.length>1)return null;const u=users[0];
if(!p&&!u)return null;if((p?.form||u?.form)&&new URL((p?.form||u?.form).action||location.href,location.href).origin!==location.origin)return null;`;
const captureScript=`(()=>{if(location.protocol!=='https:')return null;${fields}if(!p?.value)return null;return {origin:location.origin,username:u?.value||'',password:p.value};})()`;
function fillScript(entry){return `(()=>{if(location.origin!==${JSON.stringify(entry.origin)})return null;${fields}
const set=(e,v)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));};
if(u)set(u,${JSON.stringify(entry.username)});if(p)set(p,${JSON.stringify(entry.password)});globalThis.__prismDirty=true;return p?'password':'username';})()`;}
module.exports={captureScript,fillScript};
