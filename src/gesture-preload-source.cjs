// Two-finger swipe between pages, as in Safari and Chrome on macOS. The arrow appears at the edge as soon as the
// fingers move sideways and follows them; on release the page goes back (fingers right) or forward (fingers left) if
// the swipe went far enough or was a quick flick. A page that scrolls sideways under the pointer keeps the swipe.
// Built into gesture-preload.cjs with swipe-tracker.js (scripts/build-preload.cjs); registered for normal and Private
// tabs by main.cjs, which checks the setting, macOS "Swipe between pages" and the history, and navigates.
// Nothing is exposed to the page (isolated world).
const {ipcRenderer}=require('electron');
if(process.isMainFrame)(()=>{
 const THRESHOLD=80;
 let nav={enabled:false,back:false,forward:false,reduceMotion:false},host=null,bubble=null,shown=null;
 const paint=()=>{if(!host)return;if(/^#[0-9a-f]{6}$/i.test(nav.accent||''))host.style.setProperty('--accent',nav.accent);host.toggleAttribute('data-dark',!!nav.dark);};
 const refresh=()=>ipcRenderer.invoke('prism-swipe',{type:'query'}).then(r=>{if(r){nav=r;paint();}}).catch(()=>{});
 refresh();addEventListener('pageshow',refresh);addEventListener('popstate',refresh);addEventListener('hashchange',refresh);addEventListener('focus',refresh);
 // True when the element under the pointer (or an ancestor, or the page) can still scroll horizontally that way.
 function scrollsX(target,dx){
  const can=n=>dx>0?n.scrollLeft+n.clientWidth<n.scrollWidth-1:n.scrollLeft>0;
  for(let n=target instanceof Element?target:null;n;n=n.parentElement||(n.getRootNode() instanceof ShadowRoot?n.getRootNode().host:null)){
   if(n.scrollWidth>n.clientWidth+1&&/(auto|scroll|overlay)/.test(getComputedStyle(n).overflowX)&&can(n))return true;}
  const page=document.scrollingElement;return !!page&&page.scrollWidth>page.clientWidth+1&&can(page);
 }
 function ensure(){if(host?.isConnected)return;host=document.createElement('prism-swipe');const root=host.attachShadow({mode:'closed'});const sheet=new CSSStyleSheet();
  // 0.38.2: a small piece of liquid glass, tinted with the space's colour once releasing would navigate.
  sheet.replaceSync(`:host{all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647;--accent:#0a84ff}
   .b{position:absolute;top:50%;width:44px;height:44px;margin-top:-22px;border-radius:50%;display:grid;place-items:center;opacity:0;will-change:transform,opacity;color:#2c2d33;
    background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.38) 55%,rgba(255,255,255,.28));-webkit-backdrop-filter:blur(16px) saturate(1.7);backdrop-filter:blur(16px) saturate(1.7);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.9),inset 0 0 0 .5px rgba(255,255,255,.6),0 0 0 .5px rgba(0,0,0,.10),0 6px 18px rgba(0,0,0,.18);transition:background .14s,color .14s,box-shadow .14s}
   .b.on{color:#fff;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 78%,#fff),color-mix(in srgb,var(--accent) 94%,#000 6%));box-shadow:inset 0 1px 0 rgba(255,255,255,.55),inset 0 0 0 .5px rgba(255,255,255,.35),0 0 0 .5px color-mix(in srgb,var(--accent) 60%,#000),0 6px 22px color-mix(in srgb,var(--accent) 45%,transparent)}
   .b svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
   .b.forward svg{transform:scaleX(-1)}.b.out{transition:opacity .16s,transform .16s,background .14s}
   :host([data-dark]) .b{color:#f2f2f7;background:linear-gradient(180deg,rgba(255,255,255,.20),rgba(255,255,255,.08) 55%,rgba(255,255,255,.05));box-shadow:inset 0 1px 0 rgba(255,255,255,.28),inset 0 0 0 .5px rgba(255,255,255,.14),0 0 0 .5px rgba(0,0,0,.4),0 6px 18px rgba(0,0,0,.45)}
   :host([data-dark]) .b.on{color:#fff;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 85%,#fff),color-mix(in srgb,var(--accent) 90%,#000 10%))}`);
  root.adoptedStyleSheets=[sheet];paint();bubble=document.createElement('div');bubble.className='b';
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');svg.setAttribute('viewBox','0 0 24 24');path.setAttribute('d','M15 5l-7 7 7 7');svg.append(path);bubble.append(svg);root.append(bubble);document.documentElement.append(host);}
 const reduced=()=>nav.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 // The arrow slides in from its edge with the fingers and turns blue once releasing would navigate.
 function render(offset){const dir=offset>0?'back':'forward';if(!nav.enabled||!nav[dir]||!offset){hide();return;}
  ensure();const p=Math.min(1,Math.abs(offset)/THRESHOLD),x=reduced()?0:-52+60*Math.min(1.15,p);
  if(shown!==dir){bubble.className='b '+dir;bubble.style.left=dir==='back'?'0':'';bubble.style.right=dir==='forward'?'0':'';shown=dir;}
  bubble.style.transform=`translateX(${dir==='back'?x:-x}px) scale(${.85+.15*p})`;bubble.style.opacity=String(reduced()?(p>=1?1:.6):Math.min(1,p*2));bubble.classList.toggle('on',p>=1);}
 function hide(){if(!bubble||!shown)return;bubble.classList.add('out');bubble.style.opacity='0';const back=shown==='back';if(!reduced())bubble.style.transform=`translateX(${back?-52:52}px) scale(.85)`;shown=null;setTimeout(()=>bubble?.classList.remove('out'),180);}
 let target=null;
 const swipe=PrismSwipe.createSwipe({threshold:THRESHOLD,
  accept:dir=>nav.enabled&&!scrollsX(target,-dir),
  move:render,
  end:dir=>{const name=dir>0?'back':'forward';if(dir&&nav[name]){bubble?.classList.add('on');ipcRenderer.invoke('prism-swipe',{type:'go',dir:name}).catch(()=>{});}hide();setTimeout(refresh,300);}});
 addEventListener('wheel',event=>{
  if(!event.isTrusted||event.ctrlKey)return; // pinch-to-zoom arrives as ctrl+wheel
  target=event.target;if(event.defaultPrevented&&swipe.state==='pending'){swipe.cancel();return;} // the page handles the gesture
  swipe.feed(event);
 },{passive:true});
})();
