'use strict';
// Device access for web apps (0.43): WebHID (keyboard and mouse configurators such as VIA or Keychron Launcher, game
// controllers), WebUSB, Web Serial (microcontrollers, 3D printers) and Web Bluetooth. A site asks with
// navigator.hid/usb/serial/bluetooth.requestDevice(); Prism shows a native chooser and remembers the device the person
// picked for that site, like Chrome. Private never gets devices. Settings → Site permissions turns this off and lists
// what each site may use; the site popover lists and removes them per site.
const {origin}=require('./site-permissions.cjs');
const TYPES=['hid','usb','serial','bluetooth'];
const hex=n=>Number.isFinite(Number(n))?Number(n).toString(16).padStart(4,'0'):'';
// The same physical device has the same key in the chooser and later in the permission check.
function deviceKey(type,d={}){const id=type==='bluetooth'?d.deviceId:[hex(d.vendorId),hex(d.productId),d.serialNumber||''].join(':');return type+':'+(id||d.deviceName||d.name||d.portName||'');}
function deviceName(type,d={}){const name=d.name||d.productName||d.displayName||d.deviceName||d.portName||'';
 if(name)return String(name).slice(0,80);return type==='serial'?'Serial port':d.vendorId!=null?'USB device '+hex(d.vendorId)+':'+hex(d.productId):'Unknown device';}

function createDevices({load=[],save=()=>{},enabled=()=>true,isPrivate=()=>false,choose,translate=t=>t,bluetoothScanMs=3500}){
 let grants=(Array.isArray(load)?load:[]).filter(g=>g&&origin(g.origin)===g.origin&&TYPES.includes(g.type)&&typeof g.key==='string').map(g=>({origin:g.origin,type:g.type,key:g.key,name:String(g.name||'').slice(0,80)}));
 const persist=()=>save(grants.map(g=>({...g})));
 const siteFor=wc=>{try{return wc&&!wc.isDestroyed()?origin(wc.getURL()):null;}catch{return null;}};
 const allowed=(wc,site)=>enabled()&&!!site&&!(wc&&isPrivate(wc));
 function grant(site,type,device){const key=deviceKey(type,device);if(grants.some(g=>g.origin===site&&g.key===key))return;grants=[...grants,{origin:site,type,key,name:deviceName(type,device)}].slice(-200);persist();}
 // Chooser: one row per physical device (HID lists each collection of a device separately).
 async function pick(type,list,wc){const site=siteFor(wc);if(!allowed(wc,site))return null;
  const seen=new Set(),rows=[];for(const d of list||[]){const k=deviceKey(type,d);if(seen.has(k))continue;seen.add(k);rows.push(d);}
  const host=new URL(site).host,index=await choose({site,host,type,names:rows.map(d=>deviceName(type,d)).map(String),wc});
  if(!Number.isInteger(index)||!rows[index])return null;grant(site,type,rows[index]);return rows[index];}
 // Hooks one session. The private session gets none, so its requests always end with no device.
 function attach(ses){
  ses.on('select-hid-device',(event,details,callback)=>{event.preventDefault();pick('hid',details.deviceList,webContentsOf(details.frame)).then(d=>callback(d?.deviceId),()=>callback());});
  ses.on('select-usb-device',(event,details,callback)=>{event.preventDefault();pick('usb',details.deviceList,webContentsOf(details.frame)).then(d=>callback(d?.deviceId),()=>callback());});
  ses.on('select-serial-port',(event,portList,wc,callback)=>{event.preventDefault();pick('serial',portList,wc).then(d=>callback(d?.portId||''),()=>callback(''));});
  ses.setDevicePermissionHandler(details=>has(details.origin,details.deviceType,details.device));}
 function webContentsOf(frame){try{return require('electron').webContents.fromFrame(frame);}catch{return null;}}
 // Web Bluetooth reports devices as it finds them; Prism scans a few seconds, then shows what it found.
 function attachBluetooth(wc){let scan=null;
  wc.on('select-bluetooth-device',(event,list,callback)=>{event.preventDefault();
   if(scan){scan.list=list;return;}scan={list,callback};
   setTimeout(()=>{const s=scan;pick('bluetooth',s.list,wc).then(d=>s.callback(d?.deviceId||''),()=>s.callback('')).finally(()=>{if(scan===s)scan=null;});},bluetoothScanMs);});}
 function has(site,type,device){if(!enabled()||origin(site)!==site)return false;const key=deviceKey(type,device);return grants.some(g=>g.origin===site&&g.key===key);}
 // Permission check: the APIs only exist for sites that can use them (secure origins, not Private, setting on).
 const check=(wc,permission,url)=>TYPES.includes(permission)&&allowed(wc,origin(url||'')||siteFor(wc));
 return {attach,attachBluetooth,check,has,TYPES,
  forSite:site=>grants.filter(g=>g.origin===site).map(g=>({...g})),
  rows:()=>grants.map(g=>({...g})),
  remove(site,key){const before=grants.length;grants=grants.filter(g=>!(g.origin===site&&(key==null||g.key===key)));if(grants.length!==before)persist();},
  clear(){grants=[];persist();}};
}
module.exports={createDevices,deviceKey,deviceName};
