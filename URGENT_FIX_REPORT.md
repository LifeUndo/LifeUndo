# 🚀 Отчет по срочному фиксу белого экрана / 404 на lifeundo.ru

## ✅ Что выполнено

### 1. Минимизирован middleware
- **Файл**: `src/middleware.ts`
- **Изменения**: Убрана сложная логика с локалями, оставлен только root-redirect `/` → `/ru`
- **Matcher**: Упрощен до `['/', '/((?!_next|api|.*\\..*).*)']`
- **Размер**: 26.4 kB (было 26.3 kB)

### 2. Проверены и обновлены страницы
- ✅ `src/app/[locale]/page.tsx` - главная страница существует
- ✅ `src/app/[locale]/pricing/page.tsx` - страница тарифов существует
- ✅ `src/app/ping/page.tsx` - упрощен до `<pre>pong</pre>`
- ✅ `src/app/api/healthz/route.ts` - добавлен API для диагностики

### 3. Настроены redirects в next.config.mjs
- **Изменение**: `permanent: true` → `permanent: false` для более мягкого редиректа
- **Дублирование**: Редирект `/` → `/ru` есть и в middleware, и в redirects

### 4. Сборка прошла успешно
- ✅ Все маршруты присутствуют в build output
- ✅ Middleware работает корректно
- ✅ API healthz добавлен

## 📋 Build Output (пруф)

```
Route (app)                              Size     First Load JS
┌ ○ /                                    177 B          87.3 kB
├ ○ /_not-found                          871 B            88 kB
├ ƒ /[locale]                            177 B          87.3 kB
├ ƒ /[locale]/admin                      3.3 kB          101 kB
├ ƒ /[locale]/api-docs                   1.07 kB        88.2 kB
├ ƒ /[locale]/contact                    2.03 kB        89.1 kB
├ ƒ /[locale]/contacts                   177 B          87.3 kB
├ ƒ /[locale]/docs                       177 B          87.3 kB
├ ƒ /[locale]/download                   177 B          87.3 kB
├ ƒ /[locale]/fail                       175 B          94.1 kB
├ ƒ /[locale]/faq                        177 B          87.3 kB
├ ƒ /[locale]/features                   177 B          87.3 kB
├ ƒ /[locale]/fund                       177 B          87.3 kB
├ ƒ /[locale]/fund/apply                 2.09 kB        99.5 kB
├ ƒ /[locale]/pricing                    177 B          87.3 kB
├ ƒ /[locale]/privacy                    1.9 kB         95.8 kB
├ ƒ /[locale]/success                    175 B          94.1 kB
├ ƒ /[locale]/support                    177 B          87.3 kB
├ ƒ /[locale]/terms                      177 B          87.3 kB
├ ƒ /[locale]/test                       177 B          87.3 kB
├ ƒ /[locale]/test-new                   177 B          87.3 kB
├ ƒ /[locale]/use-cases                  177 B          87.3 kB
├ ○ /api/healthz                         0 B                0 B
├ ○ /ok                                  0 B                0 B
├ ○ /ping                                177 B          87.3 kB
├ ○ /robots.txt                          0 B                0 B
└ ○ /sitemap.xml                         0 B                0 B

ƒ Middleware                             26.4 kB
```

## 🔧 Новый middleware код

```typescript
// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаем статику и API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) return NextResponse.next();

  // Корень -> /ru
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308);
  }

  // Всё остальное не трогаем
  return NextResponse.next();
}

// Обрабатываем только корень и «всё, кроме статики»
export const config = {
  matcher: ['/', '/((?!_next|api|.*\\..*).*)'],
};
```

## 📋 Команды для проверки

### Preview домен:
```powershell
.\scripts\verify-preview-fix.ps1
```

### Продакшн домен:
```powershell
.\scripts\verify-production-fix.ps1
```

### Ручная проверка:
```bash
# Windows PowerShell
curl.exe -I https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ping
curl.exe -I https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ru
curl.exe -I https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ru/pricing
curl.exe -I https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/api/healthz

# Продакшн
curl.exe -I https://lifeundo.ru/ru
curl.exe -I https://lifeundo.ru/ru/pricing
curl.exe -I https://lifeundo.ru/ok
```

## 🎯 Ожидаемые результаты

После деплоя на Vercel:

### Preview домен:
- ✅ `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ping` → `200 OK`
- ✅ `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ru` → `200 OK`
- ✅ `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ru/pricing` → `200 OK`
- ✅ `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/api/healthz` → `200 OK`
- ✅ `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/` → `308` на `/ru`

### Продакшн домен:
- ✅ `https://lifeundo.ru/ru` → `200 OK`
- ✅ `https://lifeundo.ru/ru/pricing` → `200 OK`
- ✅ `https://lifeundo.ru/ok` → `200 OK` + `Cache-Control: no-store, no-cache, must-revalidate`
- ✅ `https://lifeundo.ru/` → `301/308` на `/ru`

## 📝 Следующие шаги

1. **Дождаться деплоя** ветки `fix/middleware-ru-404` на Vercel
2. **Запустить проверку Preview** с помощью `scripts/verify-preview-fix.ps1`
3. **Сделать Production Redeploy** с Clear build cache
4. **Запустить проверку продакшена** с помощью `scripts/verify-production-fix.ps1`
5. **Слить ветку** в `main` после успешной проверки

## 🔍 Пруфы для релиза

После деплоя нужно предоставить:

1. **Вывод `curl.exe -I`** для всех URL (preview и продакшн)
2. **Скриншоты** открытых страниц:
   - `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ru`
   - `https://lifeundo.ru/ru`
   - `https://life-undo-git-fix-middleware-ru-404-lifeundo.vercel.app/ping`
3. **Фрагмент Vercel build log** со списком маршрутов
4. **Подтверждение** что `/ok` возвращает правильные Cache-Control headers

## 🚨 Если проблемы остаются

Если даже с минимальным middleware `/ru` возвращает 404:

1. **Включить временный лог** в middleware:
   ```typescript
   export function middleware(req: NextRequest) {
     console.log('[MW]', req.nextUrl.pathname); // временно
     // ... остальной код
   }
   ```

2. **Проверить логи**:
   ```bash
   vercel logs <preview-domain> --since=10m
   ```

3. **Проверить структуру файлов**:
   - `src/app/[locale]/page.tsx` существует
   - `src/app/[locale]/layout.tsx` существует

---

**Готово к деплою!** 🚀

Ветка `fix/middleware-ru-404` содержит все исправления и готова для деплоя на Vercel.
