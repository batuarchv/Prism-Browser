// Picture-in-picture controls (pip.cjs). They appear while the pointer is over the video, like Safari's: close and
// back-to-tab in the corner, ±10 s and play/pause in the middle, the position along the bottom. Drag anywhere else to
// move the window; it settles into the nearest corner when you let go.
(()=>{const $=id=>document.getElementById(id);let status={},hideTimer,drag=null;
 const SVG='http://www.w3.org/2000/svg',glyph=d=>{const s=document.createElementNS(SVG,'svg');s.setAttribute('viewBox','0 0 24 24');s.classList.add('icon');const p=document.createElementNS(SVG,'path');p.setAttribute('d',d);s.append(p);return s;};
 const PLAY='M8 5.5v13l10.5-6.5Z',PAUSE='M8 5h2.6v14H8Z M13.4 5H16v14h-2.6Z';
 $('pip-close').append(icon('close'));$('pip-return').append(glyph('M4 6h16v12H4Z M9 14l-3 3 M6 14v3h3'));$('pip-back').append(glyph('M12 4.5a7.5 7.5 0 1 1-7.5 7.5 M12 1.8 9.2 4.5 12 7.2'),Object.assign(document.createElement('b'),{textContent:'10'}));$('pip-forward').append(glyph('M12 4.5a7.5 7.5 0 1 0 7.5 7.5 M12 1.8l2.8 2.7-2.8 2.7'),Object.assign(document.createElement('b'),{textContent:'10'}));
 const play=$('pip-play');const setPlay=on=>{play.replaceChildren(glyph(on?PAUSE:PLAY));play.classList.add('filled');play.setAttribute('aria-label',on?'Pause':'Play');play.title=on?'Pause':'Play';};setPlay(true);
 const mute=$('pip-mute');const setMute=on=>{mute.replaceChildren(glyph(on?'M4 9h4l5-4v14l-5-4H4Z M17 9l5 6 M22 9l-5 6':'M4 9h4l5-4v14l-5-4H4Z M17 9a4 4 0 0 1 0 6'));mute.setAttribute('aria-label',on?'Unmute':'Mute');mute.title=on?'Unmute':'Mute';};setMute(false);
 const fmt=s=>{s=Math.max(0,Math.floor(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=String(s%60).padStart(2,'0');return h?h+':'+String(m).padStart(2,'0')+':'+r:m+':'+r;};
 function show(){document.body.classList.add('show');clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(!drag)document.body.classList.remove('show');},2600);}
 document.addEventListener('pointerenter',()=>{show();surface.send('hover',true);});document.addEventListener('pointermove',show);
 document.addEventListener('pointerleave',()=>{clearTimeout(hideTimer);document.body.classList.remove('show');surface.send('hover',false);});
 $('pip-close').onclick=()=>surface.send('close');$('pip-return').onclick=()=>surface.send('return');play.onclick=()=>{setPlay(!status.playing);status.playing=!status.playing;surface.send('toggle');};
 $('pip-back').onclick=()=>surface.send('skip',-10);$('pip-forward').onclick=()=>surface.send('skip',10);mute.onclick=()=>surface.send('mute');
 const bar=$('pip-bar');bar.addEventListener('pointerdown',e=>{e.stopPropagation();const r=bar.getBoundingClientRect();surface.send('seek',(e.clientX-r.left)/r.width);});
 bar.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();surface.send('skip',e.key==='ArrowLeft'?-5:5);}});
 // Moving the window: the page reports screen positions and the browser moves it; letting go snaps to a corner.
 document.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button,#pip-bar'))return;drag={id:e.pointerId,moved:false};document.body.setPointerCapture(e.pointerId);surface.send('drag-start',{x:e.screenX,y:e.screenY});});
 document.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id){drag.moved=true;surface.send('drag',{x:e.screenX,y:e.screenY});}});
 const release=e=>{if(!drag||e.pointerId!==drag.id)return;const moved=drag.moved;drag=null;surface.send('drag-end');if(!moved&&e.target===document.body||!moved&&e.target.classList?.contains('pip-scrim')){play.click();}};
 document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);
 document.addEventListener('dblclick',e=>{if(!e.target.closest('button,#pip-bar'))surface.send('return');});
 document.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();play.click();}else if(e.key==='Escape')surface.send('close');else if(e.key==='ArrowLeft')surface.send('skip',-10);else if(e.key==='ArrowRight')surface.send('skip',10);});
 surface.on(s=>{applySurfaceTheme({...s,dark:true});status={...status,...s};if(typeof s.playing==='boolean')setPlay(s.playing);if(typeof s.muted==='boolean')setMute(s.muted);
  if(s.duration>0){$('pip-time').textContent=fmt(s.time);$('pip-left').textContent='-'+fmt(s.duration-s.time);$('pip-fill').style.width=(Math.min(1,s.time/s.duration)*100)+'%';document.body.classList.remove('live');}else document.body.classList.add('live');});
 surface.send('ready');
})();
