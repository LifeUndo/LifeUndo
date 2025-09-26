# 🎯 Control Commands - Две контрольные команды

## **3) Две контрольные команды (после правок)**

**Сразу прогоняй и кидай сюда вывод:**

### **1. Проверка DNS:**
```bash
dig @1.1.1.1 +short getlifeundo.com A
```

### **2. Проверка заголовков:**
```bash
curl -I -H "Cache-Control: no-cache" -L "https://getlifeundo.com/?cb=$(date +%s)" | \
  sed -n '1p;/^server:/Ip;/^cf-cache-status:/Ip;/^x-vercel/Ip'
```

## **✅ Ожидаем:**

### **1. DNS:**
- **A** → `<BEGET_IP>` (не 45.130.41.28)

### **2. Заголовки:**
- `server: cloudflare`
- `cf-cache-status: DYNAMIC|MISS`
- **нет** `x-vercel-*`

## **🚨 Если что-то не бьётся:**

**Пришли вывод двух команд из п.3, и я точечно укажу, что подкрутить!**

## **🎯 ГОТОВО:**

**Две строки — и я скажу «зелено»! 🚀**

