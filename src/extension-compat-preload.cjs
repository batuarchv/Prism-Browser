// Chrome extension APIs that Electron and electron-chrome-extensions 4.9 do not provide, for extension pages and
// service workers. The library freezes `chrome` after adding its own APIs, so this preload is registered first.
// - chrome.sidePanel is real: calls go through the library's "crx-msg" router, which checks the calling extension and
//   its sidePanel permission (src/side-panel.cjs).
// - chrome.alarms runs on timers while the worker is alive.
// - tabGroups, debugger, offscreen, declarativeNetRequest and downloads are inert stand-ins with Chrome's constants:
//   extensions that read them at startup (Claude reads tabGroups.Color and debugger.onEvent) would otherwise fail to
//   register their service worker at all. Their calls reject with a clear "not supported" error.
const {contextBridge,ipcRenderer}=require('electron');
if(process.type==='service-worker'||location.href.startsWith('chrome-extension://')){
 try{
  contextBridge.exposeInMainWorld('prismExtensionBridge',{invoke:(id,name,args)=>ipcRenderer.invoke('crx-msg',id,'sidePanel.'+name,...args)});
  contextBridge.executeInMainWorld({func:()=>{
   const bridge=globalThis.prismExtensionBridge;delete globalThis.prismExtensionBridge;
   const chrome=globalThis.chrome;if(!bridge||!chrome||!chrome.runtime?.id)return;
   const define=(name,value)=>{if(!chrome[name])Object.defineProperty(chrome,name,{value:Object.freeze(value),enumerable:true,configurable:true});};
   // Listener sets; `fire` is kept private to this script.
   const event=()=>{const listeners=new Set();return [{addListener:f=>{if(typeof f==='function')listeners.add(f);},removeListener:f=>listeners.delete(f),hasListener:f=>listeners.has(f),hasListeners:()=>listeners.size>0},(...args)=>{for(const f of listeners)try{f(...args);}catch(error){console.error(error);}}];};
   const inert=()=>event()[0];
   // Promise API with the optional trailing callback Chrome also accepts.
   const withCallback=(result,args)=>{const callback=typeof args[args.length-1]==='function'?args.pop():null;const promise=result(args);if(!callback)return promise;promise.then(value=>callback(value),()=>callback());};
   const unsupported=api=>name=>(...args)=>withCallback(()=>Promise.reject(new Error(`chrome.${api}.${name} is not supported in Prism yet.`)),args);
   const call=name=>(...args)=>withCallback(rest=>bridge.invoke(chrome.runtime.id,name,rest),args);

   define('sidePanel',{setOptions:call('setOptions'),getOptions:call('getOptions'),open:call('open'),close:call('close'),setPanelBehavior:call('setPanelBehavior'),getPanelBehavior:call('getPanelBehavior'),getLayout:()=>Promise.resolve({side:'right'}),onOpened:inert(),onClosed:inert()});

   {const [onAlarm,fire]=event(),alarms=new Map();
    const clear=name=>{const a=alarms.get(name);if(!a)return false;clearTimeout(a.timer);clearInterval(a.timer);alarms.delete(name);return true;};
    const info=a=>({name:a.name,scheduledTime:a.scheduledTime,...(a.periodInMinutes?{periodInMinutes:a.periodInMinutes}:{})});
    const create=(name,options)=>{if(typeof name==='object'){options=name;name='';}name=String(name??'');options=options||{};clear(name);
     const period=Number(options.periodInMinutes)>0?Number(options.periodInMinutes):0,delay=Number.isFinite(options.when)?Math.max(0,options.when-Date.now()):Math.max(0,(Number(options.delayInMinutes)||period)*60000);
     const a={name,periodInMinutes:period||undefined,scheduledTime:Date.now()+delay};alarms.set(name,a);
     a.timer=setTimeout(()=>{fire(info(a));if(period){a.scheduledTime=Date.now()+period*60000;a.timer=setInterval(()=>{a.scheduledTime=Date.now()+period*60000;fire(info(a));},period*60000);}else alarms.delete(name);},delay);};
    define('alarms',{create:(...args)=>withCallback(([name,options])=>Promise.resolve(create(name,options)),args),get:(...args)=>withCallback(([name])=>Promise.resolve(alarms.has(String(name??''))?info(alarms.get(String(name??''))):undefined),args),
     getAll:(...args)=>withCallback(()=>Promise.resolve([...alarms.values()].map(info)),args),clear:(...args)=>withCallback(([name])=>Promise.resolve(clear(String(name??''))),args),clearAll:(...args)=>withCallback(()=>Promise.resolve([...alarms.keys()].map(clear).length>0),args),onAlarm});}

   {const no=unsupported('tabGroups');define('tabGroups',{TAB_GROUP_ID_NONE:-1,Color:Object.freeze({GREY:'grey',BLUE:'blue',RED:'red',YELLOW:'yellow',GREEN:'green',PINK:'pink',PURPLE:'purple',CYAN:'cyan',ORANGE:'orange'}),
    query:(...args)=>withCallback(()=>Promise.resolve([]),args),get:no('get'),update:no('update'),move:no('move'),onCreated:inert(),onUpdated:inert(),onRemoved:inert(),onMoved:inert()});}
   {const no=unsupported('debugger');define('debugger',{attach:no('attach'),detach:no('detach'),sendCommand:no('sendCommand'),getTargets:(...args)=>withCallback(()=>Promise.resolve([]),args),onEvent:inert(),onDetach:inert()});}
   {const no=unsupported('offscreen');define('offscreen',{Reason:Object.freeze(Object.fromEntries(['TESTING','AUDIO_PLAYBACK','IFRAME_SCRIPTING','DOM_SCRAPING','BLOBS','DOM_PARSER','USER_MEDIA','DISPLAY_MEDIA','WEB_RTC','CLIPBOARD','LOCAL_STORAGE','WORKERS','BATTERY_STATUS','MATCH_MEDIA','GEOLOCATION'].map(k=>[k,k]))),
    createDocument:no('createDocument'),closeDocument:no('closeDocument'),hasDocument:(...args)=>withCallback(()=>Promise.resolve(false),args)});}
   {const no=unsupported('declarativeNetRequest'),en=list=>Object.freeze(Object.fromEntries(list.map(k=>[k.toUpperCase(),k])));
    define('declarativeNetRequest',{RuleActionType:en(['block','redirect','allow','upgradeScheme','modifyHeaders','allowAllRequests']),HeaderOperation:en(['append','set','remove']),
     ResourceType:en(['main_frame','sub_frame','stylesheet','script','image','font','object','xmlhttprequest','ping','csp_report','media','websocket','webtransport','webbundle','other']),
     updateSessionRules:no('updateSessionRules'),updateDynamicRules:no('updateDynamicRules'),getSessionRules:(...args)=>withCallback(()=>Promise.resolve([]),args),getDynamicRules:(...args)=>withCallback(()=>Promise.resolve([]),args)});}
   {const no=unsupported('downloads');define('downloads',{download:no('download'),search:(...args)=>withCallback(()=>Promise.resolve([]),args),onChanged:inert(),onCreated:inert(),onErased:inert()});}
  }});
 }catch(error){console.error('Prism extension compatibility preload',error);}
}
