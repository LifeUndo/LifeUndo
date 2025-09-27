# 🚀 Green Check - Финальный «убийца-залипов» для 0.4.2

## **📁 ФАЙЛЫ СОЗДАНЫ:**

1. **`green-check.sh`** - bash скрипт для Linux/macOS
2. **`green-check-windows.bat`** - batch скрипт для Windows
3. **`GREEN-CHECK-USAGE.md`** - инструкция по использованию
4. **`SSL-TROUBLESHOOTING.md`** - решение проблем с SSL

## **🔧 Как пользоваться:**

### **1. Подставь `BEGET_IP`:**
```bash
# В файле green-check.sh замени:
BEGET_IP="<BEGET_IP>"          # ← подставь реальный IP Beget

# На реальный IP:
BEGET_IP="123.456.789.012"     # ← реальный IP Beget
```

### **2. Запуск:**

#### **Linux/macOS:**
```bash
bash green-check.sh
```

#### **Windows:**
```cmd
green-check-windows.bat
```

### **3. Результат:**
- Если всё **PASS** → 0.4.2 принято
- Если есть **FAIL** — рядом уже подсказка, что именно поправить

## **🔍 Что проверяет скрипт:**

### **Для каждого домена (.com и .ru):**

#### **1. DNS → A (должен указывать на Beget):**
- Проверяет что A-запись указывает на `<BEGET_IP>`
- **FAIL:** если A-запись не на Beget IP

#### **2. Нет левых AAAA:**
- Проверяет отсутствие IPv6 записей
- **WARN:** если AAAA присутствуют (можно убрать/поправить)

#### **3. Заголовки (через Cloudflare, без Vercel):**
- **PASS:** `server: cloudflare`
- **PASS:** `cf-cache-status: DYNAMIC|MISS|BYPASS`
- **FAIL:** найден `x-vercel-*` (остались записи на Vercel?)

#### **4. /status → App version:**
- Проверяет что `/status` показывает `App version: 0.4.2`
- **FAIL:** если версия не 0.4.2

#### **5. pricing JSON доступен:**
- Проверяет что `/api/public/pricing` отвечает
- **FAIL:** если API не отвечает

## **🚨 Если упёрлось в SSL:**

### **Быстро:**
- **Proxy OFF** на `@` и `www`
- Выпусти **Let's Encrypt** на Beget
- **Proxy ON**
- SSL в Cloudflare = **Full (strict)**

### **Альтернатива:**
- Поставь **Cloudflare Origin Cert** на Beget (прокси оставляем ON)
- Затем **Full (strict)**

## **🎯 ГОТОВО:**

**Готов посмотреть итог — если пришлёшь вывод скрипта (без секретов/IP можно замазать), я точечно скажу, что ещё подкрутить!**

## **⚡ ПРИМЕР ВЫВОДА:**

```
— — — getlifeundo.com — — —
[PASS] A getlifeundo.com = 123.456.789.012
[PASS] AAAA getlifeundo.com отсутствуют
[PASS] Server: cloudflare
[PASS] cf-cache-status OK
[PASS] Нет x-vercel-*
[PASS] /status = 0.4.2
[PASS] /api/public/pricing отвечает

— — — lifeundo.ru — — —
[PASS] A lifeundo.ru = 123.456.789.012
[PASS] AAAA lifeundo.ru отсутствуют
[PASS] Server: cloudflare
[PASS] cf-cache-status OK
[PASS] Нет x-vercel-*
[PASS] /status = 0.4.2
[PASS] /api/public/pricing отвечает

========================================
[PASS] ALL GREEN — 0.4.2 принято ✅
```

## **🚀 ГОТОВО:**

**РАКЕТА! Финальный «убийца-залипов» для 0.4.2 готов! 🚀**


