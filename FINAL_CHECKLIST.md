# 🎯 FreeKassa Integration - ФИНАЛЬНЫЙ ЧЕК-ЛИСТ

## ✅ **Что уже готово**

- **Ветка**: `feature/fk-from-prod-lock` от коммита `4f7e919` (правильный GetLifeUndo брендинг)
- **API**: `/api/payments/freekassa/create` и `/result` с исправленной подписью
- **UI**: `FreeKassaButton` компонент с ENV флагом
- **Интеграция**: кнопки на Pro/VIP/Team планах в pricing page
- **ENV**: нормализованы переменные (только `FREEKASSA_*`)
- **Debug**: `/api/debug/fk` только для Preview

---

## 🧪 **БЫСТРЫЙ ЧЕК-ЛИСТ ПРИЁМКИ (5 шагов)**

### **1. Открой правильный Preview (git-alias)**
В карточке деплоя ветки `feature/fk-from-prod-lock` используй URL:
- ✅ `https://getlifeundo-git-feature-fk-from-prod-lock-…vercel.app`
- ❌ НЕ случайный `…-nhvo5g2ea…`

### **2. Проверь конфигурацию FK**
```bash
curl https://<git-alias>/api/debug/fk
```
**Ожидаемо**:
```json
{"ok":true,"fkEnabled":true,"merchantIdMasked":"54c3***"}
```

### **3. Создай платёж через API (дымовый тест)**
```bash
curl -X POST https://<git-alias>/api/payments/freekassa/create \
  -H "Content-Type: application/json" \
  -d '{"productId":"getlifeundo_pro"}'
```
**Ожидаемо**: JSON с `pay_url` на `https://pay.freekassa.net/?m=...&oa=599.00&o=...&s=...&currency=RUB`

**Перейди по `pay_url`** → форма оплаты должна открыться **БЕЗ** «Неправильные параметры ссылки»

### **4. Проверь UI**
- **`/<locale>/pricing`** (например, `/ru/pricing`) → видны кнопки «Оплатить через FreeKassa»
- **`/ru/success`** и **`/ru/fail`** → страницы доступны
- **Хедер/футер** → с **GetLifeUndo**, соц-иконки не «слипаются»

### **5. ENV-гигиена в Vercel**
В **Preview** должны быть только:
- ✅ `NEXT_PUBLIC_FK_ENABLED=true`
- ✅ `FREEKASSA_MERCHANT_ID`
- ✅ `FREEKASSA_SECRET1`
- ✅ `FREEKASSA_SECRET2`
- ✅ `FREEKASSA_PAYMENT_URL=https://pay.freekassa.net/`

**Любые `FK_*` (без `FREEKASSA_`)** → **выключить/удалить**

**После правок ENV** → **Redeploy** именно git-alias превью

---

## 🚀 **ДАЛЬШЕ (после зелёной приёмки)**

1. **Promote Preview → Production**, затем **Protect**
2. Скопировать те же `FREEKASSA_*` + `NEXT_PUBLIC_FK_ENABLED=true` в **Production**
3. Повторить шаги 2–4 уже на проде (быстрый дым)

---

## 🔍 **Если снова «Неправильные параметры ссылки»**

Пришли:
- **Полный `pay_url`** из ответа `/create`
- **JSON** из `/api/debug/fk`

По ним сразу видно, что не так (формат суммы, подпись, валюта или order_id)

---

## 📋 **Критерии приёмки**

- [ ] `/api/debug/fk` возвращает `fkEnabled: true`
- [ ] На `/ru/pricing` видны кнопки FreeKassa
- [ ] Клик ведёт на `pay.freekassa.net` **без ошибки**
- [ ] Правильный брендинг "GetLifeUndo" (не "LifeUndo")
- [ ] ENV переменные только `FREEKASSA_*` (без `FK_*`)

**Готово к тестированию!** 🎉
