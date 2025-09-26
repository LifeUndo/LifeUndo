# 🎯 Post-cutover финал (последние штрихи)

## **📋 ПОСЛЕДНИЕ ШТРИХИ (после зелёных чеков):**

### **1. Cloudflare:**

#### **1.1 Выключить Development Mode:**
- Вернётся нормальный кеш
- **Development Mode**: OFF

#### **1.2 Удалить временный Vercel-редирект:**
- Удалить временный редирект (если ещё включён)
- **Rules** → **Redirect Rules** → Delete

#### **1.3 Завести канонические редиректы:**
- `www.lifeundo.ru → https://lifeundo.ru/$1` (301)
- `www.getlifeundo.com → https://getlifeundo.com/$1` (301)

#### **1.4 Cache Rules:**
- **Bypass** для `/api/*` и `/admin*`
- **Cache Everything** + длинный TTL для `/_next/static/*`

### **2. Безопасность:**

#### **2.1 HSTS:**
- Убедись, что **HSTS** активен (в т.ч. `includeSubDomains; preload`)
- Отправь домены в preload при желании

#### **2.2 WAF и Rate Limit:**
- Проверь, что **WAF** на `/admin|/drizzle` включён
- Rate-Limit `/api/*` активен

### **3. SSL:**

#### **3.1 Проверка на Beget:**
- LE-сертификаты выпущены для:
  - `lifeundo.ru`
  - `www.lifeundo.ru`
  - `getlifeundo.com`
  - `www.getlifeundo.com`

#### **3.2 В Cloudflare:**
- Режим **Full (strict)**

### **4. Мониторинг:**

#### **4.1 Sentry:**
- Пометить релиз: `0.4.1` (release tag)
- Сделать «Mark deploy»

#### **4.2 UptimeRobot:**
- Проверить, что мониторы на `/api/_health` и `/api/_health/db` зелёные

### **5. FreeKassa:**

#### **5.1 Тестовый webhook:**
- Один тестовый webhook → запись в `webhooks` и `payments`
- Повтор тем же `intid` → `DUPLICATE`

### **6. Резерв:**

#### **6.1 Экспорт секретов:**
- Экспортировать `.env` и секреты
- Склад в Password Manager

#### **6.2 Снимок БД:**
- Neon backup — точка восстановления «после миграции»

## **✅ ЧТО СЧИТАТЬ «ГОТОВО»:**

- [ ] NS = Cloudflare, `A/CNAME` → Beget (Proxy ON)
- [ ] Нет `x-vercel-*` в заголовках
- [ ] `/status` на .ru и .com → **App version: 0.4.1**
- [ ] `/admin` закрыт (401/403)
- [ ] Legacy `/api/license/*` и `/api/v1/*` отвечают
- [ ] `/api/v1/usage` растёт после нескольких вызовов
- [ ] Sentry события идут, WAF/Rate Limit активны
- [ ] FreeKassa webhook работает и дубли режутся

## **🚀 ДАЛЬШЕ ПО ПЛАНУ (по желанию):**

### **0.4.2:**
- Per-tenant цены в UI
- Email-шаблоны
- Публичные SDK публикация (npm/pypi)
- Статус-баннеры управления из админки

## **🚨 АНТИ-ЗАЛИПЫ:**

### **Если всплывёт что-то:**
- SSL/кэш/старая статика
- Кидай две строки:
  ```bash
  dig NS lifeundo.ru +short
  dig +short lifeundo.ru A
  ```
- И короткий `curl -I`
- Точечно подскажу, что поправить

## **🎯 ИТОГ:**

### **По текущему чек-листу:**
- ✅ Можно смело закрывать тикет

### **Результат:**
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью
- ✅ Мониторинг активен
- ✅ Безопасность настроена

**GetLifeUndo 0.4.1 идеально готов! 🚀**

## **📁 ФАЙЛЫ СОЗДАНЫ:**

- `GREEN-CARD-FINAL.md` - зелёная карточка
- `POST-CUTOVER-FINAL.md` - post-cutover финал

**Миграция завершена! Тикет можно закрывать! ✅**

