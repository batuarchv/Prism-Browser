const test=require('node:test'),assert=require('node:assert/strict');const {createChromiumCheck,compare}=require('../src/chromium-check.cjs');
const fake=routes=>async url=>{const body=Object.entries(routes).find(([k])=>url.startsWith(k))?.[1];if(body===undefined)return {ok:false,status:404,text:async()=>''};return {ok:true,status:200,text:async()=>JSON.stringify(body)};};
const versions={chrome:'156.0.8078.48',electron:'45.0.0'};
test('compares dotted versions',()=>{assert.equal(compare('156.0.8078.48','152.0.7977.130'),1);assert.equal(compare('45.0.0','45.0.0'),0);assert.equal(compare('44.9.3','45.0.0'),-1);});
test('a newer Electron with a newer Chromium is reported once per launch check, never with the release list unless needed',async()=>{
 let releasesRead=0;const routes={'https://versionhistory.googleapis.com':{versions:[{version:'157.0.1.2'}]},'https://registry.npmjs.org':{latest:'46.0.0'},'https://releases.electronjs.org':[{version:'46.0.0',chrome:'158.0.1.0'}]};
 const fetcher=async(url,o)=>{if(url.startsWith('https://releases'))releasesRead++;return fake(routes)(url,o);};
 const c=createChromiumCheck({versions,fetcher});const r=await c.check();assert.equal(r.status,'available');assert.equal(r.nextChromium,'158.0.1.0');assert.equal(releasesRead,1);
 routes['https://registry.npmjs.org']={latest:'45.0.0'};const same=await createChromiumCheck({versions,fetcher}).check();assert.equal(same.status,'behind');assert.equal(releasesRead,1,'release list only when Electron moved');
 routes['https://versionhistory.googleapis.com']={versions:[{version:'156.0.8078.48'}]};assert.equal((await createChromiumCheck({versions,fetcher}).check()).status,'current');
 assert.equal((await createChromiumCheck({versions,fetcher:async()=>{throw Error('offline');}}).check()).status,'error');});
