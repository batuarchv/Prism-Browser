const test=require('node:test'),assert=require('node:assert/strict');
const {createSidePanelState,safePath,clampWidth}=require('../src/side-panel-state.cjs');
test('panel paths stay inside the extension',()=>{
 assert.equal(safePath('sidepanel.html?tab=1'),'sidepanel.html?tab=1');assert.equal(safePath('/panel/index.html'),'panel/index.html');
 for(const bad of ['https://evil.test/','javascript:alert(1)','//evil.test/x','../other.html','a/../../b.html','',' ',null,42])assert.equal(safePath(bad),null,String(bad));
});
test('widths are clamped and remembered per extension',()=>{
 const s=createSidePanelState({widths:{a:900}});assert.equal(s.width('a'),640);assert.equal(s.width('b'),360);assert.equal(s.setWidth('b',100),280);assert.equal(clampWidth('x'),360);
 assert.deepEqual(createSidePanelState(s.serialize()).width('b'),280);
});
test('global options open a panel that follows every tab',()=>{
 const s=createSidePanelState();s.setDefault('a','panel.html');assert.equal(s.has('a'),true);
 assert.deepEqual(s.getOptions('a'),{path:'panel.html',enabled:true});
 s.open('a',{windowId:1},10);assert.deepEqual(s.resolve(10),{extensionId:'a',path:'panel.html',key:'a|window'});assert.equal(s.resolve(11).extensionId,'a');
 s.close('a');assert.equal(s.resolve(10),null);
 assert.throws(()=>s.open('b',{},10),/No side panel path/);
});
test('tab options win and a tab-opened panel stays with its tab',()=>{
 const s=createSidePanelState();s.setOptions('a',{path:'global.html'});s.setOptions('a',{tabId:5,path:'tab5.html',enabled:true});
 assert.deepEqual(s.getOptions('a',5),{path:'tab5.html',enabled:true,tabId:5});assert.equal(s.getOptions('a',6).path,'global.html');
 s.open('a',{tabId:5},5);assert.deepEqual(s.resolve(5),{extensionId:'a',path:'tab5.html',key:'a|tab:5'});assert.equal(s.resolve(6),null,'other tabs show nothing');
 s.forgetTab(5);assert.equal(s.resolve(5),null);
});
test('disabling closes the panel and blocks opening',()=>{
 const s=createSidePanelState();s.setOptions('a',{path:'p.html'});s.open('a',{},1);s.setOptions('a',{enabled:false});assert.equal(s.resolve(1),null);
 assert.throws(()=>s.open('a',{},1),/disabled/);s.setOptions('a',{enabled:true});s.open('a',{},1);
 s.setOptions('a',{tabId:2,enabled:false});assert.equal(s.resolve(2),null,'window panel steps aside on a tab where it is disabled');assert.equal(s.resolve(1).extensionId,'a');
 assert.throws(()=>s.setOptions('a',{path:'https://x.test/'}),/Invalid/);
});
test('openPanelOnActionClick is stored and survives a restart',()=>{
 const s=createSidePanelState();assert.deepEqual(s.getBehavior('a'),{openPanelOnActionClick:false});s.setBehavior('a',{openPanelOnActionClick:true});
 const again=createSidePanelState(s.serialize());assert.deepEqual(again.getBehavior('a'),{openPanelOnActionClick:true});
 again.forgetExtension('a');assert.deepEqual(again.getBehavior('a'),{openPanelOnActionClick:false});
});
