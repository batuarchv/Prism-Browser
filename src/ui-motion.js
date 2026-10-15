// One-shot transform/opacity animations: no idle loop or retained page snapshots.
const uiMotion=(()=>{
 let signature;const running=new Set(),media=matchMedia('(prefers-reduced-motion: reduce)');
 const reduced=()=>media.matches||!!state?.settings.reduceMotion;
 function stop(){for(const a of running)a.cancel();running.clear();}
 media.addEventListener('change',()=>{if(reduced())stop();});
 function nodes(){return [...document.querySelectorAll('#tabs [data-motion-id],#favorites [data-motion-id],#bookmarks [data-motion-id]')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight;}).slice(0,150);}
 function before(next){if(next.settings.reduceMotion)stop();const key=JSON.stringify([next.tabs.map(t=>[t.id,t.pinned,t.favoriteId]),next.bookmarks.map(b=>[b.id,b.favorite,b.folder]),next.folders]);if(key===signature)return null;const initial=signature===undefined;signature=key;if(initial||toolMode||reduced())return null;return new Map(nodes().map(el=>[el.dataset.motionId,{left:el.getBoundingClientRect().left,top:el.getBoundingClientRect().top,pinned:el.classList.contains('pinned')}]));}
 function after(previous){if(!previous||reduced())return;stop();const frames=nodes().map(el=>{const old=previous.get(el.dataset.motionId),r=el.getBoundingClientRect();return {el,old,dx:old?old.left-r.left:0,dy:old?old.top-r.top:0};});for(const {el,old,dx,dy}of frames){const pinChanged=old&&old.pinned!==el.classList.contains('pinned');if(old&&!pinChanged&&Math.abs(dx)<1&&Math.abs(dy)<1)continue;const a=el.animate(old?[{transform:`translate(${dx}px,${dy}px) scale(${pinChanged?'.98':'1'})`},{transform:'translate(0,0)'}]:[{opacity:0,transform:'translateY(5px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:old?190:160,easing:'cubic-bezier(.2,.7,.2,1)'});running.add(a);a.onfinish=a.oncancel=()=>running.delete(a);}}
 return {before,after};
})();
