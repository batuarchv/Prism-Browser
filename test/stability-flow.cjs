// Long stability run on real sites (Electron upgrades; PRISM_TEST_FLOW=stability-flow.cjs, PRISM_STABILITY_MINUTES=12):
// real tabs opened, switched, slept, closed and reopened for the whole run while crashes, gone renderers and any quit
// Prism did not ask for are logged. 0.40.0 quit on its own without a crash dump, so an early quit fails the run.
const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,selectTab,sleepTab,tabs,action})=>{
 const minutes=Number(process.env.PRISM_STABILITY_MINUTES)||12,end=Date.now()+minutes*60000,events=[];let finished=false;
 const note=(kind,detail)=>{const e={t:Math.round((Date.now()-end)/1000+minutes*60),kind,...detail};events.push(e);console.log('STABILITY-EVENT '+JSON.stringify(e));};
 app.on('render-process-gone',(_e,wc,d)=>note('render-process-gone',{url:wc.getURL?.().slice(0,80),reason:d.reason,exitCode:d.exitCode}));
 app.on('child-process-gone',(_e,d)=>note('child-process-gone',{type:d.type,reason:d.reason,exitCode:d.exitCode,name:d.name}));
 app.on('before-quit',()=>{if(!finished)note('unexpected-quit',{stack:new Error().stack.split('\n').slice(1,8).join(' | ')});});
 win.on('closed',()=>{if(!finished)note('window-closed',{});});
 process.on('uncaughtException',e=>note('uncaught',{message:String(e?.stack||e).slice(0,400)}));
 process.on('unhandledRejection',e=>note('unhandled-rejection',{message:String(e?.stack||e).slice(0,400)}));
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 const sites=['https://www.youtube.com/watch?v=aqz-KE-bpKQ','https://github.com/electron/electron','https://en.wikipedia.org/wiki/Prism','https://www.bbc.com/news','https://www.reddit.com/r/macapps/','https://x.com/explore','https://www.theverge.com/','https://maps.google.com/'];
 const opened=[];for(const url of sites){opened.push(makeTab(url,true));await wait(3000);}
 let round=0,maxMem=0;
 while(Date.now()<end){
  round++;
  const live=tabs.filter(t=>opened.includes(t));
  for(const t of live){selectTab(t.id);await wait(2500);}
  if(round%3===0&&live.length>2){const t=live[live.length-1];try{await sleepTab(t,true);}catch(e){note('sleep-error',{message:String(e)});}}
  if(round%4===0&&live.length>3){const t=live[1];await action('close',t.id);opened.splice(opened.indexOf(t),1);opened.push(makeTab(sites[round%sites.length],true));}
  const m=app.getAppMetrics(),mem=Math.round(m.reduce((a,p)=>a+p.memory.workingSetSize,0)/1024);maxMem=Math.max(maxMem,mem);
  console.log('STABILITY-TICK '+JSON.stringify({round,elapsedS:Math.round(minutes*60-(end-Date.now())/1000),tabs:tabs.length,awake:tabs.filter(t=>t.view).length,processes:m.length,memMB:mem}));
  await wait(5000);
 }
 finished=true;const bad=events.filter(e=>!['sleep-error'].includes(e.kind)&&!(e.kind==='child-process-gone'&&e.reason==='clean-exit')&&!(e.kind==='render-process-gone'&&e.reason==='clean-exit'));
 console.log('STABILITY '+JSON.stringify({minutes,rounds:round,maxMemMB:maxMem,events:events.length,problems:bad,electron:process.versions.electron,chrome:process.versions.chrome}));
 app.exit(bad.length?1:0);
};
