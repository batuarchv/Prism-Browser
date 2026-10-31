// 0.46 welcome guide and tour (smoke profile): the guide ends with the shortcuts step, Start browsing begins the tour,
// the tour spotlights real controls with a card beside each, moves with Next/Back/arrow keys and ends with Esc.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,snapshot,settings,action,makeTab,selectTab})=>{const js=code=>win.webContents.executeJavaScript(code);
 const reports=path.resolve(__dirname,'../reports');fs.mkdirSync(reports,{recursive:true});const shot=async name=>{await delay(550);fs.writeFileSync(path.join(reports,name+'.png'),(await win.webContents.capturePage()).toPNG());};
 try{settings.tourDone=false;const t=makeTab('data:text/html,<title>Home</title><body style="background:%23f6f4ef">');selectTab(t.id);await delay(800);
  await js('showSetup()');for(let i=0;i<7;i++)await js("document.getElementById('setup-next').click()");await delay(400);
  assert.equal(await js("document.querySelectorAll('#onboarding .setup-power>div').length"),6,'shortcuts step');assert.equal(await js("document.getElementById('setup-skip').hidden"),true,'shortcuts is the last step');
  assert.equal(await js("document.getElementById('setup-step').textContent"),'8 / 8');await shot('welcome-shortcuts');
  await js("document.getElementById('setup-next').click()");await delay(400);assert.equal(snapshot().settings.onboardingComplete,true);
  assert.equal(await js('window.prismTour.isOpen()'),true,'tour follows the guide');const steps=await js('window.prismTour.steps()');console.log('tour steps',steps.join(' | '));
  assert.ok(steps.length>=6&&steps[0]==='#address-form'&&steps.includes('Lens'),'steps');
  const box=sel=>js(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};})()`);
  for(let i=0;i<steps.length;i++){await delay(500);await shot('tour-'+(i+1));const card=await box('#tour .tour-card'),win2=await js('({w:innerWidth,h:innerHeight})');
   assert.ok(card.x>=0&&card.y>=0&&card.x+card.w<=win2.w+1&&card.y+card.h<=win2.h+1,'card on screen at step '+(i+1)+': '+JSON.stringify(card));
   if(steps[i].startsWith('#')){const spot=await box('#tour .tour-spot'),el=await box(steps[i]);assert.ok(Math.abs(spot.x-(el.x-6))<2&&Math.abs(spot.y-(el.y-6))<2,'spotlight on '+steps[i]+': '+JSON.stringify({spot,el}));}
   assert.equal(await js("document.querySelector('#tour .tour-count').textContent"),(i+1)+' of '+steps.length);
   if(i===1){await js("document.getElementById('tour').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}))");assert.equal(await js("document.querySelector('#tour .tour-count').textContent"),'1 of '+steps.length,'← goes back');await js("document.getElementById('tour').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");}
   if(i<steps.length-1)await js("document.querySelector('#tour .tour-next').click()");}
  assert.equal(await js("document.querySelector('#tour .tour-next').textContent"),'Done');await js("document.querySelector('#tour .tour-next').click()");await delay(200);
  assert.equal(await js('window.prismTour.isOpen()'),false);assert.equal(snapshot().settings.tourDone,true);
  // Help → Show Me Around (the action) brings it back, and Esc ends it.
  await action('tour');await delay(300);assert.equal(await js('window.prismTour.isOpen()'),true,'Show me around reopens');
  await js("document.getElementById('tour').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");await delay(200);assert.equal(await js('window.prismTour.isOpen()||!!window.tourOpen'),false,'Esc ends the tour');
  console.log('TOUR FLOW OK');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}};
