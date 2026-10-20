const test=require('node:test'),assert=require('node:assert/strict');const {classify,siteOf,createExternalLinks}=require('../src/external-links.cjs');
test('app return links are external; web stays in Prism; dangerous schemes are blocked',()=>{
 for(const url of ['myapp://callback?code=abc&state=1','com.example.app:/oauth2redirect?code=1','mailto:a@example.com','zoommtg://zoom.us/join','vscode://auth/callback'])assert.equal(classify(url).kind,'external',url);
 for(const url of ['https://example.com','http://localhost:3000/cb'])assert.equal(classify(url).kind,'web',url);
 for(const url of ['javascript:alert(1)','JavaScript:alert(1)','file:///etc/passwd','data:text/html,x','blob:https://a.test/1','chrome://settings','devtools://devtools','view-source:https://a.test','about:blank','x-man-page://ls','smb://server/share','afp://server','help:anchor=x','prism://x','','not a url','a'.repeat(40000)])assert.equal(classify(url).kind,'blocked',url);
});
test('remembered sites are secure origins only',()=>{assert.equal(siteOf('https://login.example.com/a?b'),'https://login.example.com');assert.equal(siteOf('http://localhost:8080/x'),'http://localhost:8080');assert.equal(siteOf('http://example.com'),null);assert.equal(siteOf('file:///x'),null);assert.equal(siteOf('about:blank'),null);});
function harness(opts={}){const calls={prompts:[],opened:[],saved:null};const links=createExternalLinks({load:opts.load,save:rows=>calls.saved=rows,appName:url=>url.startsWith('none:')?'':'My App',open:async url=>calls.opened.push(url),prompt:async p=>{calls.prompts.push(p);return opts.answer??{open:true};}});return {links,calls};}
test('prompts before opening and only opens on consent',async()=>{
 let {links,calls}=harness({answer:{open:false}});assert.equal(await links.request({url:'myapp://cb',from:'https://id.example.com/login'}),'cancelled');assert.deepEqual(calls.opened,[]);assert.equal(calls.prompts[0].app,'My App');assert.equal(calls.prompts[0].site,'https://id.example.com');
 ({links,calls}=harness());assert.equal(await links.request({url:'myapp://cb?code=1',from:'https://id.example.com/login'}),'opened');assert.deepEqual(calls.opened,['myapp://cb?code=1']);assert.equal(calls.saved,null);
});
test('always-allow is remembered per site and scheme, never in Private',async()=>{
 let {links,calls}=harness({answer:{open:true,remember:true}});await links.request({url:'myapp://cb',from:'https://id.example.com/a'});assert.deepEqual(calls.saved,[{origin:'https://id.example.com',scheme:'myapp'}]);
 await links.request({url:'myapp://cb2',from:'https://id.example.com/b'});assert.equal(calls.prompts.length,1);assert.equal(calls.opened.length,2);
 await links.request({url:'otherapp://cb',from:'https://id.example.com/b'});assert.equal(calls.prompts.length,2);
 await links.request({url:'myapp://cb3',from:'https://evil.example/b'});assert.equal(calls.prompts.length,3);
 ({links,calls}=harness({load:[{origin:'https://id.example.com',scheme:'myapp'}],answer:{open:true,remember:true}}));
 await links.request({url:'myapp://cb',from:'https://id.example.com/',isPrivate:true});assert.equal(calls.prompts.length,1);assert.equal(calls.prompts[0].canRemember,false);assert.equal(calls.saved,null);
});
test('blocked, web, missing-app and concurrent requests never open anything',async()=>{
 const {links,calls}=harness();assert.equal(await links.request({url:'javascript:alert(1)',from:'https://a.test'}),'blocked');assert.equal(await links.request({url:'https://a.test',from:'https://a.test'}),'web');assert.equal(await links.request({url:'none://x',from:'https://a.test'}),'no-app');
 let release;const slow=createExternalLinks({appName:()=>'App',open:async()=>calls.opened.push('slow'),prompt:()=>new Promise(r=>release=r)});const first=slow.request({url:'myapp://1',from:'https://a.test',source:1});assert.equal(await slow.request({url:'myapp://2',from:'https://a.test',source:1}),'busy');release({open:true});assert.equal(await first,'opened');assert.deepEqual(calls.opened,['slow']);
 const tampered=harness({load:[{origin:'http://evil.test',scheme:'myapp'},{origin:'https://a.test',scheme:'javascript'},null]});assert.deepEqual(tampered.links.rows(),[]);
});
