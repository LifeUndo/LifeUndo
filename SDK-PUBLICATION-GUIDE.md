# 📦 SDK Publication Guide

## **🚀 ПУБЛИКАЦИЯ SDK (когда будешь готов):**

### **1. JS (npm):**
```bash
cd packages/lifeundo-js
npm login
npm publish --access public
```

**Результат:** `@lifeundo/js` доступен в npm

### **2. Python (PyPI):**
```bash
cd packages/lifeundo-python
python -m build
twine upload dist/*
```

**Результат:** `lifeundo` доступен в PyPI

## **📋 ПОСЛЕ ПУБЛИКАЦИИ:**

### **Обновить /developers:**
- Добавить реальные ссылки на npm и PyPI
- Обновить примеры кода
- Проверить что пакеты работают

### **Версионирование:**
- JS: `package.json` → `version: "0.1.0"`
- Python: `pyproject.toml` → `version = "0.1.0"`

## **🔧 ПОДГОТОВКА К ПУБЛИКАЦИИ:**

### **JS SDK:**
- ✅ `package.json` готов
- ✅ `tsconfig.json` настроен
- ✅ `src/index.ts` с клиентом
- ✅ `README.md` с примерами

### **Python SDK:**
- ✅ `pyproject.toml` готов
- ✅ `lifeundo/__init__.py` экспортирует клиент
- ✅ `lifeundo/client.py` с методами
- ✅ `README.md` с примерами

## **🎯 ГОТОВО К ПУБЛИКАЦИИ:**

После публикации:
- ✅ Реальные ссылки на `/developers`
- ✅ Пакеты доступны публично
- ✅ Примеры работают с тестовым API-ключом

**SDK готовы к публикации! 🚀**


