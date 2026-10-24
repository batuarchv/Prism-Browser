// Per-site controls behind the site icon in the address bar (site-controls-ui.js): the permissions a site has asked
// for, its cookies and site data, its cache, a per-site page zoom, and elements hidden with Erase. Hidden elements
// are stored as CSS selectors per origin and re-applied with insertCSS on every page of that origin.
const {origin}=require('./site-permissions.cjs');

// Erase mode, injected into the page's isolated world. Hovering outlines the element under the pointer with a label;
// click hides it, ⌥-click hides every element with the same structure (the count is in the label); Esc ends the mode.
// Resolves with the selectors hidden, so nothing has to talk back to the browser while the mode runs.
function eraseScript(labels){return `new Promise(done=>{if(window.__prismErase)return done([]);window.__prismErase=true;
 const L=${JSON.stringify(labels)},hidden=[];const host=document.createElement('prism-erase');const root=host.attachShadow({mode:'closed'});const sheet=new CSSStyleSheet();
 sheet.replaceSync(':host{all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647}.box{position:fixed;border:1.5px solid #0a84ff;background:rgba(10,132,255,.08);border-radius:4px;transition:all .06s}.tag{position:fixed;font:500 11px -apple-system,sans-serif;color:#fff;background:#0a84ff;border-radius:6px;padding:3px 7px;white-space:nowrap}.hint{position:fixed;left:50%;top:12px;transform:translateX(-50%);font:500 12px -apple-system,sans-serif;color:#1d1d1f;background:rgba(246,246,248,.92);border-radius:9px;padding:6px 11px;box-shadow:0 2px 10px rgba(0,0,0,.15)}@media (prefers-color-scheme:dark){.hint{background:rgba(44,44,46,.92);color:#f2f2f7}}');
 root.adoptedStyleSheets=[sheet];const box=document.createElement('div'),tag=document.createElement('div'),hint=document.createElement('div');box.className='box';tag.className='tag';hint.className='hint';hint.textContent=L.hint;root.append(box,tag,hint);document.documentElement.append(host);
 const style=document.createElement('style');style.dataset.prismErase='';document.documentElement.append(style);
 const esc=s=>CSS.escape(s),stable=c=>c&&!/\\d{3,}|^(css|sc|jsx|tw)-|[A-Z0-9]{6,}/.test(c)&&c.length<40;
 function part(el,nth){let p=el.localName;if(el.id&&stable(el.id)&&!nth)return '#'+esc(el.id);const cls=[...el.classList].filter(stable).slice(0,3);p+=cls.map(c=>'.'+esc(c)).join('');
  if(nth&&el.parentElement){const same=[...el.parentElement.children].filter(x=>x.localName===el.localName);if(same.length>1)p+=':nth-of-type('+(same.indexOf(el)+1)+')';}return p;}
 function selector(el,nth){const parts=[];for(let n=el;n&&n!==document.documentElement&&parts.length<6;n=n.parentElement){parts.unshift(part(n,nth));if(nth&&n.id&&stable(n.id))break;const s=parts.join(' > ');if(nth&&document.querySelectorAll(s).length===1)return s;}return parts.join(' > ');}
 let target=null;const pick=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el!==document.body&&el!==document.documentElement?el:null;};
 function show(el,alt){if(!el){box.style.display=tag.style.display='none';return;}const r=el.getBoundingClientRect();box.style.display=tag.style.display='block';Object.assign(box.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  const all=document.querySelectorAll(selector(el,false)).length;tag.textContent=(el.localName+(el.classList[0]?'.'+el.classList[0]:'')).slice(0,40)+(all>1?' · '+(alt?L.all.replace('{n}',all):L.similar.replace('{n}',all)):'');
  tag.style.left=Math.max(4,r.left)+'px';tag.style.top=(r.top>26?r.top-24:r.bottom+4)+'px';}
 const move=e=>{target=pick(e);show(target,e.altKey);};
 const click=e=>{if(!e.isTrusted)return;e.preventDefault();e.stopPropagation();const el=pick(e);if(!el)return;const s=selector(el,!e.altKey);hidden.push(s);style.textContent+=s+'{display:none!important}';target=null;show(null);};
 const key=e=>{if(e.key==='Escape'){e.preventDefault();finish();}else if(e.key==='Alt'&&target)show(target,e.type==='keydown');};
 const block=e=>{if(e.isTrusted){e.preventDefault();e.stopPropagation();}};
 function finish(){removeEventListener('mousemove',move,true);removeEventListener('click',click,true);removeEventListener('keydown',key,true);removeEventListener('keyup',key,true);for(const t of ['mousedown','mouseup','pointerdown','pointerup'])removeEventListener(t,block,true);removeEventListener('pagehide',finish);host.remove();window.__prismErase=false;done(hidden);}
 addEventListener('mousemove',move,true);addEventListener('click',click,true);addEventListener('keydown',key,true);addEventListener('keyup',key,true);for(const t of ['mousedown','mouseup','pointerdown','pointerup'])addEventListener(t,block,true);addEventListener('pagehide',finish);
})`;}

function createSiteControls({permissions,activeTab,settings,saveSettings,readHidden,writeHidden,confirm,translate=t=>t,defaultZoom=()=>1}){
 let hidden=readHidden()||{};const applied=new WeakMap();
 const siteOf=t=>t&&t.view&&!t.view.webContents.isDestroyed()?origin(t.view.webContents.getURL()):null;
 const zoomFor=site=>{const z=settings.siteZoom?.[site];return Number.isFinite(z)?z:defaultZoom();};
 async function cookies(wc,site){try{const list=await wc.session.cookies.get({url:site});return list;}catch{return [];}}
 // Re-applies this origin's hidden elements and zoom after each navigation (called from main.cjs).
 async function apply(wc){const site=origin(wc.getURL());if(!site)return;try{wc.setZoomFactor(zoomFor(site));}catch{}
  const css=(hidden[site]||[]).map(s=>s+'{display:none!important}').join('\n');const old=applied.get(wc);if(old){wc.removeInsertedCSS(old).catch(()=>{});applied.delete(wc);}
  if(css)applied.set(wc,await wc.insertCSS(css,{cssOrigin:'user'}).catch(()=>null));}
 async function info(){const t=activeTab(),site=siteOf(t);if(!site||t.space==='private')return {site:null,private:t?.space==='private'};const wc=t.view.webContents;
  return {site,host:new URL(site).host,secure:site.startsWith('https:'),permissions:permissions.forSite(site),cookies:(await cookies(wc,site)).length,zoom:Math.round(wc.getZoomFactor()*100),hidden:(hidden[site]||[]).length};}
 async function handle(name,value){const t=activeTab(),site=siteOf(t);if(!site||t.space==='private')return {error:'Site settings are unavailable here.'};const wc=t.view.webContents;
  if(name==='site-permission'){permissions.set(site,value?.permission,value?.decision);return info();}
  if(name==='site-permissions-reset'){permissions.resetSite(site);return info();}
  if(name==='site-data-clear'){if(!await confirm(translate('Clear cookies and data for {site}?').replace('{site}',new URL(site).host)))return info();
   for(const c of await cookies(wc,site))await wc.session.cookies.remove(site,c.name).catch(()=>{});
   await wc.session.clearStorageData({origin:site,storages:['cookies','localstorage','indexdb','websql','serviceworkers','cachestorage','filesystem']}).catch(()=>{});return info();}
  if(name==='site-cache-clear'){await wc.session.clearStorageData({origin:site,storages:['cachestorage','shadercache']}).catch(()=>{});await wc.session.clearCodeCaches({urls:[site]}).catch(()=>{});return {...await info(),message:translate('Cache cleared')};}
  if(name==='site-zoom'){const steps=[.5,.67,.75,.8,.9,1,1.1,1.25,1.5,1.75,2,2.5,3],cur=wc.getZoomFactor(),dir=Number(value?.direction)||0;
   const next=dir===0?defaultZoom():dir>0?steps.find(z=>z>cur+.001)??steps.at(-1):[...steps].reverse().find(z=>z<cur-.001)??steps[0];
   settings.siteZoom={...(settings.siteZoom||{})};if(Math.abs(next-defaultZoom())<.001)delete settings.siteZoom[site];else settings.siteZoom[site]=next;saveSettings();wc.setZoomFactor(next);return info();}
  if(name==='site-erase'){wc.focus();const found=await wc.executeJavaScriptInIsolatedWorld(998,[{code:eraseScript({hint:translate('Click to hide · ⌥-click hides all similar · Esc when done'),similar:translate('{n} similar'),all:translate('hide all {n}')})}],true).catch(()=>[]);
   if(Array.isArray(found)&&found.length&&origin(wc.getURL())===site){hidden={...hidden,[site]:[...new Set([...(hidden[site]||[]),...found.map(String).filter(s=>s.length<600)])].slice(-200)};writeHidden(hidden);await apply(wc);}return info();}
  if(name==='site-erase-restore'){delete hidden[site];hidden={...hidden};writeHidden(hidden);await apply(wc);wc.reload();return info();}
  return null;}
 return {info,handle,apply,zoomFor,hiddenFor:site=>hidden[site]||[]};
}
module.exports={createSiteControls,eraseScript};
