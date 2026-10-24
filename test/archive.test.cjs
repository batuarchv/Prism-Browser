const test=require('node:test'),assert=require('node:assert/strict');const {archiveCandidates,addToArchive,normalizeArchive,LIMIT}=require('../src/archive.cjs');
const now=1_800_000_000_000,day=864e5;
const tab=(id,extra={})=>({id,url:'https://example.com/'+id,title:'T'+id,space:'personal',view:null,lastUsed:now-2*day,...extra});
test('only sleeping, idle, unprotected tabs are archived',()=>{
 const tabs=[tab(1),tab(2,{view:{}}),tab(3,{pinned:true}),tab(4,{favoriteId:'f'}),tab(5,{keepAwake:true}),tab(6,{space:'private'}),tab(7,{lastUsed:now-3600e3}),tab(8),tab(9),tab(10,{url:''})];
 assert.deepEqual(archiveCandidates(tabs,{activeId:8,split:[9],after:'day',now}).map(t=>t.id),[1]);
 assert.deepEqual(archiveCandidates(tabs,{activeId:8,after:'off',now}),[]);
 assert.deepEqual(archiveCandidates(tabs,{activeId:8,after:'12h',now}).map(t=>t.id),[1,9]);});
test('archive keeps newest first, one entry per address, and a size limit',()=>{
 let list=addToArchive([],[tab(1),tab(2)],now);assert.equal(list.length,2);
 list=addToArchive(list,[tab(1,{title:'again'})],now+1);assert.equal(list.length,2);assert.equal(list[0].title,'again');
 list=addToArchive(list,Array.from({length:LIMIT+20},(_,i)=>tab(100+i)),now+2);assert.equal(list.length,LIMIT);});
test('stored archive entries are validated',()=>{
 assert.deepEqual(normalizeArchive([{id:'a',url:'javascript:alert(1)',at:1},{id:'b',url:'https://x.test/',at:2,space:'../bad'},null]),[{id:'b',url:'https://x.test/',title:'https://x.test/',space:'personal',at:2}]);
 assert.deepEqual(normalizeArchive('nope'),[]);});
