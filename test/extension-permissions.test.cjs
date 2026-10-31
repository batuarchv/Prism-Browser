const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createExtensionPermissions,covers}=require('../src/extension-permissions.cjs');
test('host patterns match the way Chrome matches them',()=>{
 assert.ok(covers('https://*.cosmos.so/*','https://www.cosmos.so/*'));assert.ok(covers('*://*/*','https://www.cosmos.so/*'));assert.ok(covers('<all_urls>','https://a.com/x'));
 assert.ok(covers('https://*.cosmos.so/*','https://cosmos.so/*'));assert.ok(!covers('https://*.cosmos.so/*','https://evilcosmos.so/*'));assert.ok(!covers('https://a.com/*','http://a.com/*'));
 assert.ok(covers('https://a.com/*','https://a.com/docs/*'));assert.ok(!covers('https://a.com/docs/*','https://a.com/*'));});
test('Save to Cosmos: a declared origin is already granted, so nothing is asked (0.44)',async()=>{const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'perm-')),'p.json');let asked=0;
 const p=createExtensionPermissions({file,ask:async()=>{asked++;return true;}});const cosmos={id:'mgjneceglphcpbbfbhjplkpgfapebmdg',name:'Save to Cosmos',manifest:{manifest_version:3,permissions:['activeTab','scripting'],host_permissions:['*://*/*','https://*.cosmos.so/*']}};
 assert.equal(p.contains(cosmos,{origins:['https://www.cosmos.so/*']}),true);assert.equal(await p.request(cosmos,{origins:['https://www.cosmos.so/*']}),true);assert.equal(asked,0);});
test('optional permissions ask once and are remembered; undeclared ones are refused',async()=>{const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'perm-')),'p.json');const answers=[true];
 const ext={id:'a'.repeat(32),name:'X',manifest:{manifest_version:3,permissions:['storage'],optional_permissions:['downloads'],optional_host_permissions:['https://*.example.com/*']}};
 let p=createExtensionPermissions({file,ask:async()=>answers.shift()??false});assert.equal(p.contains(ext,{permissions:['downloads']}),false);
 assert.equal(await p.request(ext,{permissions:['downloads'],origins:['https://docs.example.com/*']}),true);
 p=createExtensionPermissions({file,ask:async()=>{throw Error('asked again');}});assert.equal(p.contains(ext,{permissions:['downloads'],origins:['https://docs.example.com/*']}),true,'remembered after restart');
 assert.equal(await p.request(ext,{permissions:['history']}),false,'never declared');assert.equal(await p.request(ext,{origins:['https://other.com/*']}),false);});
