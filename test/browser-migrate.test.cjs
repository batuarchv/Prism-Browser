const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');
const {detect,collect,decryptLogins,addCredentials,mergeHistory,parseBinaryPlist,safariBookmarks,chromeTime}=require('../src/browser-migrate.cjs');
const {fixture}=require('./import-fixture.cjs');
test('detects Chrome profiles by their names, Arc and Safari',()=>{
 const {home}=fixture();const found=detect({home,applications:[]});
 const chrome=found.find(b=>b.id==='chrome');assert.deepEqual(chrome.profiles.map(p=>[p.id,p.name]),[['Default','Personal'],['Profile 2','Work']]);
 assert.equal(found.find(b=>b.id==='arc').profiles[0].bookmarks,true,'Arc sidebar counts as bookmarks');
 assert.equal(found.find(b=>b.id==='safari').needsAccess,false);assert.equal(found.some(b=>b.id==='brave'),false);
 fs.rmSync(home,{recursive:true,force:true});
});
test('Chrome import reads bookmarks, history and HTTPS logins without touching the source',async()=>{
 const {home,key,now}=fixture();const dir=path.join(home,'Library/Application Support/Google/Chrome/Profile 2');const before=fs.readFileSync(path.join(dir,'History'));
 const data=await collect({browser:'chrome',profile:'Profile 2',home});
 assert.deepEqual(data.bookmarks.map(b=>[b.url,b.folder]),[['https://news.example/','Bookmarks bar']]);
 assert.deepEqual(data.history.map(h=>h.url),['https://news.example/','https://old.example/']);assert.ok(Math.abs(data.history[0].visitedAt-(now-1000))<2);
 const {credentials,skipped}=decryptLogins(data.logins,key);assert.deepEqual(credentials,[{origin:'https://mail.example',username:'ada',password:'test-only-1'}]);assert.equal(skipped,2,'HTTP and unreadable logins are skipped; blocked sites are not read');
 assert.ok(fs.readFileSync(path.join(dir,'History')).equals(before));assert.equal(fs.readdirSync(dir).length,3,'no journals or copies left behind');
 assert.ok(!fs.readdirSync(os.tmpdir()).some(n=>n.startsWith('prism-import-')&&fs.readdirSync(path.join(os.tmpdir(),n)).length),'temporary copies are removed');
 const only=await collect({browser:'chrome',profile:'Default',kinds:{history:true},home});assert.equal(only.bookmarks.length,0);assert.equal(only.logins.length,0);
 await assert.rejects(collect({browser:'chrome',profile:'../../x',home}));
 fs.rmSync(home,{recursive:true,force:true});
});
test('Arc import uses its sidebar for bookmarks',async()=>{
 const {home}=fixture();const data=await collect({browser:'arc',home});assert.deepEqual(data.bookmarks.map(b=>[b.url,b.favorite]),[['https://arc.example/',true]]);assert.equal(data.history.length,2);assert.equal(data.logins.length,3,"sites the person blocked from saving are not read");
 fs.rmSync(home,{recursive:true,force:true});
});
test('Safari bookmarks keep folders and Unicode; history uses the latest visit',async()=>{
 const {home,now}=fixture();const data=await collect({browser:'safari',home});
 assert.deepEqual(data.bookmarks.map(b=>[b.title,b.url,b.folder]),[['Example','https://example.com/','Favorites'],['Çalışma','https://example.org/a','Favorites / Projekte ✨'],['Menu','https://menu.example/',''],['Later','https://read.example/','Reading List']]);
 assert.deepEqual(data.history.map(h=>[h.url,h.title]),[['https://safari.example/','Latest']]);assert.ok(Math.abs(data.history[0].visitedAt-(now-2000))<2);
 assert.throws(()=>parseBinaryPlist(Buffer.from('<?xml version="1.0"?>')));assert.equal(safariBookmarks({}).length,0);
 fs.rmSync(home,{recursive:true,force:true});
});
test('merging keeps existing logins and the newest visit',()=>{
 const existing=[{origin:'https://a.example',username:'x',password:'mine'}];
 const {entries,added}=addCredentials(existing,[{origin:'https://a.example',username:'x',password:'theirs'},{origin:'https://b.example',username:'y',password:'p'}]);
 assert.equal(added,1);assert.equal(entries[0].password,'mine');
 const merged=mergeHistory([{url:'https://a/',title:'A',visitedAt:5}],[{url:'https://a/',title:'',visitedAt:9},{url:'https://b/',title:'B',visitedAt:1}],2);
 assert.deepEqual(merged.history,[{url:'https://a/',title:'A',visitedAt:9},{url:'https://b/',title:'B',visitedAt:1}]);assert.equal(merged.added,1);
 assert.equal(chromeTime('11644473600000000'),0);
});
