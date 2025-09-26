# 🔧 Миграция домена: Vercel → Beget

## **2.1 ОТКРЕПИТЬ ДОМЕН ОТ VERCEL**

### **Vercel Dashboard:**
1. Зайти в **Project** с `lifeundo.ru`
2. **Settings** → **Domains**
3. **Remove** `lifeundo.ru`
4. **Remove** `www.lifeundo.ru`
5. Подтвердить удаление

## **2.2 ПЕРЕПРИВЯЗАТЬ К BEGET**

### **Beget Panel:**
1. **Домены** → найти `lifeundo.ru`
2. **Привязка** → выбрать **то же Node.js приложение**, что обслуживает `getlifeundo.com`
3. Сохранить настройки

### **Cloudflare DNS:**
1. **DNS** → **Records**
2. `lifeundo.ru` → **A** запись на Beget IP
3. `www.lifeundo.ru` → **CNAME** на `lifeundo.ru`
4. **Proxy** → 🟧 **ON** (оранжевая тучка)

### **SSL/TLS:**
1. **SSL/TLS** → **Overview**
2. **Encryption mode** → **Full (strict)**

## **2.3 ОЧИСТИТЬ КЭШ**

### **Cloudflare Caching:**
1. **Caching** → **Configuration**
2. **Purge Everything**
3. **Development Mode** → **ON** (3 часа)
4. **Always Online** → **OFF**

## **2.4 ВАЛИДАЦИЯ**

```bash
curl -I -L https://lifeundo.ru/ | grep -Ei "server|cf-cache-status|x-vercel"
```

**ОЖИДАЕМО:**
- ✅ `server: cloudflare`
- ✅ `cf-cache-status: DYNAMIC|MISS`
- ❌ **НЕТ** `x-vercel-*`

**ПРОБЛЕМА РЕШЕНА:** Домен теперь на Beget!

