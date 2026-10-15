// Isolated demo capture. Never opens the user's browser profile or remote sites.
const Module=require('node:module'),fs=require('node:fs'),path=require('node:path');
process.argv.push('--smoke-test');
const original=Module._load;
Module._load=function(request,parent,isMain){if(request==='../test/smoke.cjs'){Module._load=original;return {run};}return original.apply(this,arguments);};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function run({app,win,action,makeTab}){
 const out=path.resolve(__dirname,'../../Prism-Mac-Promo/stills');fs.mkdirSync(out,{recursive:true});
 win.setSize(1440,900);win.webContents.setBackgroundThrottling(false);
 await win.webContents.executeJavaScript('finishSetup()');
 await action('set-setting',{key:'theme',value:'light'});
 for(const [title,url]of [['Design notes','https://design.example/'],['Reading list','https://reading.example/'],['Weekend ideas','https://ideas.example/']])makeTab(url,false);
 for(const [title,url]of [['Design','https://design.example/'],['Reading','https://reading.example/'],['Music','https://music.example/']])await action('save-bookmark',{title,url,favorite:true});
 await action('save-bookmark',{title:'Inspiration',url:'https://inspiration.example/',folder:'Projects'});
 const capture=async name=>{await wait(900);fs.writeFileSync(path.join(out,name+'.png'),(await win.webContents.capturePage()).toPNG());};
 await win.webContents.executeJavaScript('closePanel()');await capture('01-home');
 await win.webContents.executeJavaScript("document.getElementById('address').focus();document.getElementById('address').value='Design';document.getElementById('address').dispatchEvent(new Event('input'))");await capture('02-search');
 await win.webContents.executeJavaScript("document.getElementById('address').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));openPanel('design')");await capture('03-themes');
 await win.webContents.executeJavaScript("openPanel('performance')");await capture('04-memory');
 await action('set-setting',{key:'theme',value:'dark'});await win.webContents.executeJavaScript("openPanel('blocking')");await capture('05-blocking');
 await win.webContents.executeJavaScript('closePanel()');await capture('06-dark');
 console.log(out);app.exit(0);
}
require('../src/main.cjs');
