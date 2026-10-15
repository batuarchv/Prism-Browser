const {randomUUID}=require('node:crypto');
function webURL(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function pairs(value){if(!Array.isArray(value))return [];return value.filter(v=>v&&typeof v==='object'&&!Array.isArray(v));}
function arcBookmarks(document){
  const result=[];const seen=new Set();
  for(const container of document.sidebar?.containers||[]){
    if(!container.items)continue;
    const items=new Map(pairs(container.items).map(x=>[x.id,x]));
    function walk(id,folder,favorite,ancestors=new Set()){
      if(ancestors.has(id))return;const item=items.get(id);if(!item)return;const next=new Set(ancestors).add(id);
      const tab=item.data?.tab;const url=webURL(tab?.savedURL);
      if(url&&!seen.has(id)){seen.add(id);result.push({id:'arc:'+id,title:String(item.title||tab.savedTitle||new URL(url).hostname),url,folder,favorite,source:'Arc'});}
      const childFolder=item.data?.list? [folder,item.title||'Untitled folder'].filter(Boolean).join(' / '):folder;
      for(const child of item.childrenIds||[])walk(child,childFolder,favorite,next);
    }
    const top=container.topAppsContainerIDs||[];for(let i=1;i<top.length;i+=2)walk(top[i],'',true);
    for(const space of pairs(container.spaces)){
      const mapping=space.newContainerIDs||[];for(let i=0;i<mapping.length-1;i+=2){if(mapping[i]?.pinned!==undefined)walk(mapping[i+1],space.title||'Arc space',false);}
    }
  }
  return result;
}
function mergeBookmarks(current,incoming){
  const ids=new Set(current.map(x=>x.id));const urls=new Set(current.map(x=>x.url+'\0'+x.folder));let added=0;
  const result=[...current];for(const item of incoming){if(ids.has(item.id)||urls.has(item.url+'\0'+item.folder))continue;result.push(item);ids.add(item.id);urls.add(item.url+'\0'+item.folder);added++;}return {bookmarks:result,added};
}
function bookmark(input){const url=webURL(input.url);if(!url)throw Error('Enter a valid HTTP or HTTPS address.');return {id:typeof input.id==='string'?input.id:randomUUID(),title:String(input.title||new URL(url).hostname).trim().slice(0,200),url,folder:String(input.folder||'').trim().slice(0,200),favorite:!!input.favorite};}
module.exports={webURL,arcBookmarks,mergeBookmarks,bookmark};
