// Sidebar tabs: drag to reorder (the row lifts and follows the pointer, the others slide aside to show the slot, and on
// release it settles there), or drag it over the page to open it in split view: the page shows drop zones for the left,
// right, top and bottom; the middle just switches to the tab. Esc cancels. ⌥↑ and ⌥↓ move the focused tab.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const list=document.getElementById('tabs');if(!list)return;
 const tr=key=>window.prismLocale?.t?.(key)||key;
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;

 // Split drop zones, drawn over a picture of the page (the page itself is hidden while dragging).
 const zone=document.createElement('div');zone.id='split-drop';zone.hidden=true;zone.setAttribute('aria-hidden','true');
 const picture=document.createElement('img');picture.alt='';picture.draggable=false;
 const hint=document.createElement('div');hint.className='split-drop-zone';const hintLabel=document.createElement('span');hint.append(hintLabel);
 zone.append(picture,hint);document.body.append(zone);
 const LABELS={left:'Open on the left',right:'Open on the right',top:'Open on top',bottom:'Open below',center:'Open tab'};
 let split=null;
 async function begin(id){if(split)return;const s=split={id,side:null,ready:false,last:null};const r=await act('drag-split-begin');
  if(split!==s){act('drag-split-end');return;}if(!r?.area){cancel();return;}
  s.area=r.area;Object.assign(zone.style,{left:r.area.x+'px',top:r.area.y+'px',width:r.area.width+'px',height:r.area.height+'px'});
  if(r.image)picture.src=r.image;else picture.removeAttribute('src');zone.hidden=false;s.ready=true;if(s.last)over(s.last.x,s.last.y);}
 function sideAt(x,y){const a=split.area,rx=(x-a.x)/a.width,ry=(y-a.y)/a.height;if(rx<0||ry<0||rx>1||ry>1)return null;
  return rx<.3?'left':rx>.7?'right':ry<.3?'top':ry>.7?'bottom':'center';}
 function over(x,y){if(!split)return;split.last={x,y};if(!split.ready)return;const side=sideAt(x,y);if(side===split.side)return;split.side=side;
  hint.dataset.side=side||'';hintLabel.textContent=side?tr(LABELS[side]):'';}
 async function drop(){const s=split;split=null;zone.hidden=true;hint.dataset.side='';if(!s)return false;
  if(!s.ready||!s.side){act('drag-split-end');return false;}await act('split-drop',{id:s.id,side:s.side});return true;}
 function cancel(){const s=split;split=null;zone.hidden=true;hint.dataset.side='';if(s)act('drag-split-end');}
 const outside=x=>{const r=document.getElementById('sidebar')?.getBoundingClientRect();return !!r&&x>r.right+4;};
 window.prismSplitDrag={begin,over,drop,cancel,outside};

 // Reordering.
 let drag=null,suppressClick=false;
 const rows=()=>[...list.querySelectorAll(':scope > .tab')];
 function slotFor(y){let best=0,dist=Infinity;drag.rects.forEach((r,i)=>{const d=Math.abs(r.top+r.height/2-y);if(d<dist){dist=d;best=i;}});return best;}
 function layout(target){const order=drag.items.filter(el=>el!==drag.row);order.splice(target,0,drag.row);
  order.forEach((el,i)=>{if(el===drag.row)return;el.style.transform=`translateY(${drag.rects[i].top-drag.rects[drag.items.indexOf(el)].top}px)`;});drag.target=target;drag.order=order;}
 function resetOthers(){for(const el of drag.items)if(el!==drag.row)el.style.transform='';drag.target=drag.start;drag.order=drag.items;}
 function start(){drag.items=rows();drag.start=drag.items.indexOf(drag.row);drag.rects=drag.items.map(el=>el.getBoundingClientRect());drag.target=drag.start;drag.order=drag.items;drag.started=true;
  window.tabsDragging=true;list.setPointerCapture(drag.pointer);list.classList.add('reordering');drag.row.classList.add('lifted');window.addEventListener('keydown',onKey,true);}
 function clear(d){window.removeEventListener('keydown',onKey,true);list.classList.remove('reordering');for(const el of d.items){el.style.transform='';el.classList.remove('lifted','settling','to-split');el.style.removeProperty('--lift');}
  window.tabsDragging=false;tabKey='';renderTabs();}
 async function finish(commit){const d=drag;drag=null;if(!d)return;
  if(d.splitting){const opened=commit&&await drop();if(!opened)cancel();clear(d);return;}
  const slot=commit?d.rects[d.target]:d.rects[d.start],from=d.rects[d.start];if(!commit)for(const el of d.items)if(el!==d.row)el.style.transform='';
  d.row.classList.remove('lifted');d.row.classList.add('settling');d.row.style.setProperty('--lift',`translate(0px,${slot.top-from.top}px)`);
  const done=()=>{if(commit&&d.target!==d.start){const next=d.order[d.target+1];for(const el of d.order)list.append(el);act('tab-reorder',{id:Number(d.row.dataset.tabId),beforeId:next?Number(next.dataset.tabId):null});}clear(d);};
  if(reduced())done();else setTimeout(done,180);}
 function onKey(event){if(event.key==='Escape'&&drag){event.preventDefault();event.stopPropagation();if(drag.splitting){cancel();drag.splitting=false;}finish(false);}}
 list.addEventListener('pointerdown',event=>{const row=event.target.closest('.tab');if(!row||!list.contains(row)||event.button!==0||!row.dataset.tabId||event.target.closest('.tab-close,input'))return;
  drag={row,pointer:event.pointerId,x:event.clientX,y:event.clientY,started:false,splitting:false};});
 window.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.pointer)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.started){if(Math.hypot(dx,dy)<5)return;start();}
  if(outside(event.clientX)){if(!drag.splitting){drag.splitting=true;resetOthers();drag.row.classList.add('to-split');begin(Number(drag.row.dataset.tabId));}
   over(event.clientX,event.clientY);drag.row.style.setProperty('--lift',`translate(${dx}px,${dy}px) scale(.96)`);return;}
  if(drag.splitting){drag.splitting=false;drag.row.classList.remove('to-split');cancel();}
  drag.row.style.setProperty('--lift',`translate(${Math.max(-12,Math.min(12,dx))}px,${dy}px)`);const target=slotFor(event.clientY);if(target!==drag.target)layout(target);});
 const end=event=>{if(!drag||event.pointerId!==drag.pointer)return;if(drag.started){suppressClick=true;finish(event.type==='pointerup');}else drag=null;};
 // Window-level, because hiding the page for the drop zones can take the pointer capture away mid-drag.
 window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);window.addEventListener('blur',()=>{if(drag?.started)finish(false);});
 // The click that ends a drag must not select or close the tab.
 list.addEventListener('click',event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}},true);
 // Keyboard: ↑ ↓ Home End move between tabs, ⇧F10 or the menu key opens the tab menu, ⌥↑ / ⌥↓ move the focused tab.
 list.addEventListener('keydown',event=>{const main=event.target.closest?.('.tab-main');if(!main||event.altKey)return;const all=[...list.querySelectorAll('.tab .tab-main')],i=all.indexOf(main);
  if(event.key==='ContextMenu'||(event.shiftKey&&event.key==='F10')){event.preventDefault();act('tab-menu',Number(main.closest('.tab').dataset.tabId));return;}
  const next={ArrowUp:all[i-1],ArrowDown:all[i+1],Home:all[0],End:all.at(-1)}[event.key];if(next){event.preventDefault();next.focus();}});
 list.addEventListener('keydown',event=>{if(!event.altKey||!['ArrowUp','ArrowDown'].includes(event.key))return;const row=event.target.closest('.tab');if(!row)return;
  const all=rows(),i=all.indexOf(row),up=event.key==='ArrowUp';const target=up?all[i-1]:all[i+2];if(up&&!target)return;if(!up&&i>=all.length-1)return;
  event.preventDefault();const id=Number(row.dataset.tabId);window.prismRefocusTab=id;act('tab-reorder',{id,beforeId:target?Number(target.dataset.tabId):null});});
})();
