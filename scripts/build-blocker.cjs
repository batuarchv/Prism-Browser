const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {FiltersEngine}=require('@ghostery/adblocker');
const dir=path.join(__dirname,'../assets/blocker');
const sources=['easylist','easyprivacy'].map(name=>{const data=fs.readFileSync(path.join(dir,name+'.txt'),'utf8');if(!data.startsWith('[Adblock')||data.length<10000)throw Error('Invalid list '+name);return {name,data};});
const engine=FiltersEngine.parse(sources.map(s=>s.data).join('\n'),{enableCompression:true,enableInMemoryCache:false,loadExtendedSelectors:false,loadCSPFilters:false,enableMutationObserver:false});
const bytes=engine.serialize();fs.writeFileSync(path.join(dir,'engine.bin'),bytes);
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({built:new Date().toISOString(),engine:require('@ghostery/adblocker/package.json').version,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),sources:sources.map(({name,data})=>({name,url:`https://easylist.to/easylist/${name}.txt`,sha256:crypto.createHash('sha256').update(data).digest('hex')}))},null,2));
console.log('Compiled blocker:',bytes.length,'bytes');
