// Save password panel (src/password-save.cjs). Values only live here while the prompt is open.
const $=id=>document.getElementById(id),card=$('card'),user=$('username'),pass=$('password'),eye=$('eye');
if(new URLSearchParams(location.search).get('glass')==='1')document.documentElement.classList.add('glass');
let current=null;
const hue=site=>{let h=0;for(const c of site)h=(h*31+c.charCodeAt(0))%360;return h;};
function fit(){requestAnimationFrame(()=>window.prismSave.fit(card.getBoundingClientRect().height+2));}
function answer(action){if(!current)return;const id=current.id;
 if(action==='save'){if(!pass.value){card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');pass.focus();return;}
  window.prismSave.answer({id,action,username:user.value,password:pass.value});current=null;card.classList.add('saved');setTimeout(()=>{card.classList.add('out');setTimeout(()=>{reset();window.prismSave.hide();},220);},1150);return;}
 window.prismSave.answer({id,action});current=null;reset();}
function reset(){user.value='';pass.value='';pass.type='password';eye.setAttribute('aria-pressed','false');card.hidden=true;card.className='card';}
window.prismSave.onShow(d=>{current=d;const L=d.labels||{};
 document.documentElement.classList.toggle('reduce',!!d.reduceMotion);
 $('title').textContent=d.update?(L.update||'Update password?'):(L.save||'Save password?');$('site').textContent=d.site;
 $('letter').textContent=(d.site.replace(/^www\./,'')[0]||'•').toUpperCase();$('tile').style.setProperty('--hue',hue(d.site));
 $('user-label').textContent=L.username||'Username';$('pass-label').textContent=L.password||'Password';$('never').textContent=L.never||'Never for This Site';
 $('later').textContent=L.later||'Not Now';$('save').textContent=d.update?(L.updateButton||'Update'):(L.saveButton||'Save');$('note').textContent=L.note||'Encrypted on this Mac with Keychain';$('done').textContent=d.update?(L.updated||'Password updated'):(L.saved||'Password saved');
 eye.setAttribute('aria-label',L.show||'Show password');
 user.value=d.username;pass.value=d.password;pass.type='password';eye.setAttribute('aria-pressed','false');
 card.className='card';card.hidden=false;void card.offsetWidth;fit();});
eye.onclick=()=>{const show=pass.type==='password';pass.type=show?'text':'password';eye.setAttribute('aria-pressed',String(show));};
$('save').onclick=()=>answer('save');$('later').onclick=()=>answer('dismiss');$('close').onclick=()=>answer('dismiss');$('never').onclick=()=>answer('never');
addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();answer('dismiss');}else if(e.key==='Enter'&&(e.target===user||e.target===pass)){e.preventDefault();answer('save');}});
