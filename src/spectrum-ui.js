// Spectrum (0.32, spectrum.cjs): today as a thin band of light above the sidebar footer, one colour per site.
// 0.36: a calmer design. The band is one slim line; long stretches away from Prism shrink to a short break, so the
// band is about the time you actually spent. Hovering it shows a quick glance: the time, the chapter and the tabs you
// had open then. Clicking opens the day in a glass card with a rainbow edge: a line about the day, its chapters (named
// by the AI chosen in Settings, or by what their sites are for) and the sites you usually open now. Choosing a chapter
// shows its tabs and brings them back. A click anywhere else, Esc, or leaving the window closes it.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const root=document.createElement('div');root.id='spectrum';root.hidden=true;
 root.innerHTML='<div class="spectrum-glance" aria-hidden="true" hidden><div class="spectrum-glance-head"><strong></strong><small></small></div><div class="spectrum-glance-tabs"></div></div>'
  +'<div class="spectrum-band" role="slider" tabindex="0" aria-label="Spectrum" aria-valuemin="0" aria-valuemax="100"><div class="spectrum-track"></div><div class="spectrum-cursor"></div></div>'
  +'<div class="spectrum-card" role="dialog" aria-label="Spectrum" hidden><div class="spectrum-card-head"><strong class="spectrum-day"></strong><small class="spectrum-total"></small><button type="button" class="spectrum-scope" aria-pressed="false"></button></div><p class="spectrum-summary"></p><div class="spectrum-chapters" role="list"></div><div class="spectrum-usual" hidden></div></div>';
 document.querySelector('#sidebar .sidebar-bottom').prepend(root);
 const $s=sel=>root.querySelector(sel),band=$s('.spectrum-band'),track=$s('.spectrum-track'),cursor=$s('.spectrum-cursor'),glance=$s('.spectrum-glance'),card=$s('.spectrum-card');
 // 0.39.1: Spectrum follows the space you are in; the card's All usage button shows every space together.
 let all=false,shownSpace=null,view=null,revision=null,cursorTime=null,language='en',fetching=false,chosen=null,map=null;const moments=new Map();
 const KIND={mail:'Mail',ai:'Asking AI',code:'Coding',work:'Working',video:'Watching',music:'Listening',social:'Social',news:'Catching up on news',shopping:'Shopping',learning:'Learning',travel:'Planning travel',money:'Money matters',web:'Browsing'};
 const hue=host=>{let h=2166136261;for(const c of host){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)%360;};
 // 0.39: one colour, the theme's accent, at a few strengths; each site keeps its strength, so neighbours stay apart.
 const STRENGTHS=[100,74,52,34],colour=host=>`color-mix(in srgb,var(--accent) ${STRENGTHS[hue(host)%STRENGTHS.length]}%,transparent)`;
 const clock=time=>new Intl.DateTimeFormat(language,{hour:'numeric',minute:'2-digit'}).format(time);
 const duration=ms=>{const m=Math.max(1,Math.round(ms/60000)),h=Math.floor(m/60);return h?t('{h} h {m} min').replace('{h}',h).replace('{m}',m%60):t('{m} min').replace('{m}',m);};
 const title=c=>c.title||t(KIND[c.kind]||'Browsing');
 const chapterAt=time=>view?.chapters.find(c=>time>=c.from-60000&&time<=c.to+60000)||null;
 // Time to band position. Pauses of ten minutes or more become a fixed short break; everything else is to scale.
 const BREAK=600000,BREAK_SHARE=.018;
 function buildMap(){const s=view.segments;if(!s.length)return null;const pieces=[];let from=s[0].from,to=s[0].to;
  for(const seg of s.slice(1)){if(seg.from-to>=BREAK){pieces.push([from,to]);from=seg.from;}to=Math.max(to,seg.to);}
  pieces.push([from,view.now-to>=BREAK?to:view.now]);
  const breaks=pieces.length-1+(view.now-to>=BREAK?1:0),live=pieces.reduce((n,[a,b])=>n+Math.max(1,b-a),0),scale=(1-breaks*BREAK_SHARE)/live;
  let x=0;const parts=[];pieces.forEach(([a,b],i)=>{if(i){parts.push({gap:true,x0:x,x1:x+BREAK_SHARE,t0:pieces[i-1][1],t1:a});x+=BREAK_SHARE;}const w=Math.max(1,b-a)*scale;parts.push({x0:x,x1:x+w,t0:a,t1:b});x+=w;});
  if(view.now-to>=BREAK)parts.push({gap:true,x0:x,x1:1,t0:to,t1:view.now});return parts;}
 const xOf=time=>{for(const p of map)if(time<=p.t1)return p.gap?p.x0:p.x0+(p.x1-p.x0)*Math.max(0,(time-p.t0)/Math.max(1,p.t1-p.t0));return 1;};
 const timeOf=x=>{for(const p of map)if(x<=p.x1)return p.gap?p.t0:p.t0+(p.t1-p.t0)*Math.max(0,(x-p.x0)/Math.max(1e-9,p.x1-p.x0));return view.now;};
 function draw(){if(!view)return;root.hidden=!view.segments.length;if(root.hidden)return;map=buildMap();const pct=v=>(v*100).toFixed(3)+'%';
  // Sites are colour stops that blend into each other; a break is see-through.
  const marks=[...view.segments.map(s=>{const a=xOf(s.from);return {x:a,stops:[`${colour(s.host)} ${pct(a)}`,`${colour(s.host)} ${pct(Math.max(xOf(s.to),a+.006))}`]};}),...map.filter(p=>p.gap).map(p=>({x:p.x0,stops:[`transparent ${pct(p.x0)}`,`transparent ${pct(p.x1)}`]}))].sort((a,b)=>a.x-b.x);const stops=marks.flatMap(m=>m.stops);
  track.style.backgroundImage=`linear-gradient(90deg,${stops.join(',')})`;
  track.replaceChildren(...map.filter(p=>p.gap).map(p=>{const gap=document.createElement('i');gap.className='spectrum-break';gap.style.left=pct(p.x0);gap.style.width=pct(p.x1-p.x0);return gap;}));
  if(!card.hidden)fillCard();}
 async function refresh(){if(fetching||document.hidden||state?.space==='private')return;fetching=true;try{const next=await window.prism.action('spectrum-view',{insights:!card.hidden,all});if(next){if(next.moments.length!==view?.moments.length||next.space!==view?.space)moments.clear();view=next;draw();}}finally{fetching=false;}}
 const xAt=clientX=>{const r=band.getBoundingClientRect();return Math.max(0,Math.min(1,(clientX-r.left)/r.width));};
 // The tabs open at a moment, asked for once per recorded moment.
 function momentAt(time){const list=view.moments.filter(m=>m.at<=time);const m=list.at(-1)||view.moments[0];if(!m)return Promise.resolve(null);if(!moments.has(m.at))moments.set(m.at,window.prism.action('spectrum-at',{time:m.at,all}).catch(()=>null));return moments.get(m.at);}
 const badge=(url,label)=>{const b=document.createElement('span');b.className='tab-icon';b.append(symbol(url,label));return b;};
 let glanceFor=0;
 async function point(x){if(!view||!map)return;const time=timeOf(x);cursorTime=time;cursor.style.left=(x*100)+'%';const seg=view.segments.find(s=>time>=s.from&&time<=s.to),chapter=chapterAt(time);
  band.setAttribute('aria-valuenow',String(Math.round(x*100)));band.setAttribute('aria-valuetext',clock(time)+' · '+(seg?seg.host:t('Away')));
  if(!card.hidden)return;glance.hidden=false;glance.style.setProperty('--x',(x*100)+'%');glance.querySelector('strong').textContent=clock(time);glance.querySelector('small').textContent=chapter?title(chapter):seg?seg.host:t('Away');
  const ticket=++glanceFor,moment=await momentAt(time);if(ticket!==glanceFor)return;const tabs=moment?.tabs||[],row=glance.querySelector('.spectrum-glance-tabs');
  row.replaceChildren(...tabs.slice(0,6).map(x=>{const b=badge(x.url,x.title);b.title=x.title||x.url;return b;}),...(tabs.length>6?[Object.assign(document.createElement('small'),{textContent:'+'+(tabs.length-6)})]:[]));row.hidden=!tabs.length;}
 function fillCard(){
  {const name=state?.settings?.spaces?.find?.(x=>x.id===state.space)?.name||state?.space||'';$s('.spectrum-day').textContent=all?t('Today · all spaces'):name?t('Today')+' · '+name:t('Today');const scope=$s('.spectrum-scope');scope.textContent=all?t('This space'):t('All usage');scope.setAttribute('aria-pressed',String(all));scope.title=all?t('Show only this space'):t('Show every space together');}$s('.spectrum-total').textContent=duration(view.active);
  const top=[...view.chapters].sort((a,b)=>b.active-a.active)[0],summary=$s('.spectrum-summary');
  summary.textContent=view.summary||(top?(view.chapters.length>1?t('Mostly {activity}, across {count} chapters').replace('{count}',view.chapters.length):t('Mostly {activity}')).replace('{activity}',title(top).toLocaleLowerCase(language)):'');summary.classList.toggle('ai',!!view.summary);
  $s('.spectrum-chapters').replaceChildren(...[...view.chapters].reverse().slice(0,5).map(c=>{const item=document.createElement('div');item.className='spectrum-chapter'+(chosen===c.from?' chosen':'');item.setAttribute('role','listitem');
   const row=document.createElement('button');row.type='button';row.className='spectrum-chapter-row';const dot=document.createElement('span');dot.className='spectrum-dot';dot.style.background=`linear-gradient(135deg,${c.sites.slice(0,3).map(s=>colour(s.host)).join(',')}${c.sites.length<2?','+colour(c.sites[0]?.host||'web'):''})`;
   const name=document.createElement('strong');name.textContent=title(c);const when=document.createElement('small');when.textContent=clock(c.from);row.append(dot,name,when);row.title=clock(c.from)+' – '+clock(c.to)+' · '+duration(c.active)+'\n'+c.sites.slice(0,4).map(s=>s.host).join(', ');
   row.onclick=()=>{chosen=chosen===c.from?null:c.from;fillCard();};item.append(row);if(chosen===c.from)item.append(chapterTabs(c));return item;}));
  const usual=$s('.spectrum-usual');usual.hidden=!view.usual?.length;usual.replaceChildren(...(view.usual||[]).map(u=>{const chip=document.createElement('button');chip.type='button';chip.className='spectrum-chip';chip.append(badge(u.url,u.host),Object.assign(document.createElement('span'),{textContent:u.host.replace(/^www\./,'')}));chip.title=t('You usually open around now');chip.onclick=()=>{closeCard();act('spectrum-open',{url:u.url});};return chip;}));}
 // A chapter's tabs, as they were at its end, with one button to bring them back.
 function chapterTabs(c){const box=document.createElement('div');box.className='spectrum-chapter-tabs';momentAt(Math.min(c.to,view.now)).then(moment=>{const tabs=moment?.tabs||[];if(!tabs.length){box.remove();return;}
  const icons=document.createElement('div');icons.className='spectrum-chapter-icons';icons.append(...tabs.slice(0,8).map(x=>{const b=badge(x.url,x.title);b.title=x.title||x.url;return b;}));
  const restore=document.createElement('button');restore.type='button';restore.className='spectrum-restore';restore.textContent=tabs.length===1?t('Bring it back'):t('Bring back {count} tabs').replace('{count}',tabs.length);restore.onclick=async()=>{closeCard();await act('spectrum-restore',{time:moment.at});};box.append(icons,restore);});return box;}
 async function openCard(time){if(!view)return;glance.hidden=true;card.hidden=false;root.classList.add('open');await refresh();chosen=chapterAt(time)?.from??null;fillCard();$s('.spectrum-chapter.chosen .spectrum-chapter-row,.spectrum-chapter-row')?.focus({focusVisible:false});}
 function closeCard(){if(card.hidden)return;card.hidden=true;root.classList.remove('open','hover');chosen=null;if(all){all=false;refresh();}}
 $s('.spectrum-scope').addEventListener('click',async e=>{e.stopPropagation();all=!all;chosen=null;await refresh();fillCard();});
 band.addEventListener('pointermove',e=>{root.classList.add('hover');point(xAt(e.clientX));});
 band.addEventListener('pointerleave',()=>{glanceFor++;glance.hidden=true;if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('click',e=>{if(!card.hidden){closeCard();return;}openCard(timeOf(xAt(e.clientX)));});
 band.addEventListener('focus',()=>{root.classList.add('hover');if(view&&map)point(cursorTime!=null?xOf(cursorTime):1);});band.addEventListener('blur',()=>{glance.hidden=true;if(card.hidden)root.classList.remove('hover');});
 band.addEventListener('keydown',e=>{if(!view||!map)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const x=xOf(cursorTime??view.now)+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?.1:.02);point(Math.max(0,Math.min(1,x)));}else if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(cursorTime??view.now);}else if(e.key==='Escape')closeCard();});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCard();band.focus();}});
 // Anything else closes the card: a click elsewhere in the window, a click on the page (the window loses focus to it), Esc.
 document.addEventListener('pointerdown',e=>{if(!card.hidden&&!root.contains(e.target))closeCard();},true);
 window.addEventListener('blur',closeCard);
 window.prism.onState(s=>{language=s.settings.language||'en';if(s.space==='private'||s.spectrum==null){root.hidden=true;closeCard();return;}if(s.spectrum!==revision||s.space!==shownSpace){revision=s.spectrum;shownSpace=s.space;refresh();}});
 setInterval(()=>{if(!document.hidden&&!root.hidden)refresh();},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
