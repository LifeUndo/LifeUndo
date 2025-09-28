# 💳 ИНСТРУКЦИИ: Обновление FreeKassa для getlifeundo.com

## Цель
Переключить все платежные URL на `getlifeundo.com` с сохранением 301 редиректов с `.ru` доменов.

## ✅ ЧТО УЖЕ ГОТОВО В КОДЕ

### 1. Страницы успеха/ошибок существуют
- `src/app/[locale]/success/page.tsx` - страница успешной оплаты
- `src/app/[locale]/fail/page.tsx` - страница ошибки оплаты
- `src/app/api/payments/freekassa/result/route.ts` - callback для FreeKassa

### 2. Редиректы настроены
- Все `.ru` домены редиректят на `getlifeundo.com/ru/*`
- Старые ссылки FreeKassa будут работать через редиректы

## 🎯 ДЕЙСТВИЯ В FREEKASSA

### ШАГ 1: Войти в личный кабинет
1. **Зайти на https://www.freekassa.ru/**
2. **Войти в личный кабинет**
3. **Перейти в раздел "Настройки"**

### ШАГ 2: Обновить URL для уведомлений
1. **Найти раздел "URL для уведомлений"**
2. **Обновить Success URL**:
   ```
   https://getlifeundo.com/ru/success
   ```
3. **Обновить Fail URL**:
   ```
   https://getlifeundo.com/ru/fail
   ```
4. **Обновить Result URL (Callback)**:
   ```
   https://getlifeundo.com/api/payments/freekassa/result
   ```

### ШАГ 3: Проверить настройки магазина
1. **Перейти в "Мои магазины"**
2. **Выбрать магазин LifeUndo**
3. **Проверить настройки**:
   - **Success URL**: `https://getlifeundo.com/ru/success`
   - **Fail URL**: `https://getlifeundo.com/ru/fail`
   - **Result URL**: `https://getlifeundo.com/api/payments/freekassa/result`

### ШАГ 4: Тестирование (опционально)
1. **Создать тестовый платеж**
2. **Проверить редиректы**:
   - Успешная оплата → `https://getlifeundo.com/ru/success`
   - Ошибка оплаты → `https://getlifeundo.com/ru/fail`
3. **Проверить callback** в логах FreeKassa

## 🔄 СОВМЕСТИМОСТЬ С СТАРЫМИ ССЫЛКАМИ

### Редиректы с .ru доменов
Благодаря настроенным редиректам в Vercel, старые ссылки FreeKassa будут работать:

- `https://lifeundo.ru/ru/success` → 301 → `https://getlifeundo.com/ru/success`
- `https://lifeundo.ru/ru/fail` → 301 → `https://getlifeundo.com/ru/fail`
- `https://lifeundo.ru/api/payments/freekassa/result` → 301 → `https://getlifeundo.com/api/payments/freekassa/result`

### Временная поддержка
На время миграции можно оставить старые URL в FreeKassa как резервные, но основные должны быть на `.com`.

## 📋 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

### После обновления FreeKassa:
- ✅ **Success URL**: `https://getlifeundo.com/ru/success` → 200 OK
- ✅ **Fail URL**: `https://getlifeundo.com/ru/fail` → 200 OK
- ✅ **Callback URL**: `https://getlifeundo.com/api/payments/freekassa/result` → 200 OK

### Старые ссылки (через редиректы):
- ✅ `https://lifeundo.ru/ru/success` → 301 → `https://getlifeundo.com/ru/success`
- ✅ `https://lifeundo.ru/ru/fail` → 301 → `https://getlifeundo.com/ru/fail`

## 📸 ЧТО ПРИСЛАТЬ КАК ПРУФЫ

1. **Скриншот настроек FreeKassa**:
   - Success URL: `https://getlifeundo.com/ru/success`
   - Fail URL: `https://getlifeundo.com/ru/fail`
   - Result URL: `https://getlifeundo.com/api/payments/freekassa/result`

2. **Тест страниц**:
   - `https://getlifeundo.com/ru/success` → 200 OK
   - `https://getlifeundo.com/ru/fail` → 200 OK

3. **Тест редиректов**:
   - `https://lifeundo.ru/ru/success` → 301 в DevTools
   - `https://lifeundo.ru/ru/fail` → 301 в DevTools

## ⚠️ ВАЖНЫЕ МОМЕНТЫ

### 1. Безопасность
- **Result URL** должен быть доступен только для FreeKassa
- **IP-адреса FreeKassa** должны быть в whitelist (если используется)

### 2. Логирование
- **Проверить логи** FreeKassa после обновления
- **Убедиться**, что callback'и приходят на новый URL

### 3. Тестирование
- **Создать тестовый платеж** после обновления
- **Проверить все сценарии**: успех, ошибка, отмена

## 🎯 ИТОГОВЫЙ СТАТУС

**✅ КОД ГОТОВ НА 100%**
**⚠️ ТРЕБУЕТСЯ ОБНОВЛЕНИЕ URL В FREEKASSA**

После обновления FreeKassa все платежи будут работать через `getlifeundo.com`!
