// 0.39.3 (PRISM_TEST_FLOW=favorite-cards-flow.cjs): Favorites as Preview cards. A favorite, also one made by dragging
// a tab onto Favorites (0.39.2), gets its page preview, and the new tab shows the cards with that preview. 0.39.0's
// quiet new tab hid the whole grid, so the setting did nothing; this keeps it from silently breaking again.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({app,win,makeTab,selectTab,action,snapshot,library})=>{
 const js=c=>win.webContents.executeJavaScript(c);
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(`<!doctype html><title>Card ${req.url}</title><body style="margin:0;height:100vh;background:#3a7bd5"><h1 style="color:#fff;font:600 60px system-ui;padding:40px">Card page</h1></body>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const shots=path.resolve(__dirname,'../reports/'+require('../package.json').version);fs.mkdirSync(shots,{recursive:true});
 const shot=async name=>fs.writeFileSync(path.join(shots,name),(await win.webContents.capturePage()).toPNG());
 const solo=process.env.PRISM_TEST_FLOW?.includes('favorite-cards');
 try{
  try{await js("if(typeof onboardingOpen!=='undefined'&&onboardingOpen)document.getElementById('setup-skip').click()");}catch{}await delay(400);
  await action('set-setting',{key:'favoriteStyle',value:'cards'});
  const t=makeTab(base+'/one');await eventually(()=>!t.loading&&t.view?.webContents.getURL(),'page load');selectTab(t.id);win.show();win.focus();await delay(600);
  // The tab becomes a favorite the way a drag onto Favorites does it.
  await action('tab-to-favorite',{id:t.id,index:0});
  const fav=library().bookmarks.find(b=>b.favorite&&b.url===t.url);assert.ok(fav,'tab became a favorite');
  const thumb=await eventually(()=>/^data:image\/jpeg;base64,/.test(snapshot().images?.[t.url]?.thumbnail||''),'the new favorite gets its page preview without a reload').then(()=>true,e=>e);
  // On a new tab the favorites show as cards with that preview.
  await action('new');await delay(600);await js(`document.activeElement?.blur();typeof closePanel==='function'&&panel?closePanel():null`);await action('overlay',false);await delay(900);
  const home=await js(`(()=>{const grid=document.getElementById('home-favorites'),card=grid.querySelector('[data-favorite-id="${fav.id}"]'),img=card?.querySelector('.favorite-preview img'),r=card?.getBoundingClientRect();
   return {cards:grid.classList.contains('cards'),shown:getComputedStyle(grid).display!=='none'&&!!r&&r.width>40&&r.height>40,image:!!img&&img.complete&&img.naturalWidth>0}})()`);
  await shot(process.env.PRISM_SHOT_PREFIX?process.env.PRISM_SHOT_PREFIX+'-favorite-cards.png':'favorite-cards.png');
  if(thumb!==true)throw thumb;
  assert.deepEqual(home,{cards:true,shown:true,image:true},'new tab shows the favorite as a preview card');
  // Site icons keep the quiet new tab: only the logo and the bar.
  await action('set-setting',{key:'favoriteStyle',value:'icons'});await delay(500);
  assert.equal(await js(`getComputedStyle(document.getElementById('home-favorites')).display`),'none','icons style keeps the new tab quiet');
  if(solo){console.log(JSON.stringify({ok:true}));}
  return ['favorite preview cards: a new favorite gets its preview and the new tab shows it'];
 }catch(error){if(solo){console.error(error);app.exit(1);}throw error;}
 finally{server.close();if(solo)setTimeout(()=>app.exit(0),100);}
};
