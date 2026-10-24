// Spectrum (0.32, spectrum.cjs): today as a thin band of light above the sidebar footer. Each stripe is a site you were
// on, tinted by the site, blended into its neighbours like light through a prism, with a soft glow beneath and a spark
// for now. Hover to read the time, site and chapter; click (or Return) to open the day: a line about it, its chapters
// (named by Apple Intelligence on this Mac, or by what their sites are for), the tabs you had open at any point to bring
// back, and the sites you usually open around this hour. Redrawn once a minute at most, only while the window is visible.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const root=document.createElement('div');root.id='spectrum';root.hidden=true;
 root.innerHTML='<div class="spectrum-label" aria-hidden="true"><span class="spectrum-time"></span><span class="spectrum-host"></span><span class="spectrum-chapter"></span></div><div class="spectrum-band" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="spectrum-glow" aria-hidden="true"></div><div class="spectrum-track"><div class="spectrum-light"></div></div><div class="spectrum-now" aria-hidden="true"></div><div class="spectrum-cursor"></div></div>'
  +'<div class="spectrum-card" role="dialog" hidden><div class="spectrum-card-head"><strong class="spectrum-day"></strong><small class="spectrum-total"></small></div><p class="spectrum-summary"></p><div class="spectrum-chapters" role="list"></div><div class="spectrum-moment" hidden><div class="spectrum-moment-head"><span></span><small></small></div><div class="spectrum-card-list"></div><div class="spectrum-card-actions"><button type="button" class="spectrum-restore"></button></div></div><div class="spectrum-usual" hidden><small></small><div class="spectrum-chips"></div></div><small class="spectrum-private"></small></div>';
 document.querySelector('#sidebar .sidebar-bottom').prepend(root);
 const $s=sel=>root.querySelector(sel),band=$s('.spectrum-band'),light=$s('.spectrum-light'),glow=$s('.spectrum-glow'),cursor=$s('.spectrum-cursor'),label=$s('.spectrum-label'),card=$s('.spectrum-card');
 let view=null,revision=null,cursorTime=null,language='en',fetching=false,chosen=null,cardTime=null;
 const KIND={mail:'Mail',ai:'Asking AI',code:'Coding',work:'Working',video:'Watching',music:'Listening',social:'Social',news:'Catching up on news',shopping:'Shopping',learning:'Learning',travel:'Planning travel',money:'Money matters',web:'Browsing'};
 // A site's colour: its name picks a hue, kept a little soft so the band reads as light, not as a chart.
 const hue=host=>{let h=2166136261;for(const c of host){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)%360;};
 const colour=(host,a=1)=>`hsl(${hue(host)} 80% 63% / ${a})`;
 const clock=time=>new Intl.DateTimeFormat(language,{hour:'numeric',minute:'2-digit'}).format(time);
 const duration=ms=>{const m=Math.max(1,Math.round(ms/60000)),h=Math.floor(m/60);return h?t('{h} h {m} min').replace('{h}',h).replace('{m}',m%60):t('{m} min').replace('{m}',m);};
 const title=c=>c.title||t(KIND[c.kind]||'Browsing');
 const span=()=>{const s=view.segments,m=view.moments;const start=Math.min(...s.map(x=>x.from),...m.map(x=>x.at),view.now-15*60000);return {start,end:view.now};};
 const chapterAt=time=>view?.chapters.find(c=>time>=c.from-60000&&time<=c.to+60000)||null;
 // One gradient for the whole day: each site is a band of colour that fades into the next, and pauses stay dark.
 function draw(){if(!view)return;const has=view.segments.length>0;root.hidden=!has;if(!has)return;const {start,end}=span(),total=Math.max(1,end-start),p=x=>((x-start)/total*100).toFixed(3)+'%';
  const stops=[];let last=start;for(const s of view.segments){if(s.from-last>60000)stops.push(`transparent ${p(last)}`,`transparent ${p(s.from)}`);const c=colour(s.host),w=Math.max(s.to,s.from+total*.004);stops.push(`${c} ${p(s.from)}`,`${c} ${p(w)}`);last=w;}
  if(end-last>60000)stops.push(`transparent ${p(last)}`,'transparent 100%');
  const gradient=`linear-gradient(90deg,${stops.join(',')})`;light.style.backgroundImage=gradient;glow.style.backgroundImage=gradient;
  const live=view.segments.at(-1);root.classList.toggle('live',!!live&&view.now-live.to<90000);if(live)root.style.setProperty('--now',colour(live.host));
  if(!card.hidden)fillCard();}
 async function refresh(){if(fetching||document.hidden||state?.space==='private')return;fetching=true;try{const next=await window.prism.action('spectrum-view');if(next){view=next;draw();}}finally{fetching=false;}}
 function timeAt(x){const r=band.getBoundingClientRect(),{start,end}=span();return start+Math.max(0,Math.min(1,(x-r.left)/r.width))*(end-start);}
 function point(time){if(!view)return;cursorTime=time;const {start,end}=span(),p=(time-start)/Math.max(1,end-start);cursor.style.left=(p*100)+'%';const seg=view.segments.find(s=>time>=s.from&&time<=s.to),chapter=seg&&chapterAt(time);
  $s('.spectrum-time').textContent=clock(time);$s('.spectrum-host').textContent=seg?seg.host:t('Away');$s('.spectrum-chapter').textContent=chapter?title(chapter):'';label.style.setProperty('--x',Math.max(8,Math.min(92,p*100))+'%');
  if(seg)cursor.style.setProperty('--c',colour(seg.host));band.setAttribute('aria-valuenow',String(Math.round(p*100)));band.setAttribute('aria-valuetext',clock(time)+' · '+(seg?seg.host:t('Away')));}
 const swatch=sites=>{const el=document.createElement('span');el.className='spectrum-swatch';const total=sites.reduce((n,s)=>n+s.ms,0)||1;let at=0;el.style.backgroundImage='linear-gradient(90deg,'+sites.map(s=>{const from=at;at+=s.ms/total*100;return `${colour(s.host)} ${from.toFixed(1)}%,${colour(s.host)} ${at.toFixed(1)}%`;}).join(',')+')';return el;};
 function fillCard(){
  $s('.spectrum-day').textContent=t('Today');$s('.spectrum-total').textContent=duration(view.active);
  const top=[...view.chapters].sort((a,b)=>b.active-a.active)[0];const summary=$s('.spectrum-summary');
  summary.textContent=view.summary||(top?t('Mostly {activity}, across {count} chapters').replace('{activity}',title(top).toLocaleLowerCase(language)).replace('{count}',view.chapters.length):'');summary.classList.toggle('ai',!!view.summary);
  if(view.chapters.length===1&&!view.summary)summary.textContent=t('Mostly {activity}').replace('{activity}',title(top).toLocaleLowerCase(language));
  const list=$s('.spectrum-chapters');list.replaceChildren(...[...view.chapters].reverse().slice(0,6).map(c=>{const row=document.createElement('button');row.type='button';row.className='spectrum-chapter-row'+(chosen===c.from?' chosen':'');row.setAttribute('role','listitem');
   const text=document.createElement('span');text.className='spectrum-chapter-text';const name=document.createElement('strong');name.textContent=title(c);const meta=document.createElement('small');meta.textContent=clock(c.from)+' – '+clock(c.to)+' · '+duration(c.active);text.append(name,meta);row.title=c.sites.slice(0,4).map(s=>s.host).join(', ');row.append(swatch(c.sites),text);row.onclick=()=>{chosen=c.from;showMoment(Math.min(c.to,view.now));fillCard();};return row;}));
  const usual=$s('.spectrum-usual');usual.hidden=!view.usual?.length;if(view.usual?.length){usual.querySelector('small').textContent=t('You usually open around now');usual.querySelector('.spectrum-chips').replaceChildren(...view.usual.map(u=>{const chip=document.createElement('button');chip.type='button';chip.className='spectrum-chip';const badge=document.createElement('span');badge.className='tab-icon';badge.append(symbol(u.url,u.host));const name=document.createElement('span');name.textContent=u.host;chip.append(badge,name);chip.title=u.url;chip.onclick=()=>{closeCard();act('spectrum-open',{url:u.url});};return chip;}));}
  $s('.spectrum-private').textContent=t('Only on this Mac · never in Private');}
 async function showMoment(time){cardTime=time;const box=$s('.spectrum-moment'),moment=await act('spectrum-at',{time});if(cardTime!==time)return;if(!moment?.tabs?.length){box.hidden=true;return;}
  box.querySelector('span').textContent=t('Your tabs at {time}').replace('{time}',clock(moment.at));box.querySelector('small').textContent=moment.tabs.length===1?t('1 tab'):t('{count} tabs').replace('{count}',moment.tabs.length);
  const list=box.querySelector('.spectrum-card-list');list.replaceChildren(...moment.tabs.slice(0,5).map(x=>{const row=document.createElement('div');row.className='spectrum-row';const badge=document.createElement('span');badge.className='tab-icon';badge.append(symbol(x.url,x.title));const name=document.createElement('span');name.textContent=x.title||x.url;row.append(badge,name);row.title=x.url;return row;}));
  if(moment.tabs.length>5){const more=document.createElement('small');more.className='spectrum-more';more.textContent=t('and {count} more').replace('{count}',moment.tabs.length-5);list.append(more);}
  const restore=box.querySelector('.spectrum-restore');restore.textContent=t('Bring them back');restore.onclick=async()=>{closeCard();await act('spectrum-restore',{time:moment.at});};box.hidden=false;}
 async function openCard(time){if(!view)return;await refresh();const chapter=chapterAt(time);chosen=chapter?.from??null;fillCard();card.hidden=false;root.classList.add('open');await showMoment(time);(!$s('.spectrum-moment').hidden?$s('.spectrum-restore'):$s('.spectrum-chapter-row'))?.focus({focusVisible:false});}
 function closeCard(){card.hidden=true;root.classList.remove('open');chosen=null;}
 band.addEventListener('pointermove',e=>{root.classList.add('hover');point(timeAt(e.clientX));});
 band.addEventListener('pointerleave',()=>{if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('click',e=>{if(!card.hidden&&chapterAt(timeAt(e.clientX))?.from===chosen){closeCard();return;}openCard(timeAt(e.clientX));});
 band.addEventListener('focus',()=>{root.classList.add('hover');if(view)point(cursorTime??view.now);});band.addEventListener('blur',()=>{if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('keydown',e=>{if(!view)return;const step=(e.shiftKey?30:5)*60000;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const {start,end}=span();point(Math.max(start,Math.min(end,(cursorTime??end)+(e.key==='ArrowLeft'?-step:step))));}else if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(cursorTime??view.now);}else if(e.key==='Escape')closeCard();});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCard();band.focus();}});
 document.addEventListener('pointerdown',e=>{if(!card.hidden&&!root.contains(e.target)){closeCard();root.classList.remove('hover');}});
 window.prism.onState(s=>{language=s.settings.language||'en';if(s.space==='private'||s.spectrum==null){root.hidden=true;return;}if(s.spectrum!==revision){revision=s.spectrum;refresh();}});
 setInterval(refresh,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
