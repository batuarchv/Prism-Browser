const test=require('node:test'),assert=require('node:assert/strict');
const {framesHoldState}=require('../src/frame-state.cjs');
const frame=result=>({executeJavaScript:async()=>{if(result instanceof Error)throw result;return result;}});
test('frames without state do not keep a tab awake',async()=>{const main=frame(false);main.framesInSubtree=[main,frame(false),frame(false)];assert.equal(await framesHoldState(main),false);});
test('an edited or playing frame keeps the tab awake',async()=>{const main=frame(false);main.framesInSubtree=[main,frame(false),frame(true)];assert.equal(await framesHoldState(main),true);});
test('frames that refuse the check are treated as stateless',async()=>{const main=frame(false);main.framesInSubtree=[main,frame(new Error('gone'))];assert.equal(await framesHoldState(main),false);});
test('a frame that does not answer keeps the tab awake',async()=>{const main=frame(false);main.framesInSubtree=[main,{executeJavaScript:()=>new Promise(()=>{})}];assert.equal(await framesHoldState(main,20),true);});
test('the page itself is not checked here',async()=>{const main=frame(true);main.framesInSubtree=[main];assert.equal(await framesHoldState(main),false);});
