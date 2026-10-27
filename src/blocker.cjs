const fs=require('node:fs'),path=require('node:path');
const {FiltersEngine,Request}=require('@ghostery/adblocker');
const TYPES={mainFrame:'main_frame',subFrame:'sub_frame',xhr:'xmlhttprequest'};
function site(url){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname:'';}catch{return '';}}
// Prism Shield (0.33). Network rules (with uBlock's harmless stand-ins instead of a hard block where a list asks for one,
// so pages that expect an analytics script keep working), tracking parameters stripped from links, Global Privacy
// Control, and per-site cosmetic rules and scriptlets handed to shield-preload.cjs before the page's own scripts run.
const TRACKING=/^(utm_[a-z_]+|fbclid|gclid|gclsrc|dclid|gbraid|wbraid|msclkid|mc_cid|mc_eid|igshid|yclid|twclid|ttclid|li_fat_id|_hsenc|_hsmi|__hssc|__hstc|__hsfp|hsctatracking|mkt_tok|oly_anon_id|oly_enc_id|vero_id|vero_conv|rb_clickid|s_cid|_openstat|wickedid|epik|srsltid)$/i;
const SHARE={'youtube.com':/^(si|pp|feature)$/,'youtu.be':/^(si|feature)$/,'open.spotify.com':/^si$/,'instagram.com':/^igsh$/,'x.com':/^(s|t|ref_src)$/,'twitter.com':/^(s|t|ref_src)$/,'tiktok.com':/^(_t|_r|is_from_webapp|sender_device)$/};
function cleanLink(url){try{const u=new URL(url);if(!/^https?:$/.test(u.protocol)||!u.search)return null;const host=u.hostname.replace(/^(www|m)\./,''),share=Object.entries(SHARE).find(([h])=>host===h||host.endsWith('.'+h))?.[1];
 let changed=false;for(const key of [...new Set(u.searchParams.keys())])if(TRACKING.test(key)||share?.test(key)){u.searchParams.delete(key);changed=true;}return changed?u.toString():null;}catch{return null;}}
// Skips a YouTube video ad that slipped past the scriptlets: jump to its end and press Skip as soon as it appears.
// It watches only the player's own class (0.33.1), never the whole page, which changes classes constantly. Since 0.40
// it checks again each second only while it is still looking for the player (at most a minute; YouTube's own
// navigation event starts the search again) or while an ad is showing, instead of every second for as long as the tab is open.
const YOUTUBE_SKIP=`(()=>{if(window.__prismSkip)return;window.__prismSkip=1;let player=null,timer=0,tries=0;const later=()=>{if(!timer)timer=setTimeout(()=>{timer=0;tick();},1000);};const tick=()=>{if(!player?.isConnected){player=document.querySelector('.html5-video-player');if(!player){if(++tries<60)later();return;}tries=0;new MutationObserver(tick).observe(player,{attributes:true,attributeFilter:['class']});}if(!player.classList.contains('ad-showing'))return;later();const v=player.querySelector('video');if(v&&Number.isFinite(v.duration)&&v.duration>0&&v.currentTime<v.duration-.1)v.currentTime=v.duration;for(const b of player.querySelectorAll('.ytp-skip-ad-button,.ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-ad-skip-button-container button'))b.click();};document.addEventListener('yt-navigate-finish',()=>{tries=0;tick();});tick();})();`;
const GPC=`try{Object.defineProperty(Navigator.prototype,'globalPrivacyControl',{get:()=>true,configurable:true});}catch{}`;
class Blocker {
 constructor({file,changed=()=>{},engine}={}){
  this.file=file;this.changed=changed;this.privateExceptions=new Set();this.counts=new Map();this.enabled=true;this.exceptions=new Set();this.stats={blocked:0,cleaned:0};this.frames=new Map();this.repeats=new Map();
  try{const saved=JSON.parse(fs.readFileSync(file));this.enabled=saved.enabled!==false;this.exceptions=new Set((saved.exceptions||[]).filter(s=>typeof s==='string'&&site('https://'+s)===s).slice(0,1000));if(Number.isFinite(saved.stats?.blocked))this.stats={blocked:saved.stats.blocked,cleaned:Number(saved.stats.cleaned)||0};}catch{}
  this.engine=engine||FiltersEngine.deserialize(fs.readFileSync(path.join(__dirname,'../assets/blocker/engine.bin')));
 }
 active(url,privateMode=false){return this.enabled&&!(privateMode?this.privateExceptions:this.exceptions).has(site(url));}
 save(clear=true){if(clear)this.frames.clear();if(this.file){fs.writeFileSync(this.file+'.tmp',JSON.stringify({enabled:this.enabled,exceptions:[...this.exceptions],stats:this.stats}),{mode:0o600});fs.renameSync(this.file+'.tmp',this.file);}this.changed();}
 toggle(enabled){if(typeof enabled!=='boolean')throw Error('Invalid protection setting');this.enabled=enabled;this.save();}
 toggleSite(url,privateMode=false){const host=site(url);if(!host)throw Error('Open a website first.');const list=privateMode?this.privateExceptions:this.exceptions;if(list.has(host))list.delete(host);else{if(list.size>=1000)throw Error('Too many site exceptions.');list.add(host);}if(privateMode){this.frames.clear();this.changed();}else this.save();}
 snapshot(url,privateMode=false,id){const {sources=[],...manifest}=require('../assets/blocker/manifest.json');return {enabled:this.enabled,site:site(url),active:this.active(url,privateMode),blocked:this.counts.get(id)||0,total:this.stats.blocked,cleaned:this.stats.cleaned,exceptions:[...(privateMode?this.privateExceptions:this.exceptions)],...manifest,lists:sources.length};}
 // The blocked count reaches the window at most every 1.5 s (a page that retries a blocked ad hundreds of times a second
 // would otherwise keep the window busy redrawing it), and running totals are written at most every 30 seconds.
 notify(){if(this.timer)return;this.timer=setTimeout(()=>{this.timer=null;this.changed();if(this.file&&!this.statsTimer){this.statsTimer=setTimeout(()=>{this.statsTimer=null;try{this.save(false);}catch{}},30000);this.statsTimer.unref?.();}},1500);this.timer.unref?.();}
 count(id){this.stats.blocked++;if(id>=0){if(this.counts.size>=512&&!this.counts.has(id))this.counts.delete(this.counts.keys().next().value);this.counts.set(id,Math.min(999999,(this.counts.get(id)||0)+1));}this.notify();}
 // What to do with one request: {} lets it through, {cancel} blocks it, {redirectURL} swaps in a stand-in or a clean link.
 decide(details,privateMode=false){
  if(details.resourceType==='mainFrame'){this.counts.delete(details.webContentsId);if(!this.active(details.url,privateMode))return {};const clean=cleanLink(details.url);if(clean){this.stats.cleaned++;this.notify();return {redirectURL:clean};}return {};}
  const wc=details.webContents;const top=wc&&!wc.isDestroyed()?wc.getURL():details.referrer;
  if(!this.active(top,privateMode)||!/^https?:|^wss?:/.test(details.url))return {};
  if(details.resourceType==='subFrame'){const clean=cleanLink(details.url);if(clean)return {redirectURL:clean};}
  const sourceUrl=details.frame?.url||details.referrer||top||'';
  const result=this.engine.match(Request.fromRawDetails({url:details.url,sourceUrl,type:TYPES[details.resourceType]||details.resourceType||'other'}));
  if(result.redirect){this.count(details.webContentsId);return {redirectURL:result.redirect.dataUrl};}
  if(result.match){const delay=this.repeat(details);if(!delay)this.count(details.webContentsId);return delay?{cancel:true,delay}:{cancel:true};}return {};
 }
 // Some pages ask again the moment a request is blocked (CNN's video ad config: about 8,000 times a second), which kept
 // a renderer and Prism's main process busy without end (0.33.1). After eight blocks of the same address from the same
 // page in quick succession, the answer still comes, but later each time, up to four seconds, so such a loop idles.
 repeat(details){const now=Date.now(),key=details.webContentsId+' '+details.url;let r=this.repeats.get(key);
  if(!r||now-r.since>6000){if(this.repeats.size>=1000)for(const [k,v] of this.repeats)if(now-v.since>6000||this.repeats.size>=1000)this.repeats.delete(k);r={since:now,n:0};this.repeats.set(key,r);}
  r.n++;if(r.n<=8)return 0;r.since=now;return Math.min(4000,50*2**Math.min(7,r.n-8));}
 check(details,privateMode=false){const d=this.decide(details,privateMode);return details.resourceType!=='mainFrame'&&!!(d.cancel||d.redirectURL);}
 // Cosmetic rules and scriptlets for a frame, asked for synchronously by shield-preload.cjs as the frame starts.
 // 0.33.1: uBlock's scriptlets are written to share one scope per scriptlet; run one after another at the top level,
 // each redefined the others' helpers (proxyApplyFn and friends keep state on themselves), so YouTube's own JSON.parse
 // and fetch broke and the page never filled in. Each now runs in its own function, all in one script, and the result
 // is kept per site so a page full of frames asks the engine once per site, not once per frame.
 frame({url,top,privateMode=false,main=true}){
  const host=site(url);if(!host||!this.active(top||url,privateMode))return null;
  const key=(main?'m:':'f:')+host;if(this.frames.has(key)){const hit=this.frames.get(key);this.frames.delete(key);this.frames.set(key,hit);return hit;}
  try{const request=Request.fromRawDetails({url,type:main?'main_frame':'sub_frame'});
   const {styles,scripts}=this.engine.getCosmeticsFilters({url,hostname:request.hostname,domain:request.domain,getBaseRules:true,getInjectionRules:true,getExtendedRules:false,getRulesFromHostname:true,getRulesFromDOM:false});
   const youtube=/(^|\.)youtube\.com$/.test(request.hostname);
   const script=[GPC,...scripts,...(youtube&&main?[YOUTUBE_SKIP]:[])].map(s=>'try{(function(){'+s+'\n})();}catch(e){}').join('\n');
   const rules={styles:styles||'',script};if(this.frames.size>=300)this.frames.delete(this.frames.keys().next().value);this.frames.set(key,rules);return rules;
  }catch{return null;}
 }
 // Generic hiding rules for the classes and ids the page actually uses, sent by shield-preload.cjs as the page grows.
 dom({url,top,privateMode=false,classes=[],ids=[],hrefs=[]}){
  if(!site(url)||!this.active(top||url,privateMode))return '';
  try{const request=Request.fromRawDetails({url,type:'main_frame'});const list=a=>Array.isArray(a)?a.filter(x=>typeof x==='string'&&x.length<300).slice(0,3000):[];
   return this.engine.getCosmeticsFilters({url,hostname:request.hostname,domain:request.domain,classes:list(classes),ids:list(ids),hrefs:list(hrefs),getBaseRules:false,getInjectionRules:false,getExtendedRules:false,getRulesFromHostname:false,getRulesFromDOM:true}).styles||'';
  }catch{return '';}
 }
 // The normal session is filtered here; Private's requests go through PrivateNetwork, which asks decide() first.
 // Global Privacy Control is announced to pages (navigator.globalPrivacyControl) rather than as a request header: a header
 // needs a second webRequest listener, one more trip through the main process for every request (0.33.1).
 // before() may return a promise to hold an allowed request briefly (the site bypass adding a host to its route).
 bind(session,privateMode=false,before){if(!privateMode)session.webRequest.onBeforeRequest((details,callback)=>{const d=this.decide(details);if(d.delay){const timer=setTimeout(()=>callback({cancel:true}),d.delay);timer.unref?.();return;}const wait=!d.cancel&&!d.redirectURL&&before?.(details);if(wait)wait.then(()=>callback(d),()=>callback(d));else callback(d);});}
 attach(wc){wc.once('destroyed',()=>this.counts.delete(wc.id));}
 clearPrivate(){this.privateExceptions.clear();}
}
module.exports={Blocker,site,cleanLink};
