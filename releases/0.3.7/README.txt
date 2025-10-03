LifeUndo 0.3.7
================

Chromium: chromium/ (for manual ZIP packaging)
Firefox: firefox/ (for manual XPI packaging)

Major Features:
- One-click VIP activation from popup
- Unified license verification core
- Stable RU/EN switching
- Fixed popup size and modal interactions

Manual packaging instructions:
1. For Chromium: ZIP all files from chromium/ folder
2. For Firefox: ZIP all files from firefox/ folder, rename to .xpi

Recommended: Use web-ext for Firefox XPI:
npx web-ext build --source-dir=firefox --artifacts-dir=. --overwrite-dest

Changes from v0.3.6:
- Added shared/licenseCore.js module
- Unified popup and options license handling
- Improved modal behavior and accessibility
- Enhanced UTF-8 support and localization






























