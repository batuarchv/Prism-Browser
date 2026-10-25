// Address bar in the sidebar (0.32, Settings → Appearance → Address bar). The toolbar's own buttons move into the
// sidebar, so their handlers and state stay as they are: back, forward and reload beside the window buttons and the
// address field where New tab was. The page tools (protection, bookmark, passwords, keep awake, extensions, split)
// move behind the Settings button at the foot of the sidebar (0.32.1): it opens a small glass menu with those tools
// as live tiles and Settings at the bottom. Switching modes shows the tools flying down to it once. The page then
// reaches the top of the window (main.cjs toolbarTop()). A collapsed sidebar puts everything back in the toolbar.
(()=>{if(toolMode)return;
 const header=document.querySelector('main>header'),root=document.documentElement,t=key=>window.prismLocale?.t?.(key)||key;
 const dock=cls=>{const el=document.createElement('div');el.className='toolbar-dock '+cls;return el;};
 const nav=dock('dock-nav'),field=dock('dock-address'),tools=dock('dock-tools');tools.setAttribute('role','group');tools.setAttribute('aria-label','Page tools');
 // The Settings menu: page tools as tiles, then Settings itself.
 const menu=document.createElement('div');menu.id='tools-menu';menu.hidden=true;menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Page tools');
 const settingsRow=document.createElement('button');settingsRow.type='button';settingsRow.className='tools-settings';settingsRow.append(icon('settings'),Object.assign(document.createElement('span'),{textContent:'Settings'}),Object.assign(document.createElement('kbd'),{textContent:'⌘ ,'}));
 menu.append(tools,Object.assign(document.createElement('div'),{className:'tools-separator'}),settingsRow);
 const gear=$('settings');gear.closest('.sidebar-bottom').append(menu);
 let order=[],placed=false,ready=false;
 function toSidebar(){order=[...header.children];const from=[...header.children].filter(el=>!el.matches('.nav,#sidebar-toggle,#address-form')&&el.matches('button')&&el.getClientRects().length).map(el=>({el,rect:el.getBoundingClientRect()}));
  nav.append($('sidebar-toggle'),header.querySelector('.nav'));field.append($('address-form'));tools.append(...header.children);
  document.querySelector('#sidebar .window-drag').append(nav);$('new').after(field);placed=true;gear.setAttribute('aria-haspopup','dialog');gear.setAttribute('aria-expanded','false');
  if(ready)requestAnimationFrame(()=>flyToGear(from));}
 function toToolbar(){closeMenu(false);header.append(...order);for(const el of [...tools.children])header.append(el);nav.remove();field.remove();placed=false;gear.removeAttribute('aria-haspopup');gear.removeAttribute('aria-expanded');}
 // Once, when the mode is switched on: copies of the toolbar icons glide from the top of the sidebar down into the
 // Settings button, which then glows briefly, and a short note says where they went.
 function flyToGear(from){const still=state?.settings.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;const g=gear.getBoundingClientRect(),side=$('sidebar').getBoundingClientRect();
  if(!still)from.forEach(({el,rect},i)=>{const ghost=el.cloneNode(true);ghost.removeAttribute('id');ghost.classList.add('tool-ghost');ghost.setAttribute('aria-hidden','true');const x=Math.min(side.right-36,side.left+40+i*30),y=14;
   Object.assign(ghost.style,{left:x+'px',top:y+'px',width:rect.width+'px',height:rect.height+'px'});document.body.append(ghost);
   const dx=g.left+g.width/2-(x+rect.width/2),dy=g.top+g.height/2-(y+rect.height/2);
   ghost.animate([{transform:'translate(0,0) scale(1)',opacity:0},{transform:'translate(0,0) scale(1)',opacity:1,offset:.12},{transform:`translate(${dx*.35}px,${dy*.55}px) scale(.9)`,opacity:1,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.35)`,opacity:0}],{duration:900,delay:i*55,easing:'cubic-bezier(.45,.05,.25,1)',fill:'forwards'}).finished.finally(()=>ghost.remove());});
  setTimeout(()=>{gear.classList.add('tools-arrived');setTimeout(()=>gear.classList.remove('tools-arrived'),1400);},still?0:900+from.length*55-200);
  const note=document.createElement('div');note.className='tools-note';note.setAttribute('role','status');note.textContent=t('Page tools are in Settings now');gear.closest('.sidebar-bottom').append(note);
  setTimeout(()=>note.classList.add('leaving'),still?3200:4200);setTimeout(()=>note.remove(),still?3500:4600);}
 function openMenu(){menu.hidden=false;gear.setAttribute('aria-expanded','true');gear.classList.add('selected');settingsRow.querySelector('span').textContent=t('Settings');menu.querySelector('button:not([disabled])')?.focus({focusVisible:false});}
 function closeMenu(focus=true){if(menu.hidden)return;menu.hidden=true;gear.setAttribute('aria-expanded','false');gear.classList.remove('selected');if(focus)gear.focus({focusVisible:false});}
 // In this mode the Settings button opens the menu instead of Settings; it runs before the button's own handler.
 gear.parentElement.addEventListener('click',e=>{if(!placed||!e.target.closest('#settings'))return;e.stopPropagation();e.preventDefault();menu.hidden?openMenu():closeMenu();},true);
 settingsRow.onclick=()=>{closeMenu(false);openPanel('appearance');};
 // Tools that open something close the menu; bookmark and keep awake stay so you can see them change.
 tools.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!['bookmark-current','protect'].includes(b.id))setTimeout(()=>closeMenu(false),0);});
 document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!e.target.closest('#settings'))closeMenu(false);});
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closeMenu();}});
 window.addEventListener('blur',()=>closeMenu(false));
 // The narrow field shows the site; the full address comes back while you edit it. With Simple addresses (0.35,
 // Settings → Appearance) the field shows only the site's name, above the page too.
 const simple=()=>state?.settings?.simpleAddress!==false;
 function host(url,bare=simple()){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname.replace(/^www\./,'')+(!bare&&u.pathname.length>1?u.pathname:''):url;}catch{return url||'';}}
 const activeURL=()=>state?.tabs.find(t=>t.id===state.activeId)?.url||'';
 function show(){const input=$('address');if(!(placed||simple())||document.activeElement===input)return;input.value=host(activeURL());input.title=activeURL();}
 $('address').addEventListener('focus',()=>{const url=activeURL();if((placed||simple())&&url&&$('address').value===host(url)){$('address').value=url;requestAnimationFrame(()=>$('address').select());}});
 $('address').addEventListener('blur',()=>setTimeout(show,0));
 window.prism.onState(s=>{const want=s.settings.compactMode||s.settings.addressBar==='sidebar'&&!s.settings.sidebarCollapsed;if(want!==placed){if(suggestionsOpen)dismissSuggestions();if(want)toSidebar();else toToolbar();}root.dataset.address=placed?'sidebar':'top';show();ready=true;});
 window.addressInSidebar=()=>placed;
})();
