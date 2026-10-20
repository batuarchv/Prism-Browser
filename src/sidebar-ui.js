// Sidebar editing: inline tab rename (double-click or the tab menu) and the "Organize tabs" button.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const list=document.getElementById('tabs'),organize=document.getElementById('organize-tabs');if(!list)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 let editing=null;
 const rowFor=id=>list.querySelector(`[data-motion-id="tab-${id}"]`);
 function finish(commit){if(!editing)return;const {id,value,original}=editing;editing=null;const row=rowFor(id);if(row)row.draggable=true;
  // renderTabs() skips unchanged data, so its cache key is cleared to put the title back.
  if(commit&&value.trim()!==original)act('tab-rename',{id,title:value.trim()});else{tabKey='';renderTabs();}}
 function beginRename(id){
  const row=rowFor(id),title=row?.querySelector('.tab-title');if(!title)return;
  if(!editing||editing.id!==id)editing={id,value:title.textContent,original:title.textContent};
  const input=document.createElement('input');input.className='tab-rename';input.value=editing.value;input.maxLength=200;input.setAttribute('aria-label',t('Tab name'));input.spellcheck=false;
  row.draggable=false;row.querySelectorAll('[draggable]').forEach(el=>el.draggable=false);title.replaceWith(input);input.focus();input.select();
  for(const type of ['click','pointerdown','dblclick','dragstart'])input.addEventListener(type,event=>event.stopPropagation());
  input.addEventListener('input',()=>{if(editing)editing.value=input.value;});
  input.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Enter'){event.preventDefault();finish(true);}else if(event.key==='Escape'){event.preventDefault();finish(false);}});
  input.addEventListener('blur',()=>setTimeout(()=>{if(editing?.id===id&&document.activeElement!==input)finish(true);},0));
 }
 // The tab list is rebuilt on state changes; an edit in progress is restored with what has been typed so far.
 new MutationObserver(()=>{if(editing&&!list.querySelector('.tab-rename'))beginRename(editing.id);}).observe(list,{childList:true});
 list.addEventListener('dblclick',event=>{const row=event.target.closest('.tab');if(!row||event.target.closest('.tab-close'))return;const id=Number(row.dataset.motionId?.slice(4));if(Number.isInteger(id)){event.preventDefault();beginRename(id);}});
 window.prism.onRenameTab?.(id=>beginRename(id));
 if(organize){organize.replaceChildren(icon('sort'));organize.onclick=()=>act('tabs-tidy');}
})();
