# 🚀 Ultra Short Final - Ультра-короткий финальный набор

## **⚡ Что сделать прямо сейчас (итого)**

### **1. Cloudflare DNS (оба домена):**

#### **Удалить всё лишнее:**
- `A @` не на Beget
- `CNAME` на vercel/github
- Любые `AAAA`

#### **Создать Proxy ON:**
- `A @ = <BEGET_IP>`
- `CNAME www = <apex>` (`getlifeundo.com` / `lifeundo.ru`)

### **2. SSL:**

#### **Cloudflare:**
- **Full (strict)**

#### **Beget:**
- Выпустить **Let's Encrypt** для apex+www
- Если мешает прокси — **Proxy OFF** на 10 мин, выпустить, вернуть **ON**
- **Или** поставить **Cloudflare Origin Cert**

### **3. Кэш:**

- **Purge Everything**
- **Development Mode ON** (3h)
- **Always Online OFF**

## **✅ Прими как «ЗЕЛЕНО», если:**

### **A-запись (не 45.130.41.28 и не vercel/github):**
```bash
dig @1.1.1.1 +short getlifeundo.com A
dig @1.1.1.1 +short lifeundo.ru A
```

### **Заголовки (через Cloudflare, без Vercel):**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)"     | sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

**Ожидаем:** `server: cloudflare`, `cf-cache-status: DYNAMIC|MISS`, **НЕТ** `x-vercel-*`

## **⚡ Молниеносный смоук 0.4.2 (после "зелено")**

### **1. Pricing JSON:**
```bash
curl -s https://getlifeundo.com/api/public/pricing | jq '.tenant,.plans[0]'
```

### **2. Статус + версия (и баннер, если включён):**
```bash
curl -s https://getlifeundo.com/status | grep -i -E 'App version|status|banner'
```

### **3. Тест письма (BasicAuth админки):**
```bash
# Сохранить шаблон
curl -s -X POST https://getlifeundo.com/api/admin/email-templates \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","subject":"Оплата получена","bodyMd":"**Спасибо, {{customer}}!** Платёж принят."}'

# Отправить тест
curl -s -X POST https://getlifeundo.com/api/admin/email-templates/test \
  -u admin:****** -H "Content-Type: application/json" \
  -d '{"key":"payment_succeeded","to":"you@example.com","vars":{"customer":"Иван"}}'
```

## **🚨 Частые блокеры → мгновенный фикс**

### **1. AAAA перетирает A:**
```bash
dig +short <domain> AAAA
```
**→ удаляем/правим IPv6**

### **2. NS не Cloudflare:**
```bash
dig NS <domain> +short
```
**→ должны быть `*.ns.cloudflare.com`**

### **3. LE не выдаётся:**
- Временно **Proxy OFF** (apex+www)
- Выпустить LE
- **Proxy ON**
- **Либо** ставим Origin Cert

### **4. CAA/DNSSEC:**
- На время выпуска выключить DNSSEC
- **Или** добавить `CAA: 0 issue "letsencrypt.org"`

### **5. Кэш:**
- Purge + `?cb=$(date +%s)` к URL

## **🎯 ГОТОВО:**

**Готов на финальную валидацию: как только сделаешь правки, кинь две строки на .com и две на .ru (A-запись и заголовки). Я скажу «зелено»/куда докрутить точечно, и сразу закрываем смоук 0.4.2! 🚀**

