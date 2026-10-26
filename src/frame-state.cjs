// Whether a tab's embedded frames hold anything sleeping would lose: edited form fields, playing media or picture-in-picture.
// Ad, analytics and embed frames without such state no longer keep the whole tab awake.
const FRAME_STATE=`(()=>{const fields=[...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]),textarea,select')];
 const edited=fields.some(e=>e.type==='checkbox'||e.type==='radio'?e.checked!==e.defaultChecked:e.tagName==='SELECT'?[...e.options].some(o=>o.selected!==o.defaultSelected):e.value!==e.defaultValue);
 const editing=!!document.activeElement?.isContentEditable;
 return edited||editing||!!document.pictureInPictureElement||[...document.querySelectorAll('audio,video')].some(m=>!m.paused&&!m.ended);})()`;
async function framesHoldState(mainFrame,timeoutMs=800){
 const frames=(mainFrame?.framesInSubtree||[]).filter(f=>f!==mainFrame);
 const checks=frames.map(f=>Promise.race([Promise.resolve().then(()=>f.executeJavaScript(FRAME_STATE)).then(Boolean,()=>false),new Promise(r=>setTimeout(r,timeoutMs,true))]));
 return (await Promise.all(checks)).some(Boolean);
}
module.exports={framesHoldState,FRAME_STATE};
