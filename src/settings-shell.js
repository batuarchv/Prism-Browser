(() => {
 const prefs=$('preferences'),nav=$('prefs-nav'),content=$('prefs-content');
 const brand=document.createElement('img');brand.className='preferences-mark';brand.src='../assets/prism-current-mark.png';brand.alt='';brand.draggable=false;document.querySelector('.prefs-heading>div').prepend(brand);
 const search=document.createElement('div');search.className='preferences-search';const field=document.createElement('input');field.type='search';field.placeholder='Search settings';field.setAttribute('aria-label','Search settings');search.append(icon('search'),field);nav.prepend(search);
 const groups=[['Personal',['profile','appearance','design','workspace']],['Browsing',['downloads','extensions','history']],['Privacy & security',['passwords','permissions','blocking','private']],['Intelligence',['ai','page-assistant']],['System',['performance','accessibility','imports','updates']]];
 const entries=[];
 for(const [title,ids]of groups){const group=document.createElement('div');group.className='preferences-nav-group';const caption=document.createElement('p');caption.className='preferences-nav-caption';caption.textContent=title;group.append(caption);for(const id of ids){const button=nav.querySelector(`[data-section="${id}"]`);if(!button)continue;group.append(button);entries.push({button,group,id});}nav.append(group);}
 const empty=document.createElement('p');empty.className='preferences-no-results';empty.textContent='No matching settings';empty.hidden=true;empty.setAttribute('role','status');nav.append(empty);
 function filter(){const query=field.value.trim().toLocaleLowerCase();let count=0;for(const {button,id}of entries){const pane=content.querySelector(`[data-pane="${id}"]`);const labels=pane?[...pane.querySelectorAll('h2,.setting-row>span')].map(e=>e.textContent).join(' '):'';const matches=!query||(button.textContent+' '+labels).toLocaleLowerCase().includes(query);button.hidden=!matches;if(matches)count++;}nav.querySelectorAll('.preferences-nav-group').forEach(g=>g.hidden=![...g.querySelectorAll('button')].some(b=>!b.hidden));empty.hidden=!!count;}
 field.addEventListener('input',filter);
 field.addEventListener('keydown',e=>{if(e.key==='Escape'&&field.value){e.stopPropagation();field.value='';filter();}if(e.key==='ArrowDown'||e.key==='Enter'){const first=entries.find(x=>!x.button.hidden)?.button;if(first){e.preventDefault();first.focus();if(e.key==='Enter')first.click();}}});
 nav.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key)||!e.target.matches('[data-section]'))return;const visible=[...nav.querySelectorAll('[data-section]')].filter(b=>!b.hidden);let index=visible.indexOf(e.target);index=e.key==='Home'?0:e.key==='End'?visible.length-1:(index+(e.key==='ArrowDown'?1:-1)+visible.length)%visible.length;e.preventDefault();visible[index]?.focus();});
 window.refreshSettingsChrome=()=>{content.scrollTop=0;const selected=nav.querySelector('[aria-current=page]');if(field.value){field.value='';filter();}if(selected)selected.scrollIntoView({block:'nearest'});};
 // Keep compatibility details available without turning the main panel into a manual.
 const compatibility=content.querySelector('[data-pane=extensions]>.info-card');
 if(compatibility){const disclosure=document.createElement('details');disclosure.className='settings-disclosure';const summary=document.createElement('summary');summary.textContent='Compatibility & updates';compatibility.before(disclosure);disclosure.append(summary,compatibility);}
 // Section toolbars should wrap as a unit, preserving every action at narrow widths.
 for(const toolbar of content.querySelectorAll('.section-toolbar'))toolbar.classList.add('settings-section-toolbar');
})();
