# Продвинутая дизайн-система LifeUndo

## Философия дизайна

### Универсальный дизайн для цифровой эры
LifeUndo создает дизайн-систему, которая работает одинаково хорошо для всех пользователей — от школьников до министров, от бабушек до IT-специалистов. Наш дизайн адаптируется под потребности каждого пользователя, обеспечивая максимальную доступность и удобство использования.

### Принципы дизайна
- **Универсальность** — работает для всех возрастов и способностей
- **Адаптивность** — подстраивается под устройство и контекст
- **Доступность** — соответствует стандартам WCAG 2.1 AA
- **Производительность** — быстрая загрузка и отзывчивость
- **Эстетика** — современный и привлекательный внешний вид

## Цветовая система

### Основная палитра
#### Темная тема (основная)
```css
:root {
  /* Основные цвета */
  --color-background: #0B1220;        /* Глубокий темно-синий */
  --color-surface: #111827;          /* Поверхности карточек */
  --color-surface-secondary: #0F172A; /* Вторичные поверхности */
  
  /* Текст */
  --color-text-primary: #E5E7EB;      /* Основной текст */
  --color-text-secondary: #94A3B8;   /* Вторичный текст */
  --color-text-tertiary: #6B7280;     /* Третичный текст */
  
  /* Акценты */
  --color-primary: #6366F1;          /* Основной акцент */
  --color-primary-hover: #5B21B6;    /* Акцент при наведении */
  --color-secondary: #7C3AED;         /* Вторичный акцент */
  
  /* Статусы */
  --color-success: #10B981;          /* Успех */
  --color-warning: #F59E0B;           /* Предупреждение */
  --color-error: #EF4444;             /* Ошибка */
  --color-info: #3B82F6;              /* Информация */
}
```

#### Светлая тема (альтернативная)
```css
:root[data-theme="light"] {
  /* Основные цвета */
  --color-background: #FFFFFF;        /* Белый фон */
  --color-surface: #F8FAFC;           /* Светлые поверхности */
  --color-surface-secondary: #F1F5F9; /* Вторичные поверхности */
  
  /* Текст */
  --color-text-primary: #1E293B;      /* Темный текст */
  --color-text-secondary: #64748B;    /* Серый текст */
  --color-text-tertiary: #94A3B8;     /* Светло-серый текст */
  
  /* Акценты остаются теми же */
  --color-primary: #6366F1;
  --color-primary-hover: #5B21B6;
  --color-secondary: #7C3AED;
}
```

#### Высокий контраст (для слабовидящих)
```css
:root[data-theme="high-contrast"] {
  --color-background: #000000;        /* Черный фон */
  --color-surface: #1A1A1A;           /* Темно-серые поверхности */
  --color-text-primary: #FFFFFF;      /* Белый текст */
  --color-text-secondary: #CCCCCC;    /* Светло-серый текст */
  --color-primary: #00FF00;           /* Ярко-зеленый акцент */
  --color-success: #00FF00;
  --color-error: #FF0000;
  --color-warning: #FFFF00;
}
```

### Семантические цвета
#### Статусы операций
- **Восстановление успешно** — `#10B981` (зеленый)
- **Восстановление в процессе** — `#3B82F6` (синий)
- **Ошибка восстановления** — `#EF4444` (красный)
- **Предупреждение** — `#F59E0B` (оранжевый)

#### Типы данных
- **Текстовые данные** — `#8B5CF6` (фиолетовый)
- **Вкладки браузера** — `#06B6D4` (голубой)
- **Буфер обмена** — `#10B981` (зеленый)
- **Файлы** — `#F59E0B` (оранжевый)

## Типографика

### Шрифтовая система
#### Основной шрифт
```css
:root {
  --font-family-primary: 'Inter', system-ui, -apple-system, 
                        'Segoe UI', Roboto, 'Helvetica Neue', 
                        Arial, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 
                     'Consolas', 'Monaco', monospace;
}
```

#### Размеры шрифтов
```css
:root {
  /* Заголовки */
  --font-size-h1: 2.5rem;    /* 40px */
  --font-size-h2: 2rem;      /* 32px */
  --font-size-h3: 1.5rem;    /* 24px */
  --font-size-h4: 1.25rem;   /* 20px */
  
  /* Основной текст */
  --font-size-body: 1rem;    /* 16px */
  --font-size-body-large: 1.125rem; /* 18px */
  --font-size-body-small: 0.875rem;  /* 14px */
  
  /* Специальные размеры */
  --font-size-caption: 0.75rem;      /* 12px */
  --font-size-button: 0.875rem;      /* 14px */
  --font-size-input: 1rem;           /* 16px */
}
```

#### Веса шрифтов
```css
:root {
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

#### Высота строк
```css
:root {
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;
}
```

### Адаптивная типографика
#### Мобильные устройства
```css
@media (max-width: 768px) {
  :root {
    --font-size-h1: 2rem;      /* 32px */
    --font-size-h2: 1.75rem;   /* 28px */
    --font-size-h3: 1.5rem;    /* 24px */
    --font-size-body: 0.875rem; /* 14px */
  }
}
```

#### Планшеты
```css
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --font-size-h1: 2.25rem;   /* 36px */
    --font-size-h2: 1.875rem;  /* 30px */
    --font-size-h3: 1.5rem;    /* 24px */
  }
}
```

## Компоненты интерфейса

### Кнопки
#### Основные стили
```css
.btn {
  /* Базовые стили */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-button);
  line-height: 1;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Градиент для основных кнопок */
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.25);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(99, 102, 241, 0.35);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.25);
}
```

#### Размеры кнопок
```css
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
}
```

#### Варианты кнопок
```css
.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-surface-secondary);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: none;
}

.btn-danger {
  background: var(--color-error);
  color: white;
}
```

### Карточки
#### Базовый стиль карточки
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

#### Варианты карточек
```css
.card-elevated {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-flat {
  box-shadow: none;
  border: 1px solid var(--color-surface-secondary);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  background: var(--color-surface-secondary);
}
```

### Формы
#### Поля ввода
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-surface-secondary);
  border-radius: 0.5rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-input);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input:invalid {
  border-color: var(--color-error);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Метки форм
```css
.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-body-small);
}
```

### Навигация
#### Основная навигация
```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-surface-secondary);
}

.nav-brand {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-primary);
}
```

#### Мобильная навигация
```css
@media (max-width: 768px) {
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-top: 1px solid var(--color-surface-secondary);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav-menu.active {
    display: flex;
  }
}
```

## Адаптивный дизайн

### Брейкпоинты
```css
:root {
  --breakpoint-sm: 640px;   /* Мобильные */
  --breakpoint-md: 768px;   /* Планшеты */
  --breakpoint-lg: 1024px;  /* Ноутбуки */
  --breakpoint-xl: 1280px;  /* Десктопы */
  --breakpoint-2xl: 1536px; /* Большие экраны */
}
```

### Сетка
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

### Адаптивные изображения
```css
.img-responsive {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.img-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.img-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}
```

## Анимации и переходы

### Базовые переходы
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

### Анимации появления
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal);
}

.animate-slide-up {
  animation: slideInUp var(--transition-normal);
}

.animate-slide-down {
  animation: slideInDown var(--transition-normal);
}
```

### Микроанимации
```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  margin: -0.5rem 0 0 -0.5rem;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Доступность

### Поддержка скрин-ридеров
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Фокус
```css
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.focus-visible:not(:focus-visible) {
  outline: none;
}
```

### Высокий контраст
```css
@media (prefers-contrast: high) {
  :root {
    --color-background: #000000;
    --color-surface: #1A1A1A;
    --color-text-primary: #FFFFFF;
    --color-primary: #00FF00;
  }
}
```

### Уменьшенная анимация
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Темы оформления

### Автоматическое переключение
```css
@media (prefers-color-scheme: light) {
  :root {
    --color-background: #FFFFFF;
    --color-surface: #F8FAFC;
    --color-text-primary: #1E293B;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0B1220;
    --color-surface: #111827;
    --color-text-primary: #E5E7EB;
  }
}
```

### Пользовательские темы
```css
[data-theme="ocean"] {
  --color-primary: #0EA5E9;
  --color-secondary: #06B6D4;
  --color-background: #0C4A6E;
}

[data-theme="forest"] {
  --color-primary: #059669;
  --color-secondary: #10B981;
  --color-background: #064E3B;
}

[data-theme="sunset"] {
  --color-primary: #F59E0B;
  --color-secondary: #EF4444;
  --color-background: #7C2D12;
}
```

## Производительность

### Оптимизация CSS
```css
/* Использование CSS-переменных для быстрых изменений */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* Минимизация перерисовок */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}
```

### Ленивая загрузка
```css
.lazy-load {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-load.loaded {
  opacity: 1;
}
```

## Мобильная оптимизация

### Touch-интерфейс
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.btn-mobile {
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  border-radius: 0.75rem;
}
```

### Жесты
```css
.swipe-container {
  touch-action: pan-x;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.swipe-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

## Примеры макетов

### Главная страница
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LifeUndo - Восстановление данных</title>
  <link rel="stylesheet" href="design-system.css">
</head>
<body>
  <header class="nav">
    <a href="/" class="nav-brand">LifeUndo</a>
    <nav class="nav-menu">
      <a href="/pricing" class="nav-link">Тарифы</a>
      <a href="/support" class="nav-link">Поддержка</a>
      <a href="/fund" class="nav-link">Фонд</a>
    </nav>
  </header>
  
  <main class="container">
    <section class="hero">
      <h1 class="hero-title">Ctrl+Z для вашей онлайн-жизни</h1>
      <p class="hero-subtitle">Восстанавливайте случайно удаленный текст, вкладки и буфер обмена</p>
      <div class="hero-actions">
        <a href="/pricing" class="btn btn-lg">Выбрать тариф</a>
        <a href="/demo" class="btn btn-outline btn-lg">Попробовать бесплатно</a>
      </div>
    </section>
    
    <section class="features">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div class="card">
          <h3>Восстановление текста</h3>
          <p>Автоматическое сохранение и восстановление введенного текста</p>
        </div>
        <div class="card">
          <h3>Восстановление вкладок</h3>
          <p>Возврат случайно закрытых вкладок браузера</p>
        </div>
        <div class="card">
          <h3>Буфер обмена</h3>
          <p>История и синхронизация буфера обмена</p>
        </div>
      </div>
    </section>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 LifeUndo. Все права защищены.</p>
    </div>
  </footer>
</body>
</html>
```

### Страница тарифов
```html
<section class="pricing">
  <div class="container">
    <h2 class="section-title">Выберите подходящий тариф</h2>
    <div class="grid grid-cols-1 md:grid-cols-3">
      <div class="card pricing-card">
        <h3>Бесплатный</h3>
        <div class="pricing-price">0 ₽</div>
        <ul class="pricing-features">
          <li>3 операции в день</li>
          <li>Базовое восстановление</li>
          <li>Поддержка через Telegram</li>
        </ul>
        <a href="/signup" class="btn btn-outline">Начать бесплатно</a>
      </div>
      
      <div class="card pricing-card pricing-popular">
        <div class="pricing-badge">Популярный</div>
        <h3>Pro</h3>
        <div class="pricing-price">149 ₽<span>/месяц</span></div>
        <ul class="pricing-features">
          <li>Неограниченное восстановление</li>
          <li>Все типы данных</li>
          <li>Облачная синхронизация</li>
          <li>Приоритетная поддержка</li>
        </ul>
        <a href="/signup?plan=pro" class="btn">Выбрать Pro</a>
      </div>
      
      <div class="card pricing-card">
        <h3>VIP</h3>
        <div class="pricing-price">2 490 ₽<span>навсегда</span></div>
        <ul class="pricing-features">
          <li>Все функции Pro</li>
          <li>Пожизненный доступ</li>
          <li>Персональный менеджер</li>
          <li>Эксклюзивные функции</li>
        </ul>
        <a href="/signup?plan=vip" class="btn btn-outline">Выбрать VIP</a>
      </div>
    </div>
  </div>
</section>
```

---

**Версия документа**: 1.0  
**Дата**: 27 сентября 2025 года  
**Статус**: Готово к внедрению  
**Приоритет**: Критический для пользовательского опыта
