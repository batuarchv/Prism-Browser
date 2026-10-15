const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('autofill',{onRows:fn=>ipcRenderer.on('autofill-rows',(_e,data)=>fn(data)),onSelection:fn=>ipcRenderer.on('autofill-selection',(_e,index)=>fn(index)),choose:id=>ipcRenderer.send('autofill-choose',id),dismiss:()=>ipcRenderer.send('autofill-close')});
