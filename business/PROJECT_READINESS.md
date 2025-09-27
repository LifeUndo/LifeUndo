# **PROJECT_READINESS — Техническое задание**

## 1. Vercel ENV + Deploy

* В `Vercel → Project → Settings → Environment Variables` прописать:

  ```env
  NEXT_PUBLIC_SITE_URL = https://www.getlifeundo.com
  FK_MERCHANT_ID       = <из FreeKassa>
  FK_SECRET1           = <из FreeKassa>
  FK_SECRET2           = <из FreeKassa>
  ADMIN_TOKEN          = <сильный токен>
  EMAIL_RELAY_USER     = <опционально>
  EMAIL_RELAY_PASS     = <опционально>
  SENTRY_DSN           = <опционально>
  LOGTAIL_TOKEN        = <опционально>
  DATABASE_URL         = <новая строка для app_user>
  ```
* После ввода переменных → **Redeploy** с выключенным Build Cache.

---

## 2. FreeKassa Integration

* В личном кабинете FK указать:

  * Result (webhook): `https://www.getlifeundo.com/api/fk/notify`
  * Success URL: `https://www.getlifeundo.com/success`
  * Fail URL: `https://www.getlifeundo.com/fail`
* Проверить сигнатуры (`FK_SECRET1/2`) и идемпотентность.
* Выполнить тестовую и боевую оплату.

---

## 3. База данных (Neon)

* Создать роль `app_user`:

  ```sql
  CREATE ROLE app_user LOGIN PASSWORD '<STRONG_PASSWORD>';
  GRANT CONNECT ON DATABASE neondb TO app_user;
  GRANT USAGE ON SCHEMA public TO app_user;
  GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO app_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO app_user;
  ```
* Включить PITR.
* Обновить `DATABASE_URL` в Vercel на `app_user`.

---

## 4. Сайт (getlifeundo.com)

* Создать страницы:

  * `/support/index.html` (RU/EN) — основной CTA на `t.me/LifeUndoSupport`.
  * `/pricing/index.html` (RU/EN) — тарифы Free/Pro/VIP/Team, кнопки FK.
  * `/success.html` и `/fail.html` — подтверждение/ошибка оплаты.
* В футере:

  * Добавить соцсети: vc.ru, Habr, TenChat, YouTube, Reddit, X (Twitter), Telegram, Dzen, VK.
  * Поставить бейдж FreeKassa.
  * Добавить ссылку Support.
* Pricing:

  * RU: Free · Pro 149 ₽/мес или 1490 ₽/год · VIP 2490 ₽ lifetime · Team от 150 ₽/место/мес.
  * EN: Free · Pro $3.99/mo или $29/yr · VIP $49 lifetime · Team от $2.5/seat/mo.

---

## 5. Расширение (0.3.7.11)

* В `popup.js`: кнопка **Pro** → `/pricing` (RU) или `/en/pricing` (EN).
* «What's new» и футер локализовать RU/EN.
* Сборка XPI:

  * В корне `manifest.json`, пути POSIX `/`.
  * Release notes:

    * RU: «Активировать VIP» → встроенная страница «Лицензия», фиксы RU/EN, UI стабильнее.
    * EN: "Activate VIP" → License page, RU/EN toggle fixed, UI polish.
* Загрузить в AMO как 0.3.7.11.

---

## 6. Соцсети

* Зарезервировать @GetLifeUndo (Telegram, VK, Dzen, Reddit, X, YouTube).
* Подготовить 5 стартовых постов: кейсы «вернуть текст», короткие клипы (10–20 сек).
* Запустить RU-блок (Telegram/VK/Dzen), глобальный блок (Reddit/X/YouTube).

---

## 7. Фонд

* Страница `/fund` RU/EN: пояснение «10% net revenue → GetLifeUndo Fund».
* Бейдж «We give 10%» в футере сайта и в попапе расширения.

---

## 8. Smoke Tests

* Проверить:

  ```powershell
  curl -I https://getlifeundo.com        # → 307 redirect → www
  curl -I https://www.getlifeundo.com/   # → 200
  curl -I https://www.getlifeundo.com/ok # → 200
  curl -I https://www.getlifeundo.com/admin # → 401
  curl -I https://www.getlifeundo.com/api/fk/notify # → 405 (GET)
  ```
* Проверить `/fund`, `/pricing`, `/faq`, `/contacts`, `/docs` → 200.

---

## 9. Готовый список коммитов

* `feat: add support/pricing/success/fail pages (RU/EN)`
* `feat: update footer with socials + FK badge`
* `feat: add fund page with 10% badge`
* `fix: popup.js Pro button links /pricing (RU) /en/pricing (EN)`
* `chore: add app_user role + DATABASE_URL update`
* `release: LifeUndo 0.3.7.11 Firefox (AMO)`

---

👉 Этот файл положить в `business/PROJECT_READINESS.md`.
Cursor применяет по порядку: ENV → Сайт → Расширение → Соцсети → Smoke test.