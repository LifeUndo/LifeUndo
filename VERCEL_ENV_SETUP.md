# Environment Variables для Vercel Production

## Переменные для проекта life-undo (lifeundo.ru)

В Vercel Dashboard → Projects → life-undo → Settings → Environment Variables (Production):

```
NEWSITE_MODE=true
NEXT_PUBLIC_SITE_URL=https://lifeundo.ru
NEXT_PUBLIC_TG_URL=https://t.me/lifeundo_support
NEXT_PUBLIC_X_URL=https://x.com/lifeundo
NEXT_PUBLIC_YT_URL=https://youtube.com/@lifeundo
NEXT_PUBLIC_GH_URL=https://github.com/LifeUndo
```

## Инструкции по настройке:

1. **Зайти в Vercel Dashboard**
2. **Выбрать проект `life-undo`** (тот, что привязан к `lifeundo.ru`)
3. **Settings → Environment Variables**
4. **Добавить каждую переменную** с указанными значениями
5. **Убедиться, что Environment = Production**
6. **Сохранить изменения**

## Проверка после настройки:

После добавления переменных выполнить **Redeploy** с очисткой кэша.

## Ожидаемый результат:

- `NEXT_PUBLIC_SITE_URL` будет использоваться в `robots.ts` и `sitemap.ts`
- Все ссылки будут указывать на `lifeundo.ru`
- Соцсети будут корректно отображаться в футере
