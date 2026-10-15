const Module=require('node:module'),load=Module._load;process.argv.push('--smoke-test');Module._load=function(request){if(request==='../test/smoke.cjs'){Module._load=load;return {run};}return load.apply(this,arguments);};
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){const end=Date.now()+10000;while(!await fn()){if(Date.now()>end)throw Error('Account UI timeout');await wait(40);}}
async function run({app,win,action,snapshot,toolWindows}){try{
 await win.webContents.executeJavaScript('finishSetup()');await action('profile-save',{name:'Account test',email:'local@example.test',theme:'Dusk'});
 await action('open-tool',{section:'profile'});const wc=toolWindows.get().webContents;await until(()=>wc.executeJavaScript(`!!document.getElementById('account-login')`));
 await wc.executeJavaScript(`document.getElementById('account-email').value='fixture@example.test';document.getElementById('account-login').requestSubmit()`);
 await until(()=>wc.executeJavaScript(`!document.getElementById('account-verify').hidden`));
 const directory=process.env.PRISM_ACCOUNT_DATA;const file=fs.readdirSync(directory).find(f=>f.startsWith('login-'));const {code}=JSON.parse(fs.readFileSync(path.join(directory,file)));
 await wc.executeJavaScript(`document.getElementById('account-code').value=${JSON.stringify(code)};document.getElementById('account-verify').requestSubmit()`);
 await until(()=>snapshot().account.connected);assert.equal(snapshot().profile.email,'local@example.test');assert.equal(snapshot().account.account.email,'fixture@example.test');
 assert(!JSON.stringify(snapshot()).includes(code));assert(!JSON.stringify(snapshot().account).includes('token'));
 assert(fs.readFileSync(path.join(app.getPath('userData'),'account-session.enc')).length>0);
 const uploaded=await action('account-upload');assert.equal(uploaded.account.profile.name,'Account test');assert.equal(uploaded.account.revision,1);
 await action('profile-save',{name:'Changed local',email:'local@example.test',theme:'Rose'});await action('account-download');assert.equal(snapshot().profile.name,'Account test');assert.equal(snapshot().profile.email,'fixture@example.test');
 const devices=await action('account-devices');assert.equal(devices.devices.length,1);
 await wc.executeJavaScript(`document.getElementById('account-manager').scrollIntoView({block:'start'})`);await wait(150);fs.writeFileSync('reports/account-manager-0.21.5.png',(await wc.capturePage()).toPNG());
 await action('account-logout');assert.equal(snapshot().account.connected,false);assert.equal(fs.existsSync(path.join(app.getPath('userData'),'account-session.enc')),false);
 console.log('PASS account UI sign-in, Keychain session, opt-in upload/download, device list, sign-out; no token in renderer snapshot');app.exit(0);
 }catch(e){console.error(e);app.exit(1);}}
require('../src/main.cjs');
