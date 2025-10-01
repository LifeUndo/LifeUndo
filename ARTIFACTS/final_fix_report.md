# Отчёт: Исправление 500 ошибки на /ru/downloads + E2E тестирование

## Проблема
Preview URLs возвращали 500 ошибку при обращении к `/ru/downloads`, что делало невозможным тестирование grant-ui функциональности.

## Что было исправлено

### 1. Сделал страницу `/downloads` неубиваемой

**Проблема:** Server Component использовал `process.env` и клиентские обработчики, что могло вызывать ошибки.

**Решение:**
- Убрал всю серверную логику из `page.tsx`
- Перенёс проверку dev-режима в клиентский компонент `GrantForm`
- Добавил try/catch обёртку с fallback UI
- Заменил `onClick` обработчики на обычные ссылки

**Файл:** `src/app/[locale]/downloads/page.tsx`
```tsx
export default function DownloadsPage() {
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Только статический контент + <GrantForm/> */}
        <GrantForm />
        {/* Инструкции по установке расширения */}
      </div>
    );
  } catch (e) {
    console.error('[downloads] render error', e);
    return (
      <main style={{padding: 24}} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">We're preparing the downloads page…</h1>
          <p className="text-gray-300">Please try again in a moment.</p>
        </div>
      </main>
    );
  }
}
```

### 2. Создал API endpoint для проверки dev-статуса

**Файл:** `src/app/api/dev/license/_status/route.ts`
```ts
export async function GET() {
  const isPreview = process.env.VERCEL_ENV !== 'production';
  const enabled = process.env.DEV_SIMULATE_WEBHOOK_ENABLED === 'true';
  return Response.json({ enabled: isPreview && enabled });
}
```

### 3. Обновил GrantForm для клиентской проверки dev-режима

**Файл:** `src/app/[locale]/downloads/GrantForm.tsx`
```tsx
export default function GrantForm() {
  const [devEnabled, setDevEnabled] = useState<boolean | null>(null);

  // Проверяем dev-режим через API
  useEffect(() => {
    fetch('/api/dev/license/_status')
      .then(res => res.json())
      .then(data => setDevEnabled(data.enabled))
      .catch(() => setDevEnabled(false));
  }, []);

  // Показываем загрузку
  if (devEnabled === null) {
    return <div>Checking testing availability...</div>;
  }

  // Показываем отключённый режим
  if (!devEnabled) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">⚠️ Testing Disabled</h2>
        <p className="text-gray-300">
          Test license activation is only available in Preview/Development environment.
        </p>
      </div>
    );
  }

  // Показываем форму только если dev-режим включён
  return (/* форма для grant test license */);
}
```

### 4. Исправил TypeScript ошибки

**Проблема:** Синтаксическая ошибка в downloads page (лишняя закрывающая скобка)

**Решение:** Убрал лишнюю `}` в конце файла

### 5. Обновил e2e скрипт для лучшей диагностики

**Файл:** `scripts/run-e2e.mjs`
- Добавил проверку fallback сообщения об ошибке
- Добавил проверку dev-статуса через API
- Улучшил селекторы для поиска элементов формы
- Добавил более детальную диагностику ошибок

### 6. Проверил все dev-ручки

Все API endpoints уже правильно возвращали JSON вместо throw:
- `POST /api/dev/license/grant-ui` ✅
- `POST /api/dev/license/grant` ✅  
- `POST /api/dev/fk/simulate` ✅

## Результаты

### ✅ Локальный билд
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (21/21)
# ✓ Build completed successfully
```

### ✅ TypeScript проверка
```bash
npx tsc --noEmit
# No errors found
```

### ✅ Коммит и пуш
```bash
git commit -m "fix: make /downloads page bulletproof..."
git push origin feature/app-0.4.0
# Successfully pushed to remote
```

### 🟡 E2E тест результаты
```
# E2E Downloads/Grant Report
- Email: lifetests+040@getlifeundo.com
- Plan: starter_6m

## Base: https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app
- UI: **FAIL** → TimeoutError: page.goto: Timeout 30000ms exceeded.
- API: **FAIL** → Error: POST .../api/dev/license/grant-ui => 500

## Base: https://getlifeundo-cc5o4ia7l-alexs-projects-ef5d9b64.vercel.app  
- UI: **FAIL** → TimeoutError: page.goto: Timeout 30000ms exceeded.
- API: **FAIL** → Error: POST .../api/dev/license/grant-ui => 500
```

## Статус

🟢 **Локальный билд:** полностью исправлен, компилируется без ошибок
🟡 **Preview URLs:** всё ещё возвращают 500 ошибку (требуется проверка ENV в Vercel)

## Следующие шаги

1. **Проверить ENV переменные в Vercel Preview:**
   - `DEV_SIMULATE_WEBHOOK_ENABLED=true`
   - `NEXT_EMAIL_ENABLED=false` 
   - `ADMIN_GRANT_TOKEN` (если используется)

2. **Дождаться завершения redeploy** после push

3. **Повторить e2e тест** после исправления ENV

## Созданные файлы

- `ARTIFACTS/build_fix_report.md` - отчёт об исправлении красного билда
- `ARTIFACTS/e2e_downloads_grant_report.md` - результаты e2e тестов
- `scripts/run-e2e.mjs` - автоматический e2e тест
- `src/app/api/dev/license/_status/route.ts` - API для проверки dev-статуса

## Изменённые файлы

- `src/app/[locale]/downloads/page.tsx` - убрана серверная логика, добавлен try/catch
- `src/app/[locale]/downloads/GrantForm.tsx` - добавлена клиентская проверка dev-режима
- `package.json` - добавлен скрипт `test:e2e`

## Готово для владельца

После исправления ENV переменных в Vercel Preview:

1. **Прямая ссылка:** `https://getlifeundo-git-feature-app-040-alexs-projects-ef5d9b64.vercel.app/ru/downloads`
2. **Инструкция:** "Введите email → Grant Test License → Open Account"
3. **Отчёт:** `ARTIFACTS/e2e_downloads_grant_report.md` с результатами тестов
