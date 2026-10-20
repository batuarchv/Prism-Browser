const test=require('node:test'),assert=require('node:assert/strict');const {panelSize}=require('../src/tool-windows.cjs');
test('Settings scales with the window within its margins',()=>{
 assert.deepEqual(panelSize(1240,820),{width:893,height:656});
 assert.deepEqual(panelSize(1728,1117),{width:1100,height:800},'full screen on a 16-inch display');
 assert.deepEqual(panelSize(2560,1440),{width:1100,height:800},'capped on large displays');
 assert.deepEqual(panelSize(1000,700),{width:780,height:620},'never smaller than before when there is room');
 assert.deepEqual(panelSize(760,560),{width:728,height:484},'fits the minimum window');
});

test('Quick Extensions sits right-aligned under its toolbar icon and stays inside the window',()=>{const {anchoredBelow}=require('../src/tool-windows.cjs');
 assert.deepEqual(anchoredBelow({x:1165,y:36},344,430,1240,820),{x:821,y:44},'right edge of the popover lines up with the icon, below the toolbar');
 assert.deepEqual(anchoredBelow({x:200,y:36},344,430,1240,820),{x:8,y:44},'never past the left edge');
 assert.deepEqual(anchoredBelow({x:760,y:36},344,430,760,560),{x:408,y:44},'fits a minimum-size window');
});
