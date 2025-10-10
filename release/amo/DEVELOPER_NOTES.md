# Developer Notes for AMO Review

## Extension Overview
GetLifeUndo is a privacy-first browser extension that provides "undo" functionality for online activities. It saves form text, clipboard history, and recently closed tabs locally on the user's device.

## Technical Implementation

### Manifest Analysis
- **Manifest Version**: 2 (Firefox compatible)
- **Permissions**: 
  - `storage` - for local data persistence
  - `tabs` - for tab management and recently closed tabs
  - `sessions` - for accessing browser session history
  - `clipboardRead` - for clipboard content tracking
- **Content Scripts**: Single script injected on all URLs
- **Icons**: 16px, 32px, 48px, 128px PNG files included

### Privacy & Security
- **No Remote Requests**: Extension never makes external API calls
- **Local Storage Only**: All data stored in browser's local storage
- **Password Protection**: Automatically excludes password and hidden input fields
- **No Telemetry**: No usage statistics or analytics collection
- **No Cloud Sync**: Data never leaves user's device

### Code Review Points
1. **Content Script** (`contentScript.js`):
   - Uses standard DOM event listeners (input, change, copy)
   - Filters out password fields using `isPwd()` function
   - Stores data locally using `browser.storage.local`
   - No eval() or innerHTML usage

2. **Popup Script** (`popup.js`):
   - Reads data from local storage
   - Uses `document.createElement()` for safe DOM manipulation
   - No innerHTML or eval() usage
   - Proper error handling for sessions API

3. **Background Script** (`background.js`):
   - Minimal implementation
   - No persistent background processes
   - No external network requests

## Testing Instructions

### Manual Testing
1. Install extension temporarily via `about:debugging`
2. Navigate to any website with forms (e.g., Google, GitHub)
3. Type text in form fields
4. Copy some text (Ctrl+C)
5. Close a tab
6. Open extension popup - verify all three sections show data

### Security Testing
1. Verify password fields are not saved
2. Check that no external requests are made
3. Confirm data stays in local storage only
4. Test on various websites (social media, banking, etc.)

## Compliance Notes

### AMO Policies
- ✅ No malicious code or obfuscation
- ✅ No excessive permissions requested
- ✅ Privacy policy provided
- ✅ Clear description of functionality
- ✅ No misleading claims
- ✅ No external dependencies

### Data Handling
- ✅ No personal data collection
- ✅ No third-party data sharing
- ✅ Local storage only
- ✅ User controls all data

## Version History
- **0.3.7.18**: Fixed icon paths, improved Firefox compatibility
- **0.3.7.17**: Initial AMO submission
- Previous versions: Internal development

## Contact Information
- **Developer**: GetLifeUndo Team
- **Website**: https://getlifeundo.com
- **Support**: https://getlifeundo.com/en/support
- **Privacy**: https://getlifeundo.com/en/privacy

## Additional Notes
This extension is designed to be a simple, privacy-focused utility. It does not collect any user data, make external requests, or perform any actions beyond local data storage and retrieval. The code is straightforward and can be easily reviewed for security compliance.



