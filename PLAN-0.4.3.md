# 🚀 Plan 0.4.3 - Что готов сделать дальше (компактно)

## **🚀 Что готов сделать дальше (0.4.3 — компактно)**

### **1. Playwright e2e:**
- Для `/admin/status` и `/admin/emails` (минимальные смоуки)
- Автоматические тесты после деплоя

### **2. Мини-дашборд usage:**
- В админке (график вызовов/лимитов)
- Визуализация API usage по дням/месяцам

### **3. SDK публикация:**
- npm/PyPI + кликабельные ссылки в `/developers`
- Автоматические тесты SDK

### **4. UI полиш:**
- Прайсинга (бренд-цвета/логотипы из tenant)
- Улучшение UX для партнёров

## **📋 Детальный план 0.4.3:**

### **Playwright e2e:**
```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test('admin status banner', async ({ page }) => {
  await page.goto('/admin/status');
  await page.check('input[type="checkbox"]');
  await page.fill('input[placeholder="Заголовок"]', 'Тест');
  await page.click('button:has-text("Сохранить")');
  await expect(page.locator('text=Сохранено')).toBeVisible();
});

test('admin email templates', async ({ page }) => {
  await page.goto('/admin/emails');
  await page.fill('input[placeholder="key"]', 'test_template');
  await page.fill('input[placeholder="subject"]', 'Тест');
  await page.click('button:has-text("Сохранить")');
  await expect(page.locator('text=Сохранено')).toBeVisible();
});
```

### **Мини-дашборд usage:**
```typescript
// src/components/UsageDashboard.tsx
export default function UsageDashboard() {
  const [usage, setUsage] = useState([]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">API Usage</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Сегодня</h3>
          <div className="text-2xl">{usage.today}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Месяц</h3>
          <div className="text-2xl">{usage.month}</div>
        </div>
      </div>
      <UsageChart data={usage.chart} />
    </div>
  );
}
```

### **SDK публикация:**
```bash
# npm @lifeundo/js
cd packages/lifeundo-js
npm publish

# PyPI lifeundo
cd packages/lifeundo-python
python -m build
python -m twine upload dist/*
```

### **UI полиш:**
```typescript
// src/components/PricingTable.tsx - улучшенная версия
export default async function PricingTable() {
  const t = await currentTenant();
  
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p: any) => (
        <div key={p.code} className="rounded-2xl shadow p-5 border" 
             style={{ borderColor: t.primaryColor }}>
          <h3 className="text-lg font-semibold" 
              style={{ color: t.primaryColor }}>
            {p.title} <span className="opacity-60">({p.code})</span>
          </h3>
          {/* остальной контент */}
        </div>
      ))}
    </section>
  );
}
```

## **🎯 ГОТОВО:**

**План 0.4.3 готов! После зелёного переходим к следующему этапу! 🚀**


