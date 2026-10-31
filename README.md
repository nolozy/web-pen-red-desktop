# Web Pen - Red (Desktop)

[日本語](README.ja.md) | **English**

Draw on your **whole Windows screen** with a red pen: a replay, a game, slides, a video call. The same tiny toolbar as the [Chrome extension](https://github.com/nolozy/web-pen-red) (**132 × 36 px**), on top of every display.

Four buttons only: **Pen / Cursor / Clear all / Close**. No color picker UI: switch colors with one key while the pen is on, **R / Y / G / B / W** (red, yellow, green, blue, white).

## How it works

- A transparent, always-on-top overlay covers **every display**. It only exists while you draw.
- **Pen mode**: the overlay takes the mouse and the keyboard, so you can draw.
- **Cursor mode**: the overlay is completely click-through. Your lines stay, and the app underneath (a replay, a game, a browser) works as usual and gets the keyboard back.
- The toolbar never takes keyboard focus away from the app underneath.

## Start it

| How | What happens |
| --- | --- |
| Launch the app, or click its icon in the taskbar / notification area | The pen opens at once (pen mode, red) |
| **Ctrl + Shift + P** | Hidden → show (pen) · Cursor mode → back to pen · Pen mode → hide |
| Launch it again (pinned taskbar icon) | Same as Ctrl + Shift + P, no second copy is started |

Pin the app to the taskbar to start it with one click. Right-click the notification-area icon to quit.

## Features

| Button | What it does |
| --- | --- |
| ✏️ Pen | Pen mode on. Drag to draw (red by default) |
| ➤ Cursor | Pen mode off. Everything passes through, your lines stay |
| 🗑 Clear all | Removes every line on every display |
| ✕ Close | Clears all lines and hides the overlay (the app keeps running in the notification area) |

Drag the toolbar anywhere (dragging from a button is safe).

### Shortcuts (pen mode)

| Key | Action |
| --- | --- |
| **Tab** | Pen ⇄ Cursor (it switches when you release the key, so nothing leaks to the app underneath, such as the replay's scoreboard) |
| **R / Y / G / B / W** | Red `#FF0000` / Yellow `#FFD500` / Green `#00C853` / Blue `#2979FF` / White `#FFFFFF` |
| **Right-click** | Clear everything on every display instantly (no confirmation) |
| **Ctrl + Shift + P** | See the table above |

- These keys only work in pen mode, so they never get in the way of other apps. In cursor mode, use **Ctrl + Shift + P** or the toolbar's pen button to draw again.
- Changing the color does not recolor lines you already drew.
- White is for dark scenes. It is invisible on white.

## Install

### Download (no build needed)

Get `Web Pen - Red 1.0.0.exe` (portable, double-click) or `Web Pen - Red Setup 1.0.0.exe` (installer) from the [Releases](https://github.com/nolozy/web-pen-red-desktop/releases) page when one is published. Windows may show a SmartScreen warning because the app is not code-signed: choose **More info → Run anyway**.

### Build it yourself

```bash
git clone https://github.com/nolozy/web-pen-red-desktop.git
cd web-pen-red-desktop
npm install
npm start          # run it
npm run dist       # build the installer and the portable exe into dist/
```

Requires Node.js. Built with Electron, plain HTML / CSS / JavaScript, no frameworks.

## Good to know

- **Games and replays** (for example the League of Legends replay client): set the game to **Borderless** or **Windowed**. In true (exclusive) fullscreen, Windows does not draw other windows on top. The app only puts its own window on top of the screen and does not touch the game. Check the rules of the game you use it with.
- **Screen sharing**: if you share your **entire screen**, viewers see your lines. If you share a single **window**, they do not, because the lines are in a separate window above it.
- **Ctrl + Shift + P** is also used by some apps (the command palette in VS Code, private windows in Firefox / Edge). While this app runs, the shortcut goes to the pen. If another app already uses it, this app shows a notice and you can still use the notification-area icon.
- Lines belong to the display they were drawn on. If you plug or unplug a display, the lines are cleared.
- Windows only, for now.

## Files

```
main.js              Electron main: overlays (one per display), toolbar, tray, shortcut, modes
preload-overlay.js   Bridge for the overlay windows
preload-toolbar.js   Bridge for the toolbar window
renderer/            overlay (canvas), toolbar (132x36px, same design as the extension)
assets/              icons (app, tray)
```

## Scope

Deliberately minimal, like the extension: pen, cursor, clear all, close, and five colors on the keyboard. No line width, shapes, saving or sharing.

MIT License
