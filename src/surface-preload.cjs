// Preload for Prism's small native surfaces (Peek header, command bar, picture-in-picture controls, 0.32). They only
// send named commands to the browser and receive their own state; they never see web content or other Prism state.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('surface',{
 send:(command,value)=>ipcRenderer.send('prism-surface',String(command),value===undefined?null:JSON.parse(JSON.stringify(value))),
 ask:(command,value)=>ipcRenderer.invoke('prism-surface-ask',String(command),value===undefined?null:JSON.parse(JSON.stringify(value))),
 on:fn=>ipcRenderer.on('surface-state',(_event,value)=>fn(value))
});
