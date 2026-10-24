// 0.32: media row, picture in picture (manual and on leaving the tab) and returning (PRISM_TEST_FLOW=pip-flow.cjs).
const http=require('node:http'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));
const VIDEO=`<title>Clip</title><body style="margin:0;background:#222"><h1 style="color:#fff;font:20px -apple-system">A page with a video</h1><video id="v" muted autoplay playsinline width="640" height="360"></video>
<script>const c=document.createElement('canvas');c.width=640;c.height=360;const g=c.getContext('2d');let f=0;setInterval(()=>{f++;const grad=g.createLinearGradient(0,0,640,360);grad.addColorStop(0,'hsl('+(f*3%360)+' 80% 55%)');grad.addColorStop(1,'hsl('+((f*3+120)%360)+' 80% 45%)');g.fillStyle=grad;g.fillRect(0,0,640,360);g.fillStyle='#fff';g.font='bold 64px -apple-system';g.fillText('Prism '+(f/30).toFixed(1),150,200);},33);
const v=document.getElementById('v');v.srcObject=c.captureStream(30);v.play();</script></body>`;
exports.run=async({app,win,makeTab,selectTab,tabs,action,snapshot,settings,pip,media})=>{let server;try{
 server=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end(q.url==='/video'?VIDEO:'<title>Other</title><h1>Other page</h1>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 const dir=path.join(__dirname,'..','reports','0.32');fs.mkdirSync(dir,{recursive:true});
 const video=makeTab(base+'/video');await wait(2500);const other=makeTab(base+'/other');await wait(1500);
 // Leaving a tab whose video plays floats it (setting on by default).
 selectTab(other.id);await wait(2000);
 assert.equal(pip().active(),video,'the playing video floats when its tab is left');assert(video.pip);
 const floating=require('electron').BrowserWindow.getAllWindows().find(w=>w.getTitle()==='Picture in Picture');assert(floating?.isVisible(),'the floating window is shown');
 const b=floating.getBounds();console.log('ok - auto picture in picture',JSON.stringify(b));
 for(const v of floating.contentView.children)v.webContents?.send?.('noop');
 const [page,controls]=floating.contentView.children;fs.writeFileSync(path.join(dir,'pip-video.png'),(await page.webContents.capturePage()).toPNG());
 await controls.webContents.executeJavaScript("document.body.classList.add('show')");await wait(400);fs.writeFileSync(path.join(dir,'pip-controls.png'),(await controls.webContents.capturePage()).toPNG());
 // Picture in picture tabs do not sleep and the sidebar shows no duplicate media row for them.
 assert.equal(snapshot().media,null,'no media row while the video floats');
 // Coming back to the tab returns the video to its page.
 selectTab(video.id);await wait(1500);assert(!video.pip&&!pip().active(),'returning to the tab ends picture in picture');
 assert.equal(await video.view.webContents.executeJavaScript("document.documentElement.classList.contains('prism-pip')"),false,'page styling removed');
 console.log('ok - returns to its tab');
 // The media row: leave without auto PiP; the row shows and its play/pause works.
 settings.autoPip=false;selectTab(other.id);await wait(1200);const m=snapshot().media;assert(m&&m.tabId===video.id&&m.video,'media row for the tab that plays');
 await action('media','toggle');await wait(800);assert.equal(snapshot().media.playing,false,'pause from the sidebar');
 fs.writeFileSync(path.join(dir,'media-row.png'),(await win.webContents.capturePage()).toPNG());
 await action('media','toggle');await wait(800);assert.equal(snapshot().media.playing,true,'play from the sidebar');console.log('ok - media row controls');
 // Manual picture in picture from the media row, then close from its window.
 await action('media','pip');await wait(1500);assert.equal(pip().active(),video,'picture in picture from the media row');
 await pip().end('close');await wait(600);assert(!video.pip);assert.equal(await video.view.webContents.executeJavaScript('document.getElementById("v").paused'),true,'closing pauses the video');console.log('ok - manual picture in picture and close');
 console.log(JSON.stringify({passed:true}));server.close();app.exit(0);
}catch(e){console.error('FAILED',e);server?.close();app.exit(1);}};
