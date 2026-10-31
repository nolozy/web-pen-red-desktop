'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pen', {
  onState: (cb) => ipcRenderer.on('state', (_e, s) => cb(s)),
  onClear: (cb) => ipcRenderer.on('clear', () => cb()),
  setMode: (mode) => ipcRenderer.send('set-mode', mode),
  setColor: (name) => ipcRenderer.send('set-color', name),
  clear: () => ipcRenderer.send('clear')
});
