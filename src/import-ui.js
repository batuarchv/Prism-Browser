// One-click browser import (0.42). Every [data-import-sources] container (Settings → Imports, the welcome guide's
// Places step) lists the browsers found on this Mac. Each card picks a profile and what to bring over; one Import
// button shows a single macOS confirmation in the main process (browser-migrate.cjs does the reading).
(() => {
 const t=key=>window.prismLocale?.t?.(key)??key;
 const kinds=[['bookmarks','Bookmarks','star'],['passwords','Passwords','key'],['history','History','history']];
 const picks=new Map();let busy=false;
 const el=(tag,props={},...children)=>{const node=Object.assign(document.createElement(tag),props);node.append(...children);return node;};
 // One row per browser (0.47.2): icon, name, what to bring over as small check toggles, and Import on the right.
 function card(source,container){
  const pick=picks.get(source.id)||{profile:source.profiles[0].id,bookmarks:true,passwords:true,history:true};picks.set(source.id,pick);
  // "All profiles" (0.47) merges every profile into Prism: each kind is offered if any profile has it.
  const all={id:'*',name:t('All profiles'),bookmarks:source.profiles.some(p=>p.bookmarks),passwords:source.profiles.some(p=>p.passwords),history:source.profiles.some(p=>p.history)};
  const profile=()=>pick.profile==='*'?all:source.profiles.find(p=>p.id===pick.profile)||source.profiles[0];
  const art=source.icon?el('img',{className:'import-app',src:source.icon,alt:''}):el('span',{className:'import-app'},icon('folder'));
  const title=el('div',{className:'import-title'},el('h3',{textContent:source.name}));
  if(source.profiles.length>1){const select=el('select',{className:'import-profile'});select.setAttribute('aria-label',t('Profile')+' · '+source.name);for(const p of source.profiles)select.append(el('option',{value:p.id,textContent:p.name}));select.append(el('option',{value:'*',textContent:t('All profiles (merge)')}));select.value=pick.profile;select.onchange=()=>{pick.profile=select.value;sync();};title.append(select);}
  const group=el('div',{className:'import-kinds'});group.setAttribute('role','group');group.setAttribute('aria-label',t('What to import'));
  const toggles=kinds.filter(([kind])=>kind!=='passwords'||source.id!=='safari').map(([kind,label])=>{const button=el('button',{type:'button',className:'import-kind'},el('span',{className:'import-check'},icon('check')),el('span',{textContent:t(label)}));button.dataset.kind=kind;button.onclick=()=>{pick[kind]=!pick[kind];sync();};group.append(button);return button;});
  const go=el('button',{type:'button',className:'import-go',textContent:t('Import')});
  const status=el('p',{className:'import-status'});status.setAttribute('role','status');
  const root=el('div',{className:'import-source'},art,el('div',{className:'import-main'},title,group),go,status);root.dataset.browser=source.id;
  if(source.needsAccess){const access=el('button',{type:'button',className:'import-link',textContent:t('Allow Full Disk Access…')});access.onclick=()=>act('import-disk-access');root.append(el('p',{className:'import-note'},el('span',{textContent:t('Prism needs Full Disk Access to read Safari’s bookmarks and history.')+' '}),access));}
  // Safari's passwords are in iCloud Keychain, which only the Passwords app can export.
  if(source.id==='safari'){const open=el('button',{type:'button',className:'import-link',textContent:t('Open Passwords')}),file=el('button',{type:'button',className:'import-link',textContent:t('Choose exported file…')});open.onclick=()=>act('apple-passwords');file.onclick=()=>act('import-passwords');root.append(el('p',{className:'import-note'},el('span',{textContent:t('Passwords come from the Passwords app: File → Export All Passwords.')+' '}),open,file));}
  function sync(){
   const p=profile();let any=false;
   for(const button of toggles){const kind=button.dataset.kind,available=p[kind]&&!(kind==='history'&&source.historyOff);button.disabled=busy||!available;const on=available&&pick[kind];button.setAttribute('aria-pressed',String(on));if(on)any=true;button.title=kind==='history'&&source.historyOff?t('History is off because Prism keeps no history right now.'):!p[kind]?t('Nothing to import'):'';}
   go.disabled=busy||!any;
   const select=title.querySelector('select');if(select)select.disabled=busy;
  }
  go.onclick=async()=>{
   busy=true;refreshAll();status.textContent=t('Importing…');
   try{const p=profile(),targets=p.id==='*'?source.profiles:[p],messages=[];
    for(const [i,target] of targets.entries()){if(targets.length>1)status.textContent=t('Importing {name}…').replace('{name}',target.name)+' ('+(i+1)+'/'+targets.length+')';
     const result=await act('import-browser',{browser:source.id,profile:target.id,bookmarks:pick.bookmarks&&target.bookmarks,passwords:pick.passwords&&target.passwords,history:pick.history&&target.history});
     if(result?.needsAccess){source.needsAccess=true;render(container);return;}if(result?.error){messages.push((targets.length>1?target.name+': ':'')+result.error);if(targets.length===1)break;continue;}if(result?.message)messages.push((targets.length>1?target.name+': ':'')+result.message);}
    status.textContent=messages.join(' · ');}
   finally{busy=false;refreshAll();}
  };
  root.sync=sync;sync();return root;
 }
 function refreshAll(){for(const node of document.querySelectorAll('.import-source'))node.sync?.();}
 async function render(container){
  if(!container?.isConnected)return;let sources=[];
  let missing=[];
  try{[sources,missing]=await Promise.all([window.prism.action('import-sources'),window.prism.action('import-missing').catch(()=>[])]);}catch{}
  if(!container.isConnected)return;
  const cards=(Array.isArray(sources)?sources:[]).map(source=>card(source,container));
  // The other browsers Prism reads (0.47.1): installed ones with nothing to bring over yet, and the rest by name.
  const names=list=>list.map(b=>b.name).join(', ');const installed=(missing||[]).filter(b=>b.installed),absent=(missing||[]).filter(b=>!b.installed);
  const more=[installed.length&&t('{names}: nothing to import yet.').replace('{names}',names(installed)),absent.length&&t('Also works with {names}.').replace('{names}',names(absent))].filter(Boolean);
  container.replaceChildren(cards.length?el('div',{className:'import-list'},...cards):el('p',{className:'import-supported',textContent:t('No other browsers were found on this Mac.')}),...more.map(text=>el('p',{className:'import-supported',textContent:text})));
  container.dataset.ready='true';
 }
 const renderAll=()=>{for(const container of document.querySelectorAll('[data-import-sources]'))if(container.getClientRects().length)render(container);};
 // Coming back from System Settings (Full Disk Access) or another browser refreshes what can be imported.
 window.addEventListener('focus',()=>{if(!busy)renderAll();});
 // The welcome guide redraws its step content; a new Places step gets its list here.
 const setup=document.getElementById('setup-content');if(setup)new MutationObserver(()=>{for(const container of setup.querySelectorAll('[data-import-sources]:not([data-ready])'))render(container);}).observe(setup,{childList:true});
 const pane=document.querySelector('[data-pane=imports]');if(pane)new MutationObserver(()=>{if(!pane.hidden&&!busy)renderAll();}).observe(pane,{attributes:true,attributeFilter:['hidden']});
 window.prismImports={render,renderAll};
})();
