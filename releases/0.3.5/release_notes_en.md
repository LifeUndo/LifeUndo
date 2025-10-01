# LifeUndo v0.3.5 - License Import Fix

## 🎯 What's New

### License Import & Management
- **Fixed import buttons**: Proper workflow with "Choose .lifelic" → "Import" buttons
- **Live VIP UI updates**: Interface updates instantly when license status changes
- **Better error handling**: Clear feedback for JSON and Armored .lifelic files
- **Improved verification**: "Signature valid ✅" / "Signature invalid ❌" messages

### Localization & UX
- **Complete RU/EN support**: All new buttons and messages are localized
- **Mini-instructions**: Added helpful hints in Settings page
- **Better status messages**: Clear success/error feedback in both languages

### Technical Improvements
- **Storage integration**: Uses `lu_plan` field for live UI updates
- **Cross-platform**: Works identically in Chrome and Firefox
- **Error recovery**: Better handling of malformed license files

## 🔧 Technical Details

- **Chrome**: Manifest V3 compatible
- **Firefox**: Manifest V2 compatible  
- **Storage**: Live `lu_plan` change detection for instant UI updates
- **Crypto**: ES256 signature verification with RAW/DER support
- **File formats**: Supports both JSON and Armored .lifelic files

## 🚀 Installation

### Chrome/Chromium
1. Download `LifeUndo-0.3.5-chromium.zip`
2. Extract and load as unpacked extension in Developer Mode
3. Or install from Chrome Web Store (when available)

### Firefox
1. Download `LifeUndo-0.3.5-firefox.xpi`
2. Install directly in Firefox
3. Or install from Firefox Add-ons (when available)

## 📝 Testing Checklist

- [ ] JSON .lifelic → green status, VIP in popup
- [ ] Armored .lifelic → same result
- [ ] Verify → "Signature valid ✅" / clear error
- [ ] Remove → "License removed", popup returns to Free
- [ ] RU/EN switching → all texts change
- [ ] Live UI updates when license changes

## 🐛 Bug Fixes

- Fixed license import button workflow
- Fixed live UI updates when license status changes
- Added missing RU/EN localization for all buttons
- Improved error handling and status messages
- Better integration between Options and Popup

---

**Version**: 0.3.5  
**Release Date**: December 2024  
**Compatibility**: Chrome 88+, Firefox 78+




























