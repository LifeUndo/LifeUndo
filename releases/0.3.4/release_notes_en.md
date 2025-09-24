# LifeUndo v0.3.4 - VIP UX Final

## 🎯 What's New

### VIP User Experience Improvements
- **Proper VIP button states**: When VIP license is active, the "Activate VIP" button becomes "VIP Active" and is disabled
- **Live UI updates**: Interface updates instantly when license status changes (no restart needed)
- **Smart badge management**: PRO badges are hidden when VIP license is active
- **Clean interface**: "Upgrade to Pro" button is hidden for VIP users

### Navigation & Links
- **Renamed Settings to License**: More intuitive link name for license management
- **Fixed footer links**: All footer links now open correctly in new tabs
- **Updated URLs**: Website and Privacy links point to correct domains

### Localization
- **Complete RU/EN support**: All new UI elements are fully localized
- **Updated "What's New"**: Version 0.3.4 changelog in both languages

## 🔧 Technical Details

- **Chrome**: Manifest V3 compatible
- **Firefox**: Manifest V2 compatible  
- **Storage**: Live storage change detection for instant UI updates
- **Crypto**: No changes to license verification (ECDSA P-256 / SHA-256)

## 🚀 Installation

### Chrome/Chromium
1. Download `LifeUndo-0.3.4-chromium.zip`
2. Extract and load as unpacked extension in Developer Mode
3. Or install from Chrome Web Store (when available)

### Firefox
1. Download `LifeUndo-0.3.4-firefox.xpi`
2. Install directly in Firefox
3. Or install from Firefox Add-ons (when available)

## 📝 Testing Checklist

- [ ] VIP license activation shows "VIP Active" button (disabled)
- [ ] PRO badges disappear when VIP is active
- [ ] Language switching (RU/EN) works correctly
- [ ] Footer links open in new tabs
- [ ] License page opens from "License" link
- [ ] UI updates live when license is imported/removed

## 🐛 Bug Fixes

- Fixed VIP button not updating after license activation
- Fixed footer links not opening correctly
- Fixed PRO badges showing for VIP users
- Improved error handling and user feedback

---

**Version**: 0.3.4  
**Release Date**: December 2024  
**Compatibility**: Chrome 88+, Firefox 78+














