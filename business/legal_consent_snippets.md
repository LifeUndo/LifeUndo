# Legal Consent Snippets

## Обязательный чекбокс согласия

### Текст для чекбокса (RU)
```
Я даю согласие на автоматическое продление подписки Pro 599 ₽/мес по окончании 7-дневного триала. 
Отменить можно в любой момент до списания. Подписываясь, я принимаю Условия использования и 
Политику конфиденциальности.
```

### Текст для чекбокса (EN)
```
I consent to automatic renewal of Pro subscription 599 ₽/month after the 7-day trial ends. 
Cancellation is available at any time before billing. By subscribing, I accept the Terms of Use 
and Privacy Policy.
```

## Email Templates

### T-72 (72 часа до окончания триала)

#### Subject (RU)
```
⏰ Триал LifeUndo заканчивается через 3 дня
```

#### Body (RU)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Триал заканчивается</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366F1;">⏰ Триал LifeUndo заканчивается через 3 дня</h2>
        
        <p>Привет, {user_name}!</p>
        
        <p>Ваш 7-дневный триал LifeUndo заканчивается через 3 дня. Не теряйте доступ к восстановлению данных!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6366F1; margin-top: 0;">Что вы потеряете:</h3>
            <ul>
                <li>Историю буфера обмена</li>
                <li>Восстановление удаленного текста</li>
                <li>Синхронизацию между устройствами</li>
                <li>Приоритетную поддержку</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://lifeundo.ru/ru/pricing" 
               style="background: #6366F1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Продлить подписку Pro
            </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            Если у вас есть вопросы, ответьте на это письмо или напишите в 
            <a href="https://t.me/LifeUndoSupport">Telegram поддержку</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
            Если вы не хотите получать эти уведомления, 
            <a href="https://lifeundo.ru/api/newsletter/unsubscribe?token={unsubscribe_token}">отпишитесь здесь</a>.
        </p>
    </div>
</body>
</html>
```

### T-24 (24 часа до окончания триала)

#### Subject (RU)
```
🚨 Последний день триала LifeUndo!
```

#### Body (RU)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Последний день триала</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">🚨 Последний день триала LifeUndo!</h2>
        
        <p>Привет, {user_name}!</p>
        
        <p><strong>Ваш триал заканчивается завтра!</strong> Не упустите возможность сохранить доступ к восстановлению данных.</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">⚠️ Завтра вы потеряете:</h3>
            <ul>
                <li>Все сохраненные версии документов</li>
                <li>Историю буфера обмена</li>
                <li>Возможность восстановления удаленного текста</li>
                <li>Синхронизацию между устройствами</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://lifeundo.ru/ru/pricing" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Продлить сейчас - 599 ₽/мес
            </a>
        </div>
        
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1;">
                <strong>💡 Совет:</strong> Попробуйте Starter Bundle за 3000 ₽ на 6 месяцев - 
                стабильнее проходит у платежного провайдера!
            </p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            Нужна помощь? Ответьте на это письмо или напишите в 
            <a href="https://t.me/LifeUndoSupport">Telegram поддержку</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
            Если вы не хотите получать эти уведомления, 
            <a href="https://lifeundo.ru/api/newsletter/unsubscribe?token={unsubscribe_token}">отпишитесь здесь</a>.
        </p>
    </div>
</body>
</html>
```

### Payment Success (Успешный платеж)

#### Subject (RU)
```
✅ Подписка LifeUndo активирована!
```

#### Body (RU)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Подписка активирована</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">✅ Подписка LifeUndo активирована!</h2>
        
        <p>Привет, {user_name}!</p>
        
        <p>Отлично! Ваша подписка LifeUndo Pro успешно активирована. Теперь у вас есть полный доступ ко всем функциям.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">🎉 Что теперь доступно:</h3>
            <ul>
                <li>Безлимитная история буфера обмена</li>
                <li>Восстановление удаленного текста</li>
                <li>Синхронизация между устройствами</li>
                <li>Приоритетная поддержка</li>
                <li>Экспорт данных</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://lifeundo.ru/ru/download" 
               style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Скачать расширение
            </a>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">📋 Детали подписки:</h4>
            <p style="margin: 5px 0;"><strong>План:</strong> Pro</p>
            <p style="margin: 5px 0;"><strong>Стоимость:</strong> 599 ₽/мес</p>
            <p style="margin: 5px 0;"><strong>Следующее списание:</strong> {next_bill_date}</p>
            <p style="margin: 5px 0;"><strong>Карта:</strong> **** {card_last4}</p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            Если у вас есть вопросы, ответьте на это письмо или напишите в 
            <a href="https://t.me/LifeUndoSupport">Telegram поддержку</a>.
        </p>
        
        <p style="font-size: 12px; color: #999;">
            Чтобы отменить подписку, перейдите в 
            <a href="https://lifeundo.ru/ru/account/billing">личный кабинет</a>.
        </p>
    </div>
</body>
</html>
```

### Payment Failed (Неудачный платеж)

#### Subject (RU)
```
❌ Проблема с оплатой подписки LifeUndo
```

#### Body (RU)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Проблема с оплатой</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">❌ Проблема с оплатой подписки LifeUndo</h2>
        
        <p>Привет, {user_name}!</p>
        
        <p>К сожалению, не удалось списать средства за подписку LifeUndo Pro. У вас есть 72 часа для решения проблемы.</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">⚠️ Что происходит:</h3>
            <ul>
                <li>Ваша подписка приостановлена</li>
                <li>Функции Pro временно недоступны</li>
                <li>У вас есть 72 часа для решения проблемы</li>
                <li>После этого доступ будет ограничен</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://lifeundo.ru/ru/account/billing" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Обновить платежный метод
            </a>
        </div>
        
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #0369a1;">💡 Возможные причины:</h4>
            <ul style="margin: 0;">
                <li>Недостаточно средств на карте</li>
                <li>Карта заблокирована банком</li>
                <li>Истек срок действия карты</li>
                <li>Превышен лимит операций</li>
            </ul>
        </div>
        
        <div style="background: #fefce8; border: 1px solid #fde047; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #a16207;">
                <strong>🔄 Альтернатива:</strong> Попробуйте Starter Bundle за 3000 ₽ на 6 месяцев - 
                он стабильнее проходит у платежного провайдера!
            </p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            Нужна помощь? Ответьте на это письмо или напишите в 
            <a href="https://t.me/LifeUndoSupport">Telegram поддержку</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
            Если вы не хотите получать эти уведомления, 
            <a href="https://lifeundo.ru/api/newsletter/unsubscribe?token={unsubscribe_token}">отпишитесь здесь</a>.
        </p>
    </div>
</body>
</html>
```

## Уведомления в приложении

### Banner для T-72
```html
<div class="notification-banner warning">
    <div class="icon">⏰</div>
    <div class="content">
        <h4>Триал заканчивается через 3 дня</h4>
        <p>Не теряйте доступ к восстановлению данных!</p>
        <a href="/ru/pricing" class="btn btn-primary">Продлить подписку</a>
    </div>
    <button class="close" onclick="this.parentElement.style.display='none'">×</button>
</div>
```

### Banner для T-24
```html
<div class="notification-banner danger">
    <div class="icon">🚨</div>
    <div class="content">
        <h4>Последний день триала!</h4>
        <p>Завтра вы потеряете доступ к функциям Pro</p>
        <a href="/ru/pricing" class="btn btn-danger">Продлить сейчас</a>
    </div>
    <button class="close" onclick="this.parentElement.style.display='none'">×</button>
</div>
```

### Banner для неудачного платежа
```html
<div class="notification-banner error">
    <div class="icon">❌</div>
    <div class="content">
        <h4>Проблема с оплатой</h4>
        <p>Обновите платежный метод в течение 72 часов</p>
        <a href="/ru/account/billing" class="btn btn-warning">Обновить карту</a>
    </div>
    <button class="close" onclick="this.parentElement.style.display='none'">×</button>
</div>
```

## CSS для уведомлений

```css
.notification-banner {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    width: 90%;
    animation: slideDown 0.3s ease-out;
}

.notification-banner.warning {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    color: #92400e;
}

.notification-banner.danger {
    background: #fecaca;
    border: 1px solid #ef4444;
    color: #991b1b;
}

.notification-banner.error {
    background: #fef2f2;
    border: 1px solid #dc2626;
    color: #991b1b;
}

.notification-banner .icon {
    font-size: 24px;
    margin-right: 16px;
}

.notification-banner .content {
    flex: 1;
}

.notification-banner .content h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
}

.notification-banner .content p {
    margin: 0 0 8px 0;
    font-size: 14px;
}

.notification-banner .btn {
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
}

.notification-banner .btn-primary {
    background: #6366f1;
    color: white;
}

.notification-banner .btn-danger {
    background: #ef4444;
    color: white;
}

.notification-banner .btn-warning {
    background: #f59e0b;
    color: white;
}

.notification-banner .close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-left: 16px;
    opacity: 0.7;
}

.notification-banner .close:hover {
    opacity: 1;
}

@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}
```

## Placeholders для персонализации

### Доступные переменные
- `{user_name}` - имя пользователя
- `{plan}` - текущий план (pro/vip/team)
- `{trial_end_date}` - дата окончания триала
- `{next_bill_date}` - дата следующего списания
- `{card_last4}` - последние 4 цифры карты
- `{unsubscribe_token}` - токен для отписки
- `{example}` - пример использования

### Пример использования
```javascript
// В worker_newsletter_example.ts
const personalizedBody = template.body
  .replace(/\{user_name\}/g, user.display_name || 'Друг')
  .replace(/\{plan\}/g, subscription.plan)
  .replace(/\{trial_end_date\}/g, formatDate(subscription.trial_ends_at))
  .replace(/\{next_bill_date\}/g, formatDate(subscription.next_bill_at))
  .replace(/\{card_last4\}/g, subscription.card_last4)
  .replace(/\{unsubscribe_token\}/g, generateUnsubscribeToken(user.id))
  .replace(/\{example\}/g, 'важный документ');
```

## Compliance и требования

### GDPR
- Явное согласие на рассылки
- Простая отписка (1 клик)
- Право на забвение
- Минимизация данных

### CAN-SPAM
- Четкий отправитель
- Релевантный subject
- Физический адрес
- Unsubscribe ссылка

### Российское законодательство
- Согласие на обработку персональных данных
- Возможность отзыва согласия
- Хранение согласий
- Уведомление об изменениях
