// Links that leave Prism for another app (myapp://callback, mailto:, zoommtg:…), such as a sign-in page returning to the app that opened it.
// Schemes that reach local files, browser internals, script execution or network shares are never handed to the system.
const blockedSchemes=new Set(['javascript','vbscript','file','data','blob','filesystem','about','chrome','chrome-extension','chrome-untrusted','chrome-search','devtools','view-source','jar','ws','wss','ftp','resource','moz-extension','safari-extension','intent','content','help','x-man-page','x-apple.systempreferences','applescript','afp','smb','nfs','cifs','vnc','telnet','prism']);
const maxURL=32768,maxRules=500;

function classify(value){
 if(typeof value!=='string'||!value||value.length>maxURL)return {kind:'blocked'};
 let parsed;try{parsed=new URL(value);}catch{return {kind:'blocked'};}
 const scheme=parsed.protocol.slice(0,-1).toLowerCase();
 if(scheme==='http'||scheme==='https')return {kind:'web',scheme};
 if(!/^[a-z][a-z0-9+.-]{0,63}$/.test(scheme)||blockedSchemes.has(scheme)||/[\u0000-\u001f]/.test(value))return {kind:'blocked',scheme};
 return {kind:'external',scheme};
}
// Remembered permissions belong to a secure web origin (or a local development host), never to an opaque or file origin.
function siteOf(value){try{const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)?u.origin:null;}catch{return null;}}

function createExternalLinks({load=[],save=()=>{},prompt,open,appName}){
 const rules=new Set();for(const row of Array.isArray(load)?load:[])if(row&&siteOf(row.origin)===row.origin&&classify(row.scheme+':x').kind==='external'&&rules.size<maxRules)rules.add(row.origin+'|'+row.scheme);
 const pending=new Set();
 const rows=()=>[...rules].map(key=>{const i=key.lastIndexOf('|');return {origin:key.slice(0,i),scheme:key.slice(i+1)};});
 // Returns 'web' or 'blocked' without side effects so callers can fall back to normal navigation rules.
 async function request({url,from,isPrivate=false,source='page'}){
  const c=classify(url);if(c.kind!=='external')return c.kind;
  const site=siteOf(from),key=site&&site+'|'+c.scheme,name=appName(url);
  if(!name)return 'no-app';
  if(!isPrivate&&key&&rules.has(key)){await open(url);return 'opened';}
  if(pending.has(source))return 'busy';pending.add(source);
  try{
   const answer=await prompt({app:name,site,scheme:c.scheme,canRemember:!isPrivate&&!!site});
   if(!answer?.open)return 'cancelled';
   if(answer.remember&&!isPrivate&&key&&rules.size<maxRules){rules.add(key);save(rows());}
   await open(url);return 'opened';
  }finally{pending.delete(source);}
 }
 return {request,rows,forget(origin,scheme){if(rules.delete(origin+'|'+scheme))save(rows());}};
}
module.exports={classify,siteOf,createExternalLinks,blockedSchemes};
