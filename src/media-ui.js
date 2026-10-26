// Media in the sidebar (0.32, media.cjs) and the picture-in-picture placeholder (pip.cjs). The media row appears when
// a tab you have left is playing: its artwork or site icon, what is playing, and quiet controls. While a tab's video is
// in picture in picture, that tab's page area says so and offers to bring it back.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const row=document.createElement('div');row.id='media-row';row.hidden=true;
 row.innerHTML='<button type="button" class="media-main"><span class="media-art"></span><span class="media-text"><strong></strong><small></small></span></button><div class="media-controls"><button type="button" data-media="back"></button><button type="button" data-media="toggle" class="media-play"></button><button type="button" data-media="forward"></button><button type="button" data-media="pip"></button></div>';
 document.querySelector('#sidebar .sidebar-bottom').prepend(row);
 const buttons=Object.fromEntries([...row.querySelectorAll('[data-media]')].map(b=>[b.dataset.media,b]));
 buttons.back.append(icon('rewind'));buttons.forward.append(icon('skip'));buttons.pip.append(icon('pip'));
 const labels={back:'Back 10 seconds',forward:'Forward 10 seconds',pip:'Picture in Picture'};
 for(const [name,b] of Object.entries(buttons)){b.onclick=e=>{e.stopPropagation();act('media',name);};}
 row.querySelector('.media-main').onclick=()=>act('media','show');
 let key='';
 window.prism.onState(s=>{const m=s.media;row.hidden=!m;if(!m)return;const next=JSON.stringify([m.title,m.artist,m.artwork,m.playing,m.video,m.url,s.settings.language]);if(next===key)return;key=next;
  const art=row.querySelector('.media-art');art.replaceChildren();if(m.artwork){const img=document.createElement('img');img.alt='';img.src=m.artwork;img.onerror=()=>img.replaceWith(symbol(m.url,m.title));art.append(img);}else art.append(symbol(m.url,m.title));
  row.querySelector('strong').textContent=m.title;row.querySelector('small').textContent=m.artist;row.querySelector('.media-main').title=t('Show tab');
  buttons.toggle.replaceChildren(icon(m.playing?'pause':'play'));buttons.toggle.title=t(m.playing?'Pause':'Play');buttons.toggle.setAttribute('aria-label',buttons.toggle.title);
  for(const [name,label] of Object.entries(labels)){buttons[name].title=t(label);buttons[name].setAttribute('aria-label',t(label));}buttons.pip.hidden=!m.video;row.classList.toggle('playing',!!m.playing);});
 // Placeholder for a tab whose video is floating.
 const holder=document.createElement('div');holder.id='pip-placeholder';holder.hidden=true;
 holder.innerHTML='<div class="pip-holder-card"><span class="pip-holder-icon"></span><strong></strong><small></small><button type="button"></button></div>';
 document.querySelector('main').append(holder);holder.querySelector('.pip-holder-icon').append(icon('pip'));holder.querySelector('button').onclick=()=>act('pip-return');
 window.prism.onState(s=>{const on=!!s.pip&&(s.pip.tabId===s.activeId||s.split?.ids?.includes(s.pip.tabId));holder.hidden=!on;if(!on)return;
  holder.querySelector('strong').textContent=t('Playing in Picture in Picture');holder.querySelector('small').textContent=s.pip.title||'';holder.querySelector('button').textContent=t('Bring the video back');});
})();
