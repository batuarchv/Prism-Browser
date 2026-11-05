const path=require('node:path');
// "Save password?" (0.50): a small Liquid Glass panel at the top right of the page, shown after a sign-in goes through.
// It is a borderless child window like the popovers, so the native glass can sit behind it (glass(host) sets it up).
// The person can change the username and password before saving, choose Never for this site, or let it go.
// One prompt at a time; a new one, a tab switch or 60 s without an answer closes the old one as "dismiss".
const WIDTH=344;
function createSavePrompt({BrowserWindow,ipcMain,parent,area,glass=()=>'none',timeoutMs=60000}){
 let host=null,ready=null,current=null,height=232,seq=0;
 function place(){if(!host||host.isDestroyed())return;const w=parent();if(!w||w.isDestroyed())return;const c=w.getContentBounds(),a=area()||{x:0,y:0,width:c.width,height:c.height};
  const x=c.x+Math.max(8,Math.round(a.x+a.width-WIDTH-12)),y=c.y+Math.round(a.y+10);host.setBounds({x,y,width:WIDTH,height});}
 function create(){
  host=new BrowserWindow({parent:parent(),show:false,frame:false,transparent:true,backgroundColor:'#00000000',hasShadow:true,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,hiddenInMissionControl:true,roundedCorners:true,acceptFirstMouse:true,focusable:true,width:WIDTH,height,...(process.platform==='darwin'?{type:'panel'}:{}),
   webPreferences:{preload:path.join(__dirname,'password-save-preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});
  host.setAlwaysOnTop(false);host.webContents.setWindowOpenHandler(()=>({action:'deny'}));host.webContents.on('will-navigate',e=>e.preventDefault());
  host.on('closed',()=>{host=null;ready=null;if(current){const c=current;current=null;c.resolve({action:'dismiss'});}});
  let material='none';try{material=glass(host)||'none';}catch{}
  ready=host.loadFile(path.join(__dirname,'password-save.html'),{query:{glass:/^Native/.test(material)?'1':'0'}}).catch(()=>{});}
 const own=event=>!!host&&!host.isDestroyed()&&event.sender===host.webContents;
 ipcMain.on('prism-save-answer',(event,value)=>{if(!own(event)||!current||value?.id!==current.id)return;const c=current;current=null;
  const action=['save','never','dismiss'].includes(value.action)?value.action:'dismiss';
  c.resolve(action==='save'?{action,username:String(value.username??'').slice(0,4096),password:String(value.password??'').slice(0,4096)}:{action});
  // Saved shows its check for a moment first; the page asks to hide once that has played.
  if(action!=='save')hide();});
 ipcMain.on('prism-save-hide',event=>{if(own(event)&&!current)hide();});
 ipcMain.on('prism-save-fit',(event,h)=>{if(!own(event)||!Number.isFinite(h))return;height=Math.max(150,Math.min(420,Math.round(h)));place();});
 function hide(){clearTimeout(hide.timer);if(host&&!host.isDestroyed()&&host.isVisible()){host.hide();const w=parent();if(w&&!w.isDestroyed()&&w.isVisible()&&!w.isMinimized())w.focus();}}
 function close(reason='dismiss'){if(current){const c=current;current=null;c.resolve({action:'dismiss',reason});}hide();}
 // details: {origin, username, password, update}. Resolves {action:'save', username, password} | {action:'never'} | {action:'dismiss'}.
 async function ask(details){close('replaced');if(!host||host.isDestroyed())create();const id=++seq;
  const answer=new Promise(resolve=>{current={id,resolve};});
  await ready;if(!current||current.id!==id||!host||host.isDestroyed())return answer;
  let site=details.origin;try{site=new URL(details.origin).hostname.replace(/^www\./,'');}catch{}
  host.webContents.send('prism-save-show',{id,site,username:details.username||'',password:details.password||'',update:!!details.update,dark:!!details.dark,reduceMotion:!!details.reduceMotion});
  place();host.showInactive();
  clearTimeout(hide.timer);hide.timer=setTimeout(()=>{if(current?.id===id)close('timeout');},timeoutMs);hide.timer.unref?.();
  return answer;}
 return {ask,close,place,visible:()=>!!current,window:()=>host};
}
module.exports={createSavePrompt,WIDTH};
