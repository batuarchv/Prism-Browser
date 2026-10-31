// 0.45 Reader view (smoke profile, local pages): the address bar offers Reader on an article and not on a short page,
// Reader shows the article without navigation, sidebars or comments, keeps its appearance choices, opens links in the
// tab, and leaves Reader when the tab navigates.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
const para=i=>`<p>Paragraph ${i} of the story, where the glassmaker explains how light bends through a prism, why the colours separate, and what that means for the people who build browsers, windows and lenses for a living.</p>`;
const ARTICLE=`<!doctype html><html lang="en"><head><title>How light bends | The Glass Gazette</title><meta property="og:site_name" content="The Glass Gazette"><meta name="author" content="Ada Lovelace"><meta property="article:published_time" content="2026-10-29T10:00:00Z"></head><body>
<header class="site-header"><nav><a href="/">Home</a> <a href="/news">News</a> <a href="/sport">Sport</a> MENU-TEXT</nav></header>
<div class="layout"><aside class="sidebar"><h3>Trending</h3><ul><li><a href="/a">SIDEBAR-LINK one</a></li><li><a href="/b">SIDEBAR-LINK two</a></li></ul></aside>
<article class="post"><h1>How light bends</h1><p class="byline">By Ada Lovelace</p>${[1,2,3].map(para).join('')}<figure><img src="/photo.png" width="600" alt="A prism"><figcaption>A prism on a desk.</figcaption></figure>
<h2>The colours</h2>${[4,5].map(para).join('')}<blockquote>Light is a wave and a particle, and a very good teacher.</blockquote><ul><li>Red bends least</li><li>Violet bends most</li></ul><pre><code>n = c / v</code></pre>
<p>Read <a href="/next">the next story</a> for more about lenses and their long, careful history in optics.</p>${[6,7].map(para).join('')}</article>
<section class="comments"><h3>Comments</h3><p>COMMENT-TEXT great article, I loved every word of it and would like to share it with my friends, family and neighbours.</p></section></div>
<footer>FOOTER-TEXT © The Glass Gazette</footer><script>document.title+=''</script></body></html>`;
exports.run=async({app,win,makeTab,selectTab,action,snapshot,settings,reader})=>{
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
 const server=http.createServer((q,r)=>{if(q.url==='/photo.png'){r.writeHead(200,{'Content-Type':'image/png'});r.end(png);return;}r.writeHead(200,{'Content-Type':'text/html'});
  r.end(q.url==='/story'?ARTICLE:q.url==='/next'?'<title>Next story</title><p>Next</p>':'<title>Short</title><p>Just a short page.</p>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
  const t=makeTab(base+'/short');selectTab(t.id);const active=()=>snapshot().tabs.find(x=>x.id===t.id);
  await eventually(()=>t.view&&!t.view.webContents.isLoading()&&t.view.webContents.getTitle()==='Short','short page');await delay(1500);
  assert.equal(!!active().readerable,false,'no Reader on a short page');
  assert.match(String((await action('reader-toggle'))?.error||''),/isn’t available/,'asking anyway explains');
  await t.view.webContents.loadURL(base+'/story');await eventually(()=>active().readerable===true,'Reader offered on the article',6000);
  assert.equal(await win.webContents.executeJavaScript("!document.getElementById('reader').hidden"),true,'the address bar shows the Reader button');
  const t0=Date.now();await action('reader-toggle');console.log('reader opened in '+(Date.now()-t0)+' ms');
  const rv=()=>reader().view().webContents;await eventually(async()=>(await rv().executeJavaScript("document.getElementById('reader-title').textContent"))==='How light bends','Reader shows the title');
  assert.equal(active().reader,true);
  const page=await rv().executeJavaScript(`({body:document.getElementById('reader-body').innerText,meta:document.getElementById('reader-meta').textContent,site:document.getElementById('reader-site').textContent,imgs:[...document.querySelectorAll('#reader-body img')].map(i=>i.getAttribute('src')),quote:!!document.querySelector('#reader-body blockquote'),code:!!document.querySelector('#reader-body pre code'),h2:document.querySelector('#reader-body h2')?.textContent,links:[...document.querySelectorAll('#reader-body a')].map(a=>a.href),theme:document.documentElement.dataset.reader})`);
  for(const n of [1,4,7])assert.match(page.body,new RegExp('Paragraph '+n+' of the story'),'paragraph '+n);
  for(const junk of ['MENU-TEXT','SIDEBAR-LINK','COMMENT-TEXT','FOOTER-TEXT'])assert.ok(!page.body.includes(junk),junk+' left out');
  assert.equal(page.site,'The Glass Gazette');assert.match(page.meta,/Ada Lovelace/);assert.match(page.meta,/min read/);assert.equal(page.h2,'The colours');assert.ok(page.quote&&page.code,'quote and code kept');
  assert.deepEqual(page.imgs,[base+'/photo.png'],'images become absolute');assert.deepEqual(page.links,[base+'/next']);
  assert.ok(!page.body.includes('How light bends'),'the title is not repeated in the body');assert.ok(!/By Ada/.test(page.body),'the byline is not repeated');
  await delay(700);const shot=await rv().capturePage();fs.mkdirSync(path.resolve(__dirname,'../reports'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../reports/reader-light.png'),shot.toPNG());
  // Appearance: choices apply at once and are remembered.
  await rv().executeJavaScript("document.getElementById('reader-style').click();document.querySelector('.swatch.sepia').click();document.querySelector('.font[data-value=charter]').click();document.getElementById('reader-larger').click();true");
  await eventually(()=>settings.reader.theme==='sepia'&&settings.reader.font==='charter'&&settings.reader.size===20,'appearance saved: '+JSON.stringify(settings.reader));
  assert.equal(await rv().executeJavaScript('document.documentElement.dataset.reader'),'sepia');await delay(600);fs.writeFileSync(path.resolve(__dirname,'../reports/reader-sepia.png'),(await rv().capturePage()).toPNG());
  // Esc leaves Reader; ⇧⌘R (the action) brings it back; a link opens in the tab and leaves Reader.
  rv().sendInputEvent({type:'keyDown',keyCode:'Escape'});await eventually(()=>active().reader===false,'Esc closes Reader');
  await action('reader-toggle');await eventually(()=>active().reader===true,'Reader again');
  await rv().executeJavaScript("document.querySelector('#reader-body a').click();true");
  await eventually(()=>t.view.webContents.getURL()===base+'/next'&&active().reader===false,'link opens in the tab and Reader ends');
  console.log('reader flow passed');
 }finally{server.close();app.exit(0);}
};
