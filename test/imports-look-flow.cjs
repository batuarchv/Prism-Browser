// Look check (0.47.2): the welcome guide's Places step and Settings → Imports, with a synthetic set of browsers, in
// light and dark. Screenshots go to PRISM_SHOTS. Nothing is imported.
const fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,toolWindows})=>{
 try{
  const {home}=require('./import-fixture.cjs').fixture();process.env.PRISM_IMPORT_HOME=home;const sup=path.join(home,'Library/Application Support');
  fs.cpSync(path.join(sup,'Google/Chrome'),path.join(sup,'Dia/User Data'),{recursive:true});
  const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/imports-look');fs.mkdirSync(dir,{recursive:true});
  const shot=async(wc,name)=>fs.writeFileSync(path.join(dir,name+'.png'),(await wc.capturePage()).toPNG());
  for(const theme of ['light','dark']){
   await action('set-setting',{key:'theme',value:theme});await wait(400);
   await win.webContents.executeJavaScript(`document.getElementById('reopen-setup').click();document.getElementById('setup-next').click();document.getElementById('setup-next').click();`);await wait(1800);
   await shot(win.webContents,'welcome-'+theme);if(process.env.PROBE)console.log('PROBE',await win.webContents.executeJavaScript(`(()=>{const b=document.querySelector('#onboarding .import-kind'),g=document.querySelector('#onboarding .import-kinds');const cs=getComputedStyle(b),gs=getComputedStyle(g);return JSON.stringify({d:cs.display,fd:cs.flexDirection,w:cs.width,gd:gs.display,gw:gs.width,gfd:gs.flexDirection,gt:gs.gridTemplateColumns})})()`));
   await win.webContents.executeJavaScript(`document.getElementById('setup-skip').click()`);await wait(500);
   await action('open-tool',{section:'imports'});await wait(1800);const wc=toolWindows.get().webContents;await shot(wc,'settings-'+theme);
   await wc.executeJavaScript(`(()=>{const c=document.querySelector('[data-pane=imports]');let e=c;while(e&&e.scrollHeight<=e.clientHeight+2)e=e.parentElement;(e||document.scrollingElement).scrollBy(0,2000);})()`);await wait(400);await shot(wc,'settings-bottom-'+theme);
   await action('close-tools');await wait(400);}
  console.log('IMPORTS LOOK OK');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}};
