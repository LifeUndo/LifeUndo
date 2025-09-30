# 🎯 ФИНАЛЬНЫЙ ЧЕК-ЛИСТ ПЕРЕД PROMOTE TO PRODUCTION

**Дата:** 30 сентября 2025  
**Ветка:** `hotfix/content-pass-01`  
**Коммит:** `107d5c2`  
**Rollback тег:** `prod-rollback-2025-09-30`

---

## 1️⃣ ТЕХНИЧЕСКАЯ ПРОВЕРКА (PowerShell)

Замените `<PREVIEW>` на ваш Preview URL из Vercel:

```powershell
$P="<PREVIEW>"

# Редиректы
curl.exe -I "$P/"                # Ожидаем: 307/308 → /ru
curl.exe -I "$P/ru"              # Ожидаем: 200
curl.exe -I "$P/ru/pricing"      # Ожидаем: 200
curl.exe -I "$P/ok"              # Ожидаем: 200 + Cache-Control: no-store, no-cache, must-revalidate
```

**Критерий принятия:**
- ✅ `/` редиректит на `/ru`
- ✅ `/ru` и `/ru/pricing` дают 200
- ✅ `/ok` имеет заголовки: `Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, `Expires: 0`

---

## 2️⃣ ВИЗУАЛЬНАЯ ПРОВЕРКА (Браузер на Preview)

### A) Хедер (на любой странице)
- [ ] Логотип `getlifeundo-round.png` виден (круглый, 28x28)
- [ ] Текст "**GetLifeUndo**" рядом с логотипом
- [ ] **НЕТ** языкового переключателя (ни RU/EN, ни других языков)
- [ ] Мобильное меню открывается с overlay

### B) Главная страница `/ru`
- [ ] Hero: заголовок "**GetLifeUndo** — Ctrl+Z для вашей жизни в сети"
- [ ] Секция "**Что такое Undo?**" с 3 блоками:
  - Что такое Undo?
  - Где это работает?
  - Зачем это нужно?
- [ ] Баннер **FreeKassa** внизу (с логотипом и кнопкой "Посмотреть тарифы")

### C) Футер (на любой странице)
- [ ] Логотип `getlifeundo-round.png` (круглый)
- [ ] Ссылки **Продукт** ведут на:
  - `/ru/features`
  - `/ru/pricing`
  - `/ru/download`
  - `/ru/use-cases`
- [ ] Ссылки **Компания** ведут на:
  - `/ru/fund`
  - `/ru/support`
  - `/ru/contacts`
  - `/ru/privacy`
  - `/ru/terms`
- [ ] Соцсети:
  - Telegram → `https://t.me/LifeUndoSupport`
  - X → `https://x.com/GetLifeUndo`
  - YouTube → `https://youtube.com/@GetLifeUndo`
  - GitHub → `https://github.com/LifeUndo`
- [ ] Копирайт: "© 2024 **GetLifeUndo**. Все права защищены."

### D) Страница `/ru/support`
- [ ] Контакты:
  - Telegram: **@LifeUndoSupport**
  - Email: **support@getlifeundo.com**

### E) Страница `/ru/contacts`
- [ ] Контакты:
  - Общие вопросы: **info@getlifeundo.com**
  - Техподдержка: **support@getlifeundo.com**
  - Быстрая связь: **t.me/LifeUndoRU**
  - Исходный код: **github.com/LifeUndo**
  - Видео: **youtube.com/@GetLifeUndo**

### F) Страница `/ru/privacy`
- [ ] В тексте используется "**GetLifeUndo**" (не LifeUndo)
- [ ] Контакты внизу:
  - Email: **privacy@getlifeundo.com**
  - Telegram: **t.me/LifeUndoRU**

### G) Страница `/ru/terms`
- [ ] В тексте используется "**GetLifeUndo**" (не LifeUndo)
- [ ] Контакты внизу:
  - Email: **legal@getlifeundo.com**
  - Telegram: **t.me/LifeUndoRU**

### H) Страница `/ru/download`
- [ ] Заголовок: "Скачать **GetLifeUndo**"
- [ ] Кнопка "Firefox (AMO) — скоро" - **disabled**
- [ ] Кнопка "Chrome Web Store — скоро" - **disabled**
- [ ] Блок "📋 Статус публикации" присутствует

### I) Другие страницы (выборочно)
- [ ] `/ru/features` - заголовок "Возможности **GetLifeUndo**"
- [ ] `/ru/use-cases` - текст "Как **GetLifeUndo** помогает" + "используют **GetLifeUndo**"
- [ ] `/ru/fund` - заголовок "Фонд **GetLifeUndo**"
- [ ] `/ru/pricing` - открывается без ошибок

---

## 3️⃣ PROMOTE TO PRODUCTION

**Только после проверки всех пунктов выше!**

1. В карточке Preview (коммит `107d5c2`) → **… → Promote to Production**
2. Дождитесь завершения деплоя (статус "Ready")
3. **… → Protect** новый Production деплой

---

## 4️⃣ ПРОВЕРКА PRODUCTION

После Promote выполните те же дымовые тесты на продакшене:

```powershell
# На production
curl.exe -I https://getlifeundo.com/
curl.exe -I https://getlifeundo.com/ru
curl.exe -I https://getlifeundo.com/ru/pricing
curl.exe -I https://getlifeundo.com/ok
```

**Критерий принятия:**
- ✅ Те же результаты, что и на Preview
- ✅ В браузере все страницы открываются
- ✅ Нет циклических редиректов

---

## 5️⃣ ROLLBACK (если что-то пойдет не так)

**Быстрый откат:**
1. Vercel → getlifeundo → Deployments
2. Найти предыдущий защищенный деплой (с меткой "Protected")
3. **… → Rollback**

**Или через GitHub:**
1. Checkout тега: `git checkout prod-rollback-2025-09-30`
2. Force push: `git push origin HEAD:main --force`

---

## 6️⃣ ПОСЛЕ УСПЕШНОГО РЕЛИЗА

### На завтра:
- [ ] Проверить **FreeKassa** статус (307 → 200)
- [ ] Включить живую кнопку оплаты на `/ru/pricing`

### Когда будет готово:
- [ ] Опубликовать расширение в **AMO**
- [ ] Заменить disabled кнопку на живую ссылку AMO
- [ ] Создать аккаунты **X** и **YouTube** (если еще нет)
- [ ] Настроить домены `.ru` → `.com/ru` в Vercel Domains

---

## ⚠️ КРАСНЫЕ ФЛАГИ (немедленный Rollback)

Если на Preview или Production видите:
- ❌ Циклический редирект (браузер показывает "too many redirects")
- ❌ Белый экран / 500 Server Error
- ❌ 404 на основных страницах (`/ru`, `/ru/pricing`)
- ❌ Двойные хедеры/футеры

---

**ГОТОВ К PROMOTE!** ✅  
Пришлите Preview URL для финальной проверки перед Promote.
