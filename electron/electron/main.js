"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWindow = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const isDev = __importStar(require("electron-is-dev"));
const fs = __importStar(require("fs"));
let mainWindow = null;
exports.mainWindow = mainWindow;
// Create the browser window
function createWindow() {
    exports.mainWindow = mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
        icon: path.join(__dirname, '../src/assets/icon/favicon.png'),
    });
    const startUrl = isDev
        ? 'http://localhost:4200'
        : `file://${path.join(__dirname, '../www/index.html')}`;
    mainWindow.loadURL(startUrl);
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        exports.mainWindow = mainWindow = null;
    });
}
// App event listeners
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// Create application menu
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    electron_1.app.quit();
                },
            },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
        ],
    },
];
const menu = electron_1.Menu.buildFromTemplate(template);
electron_1.Menu.setApplicationMenu(menu);
// IPC for app info
electron_1.ipcMain.handle('get-app-version', () => electron_1.app.getVersion());
electron_1.ipcMain.handle('get-app-path', () => electron_1.app.getAppPath());
// IPC for file operations (for offline data storage)
electron_1.ipcMain.handle('save-data', (event, filename, data) => {
    try {
        const appPath = electron_1.app.getPath('userData');
        const filePath = path.join(appPath, filename);
        fs.writeFileSync(filePath, data, 'utf-8');
        return { success: true };
    }
    catch (error) {
        console.error('Error saving data:', error);
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('load-data', (event, filename) => {
    try {
        const appPath = electron_1.app.getPath('userData');
        const filePath = path.join(appPath, filename);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return { success: true, data };
        }
        return { success: false, error: 'File not found' };
    }
    catch (error) {
        console.error('Error loading data:', error);
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('delete-data', (event, filename) => {
    try {
        const appPath = electron_1.app.getPath('userData');
        const filePath = path.join(appPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true };
        }
        return { success: false, error: 'File not found' };
    }
    catch (error) {
        console.error('Error deleting data:', error);
        return { success: false, error: error.message };
    }
});
//# sourceMappingURL=main.js.map