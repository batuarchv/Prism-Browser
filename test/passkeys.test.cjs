const test=require('node:test'),assert=require('node:assert/strict');
const {validRp,clean,createPasskeys}=require('../src/passkeys.cjs');
test('a site may only use passkeys for its own domain or a parent domain, over HTTPS',()=>{
 assert.ok(validRp('apple.com','https://idmsa.apple.com/signin'));assert.ok(validRp('webauthn.io','https://webauthn.io/'));assert.ok(validRp('localhost','http://localhost:8080/'));
 assert.ok(!validRp('apple.com','https://apple.com.evil.test/'));assert.ok(!validRp('com','https://apple.com/'),'no bare public suffix');assert.ok(!validRp('example.com','http://example.com/'),'no plain HTTP');
 assert.ok(!validRp('other.test','https://example.com/'));assert.ok(!validRp('','https://example.com/'));
});
test('stored passkeys are validated, listings never include private keys, and removal works',()=>{
 assert.equal(clean({rpId:'a.test'}),null);let rows=[{credentialId:'id1',rpId:'a.test',privateKey:'secret',userName:'me'}];
 const p=createPasskeys({read:()=>rows,write:r=>rows=r,confirmOwner:async()=>true,tabFor:()=>null});
 assert.deepEqual(p.list().map(r=>Object.keys(r).includes('privateKey')),[false]);p.remove('id1');assert.equal(rows.length,0);
});
test('requests from Private, other frames or the wrong site are denied without asking',async()=>{let asked=0;const rows=[];
 const p=createPasskeys({read:()=>rows,write:()=>{},confirmOwner:async()=>{asked++;return true;},tabFor:wc=>wc.tab});
 const mainFrame={url:'https://site.test/'},wc={mainFrame,isDestroyed:()=>false,tab:{space:'personal'}};
 assert.equal(await p.request({sender:{...wc,tab:{space:'private'}},senderFrame:mainFrame},{kind:'create',rpId:'site.test'}),'denied');
 assert.equal(await p.request({sender:wc,senderFrame:{url:'https://site.test/frame'}},{kind:'create',rpId:'site.test'}),'denied');
 assert.equal(await p.request({sender:wc,senderFrame:mainFrame},{kind:'create',rpId:'other.test'}),'denied');
 assert.equal(await p.request({sender:wc,senderFrame:mainFrame},{kind:'get',rpId:'site.test'}),'denied','no saved passkey: fail fast');
 assert.equal(await p.request({sender:wc,senderFrame:mainFrame},{kind:'get',rpId:'site.test',mediation:'conditional'}),'denied');
 assert.equal(asked,0,'Touch ID is never shown for refused requests');
});
