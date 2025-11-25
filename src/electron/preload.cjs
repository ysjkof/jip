// src/electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('api', {
  login: async (id, password) => {
    return await ipcRenderer.invoke('login', id, password);
  },
  saveDosu: async (params, cookie, userList) => {
    return await ipcRenderer.invoke('saveDosu', params, cookie, userList);
  },
  saveEswt: async (params, cookie, userList) => {
    return await ipcRenderer.invoke('saveEswt', params, cookie, userList);
  },
  fetchData: async () => {
    return await ipcRenderer.invoke('fetchData');
  },
});
