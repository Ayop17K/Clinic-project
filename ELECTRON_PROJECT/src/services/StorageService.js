class StorageService {
  constructor() {
    this.storageKey = 'clinic-budget-app-settings';
  }

  getSetting(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.storageKey);
      const settings = data ? JSON.parse(data) : {};
      return settings[key] !== undefined ? settings[key] : defaultValue;
    } catch (error) {
      console.error('Get setting error:', error);
      return defaultValue;
    }
  }

  setSetting(key, value) {
    try {
      const data = localStorage.getItem(this.storageKey);
      const settings = data ? JSON.parse(data) : {};
      settings[key] = value;
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Set setting error:', error);
      return false;
    }
  }

  getAllSettings() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Get all settings error:', error);
      return {};
    }
  }

  clearAllSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Clear settings error:', error);
      return false;
    }
  }
}

export default new StorageService();
