// Editable design tokens are data only; no imported HTML, CSS or JavaScript is executed.
const prismAsset=name=>`../assets/${name}`;
const footer=document.querySelector('.prefs-footer');if(footer)footer.firstChild.textContent='Prism 0.15.3 ';
const prismMark=document.createElement('img');prismMark.className='space-logo';prismMark.src=prismAsset('prism-mark.svg');prismMark.alt='Prism';document.querySelector('.space-switcher').prepend(prismMark);
const welcomeLogo=document.createElement('img');welcomeLogo.className='welcome-logo';welcomeLogo.src=prismAsset('prism-mark.svg');welcomeLogo.alt='Prism';document.querySelector('.welcome-content').prepend(welcomeLogo);
const welcomeWordmark=document.createElement('img');welcomeWordmark.className='welcome-wordmark';welcomeWordmark.src=prismAsset('prism-wordmark.svg');welcomeWordmark.alt='Prism';document.querySelector('.welcome-content').prepend(welcomeWordmark);
const settingsHeading=document.querySelector('.prefs-heading h1');const settingsLogo=document.createElement('img');settingsLogo.className='settings-logo';settingsLogo.src=prismAsset('prism-mark.svg');settingsLogo.alt='';settingsHeading.prepend(settingsLogo);
const themeEditor=document.createElement('section');themeEditor.dataset.pane='design';themeEditor.hidden=true;
themeEditor.innerHTML='<h2>Design studio</h2><p class="section-description">Find your atmosphere. Make it yours.</p><div id="theme-presets" class="theme-presets"></div><div class="manager-actions"><button id="restore-custom">My custom colors</button></div><h3>Fine-tune your palette</h3><label>Color mode <select id="design-mode"><option>light</option><option>dark</option></select></label><div id="design-colors" class="settings-group"></div><div class="manager-actions"><button id="theme-import">Import theme…</button><button id="theme-export">Export theme…</button><button id="theme-reset">Reset theme</button></div><p>Use Appearance for glass, spacing and sidebar width. Accessibility overrides take priority.</p>';
$('prefs-content').append(themeEditor);
for(const preset of prismPresets){const button=document.createElement('button');button.className='theme-preset';button.type='button';const preview=document.createElement('span');preview.className='theme-swatch';preview.style.background=preset.light[0];const side=document.createElement('span');side.style.background=preset.light[1];const chip=document.createElement('span');chip.style.background=preset.light[6];preview.append(side,chip);const name=document.createElement('strong');name.textContent=preset.name;const note=document.createElement('small');note.textContent=preset.note;button.append(preview,name,note);button.onclick=()=>act('apply-design-preset',{...presetTheme(preset),radius:editingTheme.radius,rowHeight:editingTheme.rowHeight});$('theme-presets').append(button);}
$('restore-custom').onclick=()=>act('restore-custom-theme');

const designNav=document.createElement('button');designNav.dataset.section='design';designNav.append(icon('brush'),document.createTextNode('Design studio'));designNav.onclick=()=>openPanel('design');$('prefs-nav').append(designNav);
$('appearance-design-link').onclick=event=>{event.preventDefault();openPanel('design');};
let editingTheme,designEditorKey='';
function renderDesign(next){
 editingTheme=structuredClone(next.designTheme);document.querySelectorAll('.theme-preset').forEach((button,index)=>button.setAttribute('aria-pressed',String(JSON.stringify(editingTheme.light)===JSON.stringify(presetTheme(prismPresets[index]).light)&&JSON.stringify(editingTheme.dark)===JSON.stringify(presetTheme(prismPresets[index]).dark))));const mode=$('design-mode').value;
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
}
$('design-mode').onchange=()=>{if(state)renderDesign(state);};
$('theme-import').onclick=()=>act('import-design-theme');$('theme-export').onclick=()=>act('export-design-theme');$('theme-reset').onclick=()=>act('reset-design-theme');
window.prism.onState(renderDesign);
$('space-picker').onchange=e=>{if(panel)closePanel();act('space',e.target.value);};
$('end-private').onclick=()=>act('end-private');
$('network-direct').onclick=()=>act('private-network',{mode:'direct'});
$('network-start').onclick=()=>act('private-network',{mode:'zapret',profile:$('private-profile').value});
$('network-stop').onclick=()=>act('private-network',{mode:'stopped'});
act('state');
const collapseButton=document.createElement('button');collapseButton.id='sidebar-toggle';collapseButton.className='protect';collapseButton.title='Toggle sidebar';collapseButton.setAttribute('aria-label','Toggle sidebar');collapseButton.append(icon('sidebar'));collapseButton.onclick=()=>act('set-setting',{key:'sidebarCollapsed',value:!state.settings.sidebarCollapsed});document.querySelector('header').prepend(collapseButton);
