# 💚 Final Step - Летим к финишу

## **1) Запуск green-check**

### **Убедись, что в `green-check.sh` подставлен реальный `BEGET_IP`:**
```bash
# В файле green-check.sh замени:
BEGET_IP="<BEGET_IP>"          # ← подставь реальный IP Beget

# На реальный IP:
BEGET_IP="123.456.789.012"     # ← реальный IP Beget
```

### **Запусти:**
```bash
bash green-check.sh
```

### **Скопируй сюда два блока из вывода:**
- `getlifeundo.com` — строки PASS/FAIL
- `lifeundo.ru` — строки PASS/FAIL

## **2) Если вдруг что-то красное — мгновенные фиксы**

### **A не на Beget / есть AAAA:**
- Правим DNS (A @ = BEGET_IP, CNAME www → apex, Proxy ON)
- AAAA убрать
- Purge, Dev Mode ON

### **Есть `x-vercel-*`:**
- Удалить все CNAME на `*.vercel.app`
- Проверить NS = `*.ns.cloudflare.com`
- Purge

### **SSL:**
- Proxy OFF → Let's Encrypt на Beget → Proxy ON → SSL=Full(strict)
- **Или** поставить **Cloudflare Origin Cert** (прокси оставляем ON)

### **`/status` ≠ `0.4.2`:**
- Пересборка на Beget:
```bash
rm -rf .next && npm run build && npm start
```

## **3) (Опционально) доп-проверка цепочки TLS**

```bash
echo | openssl s_client -servername getlifeundo.com -connect getlifeundo.com:443 -showcerts \
| openssl x509 -noout -issuer -subject -dates
```

**Ожидаем валидные даты и корректный CN/SAN для домена.**

## **🎯 ГОТОВО:**

**Готов принять вывод `green-check` по .com и .ru — после этого дадим финальный вердикт «зелено» и закроем 0.4.2! 🚀**


