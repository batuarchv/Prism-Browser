const assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function loaded(t){const end=Date.now()+10000;while(t.loading||t.restoring||!t.view?.webContents.getURL()){if(Date.now()>end)throw Error('Restart fixture timed out');await wait(50);}}
exports.run=async({app,makeTab,action,tabs,snapshot,sessionStore,captureScroll})=>{
 const base=process.env.PRISM_TEST_RESTART_URL;
 if(process.env.PRISM_TEST_RESTART_PHASE==='write'){
  const tab=makeTab(base+'/first');await loaded(tab);await tab.view.webContents.loadURL(base+'/second');await loaded(tab);await tab.view.webContents.executeJavaScript('scrollTo(0,900)');await captureScroll(tab);
  makeTab(base+'/background',false);makeTab('https://private.invalid/',false,'private');sessionStore.schedule(require('../src/session-recovery.cjs').captureSnapshot(tabs,tab.id));sessionStore.flush();
  await action('protect');sessionStore.flush();console.log('PRISM_RESTART_READY');return;
 }
 const active=tabs.find(t=>t.id===snapshot().activeId);await loaded(active);assert.equal(active.url,base+'/second');assert.equal(active.view.webContents.navigationHistory.canGoBack(),true);assert.equal(await active.view.webContents.executeJavaScript('scrollY'),900);assert.ok(tabs.some(t=>t.url===base+'/background'&&!t.view));assert.ok(!tabs.some(t=>t.space==='private'));if(process.env.PRISM_TEST_RESTART_PHASE==='backup')assert.equal(sessionStore.status().recovered,true);
 console.log('PRISM_RESTART_PASSED '+process.env.PRISM_TEST_RESTART_PHASE);app.exit(0);
};
