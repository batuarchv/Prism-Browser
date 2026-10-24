// Peek header (peek.cjs): the page's site and title, back, Open as tab and close.
(()=>{const $=id=>document.getElementById(id);
 $('peek-back').append(icon('back'));$('peek-close').append(icon('close'));$('peek-tab-icon').append(icon('expand'));
 $('peek-back').onclick=()=>surface.send('back');$('peek-tab').onclick=()=>surface.send('tab');$('peek-close').onclick=()=>surface.send('close');
 surface.on(s=>{applySurfaceTheme(s);$('peek-title').textContent=s.title||'';$('peek-host').textContent=s.host||'';$('peek-back').hidden=!s.canBack;document.body.classList.toggle('loading',!!s.loading);
  const img=$('peek-icon');if(s.icon&&img.getAttribute('src')!==s.icon){img.src=s.icon;}img.hidden=!s.icon;img.onerror=()=>{img.hidden=true;};});
 addEventListener('keydown',e=>{if(e.key==='Escape')surface.send('close');});
 surface.send('ready');
})();
