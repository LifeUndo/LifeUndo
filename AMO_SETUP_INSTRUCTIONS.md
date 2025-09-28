# Инструкции по настройке AMO (Firefox Add-ons)

## Проблема: "1 user" на странице AMO

Сейчас расширение опубликовано как **Listed** (публичная карточка), поэтому показывается счётчик пользователей.

## Решение: два варианта

### Вариант A: Hidden Listed (быстро)

**Что делать:**
1. Зайти в [AMO Developer Hub](https://addons.mozilla.org/developers/)
2. Выбрать LifeUndo → **Manage Status & Versions**
3. Нажать **"Make Invisible"** или **"Hidden"**
4. Сохранить изменения

**Результат:**
- ✅ Страница AMO больше не видна публично
- ✅ Счётчик пользователей исчезает
- ✅ Авто-обновления продолжают работать
- ✅ Существующие пользователи остаются

**Пруф:** Скриншот AMO с статусом "Hidden"

---

### Вариант B: Unlisted Self-Distribution (правильно)

**Что делать:**

1. **Собрать новую версию как Unlisted:**
   ```bash
   web-ext sign --channel=unlisted --api-key=YOUR_API_KEY --api-secret=YOUR_API_SECRET
   ```

2. **Скачать подписанный .xpi файл**

3. **Разместить на нашем домене:**
   - Создать папку `/public/downloads/`
   - Загрузить файл как `lifeundo-0.3.7.11.xpi`
   - Обновить `/ru/download` для ссылки на наш файл

4. **Обновить страницу загрузки:**
   ```tsx
   // В /ru/download
   <a 
     href="/downloads/lifeundo-0.3.7.11.xpi" 
     download="lifeundo-0.3.7.11.xpi"
     className="download-button"
   >
     Скачать для Firefox
   </a>
   ```

**Результат:**
- ✅ Никакой публичной карточки AMO
- ✅ Никакого счётчика пользователей
- ✅ Полный контроль над распространением
- ✅ Можно настроить авто-обновления через update manifest

**Пруф:** 
- Ссылка на наш .xpi файл: `https://lifeundo.ru/downloads/lifeundo-0.3.7.11.xpi`
- Номер версии в файле

---

## Настройка авто-обновлений для Unlisted

Если выбрали вариант B, нужно настроить update manifest:

1. **Создать update manifest:**
   ```json
   // public/downloads/update-manifest.json
   {
     "addons": {
       "lifeundo@lifeundo.ru": {
         "updates": [
           {
             "version": "0.3.7.11",
             "update_link": "https://lifeundo.ru/downloads/lifeundo-0.3.7.11.xpi"
           }
         ]
       }
     }
   }
   ```

2. **Обновить manifest.json расширения:**
   ```json
   {
     "update_url": "https://lifeundo.ru/downloads/update-manifest.json"
   }
   ```

---

## Рекомендация

**Для быстрого решения:** Вариант A (Hidden Listed)
- Занимает 2 минуты
- Решает проблему "1 user" сразу
- Не требует изменений в коде

**Для долгосрочного решения:** Вариант B (Unlisted)
- Полный контроль над распространением
- Нет зависимости от AMO
- Можно настроить собственные авто-обновления

---

## Команды для проверки

После настройки проверить:

```bash
# Проверка страницы загрузки
curl -I https://lifeundo.ru/ru/download
# Должен вернуть 200 OK

# Проверка файла .xpi (если выбрали Unlisted)
curl -I https://lifeundo.ru/downloads/lifeundo-0.3.7.11.xpi
# Должен вернуть 200 OK с Content-Type: application/x-xpinstall
```

## Пруфы для релиза

**Вариант A (Hidden):**
- Скриншот AMO с статусом "Hidden"
- Подтверждение, что страница больше не доступна публично

**Вариант B (Unlisted):**
- Ссылка на наш .xpi файл
- Номер версии
- Подтверждение, что файл доступен для скачивания
