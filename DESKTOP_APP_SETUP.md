# Electron Desktop App - Quick Start Guide

## Overview
Your Ionic Angular application has been converted to an offline-capable desktop app using **Electron**. This guide will help you build, run, and distribute your desktop application.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

## Running the App

### Development Mode (with Live Reload)
```bash
npm run electron-dev
```
This will:
- Start the Angular dev server on http://localhost:4200
- Launch the Electron app that connects to the dev server
- Allow you to make changes and see them update automatically

### Production Mode (Standalone)
```bash
npm run electron
```
This will:
- Compile Electron source files
- Launch the app in standalone mode

## Building Installers

### Build for Windows
```bash
npm run electron-build-win
```
Creates:
- `.exe` installer (for distribution)
- Standalone `.exe` portable version

### Build for macOS
```bash
npm run electron-build-mac
```
Creates:
- `.dmg` installer
- `.zip` package

### Build for Linux
```bash
npm run electron-build-linux
```
Creates:
- AppImage (portable app)
- `.deb` package (for Debian-based systems)

### Build for All Platforms
```bash
npm run electron-build
```

## Key Features

### Offline Storage
Your app includes built-in offline storage capabilities:

1. **File System Storage** - For persistent data storage
2. **IndexedDB** - For larger data sets
3. **localStorage** - For web fallback

### Using the Electron Service
In your Angular components, inject and use the `ElectronService`:

```typescript
import { ElectronService } from './services/electron.service';

@Component({...})
export class MyComponent {
  constructor(private electronService: ElectronService) {}

  async saveData() {
    await this.electronService.saveData('myKey', {
      name: 'John',
      clinic: 'Clinic A'
    });
  }

  async loadData() {
    const data = await this.electronService.loadData('myKey');
    console.log(data);
  }
}
```

## Project Structure

```
AYOP/Clinic/
├── electron/                    # Electron main & preload process
│   ├── main.ts                 # Main process (runs on startup)
│   └── preload.ts              # IPC bridge for secure communication
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── electron.service.ts  # Offline storage service
│   │   └── ...
│   └── ...
├── package.json                # Dependencies & scripts
├── tsconfig.electron.json      # Electron TypeScript config
├── electron-builder.json       # Desktop app packaging config
└── angular.json                # Angular build config
```

## Offline Mode

Your app is completely offline-capable:
- All code and assets are bundled into the app
- No internet connection required
- Data is stored locally on the user's machine
- Perfect for clinic operations without cloud dependency

## API Calls & Backend Services

**Important**: If your app makes API calls to a backend server, you need to:

1. **Mock API responses** for offline use
2. **Add local storage** to persist data
3. **Implement sync logic** when online (optional)

Example service update:

```typescript
// services/api.service.ts
async getPatients() {
  // Try online first
  if (navigator.onLine) {
    try {
      return await this.http.get('/api/patients').toPromise();
    } catch (error) {
      console.error('API failed, using offline data');
    }
  }
  
  // Fallback to offline data
  return this.electronService.loadData('patients') || [];
}
```

## Distribution

### Windows
- Users can double-click the `.exe` installer
- Program will install to Program Files
- Start menu shortcut created
- Or use the portable `.exe` for USB distribution

### macOS
- Users double-click the `.dmg` and drag the app to Applications
- App can be signed/notarized (see electron-builder docs)

### Linux
- Distribute `.AppImage` (universal, no installation needed)
- Or `.deb` for Ubuntu/Debian systems

## Customization

### App Name & Icon
Edit `electron-builder.json`:
```json
{
  "appId": "com.clinic.app",
  "productName": "Your App Name",
  "icon": "path/to/your/icon.png"
}
```

### Window Size
Edit `electron/main.ts`:
```typescript
mainWindow = new BrowserWindow({
  width: 1200,  // Change width
  height: 800,  // Change height
  ...
});
```

### Menu Items
Customize in `electron/main.ts` menu template

## Troubleshooting

### "Cannot find module 'electron'"
```bash
npm install
```

### Dev server not connecting
- Make sure `npm start` is running first
- Check that port 4200 is available
- Look at dev console (F12) for errors

### Build fails
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Make sure you've run `npm run build` successfully beforehand

### Data not persisting
- Use the `ElectronService` provided (handles both Electron and web)
- Check browser console for storage permission errors

## Next Steps

1. ✅ Install: `npm install`
2. ✅ Test: `npm run electron-dev`
3. ✅ Build: `npm run electron-build-win` (or your platform)
4. 📦 Distribute the installer to users

## Support Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Angular Documentation](https://angular.io/docs)
- [Electron Builder](https://www.electron.build/)
- [electron-is-dev](https://github.com/sindresorhus/electron-is-dev)

---

**Your app is now ready for offline desktop use!** 🚀
