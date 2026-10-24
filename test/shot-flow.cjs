// Development: screenshot the window with a few local tabs (PRISM_TEST_FLOW=shot-flow.cjs).
// PRISM_SHOT=name, PRISM_SHOT_SETTINGS='{"addressBar":"sidebar"}', PRISM_SHOT_JS=<shell code>, PRISM_SHOT_MAIN=<main code>.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async(ctx)=>{const {app,win,makeTab,action}=ctx;
 const server=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end('<title>Site '+q.url+'</title><body style="font:16px -apple-system;padding:40px;background:#f6f4ef"><h1>Page '+q.url+'</h1><p><a id="l" href="/next">A link to /next</a></p><p>'+'Lorem ipsum dolor sit amet. '.repeat(40)+'</p></body>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;ctx.base=base;
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 win.setSize(1280,800);for(const [k,v] of Object.entries(JSON.parse(process.env.PRISM_SHOT_SETTINGS||'{}')))await action('set-setting',{key:k,value:v});
 for(const p of ['/a','/b','/c'])makeTab(base+p);await wait(2500);
 if(process.env.PRISM_SHOT_MAIN)try{console.log('main:',await eval('(async()=>{'+process.env.PRISM_SHOT_MAIN+'})()'));}catch(e){console.log('main error',e.message);}
 if(process.env.PRISM_SHOT_JS)try{console.log('js:',await win.webContents.executeJavaScript(process.env.PRISM_SHOT_JS));}catch(e){console.log('js error',e.message);}await wait(1200);
 const dir=path.join(__dirname,'..','reports','0.32');fs.mkdirSync(dir,{recursive:true});
 // The window's own surface plus every visible child view, composited the way they sit on screen.
 // Child views are painted into the shell as pictures at their bounds, so one capture shows the window as seen.
 const views=[];for(const v of win.contentView.children){if(!v.webContents||v.webContents===win.webContents||v.webContents.isDestroyed())continue;try{if(v.getVisible&&!v.getVisible())continue;const b=v.getBounds();views.push({...b,src:(await v.webContents.capturePage()).toDataURL()});}catch{}}
 await win.webContents.executeJavaScript(`(()=>{for(const v of ${JSON.stringify(views)}){const i=document.createElement('img');i.className='shot-layer';i.src=v.src;i.style.cssText='position:fixed;z-index:99999;left:'+v.x+'px;top:'+v.y+'px;width:'+v.width+'px;height:'+v.height+'px;border-radius:10px';document.body.append(i);}})()`);await wait(400);
 const out=path.join(dir,(process.env.PRISM_SHOT||'shot')+'.png');fs.writeFileSync(out,(await win.webContents.capturePage()).toPNG());
 console.log('wrote',out,views.length);server.close();app.exit(0);};
