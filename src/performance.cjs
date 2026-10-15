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
function createStateTransport(){let previous;return {reset(){previous=undefined;},prepare(state){const key=state.imageRevision;if(previous===key){const {images,...rest}=state;return rest;}previous=key;return state;}};}
module.exports={trimImages,budgetCandidates,createStateTransport,IMAGE_BYTES,IMAGE_ENTRIES};
