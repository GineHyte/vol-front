// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const isDev = !app.isPackaged;

function main() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, "./preload.js")
		}
	});

	if (process.env.NODE_ENV !== 'development') {
        // Load production build
        mainWindow.loadFile(`${__dirname}/renderer/dist/index.html`)
      } else {
        // Load vite dev server page 
        console.log('Development mode')
        mainWindow.loadURL('http://localhost:8000/')
      }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(main);

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) 
    main();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') 
		app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle("get/test", () => { 
	return "test";
});