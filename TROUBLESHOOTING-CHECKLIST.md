# 🔧 Чек-лист залипов и решений

## **🚨 Частые залипы и как снять:**

### **1. Всё ещё Vercel в заголовках:**

#### **Причина:**
- NS не Cloudflare **или** в Cloudflare записи ещё смотрят на Vercel/GitHub

#### **Решение:**
- Проверить NS записи у регистратора
- Исправить DNS записи в Cloudflare
- Включи Proxy (оранжевая тучка)
- Purge Everything
- Dev Mode ON
- Добавить `?cb=$(date +%s)` в URL

#### **Проверка:**
```bash
dig NS lifeundo.ru +short
dig +short lifeundo.ru A
curl -I https://lifeundo.ru/
```

### **2. SSL ошибка:**

#### **Причина:**
- На Beget не выпущен сертификат для домена

#### **Решение:**
- Выпусти Let's Encrypt для `.ru/.com` в панели Beget
- Держим в Cloudflare «Full (strict)»

#### **Проверка:**
```bash
curl -I https://lifeundo.ru/
# Должен показать валидный SSL
```

### **3. Старая статика/NotFound:**

#### **Причина:**
- На Beget мог лежать `index.html` рядом с приложением

#### **Решение:**
```bash
# На сервере Beget:
rm -rf .next
rm -f index.html
npm run build
npm start
```

#### **Проверка:**
```bash
curl -s https://lifeundo.ru/status
# Должен показать App version: 0.4.1
```

### **4. DNS не обновляется:**

#### **Причина:**
- NS записи не Cloudflare
- Кэш DNS не очистился

#### **Решение:**
- Проверить NS записи у регистратора
- Подождать 5-30 минут
- Очистить кэш браузера
- Попробовать другой DNS (8.8.8.8)

#### **Проверка:**
```bash
dig +short lifeundo.ru A
# Должен показать Beget IP
```

### **5. Cloudflare правила не работают:**

#### **Причина:**
- Домен не "Active" в Cloudflare
- Proxy статус OFF

#### **Решение:**
- Проверить NS записи
- Включить Proxy (оранжевая тучка)
- Убедиться что домен "Active"

#### **Проверка:**
```bash
curl -I https://lifeundo.ru/
# Должен показать server: cloudflare
```

## **🔍 ДИАГНОСТИКА:**

### **1. Проверка DNS:**
```bash
# NS записи
dig NS lifeundo.ru +short

# A записи
dig +short lifeundo.ru A
dig +short www.lifeundo.ru CNAME
```

### **2. Проверка заголовков:**
```bash
# Заголовки без кэша
curl -I -H "Cache-Control: no-cache" -L "https://lifeundo.ru/?cb=$(date +%s)"
```

### **3. Проверка контента:**
```bash
# Версия приложения
curl -s https://lifeundo.ru/status | grep -i "App version"

# API endpoints
curl -s https://lifeundo.ru/api/_health
```

## **✅ КРИТЕРИИ ГОТОВНОСТИ:**

- [ ] NS записи = Cloudflare
- [ ] DNS записи исправлены
- [ ] Заголовки без Vercel
- [ ] SSL работает
- [ ] Контент доступен
- [ ] API работают
- [ ] Admin защищен

## **🚀 ГОТОВО:**

После устранения всех залипов:
- ✅ Проблема "VIP лицензия" решена
- ✅ Оба домена работают корректно
- ✅ API совместимость обеспечена
- ✅ FreeKassa без изменений
- ✅ Vercel для превью

**GetLifeUndo 0.4.1 идеально готов! 🚀**

