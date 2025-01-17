const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const serve = require('electron-serve');
const path = require('path');

const loadURL = serve({ directory: 'build' });

try {
  require('electron-reloader')(module);
} catch (e) {
  console.error(e);
}

let mainWindow;

function createWindow() {
  let windowState = windowStateManager({
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
    minHeight: 800,
    minWidth: 600,
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
