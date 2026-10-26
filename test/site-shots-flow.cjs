// Website renders (PRISM_TEST_FLOW=site-shots-flow.cjs): real Prism windows with made-up local pages, for the project
// site. Demo sites are served from memory by intercepting https on the smoke profile, so nothing personal or remote is
// shown. Each shot composites the window with its visible popovers and tool windows. Output: PRISM_SHOTS or
// reports/site-shots.
const fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));

const icon=(a,b,glyph)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="43" font-family="Helvetica" font-weight="700" font-size="30" text-anchor="middle" fill="#fff">${glyph}</text></svg>`);
const base=`*{box-sizing:border-box;margin:0}body{font:17px/1.6 -apple-system,"SF Pro Text",Helvetica,sans-serif;color:#16171b;background:#fbfaf7;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
nav{display:flex;align-items:center;gap:28px;padding:22px 56px;font-size:14px;color:#5b5d66}nav b{color:#16171b;font-size:17px;margin-right:auto;letter-spacing:-.01em}`;
const trackers=['https://www.googletagmanager.com/gtag/js?id=G-DEMO','https://www.google-analytics.com/analytics.js','https://connect.facebook.net/en_US/fbevents.js','https://static.hotjar.com/c/hotjar-1.js','https://securepubads.g.doubleclick.net/tag/js/gpt.js','https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js','https://cdn.taboola.com/libtrc/demo/loader.js','https://widgets.outbrain.com/outbrain.js','https://sb.scorecardresearch.com/beacon.js','https://cdn.segment.com/analytics.js/v1/demo/analytics.min.js','https://bat.bing.com/bat.js','https://snap.licdn.com/li.lms-analytics/insight.min.js','https://static.ads-twitter.com/uwt.js','https://s.pinimg.com/ct/core.js','https://analytics.tiktok.com/i18n/pixel/events.js','https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js','https://js.hs-analytics.net/analytics/demo.js','https://cdn.amplitude.com/libs/analytics-browser-2.0.0-min.js.gz','https://www.clarity.ms/tag/demo','https://cdn.heapanalytics.com/js/heap-demo.js','https://ads.pubmatic.com/AdServer/js/pwt/demo.js','https://c.amazon-adsystem.com/aax2/apstag.js','https://cdn.optimizely.com/js/demo.js'];
const trackerTags=trackers.map(u=>`<script async src="${u}"></script>`).join('')+'<iframe src="https://googleads.g.doubleclick.net/pagead/ads?demo=1" style="display:none"></iframe>';

const pages={
 'lumen.press':{title:'On light and slowness — Lumen',icon:icon('#ff8a5c','#8a5cff','L'),html:`<style>${base}
 .hero{margin:8px 56px 0;height:340px;border-radius:28px;background:radial-gradient(120% 140% at 0% 100%,#ffb38a 0,transparent 55%),radial-gradient(100% 120% at 100% 0%,#9d8cff 0,transparent 60%),linear-gradient(120deg,#ffe7d6,#e6e4ff 60%,#d8f1ff);position:relative;overflow:hidden}
 .hero:after{content:"";position:absolute;left:-10%;top:58%;width:120%;height:3px;background:linear-gradient(90deg,#fff0,#fff 30%,#ff5d73 48%,#ffb547 54%,#7ad97a 60%,#4cb6ff 66%,#8f7bff 72%,#fff0);transform:rotate(-8deg);filter:blur(.4px);box-shadow:0 0 30px #fff}
 article{max-width:720px;margin:44px auto 80px;padding:0 24px}.kicker{font:600 12px/1 -apple-system;letter-spacing:.14em;text-transform:uppercase;color:#a0522d}
 h1{font:700 54px/1.04 "New York","Iowan Old Style",Georgia,serif;letter-spacing:-.02em;margin:14px 0 18px}.dek{font:400 22px/1.45 "New York",Georgia,serif;color:#4a4c55}
 .by{display:flex;gap:10px;align-items:center;margin:26px 0 30px;font-size:14px;color:#6b6d76}.by i{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#ffb38a,#9d8cff)}
 p{margin:0 0 18px;font:19px/1.7 "New York",Georgia,serif;color:#2a2b31}</style>
 <nav><b>Lumen</b><a>Essays</a><a>Field notes</a><a>Photography</a><a>Subscribe</a></nav><div class="hero"></div>
 <article><div class="kicker">Essay · 9 min read</div><h1>On light and slowness</h1><div class="dek">A white beam goes in. A spectrum comes out. What a piece of glass can teach us about attention.</div>
 <div class="by"><i></i>Mara Ilves · October 2026</div>
 <p>Newton bought his first prism at a fair in 1665. He darkened his room, cut a small hole in the shutter, and let a single beam of sunlight fall through the glass onto the far wall. What came out was not white. It was a long ribbon of colour, red at one end and violet at the other, and it changed how we think about light.</p>
 <p>The trick of a prism is that it does nothing to the light that was not already there. It only slows each colour by a slightly different amount, so that what travelled together starts to spread apart. The glass does not add. It reveals.</p>
 <p>Good tools work the same way. They step back, slow the right things down, and let you see what was already in front of you.</p></article>${trackerTags}`},
 'chroma.gallery':{title:'Chroma — Autumn collection',icon:icon('#ff5d8f','#ffb547','C'),html:`<style>${base}body{background:#0f1013;color:#f4f2ee}nav{color:#9a9ba3}nav b{color:#fff}
 header{padding:30px 56px 26px}h1{font:600 64px/1 -apple-system,"SF Pro Display";letter-spacing:-.035em}h1 span{color:#8b8c94}
 .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 56px 60px}.card{border-radius:22px;height:260px;position:relative;overflow:hidden}.card.tall{grid-row:span 2;height:auto}
 .card em{position:absolute;left:18px;bottom:16px;font:500 13px -apple-system;font-style:normal;color:#fff;text-shadow:0 1px 8px #0006}
 .a{background:radial-gradient(80% 80% at 30% 20%,#ffd36e,#ff6a3d 55%,#7a1f3d)}.b{background:conic-gradient(from 200deg at 60% 60%,#3a2cff,#ff4fa3,#ffb547,#3a2cff)}.c{background:linear-gradient(160deg,#0a3d62,#38ada9 60%,#f8efba)}
 .d{background:radial-gradient(60% 60% at 70% 30%,#c7f5ff,#4c7dff 50%,#1b1446)}.e{background:linear-gradient(200deg,#ff9a8b,#ff6a88 45%,#ff99ac)}.f{background:repeating-linear-gradient(115deg,#f4f2ee 0 14px,#e14d2a 14px 28px,#f4f2ee 28px 42px,#1f4e79 42px 56px)}</style>
 <nav><b>Chroma</b><a>Collections</a><a>Artists</a><a>Prints</a><a>Cart (0)</a></nav><header><h1>Autumn collection <span>2026</span></h1></header>
 <div class="grid"><div class="card a tall"><em>Ember, 2026 · Ines Okafor</em></div><div class="card b"><em>Spectral drift</em></div><div class="card c"><em>Low tide</em></div><div class="card d"><em>Cold light</em></div><div class="card e"><em>Peach hour</em></div><div class="card f"><em>Signal</em></div></div>${trackerTags}`},
 'orbit.travel':{title:'Lisbon in three days — Orbit',icon:icon('#2bb3a3','#2160d8','O'),html:`<style>${base}body{background:#f3f6f8}
 .wrap{display:grid;grid-template-columns:1.1fr 1fr;gap:28px;padding:10px 56px 60px}.map{border-radius:26px;min-height:560px;background:#dfe9ee;position:relative;overflow:hidden}
 .map svg{position:absolute;inset:0;width:100%;height:100%}h1{font:700 44px/1.05 -apple-system,"SF Pro Display";letter-spacing:-.03em;margin:10px 0 8px}.sub{color:#5d6670;margin-bottom:24px}
 .day{background:#fff;border-radius:20px;padding:18px 20px;margin-bottom:14px;box-shadow:0 1px 2px #0000000d}.day b{display:block;font-size:13px;color:#2160d8;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px}.day span{display:block;color:#3c434b;font-size:15px}</style>
 <nav><b>Orbit</b><a>Trips</a><a>Saved</a><a>Guides</a></nav><div class="wrap"><div class="map"><svg viewBox="0 0 600 560"><path d="M0 380 C120 340 180 420 300 380 S520 300 600 340 V560 H0Z" fill="#b9d7e6"/><path d="M60 120 C160 160 220 90 320 150 S470 230 560 170" stroke="#fff" stroke-width="10" fill="none"/><path d="M120 300 L220 210 L330 260 L430 190" stroke="#2160d8" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/><g fill="#2160d8"><circle cx="120" cy="300" r="10"/><circle cx="220" cy="210" r="10"/><circle cx="330" cy="260" r="10"/><circle cx="430" cy="190" r="12" fill="#ff6a3d"/></g></svg></div>
 <div><h1>Lisbon in three days</h1><div class="sub">Tiles, trams and the best pastel de nata, planned around the light.</div><div class="day"><b>Day 1 · Alfama</b><span>Miradouro de Santa Luzia at sunrise, then the 28 tram down to Baixa.</span></div><div class="day"><b>Day 2 · Belém</b><span>Pastéis de Belém before ten, the Tower by the water, MAAT in the afternoon.</span></div><div class="day"><b>Day 3 · LX Factory</b><span>Bookshops in a print works, dinner across the river in Cacilhas.</span></div></div></div>${trackerTags}`},
 'northwind.studio':{title:'Northwind — Notes',icon:icon('#6b7280','#111827','N'),html:`<style>${base}body{background:#fff}.doc{max-width:760px;margin:30px auto;padding:0 24px}h1{font:700 40px/1.1 -apple-system;letter-spacing:-.025em;margin-bottom:20px}li{margin:8px 0;color:#30333a}</style>
 <nav><b>Northwind</b><a>Docs</a><a>Changelog</a></nav><div class="doc"><h1>Launch checklist</h1><ul><li>Final copy for the landing page</li><li>Screenshots in light and dark</li><li>Release notes, one line per change</li><li>Tell the people who asked for it</li></ul></div>`},
 'radio.fm':{title:'Late Night Radio',icon:icon('#ff4fa3','#3a2cff','R'),html:`<style>${base}body{background:linear-gradient(160deg,#1b1446,#3a2cff 60%,#ff4fa3);color:#fff;min-height:100vh}nav{color:#ffffffb0}nav b{color:#fff}h1{font:700 60px/1 -apple-system;letter-spacing:-.03em;padding:80px 56px 0}</style><nav><b>Radio</b><a>Live</a><a>Shows</a></nav><h1>Late Night Radio</h1>`}
};

exports.run=async({app,win,action,commandBar,peek,spectrum,makeTab,selectTab})=>{const {BrowserWindow,session}=require('electron');
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/site-shots');fs.mkdirSync(dir,{recursive:true});
 const js=code=>win.webContents.executeJavaScript(code);const log=(...a)=>console.log('[site-shots]',...a);
 // Demo sites from memory; the listed tracker hosts get an empty answer if Shield lets them through.
 const ses=session.fromPartition('persist:smoke');
 ses.protocol.handle('https',req=>{const u=new URL(req.url);const host=u.hostname.replace(/^www\./,'');
  if(pages[host])return new Response('<!doctype html><html><head><meta charset="utf-8"><title>'+pages[host].title+'</title><link rel="icon" href="'+pages[host].icon+'"></head><body>'+pages[host].html+'</body></html>',{headers:{'content-type':'text/html; charset=utf-8'}});
  return new Response('',{status:200,headers:{'content-type':'text/javascript'}});});
 // A clock in the early evening, so Spectrum has a day behind it.
 const realNow=Date.now.bind(Date),evening=new Date();evening.setHours(18,42,0,0);const offset=evening-realNow();Date.now=()=>realNow()+offset;
 try{await js('typeof finishSetup==="function"&&finishSetup()');}catch{}await wait(800);
 win.setSize(1440,900);win.center();win.webContents.setBackgroundThrottling(false);
 const set=async(key,value)=>{try{await action('set-setting',{key,value});}catch(e){log('setting',key,e.message);}};
 await set('theme','light');await set('addressBar','sidebar');await set('searchSuggestions',false);
 for(const [title,url] of [['Lumen','https://lumen.press/'],['Chroma','https://chroma.gallery/'],['Orbit','https://orbit.travel/'],['Radio','https://radio.fm/']])await action('save-bookmark',{title,url,favorite:true}).catch(()=>{});
 await action('save-bookmark',{title:'Launch checklist',url:'https://northwind.studio/',folder:'Projects'}).catch(()=>{});
 // Spectrum: a believable day, recorded with the clock moved back.
 const day=new Date(evening);const at=(h,m)=>new Date(day).setHours(h,m,0,0);
 const segs=[[9,5,10,40,'northwind.studio','Launch checklist'],[10,40,11,30,'lumen.press','On light and slowness'],[11,30,12,20,'northwind.studio','Launch checklist'],[13,10,14,0,'radio.fm','Late Night Radio'],[14,5,15,30,'chroma.gallery','Autumn collection'],[15,30,16,10,'lumen.press','Essays'],[17,0,18,35,'orbit.travel','Lisbon in three days']];
 for(const [h1,m1,h2,m2,host,title] of segs){Date.now=()=>at(h1,m1);spectrum.presence('https://'+host+'/','personal',title);spectrum.moment([{url:'https://'+host+'/',title,space:'personal'},{url:'https://lumen.press/',title:'Lumen',space:'personal'}]);Date.now=()=>at(h2,m2);spectrum.presence('','personal');}
 Date.now=()=>realNow()+offset;
 try{const v=spectrum.view({space:'personal'});spectrum.setInsights(v.insightsKey,{titles:['Writing the launch plan','Reading about light','Back to the checklist','Lunch break radio','Looking for prints','More essays','Planning Lisbon'],summary:'A focused morning of planning, then a trip taking shape.'},'personal');spectrum.setInsights(spectrum.view({}).insightsKey,{titles:['Writing the launch plan','Reading about light','Back to the checklist','Lunch break radio','Looking for prints','More essays','Planning Lisbon'],summary:'A focused morning of planning, then a trip taking shape.'},'');}catch(e){log('insights',e.message);}
 // Tabs.
 const urls=['https://chroma.gallery/','https://orbit.travel/','https://northwind.studio/','https://lumen.press/'];const made=[];for(const u of urls)made.push(makeTab(u,false));
 selectTab(made[3].id);await wait(4500);

 // Composite: the window, then every other visible window (popovers, Beam, Lens, tool windows) where it sits on screen.
 const shot=async(name,{glass='rgba(246,246,248,.94)'}={})=>{await wait(1100);const views=[];const cb=win.getContentBounds();
  for(const v of win.contentView.children){if(!v.webContents||v.webContents.isDestroyed())continue;try{if(v.getVisible&&!v.getVisible())continue;const b=v.getBounds();if(b.width<2||b.height<2)continue;views.push({x:b.x,y:b.y,w:b.width,h:b.height,src:(await v.webContents.capturePage()).toDataURL()});}catch{}}
  for(const other of BrowserWindow.getAllWindows()){if(other===win||!other.isVisible()||other.isDestroyed())continue;try{const b=other.getContentBounds();if(b.width<2)continue;views.push({x:b.x-cb.x,y:b.y-cb.y,w:b.width,h:b.height,win:true,src:(await other.webContents.capturePage()).toDataURL()});
   for(const v of other.contentView.children){if(!v.webContents||v.webContents===other.webContents||v.webContents.isDestroyed())continue;const vb=v.getBounds();views.push({x:b.x-cb.x+vb.x,y:b.y-cb.y+vb.y,w:vb.width,h:vb.height,src:(await v.webContents.capturePage()).toDataURL()});}}catch{}}
  await js(`(()=>{document.querySelectorAll('.site-shot-layer').forEach(e=>e.remove());for(const v of ${JSON.stringify(views)}){const i=document.createElement('img');i.className='site-shot-layer';i.src=v.src;i.style.cssText='position:fixed;z-index:99999;pointer-events:none;left:'+v.x+'px;top:'+v.y+'px;width:'+v.w+'px;height:'+v.h+'px;border-radius:'+(v.win?'16px;box-shadow:0 24px 70px #0004;background:${glass}':'10px');document.body.append(i);}})()`);
  await wait(500);fs.writeFileSync(path.join(dir,name+'.png'),(await win.webContents.capturePage()).toPNG());await js(`document.querySelectorAll('.site-shot-layer').forEach(e=>e.remove())`);log('wrote',name,views.length);};
 // Tool panels (Settings) live in their own window; close them from inside it.
 const closeTools=async()=>{for(const wc of require('electron').webContents.getAllWebContents())if(/tool=/.test(wc.getURL()))await wc.executeJavaScript('typeof closePanel==="function"&&closePanel()').catch(()=>{});await action('close-tool').catch(()=>{});await wait(900);};
 const band=x=>js(`(()=>{const b=document.querySelector('.spectrum-band');if(!b)return false;const r=b.getBoundingClientRect();b.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*${x},clientY:r.top+r.height/2}));return true})()`);
 const titles=()=>{for(const scope of ['personal','']){try{const v=spectrum.view(scope?{space:scope}:{});spectrum.setInsights(v.insightsKey,{titles:['Writing the launch plan','Prints and essays','Planning Lisbon'],summary:'A focused morning of planning, then a trip taking shape.'},scope);}catch(e){log('insights',e.message);}}};
 const step=async(name,fn)=>{try{await fn();}catch(e){log('failed',name,e.stack||e.message);}};

 await step('sidebar-light',()=>shot('sidebar-light'));
 await step('shield',async()=>{await js(`openPanel('blocking')`);await shot('shield');await closeTools();});
 await step('spectrum',async()=>{titles();await band(.82).then(f=>log('spectrum band',f));await wait(600);titles();await shot('spectrum');await band(.82);});
 await step('beam',async()=>{await commandBar().open('li');await wait(1500);await shot('beam');commandBar().hide?.();await wait(500);});
 await step('lens',async()=>{peek().open('https://chroma.gallery/','personal');await wait(2500);await shot('lens');peek().close?.();await wait(500);});
 await step('bypass',async()=>{await set('bypassNormal','sites');win.webContents.send('open-panel','private');await wait(1500);
  for(const wc of require('electron').webContents.getAllWebContents())if(/tool=/.test(wc.getURL()))await wc.executeJavaScript(`document.querySelector('[data-pane=private]')?.scrollIntoView()`).catch(()=>{});
  await shot('bypass');await closeTools();await set('bypassNormal','off');});
 await step('newtab',async()=>{const t=makeTab('',true);await wait(2000);await shot('newtab');});
 await step('sidebar-dark',async()=>{selectTab(made[0].id);await set('theme','dark');await wait(1500);await shot('sidebar-dark',{glass:'rgba(36,37,42,.94)'});});
 await step('spectrum-dark',async()=>{titles();await band(.82);await wait(600);titles();await shot('spectrum-dark',{glass:'rgba(36,37,42,.94)'});await band(.82);});
 await step('clear-view',async()=>{await set('theme','light');selectTab(made[1].id);await set('compactMode',true);await wait(1500);await shot('clear-view');await set('compactMode',false);});
 await step('topbar',async()=>{await set('addressBar','top');selectTab(made[3].id);await wait(1500);await shot('topbar');});
 Date.now=realNow;app.exit(0);};
