# 🔧 Вариант B - API отдельно на Beget

## **📋 ЕСЛИ ПОТОМ ЗАХОЧЕШЬ ВЕРНУТЬ ВИТРИНУ НА VERCEL:**

### **1. DNS для API домена:**
```
Type,Name,Content,TTL,Proxy
A,api.getlifeundo.com,<BEGET_IP>,Auto,Proxied
CNAME,www.api,api.getlifeundo.com,Auto,Proxied
```

### **2. vercel.json с проксей:**
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.getlifeundo.com/api/$1"
    }
  ]
}
```

### **3. FreeKassa webhook:**
- Изменить на `https://api.getlifeundo.com/api/fk/notify`
- Обновить в панели FreeKassa

### **4. Чек-лист для FK:**
- [ ] Webhook URL изменен
- [ ] Тест webhook прошел
- [ ] Логи показывают успех

## **🎯 ПРЕИМУЩЕСТВА ВАРИАНТА B:**

- ✅ Витрина на Vercel (быстро, красиво)
- ✅ API на Beget (безопасно, мощно)
- ✅ Разделение ответственности
- ✅ Масштабируемость

## **📁 ГОТОВЫЕ ФАЙЛЫ:**

- `VARIANT-B-API-SEPARATION.md` - этот файл
- `CLOUDFLARE-DNS-RECORDS-API-ONLY.csv` - DNS для API домена
- `vercel.json.proxy` - конфиг с проксей

## **🚀 РЕКОМЕНДАЦИЯ:**

**Сейчас используй Вариант A** - проще, быстрее, безопаснее.

**Вариант B** - для будущего, если понадобится разделение.

**Исправь DNS записи сейчас - и проблема решится! 🚨**


