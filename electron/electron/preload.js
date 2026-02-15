"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose only safe APIs to the renderer process
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
    getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    // File/Data operations for offline storage
    saveData: (filename, data) => electron_1.ipcRenderer.invoke('save-data', filename, data),
    loadData: (filename) => electron_1.ipcRenderer.invoke('load-data', filename),
    deleteData: (filename) => electron_1.ipcRenderer.invoke('delete-data', filename),
    // System info
    isElectron: () => true,
});
//# sourceMappingURL=preload.js.map