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
// PAC script sending only the listed domains (and their subdomains) to the helper; everything else goes direct.
// "SOCKS" in a PAC script is SOCKS4, so Chromium still resolves names itself over encrypted DNS.
function pacScript(port,hosts){const list=JSON.stringify([...new Set(hosts)].filter(h=>/^[a-z0-9.-]+$/i.test(h)));
 return 'data:application/x-ns-proxy-autoconfig;base64,'+Buffer.from(`var L=${list};function FindProxyForURL(u,h){h=h.toLowerCase();for(var i=0;i<L.length;i++){var d=L[i];if(h===d||dnsDomainIs(h,'.'+d))return 'SOCKS 127.0.0.1:${port}';}return 'DIRECT';}`).toString('base64');}
// Private uses one instance that holds every request until the bypass is up and blocks them if it fails. Normal spaces
// (0.39) use another with gate:false and direct:true: requests are never held, route() can narrow the bypass to chosen
// sites, and a failure falls back to the normal connection instead of blocking.
class PrivateNetwork {
 constructor({session,changed=()=>{},filter=()=>false,helper='/opt/zapret/tpws/tpws',secureDns=()=>{},gate=true,direct=false,route=()=>null,label='Private'}){this.session=session;this.changed=changed;this.helper=helper;this.secureDns=secureDns;this.direct=direct;this.route=route;this.label=label;this.port=0;this.startPromise=null;this.state={mode:'zapret',status:'idle',profile:'standard',message:'Bypass censorship starts automatically when you open a Private site.'};this.runner=null;this.busy=false;this.generation=0;
  if(gate)session.webRequest.onBeforeRequest((_details,callback)=>{const verdict=filter(_details);if(verdict===true||verdict?.cancel||verdict?.redirectURL){if(verdict?.delay){setTimeout(()=>callback({cancel:true}),verdict.delay).unref?.();return;}callback(verdict===true?{cancel:true}:verdict);return;}this.ensureStarted().then(()=>callback({cancel:this.state.mode!=='direct'&&this.state.status!=='active'}),()=>callback({cancel:true}));});
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
   const port=await freePort();this.port=port;await this.session.setProxy(this.proxy(port));
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
   this.state={mode:'zapret',status:'active',profile,message:`Bypass censorship is on for ${this.label} browsing.`};
  }catch(error){this.secureDns(false);if(this.direct)await this.session.setProxy({mode:'direct'}).catch(()=>{});this.state={mode:mode==='direct'?'stopped':mode,status:'error',profile,message:error.message};await this.stopHelper();throw error;}
  finally{this.busy=false;this.changed();}
 }
 proxy(port){const hosts=this.route();return hosts?{mode:'pac_script',pacScript:pacScript(port,hosts)}:{mode:'fixed_servers',proxyRules:`socks4://127.0.0.1:${port}`,proxyBypassRules:'<-loopback>'};}
 // New chosen sites or companion domains take effect without restarting the helper or dropping open connections.
 reroute(){if(this.state.status!=='active'||!this.port)return Promise.resolve();const config=this.proxy(this.port);this.routing=(this.routing||Promise.resolve()).then(()=>this.session.setProxy(config)).catch(()=>{});return this.routing;}
 failed(generation,message){if(generation!==this.generation)return;this.secureDns(false);if(this.direct)this.session.setProxy({mode:'direct'}).catch(()=>{});this.state={...this.state,status:'error',message};this.session.closeAllConnections().catch(()=>{});this.changed();}
 async close(){if(this.startPromise)await this.startPromise.catch(()=>{});++this.generation;this.state={...this.state,mode:'stopped',status:'stopped'};await this.session.closeAllConnections();await this.stopHelper();this.secureDns(false);}
}
module.exports={PrivateNetwork,helperArgs,pacScript};
