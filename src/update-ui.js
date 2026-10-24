// Update states in the sidebar footer: a quiet ring while an update downloads, then a compact "Restart" control
// (full "Restart to Update" in its tooltip) between Settings and Downloads.
// Settings → Updates gains a "What’s New" button for the current version.
(()=>{if(new URLSearchParams(location.search).has('tool')){
  const actions=document.querySelector('[data-pane=updates] .manager-actions');if(actions&&!$('whats-new')){const b=document.createElement('button');b.id='whats-new';b.textContent='What’s New';b.onclick=()=>act('whats-new');actions.append(b);}
  return;}
 const holder=document.querySelector('.sidebar-bottom .utilities');if(!holder)return;
 const button=document.createElement('button');button.id='update-indicator';button.hidden=true;button.type='button';
 const ring=document.createElement('span');ring.className='update-ring';ring.setAttribute('aria-hidden','true');const glyph=icon('reload');glyph.classList.add('update-glyph');const label=document.createElement('span');label.className='update-label';
 button.append(ring,glyph,label);holder.insertBefore(button,$('downloads'));
 button.onclick=()=>{if(button.dataset.kind==='ready')act('update-install');else openPanel('updates');};
 let last='';
 window.prism.onState(s=>{const t=window.prismLocale?.t||(k=>k),state=PrismUpdateFlow.indicator(s.updates),key=state.kind+(state.version||'')+s.settings.language;if(key===last)return;last=key;
  button.dataset.kind=state.kind;button.hidden=state.kind==='none';
  if(state.kind==='downloading'){label.textContent='';button.title=t('Downloading update');button.setAttribute('aria-label',button.title);}
  if(state.kind==='ready'){label.textContent=t('Restart');button.title=t('Restart to Update')+' · Prism '+state.version;button.setAttribute('aria-label',button.title);}
 });
})();
