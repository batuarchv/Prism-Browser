// Picture in Picture (0.32), made to feel like Safari's: the video floats in its own small rounded window above every
// app and space, snaps to the nearest corner when you let go, keeps its shape when you resize it, and shows its
// controls only while the pointer is over it. The tab's own page moves into that window (nothing is reloaded or
// copied), styled so only the video shows; returning puts the page back exactly as it was. One video at a time.
const MARGIN=16;
const PAGE_CSS=`html.prism-pip,html.prism-pip body{overflow:hidden!important;background:#000!important}
html.prism-pip *{visibility:hidden!important}
html.prism-pip [data-prism-pip],html.prism-pip [data-prism-pip] *{visibility:visible!important}
html.prism-pip [data-prism-pip]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;transform:none!important;z-index:2147483647!important;object-fit:contain!important;background:#000!important}`;
const PICK=`(()=>{const v=[...document.querySelectorAll('video')].filter(v=>v.readyState>0&&v.videoWidth>0&&!v.disablePictureInPicture).sort((a,b)=>(Number(!a.paused)-Number(!b.paused))||((b.clientWidth*b.clientHeight)-(a.clientWidth*a.clientHeight)))[0];if(!v)return null;
 v.setAttribute('data-prism-pip','');document.documentElement.classList.add('prism-pip');return {width:v.videoWidth,height:v.videoHeight,playing:!v.paused&&!v.ended};})()`;
const UNPICK=`(()=>{document.documentElement.classList.remove('prism-pip');for(const v of document.querySelectorAll('[data-prism-pip]'))v.removeAttribute('data-prism-pip');})()`;
const STATUS=`(()=>{const v=document.querySelector('video[data-prism-pip]');return v?{playing:!v.paused&&!v.ended,time:v.currentTime||0,duration:Number.isFinite(v.duration)?v.duration:0,muted:v.muted}:null;})()`;
const CONTROL=(command,value)=>`(()=>{const v=document.querySelector('video[data-prism-pip]');if(!v)return;const c=${JSON.stringify(command)},n=${JSON.stringify(Number(value)||0)};
 if(c==='toggle'){v.paused||v.ended?v.play().catch(()=>{}):v.pause();}else if(c==='pause')v.pause();else if(c==='mute')v.muted=!v.muted;else if(c==='skip')v.currentTime=Math.max(0,Math.min(Number.isFinite(v.duration)?v.duration:Infinity,v.currentTime+n));else if(c==='seek'&&Number.isFinite(v.duration))v.currentTime=Math.max(0,Math.min(1,n))*v.duration;})()`;
// The corner nearest to where the window was let go, inside the display's usable area.
function snapCorner(bounds,area,margin=MARGIN){const cx=bounds.x+bounds.width/2,cy=bounds.y+bounds.height/2;
 return {x:Math.round(cx<area.x+area.width/2?area.x+margin:area.x+area.width-bounds.width-margin),y:Math.round(cy<area.y+area.height/2?area.y+margin:area.y+area.height-bounds.height-margin),width:bounds.width,height:bounds.height};}
// Where a released window comes to rest (0.47, as macOS's own PiP): the release velocity carries it on (a flick
// crosses the screen), it snaps to the nearest corner, and a window thrown more than half past the left or right edge
// is tucked away with only a sliver showing. Returns the bounds, the corner and which side it is tucked on, if any.
const STASH=22;
function settle(bounds,area,velocity={},margin=MARGIN){const vx=Number(velocity.vx)||0,vy=Number(velocity.vy)||0,throwX=bounds.x+vx*.18,throwY=bounds.y+vy*.18;
 const cx=throwX+bounds.width/2,cy=throwY+bounds.height/2,right=cx>=area.x+area.width/2,bottom=cy>=area.y+area.height/2;
 const y=Math.round(bottom?area.y+area.height-bounds.height-margin:area.y+margin);
 if(cx<area.x||cx>area.x+area.width)return {bounds:{x:Math.round(right?area.x+area.width-STASH:area.x-bounds.width+STASH),y:Math.round(Math.max(area.y+margin,Math.min(area.y+area.height-bounds.height-margin,throwY))),width:bounds.width,height:bounds.height},corner:(bottom?'b':'t')+(right?'r':'l'),stashed:right?'right':'left'};
 return {bounds:{x:Math.round(right?area.x+area.width-bounds.width-margin:area.x+margin),y,width:bounds.width,height:bounds.height},corner:(bottom?'b':'t')+(right?'r':'l'),stashed:null};}
// The first window opens where the last one was left (corner and width), bottom right at first.
function startBounds(ratio,area,saved){const width=Math.round(Math.max(200,Math.min(area.width*.6,Number(saved?.width)||Math.max(260,Math.min(480,area.width*.26))))),height=Math.round(width/ratio),corner=/^[tb][lr]$/.test(saved?.corner||'')?saved.corner:'br';
 return {x:corner[1]==='r'?area.x+area.width-width-MARGIN:area.x+MARGIN,y:corner[0]==='b'?area.y+area.height-height-MARGIN:area.y+MARGIN,width,height};}
function createPip({BrowserWindow,WebContentsView,screen,parent,surfaces,detach,attachBack,onChange,reduceMotion,language=()=>'en',savedPlace=()=>null,savePlace=()=>{}}){
 let current=null;
 function send(){if(current&&!current.controls.webContents.isDestroyed())surfaces.send(current.controls.webContents,current.status);}
 async function poll(){const c=current;if(!c)return;const wc=c.tab.view?.webContents;if(!wc||wc.isDestroyed())return;try{const s=await wc.executeJavaScriptInIsolatedWorld(999,[{code:STATUS}]);if(current!==c)return;if(!s){end('return');return;}c.status={...c.status,...s,title:c.tab.customTitle||c.tab.title||''};send();}catch{}}
 function place(){const c=current;if(!c||c.win.isDestroyed())return;const [w,h]=c.win.getContentSize(),b={x:0,y:0,width:w,height:h};c.tab.view?.setBounds(b);c.controls.setBounds(b);}
 async function enter(tab,{auto=false}={}){
  const wc=tab?.view?.webContents;if(!wc||wc.isDestroyed()||tab.space==='private'&&auto)return false;
  if(current?.tab===tab)return true;if(current)await end('return');
  let video;try{video=await wc.executeJavaScriptInIsolatedWorld(999,[{code:PICK}]);}catch{return false;}
  if(!video||(auto&&!video.playing)){if(video)try{await wc.executeJavaScriptInIsolatedWorld(999,[{code:UNPICK}]);}catch{}return false;}
  const cssKey=await wc.insertCSS(PAGE_CSS,{cssOrigin:'user'}).catch(()=>null);
  const ratio=video.width&&video.height?video.width/video.height:16/9,owner=parent(),display=screen.getDisplayMatching(owner&&!owner.isDestroyed()?owner.getBounds():{x:0,y:0,width:1,height:1}),bounds=startBounds(ratio,display.workArea,savedPlace());
  const win=new BrowserWindow({...bounds,show:false,frame:false,transparent:true,backgroundColor:'#00000000',roundedCorners:true,hasShadow:true,alwaysOnTop:true,resizable:true,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,acceptFirstMouse:true,minWidth:200,minHeight:Math.round(200/ratio),title:'Picture in Picture',...(process.platform==='darwin'?{type:'panel'}:{}),webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});
  win.setAlwaysOnTop(true,'floating');win.setVisibleOnAllWorkspaces?.(true,{visibleOnFullScreen:true});win.setAspectRatio(ratio);
  const controls=new WebContentsView({webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false}});controls.setBackgroundColor('#00000000');controls.setBorderRadius(12);
  detach(tab);tab.pip=true;tab.view.setBorderRadius(12);win.contentView.addChildView(tab.view);win.contentView.addChildView(controls);
  const c={tab,win,controls,cssKey,timer:null,status:{playing:video.playing,time:0,duration:0,title:tab.customTitle||tab.title||'',reduceMotion:reduceMotion(),language:language()},drag:null};current=c;place();
  surfaces.register(controls.webContents,{command:(name,value)=>{if(current!==c)return;
   if(name==='return'||name==='close')end(name);
   else if(['toggle','mute','skip','seek'].includes(name)){wc.executeJavaScriptInIsolatedWorld(999,[{code:CONTROL(name,value)}],true).catch(()=>{});setTimeout(poll,120);}
   else if(name==='hover'){clearInterval(c.timer);c.timer=value?setInterval(poll,500):null;if(value)poll();}
   else if(name==='drag-start'&&Number.isFinite(value?.x)){const [x,y]=win.getPosition();c.drag={dx:value.x-x,dy:value.y-y};}
   else if(name==='drag'&&c.drag&&Number.isFinite(value?.x)){win.setPosition(Math.round(value.x-c.drag.dx),Math.round(value.y-c.drag.dy));}
   else if(name==='drag-end'&&c.drag){c.drag=null;const now=win.getBounds(),area=screen.getDisplayMatching(now).workArea,rest=settle(now,area,value||{});win.setBounds(rest.bounds,!reduceMotion());c.stashed=rest.stashed;c.status={...c.status,stashed:rest.stashed};send();if(!rest.stashed)savePlace({corner:rest.corner,width:rest.bounds.width});}
   // A tucked-away window comes back to the corner on its side when its sliver is clicked.
   else if(name==='unstash'&&c.stashed){const now=win.getBounds(),area=screen.getDisplayMatching(now).workArea,rest=settle({...now,x:c.stashed==='right'?area.x+area.width-now.width:area.x},area);win.setBounds(rest.bounds,!reduceMotion());c.stashed=null;c.status={...c.status,stashed:null};send();}
   else if(name==='ready'){poll();}}});
  let sized;win.on('resize',()=>{place();clearTimeout(sized);sized=setTimeout(()=>{if(!win.isDestroyed()&&!c.stashed){const b=win.getBounds(),area=screen.getDisplayMatching(b).workArea;savePlace({corner:settle(b,area).corner,width:b.width});}},600);});win.once('closed',()=>{if(current===c)end('close',true);});
  controls.webContents.loadFile(surfaces.page('pip.html')).catch(()=>{});
  win.once('ready-to-show',()=>{});win.showInactive();onChange();return true;
 }
 // 'return' puts the video back in its tab and shows that tab; 'close' pauses it and puts it back quietly.
 async function end(how='return',windowGone=false){
  const c=current;if(!c)return;current=null;clearInterval(c.timer);const tab=c.tab,view=tab.view,wc=view?.webContents;
  if(wc&&!wc.isDestroyed()){if(how==='close')await wc.executeJavaScriptInIsolatedWorld(999,[{code:CONTROL('pause')}]).catch(()=>{});await wc.executeJavaScriptInIsolatedWorld(999,[{code:UNPICK}]).catch(()=>{});if(c.cssKey)await wc.removeInsertedCSS(c.cssKey).catch(()=>{});}
  if(!windowGone&&!c.win.isDestroyed()){try{if(view)c.win.contentView.removeChildView(view);c.win.contentView.removeChildView(c.controls);}catch{}}
  if(!c.controls.webContents.isDestroyed())c.controls.webContents.close();tab.pip=false;
  if(view&&wc&&!wc.isDestroyed())attachBack(tab,how==='return');
  if(!windowGone&&!c.win.isDestroyed())c.win.destroy();onChange();
 }
 return {enter,end,active:()=>current?.tab||null,snapshot:()=>current?{tabId:current.tab.id,title:current.tab.customTitle||current.tab.title||''}:null};
}
module.exports={createPip,snapCorner,startBounds,settle};
