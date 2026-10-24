// Address bar in the sidebar (0.32, Settings → Appearance → Address bar). The toolbar's own buttons move into the
// sidebar, so their handlers and state stay as they are: back, forward and reload beside the window buttons, the address
// field where New tab was (with a small New tab button), and the page tools in a quiet row under it. The page then
// reaches the top of the window (main.cjs toolbarTop()). A collapsed sidebar puts everything back in the toolbar.
(()=>{if(toolMode)return;
 const header=document.querySelector('main>header'),root=document.documentElement;
 const dock=cls=>{const el=document.createElement('div');el.className='toolbar-dock '+cls;return el;};
 const nav=dock('dock-nav'),field=dock('dock-address'),tools=dock('dock-tools');tools.setAttribute('role','toolbar');tools.setAttribute('aria-label','Page tools');
 const plus=document.createElement('button');plus.id='dock-new';plus.type='button';plus.className='protect';plus.title='New tab (⌘T)';plus.setAttribute('aria-label','New tab');plus.append(icon('plus'));plus.onclick=()=>$('new').click();
 let order=[],placed=false;
 function toSidebar(){order=[...header.children];nav.append($('sidebar-toggle'),header.querySelector('.nav'));field.append($('address-form'),plus);tools.append(...header.children);
  document.querySelector('#sidebar .window-drag').append(nav);$('new').after(field,tools);placed=true;}
 function toToolbar(){header.append(...order);for(const el of [...tools.children])header.append(el);nav.remove();field.remove();tools.remove();placed=false;}
 // The narrow field shows the site; the full address comes back while you edit it.
 function host(url){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname.replace(/^www\./,'')+(u.pathname.length>1?u.pathname:''):url;}catch{return url||'';}}
 const activeURL=()=>state?.tabs.find(t=>t.id===state.activeId)?.url||'';
 function show(){const input=$('address');if(!placed||document.activeElement===input)return;input.value=host(activeURL());input.title=activeURL();}
 $('address').addEventListener('focus',()=>{const url=activeURL();if(placed&&url&&$('address').value===host(url)){$('address').value=url;requestAnimationFrame(()=>$('address').select());}});
 $('address').addEventListener('blur',()=>setTimeout(show,0));
 window.prism.onState(s=>{const want=s.settings.addressBar==='sidebar'&&!s.settings.sidebarCollapsed;if(want!==placed){if(suggestionsOpen)dismissSuggestions();if(want)toSidebar();else toToolbar();}root.dataset.address=placed?'sidebar':'top';show();});
 window.addressInSidebar=()=>placed;
})();
