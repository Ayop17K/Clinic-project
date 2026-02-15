import { contextBridge, ipcRenderer } from 'electron';

// Expose only safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // File/Data operations for offline storage
  saveData: (filename: string, data: string) => 
    ipcRenderer.invoke('save-data', filename, data),
  loadData: (filename: string) => 
    ipcRenderer.invoke('load-data', filename),
  deleteData: (filename: string) => 
    ipcRenderer.invoke('delete-data', filename),
  
  // System info
  isElectron: () => true,
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      getAppPath: () => Promise<string>;
      saveData: (filename: string, data: string) => Promise<{success: boolean; error?: string}>;
      loadData: (filename: string) => Promise<{success: boolean; data?: string; error?: string}>;
      deleteData: (filename: string) => Promise<{success: boolean; error?: string}>;
      isElectron: () => boolean;
    };
  }
}

export {};
