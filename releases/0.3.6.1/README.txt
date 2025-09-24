LifeUndo 0.3.6.1
================

Chromium: chromium/ (for manual ZIP packaging)
Firefox: firefox/ (for manual XPI packaging)

Changes:
- Fixed "What's New" modal interaction issues
- Improved accessibility and event handling
- Better cross-browser compatibility

Manual packaging instructions:
1. For Chromium: ZIP all files from chromium/ folder
2. For Firefox: ZIP all files from firefox/ folder, rename to .xpi

Recommended: Use web-ext for Firefox XPI:
npx web-ext build --source-dir=firefox --artifacts-dir=. --overwrite-dest












