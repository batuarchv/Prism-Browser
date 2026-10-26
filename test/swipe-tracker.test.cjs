const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createSwipe}=require('../src/swipe-tracker.js');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
// Feeds wheel deltas 16 ms apart and records how the gesture ended.
function run(deltas,options={}){const ends=[],moves=[];const s=createSwipe({threshold:80,...options,move:o=>moves.push(o),end:(dir,offset,v)=>ends.push({dir,offset,v,at:moves.length})});
 let t=1000;for(const d of deltas){const [x,y]=Array.isArray(d)?d:[d,0];s.feed({deltaX:x,deltaY:y,timeStamp:t});t+=16;}return {ends,moves,s};}
test('a quick flick commits as soon as momentum starts, not when it ends',()=>{
 const momentum=Array.from({length:40},(_,i)=>-14*Math.pow(.9,i)); // fingers right, then decaying momentum
 const {ends}=run([-6,-12,-16,-14,...momentum]);assert.equal(ends.length,1);assert.equal(ends[0].dir,1);assert.ok(ends[0].at<12,'decided early in the momentum');
});
test('a slow swipe commits on distance after the fingers stop; a short one springs back',async()=>{
 const long=run(Array(12).fill(10));await delay(130);assert.deepEqual(long.ends.map(e=>e.dir),[-1]);
 const short=run(Array(4).fill(6));await delay(130);assert.deepEqual(short.ends.map(e=>e.dir),[0]);
});
test('vertical scrolling and rejected directions are left alone',async()=>{
 const vertical=run([[1,8],[2,12],[-30,10],[-30,0]]);await delay(130);assert.equal(vertical.ends.length,0);assert.equal(vertical.s.state,'skip');
 const refused=run(Array(10).fill(-12),{accept:()=>false});await delay(130);assert.equal(refused.ends.length,0);
});
test('content follows the fingers 1:1',()=>{const {moves}=run([-4,-4,-10,-10]);assert.deepEqual(moves,[8,18,28]);});
test('gesture-preload.cjs is built from its sources',()=>{
 const root=path.join(__dirname,'..'),built=fs.readFileSync(path.join(root,'src/gesture-preload.cjs'),'utf8');
 assert.ok(built.includes(fs.readFileSync(path.join(root,'src/swipe-tracker.js'),'utf8')));assert.ok(built.includes(fs.readFileSync(path.join(root,'src/gesture-preload-source.cjs'),'utf8')));
});
test('a second swipe right after the first one\'s momentum is picked up without a pause',()=>{
 const momentum=Array.from({length:14},(_,i)=>-14*Math.pow(.88,i)),second=[-2,-5,-10,-14,-16,-14,...Array.from({length:30},(_,i)=>-14*Math.pow(.9,i))];
 const {ends}=run([-6,-12,-16,-14,...momentum,...second]);assert.deepEqual(ends.map(e=>e.dir),[1,1],'both swipes commit');
});
test('fingers that slow down briefly are not taken as lifted',()=>{
 const {ends}=run([-10,-12,-12,-11,-10,-9.5,-12,-12,-12]);assert.equal(ends.length,0);
});
test('the tail of an earlier swipe\'s momentum never commits on its own (no double back)',async()=>{
 const tail=Array.from({length:30},(_,i)=>-22*Math.pow(.9,i));const {ends}=run(tail);await delay(150);assert.ok(ends.every(e=>e.dir===0),'momentum alone does not navigate');
});
test('a swipe that locks on its last event still ends, so nothing stays half-swiped',async()=>{
 const {ends}=run([-3,-2,-30]);assert.equal(ends.length,0);await delay(160);assert.equal(ends.length,1);
});
test('a short stall in the event stream does not end the swipe halfway',async()=>{
 const ends=[];const s=createSwipe({threshold:80,end:dir=>ends.push(dir)});let t=1000;
 for(const d of [-10,-12,-12])s.feed({deltaX:d,timeStamp:t+=16});await delay(100);t+=100;for(const d of [-12,-12,-12,-12])s.feed({deltaX:d,timeStamp:t+=16});
 assert.equal(ends.length,0,'still tracking after a 100 ms stall');await delay(160);assert.deepEqual(ends,[1]);
});
