import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private isDesktopMode = new BehaviorSubject<boolean>(this.detectDesktopMode());

  constructor() {}

  /**
   * Detect if app is running in Electron
   */
  private detectDesktopMode(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as any).electronAPI !== 'undefined'
    );
  }

  /**
   * Get desktop mode observable
   */
  isDesktopMode$() {
    return this.isDesktopMode.asObservable();
  }

  /**
   * Check if currently in desktop mode
   */
  isDesktop(): boolean {
    return this.isDesktopMode.value;
  }

  /**
   * Get environment information
   */
  async getEnvironmentInfo() {
    return {
      isDesktop: this.isDesktop(),
      isOnline: navigator.onLine,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      storage: this.getStorageInfo(),
    };
  }

  /**
   * Get storage information
   */
  private getStorageInfo() {
    return {
      localStorage: {
        available: this.isLocalStorageAvailable(),
        usage: this.getLocalStorageUsage(),
      },
      indexedDB: typeof indexedDB !== 'undefined',
    };
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get approximate localStorage usage
   */
  private getLocalStorageUsage(): string {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return this.formatBytes(totalSize);
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
