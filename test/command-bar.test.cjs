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
test('Beam completes a site you use above the web search, and only then (0.44)',()=>{const now=Date.UTC(2026,9,30),h=1000*60*60;
 const go={id:'go',kind:'go',title:'Search for “gith”',icon:'search'};
 const rows=[{id:'history:https://github.com/batu/prism',kind:'history',title:'batu/prism',detail:'https://github.com/batu/prism',visits:9,visitedAt:now-h},{id:'history:https://github.com/',kind:'history',title:'GitHub',detail:'https://github.com/',visits:30,visitedAt:now-2*h},{id:'history:https://gitlab.com/',kind:'history',title:'GitLab',detail:'https://gitlab.com/',visits:1,visitedAt:now-900*h}];
 const out=rank('gith',[go,...rows],9,now);assert.equal(out[0].id,'history:https://github.com/','the site itself comes first');assert.equal(out[0].completion,true);assert.equal(out[1].id,'go','the search follows');
 assert.equal(rank('gitl',[go,...rows],9,now)[0].id,'go','a site seen once long ago does not take Return');
 assert.equal(rank('github stars',[go,...rows],9,now)[0].id,'go','several words stay a search');
 const typed={id:'go',kind:'go',title:'github.com',icon:'external'};assert.equal(rank('github.com',[typed,...rows],9,now)[0].id,'go','a typed address opens as typed');});
test('Beam: often and lately visited pages rank first, words match in any order, one row per page',()=>{const now=Date.UTC(2026,9,30),d=864e5;
 const rows=[{id:'h1',kind:'history',title:'Pull requests · review',detail:'https://github.com/pulls',visits:1,visitedAt:now-60*d},{id:'h2',kind:'history',title:'Pull requests · review',detail:'https://github.com/pulls/review',visits:12,visitedAt:now-d/2},{id:'h3',kind:'history',title:'Example',detail:'http://www.example.com/#top',visits:1,visitedAt:now},{id:'b3',kind:'bookmark',title:'Example',detail:'https://example.com/'}];
 assert.deepEqual(rank('review pull',rows,9,now).map(r=>r.id).slice(0,2),['h2','h1']);
 assert.equal(rank('example',rows,9,now).filter(r=>/example/.test(r.detail)).length,1,'www, http and #fragment are the same page');
 assert.deepEqual(rank('',[{id:'tab:1',kind:'tab',title:'A',detail:'https://a.com/'},{id:'history:https://b.com/',kind:'history',title:'B',detail:'https://b.com/'}],9,now).map(r=>r.id),['tab:1','history:https://b.com/'],'nothing typed keeps recent order');});
test('history counts visits to the same page',()=>{const {visit}=require('../src/browsing.cjs');let h=visit([],{url:'https://a.com/',title:'A',space:'personal'},1);h=visit(h,{url:'https://a.com/',title:'A',space:'personal'},2);assert.equal(h.length,1);assert.equal(h[0].visits,2);});
