# AMO Release Notes 0.3.7.12

## English

```
0.3.7.12
- Stability: fixed rare race-condition with long forms autosave
- Clipboard: better handling of quick consecutive copies
- Licenses: .lifelic auto-apply without popup reload
- Localization: improved RU/EN labels, PRO button opens locale pricing
- Privacy: still 100% local, no telemetry
```

## Русский

```
0.3.7.12
— Стабильность: фикс редкой гонки при автосейве длинных форм
— Буфер: корректная обработка быстрых копий подряд
— Лицензии: .lifelic применяются без перезапуска поп-апа
— Локализация: улучшены RU/EN подписи, кнопка PRO ведёт на /ru|/en/pricing
— Приватность: 100% локально, без телеметрии
```

## Review Notes (for moderators)

```
App scope:
- Keeps local history of typed text, clipboard snippets, and recently closed tabs.
- No network requests, no remote storage, no telemetry.
- Permissions are limited to storage/tabs/clipboard, used only on user action.

Testing:
- Open any form, type text, reload -> "Restore" button brings text back.
- Copy a few snippets -> see local clipboard list in the popup.
- Close a tab -> restore from the "recently closed" list.
```
