// Compact mode (0.32, ⌥⌘S or the command bar): the page fills the window. Moving the pointer to the window's left edge
// brings the sidebar (and the address bar in it) back; it leaves again shortly after the pointer does, unless you are
// typing in it or a menu or popover is open. ⌘L also brings it back, to the address field.
(()=>{if(toolMode)return;
 const root=document.documentElement,edge=document.createElement('div');edge.id='compact-edge';edge.setAttribute('aria-hidden','true');document.body.append(edge);
 let on=false,revealed=false,leaveTimer=null;
 const reveal=value=>{clearTimeout(leaveTimer);if(value!==revealed)act('compact-reveal',value);};
 const busy=()=>$('sidebar').contains(document.activeElement)&&document.activeElement.matches('input,textarea,[contenteditable=true]')||!!state?.popover?.open||suggestionsOpen||!!document.querySelector('#spectrum.open,.tab.renaming,dialog[open]');
 function leaveSoon(){clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{if(!on||!revealed)return;if(busy()||$('sidebar').matches(':hover')){leaveSoon();return;}reveal(false);},450);}
 edge.addEventListener('pointerenter',()=>{if(on)reveal(true);});
 $('sidebar').addEventListener('pointerenter',()=>clearTimeout(leaveTimer));$('sidebar').addEventListener('pointerleave',()=>{if(on&&revealed)leaveSoon();});
 $('address').addEventListener('blur',()=>{if(on&&revealed&&!$('sidebar').matches(':hover'))leaveSoon();});
 window.prism.onFocus(()=>{if(on)reveal(true);});
 window.prism.onState(s=>{on=!!s.settings.compactMode;revealed=on&&!!s.compactReveal;root.dataset.compact=on?(revealed?'revealed':'hidden'):'off';edge.hidden=!on||revealed;if(revealed&&!$('sidebar').matches(':hover'))leaveSoon();});
})();
