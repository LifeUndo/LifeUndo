# FreeKassa + Firefox Extension - Preview Setup

## 🚀 **PR готов**: https://github.com/LifeUndo/LifeUndo/pull/new/release/fk-app-01

## 📋 **Что реализовано**

### ✅ **FreeKassa Integration**
- **API Endpoints**: `/api/payments/freekassa/create` и `/result`
- **FreeKassaButton**: компонент с ENV флагом `NEXT_PUBLIC_FK_ENABLED`
- **Pricing Page**: кнопки FreeKassa для Pro/VIP/Team планов
- **Signature Validation**: правильная проверка подписей MD5
- **next.config.mjs**: поддержка `cdn.freekassa.net`

### ✅ **Firefox Extension (AMO Ready)**
- **Manifest V3**: полная структура в `apps/extension-firefox/`
- **Background Service Worker**: отслеживание вкладок и состояний
- **Content Script**: отслеживание форм и горячие клавиши
- **Modern Popup UI**: быстрые действия и статус
- **All Icons**: 16, 32, 48, 96, 128, 256px
- **README**: инструкции по сборке и деплою

## 🔧 **ENV для Preview**

Установите в Vercel Preview Environment:

```bash
NEXT_PUBLIC_FK_ENABLED=true
FREEKASSA_MERCHANT_ID=54c3ac0581ad5eeac3fbee2ffac83f6c
FREEKASSA_SECRET1=ponOk=W5^2W9t][
FREEKASSA_SECRET2=1rF!PSuEpvj,MJL
FREEKASSA_PAYMENT_URL=https://pay.freekassa.ru/
NEXT_PUBLIC_SHOW_LANG_SWITCH=false
```

## 🧪 **Smoke Tests (Preview URL)**

```bash
# Редиректы
curl -I https://<preview>/
curl -I https://<preview>/ru
curl -I https://<preview>/ru/pricing
curl -I https://<preview>/ok

# Создание платежа
curl -X POST https://<preview>/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"getlifeundo_pro","amount":"599.00","email":"test@getlifeundo.com"}'
```

## 🔥 **Firefox Extension Build**

```bash
# Установка web-ext
npm i -g web-ext

# Сборка
web-ext build -s apps/extension-firefox --overwrite-dest

# Линтинг
web-ext lint -s apps/extension-firefox

# Подпись для AMO (когда будете готовы)
web-ext sign --api-key=<AMO_KEY> --api-secret=<AMO_SECRET> -s apps/extension-firefox
```

## ✅ **Приёмка**

### FreeKassa:
- [ ] Кнопки видны на `/ru/pricing` при `NEXT_PUBLIC_FK_ENABLED=true`
- [ ] Клик генерирует `pay_url` и редиректит на `pay.freekassa.ru`
- [ ] `/ru/success` и `/ru/fail` открываются
- [ ] `/api/payments/freekassa/result` возвращает `200 YES` на валидном payload

### Firefox Extension:
- [ ] `web-ext lint` без ошибок
- [ ] Popup открывается, иконки корректные
- [ ] Никакой "серой" функциональности
- [ ] Privacy: не собираем лишнее

## 🎯 **Следующие шаги**

1. **Merge PR** → **Promote to Production** → **Protect**
2. **Установить ENV в Production** (те же ключи)
3. **Повторить smoke tests на Production**
4. **Подготовить AMO submission** (карточка, скриншоты, описание)
5. **Отправить расширение в AMO** на модерацию

## 📞 **Поддержка**

- **Веб-сайт**: https://getlifeundo.com/ru/support
- **Email**: support@getlifeundo.com  
- **Telegram**: https://t.me/LifeUndoSupport
