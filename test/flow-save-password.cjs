// Save password panel (0.50): a script sign-in (no submit event), a two-step sign-in, Never for This Site and a wrong
// password that stays on the form. Real clicks and typing go through sendInputEvent so the page sees trusted events.
const fs=require('node:fs'),path=require('node:path'),https=require('node:https'),{execFileSync}=require('node:child_process');
const {session}=require('electron');const wait=ms=>new Promise(r=>setTimeout(r,ms));
const page=body=>`<!doctype html><meta charset=utf-8><title>Fixture</title><style>body{font:16px sans-serif;padding:30px}input,button{display:block;margin:8px 0;font-size:16px;height:32px}</style>${body}`;
exports.run=async({app,win,makeTab,action,snapshot,settings,savePrompt})=>{
 const ok=(c,m)=>{if(!c)throw Error('FAILED: '+m);console.log('ok -',m);};
 const shots=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/save-password');fs.mkdirSync(shots,{recursive:true});
 const dir=app.getPath('userData');fs.mkdirSync(dir,{recursive:true});const cert=path.join(dir,'fx-cert.pem'),key=path.join(dir,'fx-key.pem');
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','1','-subj','/CN=localhost'],{stdio:'ignore'});
 const pages={
  '/login':page(`<div id=box><input id=u autocomplete=username placeholder=Email><input id=p type=password placeholder=Password><button id=go type=button onclick="setTimeout(()=>location.href='/home',300)">Sign in</button></div>`),
  '/step1':page(`<form onsubmit="event.preventDefault();location.href='/step2'"><input id=u type=email autocomplete=username><button id=go>Next</button></form>`),
  '/step2':page(`<form onsubmit="event.preventDefault();location.href='/home'"><input id=p type=password autocomplete=current-password><button id=go>Continue</button></form>`),
  '/wrong':page(`<form onsubmit="event.preventDefault();document.title='Wrong password'"><input id=u autocomplete=username><input id=p type=password><button id=go>Sign in</button></form>`),
  '/home':page('<h1>Signed in</h1>')};
 const server=https.createServer({key:fs.readFileSync(key),cert:fs.readFileSync(cert)},(req,res)=>{res.setHeader('Content-Type','text/html');res.end(pages[req.url.split('?')[0]]||pages['/home']);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`https://127.0.0.1:${server.address().port}`;
 session.fromPartition(snapshot().browserPartition).setCertificateVerifyProc((request,callback)=>callback(request.hostname==='127.0.0.1'?0:-3));
 const open=async url=>{const tab=makeTab(origin+url);for(let i=0;i<100&&!(tab.view?.webContents.getURL().endsWith(url)&&!tab.view.webContents.isLoading());i++)await wait(100);await wait(400);return tab;};
 const click=async(wc,sel)=>{const r=await wc.executeJavaScript(`(()=>{const b=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)}})()`);for(const type of ['mouseDown','mouseUp'])wc.sendInputEvent({type,x:r.x,y:r.y,button:'left',clickCount:1});await wait(80);};
 const type=async(wc,sel,text)=>{await click(wc,sel);wc.insertText(text);await wait(80);};
 const prompt=()=>savePrompt().window();
 const promptState=()=>prompt().webContents.executeJavaScript(`({title:document.getElementById('title').textContent,site:document.getElementById('site').textContent,user:document.getElementById('username').value,pass:document.getElementById('password').value,hidden:document.getElementById('card').hidden})`);
 const until=async(f,ms=6000)=>{const end=Date.now()+ms;while(Date.now()<end){if(await f())return true;await wait(150);}return false;};
 try{
  await wait(1200);
  // 1. Script sign-in: a button that is not a submit button, then the page moves on.
  let tab=await open('/login');let wc=tab.view.webContents;
  await type(wc,'#u','ada@example.com');await type(wc,'#p','fixture-pass-1');await click(wc,'#go');
  ok(await until(()=>savePrompt().visible()),'a script sign-in opens the save panel after the page moves on');
  if(process.env.PRISM_HOLD)await wait(Number(process.env.PRISM_HOLD));
  await wait(600);let st=await promptState();ok(st.title==='Save password?'&&st.user==='ada@example.com'&&st.pass==='fixture-pass-1'&&!st.hidden,'panel shows the site, username and password: '+st.site);
  const b=prompt().getBounds(),c=win.getContentBounds();ok(b.x+b.width<=c.x+c.width&&b.y>=c.y&&b.width===344,'panel sits at the top right of the window: '+JSON.stringify(b));
  try{fs.writeFileSync(path.join(shots,'save-password.png'),(await prompt().webContents.capturePage()).toPNG());fs.writeFileSync(path.join(shots,'save-password-window.png'),(await win.webContents.capturePage()).toPNG());}catch(e){console.log('shot skipped: '+e.message);}
  // The person changes the username before saving.
  await prompt().webContents.executeJavaScript(`document.getElementById('username').value='ada';document.getElementById('save').click()`);
  await wait(400);try{fs.writeFileSync(path.join(shots,'save-password-saved.png'),(await prompt().webContents.capturePage()).toPNG());}catch{}
  ok(await until(async()=>(await action('password-list')).entries?.some(e=>e.origin===origin&&e.username==='ada')),'Save stores the edited login in the vault');
  ok(await until(()=>!prompt().isVisible(),3000),'the panel goes away after the saved check');
  // Same login again: nothing to ask.
  tab=await open('/login');wc=tab.view.webContents;await type(wc,'#u','ada');await type(wc,'#p','fixture-pass-1');await click(wc,'#go');await wait(3000);
  ok(!savePrompt().visible(),'an already saved login is not offered again');
  // A new password for it: Update.
  tab=await open('/login');wc=tab.view.webContents;await type(wc,'#u','ada');await type(wc,'#p','fixture-pass-2');await click(wc,'#go');
  ok(await until(()=>savePrompt().visible()),'a changed password is offered');await wait(400);st=await promptState();ok(st.title==='Update password?','it asks to update');
  await prompt().webContents.executeJavaScript(`document.getElementById('later').click()`);await wait(300);ok(!savePrompt().visible(),'Not Now closes it');
  // 2. Two steps: the username page, then the password page.
  tab=await open('/step1');wc=tab.view.webContents;await type(wc,'#u','grace@example.com');await click(wc,'#go');
  for(let i=0;i<50&&!wc.getURL().endsWith('/step2');i++)await wait(100);await wait(500);await type(wc,'#p','fixture-pass-3');await click(wc,'#go');
  ok(await until(()=>savePrompt().visible()),'a two-step sign-in is offered');await wait(400);st=await promptState();ok(st.user==='grace@example.com','the username comes from the first step');
  await prompt().webContents.executeJavaScript(`document.getElementById('never').click()`);await wait(300);
  ok((settings.neverSavePasswords||[]).includes(origin),'Never for This Site is remembered');
  tab=await open('/login');wc=tab.view.webContents;await type(wc,'#u','new@example.com');await type(wc,'#p','fixture-pass-4');await click(wc,'#go');await wait(3000);
  ok(!savePrompt().visible(),'a Never site is not asked again');
  await action('never-save-reset');ok(!(settings.neverSavePasswords||[]).length,'Reset clears the Never list');
  // 3. A wrong password keeps the form on screen: no offer.
  tab=await open('/wrong');wc=tab.view.webContents;await type(wc,'#u','ada');await type(wc,'#p','wrong-pass');await click(wc,'#go');await wait(9000);
  ok(!savePrompt().visible(),'a sign-in that stays on the form is not offered');
  console.log('FLOW SAVE-PASSWORD OK');server.close();app.exit(0);
 }catch(error){console.error(error);server.close();app.exit(1);}
};
