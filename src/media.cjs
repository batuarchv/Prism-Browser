// Media in the sidebar (0.32): when a tab you have left is playing (or was, until you paused it there), the sidebar
// shows what it is with play/pause, ±10 seconds and picture in picture. Nothing is polled: the row is refreshed when
// the page starts or stops playing, and when you use it. Page scripts never see Prism; this runs in an isolated world.
const INFO=`(()=>{const media=[...document.querySelectorAll('video,audio')].filter(m=>m.readyState>0||!m.paused);
 const m=media.sort((a,b)=>(Number(!a.paused)-Number(!b.paused))||((b.clientWidth*b.clientHeight)-(a.clientWidth*a.clientHeight)))[0];if(!m)return null;
 const meta=navigator.mediaSession&&navigator.mediaSession.metadata;let art='';try{const list=meta&&meta.artwork||[];const best=[...list].sort((a,b)=>(parseInt(b.sizes)||0)-(parseInt(a.sizes)||0))[0];if(best&&/^https:/.test(new URL(best.src,location.href).href))art=new URL(best.src,location.href).href;}catch{}
 return {title:String(meta&&meta.title||'').slice(0,200),artist:String(meta&&meta.artist||'').slice(0,200),artwork:art.slice(0,2048),playing:!m.paused&&!m.ended,video:m instanceof HTMLVideoElement&&m.videoWidth>0,duration:Number.isFinite(m.duration)?m.duration:0,time:m.currentTime||0};})()`;
const CONTROL=command=>`(()=>{const media=[...document.querySelectorAll('video,audio')].filter(m=>m.readyState>0||!m.paused).sort((a,b)=>(Number(!a.paused)-Number(!b.paused))||((b.clientWidth*b.clientHeight)-(a.clientWidth*a.clientHeight)));const m=media[0];if(!m)return false;
 ${JSON.stringify(command)}==='toggle'?(m.paused||m.ended?m.play().catch(()=>{}):m.pause()):${JSON.stringify(command)}==='pause'?m.pause():m.currentTime=Math.max(0,Math.min(Number.isFinite(m.duration)?m.duration:Infinity,m.currentTime+(${JSON.stringify(command)}==='back'?-10:10)));return true;})()`;
function createMedia({tabs,activeId,visibleIds,emit}){
 let current=null;
 async function read(t){const wc=t?.view?.webContents;if(!wc||wc.isDestroyed())return null;try{return await wc.executeJavaScriptInIsolatedWorld(999,[{code:INFO}]);}catch{return null;}}
 // A tab started or stopped playing, or its page changed.
 async function update(t){if(!t)return;const info=await read(t);if(info&&(info.playing||current?.tabId===t.id)){current={tabId:t.id,...info};}else if(current?.tabId===t.id)current=null;emit();}
 function forget(id){if(current?.tabId===id){current=null;emit();}}
 async function control(command){const t=tabs().find(x=>x.id===current?.tabId);const wc=t?.view?.webContents;if(!wc||wc.isDestroyed()){current=null;emit();return;}
  if(command==='close'){try{await wc.executeJavaScriptInIsolatedWorld(999,[{code:CONTROL('pause')}]);}catch{}current=null;emit();return;}
  try{await wc.executeJavaScriptInIsolatedWorld(999,[{code:CONTROL(command)}],true);}catch{}setTimeout(()=>update(t),150);}
 // Shown only for a tab that is not in front, so the row never repeats the page you are looking at.
 function snapshot(){if(!current)return null;const t=tabs().find(x=>x.id===current.tabId);if(!t?.view||t.pip||t.space==='private'){return null;}if(visibleIds().includes(t.id))return null;
  return {tabId:t.id,title:current.title||t.customTitle||t.title||'',artist:current.artist||(()=>{try{return new URL(t.url).hostname.replace(/^www\./,'');}catch{return '';}})(),artwork:current.artwork,playing:current.playing,video:current.video,url:t.url};}
 return {update,forget,control,snapshot,tabId:()=>current?.tabId??null};
}
module.exports={createMedia};
