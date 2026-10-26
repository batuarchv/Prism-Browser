const reportDir=require('node:path').resolve(__dirname,'../reports');require('node:fs').mkdirSync(reportDir,{recursive:true});
const assert=require('node:assert/strict');const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
// A freshly shown tool view can miss its first compositor frame (UnknownVizError); one short retry covers it.
async function captureView(wc){try{return await wc.capturePage();}catch{await delay(250);return wc.capturePage();}}
async function eventually(check,message){const deadline=Date.now()+5000;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
async function loaded(t){const until=Date.now()+15000;while(t.loading||!t.view?.webContents.getURL()){if(Date.now()>until)throw Error('Page load timeout');await delay(100);}await delay(250);}
exports.run=async({setNaturalScroll,library,app,win,makeTab,selectTab,sleepTab,action,snapshot,tabs,settings,services,passwords,toolWindows,privateController,sidePanels,showWhatsNew,whatsNewWindow,checkWhatsNew,setUpdateOverride,passkeys})=>{
  // Settings renders in its own tool view, not in the main window.
  const settingsWC=()=>toolWindows.get()?.webContents;
  const openSettings=async section=>{await win.webContents.executeJavaScript(`openPanel('${section}')`);await eventually(async()=>toolWindows.visible()&&toolWindows.section()===section&&!settingsWC().isLoading()&&await settingsWC().executeJavaScript(`panel===${JSON.stringify(section)}`),'Settings opened: '+section);};
  await require('./password-flow.cjs').run();
  const database=new (require('node:sqlite').DatabaseSync)(':memory:');database.close();
  const server=http.createServer((_req,res)=>{if(_req.url==='/download.bin'){res.writeHead(200,{'Content-Type':'application/octet-stream','Content-Disposition':'attachment; filename=Prism-test.bin','Content-Length':1048576});let sent=0;const interval=setInterval(()=>{if(sent>=1048576){clearInterval(interval);res.end();return;}res.write(Buffer.alloc(65536,65));sent+=65536;},150);res.on('close',()=>clearInterval(interval));return;}res.setHeader('Content-Type','text/html');res.end('<title>Prism test page</title><h1>Chromium works</h1><input id="draft"><a href="/next">Next</a>');});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
  const a=makeTab(base);await loaded(a);
  await win.webContents.executeJavaScript("document.getElementById('blocker-shield').click()");await eventually(async()=>toolWindows.visible()&&toolWindows.section()==='blocking'&&!settingsWC().isLoading()&&await settingsWC().executeJavaScript("panel==='blocking'"),'Settings opened');
  assert.equal(await settingsWC().executeJavaScript("document.querySelector('[data-pane=blocking]').hidden"),false);
  await action('blocker-site');assert.equal(snapshot().blocking.active,false);
  await action('blocker-site');assert.equal(snapshot().blocking.active,true);
  await action('blocker-toggle',false);assert.equal(snapshot().blocking.enabled,false);
  await action('blocker-toggle',true);assert.equal(snapshot().blocking.enabled,true);
  win.webContents.setBackgroundThrottling(false);await delay(250);fs.writeFileSync(path.join(reportDir,'blocker-settings-0.14.png'),(await win.webContents.capturePage()).toPNG());win.webContents.setBackgroundThrottling(true);
  await action('close-tools');
  assert.ok((await action('history-list')).some(x=>x.url===base+'/'),'navigation records history');
  await action('find',{query:'Chromium'});await delay(400);assert.equal(snapshot().find.matches,1);assert.equal(a.view.getBounds().y,86);
  await action('find-close');assert.equal(a.view.getBounds().y,44);
  const recover=makeTab(base+'/recover');await loaded(recover);await action('close',recover.id);await action('reopen');const reopened=tabs.find(t=>t.id===snapshot().activeId);await loaded(reopened);assert.equal(reopened.url,base+'/recover');await action('close',reopened.id);
  await openSettings('history');await delay(200);assert.ok(await settingsWC().executeJavaScript("document.querySelectorAll('#history-rows article').length>0"));await action('close-tools');selectTab(a.id);
  assert.equal(await a.view.webContents.executeJavaScript('typeof require'),'undefined');
  assert.equal(await a.view.webContents.executeJavaScript('typeof window.prism'),'undefined');
  const dirty=makeTab(base+'/draft');await loaded(dirty);
  await dirty.view.webContents.executeJavaScript(`document.querySelector('input').value='A draft that is long enough to count as real writing';document.querySelector('input').dispatchEvent(new Event('input',{bubbles:true}));`);
  const b=makeTab(base+'/two');await loaded(b);
  assert.equal(await sleepTab(b,true),false,'active tab protected');
  assert.equal(await sleepTab(dirty,true),false,'draft protected');
  a.keepAwake=true;assert.equal(await sleepTab(a,true),false,'pinned awake');a.keepAwake=false;
  const wc=a.view.webContents;assert.equal(await sleepTab(a,true),true);await delay(500);assert.equal(wc.isDestroyed(),true,'renderer destroyed');
  selectTab(a.id);await loaded(a);assert.equal(a.view.webContents.getURL(),base+'/');
  await action('navigate','javascript:alert(1)');assert.equal(a.view.webContents.getURL(),base+'/');
  await a.view.webContents.executeJavaScript(`window.open('/popup', '_blank')`,true);await delay(400);assert.equal(tabs.length,5,'popup becomes a sandboxed tab');
  const popup=tabs[tabs.length-1];await loaded(popup);
  const pid=a.view.webContents.getOSProcessId();
  await action('save-bookmark',{title:'Example favorite',url:base,favorite:true});
  await action('save-bookmark',{title:'Reading list',url:base+'/reading',folder:'Projects'});
  selectTab(a.id);await loaded(a);win.show();win.focus();await action('set-setting',{key:'favoriteStyle',value:'cards'});await delay(700);await services.thumbnail(a);assert.match(snapshot().images[a.url]?.thumbnail||'',/^data:image\/jpeg;base64,/);const thumb=require('electron').nativeImage.createFromDataURL(snapshot().images[a.url].thumbnail);const pixels=thumb.toBitmap();assert.ok(new Set(pixels).size>8,'thumbnail contains rendered page detail');fs.writeFileSync(path.join(reportDir,'favorite-thumbnail-0.13.png'),thumb.toPNG());
  assert.equal(snapshot().bookmarks.length,2);assert.equal(snapshot().folders[0],'Projects');
  const favorite=snapshot().bookmarks.find(b=>b.favorite);
  await action('open-bookmark',favorite.id);const favoriteId=snapshot().activeId;const favoriteCount=tabs.length;const favoriteView=tabs.find(t=>t.id===favoriteId);await loaded(favoriteView);
  await favoriteView.view.webContents.loadURL(base+'/favorite-detail');
  await action('open-bookmark',favorite.id);assert.equal(snapshot().activeId,favoriteId);assert.equal(tabs.length,favoriteCount,'favorite navigation must not create duplicate tabs');
  await delay(100);assert.equal(await win.webContents.executeJavaScript('document.querySelectorAll(".favorite.selected").length'),1,'favorite symbol shows selected state');
  await favoriteView.view.webContents.loadURL(base+'/');
  await action('set-setting',{key:'theme',value:'light'});
  await action('theme');assert.equal(snapshot().theme,'dark');await action('theme');assert.equal(snapshot().theme,'light');
  selectTab(tabs[0].id);await delay(500);
  await action('set-setting',{key:'sidebarWidth',value:315});assert.equal(snapshot().settings.sidebarWidth,315);
  await action('set-setting',{key:'material',value:'clear'});assert.equal(snapshot().glass,'Native Liquid Glass');
  await action('set-setting',{key:'material',value:'solid'});assert.equal(snapshot().glass,'Solid');
  await action('set-setting',{key:'material',value:'regular'});
  const initialHardware=snapshot().system.hardwareAcceleration;
  await action('set-setting',{key:'hardwareAcceleration',value:!initialHardware});assert.equal(snapshot().system.restartRequired,true);
  await action('set-setting',{key:'hardwareAcceleration',value:initialHardware});
  if(process.env.PRISM_TEST_HARDWARE_OFF==='1'){assert.equal(initialHardware,false);assert.match(snapshot().system.gpu.gpu_compositing,/disabled/);}
  await action('set-setting',{key:'sidebarWidth',value:260});
  win.webContents.setBackgroundThrottling(false);await openSettings('performance');await settingsWC().executeJavaScript("document.querySelector('[data-budget=\"4\"]').click()");await delay(250);assert.equal(snapshot().settings.maxAwakeTabs,4);assert.equal(snapshot().settings.sleepMinutes,2);assert.match(await settingsWC().executeJavaScript("document.getElementById('resource-summary').textContent"),/MB.*CPU/);assert.ok(await settingsWC().executeJavaScript("document.querySelectorAll('.resource-row').length>0"));fs.writeFileSync(path.join(reportDir,'performance-0.13-preview.png'),(await win.webContents.capturePage()).toPNG());
  await settingsWC().executeJavaScript("document.querySelector('[data-budget=\"8\"]').click()");await action('close-tools');await delay(100);assert.equal(snapshot().settings.maxAwakeTabs,8);win.webContents.setBackgroundThrottling(true);
  const extDir=path.join(app.getPath('userData'),'test-extension');fs.mkdirSync(extDir,{recursive:true});
  fs.writeFileSync(path.join(extDir,'manifest.json'),JSON.stringify({manifest_version:3,name:'Prism integration fixture',version:'1.0',content_scripts:[{matches:['http://127.0.0.1/*'],js:['content.js']}],action:{default_popup:'popup.html'}}));
  fs.writeFileSync(path.join(extDir,'content.js'),"document.documentElement.dataset.prismExtension='working';");
  fs.writeFileSync(path.join(extDir,'popup.html'),'<h1>Extension popup fixture</h1>');
  const extension=await services.installExtension(extDir,false);assert.ok(extension.id);
  selectTab(a.id);a.view.webContents.reload();await loaded(a);await delay(600);
  assert.equal(await a.view.webContents.executeJavaScript('document.documentElement.dataset.prismExtension'),'working');
  const {BrowserWindow}=require('electron');const probe=new BrowserWindow({show:false,webPreferences:{session:a.view.webContents.session,sandbox:true,contextIsolation:true,nodeIntegration:false}});await probe.loadURL(extension.url+'/popup.html');
  const extensionTabs=await probe.webContents.executeJavaScript('chrome.tabs.query({})');assert.ok(extensionTabs.some(t=>t.id===a.view.webContents.id),'extensions see real browser tabs');
  const created=await probe.webContents.executeJavaScript(`chrome.tabs.create({url:${JSON.stringify(base+'/extension-created')}})`);assert.ok(tabs.some(t=>t.view?.webContents.id===created.id));
  await probe.webContents.executeJavaScript(`chrome.tabs.remove(${created.id})`);await eventually(()=>!tabs.some(t=>t.view?.webContents?.id===created.id),'extension-created tab closes after its loading/dirty check');probe.close();
  await services.extensionAction('popup',extension.id);services.close();
  await services.extensionAction('toggle',extension.id);assert.equal(snapshot().extensions[0].enabled,false);
  await services.extensionAction('toggle',extension.id);assert.equal(snapshot().extensions[0].loaded,true);
  const sidePanelChecks=await require('./side-panel-flow.cjs').run({app,action,snapshot,services,sidePanels,makeTab,selectTab,tab:a,base,settings});selectTab(a.id);
  const updateChecks=await require('./update-sequence-flow.cjs').run({win,settings,showWhatsNew,whatsNewWindow,checkWhatsNew,setUpdateOverride});
  await require('./update-button-flow.cjs').check({win,action,setUpdateOverride,settings});
  const signInChecks=await require('./passkey-flow.cjs').run({makeTab,selectTab,passkeys,app});updateChecks.push(...signInChecks);
  updateChecks.push(...await require('./site-controls-flow.cjs').run({win,action,makeTab,selectTab,settings,toolWindows}));updateChecks.push('Restart control fits the footer in light, dark and narrow');
  settings.askDownloadLocation=false;settings.downloadDirectory=path.join(app.getPath('userData'),'test-downloads');
  const ses=a.view.webContents.session;ses.downloadURL(base+'/download.bin');
  let until=Date.now()+12000;while(!snapshot().downloads.length){if(Date.now()>until)throw Error('Download did not start');await delay(100);}
  const downloadId=snapshot().downloads[0].id;await delay(350);await services.downloadAction('pause',downloadId);assert.equal(snapshot().downloads[0].state,'paused');await delay(150);await services.downloadAction('resume',downloadId);
  while(snapshot().downloads[0].state!=='completed'){if(Date.now()>until)throw Error('Download did not finish');await delay(100);}
  assert.equal(fs.statSync(snapshot().downloads[0].path).size,1048576);
  ses.downloadURL(base+'/download.bin');while(snapshot().downloads.length<2)await delay(100);await services.downloadAction('cancel',snapshot().downloads[0].id);await delay(200);assert.equal(snapshot().downloads[0].state,'cancelled');
  await services.downloadAction('clear');assert.equal(snapshot().downloads.length,0);
  const firstBookmark=snapshot().bookmarks[0];await action('bookmark-move',{id:firstBookmark.id,folder:'Projects'});assert.equal(snapshot().bookmarks.find(b=>b.id===firstBookmark.id).favorite,false);
  selectTab(a.id);await loaded(a);await a.view.webContents.executeJavaScript(`document.body.innerHTML='<form><input autocomplete="username"><input type="password"><button>Sign in</button></form>';window.submitCount=0;document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();window.submitCount++;});`);
  const {fillScript}=require('../src/passwords.cjs');const fake={origin:new URL(base).origin,username:'fixture-user',password:'fixture-only-password'};
  assert.equal(await a.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:fillScript({...fake,origin:'https://other.test'})}]),null);
  assert.equal(await a.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:fillScript(fake)}]),'password');
  assert.deepEqual(await a.view.webContents.executeJavaScript('[document.querySelector("input").value,document.querySelector("input[type=password]").value,window.submitCount]'),['fixture-user','fixture-only-password',0]);
  await a.view.webContents.executeJavaScript('document.querySelector("input[type=password]").remove()');assert.equal(await a.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:fillScript(fake)}]),'username');
  for(const form of ['<form action="https://other.test"><input type="password"></form>','<input type="password"><input type="password">','<input type="password" autocomplete="new-password">','<input type="text"><input type="text"><input type="password">']){
   await a.view.webContents.executeJavaScript('document.body.innerHTML='+JSON.stringify(form));assert.equal(await a.view.webContents.executeJavaScriptInIsolatedWorld(999,[{code:fillScript(fake)}]),null,'ambiguous and cross-origin forms rejected');
  }
  assert.ok((await passwords.saveCurrent(a)).error,'saving insecure HTTP forms is rejected');
  const privateChecks=await require('./private-flow.cjs').run({app,win,makeTab,selectTab,action,snapshot,base,a,privateController,toolWindows});
  selectTab(tabs[0].id);await delay(300);await openSettings('appearance');await delay(350);
  fs.writeFileSync(path.join(reportDir,'settings-preview.png'),(await captureView(settingsWC())).toPNG());
  await action('set-setting',{key:'theme',value:'dark'});await delay(300);fs.writeFileSync(path.join(reportDir,'settings-dark-preview.png'),(await captureView(settingsWC())).toPNG());
  await action('set-setting',{key:'theme',value:'light'});await action('close-tools');await delay(200);
  const image=await win.webContents.capturePage();fs.writeFileSync(path.join(reportDir,'preview.png'),image.toPNG());
  const custom=structuredClone(snapshot().designTheme);custom.light.accent='#456789';await action('set-design-theme',custom);
  const {prismPresets,presetTheme}=require('../src/theme-presets.js');await action('apply-design-preset',presetTheme(prismPresets[1]));assert.equal(snapshot().designTheme.light.accent,'#507342');await action('restore-custom-theme');assert.equal(snapshot().designTheme.light.accent,'#456789');
  await openSettings('design');await delay(200);assert.equal(await settingsWC().executeJavaScript("document.querySelectorAll('.theme-preset').length"),6);fs.writeFileSync(path.join(reportDir,'themes-preview.png'),(await win.webContents.capturePage()).toPNG());
  await action('close-tools');await delay(200);
  await win.webContents.executeJavaScript("(async()=>{await closePanel();document.getElementById('address').focus();document.getElementById('address').value='Reading';document.getElementById('address').dispatchEvent(new Event('input'));})()");await delay(300);
  await eventually(async()=>await win.webContents.executeJavaScript("document.getElementById('address').getAttribute('aria-expanded')")==='true','Address suggestions did not open');await eventually(()=>win.webContents.executeJavaScript("document.querySelectorAll('.suggestion-option').length>1"),'Search suggestions did not resolve');
  await win.webContents.executeJavaScript("document.getElementById('address').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}))");assert.equal(await win.webContents.executeJavaScript("document.getElementById('address').getAttribute('aria-activedescendant')"),'suggestion-1');
  await delay(200);fs.writeFileSync(path.join(reportDir,'suggestions-preview.png'),(await win.webContents.capturePage()).toPNG());
  await win.webContents.executeJavaScript("document.getElementById('address').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");assert.equal(await win.webContents.executeJavaScript("document.getElementById('suggestion-layer').hidden"),true);
  await win.webContents.executeJavaScript('showSetup()');assert.equal(await win.webContents.executeJavaScript('onboardingOpen'),true);await delay(150);fs.writeFileSync(path.join(reportDir,'setup-welcome.png'),(await win.webContents.capturePage()).toPNG());
  await win.webContents.executeJavaScript("document.getElementById('setup-next').click()");assert.equal(await win.webContents.executeJavaScript("document.querySelectorAll('#setup-themes button').length"),6);
  await win.webContents.executeJavaScript("document.getElementById('setup-next').click();document.getElementById('setup-next').click()");assert.ok(await win.webContents.executeJavaScript("!!document.getElementById('setup-password-progress')"));
  await win.webContents.executeJavaScript("document.getElementById('setup-next').click();document.getElementById('setup-next').click()");assert.ok(await win.webContents.executeJavaScript("!!document.querySelector('#onboarding .setup-tips')"),'Sidebar and tabs step renders');await win.webContents.executeJavaScript("document.getElementById('setup-next').click()");assert.ok(await win.webContents.executeJavaScript("!!document.querySelector('#onboarding .setup-privacy')&&document.getElementById('setup-skip').hidden"),'Privacy is the last step');await win.webContents.executeJavaScript("document.getElementById('setup-next').click()");await delay(200);assert.equal(snapshot().settings.onboardingComplete,true);assert.equal(await win.webContents.executeJavaScript('onboardingOpen'),false);
  // Favorites as Preview cards on the new tab (0.39.3).
  const cardChecks=await require('./favorite-cards-flow.cjs').run({app,win,makeTab,selectTab,action,snapshot,library});
  // Last: Close all tabs closes the tabs used above.
  const gestureChecks=await require('./gesture-flow.cjs').run({win,action,snapshot,makeTab,selectTab,settings,setNaturalScroll});
  const report={passed:true,privateChecks,checks:[...cardChecks,'HTTP navigation','remote Node isolation','no privileged bridge in pages','active tab protection','edited-form protection','keep-awake protection','renderer destruction on sleep','wake and reload','unsafe scheme rejection','popup routed to tab','bookmark creation and folders','light and dark themes','native glass material switching','hardware acceleration restart flag','sidebar size controls','unpacked extension content script','extension popup and enable/disable','download pause/resume/completion/cancel','bookmark movement','startup hardware acceleration state','local favorite screenshot capture','extension tabs query/create/remove','password exact-origin refusal','password and username-step fill without submission','insecure password saving blocked','password save consent and encrypted update',...sidePanelChecks,...updateChecks,...gestureChecks],chromium:process.versions.chrome,electron:process.versions.electron,glass:snapshot().glass,rendererPid:pid};
  fs.writeFileSync(path.join(reportDir,'smoke-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));server.close();app.exit(0);
};
