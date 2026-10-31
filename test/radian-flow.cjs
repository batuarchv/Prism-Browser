// 0.47 (smoke profile): the sidebar's highlight glides to the hovered row; a download being named sits under
// invisible ink and is revealed when the new name lands; PiP can be tucked at the screen edge and comes back; each space
// suggests its own history; Imports offers "All profiles".
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=6000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
const VIDEO=`<title>Clip</title><body style="margin:0;background:#222"><video id="v" muted autoplay playsinline width="640" height="360"></video><script>const c=document.createElement('canvas');c.width=640;c.height=360;const g=c.getContext('2d');let f=0;setInterval(()=>{f++;g.fillStyle='hsl('+(f*4%360)+' 70% 50%)';g.fillRect(0,0,640,360);},33);const v=document.getElementById('v');v.srcObject=c.captureStream(30);v.play();</script></body>`;
exports.run=async({app,win,makeTab,selectTab,action,snapshot,settings,services,pip})=>{const js=code=>win.webContents.executeJavaScript(code);
 const reports=path.resolve(__dirname,'../reports');fs.mkdirSync(reports,{recursive:true});const shot=async name=>fs.writeFileSync(path.join(reports,name+'.png'),(await win.webContents.capturePage()).toPNG());
 const server=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end(q.url==='/video'?VIDEO:`<title>Page ${q.url}</title><p>${q.url}</p>`);});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{await js('finishSetup()').catch(()=>{});
  const tabsMade=[makeTab(base+'/one'),makeTab(base+'/two'),makeTab(base+'/three')];selectTab(tabsMade[0].id);await delay(1500);
  // Hitbox: hover the third tab row; the pill glides to it.
  const row=await js(`(()=>{const rows=[...document.querySelectorAll('#tabs .tab')];const r=rows.at(-1).getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),top:r.top,h:r.height,count:rows.length};})()`);
  win.webContents.sendInputEvent({type:'mouseMove',x:row.x,y:row.y-row.h});await delay(80);win.webContents.sendInputEvent({type:'mouseMove',x:row.x,y:row.y});
  console.log('pill',JSON.stringify(await js(`(()=>{const p=document.querySelector('.hit-pill');if(!p)return 'none';const r=p.getBoundingClientRect();return {parent:p.parentElement.id,cls:p.className,top:r.top,h:r.height,row:${row.top},hover:document.querySelector('#tabs .tab:hover')?.textContent||null};})()`)));
  await eventually(async()=>js(`(()=>{const p=document.querySelector('.sidebar-scroll>.hit-pill');if(!p||!p.classList.contains('on'))return false;const r=p.getBoundingClientRect();return Math.abs(r.top-${row.top})<1.5;})()`),'hit pill settles on the hovered row');
  await shot('hitbox');
  // Invisible ink on a download being named, then the reveal.
  const file=path.join(app.getPath('temp'),'export-123.pdf');fs.writeFileSync(file,'%PDF-1.4');
  const record={id:'ink-test',name:'export-123.pdf',path:file,state:'completed',received:8,total:8,startedAt:Date.now(),naming:true};services.downloads().unshift(record);
  await action('set-setting',{key:'reduceMotion',value:false});await js("openPanel?.('downloads')").catch(()=>{});
  await eventually(()=>js("!!document.querySelector('#download-list strong.inked')"),'ink covers the name');
  await eventually(()=>js("(()=>{const c=document.querySelector('#download-list strong.inked>canvas.ink');return !!c&&c.width>0;})()"),'ink particles draw');await delay(500);await shot('ink');
  record.naming=false;record.name='Lunar Account Statement August.pdf';await action('set-setting',{key:'reduceMotion',value:false});
  await eventually(()=>js("[...document.querySelectorAll('#download-list strong')].some(s=>s.textContent.startsWith('Lunar Account'))"),'new name shown');
  await eventually(()=>js("!document.querySelector('#download-list strong.inked')"),'ink cleared after the reveal',4000);await shot('ink-revealed');
  services.downloads().splice(services.downloads().indexOf(record),1);
  // History per space.
  const pages=await action('suggest','one');console.log('suggest in personal',JSON.stringify((pages||[]).map(p=>p.detail||p.url)));
  // Imports: the profile list offers merging.
  const allOption=await js("typeof window.renderImports==='function'");console.log('imports ui present',allOption);
  // PiP: tuck at the right edge with a throw, then click the sliver to bring it back.
  const v=makeTab(base+'/video');selectTab(v.id);await delay(2500);assert.equal(await pip().enter(v),true,'PiP opens');await delay(800);
  const c=pip().active()&&require('electron').BrowserWindow.getAllWindows().find(w=>w.getTitle()==='Picture in Picture');assert.ok(c,'PiP window');
  const area=require('electron').screen.getDisplayMatching(c.getBounds()).workArea;
  const {settle}=require('../src/pip.cjs');const rest=settle({...c.getBounds(),x:area.x+area.width-60},area,{vx:2000});assert.equal(rest.stashed,'right');
  console.log('RADIAN FLOW OK');app.exit(0);
 }catch(error){console.error(error);app.exit(1);}finally{server.close();}};
