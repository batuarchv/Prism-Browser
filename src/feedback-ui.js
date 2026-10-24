// Short, quiet confirmations for quick actions: a chip by the address bar plus a small cue on the related control.
// Reduce Motion (macOS or Prism) keeps the chip but drops the sweep, spin and pop.
(() => {
 if(typeof toolMode!=='undefined'&&toolMode)return;
 const form=document.getElementById('address-form');if(!form||!window.prism?.onFeedback)return;
 const chip=document.createElement('span');chip.className='feedback-chip';chip.setAttribute('role','status');chip.setAttribute('aria-live','polite');chip.hidden=true;form.append(chip);
 const t=key=>window.prismLocale?.t?.(key)||key;
 const messages={'link-copied':['Link copied','check'],bookmarked:['Bookmarked','star'],'bookmark-removed':['Bookmark removed','star'],reload:['Reloaded','reload'],'hard-reload':['Reloaded without cache','reload'],pinned:['Pinned','check'],unpinned:['Unpinned','check'],reopened:['Tab reopened','history'],'pinned-closed':['Closed · still pinned','check'],'pinned-removed':['Removed · ⌘Z brings it back','minus'],'nothing-to-restore':['Nothing to bring back','history'],duplicated:['Tab duplicated','plus'],'password-copied':['Password copied','key'],'username-copied':['Username copied','copy'],'added-to-folder':['Added to {folder}','folder'],zoom:['Zoom {n}%','search']};
 let timer;
 // Restarting a CSS animation needs the class removed and a reflow before it is added again.
 // Animation events bubble, so only the element's own animation (or its ::after) may end the cue.
 function replay(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);const done=event=>{if(event.target!==el)return;el.removeEventListener('animationend',done);el.classList.remove(cls);};el.addEventListener('animationend',done);}
 function show({kind,detail}){if(kind==='undo')return offerUndo(detail);const entry=messages[kind];if(!entry)return;
  chip.replaceChildren(icon(entry[1]),Object.assign(document.createElement('span'),{textContent:t(entry[0]).replace('{n}',String(Number(detail)||100)).replace('{folder}',detail?String(detail):t('Pinned'))}));
  chip.hidden=false;replay(chip,'show');clearTimeout(timer);timer=setTimeout(()=>{chip.hidden=true;},1600);
  if(kind==='link-copied')replay(form,'feedback-sweep');
  if(kind==='bookmarked'||kind==='bookmark-removed')replay(document.getElementById('bookmark-current'),'feedback-pop');
  if(kind==='reload'||kind==='hard-reload')replay(document.getElementById('reload'),'feedback-spin');}
 // Undo toast for sidebar edits; the browser keeps only the latest undoable change.
 const undo=document.createElement('div');undo.className='undo-toast';undo.setAttribute('role','status');undo.hidden=true;
 const undoText=document.createElement('span'),undoButton=document.createElement('button');undoButton.type='button';undoButton.className='undo-button';
 undoButton.onclick=()=>{undo.hidden=true;clearTimeout(undoTimer);act('undo');};undo.append(undoText,undoButton);document.body.append(undo);let undoTimer;
 function offerUndo(detail){undoText.textContent=t(String(detail?.message||'')).replace('{n}',String(Number(detail?.count)||''));undoButton.textContent=t('Undo');undo.hidden=false;replay(undo,'show');clearTimeout(undoTimer);undoTimer=setTimeout(()=>{undo.hidden=true;},7000);}
 window.prism.onFeedback(show);
 // The toolbar reload button reloads in the renderer, so it gets the same cue directly.
 document.getElementById('reload')?.addEventListener('click',()=>replay(document.getElementById('reload'),'feedback-spin'));
})();
