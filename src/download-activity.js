// Sidebar Downloads button: a progress ring while files download and a count of finished downloads not yet seen.
(() => {
 const button=document.getElementById('downloads');if(!button||(typeof toolMode!=='undefined'&&toolMode))return;
 const t=key=>window.prismLocale?.t?.(key)||key,svg='http://www.w3.org/2000/svg',R=13,C=2*Math.PI*R;
 const ring=document.createElementNS(svg,'svg');ring.setAttribute('class','download-ring');ring.setAttribute('viewBox','0 0 32 32');ring.setAttribute('aria-hidden','true');
 const track=document.createElementNS(svg,'circle'),bar=document.createElementNS(svg,'circle');for(const c of [track,bar]){c.setAttribute('cx','16');c.setAttribute('cy','16');c.setAttribute('r',String(R));}track.setAttribute('class','track');bar.setAttribute('class','bar');bar.style.strokeDasharray=String(C);ring.append(track,bar);
 const badge=document.createElement('span');badge.className='download-badge';badge.hidden=true;badge.setAttribute('aria-hidden','true');
 const glyph=document.createElement('span');glyph.className='download-glyph';glyph.append(icon('download'));button.replaceChildren(ring,glyph,badge);
 let space=null,previous=new Map();const unseen=new Set();
 // Opening Downloads (button, ⌘J or the panel) marks finished files as seen.
 function seen(){unseen.clear();draw(state);}
 button.addEventListener('click',seen);window.prism.onPanel?.(section=>{if(section==='downloads'||section==='quick-downloads')seen();});
 function draw(s){if(!s)return;
  const active=s.downloads.filter(d=>d.state==='progressing'||d.state==='paused'),known=active.filter(d=>d.total>0);
  const fraction=known.length?known.reduce((n,d)=>n+Math.min(d.received,d.total),0)/known.reduce((n,d)=>n+d.total,0):0;
  button.classList.toggle('downloading',active.length>0);button.classList.toggle('indeterminate',active.length>0&&!known.length);
  bar.style.strokeDashoffset=String(C*(1-fraction));
  badge.hidden=!unseen.size||active.length>0;badge.textContent=unseen.size>9?'9+':String(unseen.size);
  const parts=[t('Downloads')];if(active.length)parts.push(`${active.length} ${t('active')}${known.length?' · '+Math.round(fraction*100)+'%':''}`);if(unseen.size)parts.push(`${unseen.size} ${t('new')}`);
  button.setAttribute('aria-label',parts.join(' · '));button.title=parts.join(' · ')+' (⌘J)';}
 // 0.50: a new download flies in a small arc from the page edge into the Downloads button, which then dips like a drop
 // landing. Reduce Motion (Prism's or macOS's) keeps only the ring.
 const still=s=>s?.settings?.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 function fly(){const side=document.getElementById('sidebar'),to=button.getBoundingClientRect();if(!side||!to.width||document.documentElement.dataset.collapsed==='true')return;
  const from=side.getBoundingClientRect(),x0=from.right-22,y0=Math.max(70,Math.min(from.bottom*.42,to.top-120)),x1=to.left+to.width/2-13,y1=to.top+to.height/2-13;
  const chip=document.createElement('span');chip.className='download-fly';chip.setAttribute('aria-hidden','true');chip.append(icon('download'));document.body.append(chip);
  const mx=(x0+x1)/2-40,my=Math.min(y0,y1)-70,at=(x,y,sc,o)=>({transform:`translate(${x}px,${y}px) scale(${sc})`,opacity:o});
  const run=chip.animate([at(x0,y0,.6,0),{...at(x0-8,y0-18,1.08,1),offset:.18},{...at(mx,my,1,1),offset:.5},{...at(x1,y1,.7,1),offset:.92},at(x1,y1,.4,0)],{duration:720,easing:'cubic-bezier(.45,0,.25,1)'});
  run.onfinish=()=>{chip.remove();glyph.animate([{transform:'translateY(0)'},{transform:'translateY(4px)'},{transform:'translateY(-1px)'},{transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.3,1.4,.5,1)'});ring.animate([{opacity:.4,transform:'rotate(-90deg) scale(1.25)'},{transform:'rotate(-90deg) scale(1)'}],{duration:360,easing:'ease-out'});};}
 window.prism.onState(s=>{const next=new Map(s.downloads.map(d=>[d.id,d.state]));
  if(space===s.space&&!still(s)&&s.downloads.some(d=>!previous.has(d.id)&&(d.state==='progressing'||d.state==='completed')&&Date.now()-(d.startedAt||0)<5000))fly();
  if(space!==s.space){space=s.space;previous=next;unseen.clear();draw(s);return;}
  for(const d of s.downloads)if(d.state==='completed'&&previous.has(d.id)&&previous.get(d.id)!=='completed'&&!document.documentElement.dataset.panel)unseen.add(d.id);
  for(const id of unseen)if(!next.has(id))unseen.delete(id);
  const finished=s.downloads.some(d=>d.state==='completed'&&previous.get(d.id)&&previous.get(d.id)!=='completed');previous=next;draw(s);
  if(finished&&!(s.settings.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches))button.animate([{transform:'scale(1)'},{transform:'scale(1.16)'},{transform:'scale(1)'}],{duration:320,easing:'cubic-bezier(.3,1.5,.5,1)'});});
})();
