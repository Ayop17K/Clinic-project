import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private isElectronEnv = false;
  private dataDirectory: string = 'clinic-data';

  constructor() {
    this.isElectronEnv = this.checkElectronEnvironment();
  }

  /**
   * Check if running in Electron environment
   */
  private checkElectronEnvironment(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as any).electronAPI !== 'undefined'
    );
  }

  /**
   * Check if app is running in Electron
   */
  isElectron(): boolean {
    return this.isElectronEnv;
  }

  /**
   * Get app version
   */
  async getAppVersion(): Promise<string> {
    if (this.isElectronEnv) {
      return (window as any).electronAPI.getAppVersion();
    }
    return 'web-version';
  }

  /**
   * Get app path
   */
  async getAppPath(): Promise<string> {
    if (this.isElectronEnv) {
      return (window as any).electronAPI.getAppPath();
    }
    return '';
  }

  /**
   * Save data to local file
   */
  async saveData(key: string, data: any): Promise<boolean> {
    try {
      if (this.isElectronEnv) {
        const result = await (window as any).electronAPI.saveData(
          `${this.dataDirectory}/${key}.json`,
          JSON.stringify(data, null, 2)
        );
        return result.success;
      } else {
        // Fallback to localStorage for web
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  /**
   * Load data from local file
   */
  async loadData(key: string): Promise<any> {
    try {
      if (this.isElectronEnv) {
        const result = await (window as any).electronAPI.loadData(
          `${this.dataDirectory}/${key}.json`
        );
        if (result.success && result.data) {
          return JSON.parse(result.data);
        }
        return null;
      } else {
        // Fallback to localStorage for web
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  /**
   * Delete data file
   */
  async deleteData(key: string): Promise<boolean> {
    try {
      if (this.isElectronEnv) {
        const result = await (window as any).electronAPI.deleteData(
          `${this.dataDirectory}/${key}.json`
        );
        return result.success;
      } else {
        // Fallback to localStorage for web
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      return false;
    }
  }

  /**
   * Save to IndexedDB for better offline support
   */
  async saveToIndexedDB(storeName: string, key: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      const request = indexedDB.open('ClinicDB', 1);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        resolve(false);
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const putRequest = store.put({ key, data, timestamp: Date.now() });

        putRequest.onerror = () => {
          console.error('Error saving to IndexedDB:', putRequest.error);
          resolve(false);
        };

        putRequest.onsuccess = () => {
          resolve(true);
        };
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  /**
   * Load from IndexedDB
   */
  async loadFromIndexedDB(storeName: string, key: string): Promise<any> {
    return new Promise((resolve) => {
      const request = indexedDB.open('ClinicDB', 1);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        resolve(null);
      };

      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const index = store.index('key');
          const getRequest = index.get(key);

          getRequest.onerror = () => {
            console.error('Error loading from IndexedDB:', getRequest.error);
            resolve(null);
          };

          getRequest.onsuccess = () => {
            resolve(getRequest.result?.data || null);
          };
        } catch (error) {
          console.error('IndexedDB transaction error:', error);
          resolve(null);
        }
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('key', 'key', { unique: false });
        }
      };
    });
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<void> {
    if (this.isElectronEnv) {
      // For Electron, you'd need file system operations
      console.log('Clear data from user cache directory');
    } else {
      // Clear localStorage
      localStorage.clear();
    }

    // Clear IndexedDB
    const dbs = (await indexedDB.databases?.()) || [];
    dbs.forEach((db) => {
      indexedDB.deleteDatabase(db.name);
    });
  }
}
