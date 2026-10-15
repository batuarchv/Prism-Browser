// Isolated temporary profile; never launches the user's browsing session.
const Module=require('node:module'),original=Module._load;
process.argv.push('--smoke-test');
Module._load=function(request){if(request==='../test/smoke.cjs'){Module._load=original;return {run:async({win})=>{await win.webContents.executeJavaScript('finishSetup()');}};}return original.apply(this,arguments);};
require('../src/main.cjs');
