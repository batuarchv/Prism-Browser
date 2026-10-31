// Lens bar (peek.cjs): close, back, forward, reload, an address field that takes an address or a search, Copy link,
// Keep open (Lens over the page → Lens window) and Open as tab. The field shows the site and path at rest and the full
// address while you edit it; Esc puts it back.
(()=>{const $=id=>document.getElementById(id),field=$('peek-address');let s={},editing=false;
 const t=key=>globalThis.PrismLanguages?PrismLanguages.translate(s.language||'en',key):key;
 for(const [id,name] of [['peek-back','back'],['peek-forward','forward'],['peek-reload','reload'],['peek-close','close'],['peek-copy','copy'],['peek-detach','external'],['peek-tab-icon','expand'],['peek-lock','lock']])$(id).append(icon(name));
 $('peek-back').onclick=()=>surface.send('back');$('peek-forward').onclick=()=>surface.send('forward');$('peek-reload').onclick=()=>surface.send('reload');
 $('peek-tab').onclick=()=>surface.send('tab');$('peek-close').onclick=()=>surface.send('close');$('peek-detach').onclick=()=>surface.send('detach');
 $('peek-copy').onclick=()=>{surface.send('copy');const b=$('peek-copy');b.replaceChildren(icon('check'));b.classList.add('done');clearTimeout(b.timer);b.timer=setTimeout(()=>{b.replaceChildren(icon('copy'));b.classList.remove('done');},1200);};
 const rest=()=>{if(!editing)field.value=s.display||'';};
 field.addEventListener('focus',()=>{editing=true;field.value=s.url||'';requestAnimationFrame(()=>field.select());document.body.classList.add('editing');});
 field.addEventListener('blur',()=>{editing=false;document.body.classList.remove('editing');rest();});
 field.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(s.blank&&s.kind==='peek')surface.send('close');field.value=s.url||'';field.blur();}});
 $('peek-form').onsubmit=e=>{e.preventDefault();const value=field.value.trim();if(!value)return;editing=false;field.blur();surface.send('go',value);};
 surface.on(next=>{if(!next)return;if(next.focusAddress){field.focus();return;}s={...s,...next};applySurfaceTheme(s);
  document.body.classList.toggle('loading',!!s.loading);document.body.dataset.kind=s.kind||'peek';
  $('peek-back').disabled=!s.canBack;$('peek-forward').disabled=!s.canForward;$('peek-reload').replaceChildren(icon(s.loading?'close':'reload'));$('peek-reload').title=t(s.loading?'Stop':'Reload')+(s.loading?'':' (⌘R)');
  $('peek-detach').hidden=s.kind==='window';$('peek-copy').hidden=$('peek-tab').hidden=!!s.blank;$('peek-empty').hidden=!s.blank;$('peek-lock').hidden=!s.secure||!!s.icon;
  const img=$('peek-icon');if(s.icon&&img.getAttribute('src')!==s.icon)img.src=s.icon;img.hidden=!s.icon;img.onerror=()=>{img.hidden=true;};
  field.title=s.title||'';document.title=s.title||'Lens';rest();});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&document.activeElement!==field&&s.kind!=='window')surface.send('close');});
 surface.send('ready');
})();
