// Toolbar of a web app in the Dock (web-app.cjs): state in, button presses out.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('webApp',{command:name=>ipcRenderer.send('web-app-command',String(name)),onState:fn=>ipcRenderer.on('web-app-state',(_e,s)=>fn(s))});
