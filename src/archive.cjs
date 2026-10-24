// Auto-archive (0.32): an open tab you have not looked at for a while (Settings → Performance → Archive idle tabs) leaves
// the sidebar for the Archive, where one click brings it back. Only sleeping tabs qualify, so nothing awake, playing,
// edited or kept awake is ever closed; pinned tabs, favorites, split tabs and Private tabs are never archived.
const AFTER={off:0,'12h':12*3600000,day:24*3600000,week:7*24*3600000};
const LIMIT=300;
function archiveCandidates(tabs,{activeId,split=[],after,now=Date.now()}){
 const ms=AFTER[after]||0;if(!ms)return [];
 return tabs.filter(t=>t.url&&!t.view&&!t.pinned&&!t.favoriteId&&!t.keepAwake&&!t.audible&&t.space!=='private'&&t.id!==activeId&&!split.includes(t.id)&&Number.isFinite(t.lastUsed)&&now-t.lastUsed>=ms);
}
// Newest first; an address already in the archive moves to the top instead of appearing twice.
function addToArchive(list,tabs,now=Date.now()){
 const added=tabs.map((t,i)=>({id:now.toString(36)+'-'+i+'-'+Math.random().toString(36).slice(2,7),url:t.url,title:String(t.customTitle||t.title||t.url).slice(0,300),space:t.space||'personal',at:now}));
 const urls=new Set(added.map(e=>e.url));return [...added,...normalizeArchive(list).filter(e=>!urls.has(e.url))].slice(0,LIMIT);
}
function normalizeArchive(list){
 if(!Array.isArray(list))return [];
 return list.filter(e=>e&&typeof e.id==='string'&&e.id.length<=64&&typeof e.url==='string'&&/^https?:\/\//i.test(e.url)&&e.url.length<=8192&&Number.isFinite(e.at)).map(e=>({id:e.id,url:e.url,title:String(e.title||e.url).slice(0,300),space:typeof e.space==='string'&&/^[a-z0-9][a-z0-9-]{0,39}$/.test(e.space)?e.space:'personal',at:e.at})).slice(0,LIMIT);
}
module.exports={AFTER,LIMIT,archiveCandidates,addToArchive,normalizeArchive};
