# 🚨 Blockers Quick Fixes - Частые блокеры и мгновенные решения

## **🔧 ЧАСТЫЕ БЛОКЕРЫ И МГНОВЕННЫЕ РЕШЕНИЯ:**

### **1. AAAA осталась**
**Проблема:** IPv6 записи перетирают A записи
**Решение:** Удаляй/правь IPv6 или укажи на корректный origin/hostname
```bash
dig +short getlifeundo.com AAAA
```

### **2. NS не Cloudflare**
**Проблема:** NS записи у регистратора не указывают на Cloudflare
**Решение:** У регистратора выставь `*.ns.cloudflare.com`
```bash
dig NS getlifeundo.com +short
```

### **3. DNSSEC/CAA мешают LE**
**Проблема:** DNSSEC или CAA блокируют выпуск Let's Encrypt
**Решение:** 
- На время выпуска **отключи DNSSEC**
- Или добавь `CAA: 0 issue "letsencrypt.org"`
```bash
dig +short CAA getlifeundo.com
```

### **4. LE не ставится за прокси**
**Проблема:** Let's Encrypt не может валидировать домен за Cloudflare Proxy
**Решение:** 
- Временно **Proxy OFF** на `@` и `www`
- Выпусти LE
- Затем **Proxy ON**

### **5. Кэш**
**Проблема:** Старые кэши показывают устаревший контент
**Решение:** 
- Всегда **Purge Everything**
- Добавляй `?cb=$(date +%s)` при проверках

## **🎯 ГОТОВО:**

**Все блокеры устранены! DNS исправлен! 🚀**


