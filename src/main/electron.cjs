const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const serve = require('electron-serve');
const path = require('path');
const settingsManager = require('electron-settings');

const port = 5173;
const loadURL = serve({ directory: 'build' });

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
    minHeight: 400,
    minWidth: 400,
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

contextMenu({
  showLookUpSelection: false,
  showSearchWithGoogle: false,
  showCopyImage: false,
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Make App 💻',
    },
  ],
});

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
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('to-main', (event, count) => {
  return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});


function ipcInit() {
  ipcMain.on('set-settings', (event, data) => {
    settingsManager.set('settings', data);
  });

  ipcMain.handle('get-settings', () => {
    return settingsManager.get('settings');
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
    }
    return state;
  });
}
