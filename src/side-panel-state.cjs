// chrome.sidePanel rules kept free of Electron so they are unit-tested. Mirrors Chrome: options are global or per tab
// (a tab's own options win), a panel opened for a tab stays with that tab, one opened for the window follows every tab
// that has no panel of its own, and openPanelOnActionClick makes the toolbar icon toggle the panel.
const MIN_WIDTH=280,MAX_WIDTH=640,DEFAULT_WIDTH=360;
const clampWidth=w=>Math.round(Math.max(MIN_WIDTH,Math.min(MAX_WIDTH,Number(w)||DEFAULT_WIDTH)));

// Panel paths stay inside the extension: relative paths only, no scheme, no "//host", no escaping "..".
function safePath(value){
 if(typeof value!=='string'||/^\s*[\/\\]{2}/.test(value))return null;const p=value.trim().replace(/^\/+/,'');
 if(!p||p.length>2048||/^[a-z][a-z0-9+.-]*:/i.test(p)||p.startsWith('\\')||/(^|\/)\.\.(\/|$)/.test(p.split(/[?#]/)[0]))return null;return p;
}

function createSidePanelState(saved={}){
 // global: extId -> {path?, enabled?}; byTab: extId -> Map(tabId -> {path?, enabled?}); behavior: extId -> {openPanelOnActionClick}
 const global=new Map(Object.entries(saved.global||{})),behavior=new Map(Object.entries(saved.behavior||{})),widths=new Map(Object.entries(saved.widths||{}));
 const byTab=new Map(),defaults=new Map();let openGlobal=null;const openTabs=new Map();
 const tabOptions=(id,tabId)=>byTab.get(id)?.get(tabId);
 function setDefault(id,path){const p=safePath(path);if(p)defaults.set(id,p);else defaults.delete(id);}
 function setOptions(id,options={}){
  if(!options||typeof options!=='object')throw Error('Invalid side panel options.');
  const next={};if('path' in options&&options.path!==undefined){const p=safePath(options.path);if(!p)throw Error('Invalid side panel path.');next.path=p;}
  if('enabled' in options&&options.enabled!==undefined)next.enabled=!!options.enabled;
  if(Number.isInteger(options.tabId)){if(!byTab.has(id))byTab.set(id,new Map());const map=byTab.get(id);map.set(options.tabId,{...map.get(options.tabId),...next});if(next.enabled===false&&openTabs.get(options.tabId)===id)openTabs.delete(options.tabId);}
  else{global.set(id,{...global.get(id),...next});if(next.enabled===false){if(openGlobal===id)openGlobal=null;for(const [tab,ext] of openTabs)if(ext===id&&tabOptions(id,tab)?.enabled!==true)openTabs.delete(tab);}}
 }
 // Chrome returns the tab's own options when asked for a tab, else the global ones (with the manifest default path).
 function getOptions(id,tabId){const g=global.get(id)||{},own=Number.isInteger(tabId)?tabOptions(id,tabId):null;
  return {path:own?.path??g.path??defaults.get(id),enabled:own?.enabled??g.enabled??true,...(Number.isInteger(tabId)?{tabId}:{})};}
 const has=id=>!!(defaults.get(id)||global.get(id)?.path||[...(byTab.get(id)?.values()||[])].some(o=>o.path));
 function setBehavior(id,value={}){const b={...behavior.get(id)};if(typeof value.openPanelOnActionClick==='boolean')b.openPanelOnActionClick=value.openPanelOnActionClick;behavior.set(id,b);}
 const getBehavior=id=>({openPanelOnActionClick:!!behavior.get(id)?.openPanelOnActionClick});
 // open({tabId}) keeps the panel with that tab; open({windowId}) (or none) opens it for every tab without its own.
 function open(id,{tabId,windowId}={},activeTabId){
  const target=Number.isInteger(tabId)?tabId:null,options=getOptions(id,target??activeTabId);
  if(!options.path)throw Error('No side panel path is set for this extension.');if(!options.enabled)throw Error('The side panel is disabled for this tab.');
  if(target!==null&&tabOptions(id,target))openTabs.set(target,id);else{openGlobal=id;if(target!==null||Number.isInteger(windowId))for(const [tab,ext] of openTabs)if(ext!==id&&tab===activeTabId)openTabs.delete(tab);}
 }
 function close(id){if(!id||openGlobal===id)openGlobal=null;for(const [tab,ext] of openTabs)if(!id||ext===id)openTabs.delete(tab);}
 // What the active tab shows: its own open panel first, else the window's panel when it is enabled for this tab.
 function resolve(activeTabId){
  const id=openTabs.get(activeTabId)||openGlobal;if(!id)return null;
  const own=tabOptions(id,activeTabId),fromTab=openTabs.get(activeTabId)===id;
  // A window-wide panel steps aside on tabs that have their own options (Chrome shows that tab's panel only when opened for it).
  if(!fromTab&&own&&own.enabled===false)return null;
  const options=getOptions(id,activeTabId);if(!options.path||!options.enabled)return null;
  return {extensionId:id,path:options.path,key:fromTab||own?.path?id+'|tab:'+activeTabId:id+'|window'};
 }
 const isOpenFor=(id,activeTabId)=>resolve(activeTabId)?.extensionId===id;
 function forgetTab(tabId){openTabs.delete(tabId);for(const map of byTab.values())map.delete(tabId);}
 function forgetExtension(id){close(id);byTab.delete(id);global.delete(id);behavior.delete(id);defaults.delete(id);}
 const width=id=>clampWidth(widths.get(id));const setWidth=(id,w)=>{widths.set(id,clampWidth(w));return widths.get(id);};
 // Only global options, behavior and widths outlive a restart; tab ids do not.
 const serialize=()=>({global:Object.fromEntries(global),behavior:Object.fromEntries(behavior),widths:Object.fromEntries(widths)});
 return {setDefault,setOptions,getOptions,has,setBehavior,getBehavior,open,close,resolve,isOpenFor,forgetTab,forgetExtension,width,setWidth,serialize};
}

module.exports={createSidePanelState,safePath,clampWidth,MIN_WIDTH,MAX_WIDTH,DEFAULT_WIDTH};
