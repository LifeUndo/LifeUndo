# LifeUndo (MVP)

Undo last actions across the web: text input history, recently closed tabs, clipboard history.

## Install (Chrome)

1. Open chrome://extensions
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select this folder (the `extension` directory)
5. Pin the LifeUndo icon and click it

## Features

- Tracks text typed in inputs/textarea/contentEditable (stores last 20 states)
- Stores last 10 closed tabs and can reopen the latest
- Records clipboard history on copy (selection-based, last 10 items)
- Popup shows histories and a one-click "Undo Last Action"

## Notes

- Storage: chrome.storage.local
- No external dependencies
- Clipboard capture relies on selection text during copy (permissions-light approach)
- Firefox support would require Manifest V2 equivalent and minor API changes

## Structure

- manifest.json: MV3 manifest
- background.js: service worker; storage, messaging, undo logic
- contentScript.js: listens to input/copy, restores text
- popup.html/js: minimal UI

## Privacy

All data stays local in your browser. No network requests.
