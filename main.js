'use strict';

/**
 * Web Pen - Red (desktop)
 * One transparent, always-on-top overlay per display + a 132x36 toolbar window.
 * Same scope as the Chrome extension: pen / cursor / clear all / close, and
 * the R / Y / G / B / W colour keys (pen mode only).
 */

const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');

const HOTKEY = 'CommandOrControl+Shift+P';
const COLOR_NAMES = ['red', 'yellow', 'green', 'blue', 'white'];

const JA = (app.getLocale() || '').toLowerCase().startsWith('ja');
const T = JA
  ? {
      tip: 'Web Pen - Red（Ctrl+Shift+P で表示・非表示）',
      toggle: '表示 / 非表示',
      quit: '終了',
      hotkeyFail: 'Ctrl+Shift+P は他のアプリが使用中のため登録できませんでした。常駐アイコンのクリックで操作できます。'
    }
  : {
      tip: 'Web Pen - Red (Ctrl+Shift+P to show / hide)',
      toggle: 'Show / Hide',
      quit: 'Quit',
      hotkeyFail: 'Ctrl+Shift+P is already used by another app. You can still use the tray icon.'
    };

const TOOLBAR_W = 156; // 132 + 12px margin each side for the shadow
const TOOLBAR_H = 60; // 36 + 12px margin each side

const state = { visible: false, mode: 'pen', color: 'red' };

/** @type {Map<number, BrowserWindow>} */
let overlays = new Map();
let toolbar = null;
let tray = null;
let rebuildTimer = null;

/* ---------- single instance: launching again acts like the hotkey ---------- */

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => onHotkey());
}

/* ---------- windows ---------- */

function createOverlay(display) {
  const b = display.bounds;
  const win = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: true,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload-overlay.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setBounds(b);
  // 99% opacity on purpose. A fully opaque window that covers the screen makes
  // Chrome and other apps think they are completely hidden, and they pause
  // their videos. A (barely) translucent window is not counted as covering them.
  win.setOpacity(0.99);
  win.loadFile(path.join(__dirname, 'renderer', 'overlay.html'));
  win.webContents.on('did-finish-load', () => win.webContents.send('state', publicState()));
  return win;
}

function createToolbar() {
  const primary = screen.getPrimaryDisplay().bounds;
  const win = new BrowserWindow({
    x: primary.x + primary.width - TOOLBAR_W,
    y: primary.y,
    width: TOOLBAR_W,
    height: TOOLBAR_H,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    // Never steals focus from the app underneath (a replay, a game, a call).
    focusable: false,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload-toolbar.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  win.setAlwaysOnTop(true, 'screen-saver', 1);
  win.loadFile(path.join(__dirname, 'renderer', 'toolbar.html'));
  win.webContents.on('did-finish-load', () => win.webContents.send('state', publicState()));
  return win;
}

function buildWindows() {
  for (const w of overlays.values()) if (!w.isDestroyed()) w.destroy();
  overlays = new Map();
  for (const d of screen.getAllDisplays()) overlays.set(d.id, createOverlay(d));
  if (!toolbar || toolbar.isDestroyed()) toolbar = createToolbar();
  if (state.visible) {
    // displays changed while visible: bring the new windows up
    showAll();
  }
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(buildWindows, 300);
}

/* ---------- state ---------- */

function publicState() {
  return { mode: state.mode, color: state.color };
}

function broadcast(channel, payload) {
  for (const w of overlays.values()) if (!w.isDestroyed()) w.webContents.send(channel, payload);
  if (toolbar && !toolbar.isDestroyed()) toolbar.webContents.send(channel, payload);
}

function focusOverlayUnderCursor() {
  const d = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const win = overlays.get(d.id) || overlays.values().next().value;
  if (win && !win.isDestroyed()) win.focus();
}

/** Pen: overlays take the mouse and the keyboard. Cursor: everything passes through. */
function applyMode() {
  for (const w of overlays.values()) {
    if (w.isDestroyed()) continue;
    if (state.mode === 'pen') {
      w.setFocusable(true);
      w.setIgnoreMouseEvents(false);
    } else {
      w.setIgnoreMouseEvents(true);
      w.setFocusable(false); // gives the keyboard back to the app underneath
    }
  }
  broadcast('state', publicState());
  if (state.visible && state.mode === 'pen') focusOverlayUnderCursor();
}

function setMode(mode) {
  if (mode !== 'pen' && mode !== 'cursor') return;
  state.mode = mode;
  applyMode();
}

function showAll() {
  state.visible = true;
  state.mode = 'pen'; // like the extension: it always opens in pen mode
  for (const w of overlays.values()) if (!w.isDestroyed()) w.showInactive();
  if (toolbar && !toolbar.isDestroyed()) {
    toolbar.showInactive();
    toolbar.setAlwaysOnTop(true, 'screen-saver', 1);
    toolbar.moveTop();
  }
  applyMode();
}

function hideAll() {
  state.visible = false;
  for (const w of overlays.values()) if (!w.isDestroyed()) w.hide();
  if (toolbar && !toolbar.isDestroyed()) toolbar.hide();
}

/** The X button: wipe every line, reset, and go away (like closing the overlay on a tab). */
function closeOverlay() {
  broadcast('clear');
  state.mode = 'pen';
  state.color = 'red';
  broadcast('state', publicState());
  hideAll();
}

function toggle() {
  if (state.visible) hideAll();
  else showAll();
}

/**
 * Ctrl+Shift+P (and launching the app again / the taskbar icon):
 *   hidden -> show in pen mode;  cursor mode -> back to pen;  pen mode -> hide.
 */
function onHotkey() {
  if (!state.visible) return showAll();
  if (state.mode === 'cursor') return setMode('pen');
  return hideAll();
}

/* ---------- IPC ---------- */

ipcMain.on('set-mode', (_e, mode) => setMode(mode));

ipcMain.on('set-color', (_e, name) => {
  if (!COLOR_NAMES.includes(name)) return;
  state.color = name;
  broadcast('state', publicState());
});

ipcMain.on('clear', () => broadcast('clear'));
ipcMain.on('close', () => closeOverlay());

let dragStart = null;
ipcMain.on('toolbar-drag-start', () => {
  if (!toolbar || toolbar.isDestroyed()) return;
  const [x, y] = toolbar.getPosition();
  dragStart = { x, y };
});
ipcMain.on('toolbar-drag-move', (_e, dx, dy) => {
  if (!dragStart || !toolbar || toolbar.isDestroyed()) return;
  toolbar.setPosition(Math.round(dragStart.x + dx), Math.round(dragStart.y + dy));
});
ipcMain.on('toolbar-drag-end', () => {
  dragStart = null;
});

/* ---------- app ---------- */

function createTray() {
  const img = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
  tray = new Tray(img);
  tray.setToolTip(T.tip);
  tray.on('click', toggle);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: `${T.toggle}  (Ctrl+Shift+P)`, click: toggle },
      { type: 'separator' },
      { label: T.quit, click: () => app.quit() }
    ])
  );
}

app.whenReady().then(() => {
  buildWindows();
  createTray();

  const ok = globalShortcut.register(HOTKEY, onHotkey);
  console.log(`[web-pen-red] hotkey ${HOTKEY} registered: ${ok}`);
  if (!ok && tray && typeof tray.displayBalloon === 'function') {
    tray.displayBalloon({ title: 'Web Pen - Red', content: T.hotkeyFail });
  }

  screen.on('display-added', scheduleRebuild);
  screen.on('display-removed', scheduleRebuild);
  screen.on('display-metrics-changed', scheduleRebuild);

  // Launching it opens the pen right away, like clicking the extension icon.
  showAll();
});

// Stay alive in the tray when every window is hidden.
app.on('window-all-closed', () => {});
app.on('will-quit', () => globalShortcut.unregisterAll());
