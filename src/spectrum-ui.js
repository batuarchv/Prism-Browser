// Spectrum (0.32, spectrum.cjs): today as a thin band of light above the sidebar footer. Each stripe is a site you were
// on, tinted by the site. Hover to read the time and site; click (or Return) to see the tabs you had open then and bring
// them back, asleep. The band is redrawn once a minute at most and only while the window is visible.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const root=document.createElement('div');root.id='spectrum';root.hidden=true;
 root.innerHTML='<div class="spectrum-label" aria-hidden="true"><span class="spectrum-time"></span><span class="spectrum-host"></span></div><div class="spectrum-band" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="spectrum-track"></div><div class="spectrum-cursor"></div></div><div class="spectrum-card" role="dialog" hidden><div class="spectrum-card-head"><strong></strong><small></small></div><div class="spectrum-card-list"></div><div class="spectrum-card-actions"><button type="button" class="spectrum-restore"></button></div></div>';
 document.querySelector('#sidebar .sidebar-bottom').prepend(root);
 const band=root.querySelector('.spectrum-band'),track=root.querySelector('.spectrum-track'),cursor=root.querySelector('.spectrum-cursor'),label=root.querySelector('.spectrum-label'),card=root.querySelector('.spectrum-card');
 let view=null,revision=null,cursorTime=null,language='en',fetching=false;
 // A site's colour: its name picks a hue, kept a little soft so the band reads as light, not as a chart.
 const hue=host=>{let h=2166136261;for(const c of host){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)%360;};
 const clock=time=>new Intl.DateTimeFormat(language,{hour:'numeric',minute:'2-digit'}).format(time);
 const span=()=>{const s=view.segments,m=view.moments;const start=Math.min(...s.map(x=>x.from),...m.map(x=>x.at),view.now-15*60000);return {start,end:view.now};};
 function draw(){if(!view)return;const has=view.segments.length||view.moments.length;root.hidden=!has;if(!has)return;const {start,end}=span(),total=Math.max(1,end-start);
  track.replaceChildren(...view.segments.map(s=>{const el=document.createElement('span');el.className='spectrum-stripe';el.style.left=((s.from-start)/total*100)+'%';el.style.width=Math.max(.35,(s.to-s.from)/total*100)+'%';el.style.setProperty('--h',hue(s.host));return el;}));}
 async function refresh(){if(fetching||document.hidden||state?.space==='private')return;fetching=true;try{const next=await window.prism.action('spectrum-view');if(next){view=next;draw();}}finally{fetching=false;}}
 function timeAt(x){const r=band.getBoundingClientRect(),{start,end}=span();return start+Math.max(0,Math.min(1,(x-r.left)/r.width))*(end-start);}
 function point(time){if(!view)return;cursorTime=time;const {start,end}=span(),p=(time-start)/Math.max(1,end-start);cursor.style.left=(p*100)+'%';const seg=view.segments.find(s=>time>=s.from&&time<=s.to);
  root.querySelector('.spectrum-time').textContent=clock(time);root.querySelector('.spectrum-host').textContent=seg?seg.host:t('Away');label.style.setProperty('--x',Math.max(8,Math.min(92,p*100))+'%');
  band.setAttribute('aria-valuenow',String(Math.round(p*100)));band.setAttribute('aria-valuetext',clock(time)+' · '+(seg?seg.host:t('Away')));}
 async function openCard(time){const moment=await act('spectrum-at',{time});if(!moment?.tabs){card.hidden=true;return;}
  card.querySelector('strong').textContent=t('Your tabs at {time}').replace('{time}',clock(moment.at));card.querySelector('small').textContent=moment.tabs.length===1?t('1 tab'):t('{count} tabs').replace('{count}',moment.tabs.length);
  const list=card.querySelector('.spectrum-card-list');list.replaceChildren(...moment.tabs.slice(0,6).map(x=>{const row=document.createElement('div');row.className='spectrum-row';const badge=document.createElement('span');badge.className='tab-icon';badge.append(symbol(x.url,x.title));const title=document.createElement('span');title.textContent=x.title||x.url;row.append(badge,title);row.title=x.url;return row;}));
  if(moment.tabs.length>6){const more=document.createElement('small');more.className='spectrum-more';more.textContent=t('and {count} more').replace('{count}',moment.tabs.length-6);list.append(more);}
  const restore=card.querySelector('.spectrum-restore');restore.textContent=t('Bring them back');restore.onclick=async()=>{card.hidden=true;await act('spectrum-restore',{time:moment.at});};
  card.hidden=false;root.classList.add('open');restore.focus({focusVisible:false});}
 function closeCard(){card.hidden=true;root.classList.remove('open');}
 band.addEventListener('pointermove',e=>{root.classList.add('hover');point(timeAt(e.clientX));});
 band.addEventListener('pointerleave',()=>{if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('click',e=>openCard(timeAt(e.clientX)));
 band.addEventListener('focus',()=>{root.classList.add('hover');if(view)point(cursorTime??view.now);});band.addEventListener('blur',()=>{if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('keydown',e=>{if(!view)return;const step=(e.shiftKey?30:5)*60000;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const {start,end}=span();point(Math.max(start,Math.min(end,(cursorTime??end)+(e.key==='ArrowLeft'?-step:step))));}else if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(cursorTime??view.now);}else if(e.key==='Escape')closeCard();});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCard();band.focus();}});
 document.addEventListener('pointerdown',e=>{if(!card.hidden&&!root.contains(e.target)){closeCard();root.classList.remove('hover');}});
 window.prism.onState(s=>{language=s.settings.language||'en';if(s.space==='private'||s.spectrum==null){root.hidden=true;return;}if(s.spectrum!==revision){revision=s.spectrum;refresh();}});
 setInterval(refresh,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
