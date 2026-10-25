// Sidebar editing: inline tab rename (double-click or the tab menu), the "Organize tabs" and "Close all tabs" buttons.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const list=document.getElementById('tabs'),organize=document.getElementById('organize-tabs');if(!list)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 let editing=null;
 const rowFor=id=>list.querySelector(`[data-motion-id="tab-${id}"]`);
 function finish(commit){if(!editing)return;const {id,value,original}=editing;editing=null;const row=rowFor(id);if(row)row.draggable=true;
  // renderTabs() skips unchanged data, so its cache key is cleared to put the title back.
  if(commit&&value.trim()!==original)act('tab-rename',{id,title:value.trim()});else{tabKey='';renderTabs();}}
 function beginRename(id){
  const row=rowFor(id),title=row?.querySelector('.tab-title');if(!title)return;
  if(!editing||editing.id!==id)editing={id,value:title.textContent,original:title.textContent};
  const input=document.createElement('input');input.className='tab-rename';input.value=editing.value;input.maxLength=200;input.setAttribute('aria-label',t('Tab name'));input.spellcheck=false;
  row.draggable=false;row.querySelectorAll('[draggable]').forEach(el=>el.draggable=false);title.replaceWith(input);input.focus();input.select();
  for(const type of ['click','pointerdown','dblclick','dragstart'])input.addEventListener(type,event=>event.stopPropagation());
  input.addEventListener('input',()=>{if(editing)editing.value=input.value;});
  input.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Enter'){event.preventDefault();finish(true);}else if(event.key==='Escape'){event.preventDefault();finish(false);}});
  input.addEventListener('blur',()=>setTimeout(()=>{if(editing?.id===id&&document.activeElement!==input)finish(true);},0));
 }
 // The tab list is rebuilt on state changes; an edit in progress is restored with what has been typed so far.
 new MutationObserver(()=>{if(editing&&!list.querySelector('.tab-rename'))beginRename(editing.id);}).observe(list,{childList:true});
 list.addEventListener('dblclick',event=>{const row=event.target.closest('.tab');if(!row||event.target.closest('.tab-close'))return;const id=Number(row.dataset.motionId?.slice(4));if(Number.isInteger(id)){event.preventDefault();beginRename(id);}});
 window.prism.onRenameTab?.(id=>beginRename(id));
 if(organize){organize.replaceChildren(icon('sort'));organize.onclick=()=>act('tabs-tidy');}
 // Closes every unpinned tab in this space; the undo toast and ⇧⌘T bring them back.
 const closeAll=document.getElementById('close-all-tabs');if(closeAll){closeAll.replaceChildren(icon('close'));closeAll.onclick=()=>act('tabs-close',{mode:'all'});}
 // 0.39.2: a + right of Close all tabs opens a new tab, like the New tab row at the top.
 const plus=document.getElementById('section-new-tab');if(plus){plus.replaceChildren(icon('plus'));plus.onclick=()=>act('new');}
})();

// Favorites: native-style drag to reorder. The tile lifts and follows the pointer, the others slide aside to show
// the slot, and on release it settles there before the new order is saved. Esc returns it to where it started.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const grid=document.getElementById('favorites');if(!grid)return;
 let drag=null,suppressClick=false;
 const tiles=()=>[...grid.querySelectorAll(':scope > .favorite')];
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 function slotFor(x,y){let best=0,dist=Infinity;drag.rects.forEach((r,i)=>{const d=(r.left+r.width/2-x)**2+(r.top+r.height/2-y)**2;if(d<dist){dist=d;best=i;}});return best;}
 // Every tile is moved with a transform from its own starting rect to the rect of its slot in the new order.
 function layout(target){const order=drag.items.filter(el=>el!==drag.el);order.splice(target,0,drag.el);
  order.forEach((el,i)=>{if(el===drag.el)return;const from=drag.rects[drag.items.indexOf(el)],to=drag.rects[i];el.style.transform=`translate(${to.left-from.left}px,${to.top-from.top}px)`;});drag.target=target;drag.order=order;}
 function finish(commit){const d=drag;drag=null;if(!d)return;window.removeEventListener('keydown',onKey,true);
  const slot=commit?d.rects[d.target]:d.rects[d.start],from=d.rects[d.start];d.el.classList.remove('lifted');d.el.classList.add('settling');
  d.el.style.setProperty('--lift',`translate(${slot.left-from.left}px,${slot.top-from.top}px)`);if(!commit)for(const el of d.items)if(el!==d.el)el.style.transform='';
  const done=()=>{grid.classList.remove('reordering');if(commit&&d.target!==d.start)for(const el of d.order)grid.append(el);for(const el of d.items){el.style.transition='none';el.style.transform='';el.style.removeProperty('--lift');el.classList.remove('settling');}grid.offsetWidth;for(const el of d.items)el.style.transition='';window.favoritesDragging=false;renderLibrary();
   if(commit&&d.target!==d.start){const next=d.order[d.target+1];act('bookmark-move',{id:d.el.dataset.favoriteId,beforeId:next?.dataset.favoriteId??null,favorite:true});}};
  if(reduced())done();else setTimeout(done,200);}
 function onKey(event){if(event.key==='Escape'&&drag){event.preventDefault();event.stopPropagation();finish(false);}}
 grid.addEventListener('pointerdown',event=>{const el=event.target.closest('.favorite');if(!el||event.button!==0||!grid.contains(el))return;
  drag={el,pointer:event.pointerId,x:event.clientX,y:event.clientY,started:false};});
 grid.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.pointer)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.started){if(Math.hypot(dx,dy)<4)return;drag.items=tiles();drag.start=drag.items.indexOf(drag.el);drag.rects=drag.items.map(el=>el.getBoundingClientRect());drag.target=drag.start;drag.order=drag.items;drag.started=true;
   window.favoritesDragging=true;grid.setPointerCapture(event.pointerId);grid.classList.add('reordering');drag.el.classList.add('lifted');window.addEventListener('keydown',onKey,true);}
  drag.el.style.setProperty('--lift',`translate(${dx}px,${dy}px) scale(1.05)`);const target=slotFor(event.clientX,event.clientY);if(target!==drag.target)layout(target);});
 const end=event=>{if(!drag||event.pointerId!==drag.pointer)return;if(drag.started){suppressClick=true;finish(event.type==='pointerup');}else drag=null;};
 grid.addEventListener('pointerup',end);grid.addEventListener('pointercancel',end);grid.addEventListener('lostpointercapture',event=>{if(drag?.started&&event.pointerId===drag.pointer)finish(false);});
 // The click that ends a drag must not open the favorite.
 grid.addEventListener('click',event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}},true);
 // Favorites reorder with this gesture instead of the browser's drag image; other lists still use native drag and drop.
 new MutationObserver(()=>{for(const el of tiles())el.draggable=false;if(drag?.started&&!drag.el.isConnected)drag=null;}).observe(grid,{childList:true});for(const el of tiles())el.draggable=false;
})();
// Switching profiles (spaces) slides the sidebar. From the switcher or the logo it swipes like the welcome guide: a
// space further down comes in from the left moving right, an earlier one from the right, and the glass logo in the
// corner turns 60° in 3D (back the other way for an earlier space). Without WebGL the flat logo flips once instead.
// After a trackpad swipe (below) the new space carries on in the direction of the fingers instead.
(()=>{if(new URLSearchParams(location.search).has('tool'))return;let current=null;
 window.prism.onState(s=>{if(current===null){current=s.space;return;}if(s.space===current)return;
  const order=[...($('space-picker')?.options||[])].map(o=>o.value),swiped=window.prismSpaceSwipe;window.prismSpaceSwipe=null;
  const dir=swiped?swiped.dir:order.indexOf(s.space)>=order.indexOf(current)?1:-1;current=s.space;
  const reduced=document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list=document.querySelector('#sidebar .sidebar-scroll'),logo=document.querySelector('.space-switcher .space-logo');
  for(const a of list?.getAnimations()||[])a.cancel();
  if(swiped&&list&&!reduced)list.animate([{opacity:.4,transform:`translateX(${-dir*swiped.width}px)`},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'});
  else list?.animate(reduced?[{opacity:0},{opacity:1}]:[{opacity:0,transform:`translateX(${-dir*40}px)`},{opacity:1,transform:'none'}],{duration:reduced?160:320,easing:'cubic-bezier(.2,.9,.3,1.06)'});
  if(window.prismSpaceLogo&&logo?.dataset.glass){window.prismSpaceLogo.turn(dir*Math.PI/3);return;}
  logo?.animate(reduced?[{opacity:.4},{opacity:1}]:[{transform:'perspective(200px) rotateY(0) scale(1)'},{transform:`perspective(200px) rotateY(${dir*180}deg) scale(.86)`,offset:.5},{transform:`perspective(200px) rotateY(${dir*360}deg) scale(1)`}],{duration:reduced?160:420,easing:'cubic-bezier(.3,.7,.2,1)'});
 });
})();
// Two-finger swipe on the sidebar switches spaces like swiping between desktops on macOS: the tab list follows the
// fingers 1:1 (with a rubber band past the first and last space); on release a long enough swipe or a flick slides on
// to the neighbouring space (fingers left: the next one in the switcher, fingers right: the previous one), otherwise
// it springs back. Vertical scrolling of the tab list is left alone; Trackpad gestures in Settings turns it off.
(()=>{if(new URLSearchParams(location.search).has('tool'))return;const side=document.getElementById('sidebar');if(!side)return;
 let state=null,list=null,width=260,pending=null;window.prism.onState(s=>{state=s;if(pending&&s.space===pending.id)pending=null;});
 const here=()=>pending&&performance.now()-pending.at<1500?pending.id:state.space;
 const order=()=>[...$('space-picker').options].map(o=>o.value),neighbour=offset=>{const o=order();return o[o.indexOf(here())+(offset<0?1:-1)];};
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const place=offset=>{if(!list)return;const x=neighbour(offset)?offset:Math.sign(offset)*Math.pow(Math.abs(offset),.7)*1.6;list.style.transform=x?`translateX(${x}px)`:'';list.style.opacity=String(1-Math.min(.55,Math.abs(x)/width*.8));};
 const swipe=PrismSwipe.createSwipe({threshold:70,
  accept:()=>!!state?.settings.trackpadGestures,
  start:()=>{list=document.querySelector('#sidebar .sidebar-scroll');width=side.clientWidth||260;for(const a of list?.getAnimations()||[])a.cancel();},
  move:offset=>{if(!reduced())place(offset);},
  end:(dir,offset)=>{const next=dir?neighbour(offset):null,el=list;list=null;if(!el)return;
   const from=el.style.transform||'translateX(0)',fromOpacity=el.style.opacity||'1';el.style.transform='';el.style.opacity='';
   if(next){window.prismSpaceSwipe={dir:Math.sign(offset),width:width*.6}; // the new space comes in from the side the fingers left
    if(reduced()){act('space',next);return;}
    pending={id:next,at:performance.now()};const out=el.animate([{transform:from,opacity:fromOpacity},{transform:`translateX(${Math.sign(offset)*width*.6}px)`,opacity:.2}],{duration:110,easing:'ease-in',fill:'forwards'});
    out.finished.then(()=>{act('space',next);setTimeout(()=>{if(out.playState==='finished')out.cancel();},800);},()=>{pending=null;});}
   else if(from!=='translateX(0)')el.animate([{transform:from,opacity:fromOpacity},{transform:'none',opacity:1}],{duration:240,easing:'cubic-bezier(.2,.9,.3,1.1)'});}});
 side.addEventListener('wheel',event=>{if(event.ctrlKey||event.target.closest('input,textarea,select,[contenteditable]'))return;
  if(swipe.feed(event)==='track')event.preventDefault();},{passive:false});
})();
