// Native messaging for extensions (0.47), replacing electron-chrome-extensions' own host: that one measures messages in
// UTF-16 characters instead of bytes and expects each reply to arrive in a single read, which breaks larger or
// non-ASCII messages (Apple's iCloud Passwords helper sends both). Hosts are found where Chrome-family browsers install
// them, run only for extensions their manifest allows, and speak Chrome's protocol: a 4-byte little-endian length,
// then that many bytes of JSON, both ways. A host's reply is capped at 1 MB, as in Chrome.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process'),{randomUUID}=require('node:crypto');
const MAX=1024*1024;
function searchPaths(application,{home=os.homedir(),userData}={}){const file=application+'.json',lib=path.join(home,'Library','Application Support');
 return [path.join('/Library/Google/Chrome/NativeMessagingHosts',file),...['Google/Chrome','Chromium','Microsoft Edge','BraveSoftware/Brave-Browser','Arc/User Data'].map(dir=>path.join(lib,dir,'NativeMessagingHosts',file)),...(userData?[path.join(userData,'NativeMessagingHosts',file)]:[])];}
async function findHost(application,options){if(!/^[a-z0-9_]+(\.[a-z0-9_]+)*$/i.test(String(application||'')))return null;
 for(const file of searchPaths(application,options))try{const config=JSON.parse(await fs.promises.readFile(file,'utf8'));if(config&&typeof config.path==='string'&&path.isAbsolute(config.path)&&Array.isArray(config.allowed_origins))return config;}catch{}return null;}
// Splits a stream of length-prefixed frames into messages.
function reader(onMessage,onError){let pending=Buffer.alloc(0);return chunk=>{pending=Buffer.concat([pending,chunk]);
 while(pending.length>=4){const length=pending.readUInt32LE(0);if(length>MAX){onError(Error('Native message too large'));pending=Buffer.alloc(0);return;}if(pending.length<4+length)return;
  const body=pending.subarray(4,4+length);pending=pending.subarray(4+length);try{onMessage(JSON.parse(body.toString('utf8')));}catch(error){onError(error);}}};}
function frame(message){const body=Buffer.from(JSON.stringify(message),'utf8'),head=Buffer.alloc(4);head.writeUInt32LE(body.length,0);return Buffer.concat([head,body]);}
async function launch(application,extensionId,options){const config=await findHost(application,options),origin=`chrome-extension://${extensionId}/`;
 if(!config||!config.allowed_origins.includes(origin))return null;try{if(!(await fs.promises.stat(config.path)).isFile())return null;}catch{return null;}
 return spawn(config.path,[origin],{shell:false,stdio:['pipe','pipe','ignore']});}
function attach(router,options={}){
 const hosts=new Map();
 router.handle('runtime.connectNative',async(event,connectionId,application)=>{const sender=event.sender,channel=`crx-native-msg-${connectionId}`;
  let child=null,open=true,queue=[];const relay=(_e,message)=>{if(child)child.stdin.write(frame(message));else queue.push(message);};
  const close=()=>{if(!open)return;open=false;hosts.delete(connectionId);sender.ipc?.off(channel,relay);try{child?.kill();}catch{}if(!sender.isDestroyed?.())sender.send(channel+'-disconnect');};
  hosts.set(connectionId,close);sender.ipc?.on(channel,relay);sender.once?.('destroyed',close);
  child=await launch(application,event.extension.id,options);if(!child||!open){close();return;}
  child.stdout.on('data',reader(message=>{if(open&&!sender.isDestroyed?.())sender.send(channel,message);},close));child.on('exit',close);child.on('error',close);child.stdin.on('error',close);
  for(const message of queue)child.stdin.write(frame(message));queue=[];},{permission:'nativeMessaging'});
 router.handle('runtime.disconnectNative',(_event,connectionId)=>hosts.get(connectionId)?.(),{permission:'nativeMessaging'});
 router.handle('runtime.sendNativeMessage',async(event,application,message)=>{const child=await launch(application,event.extension.id,options);if(!child)throw Error('Specified native messaging host not found.');
  return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{child.kill();reject(Error('Native host did not answer.'));},30000);
   child.stdout.on('data',reader(reply=>{clearTimeout(timer);resolve(reply);child.kill();},error=>{clearTimeout(timer);child.kill();reject(error);}));
   child.on('exit',()=>{clearTimeout(timer);reject(Error('Native host has exited.'));});child.stdin.write(frame(message));});},{permission:'nativeMessaging'});
 return {connections:()=>hosts.size,id:randomUUID()};}
module.exports={attach,reader,frame,searchPaths,findHost};
