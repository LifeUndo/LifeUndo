# LifeUndo v0.2.0 Release Notes

## 🚀 New Features

### Pro Version & Trial
- **7-day free trial** - Try all Pro features without commitment
- **Pro limits**: 200 text states, 50 tabs, 50 clipboard items (vs 20/10/10 in Free)
- **License activation** - Simple offline license key validation (LU- prefix, 16+ chars)
- **Trial management** - Automatic trial expiration handling

### Statistics & Analytics
- **Local statistics tracking** - No network requests, all data stays on device
- **Usage metrics**: popup opens, undo actions, tab restores, clipboard restores
- **Export functionality** - Download all data as JSON for backup/migration
- **Reset statistics** - Clear usage data with confirmation

### Enhanced UI
- **Pro badges** - Visual indicators for Pro features in popup
- **Upgrade section** - Prominent upgrade call-to-action in popup
- **Options page** - Dedicated settings page for license management and statistics
- **Tier indicators** - Clear status display (Free/Trial/Pro)

### Website Updates
- **Pro section** - Comprehensive feature comparison and pricing
- **Firefox install button** - Direct link to AMO store
- **FAQ section** - Common questions about privacy and usage
- **Pricing tiers** - Individual ($3.99/mo), Team ($10/mo), Enterprise (custom)

## 🔧 Technical Improvements

### Architecture
- **Modular constants** - Centralized configuration for links and limits
- **Dynamic limits** - Runtime feature limit calculation based on license status
- **Statistics system** - Comprehensive local analytics without telemetry
- **Export/Import** - JSON-based data portability

### Browser Support
- **Chrome Manifest V3** - Full compatibility with latest Chrome standards
- **Firefox Manifest V2** - Optimized for Firefox add-on ecosystem
- **Cross-browser consistency** - Identical functionality across platforms

## 🛡️ Privacy & Security

- **Zero telemetry** - No network requests, no data collection
- **Local-only storage** - All data remains on user's device
- **Offline license validation** - No server communication required
- **Data export** - Full user control over their data

## 📦 Installation

### Firefox
1. Visit [AMO Store](https://addons.mozilla.org/en-US/firefox/addon/lifeundo/)
2. Click "Add to Firefox"
3. Pin the extension and start using

### Chrome (Manual)
1. Download `LifeUndo_Chrome.zip` from releases
2. Extract to a folder
3. Open `chrome://extensions/` → Enable Developer mode
4. Click "Load unpacked" → Select the folder

## 🔄 Migration from v0.1.0

- **Automatic upgrade** - Existing data preserved
- **Statistics initialization** - New analytics start tracking from upgrade
- **Trial activation** - 7-day trial automatically starts for existing users
- **No data loss** - All previous history maintained

## 🐛 Bug Fixes

- Improved tab restoration reliability
- Better clipboard handling across different sites
- Enhanced popup responsiveness
- Fixed edge cases in undo logic

## 📋 Known Issues

- License validation is currently demo-based (LU- prefix + 16+ chars)
- Import functionality planned for future release
- Some sites may have clipboard restrictions

## 🎯 What's Next (v0.3.0)

- Hotkey support (Ctrl+Z in popup)
- Full import functionality
- Enhanced form field tracking
- Onboarding tutorial
- Chrome Web Store submission

---

**Download**: [Firefox](https://addons.mozilla.org/en-US/firefox/addon/lifeundo/) | [Chrome (Manual)](https://github.com/LifeUndo/LifeUndo/releases)

**Website**: [lifeundo.ru](https://lifeundo.ru)

**Support**: [support@lifeundo.ru](mailto:support@lifeundo.ru) | [Telegram](https://t.me/LifeUndo)

