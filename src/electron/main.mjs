// src/electron/main.mjs
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginRequest, saveDosu, saveEswt, fetchDataFromServer, getHistory } from './httpRequests.mjs';
import { screen } from 'electron/main';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
const { workAreaSize } = screen.getPrimaryDisplay();
  const win = new BrowserWindow({
    width: 1000,
    height: workAreaSize.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, 'gui', 'index.html'));
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('login', async (event, id, password) => {
  try {
    const cookie = await loginRequest({ id, password });
    return { success: true, cookie };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('saveDosu', async (event, params, cookie, userList) => {
  try {
    await saveDosu(params, cookie, userList);
    return { success: true };
  } catch (error) {
    console.error('SaveDosu error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('saveEswt', async (event, params, cookie, userList) => {
  try {
    await saveEswt(params, cookie, userList);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fetchData', async (event) => {
  try {
    const API_KEY = 'x4roeru02rmui95o6a4i'; 
    const data = await fetchDataFromServer(API_KEY);
    return { success: true, data };
  } catch (error) {
    console.error('FetchData error:', error);
    return { success: false, error: error.message };
  }
});
