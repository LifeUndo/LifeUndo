# 🔥 Final API Commands - Супер-короткий финальный блок

## **0) (опционально) Вкл. строгий SSL + Dev Mode + Purge — через API**

```bash
# SSL: Full (strict)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"strict"}'

# Purge Everything
curl -sX POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'

# Development Mode ON (3h)
curl -sX PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/development_mode" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"value":"on"}'
```

## **1) (если нужно) убрать «левый» IPv6 (AAAA)**

```bash
# найти AAAA
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=getlifeundo.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id'

# удалить все найденные AAAA
curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=AAAA&name=getlifeundo.com" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[].id' | \
  xargs -I{} curl -sX DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/{}" \
    -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json"
```

## **2) (если LE не выпускается) — быстрый обход**

### **Временный вариант:**
- **Proxy OFF** на `@` и `www`
- Выпускаем **Let's Encrypt** на Beget
- Снова **Proxy ON**

### **Альтернатива без Proxy OFF:**
- Поставить **Cloudflare Origin Certificate** на Beget
- Оставить **Full (strict)**

## **3) Две контрольные команды (после правок)**

**Сразу прогоняй и кидай сюда вывод:**

```bash
dig @1.1.1.1 +short getlifeundo.com A
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

### **Ожидаем:**
- **A** → `<BEGET_IP>` (не 45.130.41.28)
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **нет** `x-vercel-*`

## **4) Быстрый смоук 0.4.2 (как только зелено)**

### **Проверки:**
- `/status` → **App version: 0.4.2**
- `/api/public/pricing` → JSON c планами (tenant-aware)
- `/admin/status` → включи баннер → виден на `/status`
- `/admin/emails` → «Отправить тест» → письмо приходит

## **🎯 ГОТОВО:**

**Если что-то не бьётся — пришли вывод двух команд из п.3, и я точечно укажу, что подкрутить! 🚀**


