// 0.26 update sequence in the running app: the sidebar download ring, "Restart to Update", What's New after an
// update, and the glass sidebar logo. Uses the smoke profile and an update override; no feed is contacted.
const assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message){const deadline=Date.now()+5000;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({win,settings,showWhatsNew,whatsNewWindow,checkWhatsNew,setUpdateOverride})=>{
 const indicator=()=>win.webContents.executeJavaScript(`(()=>{const b=document.getElementById('update-indicator');return b&&{hidden:b.hidden,kind:b.dataset.kind,label:b.querySelector('.update-label').textContent}})()`);
 assert.ok(await indicator(),'update indicator exists');
 setUpdateOverride({configured:true,status:'downloading'});
 await eventually(async()=>{const s=await indicator();return !s.hidden&&s.kind==='downloading'&&s.label==='';},'download ring shown');
 setUpdateOverride({configured:true,status:'ready',version:'99.0.0'});
 await eventually(async()=>{const s=await indicator();return !s.hidden&&s.kind==='ready'&&s.label.length>0;},'Restart to Update shown');
 setUpdateOverride(null);
 await eventually(async()=>(await indicator()).hidden,'indicator hidden without an update');
 assert.match(await win.webContents.executeJavaScript(`document.querySelector('.space-switcher .space-logo').getAttribute('src')`),/prism-glass/,'sidebar logo is the glass render');
 // An updated install (welcome finished, older version seen) records the new version once.
 Object.assign(settings,{onboardingComplete:true,whatsNewSeen:'0.25.2'});checkWhatsNew();
 assert.equal(settings.whatsNewSeen,require('../package.json').version);
 showWhatsNew();
 await eventually(()=>{const w=whatsNewWindow();return w&&!w.webContents.isLoading()&&w.isVisible();},'What’s New window opened');
 const view=await whatsNewWindow().webContents.executeJavaScript(`({items:document.querySelectorAll('#wn-items li').length,title:document.getElementById('wn-title').textContent,version:document.getElementById('wn-version').textContent})`);
 assert.ok(view.items>0,'release items listed');assert.ok(view.title.length>0);assert.match(view.version,/^Prism \d+\.\d+\.\d+/);
 // The rendered glass turns in on a canvas (unless the system asks for reduced motion, which keeps the still image).
 if(!require('electron').systemPreferences.getAnimationSettings().prefersReducedMotion)
  await eventually(()=>whatsNewWindow().webContents.executeJavaScript(`!!document.querySelector('canvas.glass-logo')&&document.getElementById('wn-mark').classList.contains('glass-fallback')&&PrismGlass.active.size>0`),'glass logo frames drawn');
 // The live logo's frame rate while it turns (the window may be in the background, which can throttle it).
 await delay(2200);const fps=await whatsNewWindow().webContents.executeJavaScript(`[...PrismGlass.active][0]?.stats().fps??0`);console.log('glass logo fps',fps);
 const dir=require('node:path').resolve(__dirname,'../reports/'+require('../package.json').version);require('node:fs').mkdirSync(dir,{recursive:true});
 require('node:fs').writeFileSync(require('node:path').join(dir,'whats-new.png'),(await whatsNewWindow().webContents.capturePage()).toPNG());
 whatsNewWindow().close();await eventually(()=>!whatsNewWindow(),'What’s New closed');
 return ['update download ring and Restart to Update','glass sidebar logo','What’s New after update'];
};
