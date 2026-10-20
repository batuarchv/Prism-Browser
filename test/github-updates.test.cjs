const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {createLocalUpdater}=require('../src/local-updater.cjs'),{createGitHubSource,repositoryOf}=require('../src/github-update-source.cjs');
const keys=crypto.generateKeyPairSync('ed25519'),publicKey=keys.publicKey.export({type:'spki',format:'pem'}),other=crypto.generateKeyPairSync('ed25519');
const zip=Buffer.from('signed prism archive bytes'),sha=crypto.createHash('sha256').update(zip).digest('hex');
function envelope(o={},key=keys.privateKey){const payload=JSON.stringify({version:'0.22.0',file:'Prism-Electron-0.22.0.zip',sha256:sha,size:zip.length,bundleID:'local.prism.browser',arch:'arm64',...o});return {payload,signature:crypto.sign(null,Buffer.from(payload),key).toString('base64')};}
function response(status,body,headers={}){const data=body==null?null:Buffer.isBuffer(body)?body:Buffer.from(typeof body==='string'?body:JSON.stringify(body));return {status,headers:new Headers({...(data?{'content-length':String(data.length)}:{}),...headers}),body:data&&(async function*(){yield data;})()};}
// Mirrors GitHub: /releases/latest/download/* and /releases/download/<tag>/* redirect to the release asset host.
function github({manifest=envelope(),archive=zip,assetHost='release-assets.githubusercontent.com',fail=false}={}){const calls=[];return {calls,fetch:async(url)=>{calls.push(url);if(fail)throw Error('offline');const u=new URL(url);
 if(u.hostname==='github.com'&&u.pathname==='/batuarchv/Prism-Browser/releases/latest/download/latest.json')return response(302,null,{location:`https://${assetHost}/latest.json`});
 if(u.hostname==='github.com'&&u.pathname==='/batuarchv/Prism-Browser/releases/download/v0.22.0/Prism-Electron-0.22.0.zip')return response(302,null,{location:`https://${assetHost}/archive.zip`});
 if(u.pathname==='/latest.json')return typeof manifest==='string'?response(200,manifest):response(200,manifest);
 if(u.pathname==='/archive.zip')return response(200,archive);return response(404,'');}};}
function updater(net,{local}={}){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prism-gh-update-'));const app={isPackaged:true,getVersion:()=>'0.21.9',getPath:()=>dir};return {dir,u:createLocalUpdater({app,platform:'darwin',fetch:net.fetch,config:{enabled:true,publicKey,...(local?{directory:local}:{}),github:{enabled:true,repository:'batuarchv/Prism-Browser'}}})};}
test('repository names are validated',()=>{assert.equal(repositoryOf('batuarchv/Prism-Browser'),'batuarchv/Prism-Browser');for(const bad of ['batuarchv','a/b/c','../x','a/..','https://github.com/a/b','a b/c',null])assert.equal(repositoryOf(bad),null);assert.throws(()=>createGitHubSource({repository:'bad'}));});
test('a signed GitHub release downloads in the background and is ready to install',async()=>{const net=github(),{dir,u}=updater(net);try{
 assert.equal((await u.check()).status,'ready');assert.equal(u.snapshot().version,'0.22.0');assert.equal(u.snapshot().source,'github');
 assert.deepEqual(fs.readFileSync(path.join(dir,'updates','Prism-Electron-0.22.0.zip')),zip);assert.ok(fs.existsSync(path.join(dir,'updates','pending.json')));
 assert.ok(net.calls.some(c=>c.includes('/releases/download/v0.22.0/')),'archive comes from its version tag, not "latest"');
 const calls=net.calls.length;const again=updater(net);fs.cpSync(path.join(dir,'updates'),path.join(again.dir,'updates'),{recursive:true});await again.u.check({network:false});assert.equal(again.u.snapshot().status,'ready');assert.equal(net.calls.length,calls,'launch check uses no network');fs.rmSync(again.dir,{recursive:true,force:true});
}finally{fs.rmSync(dir,{recursive:true,force:true});}});
test('bad signature, wrong identity, oversized manifest and tampered archive never become ready',async()=>{
 for(const net of [github({manifest:envelope({},other.privateKey)}),github({manifest:envelope({bundleID:'evil.app'})}),github({manifest:'x'.repeat(9000)}),github({archive:Buffer.from('tampered archive bytes!!!!')}),github({archive:Buffer.concat([zip,Buffer.from('extra')])})]){
  const {dir,u}=updater(net);try{assert.equal((await u.check()).status,'error');assert.equal(fs.existsSync(path.join(dir,'updates','pending.json')),false);assert.equal(fs.existsSync(path.join(dir,'updates','Prism-Electron-0.22.0.zip')),false);}finally{fs.rmSync(dir,{recursive:true,force:true});}}
});
test('redirects must stay on HTTPS GitHub hosts',async()=>{for(const assetHost of ['evil.example','github.com.evil.example']){const {dir,u}=updater(github({assetHost}));try{assert.equal((await u.check()).status,'error');}finally{fs.rmSync(dir,{recursive:true,force:true});}}
 const source=createGitHubSource({repository:'batuarchv/Prism-Browser',fetch:async()=>response(302,null,{location:'http://objects.githubusercontent.com/x'})});await assert.rejects(source.manifest(),/not allowed/);
 const loop=createGitHubSource({repository:'batuarchv/Prism-Browser',fetch:async u=>response(302,null,{location:u})});await assert.rejects(loop.manifest(),/Too many redirects/);});
test('network failure means no update, and an older or equal release is ignored',async()=>{
 let {dir,u}=updater(github({fail:true}));try{assert.equal((await u.check()).status,'error');assert.equal(u.snapshot().version,null);assert.equal(await u.startup(),false);}finally{fs.rmSync(dir,{recursive:true,force:true});}
 ({dir,u}=updater(github({manifest:envelope({version:'0.21.9',file:'Prism-Electron-0.21.9.zip'})})));try{assert.equal((await u.check()).status,'current');}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('the local feed still works and the newest valid source wins',async()=>{const feed=fs.mkdtempSync(path.join(os.tmpdir(),'prism-feed-'));try{
 fs.writeFileSync(path.join(feed,'latest.json'),JSON.stringify(envelope({version:'0.22.1',file:'Prism-Electron-0.22.1.zip'})));
 let {dir,u}=updater(github({fail:true}),{local:feed});try{await u.check();assert.equal(u.snapshot().version,'0.22.1');assert.equal(u.snapshot().status,'ready');}finally{fs.rmSync(dir,{recursive:true,force:true});}
 ({dir,u}=updater(github(),{local:feed}));try{await u.check();assert.equal(u.snapshot().version,'0.22.1');assert.equal(fs.existsSync(path.join(dir,'updates','Prism-Electron-0.22.0.zip')),false,'no download when the local feed is newer');}finally{fs.rmSync(dir,{recursive:true,force:true});}
}finally{fs.rmSync(feed,{recursive:true,force:true});}});
test('GitHub updates stay off unless enabled in the config',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prism-gh-off-'));try{const app={isPackaged:true,getVersion:()=>'0.21.9',getPath:()=>dir};const u=createLocalUpdater({app,platform:'darwin',config:{enabled:true,publicKey,github:{enabled:false,repository:'batuarchv/Prism-Browser'}}});assert.equal(u.snapshot().configured,false);assert.equal(u.snapshot().status,'setup-required');}finally{fs.rmSync(dir,{recursive:true,force:true});}});
