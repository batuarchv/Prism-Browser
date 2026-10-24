// 0.28 sign-in in the running app (smoke profile, local pages only): Prism passkeys (create → stored encrypted →
// sign in, authenticator removed after each request, refused without a user gesture), a Sign in with Apple-style
// popup that reports back to its opener across origins, and a user agent without "Electron".
const assert=require('node:assert/strict'),http=require('node:http');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
exports.run=async({makeTab,selectTab,passkeys,app})=>{
 const html=body=>`<!doctype html><title>sign-in</title><body>${body}</body>`;
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});
  if(req.url==='/popup')res.end(html(`<script>window.opener&&window.opener.postMessage({signedIn:true,from:location.origin},'*');setTimeout(()=>close(),300)</script>`));
  else res.end(html('<input autocomplete="username webauthn">'));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 try{
  const t=makeTab(`http://localhost:${port}/`);selectTab(t.id);await eventually(()=>!t.loading&&t.view?.webContents.getURL(),'page load');await delay(400);const wc=t.view.webContents;
  assert.ok(!/Electron/.test(wc.getUserAgent()),'user agent has no Electron token');
  const create=`navigator.credentials.create({publicKey:{challenge:new Uint8Array(32),rp:{name:'Local',id:'localhost'},user:{id:new Uint8Array([7,7,7]),name:'tester@example.com',displayName:'Tester'},pubKeyCredParams:[{type:'public-key',alg:-7}],authenticatorSelection:{residentKey:'required',userVerification:'required'}}}).then(c=>c.id).catch(e=>'ERR '+e.name)`;
  const get=`navigator.credentials.get({publicKey:{challenge:new Uint8Array(32),rpId:'localhost',userVerification:'required'}}).then(c=>c.id).catch(e=>'ERR '+e.name)`;
  const id=await wc.executeJavaScript(create,true);assert.ok(!String(id).startsWith('ERR'),'passkey created: '+id);
  await eventually(()=>passkeys().active()===0,'authenticator removed after create');
  assert.deepEqual(passkeys().list().map(p=>[p.rpId,p.userName]),[['localhost','tester@example.com']]);
  assert.ok(!('privateKey' in passkeys().list()[0]),'listing never exposes keys');
  assert.equal(await wc.executeJavaScript(get,true),id,'signed in with the saved passkey');
  await eventually(()=>passkeys().active()===0,'authenticator removed after sign-in');
  // No user gesture (after the last one has expired): refused at once instead of waiting forever.
  await delay(6000);
  assert.equal(await Promise.race([wc.executeJavaScript(get,false),delay(4000).then(()=>'hung')]),'ERR NotAllowedError');
  // Sign in with Apple-style popup (another origin) reports back to the page that opened it.
  await wc.executeJavaScript(`window.__msg=null;addEventListener('message',e=>{window.__msg=e.data});window.open('http://127.0.0.1:${port}/popup','AppleAuthentication','width=600,height=700');true`,true);
  await eventually(()=>wc.executeJavaScript('!!window.__msg'),'popup reached its opener');
  assert.equal(await wc.executeJavaScript('window.__msg.from'),`http://127.0.0.1:${port}`);
  for(const p of passkeys().list())passkeys().remove(p.credentialId);
  return ['passkey create and sign-in through Prism (Touch ID gated)','passkey refused without a gesture','sign-in popup reaches its opener','standard Chrome user agent'];
 }finally{server.close();}
};
