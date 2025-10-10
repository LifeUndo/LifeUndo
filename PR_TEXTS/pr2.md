# chore(csp): drop 'unsafe-eval' in script-src for preview only

Что сделано
- В `next.config.mjs` CSP собирается условно:
  - при `VERCEL_ENV==='preview'` удалён `'unsafe-eval'` из `script-src`.
  - во всех остальных окружениях поведение без изменений.

Почему
- Ужесточаем CSP на превью без влияния на прод.

Проверка
- Preview URL: страницы `/, /ru, /en, /ru/features, /en/pricing` → `CSP:OK` (нет `'unsafe-eval'`).
- Прод не менялся.

Чеклист
- `script-src` (preview) без `'unsafe-eval'`.
- Прод/другие окружения — без изменений.
- Smoke FK остаётся рабочим.
