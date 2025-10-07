# LifeUndo 0.3.7.26 - БЫСТРЫЕ ИНСТРУКЦИИ ДЛЯ СКРИНШОТОВ

## СМОК-ТЕСТ (5 минут):

### 1. Язык EN/RU
- Открыть popup → переключить EN → весь UI на EN (без русских хвостов)
- Перезапустить popup → язык сохранён (persist)
- Низовые ссылки ведут на `/en/...`. Вернуть RU — всё зеркально

### 2. Protected TIP + CTA
- На `about:addons` виден TIP (локализован)
- В TIP есть кнопка **Take a screenshot / Сделать скрин**

### 3. Capture текста
- На обычном сайте набрать 3–4 фразы в `<input>`/`<textarea>` и в `contenteditable`
- В «Последние вводы» нет значений с `C:\fakepath\…`
- Лимитируется до 50, дебаунс ощущается (нет дублирования на быстрых наборах)

### 4. Quick Snap
- Нажать кнопку **Take screenshot** и хоткей **Ctrl/Cmd+Shift+U**
- Появляются миниатюры в **Screenshots** (≤10), по клику открываются

### 5. Recently Closed
- Открыть 2 вкладки, закрыть → в списке корректные названия/дата, **без** `undefined • Invalid Date`
- `about:*`/`chrome:*` показаны как неактивные

## НУЖНЫЕ СКРИНШОТЫ (10 шт.):

1. `popup_ru_full.png` - русский интерфейс
2. `popup_en_full.png` - английский интерфейс
3. `trial_day6.png` - баннер "скоро закончится"
4. `trial_expired.png` - баннер "истёк"
5. `recent_inputs_ok.png` - захват текста работает
6. `links_localized.png` - локализованные ссылки
7. `recently_closed_ok.png` - без undefined/Invalid Date
8. `screenshot_taken.png` - миниатюра скриншота
9. `amo_lint_ok.png` - web-ext lint без ошибок
10. `amo_upload_ok.png` - AMO валидация успешна

## КОМАНДЫ ДЛЯ СКРИНШОТОВ:

### Trial баннеры:
```javascript
// День 6
browser.storage.local.set({ trial_startTs: Date.now() - 6 * 86400000 });
location.reload();

// День 7+
browser.storage.local.set({ trial_startTs: Date.now() - 8 * 86400000 });
location.reload();
```

### Lint проверка:
```bash
cd ext/firefox/0.3.7.26
npx web-ext lint
```

## ГОТОВ К ЗАГРУЗКЕ В AMO! 🚀
