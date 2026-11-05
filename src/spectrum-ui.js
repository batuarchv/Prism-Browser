// Spectrum (0.32, spectrum.cjs): today as a thin band of light above the sidebar footer, one colour per site.
// 0.36: a calmer design. The band is one slim line; long stretches away from Prism shrink to a short break, so the
// band is about the time you actually spent. Hovering it shows a quick glance: the time, the chapter and the tabs you
// had open then. Clicking opens the day in a glass card with a rainbow edge: a line about the day, its chapters (named
// by the AI chosen in Settings, or by what their sites are for) and the sites you usually open now. Choosing a chapter
// shows its tabs and brings them back. A click anywhere else, Esc, or leaving the window closes it.
// 0.49: the card opens with the day at a glance: the time so far against your usual day by now, minutes per hour with
// your usual hours behind them, what the time went to, up to three plain notes (pace, longest focus, what is up, busy
// switching, the busiest hour) and the last seven days. Chapters show their times, length and sites. The hover glance
// over the band also gives today's total.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const root=document.createElement('div');root.id='spectrum';root.hidden=true;
 root.innerHTML='<div class="spectrum-glance" aria-hidden="true" hidden><div class="spectrum-glance-head"><strong></strong><small></small></div><div class="spectrum-glance-tabs"></div><div class="spectrum-glance-foot"></div></div>'
  +'<div class="spectrum-band" role="slider" tabindex="0" aria-label="Spectrum" aria-valuemin="0" aria-valuemax="100"><div class="spectrum-track"></div><div class="spectrum-cursor"></div></div>'
  +'<div class="spectrum-card" role="dialog" aria-label="Spectrum" hidden><div class="spectrum-card-head"><strong class="spectrum-day"></strong><button type="button" class="spectrum-scope" aria-pressed="false"></button></div>'
  +'<div class="spectrum-hero"><span class="spectrum-total"></span><span class="spectrum-pace" hidden></span></div><p class="spectrum-summary"></p>'
  +'<div class="spectrum-hours" role="img"><div class="spectrum-hour-bars"></div><div class="spectrum-hour-axis"></div></div>'
  +'<div class="spectrum-mix"><div class="spectrum-mix-bar"></div><div class="spectrum-mix-legend"></div></div>'
  +'<div class="spectrum-notes" role="list"></div>'
  +'<div class="spectrum-label spectrum-chapters-label"></div><div class="spectrum-chapters" role="list"></div>'
  +'<div class="spectrum-usual" hidden><div class="spectrum-label"></div><div class="spectrum-chips"></div></div>'
  +'<div class="spectrum-week" hidden><div class="spectrum-week-head"><span class="spectrum-label"></span><small></small></div><div class="spectrum-week-bars"></div></div></div>';
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
  if(!card.hidden)return;glance.hidden=false;{const foot=glance.querySelector('.spectrum-glance-foot'),typical=view.glance?.typical;foot.textContent=t('Today {time}').replace('{time}',duration(view.active))+(typical&&typical.soFar>=600000?' · '+paceText(view.active-typical.soFar):'');}glance.style.setProperty('--x',(x*100)+'%');glance.querySelector('strong').textContent=clock(time);glance.querySelector('small').textContent=chapter?title(chapter):seg?seg.host:t('Away');
  const ticket=++glanceFor,moment=await momentAt(time);if(ticket!==glanceFor)return;const tabs=moment?.tabs||[],row=glance.querySelector('.spectrum-glance-tabs');
  row.replaceChildren(...tabs.slice(0,6).map(x=>{const b=badge(x.url,x.title);b.title=x.title||x.url;return b;}),...(tabs.length>6?[Object.assign(document.createElement('small'),{textContent:'+'+(tabs.length-6)})]:[]));row.hidden=!tabs.length;}
 const lower=text=>text.toLocaleLowerCase(language);
 const hourName=h=>{const d=new Date();d.setHours(h,0,0,0);return new Intl.DateTimeFormat(language,{hour:'numeric'}).format(d);};
 const paceText=diff=>Math.abs(diff)<Math.max(600000,(view.glance?.typical?.soFar||0)*.15)?t('about usual'):(diff>0?'+':'−')+duration(Math.abs(diff))+' '+t('vs usual');
 const range=(a,b)=>{const f=new Intl.DateTimeFormat(language,{hour:'numeric',minute:'2-digit'});try{return f.formatRange(a,b);}catch{return clock(a)+'–'+clock(b);}};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
 const RANK=[100,68,44,26,14];
 // A note as one line with a small mark; times are in milliseconds.
 function noteOf(n){const row=el('div','spectrum-note '+n.type+(n.tone?' '+n.tone:''));row.setAttribute('role','listitem');const mark=el('span','spectrum-note-mark');mark.setAttribute('aria-hidden','true');let text='',sub='';
  if(n.type==='pace'){mark.textContent=n.tone==='up'?'↑':n.tone==='down'?'↓':'≈';text=n.tone==='even'?t('Right at your usual pace'):(n.tone==='up'?t('{time} more than usual'):t('{time} less than usual')).replace('{time}',duration(n.time));sub=t('By this time on your last {count} days').replace('{count}',view.glance?.typical?.days||0);}
  else if(n.type==='focus'){mark.textContent='◎';text=t('{time} focused on {activity}').replace('{time}',duration(n.time)).replace('{activity}',lower(t(KIND[n.kind]||'Browsing')));sub=(n.record?t('Longest in a while')+' · ':'')+n.host+' · '+range(n.from,n.to);}
  else if(n.type==='kind'){mark.textContent='▲';text=t('More {activity} than usual').replace('{activity}',lower(t(KIND[n.kind]||'Browsing')));sub=(n.usual>=60000?t('{time} so far, usually {usual}'):t('{time} so far')).replace('{time}',duration(n.time)).replace('{usual}',duration(n.usual));}
  else if(n.type==='switching'){mark.textContent='⇄';text=t('{count} site switches in the last hour').replace('{count}',n.count);sub=t('A scattered hour');}
  else if(n.type==='peak'){mark.textContent='◆';text=t('Busiest hour: {hour}').replace('{hour}',hourName(n.hour));sub=t('{time} that hour').replace('{time}',duration(n.minutes*60000));}
  const words=el('span','spectrum-note-text');words.append(el('strong','',text));if(sub)words.append(el('small','',sub));row.append(mark,words);return row;}
 function fillCard(){
  {const name=state?.settings?.spaces?.find?.(x=>x.id===state.space)?.name||state?.space||'';$s('.spectrum-day').textContent=all?t('Today · all spaces'):name?t('Today')+' · '+name:t('Today');const scope=$s('.spectrum-scope');scope.textContent=all?t('This space'):t('All usage');scope.setAttribute('aria-pressed',String(all));scope.title=all?t('Show only this space'):t('Show every space together');}
  const g=view.glance||{hours:Array(24).fill(0),kinds:[],typical:null},typical=g.typical;
  $s('.spectrum-total').textContent=duration(view.active);
  {const pace=$s('.spectrum-pace');pace.hidden=!(typical&&typical.soFar>=600000);if(!pace.hidden){const diff=view.active-typical.soFar,even=Math.abs(diff)<Math.max(600000,typical.soFar*.15);pace.textContent=paceText(diff);pace.className='spectrum-pace '+(even?'even':diff>0?'up':'down');pace.title=t('Your usual day by now: {time}').replace('{time}',duration(typical.soFar));}}
  const top=[...view.chapters].sort((a,b)=>b.active-a.active)[0],summary=$s('.spectrum-summary');
  summary.textContent=view.summary||(top?(view.chapters.length>1?t('Mostly {activity}, across {count} chapters').replace('{count}',view.chapters.length):t('Mostly {activity}')).replace('{activity}',lower(title(top))):'');summary.classList.toggle('ai',!!view.summary);
  // Minutes per hour, a full hour reaching the top, with your usual hour as a soft bar behind; the hour now is marked.
  {const now=new Date(view.now).getHours(),bars=$s('.spectrum-hour-bars'),usualHours=typical?.hours||[];bars.replaceChildren(...g.hours.map((m,h)=>{const bar=el('i','spectrum-hour'+(h===now?' now':'')+(h>now?' later':''));bar.style.setProperty('--h',Math.min(1,m/60).toFixed(3));bar.style.setProperty('--u',Math.min(1,(usualHours[h]||0)/60).toFixed(3));bar.title=hourName(h)+' · '+(m>=1?duration(m*60000):t('Away'))+(usualHours[h]>=1?' · '+t('usually {time}').replace('{time}',duration(usualHours[h]*60000)):'');return bar;}));
   $s('.spectrum-hour-axis').replaceChildren(...[0,6,12,18].map(h=>{const x=el('span','',hourName(h));x.style.left=(h/24*100)+'%';return x;}));
   $s('.spectrum-hours').setAttribute('aria-label',t('Minutes per hour today'));}
  // What the time went to: one bar in the accent at falling strengths, and the largest parts named.
  {const total=g.kinds.reduce((n,k)=>n+k.ms,0)||1,mix=$s('.spectrum-mix');mix.hidden=!g.kinds.length;
   $s('.spectrum-mix-bar').replaceChildren(...g.kinds.map((k,i)=>{const part=el('i');part.style.flexGrow=String(k.ms/total);part.style.background=`color-mix(in srgb,var(--accent) ${RANK[i]}%,transparent)`;part.title=t(KIND[k.kind]||'Browsing')+' · '+duration(k.ms);return part;}));
   $s('.spectrum-mix-legend').replaceChildren(...g.kinds.slice(0,4).map((k,i)=>{const item=el('span','spectrum-mix-item');const dot=el('i');dot.style.background=`color-mix(in srgb,var(--accent) ${RANK[i]}%,transparent)`;item.append(dot,el('span','',t(KIND[k.kind]||'Browsing')),el('small','',duration(k.ms)),el('small','spectrum-mix-share',Math.round(k.ms/total*100)+'%'));return item;}));}
  {const notes=$s('.spectrum-notes'),list=view.notes||[];notes.hidden=!list.length;notes.replaceChildren(...list.map(noteOf));}
  $s('.spectrum-chapters-label').textContent=view.chapters.length>5?t('Latest chapters'):t('Chapters');
  $s('.spectrum-chapters').replaceChildren(...[...view.chapters].reverse().slice(0,5).map(c=>{const item=el('div','spectrum-chapter'+(chosen===c.from?' chosen':''));item.setAttribute('role','listitem');
   const row=el('button','spectrum-chapter-row');row.type='button';row.setAttribute('aria-expanded',String(chosen===c.from));const dot=el('span','spectrum-dot');dot.style.background=`linear-gradient(135deg,${c.sites.slice(0,3).map(s=>colour(s.host)).join(',')}${c.sites.length<2?','+colour(c.sites[0]?.host||'web'):''})`;
   const words=el('span','spectrum-chapter-words');words.append(el('strong','',title(c)),el('small','',range(c.from,c.to)));
   row.append(dot,words,el('small','spectrum-chapter-time',duration(c.active)));row.title=c.sites.slice(0,4).map(s=>s.host).join(', ');
   row.onclick=()=>{chosen=chosen===c.from?null:c.from;fillCard();};item.append(row);if(chosen===c.from)item.append(chapterTabs(c));return item;}));
  const usual=$s('.spectrum-usual');usual.hidden=!view.usual?.length;usual.querySelector('.spectrum-label').textContent=t('Usually around now');usual.querySelector('.spectrum-chips').replaceChildren(...(view.usual||[]).map(u=>{const chip=el('button','spectrum-chip');chip.type='button';chip.append(badge(u.url,u.host),el('span','',u.host.replace(/^www\./,'')));chip.title=t('You usually open around now');chip.onclick=()=>{closeCard();act('spectrum-open',{url:u.url});};return chip;}));
  // The last seven days, today in full accent; shown once there is an earlier day to compare with.
  {const week=$s('.spectrum-week'),days=view.week||[],past=days.filter(d=>!d.today&&d.active>0);week.hidden=!past.length;if(!week.hidden){const most=Math.max(60,...days.map(d=>d.active)),day=new Intl.DateTimeFormat(language,{weekday:'narrow'});
   week.querySelector('.spectrum-label').textContent=t('Last 7 days');week.querySelector('small').textContent=t('Average {time}').replace('{time}',duration(past.reduce((n,d)=>n+d.active,0)/past.length*60000));
   week.querySelector('.spectrum-week-bars').replaceChildren(...days.map(d=>{const col=el('span','spectrum-day-col'+(d.today?' today':''));const bar=el('i');bar.style.setProperty('--h',(d.active/most).toFixed(3));const [y,m,dd]=d.day.split('-').map(Number);col.title=new Intl.DateTimeFormat(language,{weekday:'long'}).format(new Date(y,m-1,dd))+' · '+(d.active?duration(d.active*60000):t('Away'));col.append(bar,el('small','',day.format(new Date(y,m-1,dd))));return col;}));}}}
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
