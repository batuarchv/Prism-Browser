(() => {
 const nav=document.querySelector('#prefs-nav'),content=document.querySelector('#prefs-content'),search=document.querySelector('#prefs-search'),results=document.querySelector('#prefs-search-results');
 if(!nav||!content||!search||!results)return;
 const groups=[
  {name:'Personal',sections:['profile','appearance','design','workspace']},
  {name:'Browsing',sections:['downloads','extensions','history']},
  {name:'Privacy & security',sections:['passwords','permissions','blocking','private','imports']},
  {name:'Intelligence',sections:['ai','page-assistant']},
  {name:'System',sections:['performance','updates']}
 ];
 const buttons=[...nav.querySelectorAll(':scope > button[data-section]')],groupFor=new Map();
 for(const group of groups){const wrapper=document.createElement('div');wrapper.className='prefs-nav-group';wrapper.dataset.group=group.name.toLowerCase().replace(/[^a-z]+/g,'-');const heading=document.createElement('div');heading.className='prefs-nav-heading';heading.textContent=group.name;wrapper.append(heading);group.wrapper=wrapper;group.sections.forEach(section=>groupFor.set(section,group));}
 for(const button of buttons){const group=groupFor.get(button.dataset.section)||groups.at(-1);group.wrapper.append(button);}
 for(const group of groups)if(group.wrapper.querySelector('button'))nav.append(group.wrapper);
 const searchIcon=document.createElement('span');searchIcon.setAttribute('aria-hidden','true');searchIcon.append(icon('search'));nav.querySelector('.prefs-search').replaceChildren(searchIcon,search);

 // Hidden panes have no layout, so innerText collapses labels and option lists together; read text nodes individually instead.
 function textParts(root){const parts=[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);for(let node;(node=walker.nextNode());){const text=node.nodeValue.replace(/\s+/g,' ').trim(),parent=node.parentElement;if(!text||parent.closest('script,style,textarea'))continue;parts.push({text,option:!!parent.closest('select,option')});}return parts;}
 function settingTargets(){return [...content.querySelectorAll('[data-pane]')].flatMap(pane=>{
  const paneName=nav.querySelector(`button[data-section="${pane.dataset.pane}"]`)?.textContent.trim()||pane.querySelector('h2')?.textContent.trim()||pane.dataset.pane;
  return [...pane.querySelectorAll('.setting-row,.info-card,.manager-card,h2,[data-settings-search]')].map(target=>{const words=textParts(target);return {pane:pane.dataset.pane,target,paneName,title:words.find(w=>!w.option)?.text||'',text:words.map(w=>w.text).join(' ')};}).filter(x=>x.text.length>1);
 });}
 function updateSearch(){
  const query=search.value.trim().toLocaleLowerCase();
  for(const el of [nav,content]){if(query)el.dataset.searching='true';else delete el.dataset.searching;}
  results.replaceChildren();results.hidden=!query;
  if(!query)return;content.scrollTop=0;
  const rank=item=>item.title.length<=60&&item.title.toLocaleLowerCase().includes(query)?0:item.paneName.toLocaleLowerCase().includes(query)?1:2;
  const matches=settingTargets().filter(item=>`${item.paneName} ${item.text}`.toLocaleLowerCase().includes(query)).map((item,index)=>({...item,index,rank:rank(item)})).sort((a,b)=>a.rank-b.rank||a.index-b.index).slice(0,40),t=window.prismLocale?.t||((key)=>key);
  if(!matches.length){const empty=document.createElement('p');empty.className='settings-search-empty';empty.textContent=`${t('No matching settings')} · “${search.value.trim()}”`;results.append(empty);return;}
  const caption=document.createElement('p');caption.className='settings-search-caption';caption.textContent=`${matches.length}${matches.length===40?'+':''} ${t(matches.length===1?'Match':'Matches')}`;results.append(caption);
  for(const match of matches){const button=document.createElement('button');button.type='button';button.className='settings-search-result';const title=document.createElement('strong');const words=(match.title||match.text).split(' ');title.textContent=words.length>12?words.slice(0,12).join(' ')+'…':words.join(' ');const location=document.createElement('small');location.textContent=match.paneName;button.append(title,location);button.onclick=()=>{const target=match.target;search.value='';updateSearch();openPanel(match.pane);requestAnimationFrame(()=>requestAnimationFrame(()=>{if(target.isConnected)target.scrollIntoView({block:'center',behavior:state?.settings?.reduceMotion?'auto':'smooth'});}));};results.append(button);}
 }
 search.addEventListener('input',updateSearch);
 search.addEventListener('keydown',event=>{if(event.key==='Escape'){search.value='';updateSearch();search.blur();}else if(event.key==='Enter'){results.querySelector('button')?.click();}});
 document.querySelector('#appearance-design-link')?.addEventListener('click',event=>{event.preventDefault();openPanel('design');});
})();
