# 🚨 Anti-Gotchas Checklist - Топ-5 залипов

## **🔍 ТОП-5 АНТИ-ЗАЛИПОВ (часто мешают SSL/DNS):**

### **1. AAAA-запись осталась и указывает не туда:**
```bash
dig +short getlifeundo.com AAAA
```
**Если есть левые IPv6 — удали или укажи на Beget/hostname**

### **2. NS не Cloudflare у регистратора:**
```bash
dig NS getlifeundo.com +short
```
**Должны быть два `*.ns.cloudflare.com`**

### **3. DNSSEC включён у регистратора, а в Cloudflare — нет (или наоборот):**
**Приведи к единому состоянию (обычно OFF на время миграции)**

### **4. CAA блокирует выпуск LE:**
```bash
dig +short CAA getlifeundo.com
```
**Добавь при необходимости `0 issue "letsencrypt.org"`**

### **5. Старые кэши:**
**Всегда делай `Purge Everything` и добавляй `?cb=$(date +%s)` к URL на время проверки**

## **🔧 ДОПОЛНИТЕЛЬНЫЕ ПРОВЕРКИ:**

### **6. Проверить цепочку TLS на origin:**
```bash
openssl s_client -servername getlifeundo.com -connect <BEGET_IP>:443 -showcerts | head -n 25
```
**Должен вернуться валидный сертификат для getlifeundo.com**

### **7. Проверить все типы записей:**
```bash
dig +short getlifeundo.com ANY
```
**Убедись что нет лишних записей**

### **8. Проверить CNAME chain:**
```bash
dig +trace getlifeundo.com
```
**Убедись что цепочка разрешения корректна**

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] DNS указывает на Beget (НЕ 45.130.41.28)
- [ ] NS записи = Cloudflare
- [ ] AAAA записи исправлены
- [ ] DNSSEC отключен
- [ ] CAA не блокирует LE
- [ ] Кэш очищен
- [ ] SSL сертификат валиден
- [ ] Заголовки показывают Cloudflare

## **🎯 ГОТОВО:**

После устранения всех залипов:
- ✅ DNS работает корректно
- ✅ SSL/TLS стабилен
- ✅ Cloudflare проксирует трафик
- ✅ 0.4.2 доступен по HTTPS

**Anti-gotchas готовы! 🚀**


