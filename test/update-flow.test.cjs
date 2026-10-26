const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {indicator,whatsNew,releaseNotes,newer}=require('../src/update-flow.js');
test('the footer indicator follows the updater state machine',()=>{
 const steps=[['idle','none'],['checking','none'],['downloading','downloading'],['ready','ready'],['current','none'],['error','none']];
 for(const [status,kind] of steps)assert.equal(indicator({configured:true,status,version:status==='ready'?'0.26.0':null}).kind,kind,status);
 assert.equal(indicator({configured:true,status:'ready'}).kind,'none','ready without a version shows nothing');
 assert.equal(indicator({configured:false,status:'downloading'}).kind,'none');assert.equal(indicator(null).kind,'none');
 assert.deepEqual(indicator({configured:true,status:'ready',version:'0.26.0'}),{kind:'ready',version:'0.26.0'});
});
test('what\'s new shows once per version and only after an update',()=>{
 assert.deepEqual(whatsNew({current:'0.26.0',seen:'0.25.2',onboarded:true}),{show:true,record:'0.26.0'});
 assert.deepEqual(whatsNew({current:'0.26.0',seen:'0.26.0',onboarded:true}),{show:false,record:null},'second launch');
 assert.deepEqual(whatsNew({current:'0.26.0',seen:'',onboarded:true}),{show:true,record:'0.26.0'},'upgrading from a build that never recorded');
 assert.deepEqual(whatsNew({current:'0.26.0',seen:'',onboarded:false}),{show:false,record:'0.26.0'},'fresh install');
 assert.deepEqual(whatsNew({current:'0.25.2',seen:'0.26.0',onboarded:true}),{show:false,record:'0.25.2'},'downgrade');
 assert.equal(whatsNew({current:'dev',seen:'',onboarded:true}).show,false);
 assert.equal(newer('0.26.0','0.25.10'),true);assert.equal(newer('0.25.10','0.26.0'),false);
});
test('release notes become short items with icons',()=>{
 const notes=releaseNotes(fs.readFileSync(path.join(__dirname,'../RELEASE-0.25.2.md'),'utf8'));
 assert.equal(notes.version,'0.25.2');assert.ok(notes.items.length>=3);
 assert.equal(notes.items[0].title,'Extension side panels');assert.equal(notes.items[0].icon,'sidebar');
 for(const item of notes.items){assert.ok(item.title&&!item.title.includes('**'));assert.ok(item.detail.length<=160);}
 assert.deepEqual(releaseNotes('',' 1.0.0'.trim()).items,[]);
});
