const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const DatabaseService = require('../src/services/DatabaseService');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:8080'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Database Operations
ipcMain.handle('db:get-budgets', async (event, year) => {
  try {
    const db = new DatabaseService();
    const budgets = db.getBudgetsByYear(year);
    db.close();
    return { success: true, data: budgets };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:save-budget', async (event, budget) => {
  try {
    const db = new DatabaseService();
    const result = db.saveBudget(budget);
    db.close();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:save-budgets', async (event, budgets) => {
  try {
    const db = new DatabaseService();
    const results = budgets.map(budget => db.saveBudget(budget));
    db.close();
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:delete-budgets', async (event, year) => {
  try {
    const db = new DatabaseService();
    const result = db.deleteBudgetByYear(year);
    db.close();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:export-to-excel', async (event, year, data) => {
  try {
    const ExportService = require('../src/services/ExportService');
    const exporter = new ExportService();
    const filePath = await exporter.exportToExcel(year, data);
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
