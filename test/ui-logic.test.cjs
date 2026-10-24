const test=require('node:test'),assert=require('node:assert/strict');const {iconTone,panelExtensions}=require('../src/ui-logic.js');
// 10×10 icon: `fill` pixels in the centre ring, the rest transparent (or `background` if given).
function icon(fill,{coverage=0.5,background=null}={}){const px=[];for(let i=0;i<100;i++){const on=i<coverage*100;const c=on?fill:background;px.push(...(c||[0,0,0,0]));}return Uint8ClampedArray.from(px);}
test('dark and light one-colour logos on transparency are detected',()=>{
 assert.equal(iconTone(icon([20,20,24,255])),'dark-mono');assert.equal(iconTone(icon([0,0,0,255],{coverage:0.3})),'dark-mono');
 assert.equal(iconTone(icon([250,250,250,255])),'light-mono');assert.equal(iconTone(icon([128,128,128,255])),'color','mid-grey reads on both themes');});
test('colour logos, solid tiles and empty images are never recoloured',()=>{
 assert.equal(iconTone(icon([220,40,40,255])),'color');assert.equal(iconTone(icon([30,90,200,255])),'color');
 assert.equal(iconTone(icon([0,0,0,255],{background:[255,255,255,255]})),'opaque');assert.equal(iconTone(icon([0,0,0,255],{coverage:1})),'opaque','a black square tile has its own background');
 assert.equal(iconTone(new Uint8ClampedArray(400)),'empty');});
test('the toolbar lists only loaded extensions with a panel',()=>{
 const list=[{id:'a',loaded:true,hasPopup:true},{id:'b',loaded:true,hasPopup:false},{id:'c',loaded:false,hasPopup:true},{id:'d',loaded:true,hasSidePanel:true},{id:'e',loaded:false,hasSidePanel:true},null];
 assert.deepEqual(panelExtensions(list).map(e=>e.id),['a','d'],'popups and side panels both count');assert.deepEqual(panelExtensions(undefined),[]);});
