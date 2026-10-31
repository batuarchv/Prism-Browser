// Invisible ink (0.47), after the Messages effect: while Prism works out a readable name for a download, the name is
// hidden under a field of fine drifting, twinkling particles. When the new name arrives the particles scatter and fade
// as the name sharpens into view. The particles survive the download list being rebuilt, because their state is kept
// by download id. Reduce Motion (macOS or Prism) replaces them with a soft blur that fades away.
(() => {
 const inks=new Map();let frame=0;
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 function seed(w,h){const n=Math.max(40,Math.min(420,Math.round(w*h/14)));return Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*6,r:.45+Math.random()*.75,p:Math.random()*Math.PI*2,s:1.5+Math.random()*3}));}
 function canvasFor(el){let c=el.querySelector(':scope>canvas.ink');if(!c){c=document.createElement('canvas');c.className='ink';c.setAttribute('aria-hidden','true');el.append(c);}return c;}
 function draw(now){frame=0;let more=false;
  for(const [id,ink] of inks){const el=ink.el;if(!el?.isConnected){if(ink.phase==='reveal'||now-ink.seen>4000)inks.delete(id);continue;}
   const c=canvasFor(el),w=el.clientWidth,h=el.clientHeight,dpr=devicePixelRatio||1;if(!w||!h){more=true;continue;}
   if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);if(!ink.parts||Math.abs(ink.w-w)>8){ink.parts=seed(w,h);ink.w=w;ink.h=h;}}
   const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);g.fillStyle=getComputedStyle(el.parentElement||el).color;
   const dt=Math.min(.05,(now-(ink.last||now))/1000);ink.last=now;const t=now/1000;
   const k=ink.phase==='reveal'?Math.min(1,(now-ink.revealed)/700):0;
   for(const q of ink.parts){if(k>0){const dx=q.x-w/2,dy=q.y-h/2,len=Math.hypot(dx,dy)||1;q.vx+=dx/len*260*dt;q.vy+=dy/len*120*dt;}
    else{q.vx+=(Math.random()-.5)*14*dt;q.vy+=(Math.random()-.5)*10*dt;q.vx*=.985;q.vy*=.985;}
    q.x+=q.vx*dt;q.y+=q.vy*dt;if(k===0){if(q.x<0)q.x+=w;if(q.x>w)q.x-=w;if(q.y<0)q.y+=h;if(q.y>h)q.y-=h;}
    g.globalAlpha=(.35+.65*Math.abs(Math.sin(t*q.s+q.p)))*(1-k);g.beginPath();g.arc(q.x,q.y,q.r,0,Math.PI*2);g.fill();}
   g.globalAlpha=1;if(k>=1){c.remove();el.classList.remove('inked','ink-revealing');inks.delete(id);continue;}more=true;}
  if(more)frame=requestAnimationFrame(draw);}
 function wake(){if(!frame)frame=requestAnimationFrame(draw);}
 // Hides the element's text under ink. Call again with the rebuilt element; the particles carry over.
 function cover(el,id){let ink=inks.get(id);if(!ink){ink={phase:'ink'};inks.set(id,ink);}ink.el=el;ink.seen=performance.now();ink.phase='ink';el.classList.add('inked');
  if(reduced()){el.classList.add('ink-still');return;}wake();}
 // Scatters the ink and lets the (new) text sharpen into view.
 function reveal(el,id){const ink=inks.get(id);el.classList.remove('ink-still');if(!ink||reduced()){inks.delete(id);el.classList.remove('inked');el.animate([{filter:'blur(6px)',opacity:.2},{filter:'none',opacity:1}],{duration:reduced()?220:520,easing:'ease-out'});return;}
  ink.el=el;ink.phase='reveal';ink.revealed=performance.now();el.classList.add('inked','ink-revealing');
  el.animate([{filter:'blur(7px)',opacity:0,offset:0},{filter:'blur(3px)',opacity:.55,offset:.45},{filter:'none',opacity:1,offset:1}],{duration:760,easing:'cubic-bezier(.2,.8,.2,1)'});wake();
  // Frames can pause (a hidden or covered window); the reveal still finishes on time.
  setTimeout(()=>{if(inks.get(id)!==ink)return;inks.delete(id);el.querySelector(':scope>canvas.ink')?.remove();el.classList.remove('inked','ink-revealing');},900);}
 window.prismInk={cover,reveal,active:id=>inks.has(id)};
})();
