# fix(site): T+0 — 0.3.7.32, direct links, Footer, TG links, whats-new

Описание
- Синхронизированы версии до 0.3.7.32 (site + extensions + whats-new).
- Features: прямые “Скачать” (AMO/Win/macOS), без “Скоро”.
- Footer: убраны дубли, контакты унифицированы (support + Telegram).
- Обновлён links.json (Telegram → GetLifeUndoSupport).

Проверка
- Открываются ссылки “Скачать” (AMO/Win/macOS).
- Футер без дублей, контакты корректны.
- public/app/latest/whats-new.json содержит 0.3.7.32.

Файлы (ключевые)
- package.json, extension_*/*/manifest.json
- public/app/latest/{latest.json, whats-new.json}
- src/app/layout.tsx
- src/app/[locale]/features/page.tsx
- src/components/Footer.tsx
- business/CURATED_FINAL/constants/links.json
