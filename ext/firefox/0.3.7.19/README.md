# LifeUndo v0.2.0 (Firefox)

Firefox version of LifeUndo - Undo last actions across the web. Now with Pro features and 7-day trial!

## Install (Firefox)

1. Download from [AMO Store](https://addons.mozilla.org/en-US/firefox/addon/lifeundo/)
2. Click "Add to Firefox"
3. Pin the extension and start using

### Manual Install (Development)

1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on..."
3. Select `manifest.json` in this folder

## Features

### Free Version
- Tracks text typed in inputs/textarea/contentEditable (stores last 20 states)
- Stores last 10 closed tabs and can reopen the latest
- Records clipboard history on copy (selection-based, last 10 items)
- Popup shows histories and a one-click "Undo Last Action"

### Pro Version (7-day trial included)
- **10x more storage**: 200 text states, 50 tabs, 50 clipboard items
- **Statistics tracking**: Local analytics without network requests
- **Data export**: Download all data as JSON for backup/migration
- **Options page**: License management and statistics dashboard
- **Pro UI**: Visual indicators and upgrade prompts

## New in v0.2.0

- **Pro subscription model** with 7-day free trial
- **Local statistics** - track usage without telemetry
- **License activation** - simple offline key validation
- **Data export/import** - full data portability
- **Enhanced UI** - Pro badges and upgrade sections
- **Options page** - dedicated settings and statistics

## Differences from Chrome

- Uses Manifest V2 (required for Firefox)
- Background script instead of service worker
- Same functionality, different implementation
- Identical Pro features and UI

## Privacy

All data stays local in your browser. No network requests, no telemetry. Pro features work entirely offline.