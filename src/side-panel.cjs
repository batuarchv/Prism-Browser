// Docked extension side panels (chrome.sidePanel). The panel is a WebContentsView beside the page; main.cjs reserves
// its width in layout() and the renderer draws its header (icon, name, close) and the resize edge.
const {WebContentsView}=require('electron');
const {createSidePanelState}=require('./side-panel-state.cjs');
const HEADER=34,GAP=6;

function createSidePanels({ses,window,settings,saveSettings,emit,layout,activeTabId,router}){
 const state=createSidePanelState(settings.sidePanels||{}),views=new Map();let current=null,resizing=null;
 const persist=()=>{settings.sidePanels=state.serialize();saveSettings();};
 const manifestDefault=e=>{const p=e?.manifest?.side_panel?.default_path;state.setDefault(e.id,p);};
 const extensions=ses.extensions||ses;for(const e of extensions.getAllExtensions())manifestDefault(e);
 extensions.on('extension-loaded',(_event,e)=>{manifestDefault(e);emit();});
 extensions.on('extension-unloaded',(_event,e)=>{state.close(e.id);dropViews(e.id);refresh();});
 const canUse=e=>!!(e&&(e.manifest?.side_panel||e.manifest?.permissions?.includes('sidePanel')));
 const loaded=id=>{const e=extensions.getExtension(id);return canUse(e)?e:null;};
 function dropViews(id){for(const [key,view] of views)if(!id||key.startsWith(id+'|')){try{window()?.contentView.removeChildView(view);}catch{}if(!view.webContents.isDestroyed())view.webContents.close();views.delete(key);}}
 function viewFor(r){
  const e=loaded(r.extensionId);if(!e)return null;const url=new URL(r.path,e.url.endsWith('/')?e.url:e.url+'/');if(url.protocol!=='chrome-extension:'||url.hostname!==e.id)return null;
  let view=views.get(r.key);
  if(!view){view=new WebContentsView({webPreferences:{session:ses,sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,allowRunningInsecureContent:false}});view.setBorderRadius(10);view.setVisible(false);views.set(r.key,view);window().contentView.addChildView(view);
   const wc=view.webContents;
   // Links from the panel open as tabs; the panel itself never leaves its extension.
   wc.setWindowOpenHandler(({url})=>{if(/^https?:\/\//i.test(url))openTab?.(url);return {action:'deny'};});
   wc.on('will-navigate',(event,destination)=>{if(!destination.startsWith('chrome-extension://'+e.id+'/'))event.preventDefault();});
   wc.on('render-process-gone',()=>{if(views.get(r.key)!==view)return;views.delete(r.key);try{window()?.contentView.removeChildView(view);}catch{}refresh();});}
  if(view._prismURL!==url.href){view._prismURL=url.href;view.webContents.loadURL(url.href).catch(()=>{});}
  return view;
 }
 let openTab=null;
 // Called after any change and on tab switches: shows the active tab's panel, hides every other one.
 function sync(){
  const tab=activeTabId(),r=tab<0?null:state.resolve(tab);const view=r?viewFor(r):null;current=view?{...r,view}:null;
  for(const v of views.values())if(v!==view&&v._prismVisible!==false){v.setVisible(false);v._prismVisible=false;}
 }
 function refresh(){sync();layout();emit();}
 // Reserved width for main.cjs's layout() and the panel's bounds inside the page area.
 function reserve(){return current?(resizing??state.width(current.extensionId))+GAP:0;}
 let top=44;
 function place(area,visible){top=area.y;if(!current)return;const width=resizing??state.width(current.extensionId),view=current.view;
  const bounds={x:area.x+area.width+GAP,y:area.y+HEADER,width,height:Math.max(1,area.height-HEADER)},key=JSON.stringify(bounds),show=visible&&resizing===null;
  if(view._prismBounds!==key){view.setBounds(bounds);view._prismBounds=key;}if(view._prismVisible!==show){view.setVisible(show);view._prismVisible=show;}}
 function open(id,where={}){if(!loaded(id))throw Error('This extension has no side panel.');state.open(id,where,activeTabId());refresh();}
 function close(id){state.close(id||current?.extensionId);refresh();}
 function toggle(id){if(state.isOpenFor(id,activeTabId()))close(id);else open(id);}
 const has=id=>!!loaded(id)&&state.has(id);

 const handle=router.apiHandler(),opts={permission:'sidePanel'};
 handle('sidePanel.setOptions',({extension},options={})=>{state.setOptions(extension.id,options);if(!Number.isInteger(options?.tabId))persist();refresh();},opts);
 handle('sidePanel.getOptions',({extension},options={})=>state.getOptions(extension.id,options?.tabId),opts);
 handle('sidePanel.setPanelBehavior',({extension},behavior={})=>{state.setBehavior(extension.id,behavior||{});persist();emit();},opts);
 handle('sidePanel.getPanelBehavior',({extension})=>state.getBehavior(extension.id),opts);
 handle('sidePanel.open',({extension},options={})=>{open(extension.id,{tabId:options?.tabId,windowId:options?.windowId});},opts);
 handle('sidePanel.close',({extension})=>{close(extension.id);},opts);

 return {state,sync,refresh,reserve,place,open,close,toggle,has,canUse:id=>!!loaded(id),
  behavior:id=>state.getBehavior(id),setOpenTab:fn=>{openTab=fn;},
  // Live resize: the view hides while the renderer drags its edge, then lands at the remembered width.
  resize:width=>{if(!current)return;resizing=state.setWidth(current.extensionId,width);layout();},
  finishResize:()=>{if(resizing===null)return;resizing=null;persist();layout();emit();},
  forgetTab:tabId=>{state.forgetTab(tabId);for(const [key,view] of views)if(key.endsWith('|tab:'+tabId)){try{window()?.contentView.removeChildView(view);}catch{}if(!view.webContents.isDestroyed())view.webContents.close();views.delete(key);}},
  snapshot:()=>current?{id:current.extensionId,width:resizing??state.width(current.extensionId),top,header:HEADER}:null,
  webContents:()=>current?.view.webContents||null,
  destroy:()=>{dropViews(null);current=null;}};
}
module.exports={createSidePanels,HEADER,GAP};
