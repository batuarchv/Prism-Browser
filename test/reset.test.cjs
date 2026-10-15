const {test}=require('node:test'),assert=require('node:assert/strict');
const {helperArgs}=require('../src/private-network.cjs');
const {normalTabs}=require('../src/spaces.cjs');
const {defaults,validateTheme}=require('../src/theme-tokens.cjs');
const {commitWithUndo,restoreCheckpoint}=require('../src/import-checkpoint.cjs');
const {parseCSV}=require('../src/password-data.cjs');
test('private tab URLs and titles cannot enter the session file',()=>{const data=normalTabs([{url:'https://normal.test',space:'work',title:'normal'},{url:'https://secret.test',space:'private',title:'secret'}]);assert.equal(data.length,1);assert.equal(data[0].space,'work');assert.ok(!JSON.stringify(data).includes('secret'));});
test('Zapret runs only fixed SOCKS options on a loopback port',()=>{assert.deepEqual(helperArgs(19870,'standard'),['--socks','--bind-addr=127.0.0.1','--port=19870','--maxconn=128','--debug=0','--split-pos=1']);for(const p of [0,80,65536,1.5,'19870'])assert.throws(()=>helperArgs(p,'standard'));assert.throws(()=>helperArgs(19870,'--daemon'));});
test('theme imports reject CSS injection and invalid geometry',()=>{assert.deepEqual(validateTheme(defaults),defaults);assert.throws(()=>validateTheme({...defaults,radius:100}));assert.throws(()=>validateTheme({...defaults,light:{...defaults.light,text:'url(https://evil.test)'}}));});
test('malformed quoted CSV is rejected before importing',()=>{assert.throws(()=>parseCSV('URL,Username,Password\nhttps://test.test,u,"closed"junk'));assert.throws(()=>parseCSV('URL,Username,Password\nhttps://test.test,u,"unfinished'));});
test('import writes backup first, restores original data on failure and guards undo',async()=>{
 let data={items:['old']},checkpoint,fail=false,backed=false;
 const api={read:()=>structuredClone(data),write:next=>{assert.ok(backed);if(fail&&next.items[0]==='bad')throw Error('Disk failure');data=structuredClone(next);},saveCheckpoint:value=>{checkpoint=structuredClone(value);backed=true;}};
 await commitWithUndo({...api,next:{items:['new']}});assert.equal(checkpoint.completed,true);
 data.items.push('later');await assert.rejects(restoreCheckpoint({...api,checkpoint}),/changed/);assert.equal(data.items.length,2);
 data={items:['new']};await restoreCheckpoint({...api,checkpoint});assert.deepEqual(data,{items:['old']});
 fail=true;await assert.rejects(commitWithUndo({...api,next:{items:['bad']}}));assert.deepEqual(data,{items:['old']});assert.equal(checkpoint.completed,false);
});
