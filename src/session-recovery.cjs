const fs=require('node:fs');
const path=require('node:path');

const MAX_TABS=150,MAX_ENTRIES=25,MAX_FILE_BYTES=4*1024*1024,MAX_TAB_BYTES=24*1024;
function url(value){
 if(typeof value!=='string'||value.length>8192)return null;
 try{const parsed=new URL(value);if(!['http:','https:'].includes(parsed.protocol))return null;parsed.username='';parsed.password='';return parsed.href;}catch{return null;}
}
function text(value,limit=500){return typeof value==='string'?value.slice(0,limit):'';}
function scrollRecord(value,currentURL){
 if(!value||url(value.url)!==currentURL||![value.x,value.y].every(Number.isFinite))return null;
 return {url:currentURL,x:Math.max(0,Math.min(10000000,Math.round(value.x))),y:Math.max(0,Math.min(10000000,Math.round(value.y)))};
}
function navigationRecord(value,currentURL,title=''){
 const fallback={entries:[{url:currentURL,title:text(title)}],index:0};
 if(!currentURL||!Array.isArray(value?.entries)||!Number.isInteger(value.index)||value.index<0||value.index>=value.entries.length)return currentURL?fallback:null;
 // Chromium pageState includes form values. Copy URL/title fields explicitly; never serialize it.
 const start=Math.max(0,value.index-Math.floor(MAX_ENTRIES/2));
 const from=Math.min(start,Math.max(0,value.entries.length-MAX_ENTRIES));
 let entries=[],index=-1;
 for(let n=from;n<Math.min(value.entries.length,from+MAX_ENTRIES);n++){
  const entry=value.entries[n],safe=url(entry?.url);if(!safe)continue;
  if(n===value.index)index=entries.length;
  entries.push({url:safe,title:text(entry.title)});
 }
 if(index<0||entries[index]?.url!==currentURL)return fallback;
 while(entries.length>1&&Buffer.byteLength(JSON.stringify(entries))>MAX_TAB_BYTES-10240){if(index>entries.length-1-index){entries.shift();index--;}else entries.pop();}
 return {entries,index};
}
function tabRecord(tab){
 if(!tab||typeof tab!=='object'||tab.space!==undefined&&(tab.space==='private'||!/^[a-z0-9][a-z0-9-]{0,39}$/.test(tab.space)))return null;
 const safe=tab.url===''?'':url(tab.url);if(safe===null)return null;
 const record={customTitle:text(tab.customTitle).slice(0,200),url:safe,title:text(tab.title)||'New tab',space:tab.space||'personal',pinned:!!tab.pinned,keepAwake:!!tab.keepAwake};
 if(Number.isFinite(tab.lastUsed))record.lastUsed=Math.round(tab.lastUsed);
 if(typeof tab.favoriteId==='string'&&tab.favoriteId.length<=500)record.favoriteId=tab.favoriteId;
 const source=tab.recovery||tab;
 if(safe){record.navigation=navigationRecord(source.navigation,safe,record.title);const scroll=scrollRecord(source.scroll,safe);if(scroll)record.scroll=scroll;}
 return record;
}
function normalizeSnapshot(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.tabs)||!raw.tabs.length||raw.tabs.length>10000)return null;
 const requested=Number.isInteger(raw.activeIndex)?raw.activeIndex:0;
 const valid=[];
 for(let i=0;i<raw.tabs.length;i++){const record=tabRecord(raw.tabs[i]);if(record)valid.push({record,index:i});}
 if(!valid.length)return null;
 let active=valid.find(row=>row.index===requested)||valid[0];
 let selected=valid.slice(0,MAX_TABS);
 if(!selected.includes(active))selected[MAX_TABS-1]=active;
 const activeIndex=selected.indexOf(active);
 return {version:2,tabs:selected.map(row=>row.record),activeIndex,space:active.record.space};
}
function captureSnapshot(tabs,activeId,selectedInSpace={}){
 const active=tabs.find(t=>t.id===activeId);
 const fallback=tabs.find(t=>t.space!=='private'&&t.id===selectedInSpace[t.space])||tabs.find(t=>t.space!=='private');
 return normalizeSnapshot({tabs,activeIndex:tabs.indexOf(active?.space==='private'?fallback:active)});
}
function createSessionStore({file,enabled=true,onError=()=>{},delay=450}={}){
 let pending=null,timer=null,last='',status={source:'empty',recovered:false,error:false};
 function read(candidate){try{if(fs.statSync(candidate).size>MAX_FILE_BYTES)return null;return normalizeSnapshot(JSON.parse(fs.readFileSync(candidate,'utf8')));}catch{return null;}}
 function load(){const main=read(file),backup=main?null:read(file+'.bak');const value=main||backup;status={source:main?'main':backup?'backup':'empty',recovered:!!backup,error:false};if(value)last=JSON.stringify(value);return value;}
 function replace(destination,contents){
  const temporary=destination+'.tmp';let fd;
  try{fd=fs.openSync(temporary,'w',0o600);fs.fchmodSync(fd,0o600);fs.writeFileSync(fd,contents);fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;fs.renameSync(temporary,destination);}
  finally{if(fd!==undefined)fs.closeSync(fd);try{fs.unlinkSync(temporary);}catch{}}
 }
 function flush(){
  if(timer){clearTimeout(timer);timer=null;}if(!enabled||!pending)return true;
  const value=pending;pending=null;const contents=JSON.stringify(value);
  if(contents===last&&status.source==='main')return true;
  try{
   if(Buffer.byteLength(contents)>MAX_FILE_BYTES)throw Error('Session snapshot is too large.');
   fs.mkdirSync(path.dirname(file),{recursive:true});
   const previous=read(file);if(previous)replace(file+'.bak',JSON.stringify(previous));
   // An unreadable current file must never overwrite the last valid backup.
   replace(file,contents);
   try{const dir=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}}catch{}
   last=contents;status={...status,source:'main',error:false};return true;
  }catch{status.error=true;onError();return false;}
 }
 return {load,read:()=>read(file)||read(file+'.bak'),status:()=>({...status}),
  schedule(value){if(!enabled)return;pending=normalizeSnapshot(value);if(pending&&!timer){timer=setTimeout(flush,delay);timer.unref?.();}},
  flush,close(){flush();if(timer)clearTimeout(timer);timer=null;}};
}
module.exports={MAX_TABS,MAX_ENTRIES,MAX_FILE_BYTES,url,scrollRecord,navigationRecord,tabRecord,normalizeSnapshot,captureSnapshot,createSessionStore};
