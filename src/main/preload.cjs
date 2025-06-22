const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	setSettings: (data) => {
		ipcRenderer.send('set-settings', data);
	},
	getSettings: () => {
		return ipcRenderer.invoke('get-settings');
	},
	getWindowState: () => {
		return ipcRenderer.invoke('get-window-state');
	},
	setWindowState: (data) => {
		ipcRenderer.send('set-window-state', data);
	},
	checkUpdate: () => {
		ipcRenderer.send('check-update');
	},
	downloadUpdate: () => {
		ipcRenderer.send('download-update');
	},
	getVersion: () => {
		return ipcRenderer.invoke('get-version');
	},
	setLoginData: (data) => {
		ipcRenderer.send('set-login-data', data);
	},
	getLoginData: () => {
		return ipcRenderer.invoke('get-login-data');
	}
});
