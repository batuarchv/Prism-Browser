const {fork}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const PROFILES={standard:['--split-pos=1'],tls:['--split-pos=sniext+1'],plain:[]};
function helperArgs(port,profile){
 if(!Number.isInteger(port)||port<1024||port>65535||!Object.hasOwn(PROFILES,profile))throw Error('Invalid bypass configuration.');
 return ['--socks','--bind-addr=127.0.0.1',`--port=${port}`,'--maxconn=128','--debug=0',...PROFILES[profile]];
}
function freePort(){return new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(0,'127.0.0.1',()=>{const port=s.address().port;s.close(()=>resolve(port));});});}
function probe(port){return new Promise(resolve=>{const socket=net.connect(port,'127.0.0.1');let bytes=Buffer.alloc(0);const finish=result=>{socket.destroy();resolve(result);};socket.setTimeout(500,()=>finish(false));socket.on('error',()=>finish(false));socket.on('connect',()=>socket.write(Buffer.from([5,1,0])));socket.on('data',data=>{bytes=Buffer.concat([bytes,data]);if(bytes.length>=2)finish(bytes[0]===5&&bytes[1]===0);});});}
class PrivateNetwork {
 constructor({session,changed=()=>{},filter=()=>false,helper='/opt/zapret/tpws/tpws',secureDns=()=>{}}){this.session=session;this.changed=changed;this.helper=helper;this.secureDns=secureDns;this.startPromise=null;this.state={mode:'zapret',status:'idle',profile:'standard',message:'Bypass censorship starts automatically when you open a Private site.'};this.runner=null;this.busy=false;this.generation=0;
  session.webRequest.onBeforeRequest((_details,callback)=>{const verdict=filter(_details);if(verdict===true||verdict?.cancel||verdict?.redirectURL){if(verdict?.delay){setTimeout(()=>callback({cancel:true}),verdict.delay).unref?.();return;}callback(verdict===true?{cancel:true}:verdict);return;}this.ensureStarted().then(()=>callback({cancel:this.state.mode!=='direct'&&this.state.status!=='active'}),()=>callback({cancel:true}));});
 }
 async ensureStarted(){if(this.startPromise)return this.startPromise;if(this.state.status==='idle'){this.startPromise=this.setMode('zapret',this.state.profile).finally(()=>{this.startPromise=null;});return this.startPromise;}if(this.state.mode!=='direct'&&this.state.status!=='active')throw Error(this.state.message||'Private requests are blocked.');}
 snapshot(){return {...this.state,available:fs.existsSync(this.helper),busy:this.busy};}
 async stopHelper(){const runner=this.runner;this.runner=null;if(!runner)return;await new Promise(resolve=>{const timer=setTimeout(()=>{runner.kill();resolve();},2500);runner.once('exit',()=>{clearTimeout(timer);resolve();});if(runner.connected)runner.send({stop:true});else runner.kill();});}
 async setMode(mode,profile='standard'){
  if(this.busy)throw Error('Wait for the current network change.');
  if(!['direct','zapret','stopped'].includes(mode))throw Error('Unknown private network mode.');
  helperArgs(1024,profile);this.busy=true;const generation=++this.generation;
  this.state={mode:mode==='direct'?'stopped':mode,status:'starting',profile,message:'Changing Private connection…'};this.changed();
  try{
   await this.session.closeAllConnections();await this.stopHelper();this.secureDns(false);
   if(mode==='direct'){await this.session.setProxy({mode:'direct'});this.state={mode,status:'direct',profile,message:'Private uses your normal connection.'};return;}
   // Remove implicit localhost bypass. A dead proxy stays selected on failure; never append DIRECT.
   // SOCKS4 makes Chromium resolve names itself (over encrypted DNS while active) and hand the helper an IP address:
   // ISPs that block by DNS return a block-page address to the helper's system lookup, which no TLS splitting can fix.
   const port=await freePort();await this.session.setProxy({mode:'fixed_servers',proxyRules:`socks4://127.0.0.1:${port}`,proxyBypassRules:'<-loopback>'});
   if(mode==='stopped'){this.state={mode,status:'stopped',profile,message:'Private network stopped. Choose Direct or start the bypass to continue.'};return;}
   const real=fs.realpathSync(this.helper),stat=fs.statSync(real);fs.accessSync(real,fs.constants.X_OK);
   if(!stat.isFile()||(stat.mode&0o022))throw Error('The bypass helper must not be writable by other users.');
   const runner=fork(path.join(__dirname,'zapret-runner.cjs'),[],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},stdio:['ignore','ignore','ignore','ipc']});this.runner=runner;
   runner.once('error',()=>this.failed(generation,'The bypass helper could not start.'));
   runner.on('message',m=>{if(m?.error)this.failed(generation,'The bypass helper could not start. Check the installed tpws version.');});
   runner.once('exit',()=>{if(this.runner===runner){this.runner=null;this.failed(generation,'The bypass helper stopped. Private requests are blocked until you restart it or choose Direct.');}});
   runner.send({executable:real,args:helperArgs(port,profile)});
   const deadline=Date.now()+5000;let ready=false;
   while(Date.now()<deadline&&this.runner===runner&&this.state.status==='starting'){if(await probe(port)){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
   if(!ready)throw Error('The bypass helper did not become ready. Private requests remain blocked.');
   this.secureDns(true);
   this.state={mode:'zapret',status:'active',profile,message:'Bypass censorship is on for Private browsing.'};
  }catch(error){this.secureDns(false);this.state={mode:mode==='direct'?'stopped':mode,status:'error',profile,message:error.message};await this.stopHelper();throw error;}
  finally{this.busy=false;this.changed();}
 }
 failed(generation,message){if(generation!==this.generation)return;this.secureDns(false);this.state={...this.state,status:'error',message};this.session.closeAllConnections().catch(()=>{});this.changed();}
 async close(){if(this.startPromise)await this.startPromise.catch(()=>{});++this.generation;this.state={...this.state,mode:'stopped',status:'stopped'};await this.session.closeAllConnections();await this.stopHelper();this.secureDns(false);}
}
module.exports={PrivateNetwork,helperArgs};
