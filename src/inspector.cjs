// Use Chromium's managed dock: it owns resizing and releases its frontend on close.
function createInspector({changed}){
 let owner=null;
 function close(){if(!owner)return;const wc=owner;owner=null;if(wc&&!wc.isDestroyed())wc.closeDevTools();changed();}
 function open(wc,point){if(!wc||wc.isDestroyed())return;if(owner!==wc){if(owner)close();owner=wc;wc.once('devtools-closed',()=>{if(owner===wc){owner=null;changed();}});wc.once('devtools-opened',changed);wc.openDevTools({mode:'right',activate:true});}if(point)wc.inspectElement(Math.round(point.x),Math.round(point.y));changed();}
 return {open,close,owner:()=>owner,isOpen:()=>!!owner&&!owner.isDestroyed(),get:()=>owner?.devToolsWebContents,layout(){}};
}
module.exports={createInspector};
