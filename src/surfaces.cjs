// Small native surfaces (0.32): Peek, the command bar and picture-in-picture each draw their own controls in a
// sandboxed page loaded with surface-preload.cjs. Commands are accepted only from the surface's own top frame.
const path=require('node:path');
function createSurfaces(ipcMain){
 const owners=new Map();
 const find=event=>{const owner=owners.get(event.sender);return owner&&event.senderFrame===event.sender.mainFrame&&event.senderFrame.url.startsWith('file:')?owner:null;};
 ipcMain.on('prism-surface',(event,command,value)=>{const owner=find(event);if(owner&&typeof command==='string')owner.command?.(command,value);});
 ipcMain.handle('prism-surface-ask',(event,command,value)=>{const owner=find(event);return owner&&typeof command==='string'?owner.ask?.(command,value):null;});
 return {
  preload:path.join(__dirname,'surface-preload.cjs'),
  page:name=>path.join(__dirname,name),
  // Registers a surface page; forget it when its contents are destroyed.
  register(wc,owner){owners.set(wc,owner);wc.once('destroyed',()=>owners.delete(wc));wc.setWindowOpenHandler(()=>({action:'deny'}));wc.on('will-navigate',e=>e.preventDefault());},
  send(wc,value){if(wc&&!wc.isDestroyed())wc.send('surface-state',value);}
 };
}
module.exports={createSurfaces};
