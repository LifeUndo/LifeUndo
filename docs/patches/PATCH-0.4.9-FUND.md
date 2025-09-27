# 🚀 PATCH 0.4.9-FUND — **14-Day Action Pack (D0–D14)**

## 🎯 Цели спринта

* MVP **Email Pause** (рабочий цикл HOLD → APPROVE/DENY → SENT).
* Обновлённый сайт с **/gov, /edu, /fund** (RU/EN).
* E2E сценарий оплаты через **FreeKassa** (Pro/VIP).
* **Презентационный пакет** для гос/корп пилотов (печать + PDF).
* Баннеры/CTA фонда: «10% → GetLifeUndo Fund».

---

## 📋 Задачи для Cursor

### 1. Email Pause MVP (Safe-Send)

#### 1.1 Миграция БД
```sql
-- migrations/039_email_pause_cancel.sql
ALTER TABLE email_outbox ADD COLUMN IF NOT EXISTS cancel_until timestamptz;
ALTER TABLE email_outbox ADD COLUMN IF NOT EXISTS safe_send_delay_seconds int DEFAULT 60;
ALTER TABLE email_outbox ADD COLUMN IF NOT EXISTS cancel_reason text;

-- Добавляем статус CANCELED
ALTER TYPE email_status ADD VALUE IF NOT EXISTS 'CANCELED';
```

#### 1.2 API Endpoints
```typescript
// src/app/api/email/pause/cancel/[id]/route.ts
// POST /api/email/pause/cancel/:id - отмена письма в паузе
// PUT /api/email/pause/safe-send/:id - настройка safe-send delay
```

#### 1.3 UI компоненты
```typescript
// src/components/EmailPauseBanner.tsx
// Баннер: "Письмо в паузе, можно отменить" с таймером
// src/app/admin/email/page.tsx - обновить с кнопкой Cancel
```

#### 1.4 E2E тест
```typescript
// tests/e2e/email-pause-cancel.spec.ts
// Сценарий: отправить письмо → HOLD 60s → Cancel → статус CANCELED
```

### 2. Сайт (getlifeundo.com / lifeundo.ru)

#### 2.1 Новые страницы
```typescript
// src/app/(public)/gov/page.tsx - гос/корп решения
// src/app/(public)/edu/page.tsx - студенты/школы, скидки -50%
// src/app/(public)/fund/page.tsx - фонд, 10% net revenue
```

#### 2.2 Контент (RU/EN)
- **Gov:** on-prem, аудит, цифровой рубль, политики отправки
- **Edu:** образовательные лицензии, гранты, студенческие скидки
- **Fund:** социальная миссия, публичные отчёты, гранты

#### 2.3 Навигация
```typescript
// src/components/Navigation.tsx
// Обновить меню: Home · FAQ · Privacy · Pricing · Gov · Edu · Fund · Support
// src/components/Footer.tsx - добавить бейдж "10% → Fund"
```

### 3. FreeKassa e2e

#### 3.1 Webhook обработка
```typescript
// src/app/api/fk/notify/route.ts
// Обновить для интеграции с billing системой (0.4.8)
// POST /api/fk/notify → обновление invoice status = 'paid'
```

#### 3.2 E2E сценарий
```typescript
// tests/e2e/freekassa-payment.spec.ts
// Покупка Pro/VIP → FreeKassa success → webhook → invoice=paid → ключ
```

#### 3.3 UI интеграция
```typescript
// src/app/thank-you/page.tsx
// "Спасибо, ключ отправлен на email" после успешной оплаты
```

### 4. Презентация для пилотов

#### 4.1 Структура презентации
```markdown
# GLU_Presentation_PRINT.md
1. Проблема (ошибки до отправки, цифровой рубль, аудит)
2. Решение (Undo Graph, Email Pause, политики)
3. Архитектура (SaaS + On-Prem + White-Label)
4. Гос/корп кейсы (цифровой рубль, налоговый аудит)
5. Образовательные программы (школы, вузы, гранты)
6. Социальная миссия (фонд 10%, открытые отчёты)
7. Roadmap (90 дней, пилоты, интеграции)
```

#### 4.2 Форматы
- **A4** - для печати
- **16:9** - для презентаций
- **RU/EN** версии

#### 4.3 Расположение
```
/docs/presentations/
├── GLU_Pilots_2025Q4_RU.md
├── GLU_Pilots_2025Q4_EN.md
├── GLU_Pilots_2025Q4_RU.pdf
└── GLU_Pilots_2025Q4_EN.pdf
```

### 5. Fund-баннеры

#### 5.1 React компонент
```typescript
// src/components/FundBanner.tsx
interface FundBannerProps {
  variant?: 'hero' | 'footer' | 'pricing';
  language?: 'ru' | 'en';
}
```

#### 5.2 Дизайн
- **Цвет:** акцентный violet (#7C3AED)
- **Текст:** "10% чистой выручки → GetLifeUndo Fund"
- **CTA:** ссылка на /fund

#### 5.3 Размещение
- Главная страница (hero section)
- Pricing страница
- Gov/Edu страницы
- Footer (постоянный бейдж)

---

## 🧪 Чек-лист smoke/e2e

### Email Pause Cancel
```bash
# Отмена письма в паузе
curl -X POST -u admin:****** \
  https://getlifeundo.com/api/email/pause/cancel/<id>

# Настройка safe-send delay
curl -X PUT -u admin:****** \
  -H "Content-Type: application/json" \
  -d '{"delay_seconds": 120}' \
  https://getlifeundo.com/api/email/pause/safe-send/<id>
```

### FreeKassa webhook
```bash
# Тест webhook (с реальными данными)
curl -X POST https://getlifeundo.com/api/fk/notify \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'MERCHANT_ID=123&SIGN=abc...&AMOUNT=900&ORDER_ID=456'
```

### Сайт страницы
```bash
# Проверка новых страниц
curl -I https://getlifeundo.com/gov
curl -I https://getlifeundo.com/edu  
curl -I https://getlifeundo.com/fund

# Проверка локализации
curl -I https://getlifeundo.com/en/gov
curl -I https://getlifeundo.com/en/edu
curl -I https://getlifeundo.com/en/fund
```

### E2E тесты
```bash
# Запуск всех тестов
npm run test:e2e

# Специфичные тесты
npx playwright test tests/e2e/email-pause-cancel.spec.ts
npx playwright test tests/e2e/freekassa-payment.spec.ts
```

---

## 📂 Новые файлы/директории

### Миграции
- `migrations/039_email_pause_cancel.sql`

### API Endpoints
- `src/app/api/email/pause/cancel/[id]/route.ts`
- `src/app/api/email/pause/safe-send/[id]/route.ts`

### UI компоненты
- `src/components/EmailPauseBanner.tsx`
- `src/components/FundBanner.tsx`
- `src/components/Navigation.tsx` (обновить)
- `src/components/Footer.tsx` (обновить)

### Страницы
- `src/app/(public)/gov/page.tsx`
- `src/app/(public)/edu/page.tsx`
- `src/app/(public)/fund/page.tsx`
- `src/app/thank-you/page.tsx`

### E2E тесты
- `tests/e2e/email-pause-cancel.spec.ts`
- `tests/e2e/freekassa-payment.spec.ts`

### Документация
- `/docs/presentations/GLU_Pilots_2025Q4_RU.md`
- `/docs/presentations/GLU_Pilots_2025Q4_EN.md`

---

## 🎨 Дизайн и UX

### Цветовая схема
- **Primary:** #7C3AED (violet) - для Fund баннеров
- **Success:** #10B981 (green) - для успешных действий
- **Warning:** #F59E0B (amber) - для предупреждений
- **Error:** #EF4444 (red) - для ошибок

### Типографика
- **Заголовки:** Inter, font-weight: 600-700
- **Основной текст:** Inter, font-weight: 400-500
- **Акценты:** Inter, font-weight: 500, color: #7C3AED

### Компоненты
- **FundBanner:** закруглённые углы, тень, hover эффекты
- **EmailPauseBanner:** таймер обратного отсчёта, анимация
- **Navigation:** адаптивное меню, активные состояния

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+

### Адаптивность
- **Gov/Edu/Fund страницы:** мобильная версия с упрощённой навигацией
- **FundBanner:** адаптивный текст и кнопки
- **EmailPauseBanner:** компактная версия для мобильных

---

## 🌍 Локализация (RU/EN)

### Ключи переводов
```typescript
// src/lib/i18n/translations.ts
export const translations = {
  ru: {
    'fund.banner.text': '10% чистой выручки → GetLifeUndo Fund',
    'fund.banner.cta': 'Узнать больше',
    'gov.title': 'Государственные и корпоративные решения',
    'edu.title': 'Образовательные программы',
    'email.pause.cancel': 'Отменить отправку',
    'email.pause.timer': 'Отправка через {seconds} сек'
  },
  en: {
    'fund.banner.text': '10% of net revenue → GetLifeUndo Fund',
    'fund.banner.cta': 'Learn more',
    'gov.title': 'Government & Enterprise Solutions',
    'edu.title': 'Educational Programs',
    'email.pause.cancel': 'Cancel sending',
    'email.pause.timer': 'Sending in {seconds} seconds'
  }
};
```

---

## 🔒 Безопасность и производительность

### Email Pause Security
- **Rate limiting:** максимум 10 отмен в минуту на пользователя
- **Authorization:** только владелец письма может отменить
- **Audit log:** все действия логируются в audit_log

### FreeKassa Integration
- **Signature verification:** проверка MD5/HMAC подписи
- **Replay protection:** защита от повторных запросов
- **Idempotency:** безопасная обработка дубликатов

### Performance
- **Lazy loading:** страницы Gov/Edu/Fund загружаются по требованию
- **Image optimization:** оптимизированные изображения для презентаций
- **Caching:** статический контент кешируется через Cloudflare

---

## 📊 Метрики и аналитика

### KPI для спринта
- **Email Pause adoption:** % писем с включённой паузой
- **Cancel rate:** % отменённых писем от общего числа
- **Fund banner CTR:** клики по баннеру фонда
- **Gov/Edu page views:** посещения новых страниц
- **FreeKassa conversion:** % успешных оплат

### Google Analytics
```typescript
// src/lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
};

// Использование
trackEvent('email_pause_cancel', { email_id: 'xxx' });
trackEvent('fund_banner_click', { page: 'pricing' });
```

---

## 🚀 Release Notes

### RU
**PATCH 0.4.9-FUND** — Добавлены gov/edu/fund страницы, баннер фонда (10%), Email Pause с отменой и safe-send delay, полная интеграция FreeKassa с billing системой, презентационный пакет для гос/корп пилотов (RU/EN), обновлённая навигация и footer.

### EN  
**PATCH 0.4.9-FUND** — Added gov/edu/fund pages, Fund banner (10%), Email Pause with cancel and safe-send delay, complete FreeKassa integration with billing system, pilot presentation deck (RU/EN), updated navigation and footer.

---

## ✅ Definition of Done

### Технические требования
- [ ] Все E2E тесты проходят
- [ ] Smoke-тесты для новых API endpoints
- [ ] Миграции применены без ошибок
- [ ] Линтер проходит без ошибок
- [ ] TypeScript компилируется без ошибок

### Функциональные требования  
- [ ] Email Pause с отменой работает end-to-end
- [ ] FreeKassa webhook обновляет billing статусы
- [ ] Gov/Edu/Fund страницы доступны на RU/EN
- [ ] Fund баннеры отображаются корректно
- [ ] Презентации сгенерированы в PDF

### UX/UI требования
- [ ] Адаптивный дизайн на всех устройствах
- [ ] Локализация работает корректно
- [ ] Анимации и переходы плавные
- [ ] Доступность (a11y) соблюдена

### Бизнес требования
- [ ] Социальная миссия (фонд 10%) отражена
- [ ] Гос/корп позиционирование корректно
- [ ] Образовательные программы представлены
- [ ] FreeKassa интеграция готова к продакшену

---

## 🎯 Следующие шаги (0.4.10-SSO)

После завершения 0.4.9-FUND готовим:
- **SAML/OIDC** интеграция для корпоративных клиентов
- **SCIM** для управления пользователями
- **SSO dashboard** в админке
- **Identity providers** настройка (Azure AD, Google Workspace)

---

**PATCH 0.4.9-FUND** — готов к выполнению! 🚀

Cursor, приступай к реализации согласно этому ТЗ. Все файлы должны быть созданы в соответствии с архитектурой проекта и готовы к деплою.


