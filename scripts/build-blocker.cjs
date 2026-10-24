// Prism Shield's compiled engine (0.33). The lists are Ghostery's mirror of EasyList, EasyPrivacy, Peter Lowe's list and
// uBlock Origin's filters (ads, privacy, badware, unbreak, cookie notices), with uBlock's scriptlets, which is what
// removes YouTube's in-video ads. `node scripts/build-blocker.cjs --fetch` downloads fresh copies first.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {FiltersEngine,Resources}=require('@ghostery/adblocker');
const dir=path.join(__dirname,'../assets/blocker'),lists=path.join(dir,'lists');
const MIRROR='https://raw.githubusercontent.com/ghostery/adblocker/master/packages/adblocker/assets';
const NAMES=['easylist/easylist','easylist/easyprivacy','easylist/easylist-cookie','peter-lowe/serverlist','ublock-origin/filters','ublock-origin/filters-2020','ublock-origin/filters-2021','ublock-origin/filters-2022','ublock-origin/filters-2023','ublock-origin/filters-2024','ublock-origin/badware','ublock-origin/privacy','ublock-origin/quick-fixes','ublock-origin/resource-abuse','ublock-origin/unbreak','ublock-origin/annoyances-cookies'];
const file=name=>path.join(lists,name.replace('/','-')+'.txt'),sha=data=>crypto.createHash('sha256').update(data).digest('hex');
(async()=>{
 if(process.argv.includes('--fetch')){fs.mkdirSync(lists,{recursive:true});for(const name of [...NAMES,'ublock-origin/resources']){const ext=name.endsWith('resources')?'.json':'.txt',response=await fetch(MIRROR+'/'+name+ext);if(!response.ok)throw Error('Could not fetch '+name);fs.writeFileSync(path.join(lists,name.replace('/','-')+ext),await response.text());}}
 const sources=NAMES.map(name=>{const data=fs.readFileSync(file(name),'utf8');if(data.length<5000)throw Error('Invalid list '+name);return {name,data};});
 const engine=FiltersEngine.parse(sources.map(s=>s.data).join('\n'),{enableCompression:true,enableInMemoryCache:false,loadCosmeticFilters:true,loadGenericCosmeticsFilters:true,loadExtendedSelectors:false,loadCSPFilters:true,enableHtmlFiltering:false,enableMutationObserver:false});
 const resources=fs.readFileSync(path.join(lists,'ublock-origin-resources.json'),'utf8');engine.updateResources(resources,sha(resources));
 const bytes=engine.serialize();fs.writeFileSync(path.join(dir,'engine.bin'),bytes);
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({built:new Date().toISOString(),engine:require('@ghostery/adblocker/package.json').version,bytes:bytes.length,sha256:sha(bytes),scriptlets:true,sources:sources.map(({name,data})=>({name,url:MIRROR+'/'+name+'.txt',sha256:sha(data)}))},null,2));
 console.log('Compiled blocker:',bytes.length,'bytes from',sources.length,'lists');
})().catch(error=>{console.error(error.message);process.exit(1);});
