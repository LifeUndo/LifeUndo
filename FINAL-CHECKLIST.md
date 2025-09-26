# 🎯 Final Checklist - Супер-чёткий финиш

## **🔍 Что жду от тебя**

**Прогони `green-check` и просто пришли два блока вывода (можно без реального IP):**

- `getlifeundo.com` — PASS/FAIL строки из скрипта
- `lifeundo.ru` — PASS/FAIL строки из скрипта

**По ним я сразу скажу «зелено» или дам точечный фикс.**

## **🚨 Если вдруг что-то красное — быстрые шпаргалки**

### **A не на Beget:**
- Правим A @
- Убираем AAAA
- Purge + Dev Mode ON

### **Есть `x-vercel-*`:**
- Где-то осталось на Vercel
- Убираем CNAME/старые NS
- Purge

### **SSL ошибается:**
- **Proxy OFF** (apex+www)
- **LE на Beget**
- **Proxy ON**
- **SSL=Full(strict)**
- **Или** ставим Cloudflare Origin Cert на Beget

### **/status ≠ 0.4.2:**
- Пересборка на Beget: `rm -rf .next && npm run build && npm start`

## **✅ После «ALL GREEN — 0.4.2 принято ✅»**

### **1. Cloudflare:**
- Dev Mode **OFF**
- Cache Rules: **Bypass** `/api/*`, `/admin*`; **Cache Everything** для `/_next/static/*`
- 301: `www → apex` на .com и .ru

### **2. Безопасность:**
- HSTS: `max-age=31536000; includeSubDomains; preload`
- SPF/DKIM/DMARC (повысит доставляемость):
  - SPF (TXT): `v=spf1 include:<smtp-провайдер> ~all`
  - DKIM: ключи из SMTP-панели (CNAME/TXT)
  - DMARC (TXT): `_dmarc v=DMARC1; p=none; rua=mailto:dmarc@lifeundo.ru`

### **3. Релизная фиксация:**
- Отметить релиз в Sentry (`0.4.2`)
- `RELEASE-NOTES-0.4.2.md` — приложить к тикету
- UptimeRobot: проверки `/api/_health` и `/api/_health/db`

## **🚀 Что готов сделать дальше (0.4.3 — компактно)**

- **Playwright e2e** для `/admin/status` и `/admin/emails` (минимальные смоуки)
- **Мини-дашборд usage** в админке (график вызовов/лимитов)
- **SDK публикация** (npm/PyPI) + кликабельные ссылки в `/developers`
- **UI полиш** прайсинга (бренд-цвета/логотипы из tenant)

## **🎯 ГОТОВО:**

**Кидай вывод `green-check` — добиваем зелёный и закрываем 0.4.2 окончательно! 💪**

