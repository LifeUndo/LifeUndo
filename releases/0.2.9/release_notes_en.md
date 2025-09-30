# LifeUndo v0.2.9 — Rock-solid VIP & Full i18n

## What's New
- **Inline license verifier in popup** - No dynamic imports, everything in one file
- **Clear feedback** - Importing / VIP activated / error (with reason)
- **Full localization incl. "What's New"** - Complete RU/EN switching for all UI elements
- **Upgrade to Pro stub** - Modal with pricing link instead of dead button
- **Support links** - Direct Telegram access; Trial/PRO hidden on VIP

## Bug Fixes
- Fixed VIP import silent failures - now shows clear success/error messages
- Fixed dynamic import issues in Firefox popup
- Fixed "What's New" modal not being localized
- Fixed dead "Upgrade to Pro" button

## Technical
- Moved all license verification logic inline to popup.js
- Enhanced ECDSA signature verification (DER/RAW format support)
- Built-in public key as fallback
- Better error handling and user feedback

























