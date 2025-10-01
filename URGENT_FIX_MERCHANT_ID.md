# 🚨 СРОЧНО: Исправить Merchant ID в Vercel

## ❌ Проблема:
В ENV переменных указан **неправильный Merchant ID**!

## ✅ Решение:

### В Vercel → Settings → Environment Variables:

**Измените `FREEKASSA_MERCHANT_ID`:**
- **Было (неправильно):** `54c3ac0581ad5eeac3fbee2ffac83f6c`
- **Должно быть:** `66046`

### Для всех окружений (All Environments)

## 🚀 После изменения:
1. **Redeploy Production**
2. **Тестируйте оплату**
3. **Должно заработать!**

---

**Это была основная причина ошибки `validation.custom.merchant.not_found`!**
