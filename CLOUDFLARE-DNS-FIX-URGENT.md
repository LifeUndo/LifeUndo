# 🚨 СРОЧНО: Cloudflare DNS Fix для getlifeundo.com

## Текущая проблема:
- getlifeundo.com → 45.130.41.28 (НЕПРАВИЛЬНО)
- Должен быть → 76.76.21.21 (Vercel)

## Пошаговое исправление:

### 1. Войти в Cloudflare Dashboard
- Перейти на https://dash.cloudflare.com
- Выбрать зону `getlifeundo.com`

### 2. DNS записи - ОБНОВИТЬ:
```
Тип: A
Имя: getlifeundo.com
IPv4 адрес: 76.76.21.21
TTL: Auto
Proxy status: Proxied (оранжевое облако)

Тип: CNAME  
Имя: www
Содержимое: cname.vercel-dns.com
TTL: Auto
Proxy status: Proxied (оранжевое облако)
```

### 3. Удалить старые записи:
- Найти и УДАЛИТЬ любые записи с IP 45.130.41.28
- Удалить дублирующие A/CNAME записи

### 4. SSL/TLS настройки:
- SSL/TLS → Overview → Mode: **Full (strict)**
- Edge Certificates → включить "Always Use HTTPS"

### 5. Очистить кеш:
- Caching → Configuration → Purge Everything

## Проверка после изменений:
```bash
nslookup getlifeundo.com
# Должно показать: 76.76.21.21
```

**⏰ Время применения: 1-5 минут**

