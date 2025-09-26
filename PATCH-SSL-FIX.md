# 📋 ТЗ для Cursor: фиксы Vercel/DNS/SSL

## 🎯 Цель

Привязать домен `getlifeundo.com` к проекту в Vercel, выпустить SSL и включить рабочую конфигурацию, чтобы сайт открывался без 401/SSL ошибок.

## 🔧 Задачи для Cursor

### 1. Vercel → Project → Settings → Domains

* Проверить, что к проекту прикреплены оба домена:
  * `getlifeundo.com`
  * `www.getlifeundo.com`
* Если нет → добавить.

### 2. Проверить DNS-конфигурацию

* Apex (`getlifeundo.com`) → A-запись на `76.76.21.21`
* `www.getlifeundo.com` → CNAME → `cname.vercel-dns.com`
* Если DNS не совпадает → исправить.

### 3. SSL Certificates

* В блоке **SSL Certificates** → нажать **Pre-generate SSL Certificates**.
* Скопировать TXT-записи → проверить, что они уже есть в Beget DNS (там мы добавили `_acme-challenge`).
* Нажать **Verify**.

### 4. Refresh Domains

* После успешной валидации → нажать **Refresh / Validate** для домена в разделе Domains.
* Убедиться, что оба домена показывают статус **Valid Configuration** и появился активный сертификат в таблице SSL.

### 5. Финальная проверка

* Выполнить:
  ```bash
  curl -I https://getlifeundo.com/
  curl -I https://www.getlifeundo.com/
  ```
* Ожидание: `HTTP/1.1 200 OK`, `server: Vercel`, валидный SSL.

## ✅ Критерии успешности

* `getlifeundo.com` и `www.getlifeundo.com` открываются с валидным SSL (Let's Encrypt).
* В разделе Domains → **Valid Configuration**.
* В разделе SSL Certificates → хотя бы один активный сертификат.
* Проверка curl возвращает `200 OK`.

## 🚨 Важные моменты

* DNS уже настроен в Cloudflare (nameservers: `ada.ns.cloudflare.com`, `buck.ns.cloudflare.com`)
* Ожидаем обновления у регистратора (до 24 часов)
* TXT-записи для ACME уже добавлены в Beget DNS
* Проект защищен Vercel SSO - нужно отключить или настроить Public Paths

## 📝 Отчет о выполнении

После выполнения прислать:
1. Статус доменов в Vercel (Valid Configuration)
2. Статус SSL сертификатов (Active)
3. Результаты curl тестов
4. Номер последнего деплоя
