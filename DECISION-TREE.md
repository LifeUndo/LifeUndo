# 🌳 Decision Tree - Дерево решений

## **🔍 Разбор результатов (decision tree)**

### **Команда 1:**
```bash
dig @1.1.1.1 +short getlifeundo.com A
```

#### **✅ Если видишь `<BEGET_IP>`:**
- **ОК, DNS попал куда нужно** → переходи к Команде 2

#### **❌ Если всё ещё `45.130.41.28` или другое:**
- Повтори шаг «удалить A @» и «создать A @ = <BEGET_IP> (proxied)»
- Проверь, что **нет AAAA**
- Снова `Purge Everything`
- Повтори проверку

### **Команда 2:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

#### **✅ Ожидаем:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **нет** `x-vercel-*`

#### **❌ Если видишь `x-vercel-*`:**
- Где-то остался CNAME на Vercel либо NS не Cloudflare
- **Действия:**
  - Удалить CNAME на `*.vercel.app`
  - Проверить `dig NS getlifeundo.com +short` (должны быть две `*.ns.cloudflare.com`)
  - Purge + Dev Mode ON

#### **❌ Если SSL-ошибка:**
- На Beget ещё нет валидного сертификата
- **Временный путь:**
  - **Proxy OFF** на `@` и `www`
  - Выпустить **Let's Encrypt**
  - Снова **Proxy ON**
  - SSL в Cloudflare = **Full (strict)**
- **Альтернатива:**
  - Поставить **Cloudflare Origin Certificate** на Beget (без Proxy OFF)
  - Затем **Full (strict)**

## **🎯 ГОТОВО:**

**Если хочешь, пришли два вывода (A-запись и заголовки) — отвечу «зелено»/что подкрутить точечно! 🚀**


