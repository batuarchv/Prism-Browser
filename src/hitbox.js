// Instant hitboxes (0.47): one highlight per list that glides between rows on a spring instead of each row fading on
// its own. It reacts on the first pointer move (no hover delay) and dips slightly on press. 'hover' lists (the sidebar)
// follow the pointer and fade out when it leaves; 'selected' lists (Beam) follow the selected row, keyboard included.
// Reduce Motion snaps the highlight straight to the row. Rows keep their own :hover/selected styles until a pill is
// attached, so pages without this script look as before.
(() => {
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const K=560,D=36; // stiffness and damping: about 7% overshoot, settled in ~250 ms
 function attach(container,items,{mode='hover',selected='[aria-selected=true]',skip=''}={}){
  if(!container||container.prismHitbox)return container?.prismHitbox;
  const pill=document.createElement('div');pill.className='hit-pill';pill.dataset.mode=mode;pill.setAttribute('aria-hidden','true');
  container.classList.add('has-hit-pill');if(getComputedStyle(container).position==='static')container.style.position='relative';container.prepend(pill);
  const s={x:0,y:0,w:0,h:0},v={x:0,y:0,w:0,h:0};let goal=null,target=null,frame=0,last=0,shown=false;
  function rectOf(el){const c=container.getBoundingClientRect(),r=el.getBoundingClientRect();return {x:r.left-c.left+container.scrollLeft,y:r.top-c.top+container.scrollTop,w:r.width,h:r.height};}
  function paint(){pill.style.transform=`translate(${s.x}px,${s.y}px)`;pill.style.width=s.w+'px';pill.style.height=s.h+'px';}
  function step(now){frame=0;const dt=Math.min(.032,(now-(last||now))/1000)||.016;last=now;let moving=false;
   for(const k of ['x','y','w','h']){const a=-K*(s[k]-goal[k])-D*v[k];v[k]+=a*dt;s[k]+=v[k]*dt;if(Math.abs(s[k]-goal[k])>.2||Math.abs(v[k])>.5)moving=true;else{s[k]=goal[k];v[k]=0;}}
   paint();if(moving)frame=requestAnimationFrame(step);else last=0;}
  function go(el){if(!el||!container.contains(el)){hide();return;}target=el;goal=rectOf(el);
   if(!shown||reduced()){Object.assign(s,goal);for(const k in v)v[k]=0;paint();if(!shown){shown=true;pill.classList.add('on');}return;}
   if(!frame)frame=requestAnimationFrame(step);}
  function hide(){target=null;shown=false;pill.classList.remove('on','pressed');}
  const pick=e=>{const el=e.target.closest?.(items);return el&&container.contains(el)&&!(skip&&el.matches(skip))?el:null;};
  if(mode==='hover'){
   container.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const el=pick(e);if(el!==target)el?go(el):hide();},{passive:true});
   container.addEventListener('pointerleave',hide);}
  container.addEventListener('pointerdown',e=>{const el=pick(e);if(!el)return;if(el!==target)go(el);pill.classList.add('pressed');},{passive:true});
  addEventListener('pointerup',()=>pill.classList.remove('pressed'),{passive:true});
  // Rows are rebuilt or move (Beam results, tabs reordering): follow the selected row, or re-measure the hovered one.
  const sync=()=>{if(mode==='selected'){const el=container.querySelector(selected);el?go(el):hide();}else if(target){if(!target.isConnected)hide();else go(target);}};
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(container,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-selected','class','hidden']});
  container.addEventListener('scroll',()=>{if(target)go(target);},{passive:true});addEventListener('resize',()=>{if(target)go(target);});
  sync();return container.prismHitbox={go,hide,pill,target:()=>target};}
 window.PrismHitbox={attach};
})();
