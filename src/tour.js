// "Show me around" (0.46): a short guided tour that points at the real controls, one at a time, with a glass card
// beside each. It follows the welcome guide the first time, and Help → Show Me Around, Beam or Settings bring it back.
// Steps whose control is hidden right now (a collapsed sidebar, no extensions) are skipped. Esc ends it, ← → move.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 // [target selector or '' for the page, title, text, shortcut keys]
 const steps=[
  ['#address-form','Address bar','Type an address or a search. On an article, Reader shows just the story.',['⌘ L','⇧⌘ R']],
  ['#protocol','Site controls and Prism Shield','See what Prism Shield blocked on this site, and set its permissions, zoom and more.',[]],
  ['#new','Beam','Open a page, find any tab, setting or action, or type a sum to get the answer.',['⌘ T']],
  ['#favorites','Favorites','Your everyday sites, one click away. Drag a tab here to add it.',[]],
  ['#tabs','Tabs','Idle tabs sleep to save memory. Tidy tabs archives the ones you haven’t used in half an hour, and Undo brings them back.',['⌥⌘ K','⌘ Z']],
  ['#space-picker','Spaces','Keep work and life apart, each with its own tabs and colors. Swipe with two fingers in the sidebar to switch.',['⌃ 1–9']],
  ['','Lens','Shift-click a link to peek at it without leaving the page. Keep open turns it into a small quick browser, and ⌥⌘N opens a new one.',['⇧ click','⌥⌘ N']],
  ['#extensions','Extensions','Add Chrome extensions and reach them here.',[]],
  ['#downloads','Downloads','Files you download appear here. Drag one straight into another app.',['⌘ J']],
  ['#settings','Settings','Make Prism yours. To keep a site in the Dock as its own app, choose File → Add to Dock. Help → Show Me Around brings this tour back.',['⌘ ,']]];
 const layer=document.createElement('div');layer.id='tour';layer.hidden=true;layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','tour-title');
 layer.innerHTML='<div class="tour-spot"></div><section class="tour-card"><p class="tour-count"></p><h2 id="tour-title"></h2><p class="tour-text"></p><div class="tour-keys"></div><footer><button type="button" class="tour-skip">Skip</button><button type="button" class="tour-back">Back</button><button type="button" class="tour-next primary">Next</button></footer></section>';
 document.body.append(layer);
 const spot=layer.querySelector('.tour-spot'),card=layer.querySelector('.tour-card');let index=0,shown=[];
 const visible=sel=>{if(!sel)return true;const el=document.querySelector(sel);if(!el||el.closest('[hidden]'))return false;const r=el.getBoundingClientRect();return r.width>4&&r.height>4&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight;};
 function place(){const [sel]=shown[index];const el=sel&&document.querySelector(sel);const pad=6;
  if(!el){spot.classList.add('page');const main=document.querySelector('main')?.getBoundingClientRect()||{left:0,top:0,width:innerWidth,height:innerHeight};Object.assign(spot.style,{left:main.left+40+'px',top:main.top+60+'px',width:Math.max(0,main.width-80)+'px',height:Math.max(0,main.height-120)+'px'});
   const w=card.offsetWidth,h=card.offsetHeight;Object.assign(card.style,{left:Math.round(main.left+(main.width-w)/2)+'px',top:Math.round(main.top+(main.height-h)/2)+'px'});return;}
  spot.classList.remove('page');const r=el.getBoundingClientRect(),box={left:r.left-pad,top:r.top-pad,width:r.width+pad*2,height:Math.min(r.height+pad*2,innerHeight-r.top-12)};
  Object.assign(spot.style,{left:box.left+'px',top:box.top+'px',width:box.width+'px',height:box.height+'px'});
  // Controls in the sidebar get the card on their right; toolbar controls get it underneath.
  const w=card.offsetWidth,h=card.offsetHeight,gap=14,side=document.getElementById('sidebar')?.contains(el)&&box.left+box.width+gap+w<innerWidth-12;
  let x=side?box.left+box.width+gap:box.left+box.width/2-w/2,y=side?box.top+Math.min(box.height,80)/2-h/2+10:box.top+box.height+gap;
  if(!side&&y+h>innerHeight-12)y=box.top-h-gap;x=Math.max(12,Math.min(innerWidth-w-12,x));y=Math.max(12,Math.min(innerHeight-h-12,y));
  Object.assign(card.style,{left:Math.round(x)+'px',top:Math.round(y)+'px'});}
 function draw(){const [,title,text,keys]=shown[index];layer.querySelector('.tour-count').textContent=t('{n} of {total}').replace('{n}',index+1).replace('{total}',shown.length);
  layer.querySelector('#tour-title').textContent=t(title);layer.querySelector('.tour-text').textContent=t(text);
  layer.querySelector('.tour-keys').replaceChildren(...keys.map(k=>Object.assign(document.createElement('kbd'),{textContent:k})));
  layer.querySelector('.tour-back').hidden=index===0;layer.querySelector('.tour-skip').hidden=index===shown.length-1;layer.querySelector('.tour-next').textContent=t(index===shown.length-1?'Done':'Next');
  card.classList.remove('arrive');void card.offsetWidth;card.classList.add('arrive');place();layer.querySelector('.tour-next').focus({focusVisible:false});}
 function start(){if(typeof onboardingOpen!=='undefined'&&onboardingOpen)return;if(typeof panel!=='undefined'&&panel&&typeof closePanel==='function')closePanel();if(typeof suggestionsOpen!=='undefined'&&suggestionsOpen&&typeof dismissSuggestions==='function')dismissSuggestions();
  shown=steps.filter(([sel])=>visible(sel));index=0;if(!shown.length)return;window.tourOpen=true;layer.hidden=false;
  for(const el of [document.querySelector('main'),document.getElementById('sidebar')])if(el)el.inert=true;if(typeof overlay==='function')overlay();draw();}
 function end(){if(layer.hidden)return;layer.hidden=true;window.tourOpen=false;for(const el of [document.querySelector('main'),document.getElementById('sidebar')])if(el)el.inert=false;if(typeof overlay==='function')overlay();act('set-setting',{key:'tourDone',value:true});}
 function move(delta){const next=index+delta;if(next<0)return;if(next>=shown.length)return end();index=next;draw();}
 layer.querySelector('.tour-next').onclick=()=>move(1);layer.querySelector('.tour-back').onclick=()=>move(-1);layer.querySelector('.tour-skip').onclick=end;
 layer.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();end();}else if(event.key==='ArrowRight'){event.preventDefault();move(1);}else if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
  else if(event.key==='Tab'){const els=[...card.querySelectorAll('button')].filter(b=>!b.hidden);const i=els.indexOf(document.activeElement);event.preventDefault();els[(i+(event.shiftKey?-1:1)+els.length)%els.length]?.focus();}});
 addEventListener('resize',()=>{if(!layer.hidden)place();});
 window.prism.onFeedback(({kind})=>{if(kind==='tour')start();});
 window.prismTour={start,end,isOpen:()=>!layer.hidden,steps:()=>shown.map(([sel,title])=>sel||title)};
})();
