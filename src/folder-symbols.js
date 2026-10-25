// Folder symbols (0.39): right-click a folder → Change Symbol opens this grid under the folder. The symbols come from
// the spaces' set, minus the ones that mean nothing on a folder (weather, water, flowers and the like).
(()=>{const FOLDER_SYMBOLS=['folder','briefcase','house','person','star','heart','bolt','book','pencil','code','terminal','flask','palette','camera','film','music','headphones','game','cart','gift','coffee','fork','dumbbell','paw','plane','car','map','globe','mountain','rocket','graduation','money','chat','leaf'];
 window.PRISM_FOLDER_SYMBOLS=FOLDER_SYMBOLS;let open=null;
 function close(){if(!open)return;open.panel.remove();document.removeEventListener('pointerdown',open.outside,true);open=null;}
 window.prismFolderSymbol=folder=>{close();const summary=[...document.querySelectorAll('#bookmarks summary')].find(s=>s.textContent===folder);if(!summary)return;
  const current=state?.folderIcons?.[folder]||'folder',panel=document.createElement('div');panel.className='folder-symbols';panel.setAttribute('role','listbox');panel.setAttribute('aria-label',(window.prismLocale?.t('Folder symbol')||'Folder symbol')+' · '+folder);
  for(const name of FOLDER_SYMBOLS){const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.setAttribute('aria-selected',String(name===current));b.title=name;b.setAttribute('aria-label',name);b.append(name==='folder'?icon('folder'):window.spaceIcon(name));
   b.onclick=()=>{close();act('folder-icon',{folder,icon:name});};panel.append(b);}
  panel.addEventListener('keydown',e=>{const items=[...panel.children],i=items.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();close();summary.focus();}else if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const step={ArrowRight:1,ArrowLeft:-1,ArrowDown:6,ArrowUp:-6}[e.key];items[Math.max(0,Math.min(items.length-1,i+step))]?.focus();}});
  summary.after(panel);const outside=e=>{if(!panel.contains(e.target))close();};open={panel,outside};setTimeout(()=>document.addEventListener('pointerdown',outside,true));
  (panel.querySelector('[aria-selected=true]')||panel.firstChild).focus();panel.scrollIntoView({block:'nearest'});};
 window.prism.onState(()=>{if(open&&!open.panel.isConnected)close();});
})();
