const test=require('node:test'),assert=require('node:assert/strict');const {rank,score}=require('../src/command-bar.cjs');
test('titles beat addresses, word starts beat anywhere, loose matches stay loose',()=>{
 assert(score('git','GitHub')>score('git','My digital garden'));assert(score('hub','Git hub')>score('hub','Example','https://example.com/hubs'));
 assert.equal(score('site','Private','',''),0);assert.equal(score('swi','Private','','space switch'),50);});
test('ranking puts the typed address first and lists each page once',()=>{
 const rows=rank('git',[{id:'history:https://github.com/',kind:'history',title:'GitHub',detail:'https://github.com/'},{id:'tab:1',kind:'tab',title:'GitHub',detail:'https://github.com/'},{id:'go',kind:'go',title:'git'},{id:'action:x',kind:'action',title:'Settings',keywords:'preferences'}]);
 assert.deepEqual(rows.map(r=>r.id),['go','tab:1']);});
test('Ask Claude sits right under the address result',()=>{const out=rank('what is the weather',[{id:'tab:1',kind:'tab',title:'what is the weather in Istanbul'},{id:'ai',kind:'ai',title:'Ask Claude'},{id:'go',kind:'go',title:'Search'}]);assert.deepEqual(out.map(e=>e.id),['go','ai','tab:1']);});
test('editable fields get the editing commands and plain text gets Copy',()=>{const {editItems}=require('../src/edit-menu.cjs');const roles=items=>items.map(i=>i.role).filter(Boolean);
 assert.deepEqual(roles(editItems({isEditable:true,editFlags:{canPaste:true}})),['undo','redo','cut','copy','paste','pasteAndMatchStyle','selectAll']);assert.deepEqual(roles(editItems({isEditable:false,selectionText:'hi'})),['copy']);assert.equal(editItems({isEditable:false,selectionText:''}).length,0);
 const fixes=editItems({isEditable:true,misspelledWord:'helo',dictionarySuggestions:['hello'],editFlags:{}});assert.equal(fixes[0].label,'hello');});
