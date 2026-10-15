const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('prism', {
  action: (name, value) => ipcRenderer.invoke('action', name, value),
  onGmail: fn => ipcRenderer.on('gmail-preview',(_e,data)=>fn(data)),
  onPanelHidden: fn => ipcRenderer.on('panel-hidden',()=>fn()),
  onState: fn => ipcRenderer.on('state', (_event, state) => fn(state)),
  onPanel: fn => ipcRenderer.on('open-panel', (_event, section) => fn(section)),
  onEdit: fn => ipcRenderer.on('edit-bookmark', (_event, entry) => fn(entry)),
  onFocus: fn => ipcRenderer.on('focus-address', () => fn())
});
