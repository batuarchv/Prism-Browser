const IMAGE_BYTES=4*1024*1024,IMAGE_ENTRIES=200;
function trimImages(images,maxBytes=IMAGE_BYTES,maxEntries=IMAGE_ENTRIES){
 let bytes=0;const kept=[];
 for(const [url,item] of Object.entries(images).reverse()){
  const size=Buffer.byteLength(JSON.stringify([url,item]));
  if(kept.length>=maxEntries||bytes+size>maxBytes)continue;
  bytes+=size;kept.push([url,item]);
 }
 return Object.fromEntries(kept.reverse());
}
function budgetCandidates(tabs,activeId,now=Date.now()){
 return tabs.filter(t=>t.view&&t.id!==activeId&&!t.keepAwake&&!t.audible&&!t.loading&&now-t.lastUsed>=60000).sort((a,b)=>a.lastUsed-b.lastUsed);
}
// Site icons and preview cards travel to the window only when they change, and since 0.35 only the ones that changed:
// a new favicon or card no longer resends every stored picture. A change of space kind (normal / Private) or a reset
// sends the full set.
function createStateTransport(){let previous,sent=null;const kind=key=>String(key).split('-')[0];
 return {reset(){previous=undefined;sent=null;},prepare(state){const key=state.imageRevision;const {images,...rest}=state;if(previous===key)return rest;
  const full=!sent||previous===undefined||kind(previous)!==kind(key);previous=key;
  if(full){sent={...images};return state;}
  const set={},del=[];for(const [k,v] of Object.entries(images||{}))if(sent[k]!==v)set[k]=v;for(const k of Object.keys(sent))if(!(k in (images||{})))del.push(k);sent={...images};
  return {...rest,imagesPatch:{set,del}};}};}
module.exports={trimImages,budgetCandidates,createStateTransport,IMAGE_BYTES,IMAGE_ENTRIES};
