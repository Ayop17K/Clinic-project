import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Example service showing how to integrate offline storage
 * with your clinic data management
 */
@Injectable({
  providedIn: 'root',
})
export class OfflineStorageExample {
  private patientsSubject = new BehaviorSubject<any[]>([]);
  private recordsSubject = new BehaviorSubject<any[]>([]);
  
  patients$ = this.patientsSubject.asObservable();
  records$ = this.recordsSubject.asObservable();

  constructor(private electronService: ElectronService) {
    this.initializeOfflineStorage();
  }

  /**
   * Initialize offline storage on app startup
   */
  private async initializeOfflineStorage() {
    try {
      // Load previously saved data
      const patients = await this.electronService.loadData('patients');
      const records = await this.electronService.loadData('records');

      if (patients) {
        this.patientsSubject.next(patients);
      }
      if (records) {
        this.recordsSubject.next(records);
      }

      console.log('Offline storage initialized');
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
    }
  }

  /**
   * Save patients data
   */
  async savePatients(patients: any[]): Promise<boolean> {
    try {
      const success = await this.electronService.saveData('patients', patients);
      if (success) {
        this.patientsSubject.next(patients);
      }
      return success;
    } catch (error) {
      console.error('Failed to save patients:', error);
      return false;
    }
  }

  /**
   * Get patients from memory
   */
  getPatients(): any[] {
    return this.patientsSubject.value;
  }

  /**
   * Add single patient
   */
  async addPatient(patient: any): Promise<boolean> {
    try {
      const patients = this.patientsSubject.value;
      patients.push(patient);
      return await this.savePatients(patients);
    } catch (error) {
      console.error('Failed to add patient:', error);
      return false;
    }
  }

  /**
   * Update patient
   */
  async updatePatient(patientId: string, updates: any): Promise<boolean> {
    try {
      const patients = this.patientsSubject.value;
      const index = patients.findIndex((p) => p.id === patientId);
      if (index !== -1) {
        patients[index] = { ...patients[index], ...updates };
        return await this.savePatients(patients);
      }
      return false;
    } catch (error) {
      console.error('Failed to update patient:', error);
      return false;
    }
  }

  /**
   * Delete patient
   */
  async deletePatient(patientId: string): Promise<boolean> {
    try {
      const patients = this.patientsSubject.value.filter(
        (p) => p.id !== patientId
      );
      return await this.savePatients(patients);
    } catch (error) {
      console.error('Failed to delete patient:', error);
      return false;
    }
  }

  /**
   * Save records data
   */
  async saveRecords(records: any[]): Promise<boolean> {
    try {
      const success = await this.electronService.saveData('records', records);
      if (success) {
        this.recordsSubject.next(records);
      }
      return success;
    } catch (error) {
      console.error('Failed to save records:', error);
      return false;
    }
  }

  /**
   * Get records from memory
   */
  getRecords(): any[] {
    return this.recordsSubject.value;
  }

  /**
   * Add single record
   */
  async addRecord(record: any): Promise<boolean> {
    try {
      const records = this.recordsSubject.value;
      records.push({
        ...record,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      });
      return await this.saveRecords(records);
    } catch (error) {
      console.error('Failed to add record:', error);
      return false;
    }
  }

  /**
   * Export data to JSON file
   */
  async exportData(): Promise<void> {
    try {
      const exportData = {
        patients: this.patientsSubject.value,
        records: this.recordsSubject.value,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const filename = `clinic-export-${new Date().getTime()}.json`;

      if (this.electronService.isElectron()) {
        // Electron: save to file
        await this.electronService.saveData(filename, dataStr);
      } else {
        // Web: download file
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }

      console.log('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<void> {
    try {
      await this.electronService.clearAllData();
      this.patientsSubject.next([]);
      this.recordsSubject.next([]);
      console.log('All data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Sync with backend (when online)
   * TODO: Implement actual API integration
   */
  async syncWithBackend(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Not online - sync skipped');
      return;
    }

    try {
      // Example: sync patients
      // const response = await this.http.post('/api/sync', {
      //   patients: this.patientsSubject.value,
      //   records: this.recordsSubject.value,
      // }).toPromise();

      console.log('Sync completed');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

/**
 * USAGE EXAMPLE IN YOUR COMPONENTS:
 *
 * import { OfflineStorageExample } from './services/offline-storage.example';
 *
 * @Component({...})
 * export class MyComponent {
 *   patients$: Observable<any[]>;
 *
 *   constructor(private offlineStorage: OfflineStorageExample) {
 *     this.patients$ = this.offlineStorage.patients$;
 *   }
 *
 *   addNewPatient() {
 *     const patient = { id: '1', name: 'John Doe', ... };
 *     this.offlineStorage.addPatient(patient);
 *   }
 *
 *   exportClinicData() {
 *     this.offlineStorage.exportData();
 *   }
 * }
 */
