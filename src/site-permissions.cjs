function origin(value){try{const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)?u.origin:null;}catch{return null;}}
function keys(permission,details={}){if(permission==='media'){const types=details.mediaTypes||[details.mediaType];return types.length&&types.every(x=>['audio','video'].includes(x))?[...new Set(types.map(x=>x==='audio'?'microphone':'camera'))]:[];}if(permission==='clipboard-read')return ['clipboard'];if(permission==='midi'||permission==='midiSysex')return ['midi'];return ['notifications','geolocation'].includes(permission)?[permission]:[];}
function createPermissions({load={},save,tabFor,prompt}){
 // Decisions (allow/block) per origin and permission, and which permissions each site has asked for ("ask" rows):
 // the site controls show a permission only once the site has requested it.
 // Picture in Picture is not a Chromium permission: page-preload.cjs asks before a page enters it (allow unless blocked).
 const KEYS=['camera','microphone','geolocation','pip','notifications','clipboard','midi'],decisions=new Map(),asked=new Set();
 for(const row of Array.isArray(load)?load:[])if(origin(row.origin)===row.origin&&KEYS.includes(row.permission)){asked.add(row.origin+'|'+row.permission);if(['allow','block'].includes(row.decision))decisions.set(row.origin+'|'+row.permission,row);}
 const rows=()=>[...asked].map(k=>decisions.get(k)||{origin:k.slice(0,k.lastIndexOf('|')),permission:k.slice(k.lastIndexOf('|')+1),decision:'ask'});const pending=new Set();
 function context(wc,url,details){const t=tabFor(wc),site=origin(url);return t&&t.space!=='private'&&!wc.isDestroyed()&&details.isMainFrame===true&&site&&origin(wc.getURL())===site?{t,site,version:t.navigationVersion}:null;}
 function check(wc,p,url,d){const c=context(wc,url,d),k=keys(p,d);return !!c&&k.length>0&&k.every(key=>decisions.get(c.site+'|'+key)?.decision==='allow');}
 async function request(wc,p,callback,d){let allowed=false;try{const c=context(wc,d.requestingUrl,d),k=keys(p,d);if(!c||!k.length)return;for(const key of k)asked.add(c.site+'|'+key);const existing=k.map(key=>decisions.get(c.site+'|'+key)?.decision);if(existing.includes('block'))return;if(existing.every(x=>x==='allow')){allowed=true;return;}if(pending.has(wc.id))return;pending.add(wc.id);try{const answer=await prompt(c.site,k);const current=context(wc,d.requestingUrl,d);if(!current||current.version!==c.version)return;if(answer==='allow'||answer==='block')for(const key of k)decisions.set(c.site+'|'+key,{origin:c.site,permission:key,decision:answer});save(rows());allowed=answer==='allow';}finally{pending.delete(wc.id);}}finally{callback(allowed);}}
 return {rows,check,request,reset(site,permission){decisions.delete(site+'|'+permission);asked.delete(site+'|'+permission);save(rows());},
  forSite:site=>KEYS.filter(k=>asked.has(site+'|'+k)).map(k=>({permission:k,decision:decisions.get(site+'|'+k)?.decision||'ask'})),
  set(site,permission,decision){if(origin(site)!==site||!KEYS.includes(permission)||!['allow','block','ask'].includes(decision))return;asked.add(site+'|'+permission);
   if(decision==='ask')decisions.delete(site+'|'+permission);else decisions.set(site+'|'+permission,{origin:site,permission,decision});save(rows());},
  // A request Prism noticed itself (Picture in Picture): record that the site asked, and say whether it may.
  noted(site,permission){if(origin(site)!==site||!KEYS.includes(permission))return false;if(!asked.has(site+'|'+permission)){asked.add(site+'|'+permission);save(rows());}return decisions.get(site+'|'+permission)?.decision!=='block';},
  resetSite(site){for(const k of KEYS){decisions.delete(site+'|'+k);asked.delete(site+'|'+k);}save(rows());}};
}
module.exports={createPermissions,origin,keys};
