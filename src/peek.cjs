// Peek (0.32): a link opens in a floating glass window over the page instead of replacing it. Shift-click any link,
// choose Open Link in Peek, or follow a link to another site from a pinned tab or favorite. Esc or a click on the page
// closes it; Open as Tab keeps it. Only one Peek exists at a time and it is destroyed when it closes, so nothing stays
// in memory. It is a child window of Prism's window, so it moves with it and gets the native macOS shadow and material.
const HEADER=44,INSET=8;
function peekBounds(content,area){
 const width=Math.round(Math.max(Math.min(area.width-48,1100),Math.min(area.width-16,480))),height=Math.round(Math.max(Math.min(area.height-40,area.height*.92),Math.min(area.height-16,360)));
 return {x:Math.round(content.x+area.x+(area.width-width)/2),y:Math.round(content.y+area.y+Math.max(8,(area.height-height)/2)),width,height};
}
function createPeek({BrowserWindow,WebContentsView,parent,pageArea,webPreferences,configure,openTab,surfaces,reduceMotion,dark,language=()=>'en'}){
 let current=null;
 function state(){if(!current)return;const wc=current.view.webContents;if(wc.isDestroyed())return;let host='';try{host=new URL(wc.getURL()).hostname.replace(/^www\./,'');}catch{}
  surfaces.send(current.win.webContents,{title:wc.getTitle()||host,host,icon:current.icon||'',loading:wc.isLoading(),canBack:wc.navigationHistory.canGoBack(),secure:wc.getURL().startsWith('https:'),dark:dark(),language:language()});}
 function place(){if(!current||current.win.isDestroyed())return;const [w,h]=current.win.getContentSize();current.view.setBounds({x:INSET,y:HEADER,width:Math.max(1,w-INSET*2),height:Math.max(1,h-HEADER-INSET)});}
 function close(){const c=current;current=null;if(!c)return;if(!c.win.isDestroyed())c.win.destroy();if(!c.view.webContents.isDestroyed())c.view.webContents.close();}
 function promote(){if(!current)return;const url=current.view.webContents.getURL(),space=current.space;close();if(/^https?:/.test(url))openTab(url,space);}
 function open(url,space){
  if(!/^https?:\/\//i.test(url))return false;const owner=parent();if(!owner||owner.isDestroyed())return false;
  if(current&&current.space===space){current.view.webContents.loadURL(url).catch(()=>{});current.win.focus();return true;}close();
  const area=pageArea();if(!area)return false;const bounds=peekBounds(owner.getContentBounds(),area),still=reduceMotion();
  const win=new BrowserWindow({parent:owner,...bounds,show:false,frame:false,transparent:true,backgroundColor:'#00000000',vibrancy:'popover',visualEffectState:'active',roundedCorners:true,hasShadow:true,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false}});
  const view=new WebContentsView({webPreferences:webPreferences(space)});view.setBorderRadius(10);view.setBackgroundColor('#ffffff');win.contentView.addChildView(view);
  current={win,view,space,icon:''};const mine=current;place();
  surfaces.register(win.webContents,{command:name=>{if(current!==mine)return;if(name==='close')close();else if(name==='tab')promote();else if(name==='back'&&view.webContents.navigationHistory.canGoBack())view.webContents.navigationHistory.goBack();else if(name==='ready')state();}});
  const wc=view.webContents;configure(wc,space);
  wc.setWindowOpenHandler(({url})=>{if(/^https?:\/\//i.test(url))openTab(url,space);return {action:'deny'};});
  for(const event of ['did-start-loading','did-stop-loading','page-title-updated','did-navigate','did-navigate-in-page'])wc.on(event,state);
  wc.on('page-favicon-updated',(_e,icons)=>{if(current===mine){mine.icon=/^https:\/\//.test(icons[0]||'')?icons[0]:'';state();}});
  const keys=(event,input)=>{if(input.type!=='keyDown')return;if(input.key==='Escape'&&!input.meta){event.preventDefault();close();}else if(input.meta&&input.key==='Enter'){event.preventDefault();promote();}};
  wc.on('before-input-event',keys);win.webContents.on('before-input-event',keys);
  wc.on('render-process-gone',()=>{if(current===mine)close();});
  win.on('blur',()=>setTimeout(()=>{if(current!==mine||win.isDestroyed())return;if(owner.isFocused())close();},0));
  win.once('closed',()=>{if(current===mine)close();});
  win.loadFile(surfaces.page('peek.html')).catch(()=>{});
  win.once('ready-to-show',()=>{if(current!==mine)return;if(still){win.show();return;}
   // A short native zoom from slightly smaller, the way macOS opens a popover window.
   const from={x:bounds.x+Math.round(bounds.width*.03),y:bounds.y+Math.round(bounds.height*.03),width:Math.round(bounds.width*.94),height:Math.round(bounds.height*.94)};win.setBounds(from);win.showInactive();win.setBounds(bounds,true);setTimeout(()=>{if(current===mine&&!win.isDestroyed()){place();win.focus();wc.focus();}},180);});
  win.on('resize',place);wc.loadURL(url).catch(()=>{});return true;
 }
 function follow(){if(!current||current.win.isDestroyed())return;const owner=parent(),area=pageArea();if(!owner||!area)return;current.win.setBounds(peekBounds(owner.getContentBounds(),area));place();}
 return {open,close,promote,follow,isOpen:()=>!!current,url:()=>current?.view.webContents.getURL()||''};
}
module.exports={createPeek,peekBounds};
