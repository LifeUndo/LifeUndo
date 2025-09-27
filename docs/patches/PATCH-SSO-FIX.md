# 📋 ТЗ для Cursor: исправление Vercel SSO

## 🎯 Цель

Отключить Vercel SSO/Access Control или настроить публичные исключения, чтобы сайт открывался без 401 ошибок.

## 🔧 Задачи для Cursor

### Вариант A — полностью снять защиту (быстрее всего)

1. **Vercel → Project → Settings → Security/Access Control**
2. Отключи защиту:
   * **Disable SSO** или **Disable Access Control/Password Protection**
3. Нажми **Save**

### Вариант B — оставить SSO, но разрешить публичные пути

Если SSO нужно сохранить для админки/превью, добавить **Public Paths**:

В **Project → Settings → Security/Access Control**:

* **Public Paths** (или **Path Exclusions**):
  ```
  /,
  /fund,
  /gov,
  /edu,
  /pricing,
  /buy,
  /demo,
  /ok,
  /api/_health/*,
  /api/fk/*,
  /_next/*,
  /favicon.ico,
  /robots.txt,
  /sitemap.xml
  ```
* Оставить защищёнными только:
  ```
  /admin/*,
  /partner/*,
  /api/admin/*,
  /api/private/*
  ```

### Если SSO включено на уровне команды/организации

* **Org/Team Settings → SSO/Access Control**: проверить, что не стоит «Enforce SSO on all Projects»
* Если стоит — либо отключить, либо добавить проект в исключения, либо задать Public Paths на уровне проекта

## ✅ Критерии успешности

После исправления SSO:

```bash
curl -I https://<preview_or_prod>/
curl -I https://<preview_or_prod>/fund
curl -i https://<preview_or_prod>/ok
curl -I https://<preview_or_prod>/admin
```

**Ожидаем:** 200/200/200/401 соответственно.

## 📝 Отчет о выполнении

После выполнения прислать:
1. Результаты curl тестов (публичные 200, приватные 401)
2. Номер последнего деплоя
3. Статус SSO в настройках проекта
