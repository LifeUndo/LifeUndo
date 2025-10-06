# AMO Release Notes для 0.3.7.16

## Release Notes (для пользователей):

```
0.3.7.16 — Firefox Hotfix v3

• Fixed: Popup UI & i18n (EN/RU), safe DOM (no innerHTML).
• New: Free features enabled in Firefox (no paywall).
• New: Recent inputs / tabs / clipboard lists.
• Tech: Content script for inputs; local storage only; no telemetry.
```

## Notes for reviewers:

```
- Firefox Manifest V2; default_locale present; icons 16/32/48/128.
- Popup avoids innerHTML/eval; uses createElement/textContent only.
- Content script listens to input/change, skips password fields; stores locally via browser.storage.local.
- No telemetry; no remote calls inside the add-on.
```

## Краткое описание (Summary):

```
GetLifeUndo - Ctrl+Z for online life. Restore form text, closed tabs, clipboard history. 100% local, private, no telemetry. Free features enabled in Firefox.
```

## Полное описание (Description):

```
GetLifeUndo brings "Ctrl+Z" functionality to your online life. Never lose your work again!

WHAT IT DOES:
• Automatically saves form text as you type
• Restores accidentally closed tabs and sessions  
• Keeps clipboard history for quick access
• Works on all websites and forms

KEY FEATURES:
• 100% local storage - no cloud, no telemetry
• Password fields are never saved for security
• Works with all major websites
• Lightweight and fast
• Available in Russian and English

PRIVACY FIRST:
• All data stays on your device
• No external servers or tracking
• Open source core components
• No data collection or analytics

PERFECT FOR:
• Long form writing (emails, posts, comments)
• Research and browsing sessions
• Copy-paste workflows
• Accident prevention

Free features are enabled in Firefox. No paywall, no restrictions.

Compatible with Firefox 109+.
```
