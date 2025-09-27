# Настройка FreeKassa

## URLs для настройки в кабинете FreeKassa:

### Result URL (webhook):
```
https://www.getlifeundo.com/api/fk/notify
```

### Success URL:
```
https://www.getlifeundo.com/success
```

### Fail URL:
```
https://www.getlifeundo.com/fail
```

## Проверка настроек:

1. **Merchant ID**: `65875`
2. **Secret 1**: `myavF/PTAGmJz,(`
3. **Secret 2**: `2aqzSYf?29aO-w6`

## Тест оплаты:

1. Выполнить реальную оплату (минимальную сумму) по плану `pro_month`
2. Проверить webhook в логах Vercel
3. Проверить письмо/ключ (если включено)
4. Проверить идемпотентность (повторные запросы)

## Проверочные команды:

```bash
# Проверка webhook endpoint
curl -I https://www.getlifeundo.com/api/fk/notify

# Ожидаем: 405 Method Not Allowed (GET не поддерживается)
```

## После настройки:

- Убедиться, что все URLs корректны
- Проверить совпадение Secret 1/2 с Vercel ENV
- Выполнить тестовую оплату
- Проверить логи webhook
