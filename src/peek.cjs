// Lens (0.32, a quick browser since 0.46): a link opens in a floating glass window over the page instead of replacing
// it. Shift-click any link, choose Open Link in Lens, or follow a link to another site from a pinned tab or favorite.
// Esc or a click on the page closes it; Open as tab keeps it. Lens is a small browser of its own: its address field
// takes an address or a search, and it has back, forward, reload and a clean Copy link. "Keep open" lifts it off the
// page into a Lens window (also ⌥⌘N, and links from other apps when that is chosen in Settings): a small glass window
// that stays when you click elsewhere, moves and resizes, remembers where it was, and can become a tab at any time.
// Only one Lens over the page exists at a time; Lens windows can be several. Each is destroyed when it closes.
const HEADER=46,INSET=8;
function peekBounds(content,area){
 const width=Math.round(Math.max(Math.min(area.width-48,1100),Math.min(area.width-16,480))),height=Math.round(Math.max(Math.min(area.height-40,area.height*.92),Math.min(area.height-16,360)));
 return {x:Math.round(content.x+area.x+(area.width-width)/2),y:Math.round(content.y+area.y+Math.max(8,(area.height-height)/2)),width,height};
}
// A Lens window: the saved place when it is still on a screen, otherwise the top right of the work area. Further
// windows step down and left so they never sit exactly on top of each other.
function windowBounds(work,saved,index=0){const fits=b=>b&&[b.x,b.y,b.width,b.height].every(Number.isFinite)&&b.width>=360&&b.height>=300&&b.x<work.x+work.width-40&&b.y<work.y+work.height-40&&b.x+b.width>work.x+40&&b.y>=work.y-4;
 const step=index*28,width=Math.min(500,work.width-32),height=Math.min(780,work.height-64);
 if(fits(saved))return {x:Math.round(saved.x-step),y:Math.round(saved.y+step),width:Math.round(saved.width),height:Math.round(saved.height)};
 return {x:Math.round(work.x+work.width-width-24-step),y:Math.round(work.y+32+step),width,height};}
// What the address field shows when it is not being edited: the host and the path, without the scheme or "www.".
function display(url){try{const u=new URL(url);if(!/^https?:$/.test(u.protocol))return '';const path=(u.pathname+u.search).replace(/\/$/,'');let shown=path;try{shown=decodeURI(path);}catch{}return u.host.replace(/^www\./,'')+(path.length>1?shown.slice(0,140):'');}catch{return '';}}
function createPeek({BrowserWindow,WebContentsView,screen,parent,pageArea,webPreferences,configure,openTab,surfaces,reduceMotion,dark,language=()=>'en',normalize=v=>v,cleanLink=v=>v,copy=()=>{},glass=()=>{},savedBounds=()=>null,saveBounds=()=>{}}){
 let current=null;const windows=new Set();
 const all=()=>[...(current?[current]:[]),...windows];
 function state(l){if(!l||l.win.isDestroyed())return;const wc=l.view.webContents;if(wc.isDestroyed())return;const url=wc.getURL();let host='';try{host=new URL(url).hostname.replace(/^www\./,'');}catch{}
  const blank=!/^https?:/.test(url);
  surfaces.send(l.win.webContents,{kind:l.kind,title:blank?'':wc.getTitle()||host,host,url:blank?'':url,display:blank?'':display(url),icon:l.icon||'',loading:wc.isLoading(),canBack:wc.navigationHistory.canGoBack(),canForward:wc.navigationHistory.canGoForward(),secure:url.startsWith('https:'),blank,dark:dark(),language:language()});}
 function place(l){if(!l||l.win.isDestroyed())return;const [w,h]=l.win.getContentSize();l.view.setBounds({x:INSET,y:HEADER,width:Math.max(1,w-INSET*2),height:Math.max(1,h-HEADER-INSET)});}
 function close(l=current){if(!l)return;if(l===current)current=null;windows.delete(l);if(l.kind==='window'&&!l.win.isDestroyed())saveBounds(l.win.getBounds());if(!l.win.isDestroyed())l.win.destroy();if(!l.view.webContents.isDestroyed())l.view.webContents.close();}
 function promote(l=current){if(!l)return;const url=l.view.webContents.getURL(),space=l.space;close(l);if(/^https?:/.test(url))openTab(url,space);}
 function go(l,input){const url=normalize(String(input||'').trim());if(!url)return;l.hidden=false;l.view.setVisible(true);l.view.webContents.loadURL(url).catch(()=>{});l.view.webContents.focus();}
 // Lifts the Lens over the page into a Lens window: same page, same history, now its own window.
 function detach(l=current){if(!l||l.kind==='window'||l.win.isDestroyed())return null;current=null;l.kind='window';windows.add(l);
  try{l.win.setParentWindow(null);}catch{}l.win.setMovable(true);l.win.setResizable(true);l.win.setMinimizable(true);l.win.setSkipTaskbar(false);
  const work=screen.getDisplayMatching(l.win.getBounds()).workArea,to=windowBounds(work,savedBounds(),windows.size-1);l.win.setBounds(to,!reduceMotion());setTimeout(()=>place(l),220);state(l);l.win.focus();return l;}
 function make(kind,space,bounds,url){
  const owner=parent();
  const win=new BrowserWindow({...(kind==='peek'&&owner?{parent:owner}:{}),...bounds,show:false,frame:false,transparent:true,backgroundColor:'#00000000',vibrancy:'popover',visualEffectState:'active',roundedCorners:true,hasShadow:true,resizable:kind==='window',movable:kind==='window',minimizable:kind==='window',maximizable:false,fullscreenable:false,skipTaskbar:kind==='peek',minWidth:360,minHeight:300,webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false}});
  const view=new WebContentsView({webPreferences:webPreferences(space)});view.setBorderRadius(10);view.setBackgroundColor('#ffffff');win.contentView.addChildView(view);
  const l={kind,win,view,space,icon:''};place(l);glass(win);
  surfaces.register(win.webContents,{command:(name,value)=>{if(!all().includes(l))return;const nav=view.webContents.navigationHistory;
   if(name==='close')close(l);else if(name==='tab')promote(l);else if(name==='detach')detach(l);
   else if(name==='back'&&nav.canGoBack())nav.goBack();else if(name==='forward'&&nav.canGoForward())nav.goForward();
   else if(name==='reload'){if(view.webContents.isLoading())view.webContents.stop();else view.webContents.reload();}
   else if(name==='go'&&typeof value==='string'&&value.length<8192)go(l,value);
   else if(name==='copy'){const url=view.webContents.getURL();if(/^https?:/.test(url))copy(cleanLink(url)||url);}
   else if(name==='ready')state(l);}});
  const wc=view.webContents;configure(wc,space);
  wc.setWindowOpenHandler(({url})=>{if(/^https?:\/\//i.test(url))openTab(url,space);return {action:'deny'};});
  for(const event of ['did-start-loading','did-stop-loading','page-title-updated','did-navigate','did-navigate-in-page'])wc.on(event,()=>state(l));
  wc.on('page-favicon-updated',(_e,icons)=>{l.icon=/^https:\/\//.test(icons[0]||'')?icons[0]:'';state(l);});
  // Keys work the same whether the page or the Lens bar has focus.
  const keys=(event,input)=>{if(input.type!=='keyDown')return;const k=String(input.key||'').toLowerCase(),nav=wc.navigationHistory;let done=true;
   if(input.key==='Escape'&&!input.meta&&l.kind==='peek')close(l);else if(input.meta&&input.key==='Enter')promote(l);
   else if(input.meta&&!input.shift&&k==='l'){win.webContents.focus();surfaces.send(win.webContents,{focusAddress:true});}
   else if(input.meta&&!input.shift&&k==='w')close(l);else if(input.meta&&!input.shift&&k==='r')wc.reload();
   else if(input.meta&&input.key==='[')nav.canGoBack()&&nav.goBack();else if(input.meta&&input.key===']')nav.canGoForward()&&nav.goForward();
   else if(input.meta&&input.shift&&k==='c'){const url=wc.getURL();if(/^https?:/.test(url))copy(cleanLink(url)||url);}
   else done=false;if(done)event.preventDefault();};
  wc.on('before-input-event',keys);win.webContents.on('before-input-event',keys);
  wc.on('render-process-gone',()=>close(l));
  win.on('blur',()=>setTimeout(()=>{if(l.kind!=='peek'||current!==l||win.isDestroyed())return;if(owner?.isFocused())close(l);},0));
  win.once('closed',()=>{if(all().includes(l))close(l);});
  let timer;const remember=()=>{if(l.kind!=='window')return;clearTimeout(timer);timer=setTimeout(()=>{if(!win.isDestroyed())saveBounds(win.getBounds());},400);};
  win.on('resize',()=>{place(l);remember();});win.on('move',remember);
  win.loadFile(surfaces.page('peek.html')).catch(()=>{});
  if(url)wc.loadURL(url).catch(()=>{});else{l.hidden=true;view.setVisible(false);}
  return l;}
 // Lens over the page.
 function open(url,space){
  if(!/^https?:\/\//i.test(url))return false;const owner=parent();if(!owner||owner.isDestroyed())return false;
  if(current&&current.space===space){current.view.webContents.loadURL(url).catch(()=>{});current.win.focus();return true;}close();
  const area=pageArea();if(!area)return false;const bounds=peekBounds(owner.getContentBounds(),area),still=reduceMotion();
  const l=current=make('peek',space,bounds,url),{win,view}=l;
  win.once('ready-to-show',()=>{if(current!==l)return;if(still){win.show();return;}
   // A short native zoom from slightly smaller, the way macOS opens a popover window.
   const from={x:bounds.x+Math.round(bounds.width*.03),y:bounds.y+Math.round(bounds.height*.03),width:Math.round(bounds.width*.94),height:Math.round(bounds.height*.94)};win.setBounds(from);win.showInactive();win.setBounds(bounds,true);setTimeout(()=>{if(current===l&&!win.isDestroyed()){place(l);win.focus();view.webContents.focus();}},180);});
  return true;}
 // A Lens window (⌥⌘N, or a link from another app). With no address it opens with the address field ready.
 function openWindow(url,space){const owner=parent();const near=owner&&!owner.isDestroyed()?owner.getBounds():{...screen.getCursorScreenPoint(),width:1,height:1};
  const work=screen.getDisplayMatching(near).workArea;
  const l=make('window',space,windowBounds(work,savedBounds(),windows.size),/^https?:\/\//i.test(url||'')?url:'');windows.add(l);
  l.win.once('ready-to-show',()=>{if(!windows.has(l))return;l.win.show();l.win.focus();if(!l.hidden)l.view.webContents.focus();else{l.win.webContents.focus();surfaces.send(l.win.webContents,{focusAddress:true});}});
  return l;}
 function follow(){if(!current||current.win.isDestroyed())return;const owner=parent(),area=pageArea();if(!owner||!area)return;current.win.setBounds(peekBounds(owner.getContentBounds(),area));place(current);}
 function restyle(){for(const l of all())state(l);}
 return {open,openWindow,detach:()=>detach(),close:()=>close(),closeAll:()=>{for(const l of all())close(l);},promote:()=>promote(),follow,restyle,isOpen:()=>!!current,windows:()=>[...windows],url:()=>current?.view.webContents.getURL()||'',lens:()=>current};
}
module.exports={createPeek,peekBounds,windowBounds,display};
