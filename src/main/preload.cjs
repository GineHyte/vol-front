const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  setSettings: (data) => {
    ipcRenderer.send('set-settings', data);
  },
  getSettings: () => {
    return ipcRenderer.invoke('get-settings')
  },
});
