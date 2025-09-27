# 🎯 Финальный чек-лист: доводим до идеала

## 🚀 **Быстрый фикс "VIP-страницы" на .ru (5 шагов)**

### **1. Отвязать `lifeundo.ru` от Vercel**
- [ ] Vercel → Project → Domains → **Remove** `lifeundo.ru`
- [ ] Cloudflare: проверить прокси "🟧" включён

### **2. Привязать `lifeundo.ru` к Beget-приложению**
- [ ] Beget: домен → то же Node.js-приложение, что `getlifeundo.com`
- [ ] Удалить/переименовать любой `index.html` старого хостинга

### **3. Очистить кэш и выключить "Always Online"**
- [ ] Cloudflare → Caching → **Purge Everything**
- [ ] **Dev Mode ON** на 3 часа
- [ ] Always Online → **OFF**

### **4. Проверить заголовки (нет Vercel)**
```bash
curl -I -L https://lifeundo.ru/ | grep -Ei "cf-cache-status|x-vercel|server"
```
**Ожидаемо:**
- ✅ `CF-Cache-Status: DYNAMIC|MISS`
- ❌ **НЕТ** `X-Vercel-Cache`

### **5. Снять временный редирект .ru→.com**
- [ ] Cloudflare → Rules → Redirect Rules → **Delete** emergency redirect
- [ ] Контроль: `https://lifeundo.ru/status` и `https://getlifeundo.com/status` показывают `App version: 0.4.1`

## 🔧 **Совместимость API (приложение не ломается)**

### **Оба набора путей работают:**
- ✅ **Новые:** `/api/v1/licenses/{validate|activate}`, `/api/v1/usage`
- ✅ **Legacy:** `/api/license/{validate|activate}` (совместимы)

### **Тест совместимости:**
```bash
# Новый путь
curl -X POST https://lifeundo.ru/api/v1/licenses/validate \
  -H "Authorization: Bearer <API_KEY>" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'

# Legacy путь
curl -X POST https://lifeundo.ru/api/license/validate \
  -H "Authorization: Bearer <API_KEY>" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'
```

**Оба должны возвращать одинаковый ответ.**

## 📱 **Быстрый QA расширения (Firefox 0.3.7.11)**

### **1. Загрузка временно**
- [ ] `about:debugging` → This Firefox → Load Temporary Add-on → `manifest.json`

### **2. Активация VIP (оффлайн .lifelic)**
- [ ] Попап «Активировать VIP» → `options.html`
- [ ] Импорт `.lifelic` → Verify → VIP бейдж

### **3. Локализация**
- [ ] RU/EN переключение меняет «What's new» и футер

### **4. Кнопка PRO**
- [ ] RU → `/pricing`
- [ ] EN → `/en/pricing`

### **5. Сеть стабильна**
- [ ] Отключить интернет → оффлайн-лицензия не падает
- [ ] UI предлагает «попробовать позже»

### **6. Смоук серверных эндпоинтов**
```bash
curl -X POST https://lifeundo.ru/api/v1/licenses/validate \
  -H "Authorization: Bearer <RAW_API_KEY>" -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'

# Проверить usage растет
curl -H "Authorization: Bearer <RAW_API_KEY>" \
  https://lifeundo.ru/api/v1/usage
```

## 🔧 **Что ещё доводим (рекомендуется)**

### **Monitoring**
- [ ] Добавить `SENTRY_DSN` в Beget
- [ ] Ребилд приложения
- [ ] UptimeRobot на `/api/_health` и `/api/_health/db`

### **Cloudflare**
- [ ] WAF-правило на `/admin|/drizzle` (Block/Challenge)
- [ ] Rate Limiting `/api/*` (120 rps, ban 5m)

### **Security hygiene**
- [ ] Ротация `BASIC_AUTH_PASS`, `FK_SECRET2`, `DB_PASSWORD` раз в 60–90 дней

## 🚨 **Если всё ещё "VIP лицензия"**

**Гарантированно остаток статики:**
```bash
# В Beget файловом менеджере
rm -rf .next
npm run build
npm start
```

## ✅ **Финальная проверка**

### **Домены работают одинаково:**
- [ ] `https://lifeundo.ru/` = `https://getlifeundo.com/`
- [ ] `https://lifeundo.ru/status` = `https://getlifeundo.com/status`
- [ ] `https://lifeundo.ru/partners` = `https://getlifeundo.com/partners`
- [ ] `https://lifeundo.ru/developers` = `https://getlifeundo.com/developers`

### **API endpoints работают:**
- [ ] `/api/v1/licenses/validate` - новый
- [ ] `/api/v1/licenses/activate` - новый
- [ ] `/api/license/validate` - legacy
- [ ] `/api/license/activate` - legacy
- [ ] `/api/v1/usage` - статистика

### **Приложение тестировано:**
- [ ] Firefox 0.3.7.11 загружается
- [ ] VIP активация работает
- [ ] Локализация работает
- [ ] Оффлайн режим стабилен
- [ ] Серверные вызовы работают

---

## 🎉 **ГОТОВО К ПРОДАКШЕНУ!**

**После выполнения всех пунктов:**
- ✅ .ru домен исправлен
- ✅ Кэши чистые
- ✅ Приложение работает
- ✅ API совместимо
- ✅ Мониторинг настроен

**GetLifeUndo 0.4.1 идеально готов! 🚀**


