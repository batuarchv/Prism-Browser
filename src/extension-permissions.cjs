'use strict';
// chrome.permissions for extensions (0.44). electron-chrome-extensions 4.9 compares host patterns as plain strings, so
// an extension that declares https://*.cosmos.so/* and asks contains({origins:['https://www.cosmos.so/*']}) is told no,
// asks to be granted it, and Prism used to refuse every request: Save to Cosmos then did nothing at all. Here a request
// is matched the way Chrome does (scheme, host wildcards, path), what the manifest already declares is granted without
// asking, optional permissions ask the person once, and their answer is remembered per extension.
const fs=require('node:fs');
function parse(pattern){if(pattern==='<all_urls>')return {scheme:'*',host:'*',path:'/*',all:true};const m=/^(\*|https?|wss?|file|ftp|chrome-extension):\/\/([^/]*)(\/.*)?$/.exec(String(pattern||''));return m?{scheme:m[1],host:m[2].toLowerCase(),path:m[3]||'/*'}:null;}
const glob=(p,s)=>new RegExp('^'+p.split('*').map(x=>x.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$').test(s);
// True when every page the requested pattern names is also named by the granted one.
function covers(granted,requested){const g=parse(granted),r=parse(requested);if(!g||!r)return granted===requested;if(g.all)return true;if(r.all)return false;
 if(g.scheme!=='*'&&g.scheme!==r.scheme)return false;if(g.scheme==='*'&&!['*','http','https','ws','wss'].includes(r.scheme))return false;
 const hostOK=g.host==='*'||g.host===r.host||(g.host.startsWith('*.')&&(r.host===g.host.slice(2)||r.host.endsWith(g.host.slice(1))));
 return hostOK&&glob(g.path,r.path.replace(/\*+/g,'*'));}
function createExtensionPermissions({file,ask=async()=>false}){
 let saved={};try{saved=JSON.parse(fs.readFileSync(file,'utf8'))||{};}catch{}
 const persist=()=>{try{fs.writeFileSync(file,JSON.stringify(saved));}catch{}};
 const declared=ext=>{const m=ext.manifest||{};return {permissions:[...(m.permissions||[])].filter(p=>typeof p==='string'&&!p.includes('://')&&p!=='<all_urls>'),origins:[...(m.host_permissions||[]),...(m.manifest_version===2?(m.permissions||[]).filter(p=>typeof p==='string'&&(p.includes('://')||p==='<all_urls>')):[]),...(m.content_scripts||[]).flatMap(c=>c.matches||[])]};};
 const granted=ext=>{const d=declared(ext),s=saved[ext.id]||{};return {permissions:[...new Set([...d.permissions,...(s.permissions||[])])],origins:[...new Set([...d.origins,...(s.origins||[])])]};};
 function contains(ext,request={}){const g=granted(ext);return (request.permissions||[]).every(p=>g.permissions.includes(p))&&(request.origins||[]).every(o=>g.origins.some(x=>covers(x,o)));}
 async function request(ext,req={}){if(contains(ext,req))return true;const m=ext.manifest||{},optional=new Set([...(m.optional_permissions||[]),...(m.optional_host_permissions||[])]);
  const permissions=(req.permissions||[]).filter(p=>!granted(ext).permissions.includes(p)),origins=(req.origins||[]).filter(o=>!granted(ext).origins.some(x=>covers(x,o)));
  if(permissions.some(p=>!optional.has(p)&&!(m.permissions||[]).includes(p)))return false;
  if(origins.some(o=>![...optional,...(m.host_permissions||[])].some(x=>covers(x,o))))return false;
  if(!await ask({name:ext.name,permissions,origins}))return false;
  const s=saved[ext.id]||(saved[ext.id]={permissions:[],origins:[]});s.permissions=[...new Set([...s.permissions,...permissions])];s.origins=[...new Set([...s.origins,...origins])];persist();return true;}
 function remove(ext,req={}){const s=saved[ext.id];if(!s)return false;s.permissions=s.permissions.filter(p=>!(req.permissions||[]).includes(p));s.origins=s.origins.filter(o=>!(req.origins||[]).includes(o));persist();return true;}
 // Replaces the library's permissions.* handlers on its router.
 function attach(router,getExtension){const handle=router.apiHandler();const ext=e=>getExtension(e.extension.id)||e.extension;
  handle('permissions.contains',(event,req)=>contains(ext(event),req||{}));handle('permissions.getAll',event=>granted(ext(event)));
  handle('permissions.request',(event,req)=>request(ext(event),req||{}));handle('permissions.remove',(event,req)=>remove(ext(event),req||{}));}
 return {covers,contains,request,remove,granted,attach,forget(id){if(saved[id]){delete saved[id];persist();}}};
}
module.exports={createExtensionPermissions,covers};
