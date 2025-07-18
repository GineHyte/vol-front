const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const settingsManager = require('electron-settings');
// const { autoUpdater } = require('electron-updater');

const port = 5173;
const loadURL = serve({ directory: 'build' });
const isDev = process.env.NODE_ENV === 'dev';

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

let mainWindow;
var windowState;

function createWindow() {
	windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32,
		},
		minHeight: 500,
		minWidth: 1000,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: true, // isDev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

function loadDev(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadDev(port);
		}, 200);
	});
}

function loadProduction() {
	loadURL(mainWindow).catch((e) => {
		console.log('Error loading with electron-serve:', e);
		setTimeout(() => {
			loadProduction();
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	ipcInit();

	isDev ? loadDev(port) : loadProduction();
}

app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	app.quit();
});

function ipcInit() {
	ipcMain.on('set-settings', (event, data) => {
		// will only update settings, so if setting is undefined =>
		// will not set and leave old value
		const current = settingsManager.getSync('settings') || {}
		const filtered = Object.fromEntries(
			Object.entries(data).filter(([, value]) => value !== undefined)
		)
		const updated = { ...current, ...filtered }
		settingsManager.setSync('settings', updated)
	});

	ipcMain.handle('get-version', () => {
		return app.getVersion();
	});

	ipcMain.handle('get-settings', () => {
		return settingsManager.getSync('settings');
	});

	ipcMain.on('set-login-data', (event, data) => {
		settingsManager.setSync('loginData', data)
		console.log('set login data (electron): ', JSON.stringify(data));
	});

	ipcMain.handle('get-login-data', () => {
		return settingsManager.getSync('loginData');
	});

	ipcMain.on('set-window-state', (event, data) => {
		if (data.close) {
			mainWindow.close();
		}
		if (data.minimize) {
			mainWindow.minimize();
		}
		if (data.maximize) {
			mainWindow.maximize();
		}
		if (data.maximize === false) {
			mainWindow.unmaximize();
		}
	});

	ipcMain.handle('get-window-state', () => {
		let state = {
			isMaximized: mainWindow.isMaximized(),
			isFullScreen: mainWindow.isFullScreen(),
		};
		return state;
	});

	// ipcMain.on('check-update', () => {
	//   autoUpdater.checkForUpdatesAndNotify();
	// });

	// autoUpdater.on('update-available', (event, releaseNotes, releaseName) => {
	//   console.log('update-available', releaseNotes, releaseName);
	//   ipcMain.emit('update-available', releaseNotes, releaseName);
	// });

	// ipcMain.handle('download-update', () => {
	//   return autoUpdater.downloadUpdate();
	// });

	// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	//   ipcMain.emit('update-downloaded', releaseNotes, releaseName);
	// });

	// autoUpdater.on('error', (error) => {
	//   console.log('update-error', error);
	// });

	// autoUpdater.on('update-not-available', (error) => {
	//   console.log('update-not-available', error);
	// });
}
