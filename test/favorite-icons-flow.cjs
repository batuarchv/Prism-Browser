// 0.39.4 (PRISM_TEST_FLOW=favorite-icons-flow.cjs, also in smoke): Favorites show their sites' icons, not letters.
// Favorites saved by an older Prism (no stored icon) and never opened get their icon fetched, a sleeping favorite keeps
// it, and a window that loads while Prism keeps changing state still gets every icon (0.39.3 sent states while the
// window was loading; the icons were lost and every tile showed its letter). Demo sites are served from memory by
// intercepting https on the smoke profile, so nothing remote is asked. nothing.example has no icon and keeps its letter.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=10000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({app,win,action,snapshot,library,warmFavoriteIcons})=>{const {session,nativeImage}=require('electron');
 const js=c=>win.webContents.executeJavaScript(c);
 const png=(r,g,b)=>{const size=32,bitmap=Buffer.alloc(size*size*4);for(let i=0;i<size*size;i++){bitmap[i*4]=b;bitmap[i*4+1]=g;bitmap[i*4+2]=r;bitmap[i*4+3]=255;}return nativeImage.createFromBitmap(bitmap,{width:size,height:size}).toPNG();};
 // Icons where sites keep them: youtube.com and github.com only at /favicon.ico, x.com also at /apple-touch-icon.png,
 // instagram.com only as a <link rel=icon> in its page, pointing at a CDN host.
 const sites={'youtube.com':{icon:png(255,0,0),files:['/favicon.ico']},'x.com':{icon:png(20,20,20),files:['/favicon.ico','/apple-touch-icon.png']},'instagram.com':{icon:png(225,48,108),files:[],link:'https://static.cdn-demo.test/rsrc/ig-192.png'},'github.com':{icon:png(36,41,47),files:['/favicon.ico']}};
 const asked=[];const ses=session.fromPartition(snapshot().browserPartition);
 ses.protocol.handle('https',req=>{const u=new URL(req.url),host=u.hostname.replace(/^www\./,''),site=sites[host];asked.push(host+u.pathname);
  if(req.url===sites['instagram.com'].link)return new Response(sites['instagram.com'].icon,{headers:{'content-type':'image/png'}});
  if(site?.files.includes(u.pathname))return new Response(site.icon,{headers:{'content-type':'image/png'}});
  if(site&&u.pathname==='/')return new Response(`<!doctype html><html><head><title>${host}</title>${site.link?`<link rel="icon" sizes="192x192" href="${site.link}">`:''}</head><body>${host}</body></html>`,{headers:{'content-type':'text/html'}});
  return new Response('<!doctype html><title>Not found</title>',{status:404,headers:{'content-type':'text/html'}});});
 const shots=path.resolve(__dirname,'../reports/'+require('../package.json').version);fs.mkdirSync(shots,{recursive:true});
 const shot=async name=>fs.writeFileSync(path.join(shots,(process.env.PRISM_SHOT_PREFIX?process.env.PRISM_SHOT_PREFIX+'-':'')+name),(await win.webContents.capturePage()).toPNG());
 const solo=process.env.PRISM_TEST_FLOW?.includes('favorite-icons');
 const urls=['https://youtube.com/','https://x.com/','https://www.instagram.com/','https://github.com/','https://nothing.example/'];
 const tiles=()=>js(`[...document.querySelectorAll('#favorites [data-favorite-id^="icon-"]')].map(b=>({url:b.title.split('\\n')[1],loaded:!!b.querySelector('.bookmark-icon img.site-icon')?.naturalWidth,letter:b.querySelector('.monogram')?.textContent||''}))`);
 const check=async when=>{const result=await tiles();assert.equal(result.length,urls.length,when+': every favorite has a tile');
  for(const t of result.filter(t=>!t.url.includes('nothing.example')))assert.ok(t.loaded&&!t.letter,`${when}: ${t.url} shows its icon, not the letter ${t.letter}`);
  assert.equal(result.find(t=>t.url.includes('nothing.example'))?.letter,'N',when+': a site with no icon keeps its letter');};
 const added=[],style=snapshot().settings.favoriteStyle;
 try{
  try{await js("if(typeof onboardingOpen!=='undefined'&&onboardingOpen)document.getElementById('setup-skip').click()");}catch{}await delay(400);
  // Favorites as an older Prism saved them: in library.json, no icon anywhere, no tab ever opened for them.
  const lib=library();for(const url of urls){const id='icon-'+new URL(url).hostname;added.push(id);lib.bookmarks.push({id,title:new URL(url).hostname,url,folder:'',favorite:true});}
  await action('bookmark-move',{id:'icon-nothing.example',favorite:true});
  const cached=!!snapshot().images?.['https://www.instagram.com']?.icon;await warmFavoriteIcons();
  await eventually(async()=>(await tiles()).filter(t=>t.loaded).length===4,'favorites without a stored icon get one');
  await check('backfilled');
  assert.ok(cached||asked.includes('static.cdn-demo.test/rsrc/ig-192.png'),'an icon declared only in the page is used');
  // A favorite whose tab went to sleep keeps its icon.
  const xTab=()=>snapshot().tabs.find(t=>t.favoriteId==='icon-x.com');
  await action('open-bookmark','icon-x.com');await eventually(()=>xTab()&&!xTab().loading,'x.com favorite opens');
  await action('new');await delay(300);await action('sleep');await eventually(()=>xTab()?.sleeping,'x.com tab sleeps');await check('asleep');
  // The window loads again while Prism keeps changing state: it still gets every icon once it has loaded.
  const busy=setInterval(()=>action('set-setting',{key:'favoriteStyle',value:snapshot().settings.favoriteStyle==='cards'?'icons':'cards'}).catch(()=>{}),4);
  try{win.webContents.reload();await new Promise(r=>win.webContents.once('did-finish-load',r));}finally{clearInterval(busy);}
  await eventually(async()=>(await tiles()).filter(t=>t.loaded).length===4,'icons after the window loads while busy').catch(()=>{});
  try{await js("if(typeof onboardingOpen!=='undefined'&&onboardingOpen)document.getElementById('setup-skip').click()");}catch{}await delay(400);
  await shot('favorite-icons.png');
  await check('after reload');
  if(solo)console.log(JSON.stringify({ok:true}));
  return ['favorite icons: older favorites without icons get them, sleeping ones keep them, a busy window load keeps them'];
 }catch(error){if(solo){console.error(error);app.exit(1);}throw error;}
 finally{ses.protocol.unhandle('https');await action('set-setting',{key:'favoriteStyle',value:style}).catch(()=>{});const lib=library();lib.bookmarks=lib.bookmarks.filter(b=>!added.includes(b.id));for(const t of snapshot().tabs.filter(t=>added.includes(t.favoriteId)))await action('close',t.id).catch(()=>{});if(solo)setTimeout(()=>app.exit(0),100);}
};
