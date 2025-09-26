# ✅ **Multi-tenant Checklist**

## 🚀 **Быстрая проверка (5 шагов)**

### **1. Миграции**
```bash
npm run db:migrate
```
✅ Схема обновлена, новые таблицы созданы

### **2. Сидинг (Neon console)**
```sql
-- Выполнить seed.multitenant.sql
```
✅ Баннеры и ACME tenant созданы

### **3. Проверка статуса**
- Открыть `/status` на .com/.ru
- ✅ Видны одинаковые версия/баннер
- ✅ Баннер "All systems nominal"

### **4. API тестирование**
```bash
# Создать API-ключ
curl -u "admin:password" -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Key","planCode":"pro"}' \
  https://getlifeundo.com/api/admin/keys

# Тестировать API
curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key":"LIFE-TEST-0000-0000"}'

# Проверить usage
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://getlifeundo.com/api/v1/usage
```
✅ API работает, usage растет

### **5. Баннер тест**
```sql
-- Включить баннер для lifeundo
UPDATE status_banners 
SET active=true, title='Техработы', message='Система обновляется' 
WHERE tenant_id=(SELECT id FROM tenants WHERE slug='lifeundo');
```
✅ `/status` показывает баннер

## 🔧 **Дополнительные проверки**

### **Tenant Resolution**
```bash
# Проверить разные домены
curl -H "Host: getlifeundo.com" https://your-app.com/api/_health
curl -H "Host: lifeundo.ru" https://your-app.com/api/_health
```
✅ Оба возвращают одинаковый результат

### **Usage Tracking**
```bash
# Сделать несколько API вызовов
for i in {1..5}; do
  curl -X POST https://getlifeundo.com/api/v1/licenses/validate \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"key":"LIFE-TEST-0000-0000"}'
done

# Проверить usage
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://getlifeundo.com/api/v1/usage
```
✅ `monthCalls` увеличился

### **ACME Tenant**
```sql
-- Проверить ACME tenant
SELECT * FROM tenants WHERE slug='acme';
SELECT * FROM tenant_domains WHERE tenant_id=(SELECT id FROM tenants WHERE slug='acme');
SELECT * FROM status_banners WHERE tenant_id=(SELECT id FROM tenants WHERE slug='acme');
```
✅ ACME tenant создан с баннером

## 🎯 **Production Ready**

- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Status page working
- [ ] API usage tracking functional
- [ ] Multi-tenant resolution working
- [ ] Banner system operational
- [ ] Environment variables set
- [ ] DNS configuration complete

## 🚀 **Next Steps**

1. **Per-tenant pricing**: Добавить `tenant_plans` в UI
2. **Email templates**: Подключить `email_templates`
3. **Advanced monitoring**: Tenant-specific metrics
4. **SDK distribution**: Publish npm/pip packages

---

**🎉 Multi-tenant system fully operational! 🚀**

