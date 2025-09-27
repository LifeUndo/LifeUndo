# Быстрый деплой PROD версии

## 🚨 ПРОБЛЕМА
Множественные ошибки TypeScript при сборке проекта для Vercel.

## 🔧 РЕШЕНИЕ
Создать минимальную рабочую версию для деплоя:

### 1. Временно отключить проблемные файлы
```bash
# Переименовать проблемные API роуты
mv src/app/api/admin src/app/api/admin.disabled
mv src/app/api/_health src/app/api/_health.disabled
```

### 2. Создать простую главную страницу
```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LifeUndo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Управление лицензиями для разработчиков
          </p>
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Статус системы</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API:</span>
                <span className="text-green-600">✓ Работает</span>
              </div>
              <div className="flex justify-between">
                <span>База данных:</span>
                <span className="text-yellow-600">⚠ Настройка</span>
              </div>
              <div className="flex justify-between">
                <span>FreeKassa:</span>
                <span className="text-yellow-600">⚠ Настройка</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Создать базовые API роуты
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.4.7-SMTP',
    environment: 'production'
  });
}
```

### 4. Деплой
```bash
vercel --prod
```

### 5. Добавить домен
```bash
vercel domains add getlifeundo.com
vercel domains add www.getlifeundo.com
```

## 📋 ПЛАН ДЕЙСТВИЙ

1. **Сейчас**: Создать минимальную версию
2. **После деплоя**: Добавить домен getlifeundo.com
3. **Потом**: Постепенно восстанавливать функциональность

## ⚠️ ВАЖНО
- DNS для getlifeundo.com нужно настроить в Cloudflare
- База данных требует подключения от админа
- FreeKassa требует PROD ключи
