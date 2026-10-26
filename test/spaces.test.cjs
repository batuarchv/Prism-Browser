const test=require('node:test'),assert=require('node:assert/strict');
const spaces=require('../src/spaces.cjs'),{paths,names}=require('../src/space-icons.js'),{normalizeSettings}=require('../src/settings.cjs'),{normalizeSnapshot}=require('../src/session-recovery.cjs');
test('spaces start as Personal and Work and clean saved values',()=>{
 assert.deepEqual(normalizeSettings({}).spaces.map(s=>s.id),['personal','work']);
 const list=spaces.normalizeSpaces([{id:'personal',name:'  Home  ',icon:'house',color:'#AABBCC'},{id:'private',name:'x'},{id:'personal',name:'dup'},{id:'BAD id'},{id:'s-1',name:'',icon:'nope',color:'preset:Dusk'},{id:'s-2',color:'preset:Nope'},{id:'s-3',color:'red'}]);
 assert.deepEqual(list,[{id:'personal',name:'Home',icon:'house',color:'#aabbcc'},{id:'s-1',name:'Space',icon:'star',color:'preset:Dusk'},{id:'s-2',name:'Space',icon:'star',color:''},{id:'s-3',name:'Space',icon:'star',color:''}]);
 assert.ok(spaces.validSpace(list,'private')&&spaces.validSpace(list,'s-1')&&!spaces.validSpace(list,'work'));});
test('up to 40 spaces, each new one gets an unused icon and a free name',()=>{
 let list=spaces.normalizeSpaces([]),n=0;const random=()=>String(++n);
 while(list.length<spaces.MAX_SPACES)list=spaces.addSpace(list,{},random).spaces;
 assert.equal(list.length,40);assert.equal(new Set(list.map(s=>s.icon)).size,40);assert.equal(list[2].name,'Space 3');
 assert.throws(()=>spaces.addSpace(list,{}),/up to 40/);
 assert.equal(spaces.normalizeSpaces([...list,{id:'extra'}]).length,40);});
test('spaces can be renamed, recoloured, reordered and deleted, but not the last one',()=>{
 let list=spaces.normalizeSpaces([]);
 list=spaces.updateSpace(list,'work',{name:'  Studio ',icon:'palette',color:'#123456'});assert.deepEqual(list[1],{id:'work',name:'Studio',icon:'palette',color:'#123456'});
 assert.equal(spaces.updateSpace(list,'work',{name:'   '})[1].name,'Studio');assert.equal(spaces.updateSpace(list,'work',{icon:'nope'})[1].icon,'palette');
 assert.deepEqual(spaces.moveSpace(list,'work','personal').map(s=>s.id),['work','personal']);
 list=spaces.removeSpace(list,'personal');assert.deepEqual(list.map(s=>s.id),['work']);assert.equal(spaces.fallbackSpace(list),'work');
 assert.throws(()=>spaces.removeSpace(list,'work'),/at least one/);assert.throws(()=>spaces.updateSpace(list,'gone',{}),/no longer exists/);});
test('the 40 space icons match the icon picker and are drawable paths',()=>{
 assert.deepEqual(names,spaces.ICONS);assert.equal(names.length,40);
 for(const n of names)assert.match(paths[n],/^[Mm][-\d.,\sMmLlHhVvCcSsAaZz]+$/,n);});
test('tabs in any of the user\'s spaces survive a restart; Private never does',()=>{
 const snap=normalizeSnapshot({tabs:[{url:'https://a.example/',title:'A',space:'s-ab12'},{url:'https://b.example/',title:'B',space:'private'},{url:'https://c.example/',title:'C'}],activeIndex:0});
 assert.deepEqual(snap.tabs.map(t=>t.space),['s-ab12','personal']);assert.equal(snap.space,'s-ab12');});
