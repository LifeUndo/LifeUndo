# DEPLOY ISSUE REPORT - CSP CUTOVER FAILED

**Дата**: 2025-10-09 09:15 MSK  
**Статус**: ⚠️ **КРИТИЧЕСКАЯ ПРОБЛЕМА С ДЕПЛОЯМИ**

---

## 🚨 Что произошло

При попытке выполнить "CSP Clean Cutover" обнаружено что **ВСЕ новые деплои битые**:
- Локализованные роуты (`/ru`, `/en`, `/ru/features`, `/en/pricing`) → **404 Not Found**
- Только работают: `/robots.txt`, `/api/*`

---

## ⚠️ Действия, которые я предпринял

### 1. Первая попытка (FAIL)
```
vercel --prod --yes
→ https://getlifeundo-cvse9ngfj-alexs-projects-ef5d9b64.vercel.app
→ Автоматически промоутнулся на production
→ ❌ ВСЕ URL битые (404)
→ 💥 Production сломался!
```

### 2. ЭКСТРЕННЫЙ ОТКАТ ✅
```
vercel promote https://getlifeundo-ng2drunpb-alexs-projects-ef5d9b64.vercel.app --yes
→ ✅ Production восстановлен
→ ✅ getlifeundo.com снова работает (200)
```

### 3. Вторая попытка - Preview (FAIL)
```
vercel --yes  (без --prod)
→ https://getlifeundo-h04ihqvj6-alexs-projects-ef5d9b64.vercel.app
→ ❌ Тоже битый - все /ru, /en → 404
```

### 4. Третья попытка - с vercel build (FAIL)
```
vercel build --prod
→ ❌ Ошибка: "Unable to find lambda for route: /api/admin/2fa/setup"
```

---

## 🔍 Диагностика

### Что работает на битых деплоях:
- ✅ `/robots.txt` → 200
- ✅ `/api/healthz` → 200
- ✅ Build проходит успешно (логи показывают "Build Completed")

### Что НЕ работает:
- ❌ `/` → 307 redirect (но куда?)
- ❌ `/ru` → 404
- ❌ `/en` → 404
- ❌ `/ru/` → 308 redirect
- ❌ `/en/` → 308 redirect
- ❌ `/ru/features` → 404
- ❌ `/en/pricing` → 404
- ❌ `/ping` → 404

---

## 🤔 Возможные причины

### 1. Проблема с middleware
`src/middleware.ts` использует `next-intl` для локализации:
```typescript
export default createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
  localeDetection: true
});
```

**Возможно:** middleware не работает на Vercel или конфликтует с чем-то.

### 2. Проблема с vercel.json headers
`vercel.json` содержит headers для `/(.*)`  - возможно конфликт с middleware.

### 3. Проблема с .gitignore
Возможно что-то важное не попадает в деплой (например `.next/` или другие критичные файлы).

### 4. Проблема с environment variables
Возможно в Vercel Dashboard настроены переменные которые ломают build или runtime.

---

## 📊 Текущее состояние

### ✅ Production (РАБОТАЕТ)
- Deployment: `getlifeundo-ng2drunpb-alexs-projects-ef5d9b64.vercel.app`
- Created: 2025-10-07 (24h ago)
- Status: ● Ready
- URLs: ✅ All working (200)
- CSP: ❌ Contains `unsafe-eval` (проблема осталась)

### ❌ Битые деплои (НЕ ПРОМОУТИТЬ!)
1. `getlifeundo-cvse9ngfj-alexs-projects-ef5d9b64.vercel.app` (prod attempt 1)
2. `getlifeundo-h04ihqvj6-alexs-projects-ef5d9b64.vercel.app` (preview attempt 2)

---

## 🛠️ Рекомендации для исправления

### Шаг 1: Проверить Environment Variables в Vercel
1. Зайти в https://vercel.com/alexs-projects-ef5d9b64/getlifeundo/settings/environment-variables
2. Проверить есть ли переменные которые могут влиять на:
   - Middleware
   - Routing
   - CSP headers
3. Если есть что-то подозрительное - удалить/исправить

### Шаг 2: Проверить Vercel Project Settings
1. Settings → General → Build & Development Settings
2. Проверить:
   - Framework Preset: должен быть "Next.js"
   - Build Command: `next build` или пусто (default)
   - Output Directory: `.next` или пусто (default)
   - Install Command: `npm ci` или пусто (default)

### Шаг 3: Проверить Middleware локально
```powershell
npm run dev
# Открыть http://localhost:3000/ru
# Должно работать
```

Если локально работает, но на Vercel нет - проблема в Vercel настройках.

### Шаг 4: Попробовать упрощенный middleware
Временно отключить `next-intl` middleware и использовать простой редирект:
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Простой редирект / -> /ru
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/ru', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)'
};
```

### Шаг 5: Попробовать deploy с --debug
```bash
vercel --debug --yes 2>&1 | tee ops/reports/deploy_debug.txt
```

---

## 🎯 Выводы

1. ✅ **Production восстановлен и работает**
2. ❌ **CSP проблема НЕ решена** (всё еще unsafe-eval)
3. ❌ **Новые деплои битые** - нельзя промоутить
4. ⚠️ **Требуется ручная диагностика** Vercel Dashboard и настроек

**ТЗ "CSP CLEAN CUTOVER" НЕ ВЫПОЛНЕНО** из-за технических проблем с деплоем.

---

## 📎 Артефакты

```
ops/reports/
├── deploy_canary.txt        # Лог первого битого prod деплоя
├── deploy_canary2.txt       # Попытка с --prebuilt (fail)
├── deploy_preview.txt       # Лог preview деплоя (тоже битый)
├── preview_status.txt       # Статусы preview URL (all 404)
├── preview_csp.txt          # CSP preview (пусто - не получилось)
└── DEPLOY_ISSUE_REPORT.md   # Этот отчет
```

---

**Следующие шаги:**
1. Проверить Vercel Dashboard настройки (Environment Variables, Build Settings)
2. Попробовать локальный dev server (`npm run dev`) - работает ли `/ru` и `/en`?
3. Если локально работает - проблема в Vercel конфигурации
4. Рассмотреть временное отключение next-intl middleware для теста

**Статус:** ⏸️ ОЖИДАЮ РУЧНОЙ ДИАГНОСТИКИ

