# 🚀 Deploy 0.4.2 - Чек-лист

## **📋 ЧТО СДЕЛАТЬ ПРЯМО СЕЙЧАС:**

### **1. ENV на Beget (SMTP):**
```
NEXT_PUBLIC_APP_VERSION=0.4.2
SMTP_HOST=...
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM="LifeUndo <support@lifeundo.ru>"
```

> Если 465 закрыт — поставь `SMTP_PORT=587`, оно тоже ок.

### **2. Сборка/запуск:**
```bash
npm run build
npm start
```

### **3. Сидинг "по умолчанию" (опционально, если пусто):**
```sql
-- баннер (деактивирован)
WITH t AS (SELECT id FROM tenants WHERE slug='lifeundo')
INSERT INTO status_banners (tenant_id,active,title,message)
SELECT t.id,false,'—','—' FROM t
ON CONFLICT DO NOTHING;

-- email шаблон test
WITH t AS (SELECT id FROM tenants WHERE slug='lifeundo')
INSERT INTO email_templates (tenant_id,"key",subject,body_md)
SELECT t.id,'payment_succeeded','Оплата получена','**Спасибо, {{customer}}!** Платёж принят.' FROM t
ON CONFLICT DO NOTHING;
```

## **🧪 БЫСТРЫЙ СМОУК 0.4.2 (2 минуты):**

### **1. /partners:**
- ✅ Видна таблица тарифов
- ✅ Суммы/валюта подтягиваются

### **2. /api/public/pricing:**
- ✅ Отдает JSON с эффективными планами (tenant-aware)

### **3. /admin/status:**
- ✅ Включи баннер → он появился на **/status**

### **4. /admin/emails:**
- ✅ Сохрани шаблон и нажми «Отправить тест» (письмо приходит)

## **🔧 cURL для писем (если удобнее руками):**

```bash
# upsert шаблона
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

# тест-отправка
curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **🛡️ КОНТРОЛЬ БЕЗОПАСНОСТИ (быстро):**

### **1. /api/public/pricing:**
- ✅ Публичный, но не содержит секретов (только планы/цены). Ок.

### **2. /admin/:**
- ✅ По-прежнему закрыт BasicAuth (+ IP whitelist)

### **3. SMTP:**
- ✅ Храним только в ENV (не в репо). Права — read-only владельцу процесса

## **📦 ПУБЛИКАЦИЯ SDK (когда будешь готов):**

### **1. JS (npm):**
```bash
cd packages/lifeundo-js
npm login
npm publish --access public
```

### **2. Python (PyPI):**
```bash
cd packages/lifeundo-python
python -m build
twine upload dist/*
```

После публикации — добавим реальные ссылки на `/developers`.

## **🚨 ЕСЛИ ЧТО-ТО «НЕ ЛЕТИТ»:**

### **1. Письма не уходят:**
- Проверь `SMTP_*` и порт (465↔587), а также `MAIL_FROM`

### **2. Баннер не виден:**
- Обнови страницу `/status` без кэша `?cb=$(date +%s)`

### **3. Цены не меняются:**
- Проверь, есть ли записи в `tenant_plans` (если нет — берётся `plans`)

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] ENV обновлен (версия + SMTP)
- [ ] Build успешен
- [ ] /partners показывает таблицу тарифов
- [ ] /api/public/pricing отдает JSON
- [ ] /admin/status управляет баннерами
- [ ] /admin/emails управляет шаблонами
- [ ] Тест-письмо приходит
- [ ] Безопасность проверена

## **🎯 ГОТОВО К ПРОДАКШЕНУ:**

После прохождения всех пунктов:
- ✅ 0.4.2 — зелёный релиз
- ✅ Per-tenant pricing работает
- ✅ Admin UI функционален
- ✅ Email шаблоны работают
- ✅ Безопасность настроена

**GetLifeUndo 0.4.2 готов к продакшену! 🚀**

