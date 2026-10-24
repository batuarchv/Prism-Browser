// Site controls (src/site-controls.cjs): the site icon at the left of the address bar opens a small popover with the
// permissions this site has asked for, page zoom, its cookies and data, its cache, Erase elements and hidden elements.
(()=>{
 const tool=new URLSearchParams(location.search).has('tool'),t=key=>window.prismLocale?.t?.(key)||key;
 if(!tool){
  // The site icon: a lock on HTTPS pages, the search glyph elsewhere; it opens the popover for web pages only.
  const button=$('protocol');if(!button)return;let key='';
  window.prism.onState(s=>{const active=s.tabs.find(x=>x.id===s.activeId),url=active?.url||'',web=/^https?:/.test(url)&&s.space!=='private',next=[web,url.startsWith('https:'),s.settings.language].join('|');if(next===key)return;key=next;
   button.disabled=!web;button.replaceChildren(web&&url.startsWith('https:')?icon('lock'):icon('search'));button.title=web?t('Site settings'):'';button.setAttribute('aria-label',t('Site settings'));});
  button.onclick=()=>{if(!button.disabled)openPanel('quick-site');};
  return;}
 const pane=document.querySelector('[data-pane=site]');if(!pane)return;
 const NAMES={camera:'Camera',microphone:'Microphone',geolocation:'Location',pip:'Picture in Picture',notifications:'Notifications',clipboard:'Clipboard'};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
 function row(label,...controls){const r=el('div','site-row');r.append(el('span','site-label',label),...controls);return r;}
 function button(text,run,cls=''){const b=el('button',cls,text);b.type='button';b.onclick=run;return b;}
 async function run(name,value){const info=await act(name,value);if(info&&info.site!==undefined)render(info);else refresh();}
 function render(info){
  const h1=document.querySelector('.prefs-heading h1');if(h1)h1.textContent=info.host||'';
  if(!info.site){pane.replaceChildren(el('p','site-empty',t('Site settings are unavailable here.')));fit();return;}
  const parts=[];
  if(info.permissions.length){const group=el('div','site-group');for(const p of info.permissions){const select=el('select');select.setAttribute('aria-label',t(NAMES[p.permission]));
    // Picture in Picture has no prompt: it is either allowed or blocked.
    for(const d of p.permission==='pip'?['allow','block']:['allow','ask','block']){const o=el('option',null,t(d==='allow'?'Allow':d==='ask'?'Ask':'Block'));o.value=d;o.selected=p.decision===d||(p.permission==='pip'&&d==='allow'&&p.decision==='ask');select.append(o);}
    select.onchange=()=>run('site-permission',{permission:p.permission,decision:select.value});group.append(row(t(NAMES[p.permission]),select));}
   parts.push(group);}
  const zoom=el('div','site-zoom');const pct=button(info.zoom+'%',()=>run('site-zoom',{direction:0}),'site-zoom-value');pct.title=t('Reset zoom');
  zoom.append(button('−',()=>run('site-zoom',{direction:-1})),pct,button('+',()=>run('site-zoom',{direction:1})));zoom.firstChild.setAttribute('aria-label',t('Zoom out'));zoom.lastChild.setAttribute('aria-label',t('Zoom in'));
  parts.push(el('div','site-group'));parts.at(-1).append(row(t('Zoom'),zoom));
  const data=el('div','site-group');
  const count=el('span','site-count',String(info.cookies));
  data.append(row(t('Cookies and site data'),count,button(t('Clear'),()=>run('site-data-clear'))),row(t('Cache'),button(t('Clear'),()=>run('site-cache-clear'))));
  if(info.hidden)data.append(row(t('Hidden elements'),el('span','site-count',String(info.hidden)),button(t('Restore'),()=>run('site-erase-restore'))));
  parts.push(data);
  const erase=button(t('Erase elements'),()=>{act('site-erase');act('close-tool');},'site-erase');
  parts.push(erase);
  if(info.permissions.length)parts.push(button(t('Reset permissions'),()=>run('site-permissions-reset'),'site-reset'));
  pane.replaceChildren(...parts);fit();}
 // The popover takes the height of its content.
 function fit(){requestAnimationFrame(()=>{const prefs=$('preferences'),head=document.querySelector('.prefs-heading');act('panel-fit',(head?.offsetHeight||40)+pane.scrollHeight+24);});}
 async function refresh(){const info=await act('site-info');if(info)render(info);}
 window.refreshSiteControls=refresh;
})();
