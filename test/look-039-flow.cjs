// 0.39 look check (PRISM_TEST_FLOW=look-039-flow.cjs): Beam suggestions, aligned pinned rows with a close button and
// folder symbols, the new tab with nothing but the logo and bar, and the bypass settings. Screenshots go to
// PRISM_SHOTS (or reports/<version>).
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,library,commandBar,snapshot,makeTab})=>{const {BrowserWindow}=require('electron');
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/'+require('../package.json').version);fs.mkdirSync(dir,{recursive:true});
 const shot=async(w,name)=>fs.writeFileSync(path.join(dir,name),(await w.webContents.capturePage()).toPNG());const js=code=>win.webContents.executeJavaScript(code);
 try{await js('typeof finishSetup==="function"&&finishSetup()');}catch{}await wait(800);
 // New tab: typing an address shows no list and leaves the bar crisp.
 await js(`(()=>{const i=document.getElementById('search');i.focus();i.value='x.com';i.dispatchEvent(new Event('input'));})()`);await wait(500);
 assert.equal(await js(`document.getElementById('suggestion-layer').hidden`),true,'no suggestion list on the new tab');await shot(win,'new-tab-typing.png');
 // Pinned bookmarks and a folder with a symbol; one pinned page open.
 const lib=library();lib.bookmarks.push({id:'p1',title:'GitHub',url:'https://github.com/',folder:'',favorite:false},{id:'p2',title:'Wikipedia',url:'https://www.wikipedia.org/',folder:'',favorite:false},{id:'p3',title:'MDN Web Docs',url:'https://developer.mozilla.org/',folder:'Code',favorite:false});lib.folders.push('Code');
 await action('folder-icon',{folder:'Code',icon:'code'});await action('open-bookmark','p1');makeTab('https://example.com/',true);await wait(2500);
 await js(`document.querySelector('#bookmarks details').open=true`);await wait(300);
 const rows=await js(`(()=>{const x=el=>Math.round(el.getBoundingClientRect().left);const tabIcon=document.querySelector('#tabs .tab .tab-icon'),pin=document.querySelector('#bookmarks .bookmark-row .bookmark-icon'),folder=document.querySelector('#bookmarks summary .folder-icon');return {tab:x(tabIcon),pin:x(pin),folder:x(folder),close:!!document.querySelector('#bookmarks .bookmark-row.open .tab-close'),symbol:!!document.querySelector('#bookmarks summary .space-glyph')};})()`);
 assert.equal(rows.pin,rows.tab,'pinned icons line up with tabs');assert.equal(rows.folder,rows.tab,'folder icon lines up');assert.ok(rows.close,'open pinned bookmark has a close button');assert.ok(rows.symbol,'folder wears its symbol');
 await shot(win,'sidebar.png');
 await js(`document.querySelector('#bookmarks .bookmark-row.open .tab-close').click()`);await wait(600);assert.ok(!snapshot().tabs.some(t=>t.favoriteId==='p1'),'close button closes the pinned page');assert.ok(library().bookmarks.some(b=>b.id==='p1'),'and keeps the bookmark');
 await js(`window.prismFolderSymbol('Code')`);await wait(300);await shot(win,'folder-symbols.png');await js(`document.querySelector('.folder-symbols button[aria-label=rocket]').click()`);await wait(300);assert.equal(library().folderIcons.Code,'rocket');
 // Beam suggests searches as you type.
 await commandBar().open();await wait(1200);const beam=BrowserWindow.getAllWindows().find(x=>x.webContents.getURL().includes('command-bar'));
 const found=await beam.webContents.executeJavaScript(`(async()=>{const i=document.getElementById('command-input');i.value='how to make';i.dispatchEvent(new Event('input'));for(let k=0;k<30;k++){await new Promise(r=>setTimeout(r,200));const s=[...document.querySelectorAll('.command-row')].filter(r=>r.querySelector('.typed'));if(s.length)return s.map(r=>r.querySelector('strong').textContent);}return []})()`);
 assert.ok(found.length>0,'Google suggestions in Beam');await shot(beam,'beam-suggestions.png');commandBar().hide();
 // Settings → Private network.
 await action('set-setting',{key:'bypassNormal',value:'sites'});win.webContents.send('open-panel','private');await wait(2500);let n=0;for(const wc of require('electron').webContents.getAllWebContents())if(/tool=/.test(wc.getURL())){await wc.executeJavaScript(`document.querySelector('[data-pane=private]')?.scrollIntoView()`).catch(()=>{});await wait(400);fs.writeFileSync(path.join(dir,`settings-bypass-${n++}.png`),(await wc.capturePage()).toPNG());}
 await action('set-setting',{key:'bypassNormal',value:'off'});
 console.log(JSON.stringify({rows,found:found.slice(0,4)}));
 if(process.env.PRISM_TEST_FLOW?.includes('look-039'))app.exit(0);};
