# Integration Checklist for Offline Desktop App

Complete this checklist to fully integrate offline functionality into your clinic app.

## Phase 1: Installation & Setup ✅
- [x] Install Electron dependencies
- [x] Create Electron main process
- [x] Create Electron preload script
- [x] Add Electron build scripts

## Phase 2: Core Services ✅
- [x] Create `ElectronService` for offline storage
- [x] Create `EnvironmentService` for environment detection
- [x] Create `OfflineStorageExample` service

## Phase 3: API Integration (TODO)

### For Each API Endpoint:

#### Patient Service
- [ ] Add offline data caching
- [ ] Implement fallback to cached data
- [ ] Update API calls to support offline mode

Example:
```typescript
async getPatients() {
  if (navigator.onLine) {
    try {
      const data = await this.http.get('/api/patients').toPromise();
      await this.electronService.saveData('patients', data);
      return data;
    } catch (error) {
      return await this.electronService.loadData('patients');
    }
  }
  return await this.electronService.loadData('patients') || [];
}
```

#### Records Service
- [ ] Cache record data locally
- [ ] Sync records when online
- [ ] Handle new records created offline

#### Financial Plans Service
- [ ] Cache financial plan data
- [ ] Support offline calculations
- [ ] Sync updates when online

### Other Services
- [ ] Home page data caching
- [ ] All-plan caching
- [ ] Actual-paid data persistence
- [ ] Navigation state persistence

## Phase 4: Component Updates

### Home Page (`home/`)
- [ ] Update to use cached data
- [ ] Add offline indicator
- [ ] Show last sync time

### Records Page (`records/`)
- [ ] Load records from offline storage
- [ ] Allow creating new records offline
- [ ] Show sync status

### Plans Pages (`all-plan/`, `financial-plans/`, `plan-record/`)
- [ ] Display cached plan data
- [ ] Allow offline operations
- [ ] Queue changes for sync

### Actual Paid Page (`actual-paid/`)
- [ ] Support offline data entry
- [ ] Persist changes locally
- [ ] Sync when online

### Navigator Page (`navigator/`)
- [ ] Maintain navigation state
- [ ] Restore last visited page

## Phase 5: User Feedback

### UI Indicators
- [ ] Add online/offline indicator
- [ ] Show "Sync needed" badge
- [ ] Display data age (when last synced)
- [ ] Add sync status messages

### Notifications
- [ ] Notify user when going offline
- [ ] Notify user when data synced
- [ ] Show sync errors

Example component:
```typescript
@Component({...})
export class SyncIndicator {
  isOnline$ = this.environment.isDesktopMode$();
  lastSync: Date;

  constructor(private environment: EnvironmentService) {
    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());
  }

  onOnline() {
    console.log('Now online - syncing data...');
    this.sync();
  }

  onOffline() {
    console.log('Now offline - using cached data');
  }
}
```

## Phase 6: Data Management

### Export/Import
- [ ] Create export functionality (see `OfflineStorageExample`)
- [ ] Add import data feature
- [ ] Support backup creation

### Settings Page (Create if needed)
- [ ] Add data storage settings
- [ ] Add export/import options
- [ ] Add cache clear option
- [ ] Show storage usage info

## Phase 7: Security

### Authentication
- [ ] Update auth guard to work offline
- [ ] Cache authentication state
- [ ] Handle token refresh offline
- [ ] [ ] Invalidate cached data on logout

### Data Encryption (Optional)
- [ ] Consider encrypting sensitive data
- [ ] Implement if handling PHI (Protected Health Information)

## Phase 8: Testing

### Offline Testing
- [ ] Test all pages without internet
- [ ] Test data persistence
- [ ] Test adding/editing records offline
- [ ] Test sync when online

### Production Testing
- [ ] Build for each platform
- [ ] Test installer on clean Windows machine
- [ ] Test installer on Mac
- [ ] Test on Linux

### Performance Testing
- [ ] Check app startup time
- [ ] Monitor memory usage
- [ ] Check storage usage
- [ ] Test with large datasets

## Phase 9: Documentation

### User Documentation
- [ ] Document offline mode
- [ ] Explain data sync behavior
- [ ] Provide troubleshooting guide
- [ ] Create FAQ

### Developer Documentation
- [ ] Document service architecture
- [ ] Document offline patterns used
- [ ] Create deployment guide
- [ ] Document API changes

## Phase 10: Deployment

### Before Release
- [ ] Version bump in `package.json`
- [ ] Update `CONVERSION_REPORT.md`
- [ ] Create release notes
- [ ] Final testing on target platforms

### Release
- [ ] Build installers: `npm run electron-build`
- [ ] Sign binaries (if required)
- [ ] Upload to distribution server
- [ ] Create installation instructions

### Post-Release
- [ ] Monitor user feedback
- [ ] Track crash reports
- [ ] Monitor data sync issues
- [ ] Plan updates/patches

## Optional Enhancements

- [ ] Add SQLite for better structured data storage
- [ ] Implement real-time sync
- [ ] Add push notifications
- [ ] Create web portal for multi-user sync
- [ ] Add user roles/permissions system
- [ ] Create dashboard/analytics
- [ ] Add backup to cloud (when online)
- [ ] Implement offline queue system

## Quick Reference

### Key Files to Modify
| Component | Service | Key Method |
|-----------|---------|------------|
| All | `ElectronService` | `saveData()`, `loadData()` |
| All | `EnvironmentService` | `isDesktop()` |
| Records | `RecordService` | Cache on API call |
| Patients | `PatientService` | Cache on API call |
| Plans | `PlanService` | Cache on API call |

### Storage Options
```typescript
// File system (Electron only)
await this.electronService.saveData('key', data);

// IndexedDB (cross-platform)
await this.electronService.saveToIndexedDB('store', 'key', data);

// localStorage (fallback)
localStorage.setItem('key', JSON.stringify(data));
```

### Environment Detection
```typescript
if (this.environmentService.isDesktop()) {
  // Desktop-specific code
} else {
  // Web-specific code
}
```

## Support & Resources

- **Quick Start**: See `DESKTOP_APP_SETUP.md`
- **Conversion Details**: See `CONVERSION_REPORT.md`
- **Example Service**: See `src/app/services/offline-storage.example.ts`
- **Electron Docs**: https://www.electronjs.org/docs
- **Angular Offline Patterns**: https://angular.io/guide/service-worker-intro

---

**Progress**: Use this to track integration completion. Update as you complete each section!
