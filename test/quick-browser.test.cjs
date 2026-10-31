const test=require('node:test'),assert=require('node:assert/strict');
const {calc}=require('../src/command-bar.cjs'),{tidyCandidates}=require('../src/archive.cjs'),{windowBounds,display}=require('../src/peek.cjs');
test('Beam sums: arithmetic, percentages and thousands, never plain words or numbers',()=>{
 for(const [input,sum] of [['12*(3+4)','84'],['2^10','1024'],['15% of 80','12'],['1,200/3','400'],['6 × 7','42'],['-3+5','2']])assert.equal(calc(input),sum,input);
 for(const input of ['github','3','1/0','2+','(1+2','alert(1)','process.exit()'])assert.equal(calc(input),null,input);});
test('Tidy tabs keeps active, pinned, favorite, awake, playing, split and recent tabs',()=>{const now=10*3600000,old=now-31*60000,recent=now-5*60000;
 const tabs=[{id:1,url:'https://a',space:'personal',lastUsed:old},{id:2,url:'https://b',space:'personal',lastUsed:old,pinned:true},{id:3,url:'https://c',space:'personal',lastUsed:old,favoriteId:'f'},{id:4,url:'https://d',space:'personal',lastUsed:old,keepAwake:true},{id:5,url:'https://e',space:'personal',lastUsed:old,audible:true},{id:6,url:'https://f',space:'personal',lastUsed:recent},{id:7,url:'https://g',space:'work',lastUsed:old},{id:8,url:'https://h',space:'personal',lastUsed:old},{id:9,url:'https://i',space:'personal',lastUsed:old}];
 assert.deepEqual(tidyCandidates(tabs,{activeId:8,split:[9],space:'personal',now}).map(t=>t.id),[1]);});
test('Lens windows open top right, cascade, and reuse a saved place only when it is on screen',()=>{const work={x:0,y:25,width:1440,height:875};
 assert.deepEqual(windowBounds(work,null,0),{x:916,y:57,width:500,height:780});assert.deepEqual(windowBounds(work,null,1),{x:888,y:85,width:500,height:780});
 assert.deepEqual(windowBounds(work,{x:100,y:100,width:420,height:600},0),{x:100,y:100,width:420,height:600});
 assert.equal(windowBounds(work,{x:3000,y:100,width:420,height:600},0).x,916);assert.equal(windowBounds(work,{x:100,y:100,width:100,height:100},0).x,916);});
test('Lens address shows host and path without the scheme or www',()=>{assert.equal(display('https://www.example.com/'),'example.com');assert.equal(display('https://example.com/a/b?q=1'),'example.com/a/b?q=1');assert.equal(display('https://example.com/caf%C3%A9'),'example.com/café');assert.equal(display('file:///etc/passwd'),'');assert.equal(display('nope'),'');});
