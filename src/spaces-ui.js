// Spaces (src/spaces.cjs). In the sidebar, the button next to the glass logo shows the current space and opens the
// spaces popover under it (right-click: customize this space). The popover lists the spaces to switch between, with
// New space, and turns into a small editor: name, 40 icons, and a colour (the theme's accent, the theme presets, or
// any custom colour). Changes to an existing space apply as they are made. The current space's colour tints the
// accent and, faintly, the sidebar.
(()=>{
 const tool=new URLSearchParams(location.search).has('tool'),t=key=>window.prismLocale?.t?.(key)||key;
 const MAX=40,PRIVATE={id:'private',name:'Private',icon:'lock',color:'#9275b5'};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
 const glyph=name=>name==='lock'?icon('lock'):spaceIcon(name);
 const dark=()=>document.documentElement.dataset.theme==='dark';
 // '' → the theme's accent; "preset:Name" → that preset's accent for the current mode; "#rrggbb" as chosen.
 function resolve(color){if(!color)return '';const m=/^preset:(.+)$/.exec(color);if(m){const p=prismPresets.find(x=>x.name===m[1]);return p?(dark()?p.dark[6]:p.light[6]):'';}return color;}
 // Icons on a filled chip are white, or near-black on a light colour (dark mode's accents).
 const ink=hex=>{const n=parseInt(String(hex).trim().slice(1),16);if(!/^#[0-9a-f]{6}$/i.test(String(hex).trim()))return '#fff';const [r,g,b]=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b>.3?'#14181e':'#fff';};
 const spacesOf=s=>s?.settings?.spaces||[];
 const current=s=>s.space==='private'?PRIVATE:spacesOf(s).find(x=>x.id===s.space)||spacesOf(s)[0]||PRIVATE;
 // The space's colour for the whole window (and the popover).
 let colorKey='';
 function applyColor(s){const sp=current(s),c=sp.id==='private'?'':resolve(sp.color),key=c+'|'+dark();if(key===colorKey)return;colorKey=key;const root=document.documentElement;
  if(c){root.style.setProperty('--space-accent',c);root.dataset.spaceColor='';}else{root.style.removeProperty('--space-accent');delete root.dataset.spaceColor;}}
 window.prism.onState(applyColor);
 new MutationObserver(()=>{if(state)applyColor(state);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

 if(!tool){
  const picker=$('space-picker'),switcher=document.querySelector('.space-switcher');if(!picker||!switcher)return;
  // The native select stays (hidden) as the ordered list of spaces that swipes and older code read.
  picker.classList.add('space-native');picker.tabIndex=-1;picker.setAttribute('aria-hidden','true');
  const button=el('button','space-button');button.id='space-button';button.type='button';button.setAttribute('aria-haspopup','dialog');
  const chip=el('span','space-chip'),label=el('span','space-name'),chevron=icon('chevron');chevron.classList.add('space-chevron');button.append(chip,label,chevron);
  picker.after(button);
  button.onclick=()=>openPanel('quick-spaces');
  button.oncontextmenu=event=>{event.preventDefault();const r=button.getBoundingClientRect();act('space-customize',{anchor:{x:Math.round(r.right),y:Math.round(r.bottom),left:Math.round(r.left)}});};
  let key='';
  window.prism.onState(s=>{const list=spacesOf(s),sp=current(s),next=JSON.stringify([list,s.space,s.settings.language,dark()]);if(next===key)return;key=next;
   picker.replaceChildren(...[...list,PRIVATE].map(x=>{const o=el('option',null,x.name);o.value=x.id;return o;}));picker.value=s.space;
   chip.replaceChildren(glyph(sp.icon));const c=resolve(sp.color);if(c)chip.style.setProperty('--chip',c);else chip.style.removeProperty('--chip');label.textContent=t(sp.name);button.title=t('Spaces');button.setAttribute('aria-label',t('Spaces')+': '+t(sp.name));});
  return;}

 // The popover (tool window): the spaces to switch between, and an editor for one space.
 const content=$('prefs-content');if(!content)return;
 const pane=el('section');pane.dataset.pane='spaces';pane.hidden=true;content.append(pane);
 const mac=/Mac/.test(navigator.platform),keyLabel=n=>(mac?'⌃':'Ctrl+')+n;
 let view='list',draft=null,nameTimer,colorTimer,pendingColor=false,shownName='',query='',listKey='';
 const tabCount=(s,id)=>s?.spaceTabs?.[id]||0;
 const tabsText=n=>n===0?t('No tabs'):n===1?t('1 tab'):t('{count} tabs').replace('{count}',String(n));
 function heading(text){const h1=document.querySelector('.prefs-heading h1');if(h1)h1.textContent=text;}
 function fit(){requestAnimationFrame(()=>{const head=document.querySelector('.prefs-heading');act('panel-fit',(head?.offsetHeight||40)+pane.scrollHeight+24);});}
 const themeAccent=()=>getComputedStyle(document.documentElement).getPropertyValue('--prism-accent').trim()||'#507fad';
 const colorOf=sp=>(sp.id==='private'?sp.color:resolve(sp.color))||themeAccent();
 function chipFor(sp){const c=el('span','space-chip');c.append(glyph(sp.icon));const color=colorOf(sp);c.style.setProperty('--chip',color);c.style.setProperty('--on-chip',ink(color));return c;}
 async function choose(id){if(id!==state?.space)await act('space',id);act('close-tool');}
 const picks=()=>[...pane.querySelectorAll('.space-pick:not([hidden]),.space-new:not(:disabled)')].filter(b=>!b.closest('[hidden]'));

 // List: the user's spaces in order (drag, or ⌥↑/⌥↓, to reorder), then Private, then New space. The first nine have
 // ⌃1…⌃9 (also 1…9 while this is open). With more than six spaces a search field filters them; Enter opens the first.
 let rows,search,empty,priv,add;
 function renderList(){view='list';draft=null;heading(t('Spaces'));listKey='';pane.style.removeProperty('--chip');pane.style.removeProperty('--on-chip');
  search=el('input','space-search');search.type='search';search.id='space-search';search.placeholder=t('Find a space');search.setAttribute('aria-label',t('Find a space'));search.spellcheck=false;search.value=query;
  const searchBox=el('label','space-search-box');searchBox.append(icon('search'),search);
  search.oninput=()=>{query=search.value;filter();};
  search.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();picks()[0]?.click();}else if(event.key==='Escape'&&search.value){event.preventDefault();event.stopPropagation();search.value=query='';filter();}else if(event.key==='ArrowDown'){event.preventDefault();picks()[0]?.focus();}};
  rows=el('div','space-list');rows.setAttribute('role','list');rows.setAttribute('aria-label',t('Spaces'));
  empty=el('p','space-empty',t('No matching spaces'));empty.hidden=true;
  priv=el('div','space-row space-private');
  add=el('button','space-new');add.type='button';add.append(el('span','space-new-chip'),el('span','space-label',t('New space')));add.firstChild.append(icon('plus'));add.onclick=()=>renderEditor(null);
  const foot=el('div','space-foot');foot.append(add);
  pane.replaceChildren(searchBox,rows,empty,priv,foot);
  updateList(state,true);}
 function rowFor(sp,s,index){const isPrivate=sp.id==='private',current=sp.id===s.space,row=el('div','space-row'+(current?' current':'')+(isPrivate?' space-private':''));row.dataset.id=sp.id;row.setAttribute('role','listitem');
  row.style.setProperty('--row',colorOf(sp));
  const pick=el('button','space-pick');pick.type='button';pick.dataset.id=sp.id;if(current)pick.setAttribute('aria-current','true');
  const text=el('span','space-text');text.append(el('span','space-label',t(sp.name)),el('span','space-meta',tabsText(tabCount(s,sp.id))));
  pick.append(chipFor(sp),text);pick.onclick=()=>choose(sp.id);
  if(current){const check=icon('check');check.classList.add('space-check');pick.append(check);}
  row.append(pick);
  if(!isPrivate){
   const tail=el('span','space-tail');if(index<9){const k=el('kbd','space-key',keyLabel(index+1));k.setAttribute('aria-hidden','true');tail.append(k);pick.setAttribute('aria-keyshortcuts',(mac?'Control+':'Control+')+(index+1));}
   const edit=el('button','space-edit');edit.type='button';edit.title=t('Customize space');edit.setAttribute('aria-label',t('Customize space')+': '+t(sp.name));edit.append(icon('edit'));edit.onclick=()=>renderEditor(sp.id);
   tail.append(edit);row.append(tail);row.addEventListener('pointerdown',event=>{row.draggable=!event.target.closest('.space-edit');});
   row.oncontextmenu=event=>{event.preventDefault();renderEditor(sp.id);};
   pick.onkeydown=event=>{if(event.altKey&&(event.key==='ArrowUp'||event.key==='ArrowDown')){event.preventDefault();event.stopPropagation();move(sp.id,event.key==='ArrowUp'?-1:1);}};
   dragRow(row,sp.id);}
  return row;}
 // Re-rendered from the state (a space added, renamed, reordered, its tabs); focus stays on the same row.
 function updateList(s,force){if(!s||view!=='list'||!rows)return;const list=spacesOf(s),k=JSON.stringify([list,s.space,s.spaceTabs,s.settings.language,dark()]);if(!force&&k===listKey)return;listKey=k;
  const focused=document.activeElement?.closest?.('.space-row')?.dataset.id,focusEdit=document.activeElement?.classList.contains('space-edit');
  rows.replaceChildren(...list.map((sp,i)=>rowFor(sp,s,i)));
  priv.replaceWith(priv=rowFor(PRIVATE,s,-1));
  add.disabled=list.length>=MAX;add.title=list.length>=MAX?t('You can have up to 40 spaces.'):'';
  search.parentElement.hidden=list.length<=6;if(search.parentElement.hidden&&query){query=search.value='';}
  filter(false);
  if(focused){const row=pane.querySelector(`.space-row[data-id="${CSS.escape(focused)}"]`);(focusEdit?row?.querySelector('.space-edit'):row?.querySelector('.space-pick'))?.focus({preventScroll:false});}
  fit();}
 function filter(refit=true){const q=query.trim().toLocaleLowerCase();let shown=0;
  for(const row of [...rows.children,priv]){const name=row.querySelector('.space-label').textContent.toLocaleLowerCase(),match=!q||name.includes(q);row.hidden=!match;if(match)shown++;}
  empty.hidden=shown>0;pane.classList.toggle('filtering',!!q);if(refit)fit();}
 function move(id,step){const list=spacesOf(state),i=list.findIndex(x=>x.id===id),j=i+step;if(i<0||j<0||j>=list.length)return;
  const beforeId=step<0?list[j].id:list[j+1]?.id??null;act('space-move',{id,beforeId});}
 // Drag a row up or down: a line shows where it will land (above or below the row under the pointer).
 let dragging=null;
 function dragRow(row,id){row.draggable=true;
  row.addEventListener('dragstart',event=>{if(query){event.preventDefault();return;}dragging=id;event.dataTransfer.setData('text/prism-space',id);event.dataTransfer.effectAllowed='move';requestAnimationFrame(()=>row.classList.add('dragging'));});
  row.addEventListener('dragend',()=>{dragging=null;row.classList.remove('dragging');clearDrop();});
  row.addEventListener('dragover',event=>{if(!dragging)return;event.preventDefault();event.dataTransfer.dropEffect='move';const r=row.getBoundingClientRect(),after=event.clientY>r.top+r.height/2;
   clearDrop(row);row.classList.toggle('drop-after',after);row.classList.toggle('drop-before',!after);});
  row.addEventListener('drop',event=>{event.preventDefault();const from=dragging,after=row.classList.contains('drop-after');clearDrop();dragging=null;if(!from||from===id)return;
   const list=spacesOf(state).map(x=>x.id);let beforeId=after?list[list.indexOf(id)+1]??null:id;if(beforeId===from)beforeId=list[list.indexOf(from)+1]??null;
   const current=list.indexOf(from),target=beforeId===null?list.length:list.indexOf(beforeId);if(target===current||target===current+1)return;act('space-move',{id:from,beforeId});});}
 function clearDrop(except){for(const r of pane.querySelectorAll('.drop-before,.drop-after'))if(r!==except)r.classList.remove('drop-before','drop-after');}
 pane.addEventListener('keydown',event=>{if(view!=='list'||event.metaKey)return;const typing=event.target.matches('input');
  // 1…9 (or ⌃1…⌃9) open that space.
  if(/^[1-9]$/.test(event.key)&&!event.altKey&&(!typing||event.ctrlKey)){const sp=spacesOf(state)[Number(event.key)-1];if(sp){event.preventDefault();choose(sp.id);}return;}
  if((event.key==='ArrowDown'||event.key==='ArrowUp')&&!event.altKey&&!typing){const list=picks(),i=list.indexOf(document.activeElement);event.preventDefault();
   if(event.key==='ArrowUp'&&i<=0&&!search.parentElement.hidden){search.focus();return;}list[Math.max(0,Math.min(list.length-1,i+(event.key==='ArrowDown'?1:-1)))]?.focus();return;}
  // Typing a letter goes to the search field.
  if(!typing&&!event.ctrlKey&&!event.altKey&&event.key.length===1&&/\S/.test(event.key)&&!search.parentElement.hidden){search.focus();}});

 // Editor: name, one of 40 icons and a colour. An existing space changes as you go; a new one is made by Create.
 function renderEditor(id){const s=state,existing=spacesOf(s).find(x=>x.id===id);if(id&&!existing){renderList();return;}
  view='edit';const used=new Set(spacesOf(s).map(x=>x.icon));
  draft=existing?{...existing}:{id:null,name:'',icon:PrismSpaceIcons.names.find(n=>!used.has(n))||'star',color:''};
  heading(existing?t('Customize space'):t('New space'));
  const save=patch=>{Object.assign(draft,patch);if(draft.id)act('space-update',{id:draft.id,...patch});};
  const back=el('button','space-back');back.type='button';back.append(icon('back'),el('span',null,t('Spaces')));back.onclick=()=>leave();
  const name=el('input','space-name-input');name.id='space-name';name.maxLength=32;name.spellcheck=false;name.value=shownName=existing?t(existing.name):'';name.placeholder=existing?t('Space name'):nextName(spacesOf(s));name.setAttribute('aria-label',t('Space name'));name.setAttribute('translate','no');
  const preview=el('span','space-preview');
  const hero=el('div','space-hero');hero.append(preview,name);
  // The field shows the name as displayed (Personal and Work are translated); it is saved only once it is edited.
  function flushName(){clearTimeout(nameTimer);const v=name.value.trim();if(draft?.id&&v&&v!==shownName){shownName=v;save({name:v});}}
  name.oninput=()=>{clearTimeout(nameTimer);if(draft.id)nameTimer=setTimeout(flushName,400);};
  name.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();done();}};
  // Icons: 40 in an 8 × 5 grid; arrow keys move between them, Home and End go to the first and last.
  const icons=el('div','space-icons');icons.setAttribute('role','radiogroup');icons.setAttribute('aria-label',t('Icon'));
  const label=n=>n[0].toUpperCase()+n.slice(1);
  const iconButtons=PrismSpaceIcons.names.map(n=>{const b=el('button','space-icon');b.type='button';b.dataset.icon=n;b.setAttribute('role','radio');b.setAttribute('aria-label',label(n));b.title=label(n);b.append(spaceIcon(n));
   b.onclick=()=>{save({icon:n});markIcon();refreshPreview();};
   b.onkeydown=event=>{const i=iconButtons.indexOf(b),L=iconButtons.length,target={ArrowRight:i+1,ArrowLeft:i-1,ArrowDown:i+8,ArrowUp:i-8,Home:0,End:L-1}[event.key];if(target===undefined)return;event.preventDefault();const next=iconButtons[(target+L)%L];next.focus();next.click();};
   return b;});
  function markIcon(){for(const b of iconButtons){const on=b.dataset.icon===draft.icon;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;}}
  icons.append(...iconButtons);
  // Colours: the theme's accent, the six theme presets, then any colour (the same picker as Design studio) or a hex code.
  const swatches=el('div','space-colors');swatches.setAttribute('role','radiogroup');swatches.setAttribute('aria-label',t('Color'));
  const options=[{value:'',label:t('Theme')},...prismPresets.map(p=>({value:'preset:'+p.name,label:p.name}))];
  const swatchButtons=options.map(o=>{const b=el('button','space-swatch'+(o.value?'':' theme'));b.type='button';b.setAttribute('role','radio');b.title=o.label;b.setAttribute('aria-label',o.label);b.dataset.value=o.value;
   b.style.setProperty('--swatch',o.value?resolve(o.value):themeAccent());b.onclick=()=>{clearTimeout(colorTimer);pendingColor=false;save({color:o.value});markColor();};return b;});
  const custom=el('label','space-swatch custom');custom.title=t('Custom color');const picker=el('input');picker.type='color';picker.id='space-custom-color';picker.setAttribute('aria-label',t('Custom color'));custom.append(picker);
  swatches.append(...swatchButtons,custom);
  const hex=el('input','space-hex');hex.id='space-hex';hex.maxLength=7;hex.spellcheck=false;hex.setAttribute('aria-label',t('Hex color'));hex.placeholder='#RRGGBB';hex.setAttribute('translate','no');
  const hexDot=el('span','space-hex-dot'),hexBox=el('label','space-hex-box');hexBox.append(hexDot,hex);
  // Dragging in the colour picker previews at once and saves once it settles.
  const setCustom=(value,later)=>{if(!/^#[0-9a-f]{6}$/i.test(value))return;value=value.toLowerCase();draft.color=value;markColor();clearTimeout(colorTimer);
   if(later){pendingColor=true;colorTimer=setTimeout(flushColor,150);}else{pendingColor=false;save({color:value});}};
  function flushColor(){clearTimeout(colorTimer);if(pendingColor){pendingColor=false;save({color:draft.color});}}
  picker.oninput=()=>setCustom(picker.value,true);picker.onchange=()=>setCustom(picker.value,false);
  const readHex=()=>{let v=hex.value.trim();if(v&&!v.startsWith('#'))v='#'+v;if(/^#[0-9a-f]{3}$/i.test(v))v='#'+[...v.slice(1)].map(c=>c+c).join('');return /^#[0-9a-f]{6}$/i.test(v)?v:null;};
  hex.oninput=()=>{const v=readHex();hexBox.classList.toggle('invalid',!!hex.value.trim()&&!v&&hex.value.trim().replace('#','').length>=6);if(v)setCustom(v,true);};
  hex.onchange=()=>{const v=readHex();if(v)setCustom(v,false);else markColor();};
  hex.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();hex.onchange();}};
  function markColor(){const c=draft.color||'',isCustom=/^#/.test(c),shown=isCustom?c:resolve(c)||themeAccent();
   for(const b of swatchButtons)b.setAttribute('aria-checked',String(b.dataset.value===c));
   custom.setAttribute('aria-checked',String(isCustom));custom.classList.toggle('checked',isCustom);if(isCustom){picker.value=c;custom.style.setProperty('--swatch',c);}else custom.style.removeProperty('--swatch');
   if(document.activeElement!==hex){hex.value=shown.toUpperCase();hexBox.classList.remove('invalid');}hexDot.style.setProperty('--swatch',shown);
   refreshPreview();}
  function refreshPreview(){preview.replaceChildren(glyph(draft.icon));const c=colorOf(draft);pane.style.setProperty('--chip',c);pane.style.setProperty('--on-chip',ink(c));}
  // Footer: Delete (asks right here first; never the last space), and Done or Create space.
  const foot=el('div','space-editor-foot');
  function footer(){foot.classList.remove('confirm');const parts=[];
   if(existing&&spacesOf(state).length>1){const remove=el('button','space-delete');remove.type='button';remove.append(icon('trash'),el('span',null,t('Delete space')));remove.onclick=confirmDelete;parts.push(remove);}
   const primary=el('button','space-done primary',existing?t('Done'):t('Create space'));primary.type='button';primary.onclick=()=>done();parts.push(primary);foot.replaceChildren(...parts);}
  function confirmDelete(){const n=tabCount(state,draft.id);foot.classList.add('confirm');
   const text=el('div','space-confirm-text');text.append(el('strong',null,t('Delete this space?')),el('span',null,n?t('Its open tabs will close.')+' ('+tabsText(n)+')':t('It has no open tabs.')));
   const cancel=el('button','space-cancel',t('Cancel'));cancel.type='button';cancel.onclick=()=>{footer();foot.querySelector('.space-delete')?.focus();fit();};
   const yes=el('button','space-confirm-delete',t('Delete'));yes.type='button';yes.onclick=async()=>{clearTimeout(nameTimer);clearTimeout(colorTimer);pendingColor=false;yes.disabled=true;const r=await act('space-remove',{id:draft.id,confirmed:true});if(r?.error){footer();return;}renderList();};
   const buttons=el('div','space-confirm-buttons');buttons.append(cancel,yes);foot.replaceChildren(text,buttons);yes.focus();fit();}
  let busy=false;
  async function done(){if(draft.id){flushName();flushColor();act('close-tool');return;}
   if(busy)return;busy=true;try{const r=await act('space-add',{name:name.value,icon:draft.icon,color:draft.color});if(r&&!r.error){view='list';act('close-tool');}}finally{busy=false;}}
  // Back (or Esc) returns to the list, keeping what was changed; a new space is only made by Create space.
  function leave(){flushName();flushColor();renderList();}
  pane.onkeydown=event=>{if(view!=='edit'||event.key!=='Escape')return;event.preventDefault();event.stopPropagation();if(foot.classList.contains('confirm'))foot.querySelector('.space-cancel').click();else leave();};
  const section=(title,...children)=>{const s=el('div','space-section');s.append(el('h3',null,title),...children);return s;};
  pane.replaceChildren(back,hero,section(t('Icon'),icons),section(t('Color'),swatches,hexBox),foot);
  pane.style.setProperty('--on-accent',ink(getComputedStyle(document.documentElement).getPropertyValue('--accent')));
  footer();markIcon();markColor();fit();requestAnimationFrame(()=>{name.focus();if(existing)name.select();});
  editorFlush=()=>{flushName();flushColor();};}
 let editorFlush=null;
 // The name a new space gets when the field is left empty (spaces.cjs nextName).
 function nextName(list){for(let n=list.length+1;;n++)if(!list.some(x=>x.name==='Space '+n))return 'Space '+n;}

 window.refreshSpaces=async()=>{query='';const intent=await act('space-intent');if(intent?.edit)renderEditor(intent.edit);else renderList();};
 window.prism.onState(s=>updateList(s));
 window.prism.onPanelHidden?.(()=>{if(view==='edit')editorFlush?.();editorFlush=null;view='list';query='';});
})();
