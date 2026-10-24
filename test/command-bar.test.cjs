const test=require('node:test'),assert=require('node:assert/strict');const {rank,score}=require('../src/command-bar.cjs');
test('titles beat addresses, word starts beat anywhere, loose matches stay loose',()=>{
 assert(score('git','GitHub')>score('git','My digital garden'));assert(score('hub','Git hub')>score('hub','Example','https://example.com/hubs'));
 assert.equal(score('site','Private','',''),0);assert.equal(score('swi','Private','','space switch'),50);});
test('ranking puts the typed address first and lists each page once',()=>{
 const rows=rank('git',[{id:'history:https://github.com/',kind:'history',title:'GitHub',detail:'https://github.com/'},{id:'tab:1',kind:'tab',title:'GitHub',detail:'https://github.com/'},{id:'go',kind:'go',title:'git'},{id:'action:x',kind:'action',title:'Settings',keywords:'preferences'}]);
 assert.deepEqual(rows.map(r=>r.id),['go','tab:1']);});
