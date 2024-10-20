const { ipcRenderer, ContextBridge, contextBridge } = require("electron");

//The api to expose to webpage
const WINDOW_API = {
    test: () => ipcRenderer.invoke("get/test")
}

//Exposes window.api in main app
contextBridge.exposeInMainWorld("api", WINDOW_API);