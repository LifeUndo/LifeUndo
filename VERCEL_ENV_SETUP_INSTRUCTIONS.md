# 🔧 Vercel Environment Variables Setup - FreeKassa Integration

## ⚠️ КРИТИЧЕСКИ ВАЖНО: Настройка Scope

### 1. NEXT_PUBLIC_FK_ENABLED - ТОЛЬКО Preview
```
Variable: NEXT_PUBLIC_FK_ENABLED
Value: true
Scope: Preview (НЕ All Environments!)
```

**Почему:** Эта переменная попадает в клиентский код и может внезапно включить кнопки оплаты на продакшене.

### 2. Секреты FreeKassa - Preview + Production
```
Variable: FREEKASSA_MERCHANT_ID
Value: ваш_merchant_id
Scope: All Environments (или Preview + Production)

Variable: FREEKASSA_SECRET1  
Value: ваш_secret1
Scope: All Environments (или Preview + Production)

Variable: FREEKASSA_SECRET2
Value: ваш_secret2  
Scope: All Environments (или Preview + Production)

Variable: FREEKASSA_PAYMENT_URL
Value: https://pay.freekassa.ru/
Scope: All Environments (или Preview + Production)

Variable: FREEKASSA_CURRENCY
Value: RUB
Scope: All Environments (или Preview + Production)
```

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Vercel Dashboard
1. Перейдите в ваш проект
2. Settings → Environment Variables

### Шаг 2: Настройте NEXT_PUBLIC_FK_ENABLED
1. Найдите переменную `NEXT_PUBLIC_FK_ENABLED`
2. Нажмите на неё для редактирования
3. В поле "Environment" выберите **только Preview**
4. Сохраните изменения

### Шаг 3: Добавьте FREEKASSA_CURRENCY (если нет)
1. Нажмите "Add New"
2. Name: `FREEKASSA_CURRENCY`
3. Value: `RUB`
4. Environment: All Environments
5. Save

### Шаг 4: Проверьте FREEKASSA_PAYMENT_URL
Убедитесь, что значение точно: `https://pay.freekassa.ru/`

### Шаг 5: Redeploy Preview
После изменения ENV переменных:
1. Перейдите в Deployments
2. Найдите последний Preview деплой ветки `feature/fk-from-prod-lock`
3. Нажмите "Redeploy" (или дождитесь нового коммита)

## 🧪 Проверка после Redeploy

После redeploy запустите смоук тест:

```powershell
.\scripts\freekassa-smoke-test.ps1 -PreviewUrl "https://ваш-preview-alias.vercel.app"
```

Ожидаемые результаты:
- `/api/debug/fk` → `currency: "RUB"`, `fkEnabled: true`
- Payment URLs содержат `currency=RUB`
- Кнопки FreeKassa видны на `/ru/pricing`

## 🚨 Troubleshooting

### Проблема: Кнопки не появляются на Preview
**Решение:** Проверьте, что `NEXT_PUBLIC_FK_ENABLED=true` установлен именно в Preview scope.

### Проблема: Debug API показывает `currency: undefined`
**Решение:** Добавьте `FREEKASSA_CURRENCY=RUB` в Environment Variables.

### Проблема: Payment URL без currency параметра
**Решение:** Убедитесь, что `FREEKASSA_CURRENCY=RUB` установлен и сделан redeploy.

## 📸 Скриншоты для проверки

После настройки пришлите скриншоты:
1. **Environment Variables** - показывающий scope для каждой переменной
2. **Debug API Response** - JSON с `currency: "RUB"`
3. **Pricing Page** - с видимыми кнопками FreeKassa

## ✅ Готовность к Production

После успешного тестирования на Preview:
1. **Promote Preview → Production**
2. **Добавить в Production ENV:**
   ```
   NEXT_PUBLIC_FK_ENABLED=true
   ```
3. **Protect Production Deploy**
4. **Финальный smoke test на Production**

---

**⚠️ Помните:** `NEXT_PUBLIC_*` переменные попадают в клиентский код и видны всем пользователям!
