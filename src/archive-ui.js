// Archive (0.32, archive.cjs): a quiet "Archived" row under the open tabs. It shows only a count until you open it; the
// list is fetched then, so the sidebar carries nothing extra while it is closed. Click a row to bring the tab back.
(()=>{if(toolMode)return;
 const t=key=>window.prismLocale?.t?.(key)||key;
 const box=document.createElement('div');box.id='archive';box.hidden=true;
 const toggle=document.createElement('button');toggle.type='button';toggle.className='archive-toggle';toggle.setAttribute('aria-expanded','false');
 const label=document.createElement('span');label.className='archive-label';const count=document.createElement('span');count.className='archive-count';const chevron=icon('chevron');chevron.classList.add('archive-chevron');
 toggle.append(icon('archive'),label,count,chevron);
 const list=document.createElement('div');list.className='archive-list';list.hidden=true;list.setAttribute('role','list');
 box.append(toggle,list);$('tabs').after(box);
 let open=false,shown=-1;
 const ago=at=>{const m=Math.round((Date.now()-at)/60000);if(m<1)return t('Just now');if(m<60)return t('{n} min ago').replace('{n}',m);const h=Math.round(m/60);if(h<48)return t('{n} h ago').replace('{n}',h);return t('{n} days ago').replace('{n}',Math.round(h/24));};
 async function draw(){const rows=await act('archive-list');if(!open||!Array.isArray(rows))return;
  list.replaceChildren(...rows.map(e=>{const row=document.createElement('div');row.className='tab archived';row.setAttribute('role','listitem');
   const main=document.createElement('button');main.className='tab-main';main.title=e.url;main.onclick=()=>act('archive-restore',e.id);
   const badge=document.createElement('span');badge.className='tab-icon';badge.append(symbol(e.url,e.title));const title=document.createElement('span');title.className='tab-title';title.textContent=e.title;const when=document.createElement('small');when.className='archive-when';when.textContent=ago(e.at);
   main.append(badge,title,when);const remove=document.createElement('button');remove.className='tab-close';remove.setAttribute('aria-label',t('Remove from archive'));remove.title=t('Remove from archive');remove.append(icon('close'));remove.onclick=()=>act('archive-remove',e.id);
   row.append(main,remove);return row;}));
  if(rows.length){const clear=document.createElement('button');clear.type='button';clear.className='archive-clear';clear.textContent=t('Clear archive');clear.onclick=()=>act('archive-clear');list.append(clear);}}
 toggle.onclick=()=>{open=!open;toggle.setAttribute('aria-expanded',String(open));list.hidden=!open;box.classList.toggle('open',open);if(open)draw();else list.replaceChildren();};
 window.prism.onState(s=>{const n=s.archived||0;box.hidden=!n||s.space==='private';label.textContent=t('Archived');count.textContent=String(n);if(n!==shown){shown=n;if(open)draw();}if(!n&&open){open=false;list.hidden=true;toggle.setAttribute('aria-expanded','false');}});
})();
