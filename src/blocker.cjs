const fs=require('node:fs'),path=require('node:path');
const {FiltersEngine,Request}=require('@ghostery/adblocker');
const TYPES={mainFrame:'main_frame',subFrame:'sub_frame',xhr:'xmlhttprequest'};
function site(url){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname:'';}catch{return '';}}
class Blocker {
 constructor({file,changed=()=>{},engine}={}){
  this.file=file;this.changed=changed;this.privateExceptions=new Set();this.counts=new Map();this.enabled=true;this.exceptions=new Set();
  try{const saved=JSON.parse(fs.readFileSync(file));this.enabled=saved.enabled!==false;this.exceptions=new Set((saved.exceptions||[]).filter(s=>typeof s==='string'&&site('https://'+s)===s).slice(0,1000));}catch{}
  this.engine=engine||FiltersEngine.deserialize(fs.readFileSync(path.join(__dirname,'../assets/blocker/engine.bin')));
 }
 active(url,privateMode=false){return this.enabled&&!(privateMode?this.privateExceptions:this.exceptions).has(site(url));}
 save(){if(this.file){fs.writeFileSync(this.file+'.tmp',JSON.stringify({enabled:this.enabled,exceptions:[...this.exceptions]}),{mode:0o600});fs.renameSync(this.file+'.tmp',this.file);}this.changed();}
 toggle(enabled){if(typeof enabled!=='boolean')throw Error('Invalid protection setting');this.enabled=enabled;this.save();}
 toggleSite(url,privateMode=false){const host=site(url);if(!host)throw Error('Open a website first.');const list=privateMode?this.privateExceptions:this.exceptions;if(list.has(host))list.delete(host);else{if(list.size>=1000)throw Error('Too many site exceptions.');list.add(host);}if(privateMode)this.changed();else this.save();}
 snapshot(url,privateMode=false,id){return {enabled:this.enabled,site:site(url),active:this.active(url,privateMode),blocked:this.counts.get(id)||0,exceptions:[...(privateMode?this.privateExceptions:this.exceptions)],...require('../assets/blocker/manifest.json')};}
 notify(){if(this.timer)return;this.timer=setTimeout(()=>{this.timer=null;this.changed();},500);this.timer.unref?.();}
 check(details,privateMode=false){
  if(details.resourceType==='mainFrame'){this.counts.delete(details.webContentsId);return false;}
  const wc=details.webContents;const top=wc&&!wc.isDestroyed()?wc.getURL():details.referrer;
  if(!this.active(top,privateMode)||!/^https?:|^wss?:/.test(details.url))return false;
  const sourceUrl=details.frame?.url||details.referrer||top||'';
  const result=this.engine.match(Request.fromRawDetails({url:details.url,sourceUrl,type:TYPES[details.resourceType]||details.resourceType||'other'}));
  if(result.match){const id=details.webContentsId;if(id>=0){if(this.counts.size>=512&&!this.counts.has(id))this.counts.delete(this.counts.keys().next().value);this.counts.set(id,Math.min(999999,(this.counts.get(id)||0)+1));}this.notify();return true;}return false;
 }
 bind(session){session.webRequest.onBeforeRequest((details,callback)=>callback({cancel:this.check(details)}));}
 attach(wc,privateMode=false){
  wc.once('destroyed',()=>this.counts.delete(wc.id));
  wc.on('dom-ready',async()=>{try{const url=wc.getURL();if(!site(url)||!this.active(url,privateMode))return;
   const request=Request.fromRawDetails({url,type:'main_frame'});
   const {styles}=this.engine.getCosmeticsFilters({url,hostname:request.hostname,domain:request.domain,getInjectionRules:false,getExtendedRules:false,getRulesFromDOM:false});
   if(styles&&!wc.isDestroyed()&&wc.getURL()===url)await wc.insertCSS(styles,{cssOrigin:'user'});
  }catch{}});
 }
 clearPrivate(){this.privateExceptions.clear();}
}
module.exports={Blocker,site};
