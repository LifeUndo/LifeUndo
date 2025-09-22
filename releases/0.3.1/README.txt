LifeUndo v0.3.1 Release

Files:
- LifeUndo-0.3.1-firefox.xpi (Firefox extension)
- LifeUndo-0.3.1-chromium.zip (Chrome/Edge extension)

Changes in v0.3.1:
- Fixed VIP import: handlers bound after DOMContentLoaded (no more silence)
- Inline license verifier in popup.js (no dynamic imports)
- Clear feedback: Importing / VIP activated / error messages
- Plan label updates: "Free Version" → "VIP" after activation
- Full localization including "What's New" modal
- Upgrade to Pro stub modal
- Support links; Trial/PRO badges hidden on VIP

Installation:
1. Firefox: Load the .xpi file as temporary add-on in about:debugging
2. Chrome: Load the .zip file as unpacked extension in chrome://extensions

VIP License Import:
- Click "Activate VIP" button
- Select your .lifelic file
- Should show "Importing..." then "VIP activated ✅" status
- Plan label changes from "Free Version" to "VIP"
- PRO badges disappear, "Activate VIP" becomes "VIP active" (disabled)

Technical Fix:
- Removed type="module" from script tags
- Moved script to end of HTML (before </body>)
- All event handlers bound after DOMContentLoaded
- Inline verifier functions (no external imports)
- Proper error handling with visible status messages
