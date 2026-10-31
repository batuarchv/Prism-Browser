// 0.46 Lens quick browser (smoke profile, local pages): Lens over the page has an editable address, back/forward and a
// clean Copy link; Keep open lifts it into a movable Lens window; ⌥⌘N opens a blank one ready for an address; Open as
// tab promotes it. Tidy tabs archives idle tabs and Undo brings them back.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({app,win,makeTab,selectTab,action,snapshot,tabs,peek})=>{const {clipboard}=require('electron');
 const server=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end(`<title>Page ${q.url.split('?')[0].slice(1)}</title><body style="font:40px system-ui;background:#eef">Page ${q.url}</body>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,host=base.slice(7);
 const reports=path.resolve(__dirname,'../reports');fs.mkdirSync(reports,{recursive:true});
 const bar=l=>l.win.webContents,js=(l,code)=>bar(l).executeJavaScript(code),page=l=>l.view.webContents;
 const field=l=>js(l,"document.getElementById('peek-address').value");
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
  const home=makeTab(base+'/home');selectTab(home.id);await eventually(()=>home.view&&!home.view.webContents.isLoading(),'home tab');
  // Lens over the page.
  assert.equal(peek().open(base+'/a','personal'),true);let l=peek().lens();
  await eventually(async()=>!page(l).isLoading()&&page(l).getURL()===base+'/a'&&await field(l)===host+'/a','Lens shows the address at rest');
  assert.equal(await js(l,"document.body.dataset.kind"),'peek');
  // Edit the address: the field shows the full URL while editing, Return loads it, Back returns.
  await js(l,`(()=>{const f=document.getElementById('peek-address');f.focus();f.value=${JSON.stringify(base+'/b')};document.getElementById('peek-form').requestSubmit();return true;})()`);
  await eventually(()=>page(l).getURL()===base+'/b'&&!page(l).isLoading(),'Lens loads a typed address');
  await eventually(async()=>!await js(l,"document.getElementById('peek-back').disabled"),'Back is available');
  await js(l,"document.getElementById('peek-back').click();true");await eventually(()=>page(l).getURL()===base+'/a','Back goes back');
  // Copy link copies the clean address.
  await page(l).loadURL(base+'/c?id=7&utm_source=news&fbclid=abc');await eventually(()=>!page(l).isLoading(),'tracked page');
  await clipboard.writeText('');await js(l,"document.getElementById('peek-copy').click();true");let copied='';await eventually(async()=>(copied=await clipboard.readText())===base+'/c?id=7','clean link copied: '+copied);
  await delay(400);fs.writeFileSync(path.join(reports,'lens-bar.png'),(await bar(l).capturePage()).toPNG());
  // Keep open: same page, now a Lens window that stays and can move.
  await js(l,"document.getElementById('peek-detach').click();true");await eventually(()=>!peek().isOpen()&&peek().windows().length===1,'Lens becomes a Lens window');
  l=peek().windows()[0];assert.equal(l.win.isResizable(),true);assert.equal(l.win.isMovable(),true);assert.match(page(l).getURL(),/\/c\?id=7/,'same page after Keep open');
  await eventually(async()=>await js(l,"document.body.dataset.kind")==='window'&&await js(l,"document.getElementById('peek-detach').hidden"),'window bar');
  win.focus();await delay(400);assert.equal(peek().windows().length,1,'a Lens window stays when the browser has focus');
  // ⌥⌘N: a blank Lens window with the address ready.
  await action('lens-window');assert.equal(peek().windows().length,2);const blank=peek().windows()[1];
  await eventually(async()=>!await js(blank,"document.getElementById('peek-empty').hidden"),'blank window shows the hint');
  assert.equal(await js(blank,"document.getElementById('peek-tab').hidden"),true);
  await js(blank,`(()=>{const f=document.getElementById('peek-address');f.value=${JSON.stringify(base+'/d')};document.getElementById('peek-form').requestSubmit();return true;})()`);
  await eventually(()=>page(blank).getURL()===base+'/d','blank window loads');await eventually(async()=>await js(blank,"document.getElementById('peek-empty').hidden"),'hint hides');
  // Open as tab promotes the page.
  const before=snapshot().tabs.length;await js(blank,"document.getElementById('peek-tab').click();true");
  await eventually(()=>snapshot().tabs.length===before+1&&peek().windows().length===1,'Open as tab');assert.ok(snapshot().tabs.some(x=>x.url===base+'/d'));
  peek().closeAll();assert.equal(peek().windows().length,0);
  // Tidy tabs: idle tabs go to the archive, Undo brings them back.
  const idle=[makeTab(base+'/old1'),makeTab(base+'/old2')];await delay(800);selectTab(home.id);await delay(200);for(const x of idle)x.lastUsed=Date.now()-3600000;
  const count=snapshot().tabs.length,result=await action('tidy');assert.equal(result?.count>=2,true,'tidied: '+JSON.stringify(result));
  assert.ok(!snapshot().tabs.some(x=>x.url===base+'/old1'),'idle tab tidied');assert.ok(snapshot().tabs.some(x=>x.id===home.id),'active tab stays');
  await action('undo');await eventually(()=>snapshot().tabs.some(x=>x.url===base+'/old1')&&snapshot().tabs.some(x=>x.url===base+'/old2'),'Undo restores tidied tabs');
  assert.equal(snapshot().tabs.length,count);
  const again=await action('tidy');assert.ok(again?.count>=0||again?.message);
  console.log('LENS FLOW OK');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}finally{server.close();}};
