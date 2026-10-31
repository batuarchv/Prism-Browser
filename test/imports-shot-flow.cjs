// Diagnostic (0.47.1): shows Settings → Imports with the browsers on this Mac. Lists folders and profile names only;
// nothing is imported and no Keychain item is read.
const fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,action,toolWindows})=>{
 const {home}=require('./import-fixture.cjs').fixture();process.env.PRISM_IMPORT_HOME=home;const sup=path.join(home,'Library/Application Support');
 for(const dest of ['Dia/User Data','com.openai.atlas/browser-data/host','net.imput.helium'])fs.cpSync(path.join(sup,'Google/Chrome'),path.join(sup,dest),{recursive:true});
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/imports-shot');fs.mkdirSync(dir,{recursive:true});
 const sources=await action('import-sources');console.log('SOURCES',JSON.stringify(sources.map(s=>({id:s.id,app:!!s.app,icon:!!s.icon,profiles:s.profiles.length,needsAccess:!!s.needsAccess}))));
 await action('open-tool',{section:'imports'});await wait(2500);const wc=toolWindows.get().webContents;
 const info=await wc.executeJavaScript(`(()=>{const s=document.querySelector('.tool-content,main,[data-section=imports]');const box=document.querySelector('[data-import-sources]');return {h:document.scrollingElement.scrollHeight,cards:document.querySelectorAll('.import-source').length,html:box?box.innerHTML.slice(0,600):'none'};})()`);console.log('INFO',JSON.stringify(info));
 for(let i=0;i<4;i++){fs.writeFileSync(path.join(dir,`imports-${i}.png`),(await wc.capturePage()).toPNG());await wc.executeJavaScript(`(()=>{const c=document.querySelector('[data-import-sources]');let e=c;while(e&&e.scrollHeight<=e.clientHeight+2)e=e.parentElement;(e||document.scrollingElement).scrollBy(0,420);})()`);await wait(500);}
 await wc.executeJavaScript(`document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0})`);console.log('HOLD');await wait(+(process.env.HOLD||0));console.log('IMPORTS SHOT OK');app.exit(0);};
