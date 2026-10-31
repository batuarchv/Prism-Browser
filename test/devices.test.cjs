const test=require('node:test'),assert=require('node:assert/strict'),{EventEmitter}=require('node:events');
const {createDevices,deviceKey,deviceName}=require('../src/devices.cjs');
const page=url=>({isDestroyed:()=>false,getURL:()=>url});
function fakeSession(){const s=new EventEmitter();s.setDevicePermissionHandler=f=>{s.handler=f;};return s;}
test('device keys and names',()=>{
 assert.equal(deviceKey('hid',{vendorId:0x3434,productId:0x0610,name:'Keychron'}),'hid:3434:0610:');
 assert.equal(deviceKey('serial',{vendorId:1,productId:2,serialNumber:'X'}),'serial:0001:0002:X');
 assert.equal(deviceName('usb',{productName:'Pico'}),'Pico');assert.equal(deviceName('usb',{vendorId:1,productId:2}),'USB device 0001:0002');});
test('a chosen device is remembered for that site only, and the setting turns access off',async()=>{
 let saved=null,enabled=true;const asked=[];
 const devices=createDevices({save:rows=>{saved=rows;},enabled:()=>enabled,choose:async r=>{asked.push(r);return 1;}});
 const ses=fakeSession();devices.attach(ses);const wc=page('https://via.example/configure');
 const id=await new Promise(r=>ses.emit('select-serial-port',{preventDefault(){}},[{portId:'a',displayName:'Other'},{portId:'b',displayName:'Pico',vendorId:0x2e8a,productId:10}],wc,r));
 assert.equal(id,'b');assert.deepEqual(asked[0].names,['Other','Pico']);assert.equal(asked[0].host,'via.example');
 assert.equal(saved.length,1);assert.equal(saved[0].name,'Pico');
 assert.equal(ses.handler({origin:'https://via.example',deviceType:'serial',device:{vendorId:0x2e8a,productId:10}}),true);
 assert.equal(ses.handler({origin:'https://evil.example',deviceType:'serial',device:{vendorId:0x2e8a,productId:10}}),false);
 assert.equal(devices.check(wc,'hid','https://via.example'),true);assert.equal(devices.check(wc,'camera','https://via.example'),false);
 assert.equal(devices.check(page('http://plain.example/'),'hid','http://plain.example'),false,'insecure sites get no device APIs');
 enabled=false;assert.equal(devices.has('https://via.example','serial',{vendorId:0x2e8a,productId:10}),false);assert.equal(devices.check(wc,'hid','https://via.example'),false);
 enabled=true;devices.remove('https://via.example',saved[0].key);assert.equal(devices.rows().length,0);});
test('HID collections of one device show once; cancelling grants nothing',async()=>{
 const asked=[];const devices=createDevices({choose:async r=>{asked.push(r);return null;}});const ses=fakeSession();devices.attach(ses);
 const wc=page('https://launcher.keychron.com/');
 const list=[{deviceId:'1',name:'Keychron Q1',vendorId:0x3434,productId:0x0610},{deviceId:'2',name:'Keychron Q1',vendorId:0x3434,productId:0x0610}];
 const pick=await new Promise(resolve=>ses.emit('select-serial-port',{preventDefault(){}},list.map(x=>({...x,portId:x.deviceId,displayName:x.name})),wc,resolve));
 assert.equal(pick,'');assert.deepEqual(asked[0].names,['Keychron Q1']);assert.equal(devices.rows().length,0);});
test('saved grants load, bad rows are dropped',()=>{
 const devices=createDevices({load:[{origin:'https://a.example',type:'hid',key:'hid:0001:0002:',name:'Pad'},{origin:'javascript:x',type:'hid',key:'k'},{origin:'https://b.example',type:'midi',key:'k'}],choose:async()=>null});
 assert.deepEqual(devices.rows().map(r=>r.name),['Pad']);assert.equal(devices.forSite('https://a.example').length,1);});
