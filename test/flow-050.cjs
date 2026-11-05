// 0.50 flow: pinned close button, tab groups (group, fold, rename, session record), sidebar/new tab right-click,
// Moving from Arc page, download fly animation. Screenshots go to PRISM_SHOTS.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,makeTab,selectTab,snapshot,tabs})=>{
 const ok=(c,m)=>{if(!c)throw Error('FAILED: '+m);console.log('ok -',m);};
 const js=code=>win.webContents.executeJavaScript(code);
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/flow-050');fs.mkdirSync(dir,{recursive:true});
 const shot=async(name,wc=win.webContents)=>{try{fs.writeFileSync(path.join(dir,name+'.png'),(await wc.capturePage()).toPNG());}catch(e){console.log('shot skipped: '+name+' ('+e.message+')');}};
 const server=http.createServer((req,res)=>{if(req.url.startsWith('/file')){res.writeHead(200,{'content-type':'application/octet-stream','content-disposition':'attachment; filename="prism-050.bin"'});res.end(Buffer.alloc(200000,1));return;}res.writeHead(200,{'content-type':'text/html'});res.end(`<title>Site ${req.url}</title><h1>${req.url}</h1>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 try{
  await wait(1500);
  const a=makeTab(base+'/a',true),b=makeTab(base+'/b',false),c=makeTab(base+'/c',false),d=makeTab(base+'/d',false);await wait(1500);
  // Pinned close button shows without hover.
  await action('pin-tab',d.id);await wait(600);
  const op=await js(`(()=>{const r=[...document.querySelectorAll('#tabs .tab.pinned')].find(r=>!r.classList.contains('parked'));return r?getComputedStyle(r.querySelector('.tab-close')).opacity:null})()`);
  ok(op!==null&&Number(op)>=.5,'open pinned tab shows its close button ('+op+')');
  // Groups.
  await action('tab-group',{id:c.id,target:a.id});await wait(500);
  let s=snapshot();const ga=s.tabs.find(t=>t.id===a.id),gc=s.tabs.find(t=>t.id===c.id);ok(ga.group&&ga.group===gc.group,'dropping c on a makes a group');
  const order=s.tabs.map(t=>t.id);ok(order.indexOf(c.id)===order.indexOf(a.id)+1,'grouped tabs sit together');
  let head=await js(`(()=>{const h=document.querySelector('#tabs .tab-group-head');return h&&{name:h.querySelector('.group-name').textContent,count:h.querySelector('.group-count').textContent,members:document.querySelectorAll('#tabs .tab.in-group').length}})()`);
  ok(head&&head.count==='2'&&head.members===2,'header shows the group with 2 tabs: '+JSON.stringify(head));
  await action('group-rename',{group:ga.group,name:'Research'});await wait(400);
  ok(await js(`document.querySelector('#tabs .tab-group-head .group-name').textContent`)==='Research','group renamed');
  await shot('groups-open');
  selectTab(b.id);await wait(400);
  await js(`document.querySelector('#tabs .tab-group-head .group-toggle').click()`);await wait(400);
  ok(await js(`document.querySelectorAll('#tabs .tab.group-folded').length`)===2,'folding hides the group tabs');
  await shot('groups-folded');
  await js(`document.querySelector('#tabs .tab-group-head .group-toggle').click()`);await wait(300);
  const rec=require('../src/session-recovery.cjs').tabRecord(tabs.find(t=>t.id===a.id));ok(rec.group===ga.group&&rec.groupName==='Research','the group is saved with the session');
  // Reorder a member away from its group: it leaves.
  await action('tab-reorder',{id:c.id,beforeId:null});await wait(300);s=snapshot();ok(!s.tabs.find(t=>t.id===c.id).group,'a member moved away leaves the group');
  await action('tab-group-new',b.id);await wait(300);s=snapshot();ok(!!s.tabs.find(t=>t.id===b.id).group,'Add to New Group');
  await action('tab-ungroup',b.id);await wait(300);s=snapshot();ok(!s.tabs.find(t=>t.id===b.id).group,'Remove from Group');
  // Right-click on the sidebar / new tab page asks main for its menu (the native menu itself isn't clicked here).
  const where=await js(`(()=>{const seen=[];const old=window.act;window.act=(n,v)=>{seen.push([n,v&&v.where]);return Promise.resolve();};
   const fire=el=>el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:20,clientY:20}));
   fire(document.getElementById('tabs'));fire(document.getElementById('welcome'));fire(document.querySelector('#tabs .tab .tab-main'));window.act=old;return seen})()`);
  ok(JSON.stringify(where.filter(x=>x[0]==='surface-menu'))===JSON.stringify([['surface-menu','sidebar'],['surface-menu','newtab']]),'sidebar and new tab page ask for their menu; a tab row keeps its own: '+JSON.stringify(where));
  // Moving from Arc.
  await action('moving-from-arc');await wait(1500);const arc=tabs.find(t=>t.url==='prism-notes://arc');ok(!!arc,'Moving from Arc opens a tab');
  const h1=await arc.view.webContents.executeJavaScript(`document.querySelector('h1').textContent+' | '+document.querySelectorAll('.step').length+' steps, '+document.querySelectorAll('tr').length+' rows'`);ok(/Arc/.test(h1),'Arc page renders: '+h1);
  await arc.view.webContents.executeJavaScript(`location.href='prism-notes://do/nothing'`);await wait(800);ok(arc.view.webContents.getURL()==='prism-notes://arc','a button link keeps the page in place');
  await shot('arc-page',arc.view.webContents);
  // Download flies into the Downloads button.
  selectTab(a.id);await wait(500);
  await js(`window.__fly=0;new MutationObserver(m=>{for(const r of m)for(const n of r.addedNodes)if(n.classList?.contains('download-fly'))window.__fly++;}).observe(document.body,{childList:true});`);
  a.view.webContents.downloadURL(base+'/file');await wait(250);await shot('download-fly');await wait(2500);
  ok(await js('window.__fly')===1,'a new download flies into the Downloads button once');
  s=snapshot();const dl=s.downloads.find(x=>x.name==='prism-050.bin');ok(dl&&dl.state==='completed','the download went straight to Downloads: '+(dl&&dl.path));try{fs.rmSync(dl.path);}catch{}
  await shot('final');
  console.log('FLOW 050 OK');server.close();app.exit(0);
 }catch(error){console.error(error);server.close();app.exit(1);}};
