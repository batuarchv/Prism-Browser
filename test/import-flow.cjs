// 0.42 (PRISM_TEST_FLOW=import-flow.cjs): one-click import from Chrome and Safari against a synthetic home folder.
// Bookmarks, passwords and history land in one confirmation, a second import adds nothing, existing logins are kept,
// Undo restores the library, and the Settings → Imports cards render. Never reads the real browsers or Keychain.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const {dialog}=require('electron');
const migrate=require('../src/browser-migrate.cjs');const {fixture}=require('./import-fixture.cjs');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,action,library,passwords,toolWindows})=>{
 const {home,key}=fixture();process.env.PRISM_IMPORT_HOME=home;const checks=[],prompts=[];
 const original={box:dialog.showMessageBox,key:migrate.keychainKey};let answer=1;
 dialog.showMessageBox=async(_win,options)=>{prompts.push(options);return {response:answer};};
 migrate.keychainKey=async browser=>{assert.equal(browser,'chrome');return Buffer.from(key);};
 try{
  const sources=await action('import-sources');assert.deepEqual(sources.map(s=>s.id).sort(),['arc','chrome','safari']);assert.equal(sources.find(s=>s.id==='chrome').profiles[1].name,'Work');checks.push('detects Chrome profiles by name, Arc and Safari');
  answer=0;let result=await action('import-browser',{browser:'chrome',profile:'Profile 2'});assert.match(result.message,/canceled/);assert.equal(library().bookmarks.length,0);
  assert.match(prompts[0].detail,/1 new bookmark\n2 saved passwords\n2 pages from history/);checks.push('one confirmation lists everything, cancel changes nothing');
  answer=1;result=await action('import-browser',{browser:'chrome',profile:'Profile 2'});assert.equal(result.imported.bookmarks,1);assert.equal(result.imported.passwords,1);assert.equal(result.imported.history,2);
  assert.ok(library().bookmarks.some(b=>b.url==='https://news.example/'&&b.folder==='Bookmarks bar'));assert.ok(library().history.some(h=>h.url==='https://old.example/'));
  const logins=(await passwords.list()).entries;assert.deepEqual(logins.map(e=>[e.origin,e.username]),[['https://mail.example','ada']]);checks.push('Chrome bookmarks, HTTPS logins and history imported');
  result=await action('import-browser',{browser:'chrome',profile:'Default'});assert.match(result.message,/Everything from Google Chrome · Personal is already in Prism|logins are already/);checks.push('importing again adds nothing and keeps existing logins');
  const before=library().bookmarks.length;result=await action('import-browser',{browser:'safari',history:false});assert.equal(result.imported.bookmarks,4);assert.equal(result.imported.history,0);assert.equal(library().bookmarks.length,before+4);
  assert.ok(library().folders.includes('Favorites / Projekte ✨'));checks.push('Safari bookmarks import with folders; history toggle respected');
  await action('undo-import');assert.equal(library().bookmarks.length,before);checks.push('Undo removes the last import');
  result=await action('import-browser',{browser:'firefox'});assert.ok(result.error);
  await action('open-tool',{section:'imports'});await wait(1500);const wc=toolWindows.get().webContents;
  const cards=await wc.executeJavaScript(`[...document.querySelectorAll('[data-pane=imports] .import-source')].map(c=>[c.dataset.browser,c.querySelectorAll('.import-kind[aria-pressed=true]').length,!!c.querySelector('select')])`);
  assert.deepEqual(cards,[['chrome',3,true],['arc',3,false],['safari',2,false]]);
  const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/import');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'settings-imports.png'),(await wc.capturePage()).toPNG());
  await action('close-tools');checks.push('Settings → Imports shows a card per browser');
  console.log('Import flow passed:\n - '+checks.join('\n - '));app.exit(0);
 }finally{dialog.showMessageBox=original.box;migrate.keychainKey=original.key;fs.rmSync(home,{recursive:true,force:true});}
};
