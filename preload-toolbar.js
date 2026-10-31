'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bar', {
  onState: (cb) => ipcRenderer.on('state', (_e, s) => cb(s)),
  setMode: (mode) => ipcRenderer.send('set-mode', mode),
  clear: () => ipcRenderer.send('clear'),
  close: () => ipcRenderer.send('close'),
  dragStart: () => ipcRenderer.send('toolbar-drag-start'),
  dragMove: (dx, dy) => ipcRenderer.send('toolbar-drag-move', dx, dy),
  dragEnd: () => ipcRenderer.send('toolbar-drag-end')
});
