const {contextBridge,ipcRenderer}=require('electron');
// The save-password panel's only bridge: it receives one prompt at a time and answers it.
contextBridge.exposeInMainWorld('prismSave',{
 onShow:callback=>ipcRenderer.on('prism-save-show',(_event,value)=>callback(value)),
 answer:value=>ipcRenderer.send('prism-save-answer',value),
 hide:()=>ipcRenderer.send('prism-save-hide'),
 fit:height=>ipcRenderer.send('prism-save-fit',height)
});
