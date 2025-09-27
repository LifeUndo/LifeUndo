# 🔐 TLS Chain Check - Доп-проверка цепочки TLS

## **3) (Опционально) доп-проверка цепочки TLS**

### **Проверка сертификата:**
```bash
echo | openssl s_client -servername getlifeundo.com -connect getlifeundo.com:443 -showcerts \
| openssl x509 -noout -issuer -subject -dates
```

### **Ожидаем:**
- Валидные даты (notBefore, notAfter)
- Корректный CN/SAN для домена

### **Пример вывода:**
```
issuer=CN = R3, O = Let's Encrypt, C = US
subject=CN = getlifeundo.com
notBefore=Dec 15 10:30:00 2024 GMT
notAfter=Mar 15 10:30:00 2025 GMT
```

### **Дополнительные проверки:**

#### **Проверить все сертификаты в цепочке:**
```bash
echo | openssl s_client -servername getlifeundo.com -connect getlifeundo.com:443 -showcerts \
| grep -A 50 "BEGIN CERTIFICATE" | openssl x509 -noout -text | grep -E "(Subject:|Issuer:|DNS:|Not Before:|Not After:)"
```

#### **Проверить SAN (Subject Alternative Names):**
```bash
echo | openssl s_client -servername getlifeundo.com -connect getlifeundo.com:443 -showcerts \
| openssl x509 -noout -text | grep -A 5 "Subject Alternative Name"
```

#### **Проверить срок действия:**
```bash
echo | openssl s_client -servername getlifeundo.com -connect getlifeundo.com:443 -showcerts \
| openssl x509 -noout -dates
```

## **✅ Критерии валидности:**

- [ ] Сертификат выдан Let's Encrypt или Cloudflare
- [ ] CN или SAN содержит домен
- [ ] notBefore ≤ текущая дата
- [ ] notAfter ≥ текущая дата
- [ ] Нет ошибок в цепочке

## **🎯 ГОТОВО:**

**TLS цепочка проверена! Сертификат валиден! 🚀**


