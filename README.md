# Web Pen - Red (Desktop)

[日本語](README.ja.md) | **English**

Draw on your **whole Windows screen** with a red pen: a replay, a game, slides, a video call. The same tiny toolbar as the [Chrome extension](https://github.com/nolozy/web-pen-red) (**132 × 36 px**), on top of every display.

Four buttons only: **Pen / Cursor / Clear all / Close**. No color picker UI: switch colors with one key while the pen is on, **R / Y / G / B / W** (red, yellow, green, blue, white).

## ⬇ Download

### 👉 [**Download for Windows (installer)**](https://github.com/nolozy/web-pen-red-desktop/releases/latest/download/Web-Pen-Red-Setup.exe)

About 116 MB. Windows only.

1. Click the link above and save the file.
2. Double-click it and follow the installer. It installs for your user account, no administrator rights needed. The first time, Windows may say it "protected your PC" because the app is not code-signed: click **More info → Run anyway**.
3. Open **Web Pen - Red** from the Start menu. The pen opens at once. **Ctrl + Shift + P** shows / hides it.
4. Handy: right-click **Web Pen - Red** in the Start menu → **Pin to taskbar**. Click that icon to show / hide the pen.

To remove it: Settings → Apps → **Web Pen - Red** → Uninstall. [All releases](https://github.com/nolozy/web-pen-red-desktop/releases)

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
| **Tab** | Pen ⇄ Cursor. Works in both modes (see below) |
| **R / Y / G / B / W** | Red `#FF0000` / Yellow `#FFD500` / Green `#00C853` / Blue `#2979FF` / White `#FFFFFF` |
| **Right-click** | Clear everything on every display instantly (no confirmation) |
| **Ctrl + Shift + P** | See the table above |

- **Tab** works in both modes. In pen mode it switches to Cursor when you release the key, so nothing leaks to the app underneath (for example the replay's scoreboard). In Cursor mode, while the pen is visible, this app takes Tab so it can bring the pen back: the app underneath does **not** receive that Tab. Hide the pen (**Ctrl + Shift + P** in pen mode, or ✕) to use Tab in that app as usual.
- **R / Y / G / B / W** and **right-click** only work in pen mode, so they never get in the way of other apps. You can also draw again with **Ctrl + Shift + P** or the toolbar's pen button.
- Changing the color does not recolor lines you already drew.
- White is for dark scenes. It is invisible on white.

## Install

### Download (no build needed)

See **⬇ Download** at the top: the [installer](https://github.com/nolozy/web-pen-red-desktop/releases/latest/download/Web-Pen-Red-Setup.exe). The [Releases](https://github.com/nolozy/web-pen-red-desktop/releases) page also lists a SHA-256 checksum so you can check the file. Windows may show a SmartScreen warning because the app is not code-signed: choose **More info → Run anyway**.

### Build it yourself

```bash
git clone https://github.com/nolozy/web-pen-red-desktop.git
cd web-pen-red-desktop
npm install
npm start          # run it
npm run dist       # build the installer into dist/
```

Requires Node.js. Built with Electron, plain HTML / CSS / JavaScript, no frameworks.

## Good to know

- **Games and replays** (for example the League of Legends replay client): set the game to **Borderless** or **Windowed**. In true (exclusive) fullscreen, Windows does not draw other windows on top. The app only puts its own window on top of the screen and does not touch the game. Check the rules of the game you use it with.
- **Screen sharing**: if you share your **entire screen**, viewers see your lines. If you share a single **window**, they do not, because the lines are in a separate window above it.
- **Ctrl + Shift + P** is also used by some apps (the command palette in VS Code, private windows in Firefox / Edge). While this app runs, the shortcut goes to the pen. If another app already uses it, this app shows a notice and you can still use the notification-area icon.
- Lines belong to the display they were drawn on. If you plug or unplug a display, the lines are cleared.
- The pen stays on top of a game or replay that takes focus (including after you switch to Cursor mode). It only goes away when you press **Ctrl + Shift + P** in pen mode, click ✕, or use the notification-area icon.
- Windows only, for now.

## Using it with VALORANT and League of Legends

1. **Set the display mode to Windowed or Windowed Fullscreen (borderless).**
   - VALORANT: Display Mode = *Windowed Fullscreen* or *Windowed*.
   - League of Legends: Window Mode = *Borderless* or *Windowed*.
   - In *Fullscreen*, Windows does not draw other windows on top of the game, so the pen does not show.
2. **Use it for replays, VODs and spectating, not for live matches.** In pen mode this app takes the mouse and the keyboard, so you cannot play. It opens in pen mode the moment you launch it: start it before a match or after you finish.
3. **Tab.**
   - In pen mode, Tab switches to Cursor mode when you release it. It does not reach the game, so the scoreboard does not open.
   - In Cursor mode, while the pen is visible, this app takes Tab so it can bring the pen back. **The game's scoreboard cannot be opened during that time.** To use the scoreboard, hide the pen: **Ctrl + Shift + P** in pen mode, or ✕.
4. **Showing and hiding.** **Ctrl + Shift + P**: hidden → shown (pen) · Cursor mode → back to pen · pen mode → hidden. The pen stays on top even when the game takes focus; it only goes away when you do one of these (or ✕, or the notification-area icon).
5. **Screen sharing (Discord and others): share your entire screen.** If you share only a window or the game, viewers do not see your lines, because they are drawn in a separate window above it.
6. **Multiple displays.** The overlay covers every display. Lines belong to the display they were drawn on, and plugging or unplugging a display clears them.
7. **Anti-cheat and rules.** This app does not read or change the game: it only puts its own window on top of the screen. How a game's anti-cheat (for example Riot Vanguard) treats an app like this is not something we can guarantee. Use it at your own responsibility and check the game's rules if in doubt.
8. **First launch.** The app is not code-signed, so Windows SmartScreen may warn you: choose **More info → Run anyway**.

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
