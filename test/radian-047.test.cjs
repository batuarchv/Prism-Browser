const test=require('node:test'),assert=require('node:assert/strict');
const {settle,startBounds}=require('../src/pip.cjs'),{visit,inSpace}=require('../src/browsing.cjs'),{reader,frame}=require('../src/native-messaging.cjs'),{appleCSV}=require('../src/password-data.cjs'),{CHROMIUM}=require('../src/browser-migrate.cjs');
const area={x:0,y:25,width:1440,height:875},box={x:600,y:400,width:320,height:180};
test('PiP settles in the nearest corner, a flick carries it, a throw past the edge tucks it away',()=>{
 assert.deepEqual(settle({...box,x:100,y:100},area),{bounds:{x:16,y:41,width:320,height:180},corner:'tl',stashed:null});
 assert.equal(settle({...box,x:300,y:600},area,{vx:4000,vy:0}).corner,'br','flick to the right');
 const tucked=settle({...box,x:1300},area,{vx:2500});assert.equal(tucked.stashed,'right');assert.equal(tucked.bounds.x,1440-22);
 assert.equal(settle({...box,x:-250},area).stashed,'left');assert.equal(settle({...box,x:-250},area).bounds.x,-320+22);});
test('PiP opens where it was last left',()=>{assert.deepEqual(startBounds(16/9,area,{corner:'tl',width:400}),{x:16,y:41,width:400,height:225});const b=startBounds(16/9,area,null);assert.equal(b.x+b.width,1440-16);assert.equal(b.y+b.height,25+875-16);});
test('history remembers which spaces opened a page; old rows show everywhere',()=>{let h=visit([],{url:'https://a.com/',space:'work',title:'A'});assert.deepEqual(h[0].spaces,['work']);h=visit(h,{url:'https://a.com/',space:'personal'});assert.deepEqual(h[0].spaces,['work','personal']);
 assert.equal(inSpace(h[0],'school'),false);assert.equal(inSpace({url:'x'},'school'),true);h=visit([{url:'https://b.com/',visits:3}],{url:'https://b.com/',space:'work'});assert.equal(h[0].spaces,undefined);});
test('native messages: byte lengths, split reads and several frames in one read',()=>{const got=[];const read=reader(m=>got.push(m),e=>{throw e;});const a=frame({text:'şifre ✓'}),b=frame({n:2});const all=Buffer.concat([a,b]);
 read(all.subarray(0,3));read(all.subarray(3,a.length+5));read(all.subarray(a.length+5));assert.deepEqual(got,[{text:'şifre ✓'},{n:2}]);assert.equal(a.readUInt32LE(0),Buffer.byteLength(JSON.stringify({text:'şifre ✓'})));});
test('Apple Passwords CSV',()=>{assert.equal(appleCSV([{origin:'https://www.a.com',username:'me',password:'p,"q'}]),'Title,URL,Username,Password,Notes,OTPAuth\nwww.a.com,https://www.a.com,me,"p,""q",,\n');});
test('switching from Atlas, Dia and Helium',()=>{for(const id of ['atlas','dia','helium'])assert.ok(CHROMIUM.some(b=>b[0]===id),id);});
test('Opera keeps its profile in the data folder; browsers with no data are listed as supported',()=>{const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const {detect}=require('../src/browser-migrate.cjs');
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'prism-opera-'));const apps=path.join(home,'Apps');fs.mkdirSync(path.join(apps,'Dia.app'),{recursive:true});
 const gx=path.join(home,'Library/Application Support/com.operasoftware.OperaGX');fs.mkdirSync(gx,{recursive:true});fs.writeFileSync(path.join(gx,'Bookmarks'),'{}');fs.writeFileSync(path.join(gx,'History'),'');
 try{const found=detect({home,applications:[apps]});const opera=found.find(b=>b.id==='opera-gx');assert.deepEqual(opera.profiles,[{id:'.',name:'Default',bookmarks:true,passwords:false,history:true}]);
  assert.deepEqual(found.missing.find(b=>b.id==='dia'),{id:'dia',name:'Dia',installed:true});assert.equal(found.missing.find(b=>b.id==='helium').installed,false);assert.ok(!found.missing.some(b=>b.id==='opera-gx'));}
 finally{fs.rmSync(home,{recursive:true,force:true});}});
