// Docked extension side panel chrome: header (icon, name, close) and the resize edge. The extension's page itself is a
// separate view main.cjs places under the header.
(()=>{if(new URLSearchParams(location.search).has('tool'))return;
 const box=$('side-panel'),edge=$('side-panel-resize'),root=document.documentElement;let current=null,dragging=null,frame=0;
 setIcon($('side-panel-close'),'close');$('side-panel-close').onclick=()=>act('side-panel-close');
 function draw(s){const sp=s.sidePanel;box.hidden=!sp;root.classList.toggle('has-side-panel',!!sp);if(!sp){current=null;return;}
  if(!dragging)root.style.setProperty('--side-panel-width',sp.width+'px');root.style.setProperty('--side-panel-top',sp.top+'px');root.style.setProperty('--side-panel-header',sp.header+'px');
  const ext=(s.extensions||[]).find(e=>e.id===sp.id),t=window.prismLocale?.t||(k=>k);if(current===sp.id+(ext?.icon||'')+(ext?.name||''))return;current=sp.id+(ext?.icon||'')+(ext?.name||'');
  const art=box.querySelector('.side-panel-art');art.replaceChildren();if(ext?.icon){const img=document.createElement('img');img.src=ext.icon;img.alt='';art.append(img);}else art.append(icon('extension'));
  box.querySelector('.side-panel-title').textContent=ext?.name||t('Extension');$('side-panel-close').setAttribute('aria-label',t('Close side panel')+(ext?' · '+ext.name:''));$('side-panel-close').title=t('Close side panel');}
 window.prism.onState(draw);
 // Dragging the left edge resizes live; the extension's view returns at the new width when the pointer is released.
 const widthAt=x=>Math.round(window.innerWidth-6-x);
 edge.addEventListener('pointerdown',event=>{if(event.button!==0)return;dragging={start:event.clientX};edge.setPointerCapture(event.pointerId);document.body.classList.add('resizing','side-panel-resizing');});
 edge.addEventListener('pointermove',event=>{if(!dragging)return;const width=Math.max(280,Math.min(640,widthAt(event.clientX)));root.style.setProperty('--side-panel-width',width+'px');if(!frame)frame=requestAnimationFrame(()=>{frame=0;act('side-panel-resize',width);});});
 async function end(){if(!dragging)return;cancelAnimationFrame(frame);frame=0;const width=parseInt(getComputedStyle(root).getPropertyValue('--side-panel-width'))||360;await act('side-panel-resize',width);await act('side-panel-finish-resize');dragging=null;document.body.classList.remove('resizing','side-panel-resizing');}
 edge.addEventListener('pointerup',end);edge.addEventListener('pointercancel',end);
 edge.addEventListener('dblclick',async()=>{await act('side-panel-resize',360);act('side-panel-finish-resize');});
 edge.addEventListener('keydown',async event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const now=parseInt(getComputedStyle(root).getPropertyValue('--side-panel-width'))||360;await act('side-panel-resize',now+(event.key==='ArrowLeft'?16:-16));act('side-panel-finish-resize');});
})();
