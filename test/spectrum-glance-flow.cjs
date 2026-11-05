// Spectrum at a glance and the Liquid Glass slider (0.49), PRISM_TEST_FLOW=spectrum-glance-flow.cjs: a made-up week is
// recorded with the clock moved back, then the day card is opened (light and dark) and Settings → Appearance is shown
// at Clear and Tinted. Checks the card's parts and writes screenshots to PRISM_SHOTS or reports/spectrum-0.49.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,spectrum,makeTab,selectTab,snapshot})=>{const {session,webContents}=require('electron');
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/spectrum-0.49');fs.mkdirSync(dir,{recursive:true});
 const js=code=>win.webContents.executeJavaScript(code);const log=(...a)=>console.log('[spectrum-glance]',...a);let failed=false;
 session.fromPartition('persist:smoke').protocol.handle('https',req=>new Response('<!doctype html><title>'+new URL(req.url).hostname+'</title><body style="font:40px -apple-system;padding:60px;background:linear-gradient(120deg,#ffe7d6,#e6e4ff 60%,#d8f1ff)">'+new URL(req.url).hostname+'</body>',{headers:{'content-type':'text/html'}}));
 win.webContents.on('console-message',(...a)=>{const e=a[0];const msg=e?.message??a[2];if(/error|Error/.test(String(msg)))log('console',msg);});
 try{await js('typeof finishSetup==="function"&&finishSetup()');}catch{}await wait(800);win.setSize(1280,860);win.center();
 const set=async(key,value)=>{try{await action('set-setting',{key,value});}catch(e){log('setting',key,e.message);}};await set('theme','light');
 const realNow=Date.now.bind(Date),today=new Date();today.setHours(16,20,0,0);const at=(daysAgo,h,m)=>{const d=new Date(today);d.setDate(d.getDate()-daysAgo);d.setHours(h,m,0,0);return d.getTime();};
 const plan=[[9,0,10,10,'github.com','Pull requests'],[10,12,10,40,'mail.google.com','Inbox'],[10,41,11,30,'docs.google.com','Plan'],[13,0,13,40,'youtube.com','Talk'],[14,0,15,10,'figma.com','Design'],[15,12,15,40,'x.com','Home']];
 const record=(daysAgo,rows)=>{for(const [h1,m1,h2,m2,host,title] of rows){Date.now=()=>at(daysAgo,h1,m1);spectrum.focus(true,'https://'+host+'/','personal',title);spectrum.moment([{url:'https://'+host+'/',title,space:'personal'}]);Date.now=()=>at(daysAgo,h2,m2);spectrum.focus(false,'','personal');}};
 for(let d=6;d>=1;d--)record(d,plan.filter((_,i)=>(i+d)%5!==0));
 record(0,[[8,30,10,25,'github.com','Review'],[10,26,10,50,'stackoverflow.com','Answer'],[10,51,11,20,'github.com','Merge'],[12,30,13,30,'youtube.com','Video'],[13,31,14,10,'youtube.com','More'],[14,30,15,20,'figma.com','Design'],[15,21,16,15,'x.com','Feed']]);
 // The clock never runs behind the real one afterwards (the window's state updates are paced by it).
 if(today.getTime()<realNow())today.setTime(realNow());const offset=today.getTime()-realNow();Date.now=()=>realNow()+offset;
 const t=makeTab('https://github.com/',true);await wait(2500);
 log('debug',JSON.stringify(await js(`(async()=>{const r=document.getElementById('spectrum');const v=await window.prism.action('spectrum-view',{});return {vis:document.visibilityState,exists:!!r,hidden:r&&r.hidden,space:state.space,spectrum:state.spectrum,segs:v&&v.segments.length,err:null}})().catch(e=>({err:String(e)}))`)),snapshot().space);
 const v=spectrum.view({space:'personal'});log('typical',JSON.stringify(v.glance.typical&&{days:v.glance.typical.days,soFar:Math.round(v.glance.typical.soFar/60000)}),'notes',JSON.stringify(v.notes.map(n=>n.type+(n.tone?':'+n.tone:''))),'week',v.week.map(d=>d.active).join(','));
 try{assert.ok(v.glance.typical&&v.glance.typical.days>=3);assert.ok(v.notes.length>=2);assert.equal(v.week.length,7);}catch(e){failed=true;log('FAIL view',e.message);}
 const shot=async name=>{await wait(900);fs.writeFileSync(path.join(dir,name+'.png'),(await win.webContents.capturePage()).toPNG());log('wrote',name);};
 const band=()=>js(`(()=>{const b=document.querySelector('.spectrum-band');if(!b)return false;const r=b.getBoundingClientRect();b.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*.9,clientY:r.top+r.height/2}));return true})()`);
 const parts=()=>js(`(()=>{const c=document.querySelector('.spectrum-card');return {open:!c.hidden,hours:c.querySelectorAll('.spectrum-hour').length,notes:c.querySelectorAll('.spectrum-note').length,week:!c.querySelector('.spectrum-week').hidden,mix:c.querySelectorAll('.spectrum-mix-bar i').length,pace:c.querySelector('.spectrum-pace').textContent,total:c.querySelector('.spectrum-total').textContent,chapters:c.querySelectorAll('.spectrum-chapter').length,note:[...c.querySelectorAll('.spectrum-note strong')].map(x=>x.textContent)}})()`);
 for(const theme of ['light','dark']){await set('theme',theme);await wait(1200);log('pre',JSON.stringify(await js(`({rev:state.spectrum,hidden:document.getElementById('spectrum').hidden,priv:state.space})`)),spectrum.revision());await band();await wait(900);const p=await parts();log(theme,JSON.stringify(p));
  try{assert.ok(p.open);assert.equal(p.hours,24);assert.ok(p.notes>=2);assert.ok(p.week);assert.ok(p.mix>=3);assert.ok(p.chapters>=2);}catch(e){failed=true;log('FAIL card',e.message);}
  await shot('spectrum-'+theme);await band();await wait(400);}
 await set('theme','light');
 // Hover glance: today's total under the tabs.
 {const foot=await js(`(()=>{const b=document.querySelector('.spectrum-band'),r=b.getBoundingClientRect();b.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:r.left+r.width*.5,clientY:r.top+4}));return new Promise(ok=>setTimeout(()=>ok(document.querySelector('.spectrum-glance-foot').textContent),400))})()`);log('glance foot',foot);if(!/Today/.test(foot)){failed=true;log('FAIL glance foot');}await shot('spectrum-glance');}
 // Settings → Appearance with the slider at both ends.
 for(const value of [0,1,.5]){await set('liquidGlass',value);assert.equal(snapshot().settings.liquidGlass,value);}
 await js(`openPanel('appearance')`).catch(e=>log('open',e.message));await wait(1800);
 const tool=()=>webContents.getAllWebContents().find(wc=>/tool=/.test(wc.getURL()));
 for(const value of [0,1]){await set('liquidGlass',value);await wait(700);const wc=tool();if(!wc){log('no tool window');failed=true;break;}
  const info=await wc.executeJavaScript(`(()=>{const i=document.querySelector('[data-setting=liquidGlass]');i?.scrollIntoView({block:'center'});return {value:i&&i.value,tint:getComputedStyle(document.documentElement).getPropertyValue('--glass-tint'),fill:i&&i.style.getPropertyValue('--fill')}})()`);log('slider',value,JSON.stringify(info));
  if(Number(info.value)!==value){failed=true;log('FAIL slider value');}
  await wait(500);fs.writeFileSync(path.join(dir,'settings-glass-'+value+'.png'),(await wc.capturePage()).toPNG());}
 await set('liquidGlass',.5);
 Date.now=realNow;console.log(failed?'SPECTRUM GLANCE FLOW FAILED':'SPECTRUM GLANCE FLOW PASSED');app.exit(failed?1:0);};
