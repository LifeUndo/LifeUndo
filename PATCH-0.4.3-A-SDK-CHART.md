# 🚀 PATCH 0.4.3-A — **SDK + Usage-чарт (recharts)**

## ✅ ЧТО СДЕЛАНО:

### **1. Зависимости установлены:**
- `recharts` - для графиков в usage dashboard
- `swr` - для data fetching в клиентских компонентах

### **2. Usage Dashboard с графиком:**
- **`src/app/admin/usage/page.tsx`** - полноценный график + таблица
- Recharts LineChart для динамики по дням
- ТОП эндпоинтов в таблице
- Общий счетчик вызовов

### **3. Developers страница с SDK:**
- **`src/app/developers/page.tsx`** - ссылки на npm/PyPI
- Примеры кода для JS/TS и Python
- OpenAPI ссылка
- Аутентификация и лимиты

## 🧪 БЫСТРЫЙ SMOKE:

```bash
# сборка/запуск
npm run build
npm start

# открыть
# 1) /admin/usage — увидишь график
# 2) /developers  — ссылки на SDK и примеры

# auto-логирование (должно влиять на график)
curl -s https://getlifeundo.com/api/public/pricing >/dev/null
curl -s https://getlifeundo.com/api/public/pricing >/dev/null
# обнови /admin/usage — total/серия должны подрасти
```

## 📋 ENV НАСТРОЙКИ (после публикации SDK):

```env
# .env (оба домена / Beget)
NEXT_PUBLIC_SDK_JS_PKG=@lifeundo/js
NEXT_PUBLIC_SDK_JS_URL=https://www.npmjs.com/package/@lifeundo/js
NEXT_PUBLIC_SDK_PY_PKG=lifeundo
NEXT_PUBLIC_SDK_PY_URL=https://pypi.org/project/lifeundo/
```

## 🔧 ЕСЛИ ЧТО-ТО НЕ ТАК:

- **График пустой** → просто дерни 1–2 публичных API, авто-логгер в middleware всё запишет
- **Билд ругается на Recharts** → проверь, что `npm i recharts` выполнен
- **`/developers` без ссылок** → выставь `NEXT_PUBLIC_SDK_*` в ENV или оставь дефолты

## 🎯 ГОТОВО:

**SDK + Usage-чарт полностью готов! Теперь у нас есть:**
- Красивый график usage в админке
- Ссылки на SDK с примерами кода
- Автоматическое логирование API вызовов

---

**Хочешь добавить мини-виджет "копировать API-ключ" в админке и rate-limit индикатор? Скажи: «мини-виджеты — одним постом» 🚀**

