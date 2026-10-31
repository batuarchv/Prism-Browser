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
 // 0.43: macOS-style rows: a coloured symbol tile, the name, and a compact pop-up or button on the right.
 const NAMES={camera:'Camera',microphone:'Microphone',geolocation:'Location',pip:'Picture in Picture',notifications:'Notifications',clipboard:'Clipboard',midi:'MIDI devices'};
 const TILES={camera:['camera','#34c759'],microphone:['mic','#ff9500'],geolocation:['location','#007aff'],pip:['pip','#5856d6'],notifications:['bell','#ff3b30'],clipboard:['clipboard','#8e8e93'],midi:['music','#af52de'],
  hid:['keyboard','#30b0c7'],usb:['usb','#30b0c7'],serial:['chip','#30b0c7'],bluetooth:['bluetooth','#0a84ff'],zoom:['zoom','#636366'],cookies:['cookie','#a2845e'],cache:['archive','#8e8e93'],erase:['eraser','#ff2d55']};
 const DEVICE_KIND={hid:'Input device',usb:'USB device',serial:'Serial port',bluetooth:'Bluetooth device'};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
 function tile(kind){const [name,color]=TILES[kind]||['star','#8e8e93'],box=el('span','site-tile');box.style.setProperty('--tile',color);box.append(icon(name));return box;}
 function row(kind,label,detail,...controls){const r=el('div','site-row'),text=el('span','site-label');text.append(el('span','site-name',label));if(detail)text.append(el('small','site-detail',detail));r.append(tile(kind),text,...controls);return r;}
 function button(text,run,cls='site-button'){const b=el('button',cls,text);b.type='button';b.onclick=run;return b;}
 function group(title,rows){const box=el('section','site-group');if(title)box.append(el('h3','site-group-title',title));const list=el('div','site-list');list.append(...rows);box.append(list);return box;}
 async function run(name,value){const info=await act(name,value);if(info&&info.site!==undefined)render(info);else refresh();}
 function render(info){
  const h1=document.querySelector('.prefs-heading h1');if(h1)h1.textContent=info.host||'';
  if(!info.site){pane.replaceChildren(el('p','site-empty',t('Site settings are unavailable here.')));fit();return;}
  const parts=[];
  const identity=el('p','site-identity');identity.append(icon(info.secure?'lock':'shield'),el('span',null,t(info.secure?'Connection is secure':'Local page')));parts.push(identity);
  if(info.permissions.length)parts.push(group(t('Permissions'),info.permissions.map(p=>{const select=el('select','site-popup');select.setAttribute('aria-label',t(NAMES[p.permission]||p.permission));
    // Picture in Picture has no prompt: it is either allowed or blocked.
    for(const d of p.permission==='pip'?['allow','block']:['allow','ask','block']){const o=el('option',null,t(d==='allow'?'Allow':d==='ask'?'Ask':'Block'));o.value=d;o.selected=p.decision===d||(p.permission==='pip'&&d==='allow'&&p.decision==='ask');select.append(o);}
    select.dataset.decision=select.value;select.onchange=()=>run('site-permission',{permission:p.permission,decision:select.value});return row(p.permission,t(NAMES[p.permission]||p.permission),'',select);})));
  if(info.devices?.length)parts.push(group(t('Devices'),info.devices.map(d=>{const remove=button('',()=>run('device-remove',{origin:info.site,key:d.key}),'site-remove');remove.append(icon('close'));remove.title=t('Remove');remove.setAttribute('aria-label',t('Remove')+' · '+d.name);return row(d.type,d.name,t(DEVICE_KIND[d.type]||'Device'),remove);})));
  const zoom=el('div','site-segmented');const pct=button(info.zoom+'%',()=>run('site-zoom',{direction:0}),'site-zoom-value');pct.title=t('Reset zoom');
  const out=button('',()=>run('site-zoom',{direction:-1}));out.append(icon('minus'));out.setAttribute('aria-label',t('Zoom out'));const inn=button('',()=>run('site-zoom',{direction:1}));inn.append(icon('plus'));inn.setAttribute('aria-label',t('Zoom in'));zoom.append(out,pct,inn);
  const cookies=info.cookies===1?t('1 cookie'):t('{n} cookies').replace('{n}',info.cookies);
  const rows=[row('zoom',t('Zoom'),'',zoom),row('cookies',t('Cookies and site data'),cookies,button(t('Clear'),()=>run('site-data-clear'))),row('cache',t('Cache'),'',button(t('Clear'),()=>run('site-cache-clear')))];
  if(info.hidden)rows.push(row('erase',t('Hidden elements'),String(info.hidden),button(t('Restore'),()=>run('site-erase-restore'))));
  const erase=row('erase',t('Erase elements'),t('Click parts of the page to hide them'));erase.classList.add('site-action');erase.tabIndex=0;erase.setAttribute('role','button');erase.append(icon('chevron'));
  erase.onclick=()=>{act('site-erase');act('close-tool');};erase.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();erase.click();}};rows.push(erase);
  parts.push(group(t('This site'),rows));
  if(info.permissions.length||info.devices?.length)parts.push(button(t('Reset permissions'),async()=>{await act('site-permissions-reset');for(const d of info.devices||[])await act('device-remove',{origin:info.site,key:d.key});refresh();},'site-reset'));
  pane.replaceChildren(...parts);fit();}
 // The popover takes the height of its content.
 function fit(){requestAnimationFrame(()=>{const prefs=$('preferences'),head=document.querySelector('.prefs-heading');act('panel-fit',(head?.offsetHeight||40)+pane.scrollHeight+24);});}
 async function refresh(){const info=await act('site-info');if(info)render(info);}
 window.refreshSiteControls=refresh;
})();
