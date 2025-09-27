# 🔧 PATCH 0.4.3-B — Мини-виджеты: API-ключ + Rate-limit

## ✅ ЧТО СДЕЛАНО:

### **1. Миграция БД:**
- **`migrations/031_api_keys_and_limits.sql`** - таблица `tenant_api_keys` + лимиты на планах

### **2. API для ключей:**
- **`src/app/api/admin/keys/route.ts`** - GET (masked) / POST (ротация, plaintext один раз)

### **3. API для лимитов:**
- **`src/app/api/admin/limits/summary/route.ts`** - текущее потребление месяца

### **4. Админ-страница ключей:**
- **`src/app/admin/keys/page.tsx`** - копировать/показать последний 4, ротировать

### **5. Индикатор лимита в usage:**
- **`src/app/admin/usage/page.tsx`** - прогресс-бар лимита за месяц

### **6. Навигация:**
- **`src/app/admin/page.tsx`** - ссылка на API ключ

## 🧪 БЫСТРЫЙ SMOKE (после миграции):

```bash
# миграция
# (если используете drizzle-kit — прогоните, либо выполните SQL в Neon)
# затем билд/старт:
npm run build
npm start

# админ
# /admin/keys → Получить (GET), затем "Ротировать ключ" (POST) → появится PLAINTEXT (копируйте сразу)
# /admin/usage → карточка лимита + график

# curl-проверки
curl -s -u admin:****** https://getlifeundo.com/api/admin/keys | jq
curl -s -u admin:****** https://getlifeundo.com/api/admin/limits/summary | jq
```

## 📋 ENV НАСТРОЙКИ:

```env
# .env (оба домена / Beget)
DEFAULT_MONTH_LIMIT=100000
```

## 🔐 БЕЗОПАСНОСТЬ:

- Ключ хранится **только в виде SHA-256**
- Возвращаем plaintext **один раз** при ротации
- Дальше — только маска `••••1234`
- Доступ к `/api/admin/*` защищён BasicAuth + whitelist

## 🎯 ГОТОВО:

**Мини-виджеты полностью готовы! Теперь у нас есть:**
- ✅ Управление API ключами с ротацией
- ✅ Индикатор лимита с прогресс-баром
- ✅ Безопасное хранение ключей (только хэш)
- ✅ Одноразовый показ plaintext при создании

---

**Хочешь добавить кнопку "Revoke" (деактивация без ротации) и экспорт CSV usage? Скажи: «revoke + csv — одним постом» 🚀**


