# Environment Variables для Vercel Production - getlifeundo.com

## Переменные для проекта getlifeundo (основной домен)

В Vercel Dashboard → Projects → getlifeundo → Settings → Environment Variables (Production):

```
NEXT_PUBLIC_SITE_URL=https://getlifeundo.com
NEWSITE_MODE=true
NEXT_PUBLIC_TG_URL=https://t.me/GetLifeUndo
NEXT_PUBLIC_X_URL=https://x.com/GetLifeUndo
NEXT_PUBLIC_YT_URL=https://youtube.com/@GetLifeUndo
NEXT_PUBLIC_GH_URL=https://github.com/LifeUndo
```

## Инструкции по настройке:

1. **Зайти в Vercel Dashboard**
2. **Выбрать проект `getlifeundo`** (основной проект)
3. **Settings → Environment Variables**
4. **Добавить каждую переменную** с указанными значениями
5. **Убедиться, что Environment = Production**
6. **Сохранить изменения**

## Проверка после настройки:

После добавления переменных выполнить **Redeploy** с очисткой кэша.

## Ожидаемый результат:

- `NEXT_PUBLIC_SITE_URL` будет использоваться в `robots.ts` и `sitemap.ts`
- Все ссылки будут указывать на `getlifeundo.com`
- Соцсети будут корректно отображаться в футере (@GetLifeUndo)
