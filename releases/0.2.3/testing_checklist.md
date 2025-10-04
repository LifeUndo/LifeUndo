# LifeUndo v0.2.3 — Testing Checklist

## Pre-Installation
- [ ] Download `LifeUndo-0.2.3-firefox.xpi` (Firefox) or `LifeUndo-0.2.3-chromium.zip` (Chrome/Edge)
- [ ] Verify file checksums match `checksums.txt`

## Installation
- [ ] **Firefox**: Install via `about:addons` → "Install Add-on From File"
- [ ] **Chrome/Edge**: Extract ZIP, load via `chrome://extensions` → "Load unpacked"

## License Import Testing

### 1. Basic Import Flow
- [ ] Open `about:addons` → **LifeUndo** → **Options**
- [ ] See minimal UI: "Import .lifelic" button + "Verify"/"Remove" links
- [ ] Click "Import .lifelic" → file dialog opens
- [ ] Select JSON .lifelic file → import happens automatically
- [ ] See green status: "License installed ✅ (plan: vip)"
- [ ] Click "Verify" → see "Signature valid ✅"

### 2. Armored Format Testing
- [ ] Try armored .lifelic file (-----BEGIN LIFEUNDO LICENSE-----)
- [ ] Import succeeds with green status
- [ ] Verify shows "Signature valid ✅"

### 3. Error Handling
- [ ] Try invalid file → see red error message
- [ ] Try without selecting file → see "No license found" error
- [ ] Try corrupted .lifelic → see specific error message

### 4. VIP Activation
- [ ] After successful import, open any website
- [ ] Open LifeUndo popup → see VIP badge
- [ ] PRO badges should be hidden
- [ ] All features should be unlocked

### 5. Persistence
- [ ] Restart browser
- [ ] Open popup → VIP status should persist
- [ ] Go to options → should show "Found license" status

## UI Verification
- [ ] No large black containers or white stripes
- [ ] Clean, minimal interface
- [ ] Clear status messages (green/red/muted)
- [ ] Responsive button interactions

## Cross-Browser Testing
- [ ] **Firefox**: All features work correctly
- [ ] **Chrome**: All features work correctly
- [ ] **Edge**: All features work correctly

## Performance
- [ ] Import completes quickly (< 2 seconds)
- [ ] UI updates instantly after import
- [ ] No browser slowdown or freezing

## Edge Cases
- [ ] Try importing same license twice
- [ ] Try "Remove" → should clear license
- [ ] Try importing after removal
- [ ] Try with very large .lifelic file

## Expected Results
✅ **Success**: Green status messages, VIP activation, clean UI
❌ **Failure**: Red error messages, no VIP features, confusing UI

## Screenshots to Take
1. Options page with minimal UI
2. Successful import status (green)
3. VIP popup (no PRO badges)
4. Error message (if any)
5. Verify status (green)

## Notes
- If signature verification fails, check `LICENSE_PUB_KEY_JWK` in `verifyLicense.js`
- If UI doesn't update, try refreshing the options page (F5)
- If VIP doesn't activate, check browser console for errors





































