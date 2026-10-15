const Module=require('node:module'),original=Module._load;process.argv.push('--smoke-test');Module._load=function(request){if(request==='../test/smoke.cjs'){Module._load=original;return {run};}return original.apply(this,arguments);};
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function run({app,win,action,snapshot,tabs}){
 try{
 const js=code=>win.webContents.executeJavaScript(code);
 await js('finishSetup()');
 assert(require('electron').Menu.getApplicationMenu().items[0].submenu.items.some(i=>i.label==='Check for Updates…'));
 await action('update-check');assert.equal(snapshot().updates.status,'setup-required');
 for(let i=0;i<10;i++)await action('save-bookmark',{id:'layout-'+i,title:i===0?'Settings':'Favorite '+i,url:'https://example.test/'+i,favorite:true});
 await action('set-setting',{key:'sidebarWidth',value:220});await delay(150);
 const cols=()=>js("getComputedStyle(document.getElementById('favorites')).gridTemplateColumns.split(' ').length");const narrow=await cols();
 await action('set-setting',{key:'sidebarWidth',value:420});await delay(150);assert(await cols()>narrow);
 assert.equal(await js("getComputedStyle(document.querySelector('#favorites .favorite')).borderTopWidth"),'1px');
 assert.equal(await js("getComputedStyle(document.getElementById('sidebar')).userSelect"),'none');
 await action('new');await action('new');const ids=tabs.slice(-2).map(t=>t.id);await action('pin-tab',ids[0]);await delay(150);
 await js(`(()=>{const source=document.querySelector('[data-motion-id="tab-${ids[1]}"] .tab-main'),target=document.querySelector('[data-motion-id="tab-${ids[0]}"]');const data=new DataTransfer();source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:data}));target.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:data}));source.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer:data}));})()`);await delay(150);
 assert.equal(tabs.find(t=>t.id===ids[1]).pinned,true);assert(tabs.findIndex(t=>t.id===ids[1])<tabs.findIndex(t=>t.id===ids[0]));
 for(const lang of ['tr','es','pt','fr','uk','en']){
 await action('set-setting',{key:'language',value:lang});await delay(120);assert.equal(await js('document.documentElement.lang'),lang);
 assert.equal(await js("document.querySelector('[data-section=appearance]').textContent.trim()"),require('../src/locales.js').translate(lang,'Appearance'));
 assert.equal(await js("document.getElementById('address').placeholder"),require('../src/locales.js').translate(lang,'Search or enter a URL'));
 assert.equal(await js("document.querySelector('#home-favorites [data-favorite-id=layout-0] .bookmark-title').textContent"),'Settings');
 await js("openPanel('updates')");await delay(120);assert.equal(await js("document.getElementById('update-check').textContent"),require('../src/locales.js').translate(lang,'Check for Updates…'));
 }
 await action('set-setting',{key:'theme',value:'light'});await action('set-setting',{key:'language',value:'tr'});await delay(150);await js("openPanel('appearance')");await delay(350);
 fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../reports/release-0.16-turkish.png'),(await win.webContents.capturePage()).toPNG());
 await js("openPanel('updates')");await delay(350);fs.writeFileSync(path.join(__dirname,'../reports/release-0.16-updates.png'),(await win.webContents.capturePage()).toPNG());
 console.log('PASS: updater setup state/menu, live six-language switching, user-title preservation, favorite reflow/borders and pinned drag/drop');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}
}
require('../src/main.cjs');
