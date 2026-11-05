// Windows build (0.50): borderless surfaces are transparent only on the Mac, where Liquid Glass sits behind them.
const test=require('node:test'),assert=require('node:assert/strict');const {windowLook}=require('../src/window-look.cjs');
test('surfaces are solid and themed off the Mac, transparent on it',()=>{const real=Object.getOwnPropertyDescriptor(process,'platform');
 try{Object.defineProperty(process,'platform',{value:'win32'});assert.deepEqual(windowLook({dark:false}),{backgroundColor:'#f6f6f7'});assert.deepEqual(windowLook({dark:true}),{backgroundColor:'#1f1f1f'});assert.deepEqual(windowLook({video:true}),{backgroundColor:'#000000'});assert.equal(windowLook().transparent,undefined);
  Object.defineProperty(process,'platform',{value:'darwin'});assert.deepEqual(windowLook(),{transparent:true,backgroundColor:'#00000000'});}
 finally{Object.defineProperty(process,'platform',real);}});
