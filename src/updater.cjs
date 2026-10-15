// codesign prints metadata on stderr even on success.
function verifySignature(app,teamID){
 if(!app.isPackaged||process.platform!=='darwin'||!/^[A-Z0-9]{10}$/.test(teamID||''))return false;
 const {spawnSync}=require('node:child_process'),bundle=require('node:path').resolve(app.getPath('exe'),'../../..');
 const verify=spawnSync('/usr/bin/codesign',['--verify','--deep','--strict',bundle],{encoding:'utf8'});
 const detail=spawnSync('/usr/bin/codesign',['-dv','--verbose=4',bundle],{encoding:'utf8'});
 return verify.status===0&&detail.status===0&&detail.stderr.includes('TeamIdentifier='+teamID)&&detail.stderr.includes('Authority=Developer ID Application:');
}
function validFeed(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash;}catch{return false;}}
function createUpdater({autoUpdater,app,config={},onChange=()=>{},verify=verifySignature}){
 let status='setup-required',timer,initial,lastChecked=null,version=null,closed=false;
 let configured=config.enabled===true&&validFeed(config.feedURL)&&verify(app,config.teamID);
 const listeners=[];const snapshot=()=>({status,configured,channel:'beta',currentVersion:app.getVersion(),version,lastChecked});
 const change=next=>{if(closed)return;status=next;onChange();};
 if(configured){try{autoUpdater.setFeedURL({url:config.feedURL,serverType:'json'});status='idle';}catch{configured=false;status='setup-required';}}
 const usable=()=>configured&&status!=='setup-required';
 const listen=(event,handler)=>{autoUpdater.on(event,handler);listeners.push([event,handler]);};
 if(usable()){
  listen('checking-for-update',()=>change('checking'));
  listen('update-available',()=>change('downloading'));
  listen('update-not-available',()=>change('current'));
  listen('error',()=>change('error'));
  listen('update-downloaded',(_event,_notes,name)=>{version=typeof name==='string'?name.slice(0,80):null;change('ready');});
 }
 function check(){if(!usable()||['checking','downloading','ready'].includes(status))return snapshot();lastChecked=new Date().toISOString();change('checking');try{autoUpdater.checkForUpdates();}catch{change('error');}return snapshot();}
 function schedule(enabled){clearTimeout(initial);clearInterval(timer);if(!enabled||!usable()||closed)return;initial=setTimeout(check,60000);initial.unref?.();timer=setInterval(check,6*60*60*1000);timer.unref?.();}
 return {snapshot,check,schedule,install(){if(status==='ready'&&!closed)autoUpdater.quitAndInstall();},close(){closed=true;clearTimeout(initial);clearInterval(timer);for(const [event,fn]of listeners)autoUpdater.removeListener(event,fn);}};
}
module.exports={createUpdater,validFeed,verifySignature};
