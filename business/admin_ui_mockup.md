# Admin UI Mockup

## Обзор интерфейса

Админ-панель LifeUndo построена на принципах современного веб-дизайна с акцентом на функциональность и удобство использования. Использует темную тему для снижения нагрузки на глаза при длительной работе.

## Цветовая схема

### Основные цвета
- **Background**: `#0B1220` (темно-синий)
- **Surface**: `#111827` (серый)
- **Card**: `#1F2937` (светло-серый)
- **Border**: `#374151` (граница)
- **Text Primary**: `#FFFFFF` (белый)
- **Text Secondary**: `#9CA3AF` (серый)
- **Accent**: `#6366F1` (фиолетовый)
- **Success**: `#10B981` (зеленый)
- **Warning**: `#F59E0B` (желтый)
- **Error**: `#EF4444` (красный)

## Layout Structure

### Header (Фиксированный)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] LifeUndo Admin    [Search] [Notifications] [Profile] │
└─────────────────────────────────────────────────────────────┘
```

**Компоненты:**
- **Logo**: LifeUndo логотип слева
- **Search**: глобальный поиск по пользователям/подпискам
- **Notifications**: уведомления о критических событиях
- **Profile**: выпадающее меню с настройками и выходом

### Sidebar (Фиксированный)
```
┌─────────────┐
│ 📊 Dashboard│
│ 👥 Users    │
│ 📧 Newsletter│
│ 🎁 Grants   │
│ 📈 Analytics │
│ ⚙️ Settings │
│ 📋 Logs     │
└─────────────┘
```

**Навигация:**
- **Dashboard**: главная с метриками
- **Users**: управление пользователями
- **Newsletter**: рассылки и шаблоны
- **Grants**: гранты и партнеры
- **Analytics**: аналитика и отчеты
- **Settings**: настройки системы
- **Logs**: логи и события

## Dashboard (Главная)

### KPI Cards (4 колонки)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Active    │   Trials    │ Payments    │   Churn     │
│ Subscriptions│             │   24h       │    Rate     │
│    1,250    │     89      │  125,000₽   │    2.5%     │
│   ↗ +5.2%   │   ↘ -12%    │   ↗ +8.1%   │   ↘ -0.3%   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Charts Section (2 колонки)
```
┌─────────────────────────────┬─────────────────────────────┐
│      Subscriptions Trend     │       Revenue Trend         │
│                             │                             │
│    [Line Chart - 30 days]   │    [Line Chart - 30 days]   │
│                             │                             │
└─────────────────────────────┴─────────────────────────────┘
```

### Quick Actions
```
┌─────────────────────────────────────────────────────────────┐
│                    Quick Actions                            │
│  [Send Newsletter] [Create Grant] [Export Data] [Settings] │
└─────────────────────────────────────────────────────────────┘
```

## Users & Subscriptions

### Filters Bar
```
┌─────────────────────────────────────────────────────────────┐
│ [Search: email/name] [Status: All ▼] [Plan: All ▼] [Country] │
│ [Date Range] [Source] [Export CSV] [Bulk Actions ▼]          │
└─────────────────────────────────────────────────────────────┘
```

### Users Table
```
┌─────────────────────────────────────────────────────────────┐
│ ☐ ID │ Email           │ Name    │ Status │ Plan │ Created  │
├──────┼─────────────────┼─────────┼────────┼──────┼──────────┤
│ ☐ 1  │ user@example.com│ John D. │ Active │ Pro  │ 2024-01-01│
│ ☐ 2  │ test@example.com│ Jane S. │ Trial  │ Pro  │ 2024-01-02│
│ ☐ 3  │ admin@example.com│ Admin  │ Active │ VIP  │ 2024-01-03│
└─────────────────────────────────────────────────────────────┘
```

**Действия для каждой строки:**
- **View**: просмотр профиля
- **Grant**: выдача подписки
- **Cancel**: отмена подписки
- **Newsletter**: отправка рассылки
- **Logs**: просмотр логов

### User Detail Modal
```
┌─────────────────────────────────────────────────────────────┐
│                    User Profile                             │
│                                                             │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│ │   Basic     │ Subscription│  Payments   │ Newsletter  │   │
│ │   Info      │             │   History   │   History   │   │
│ │             │             │             │             │   │
│ │ Email:      │ Status:     │ Last:       │ Sent:       │   │
│ │ Name:       │ Plan:       │ Amount:     │ Opened:     │   │
│ │ Country:    │ Ends:       │ Method:     │ Clicked:    │   │
│ │ Source:     │ Auto-renew: │             │             │   │
│ └─────────────┴─────────────┴─────────────┴─────────────┘   │
│                                                             │
│              [Grant Subscription] [Send Newsletter]         │
└─────────────────────────────────────────────────────────────┘
```

## Newsletter Manager

### Templates List
```
┌─────────────────────────────────────────────────────────────┐
│ [Create Template] [Import JSON] [Bulk Actions] [Search]     │
├─────────────────────────────────────────────────────────────┤
│ ☐ ID │ Slug        │ Title              │ Category │ Stats  │
├──────┼─────────────┼────────────────────┼──────────┼────────┤
│ ☐ 1  │ lost-thesis │ Диплом без копии  │ Education│ 150/45 │
│ ☐ 2  │ lecture-lost│ Лекция исчезла     │ Education│ 120/38 │
│ ☐ 3  │ book-manuscript│ Рукопись утеряна│ Creative │ 95/28  │
└─────────────────────────────────────────────────────────────┘
```

### Template Editor
```
┌─────────────────────────────────────────────────────────────┐
│                    Template Editor                          │
│                                                             │
│ Slug: [lost-thesis                    ]                     │
│ Title: [Представьте: диплом — без резервной копии]         │
│                                                             │
│ Category: [Education ▼] Tone: [Scary ▼] Locale: [RU ▼]    │
│                                                             │
│ Body:                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ {user_name}, студент Серёжа пропустил оплату...        │ │
│ │                                                         │ │
│ │ [Preview] [Save] [Test Send] [Deactivate]               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Manual Send
```
┌─────────────────────────────────────────────────────────────┐
│                    Manual Newsletter Send                   │
│                                                             │
│ Template: [Select Template ▼]                             │
│                                                             │
│ Filters:                                                    │
│ ☐ Trial users    ☐ Past due    ☐ Specific country         │
│ ☐ Specific plan  ☐ Date range   ☐ Source filter           │
│                                                             │
│ Recipients: 1,250 users will receive this newsletter        │
│                                                             │
│ Send Options:                                               │
│ ○ Send immediately  ○ Schedule for: [Date/Time picker]     │
│                                                             │
│ [Preview] [Send Newsletter] [Cancel]                       │
└─────────────────────────────────────────────────────────────┘
```

## Analytics Dashboard

### Revenue Analytics
```
┌─────────────────────────────────────────────────────────────┐
│                    Revenue Analytics                        │
│                                                             │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│ │     MRR     │     ARR     │    LTV      │     CAC     │   │
│ │  750,000₽   │ 9,000,000₽  │   30,000₽   │   5,000₽    │   │
│ │   ↗ +12%    │   ↗ +15%    │   ↗ +8%     │   ↘ -5%     │   │
│ └─────────────┴─────────────┴─────────────┴─────────────┘   │
│                                                             │
│ [Revenue Chart - 12 months]                                │
└─────────────────────────────────────────────────────────────┘
```

### User Analytics
```
┌─────────────────────────────────────────────────────────────┐
│                    User Analytics                           │
│                                                             │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐   │
│ │     DAU     │     MAU     │ Retention   │   Churn     │   │
│ │    2,500    │   15,000    │    85%      │    2.5%     │   │
│ │   ↗ +8%     │   ↗ +12%    │   ↗ +3%     │   ↘ -0.5%   │   │
│ └─────────────┴─────────────┴─────────────┴─────────────┘   │
│                                                             │
│ [User Growth Chart] [Retention Cohort]                     │
└─────────────────────────────────────────────────────────────┘
```

### Conversion Funnel
```
┌─────────────────────────────────────────────────────────────┐
│                    Conversion Funnel                        │
│                                                             │
│ Install → Register → Trial → Subscribe → Renew              │
│   100%  →   85%   →  45%  →    25%    →   80%              │
│                                                             │
│ [Funnel Visualization]                                     │
└─────────────────────────────────────────────────────────────┘
```

## Settings Panel

### PSP Configuration
```
┌─────────────────────────────────────────────────────────────┐
│                    PSP Configuration                        │
│                                                             │
│ Provider: [Stripe ▼]                                       │
│                                                             │
│ Test Mode: ☐ Enabled                                       │
│                                                             │
│ API Keys:                                                   │
│ Secret Key: [sk_test_...                    ] [Test]        │
│ Webhook Secret: [whsec_...                  ] [Test]        │
│                                                             │
│ Webhook URL: https://api.lifeundo.ru/api/payments/webhook  │
│                                                             │
│ [Save Configuration] [Test Connection]                     │
└─────────────────────────────────────────────────────────────┘
```

### Email Configuration
```
┌─────────────────────────────────────────────────────────────┐
│                    Email Configuration                      │
│                                                             │
│ Provider: [SMTP ▼]                                         │
│                                                             │
│ SMTP Settings:                                              │
│ Host: [smtp.gmail.com                    ]                 │
│ Port: [587                                ]                 │
│ Username: [admin@lifeundo.ru              ]                 │
│ Password: [••••••••••••••••••••••••••••••]                 │
│                                                             │
│ From Address: [noreply@lifeundo.ru]                        │
│                                                             │
│ [Save Configuration] [Test Email]                           │
└─────────────────────────────────────────────────────────────┘
```

### Trial Settings
```
┌─────────────────────────────────────────────────────────────┐
│                    Trial Settings                           │
│                                                             │
│ Trial Duration: [7] days                                   │
│                                                             │
│ Restrictions:                                               │
│ ☐ One trial per card                                       │
│ ☐ One trial per fingerprint                                │
│ ☐ One trial per IP address                                 │
│                                                             │
│ Grace Period: [72] hours after failed payment              │
│                                                             │
│ Retry Policy:                                               │
│ Max Retries: [3]                                           │
│ Retry Intervals: [2h, 24h, 72h]                           │
│                                                             │
│ [Save Settings]                                            │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Design

### Mobile Layout (< 768px)
- **Sidebar**: скрывается, доступ через hamburger menu
- **Tables**: горизонтальный скролл
- **Cards**: стекаются вертикально
- **Modals**: полноэкранные

### Tablet Layout (768px - 1024px)
- **Sidebar**: компактная версия
- **Tables**: адаптивные колонки
- **Cards**: 2 колонки вместо 4

## Accessibility Features

### Keyboard Navigation
- **Tab**: перемещение между элементами
- **Enter/Space**: активация кнопок
- **Escape**: закрытие модалов
- **Arrow keys**: навигация в таблицах

### Screen Reader Support
- **ARIA labels**: для всех интерактивных элементов
- **Semantic HTML**: правильная структура
- **Alt text**: для всех изображений
- **Focus indicators**: видимые фокусы

### Color Contrast
- **WCAG AA**: минимум 4.5:1 для текста
- **WCAG AAA**: 7:1 для важного текста
- **Color blind friendly**: не полагается только на цвет

## Performance Considerations

### Loading States
- **Skeleton screens**: для таблиц и карточек
- **Progress bars**: для длительных операций
- **Lazy loading**: для больших списков
- **Caching**: для часто используемых данных

### Optimization
- **Virtual scrolling**: для больших таблиц
- **Debounced search**: для поиска
- **Pagination**: для больших наборов данных
- **Compression**: для API ответов

## Security Features

### Authentication
- **2FA**: обязательная двухфакторная аутентификация
- **Session timeout**: автоматический выход
- **IP whitelist**: ограничение по IP
- **Audit log**: запись всех действий

### Data Protection
- **Encryption**: для чувствительных данных
- **Masking**: для карт и персональных данных
- **Access control**: ролевая модель
- **Backup**: регулярные резервные копии

## Implementation Notes

### Technology Stack
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **UI Components**: Headless UI + Radix UI
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **State**: Zustand

### File Structure
```
src/
├── app/
│   └── admin/
│       ├── dashboard/
│       ├── users/
│       ├── newsletters/
│       ├── analytics/
│       └── settings/
├── components/
│   ├── admin/
│   │   ├── Dashboard/
│   │   ├── UsersTable/
│   │   ├── NewsletterEditor/
│   │   └── AnalyticsCharts/
│   └── ui/
│       ├── Button/
│       ├── Modal/
│       ├── Table/
│       └── Form/
└── lib/
    ├── api/
    ├── auth/
    └── utils/
```

### API Integration
- **REST API**: для CRUD операций
- **WebSocket**: для real-time уведомлений
- **GraphQL**: для сложных запросов (опционально)
- **Caching**: Redis для кэширования

### Testing Strategy
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: для API endpoints
- **E2E tests**: Playwright для критических сценариев
- **Visual regression**: для UI компонентов
