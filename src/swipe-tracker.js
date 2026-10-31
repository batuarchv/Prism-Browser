// Two-finger trackpad swipes from wheel events, shared by the page swipe (gesture-preload.cjs, built in by
// scripts/build-preload.cjs) and the sidebar space swipe (sidebar-ui.js). Wheel events carry no finger phase, so:
// a pause of GAP ms starts a new gesture; the first few pixels lock it to an axis; the content follows the fingers
// (offset = −ΣdeltaX: positive when the fingers move right; callers flip deltaX when natural scrolling is off); and the
// fingers are taken as lifted when the deltas start decaying like macOS momentum, or stop. It then commits on distance,
// or on a quick flick.
// 0.39.3: a gesture that only ever decays is the tail of an earlier swipe's momentum (for instance arriving on the page
// that swipe just went back to) and never commits, so one flick can't go back twice; and the fingers count as resting
// only after QUIET ms without events, so a busy renderer doesn't end a swipe halfway.
(function(root){
 const GAP=220,LOCK=6,QUIET=120,EAGER=1.75;
 function createSwipe({threshold=90,flick=.9,accept=()=>true,start=()=>{},move=()=>{},end=()=>{}}={}){
  let state='idle',ax=0,ay=0,offset=0,last=-Infinity,samples=[],timer=0,peak=0,lastAbs=0,prevX=0,steady=0,fingers=false;
  function release(){if(state!=='track')return;clearTimeout(timer);state='done';
   const now=samples.length?samples[samples.length-1][0]:0,recent=samples.filter(([t])=>t>=now-70&&t<=now),v=recent.length>1?recent.reduce((s,[,d])=>s+d,0)/Math.max(16,now-recent[0][0]):0;
   const dir=Math.sign(offset),commit=fingers&&(Math.abs(offset)>=threshold||(Math.abs(v)>flick&&Math.sign(v)===dir&&Math.abs(offset)>=threshold*.25));
   end(commit?dir:0,offset,v);}
  // Momentum: the last five deltas shrink smoothly (each 60–98.5% of the one before) well below the peak, so fingers
  // that only slow down for a moment are not taken as lifted.
  // 0.44: four shrinking deltas are enough (was five), so a flick goes about 16 ms sooner.
  function decaying(){if(samples.length<5)return false;const d=samples.slice(-4).map(([,x])=>Math.abs(x));
   for(let i=1;i<4;i++){const r=d[i]/(d[i-1]||1);if(!(r<.985&&r>.6))return false;}return d[3]<peak*.7;}
  // Fingers on the trackpad: the deltas clearly grow at some point, or hold steady for a few events. Momentum only shrinks.
  function note(dx){const a=Math.abs(dx);if(!a)return;if(prevX){if(a>prevX+Math.max(1,prevX*.05))fingers=true;steady=a>=prevX*.985?steady+1:0;if(steady>=3)fingers=true;}prevX=a;}
  function feed({deltaX=0,deltaY=0,timeStamp=performance.now()}={}){
   // A new swipe can start while the last one's momentum is still arriving (no pause between them): momentum only
   // ever shrinks, so deltas that suddenly grow again are fingers back on the trackpad.
   const abs=Math.abs(deltaX)+Math.abs(deltaY),regrow=state==='done'&&abs>=4&&abs>lastAbs*1.8;lastAbs=abs;
   if(timeStamp-last>GAP||regrow){if(state==='track')release();state='pending';ax=ay=offset=peak=prevX=steady=0;fingers=regrow;samples=[];}
   last=timeStamp;
   if(state==='pending'){ax+=deltaX;ay+=deltaY;note(deltaX);if(Math.abs(ax)+Math.abs(ay)<LOCK)return state;
    if(Math.abs(ax)>Math.abs(ay)*1.2&&accept(Math.sign(-ax))){state='track';offset=-ax;peak=Math.abs(ax);samples=[[timeStamp,-ax]];start(offset);move(offset);clearTimeout(timer);timer=setTimeout(release,QUIET);}else state='skip';return state;}
   if(state!=='track')return state;
   offset-=deltaX;note(deltaX);samples.push([timeStamp,-deltaX]);if(samples.length>24)samples.shift();peak=Math.max(peak,Math.abs(deltaX));move(offset);
   // 0.44: a swipe that is clearly past the line goes at once, without waiting for the fingers to lift.
   clearTimeout(timer);if(decaying()||(fingers&&Math.abs(offset)>=threshold*EAGER))release();else timer=setTimeout(release,QUIET);return state==='done'?'track':state;}
  return {feed,get state(){return state;},cancel(){clearTimeout(timer);state='done';}};
 }
 const api={createSwipe};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PrismSwipe=api;
})(typeof window!=='undefined'?window:globalThis);
