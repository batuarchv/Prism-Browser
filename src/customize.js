// Editable design tokens are data only; no imported HTML, CSS or JavaScript is executed.
const prismAsset=name=>`../assets/${name}`;
const footer=document.querySelector('.prefs-footer');if(footer)footer.firstChild.textContent='Prism 0.15.3 ';
const prismMark=document.createElement('img');prismMark.className='space-logo';prismMark.dataset.glassLogo='';prismMark.src=window.prismGlassLogo.src();prismMark.alt='Prism';document.querySelector('.space-switcher').prepend(prismMark);
// The sidebar logo is the live glass too, so it can turn when the space changes (sidebar-ui.js); it is not draggable.
if(!new URLSearchParams(location.search).has('tool'))requestAnimationFrame(()=>{window.prismSpaceLogo=window.PrismGlass?.upgrade(prismMark,{beam:false,place:'sidebar',interactive:false})||null;});
// New tab: the glass logo, the wordmark under it, then the bar.
const welcomeWordmark=document.createElement('img');welcomeWordmark.className='welcome-wordmark';welcomeWordmark.src=prismAsset('prism-wordmark.svg');welcomeWordmark.alt='Prism';document.querySelector('.welcome-content').prepend(welcomeWordmark);
const welcomeLogo=document.createElement('img');welcomeLogo.className='welcome-logo';welcomeLogo.dataset.glassLogo='';welcomeLogo.src=window.prismGlassLogo.src();welcomeLogo.alt='Prism';document.querySelector('.welcome-content').prepend(welcomeLogo);
if(!new URLSearchParams(location.search).has('tool'))requestAnimationFrame(()=>window.PrismGlass?.upgrade(welcomeLogo,{spin:.3,beam:false,place:'new-tab'}));
// 0.39: nothing else on the new tab, no favorites or recently closed tabs.
const settingsHeading=document.querySelector('.prefs-heading h1');const settingsLogo=document.createElement('img');settingsLogo.className='settings-logo';settingsLogo.dataset.glassLogo='';settingsLogo.src=window.prismGlassLogo.src();settingsLogo.alt='';settingsHeading.prepend(settingsLogo);
const themeEditor=document.createElement('section');themeEditor.dataset.pane='design';themeEditor.hidden=true;
themeEditor.innerHTML='<h2>Design studio</h2><p class="section-description">Find your atmosphere. Make it yours.</p><div id="theme-presets" class="theme-presets"></div><div class="manager-actions"><button id="restore-custom">My custom colors</button></div><h3>Fine-tune your palette</h3><label>Color mode <select id="design-mode"><option>light</option><option>dark</option></select></label><div id="design-colors" class="settings-group"></div><div class="manager-actions"><button id="theme-import">Import theme…</button><button id="theme-export">Export theme…</button><button id="theme-reset">Reset theme</button></div><p>Use Appearance for glass, spacing and sidebar width. Accessibility overrides take priority.</p>';
$('prefs-content').append(themeEditor);
for(const preset of prismPresets){const button=document.createElement('button');button.className='theme-preset';button.type='button';const preview=document.createElement('span');preview.className='theme-swatch';preview.style.background=preset.light[0];const side=document.createElement('span');side.style.background=preset.light[1];const chip=document.createElement('span');chip.style.background=preset.light[6];preview.append(side,chip);const name=document.createElement('strong');name.textContent=preset.name;const note=document.createElement('small');note.textContent=preset.note;button.append(preview,name,note);button.onclick=()=>act('apply-design-preset',{...presetTheme(preset),radius:editingTheme.radius,rowHeight:editingTheme.rowHeight});$('theme-presets').append(button);}
$('restore-custom').onclick=()=>act('restore-custom-theme');

const designNav=document.createElement('button');designNav.dataset.section='design';designNav.append(icon('brush'),document.createTextNode('Design studio'));designNav.onclick=()=>openPanel('design');$('prefs-nav').append(designNav);
$('appearance-design-link').onclick=event=>{event.preventDefault();openPanel('design');};
let editingTheme,designEditorKey='';
function renderDesign(next){
 editingTheme=structuredClone(next.designTheme);document.querySelectorAll('.theme-preset:not(#onboarding .theme-preset)').forEach((button,index)=>prismPresets[index]&&button.setAttribute('aria-pressed',String(JSON.stringify(editingTheme.light)===JSON.stringify(presetTheme(prismPresets[index]).light)&&JSON.stringify(editingTheme.dark)===JSON.stringify(presetTheme(prismPresets[index]).dark))));const mode=$('design-mode').value;
 const editorKey=JSON.stringify([mode,editingTheme]);if(editorKey!==designEditorKey){designEditorKey=editorKey;$('design-colors').replaceChildren(...Object.entries(editingTheme[mode]).map(([key,value])=>{const row=document.createElement('label');row.className='setting-row';const label=document.createElement('span');label.textContent=key;const input=document.createElement('input');input.type='color';input.value=value;input.setAttribute('aria-label',mode+' '+key);input.onchange=()=>{editingTheme[mode][key]=input.value;act('set-design-theme',editingTheme);};row.append(label,input);return row;}));}
 const root=document.documentElement,colors=editingTheme[next.system.dark?'dark':'light'];
 for(const [key,value]of Object.entries(colors))root.style.setProperty('--prism-'+key,value);
 root.style.setProperty('--prism-radius',editingTheme.radius+'px');root.style.setProperty('--prism-row-height',editingTheme.rowHeight+'px');
 root.dataset.space=next.space;root.dataset.collapsed=String(!!next.settings.sidebarCollapsed);if(next.settings.sidebarCollapsed)root.style.setProperty('--sidebar-width','0px');$('space-picker').value=next.space;$('sidebar-toggle')?.setAttribute('aria-expanded',String(!next.settings.sidebarCollapsed));
 const network=next.privateNetwork;$('private-status').textContent=network?.message||'';$('private-profile').value=network?.profile||'standard';
 for(const id of ['network-direct','network-start','network-stop'])$(id).disabled=next.space!=='private'||network?.busy;
 $('network-start').disabled ||= !network?.available;
 $('end-private').hidden=next.space!=='private';$('browser-actions').hidden=next.space==='private';
 for(const id of ['fill-password','bookmark-current','add-bookmark','add-folder','extensions'])$(id).disabled=next.space==='private';
 $('fill-password').disabled=next.space==='private'&&!next.settings.privatePasswords;
}
$('design-mode').onchange=()=>{if(state)renderDesign(state);};
$('theme-import').onclick=()=>act('import-design-theme');$('theme-export').onclick=()=>act('export-design-theme');$('theme-reset').onclick=()=>act('reset-design-theme');
window.prism.onState(renderDesign);
$('space-picker').onchange=e=>{if(panel)closePanel();act('space',e.target.value);};
// 0.32.1: End Private is a small icon (its name stays as the tooltip and for VoiceOver).
{const end=$('end-private');end.classList.add('end-private-icon');end.textContent='';end.append(icon('power'));end.title='End Private';end.setAttribute('aria-label','End Private');}
$('end-private').onclick=()=>act('end-private');
$('network-direct').onclick=()=>act('private-network',{mode:'direct'});
$('network-start').onclick=()=>act('private-network',{mode:'zapret',profile:$('private-profile').value});
$('network-stop').onclick=()=>act('private-network',{mode:'stopped'});
// Bypass in Personal and Work (0.39): the chosen sites as removable chips, plus the live status.
{const sites=()=>state?.settings.bypassSites||[],save=list=>act('set-setting',{key:'bypassSites',value:list});
 const add=value=>{const host=String(value||'').trim();if(host)save([...sites(),host]);};
 $('bypass-add').onsubmit=e=>{e.preventDefault();add($('bypass-site-input').value);$('bypass-site-input').value='';};
 $('bypass-add-current').onclick=()=>{const t=state?.tabs.find(x=>x.id===state.activeId);if(t?.url&&/^https?:/.test(t.url))add(new URL(t.url).hostname);};
 let key='';window.prism.onState(s=>{const mode=s.settings.bypassNormal,n=s.normalNetwork,next=JSON.stringify([mode,s.settings.bypassSites,n?.status,n?.message,n?.hosts]);if(next===key)return;key=next;
  const narrow=mode==='sites';$('bypass-profile-row').hidden=mode==='off';for(const id of ['bypass-sites-row','bypass-sites','bypass-add'])$(id).hidden=!narrow;
  $('bypass-sites').replaceChildren(...(s.settings.bypassSites||[]).map(site=>{const li=document.createElement('li');const name=document.createElement('span');name.textContent=site;const x=document.createElement('button');x.type='button';x.title='Remove '+site;x.setAttribute('aria-label','Remove '+site);x.append(icon('close'));x.onclick=()=>save(sites().filter(v=>v!==site));li.append(symbol('https://'+site,site),name,x);return li;}));
  $('bypass-status').textContent=mode==='off'?'Personal and Work use your normal connection.':!n?.available?'The bypass helper is missing from this copy of Prism.':n.status==='active'?(narrow?`On for ${s.settings.bypassSites.length===1?s.settings.bypassSites[0]:s.settings.bypassSites.length+' sites'} (${n.hosts} domains with companions).`:'On for every site in Personal and Work.'):n.status==='starting'?'Starting the bypass…':n.status==='error'?n.message+' Sites use your normal connection.':'Starting the bypass…';});}
act('state');
const collapseButton=document.createElement('button');collapseButton.id='sidebar-toggle';collapseButton.className='protect';collapseButton.title='Toggle sidebar';collapseButton.setAttribute('aria-label','Toggle sidebar');collapseButton.append(icon('sidebar'));collapseButton.onclick=()=>act('set-setting',{key:'sidebarCollapsed',value:!state.settings.sidebarCollapsed});document.querySelector('header').prepend(collapseButton);
