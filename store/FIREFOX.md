# AMO — Listing

- Summary:
  Undo текста, закрытых вкладок и буфера обмена. Восстановление в один клик.

## Description
LifeUndo восстанавливает текст, недавно закрытые вкладки и скопированные фрагменты. История хранится локально в `browser.storage.local`.

- Текст: 20 состояний ввода (input/textarea/contentEditable)
- Вкладки: 10 недавно закрытых
- Буфер обмена: 10 элементов
- Popup с кнопкой «Undo Last Action»

## Permissions rationale
Требуются только доступ к вкладкам и локальному хранилищу для работы описанного функционала.

## Screenshots
См. `store/screenshots`.
