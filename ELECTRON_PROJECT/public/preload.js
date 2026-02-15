const { contextBridge, ipcRenderer } = require('electron');

// IPC handlers - return promises
const electronAPI = {
  // Database operations
  getBudgets: (year) => ipcRenderer.invoke('db:get-budgets', year),
  saveBudgets: (data) => ipcRenderer.invoke('db:save-budgets', data),
  deleteBudgets: (year) => ipcRenderer.invoke('db:delete-budgets', year),
  exportToExcel: (year, data) => ipcRenderer.invoke('db:export-to-excel', year, data),
  
  // Platform detection
  isElectron: true,
  platform: process.platform,
};

// Expose electronAPI to window
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
