# GetLifeUndo — Релизы и Артефакты (0.3.7.x)

Версия документа: 2025‑10‑04  
Статус: принять как норму для 0.3.7.11+ и 0.3.7.12

---

## 0) Зачем

Единые правила, куда складываем **все сборки** (расширение, инсталлеры), как меняем ссылки на сайте, и какие шаги выполняет Cursor при каждом релизе.

---

## 1) Где лежат сборки (единая структура)

**CDN-домен:** `cdn.getlifeundo.com`

**Папки:**

```
/app/
  /0.3.7.11/
    lifeundo-0.3.7.11.xpi         # Firefox
    undo-setup-0.3.7.11.exe       # Windows
    undo-0.3.7.11.dmg             # macOS
    checksums.txt                 # SHA256 всех файлов
    RELEASE_NOTES.md              # краткие заметки версии
  /0.3.7.12/
    lifeundo-0.3.7.12.xpi
    undo-setup-0.3.7.12.exe
    undo-0.3.7.12.dmg
    checksums.txt
    RELEASE_NOTES.md
  /latest/
    lifeundo-latest.xpi           # копия/линк на текущую
    undo-setup-latest.exe
    undo-latest.dmg
    latest.json                   # метаданные «текущая версия»
```

> **Примечание:** Если CDN не готов — временно используем репозиторий `public/app/<ver>/...` на Vercel. Для файлов >50 MB предпочтителен внешний CDN/S3.

**`latest.json` формат:**

```json
{
  "version": "0.3.7.12",
  "publishedAt": "2025-10-04T10:00:00Z",
  "files": {
    "firefox": "https://cdn.getlifeundo.com/app/0.3.7.12/lifeundo-0.3.7.12.xpi",
    "win": "https://cdn.getlifeundo.com/app/0.3.7.12/undo-setup-0.3.7.12.exe",
    "mac": "https://cdn.getlifeundo.com/app/0.3.7.12/undo-0.3.7.12.dmg"
  }
}
```

---

## 2) Соглашение по именам

* Файлы: `lifeundo-<semver>.xpi`, `undo-setup-<semver>.exe`, `undo-<semver>.dmg`.
* Символьные «latest» дубликаты: `*-latest.*` всегда указывают на текущую стабильную.
* Чексуммы: `checksums.txt` с SHA‑256 по всем файлам папки версии.

---

## 3) Сайт `/downloads` — откуда берёт ссылки

* Источник истины: `https://cdn.getlifeundo.com/app/latest/latest.json`.
* Если ключ отсутствует (например, нет macOS) — кнопку **скрывать**.
* На RU/EN страницы подставлять ссылки из `latest.json` и подписи «Текущая версия: X.Y.Z».

---

## 4) Шаги релиза 0.3.7.12 (ручной ранбук)

1. **manifest.json** → `version=0.3.7.12` (Firefox `browser_specific_settings.gecko.id` неизменен).
2. **Собрать XPI**: архив содержимого (без родительской папки) → `lifeundo-0.3.7.12.xpi`.
3. **Windows/macOS**: собрать инсталлеры (если уже готовы к публикации).
4. **Чексуммы**: посчитать SHA‑256 → сохранить в `checksums.txt`.
5. **RELEASE_NOTES.md**: кратко «What's new» (готовый текст в проекте).
6. **Загрузка на CDN**: положить всё в `/app/0.3.7.12/`, обновить `/app/latest/*` и `latest.json`.
7. **AMO**: загрузить `lifeundo-0.3.7.12.xpi` в Developer Hub (listed). После аппрува добавить ссылку AMO на сайт.
8. **Сайт**: `/downloads` автоматически подхватывает `latest.json`; проверить, что кнопки показались корректно.
9. **Теги Git**: `git tag v0.3.7.12 && git push --tags`.
10. **Мониторинг**: 48 ч по `ops/checks/green_check_prod.ps1`.

---

## 5) Задачи для Cursor (выполнить один раз и использовать дальше)

**5.1 Автоматизация упаковки и чексумм**

* Добавить скрипты:

  * `scripts/release/pack_firefox.ps1` — архивирует папку расширения в XPI, считает SHA‑256.
  * `scripts/release/checksums.ps1` — пересчёт SHA‑256 по *.xpi/*.exe/*.dmg.
* В `package.json` добавить:

```json
{
  "scripts": {
    "release:xpi": "powershell -ExecutionPolicy Bypass -File scripts/release/pack_firefox.ps1 0.3.7.12",
    "release:sha": "powershell -ExecutionPolicy Bypass -File scripts/release/checksums.ps1 app/0.3.7.12"
  }
}
```

**5.2 latest.json и копии**

* Скрипт `scripts/release/update_latest.ps1`: копирует файлы версии в `/app/latest/` и пишет `latest.json`.

**5.3 Загрузка на CDN**

* Если S3/Backblaze: `scripts/release/upload_s3.ps1` (или `rclone`), читает `AWS_*`/`B2_*` из ENV.

**5.4 Сайт `/downloads`**

* Компонент `DownloadsPage` читать `latest.json` при сборке (static props) или на клиента (с graceful fallback). Кнопки скрывать, если ссылки нет.
* Добавить плашку «Текущая версия: vX.Y.Z / Предыдущие: ссылка на архив».

**5.5 Архив предыдущих**

* Страница `/downloads/archive` со списком доступных версий (читает список каталогов `/app/*`).

**5.6 CHANGELOG.md**

* Завести единый `CHANGELOG.md`. Секция `## 0.3.7.12` уже есть в черновике — перенести.

---

## 6) Миграция 0.3.7.11 (если её не видно на CDN)

* Собрать/скомпоновать из бэкапа файлы 0.3.7.11 → выложить в `/app/0.3.7.11/`.
* Пересчитать `checksums.txt`.
* Добавить запись в `/downloads/archive`.

---

## 7) Политика хранения и отката

* Храним **последние 5** минорных версий (например, 0.3.7.8 … 0.3.7.12).
* «Latest» всегда указывает на самую свежую стабильную.
* Откат версии = заменить `latest.json` и файлы в `/app/latest/` на предыдущую.

---

## 8) Статусы для проекта

* `release:prepared` — артефакты собраны локально.
* `release:uploaded` — загружено на CDN, latest обновлён.
* `release:AMO-submitted` — отправлено на модерацию.
* `release:AMO-live` — ссылка активна, сайт обновлён.

---

## 9) Быстрые команды (пример PowerShell)

```powershell
# 1) Упаковать XPI
npm run release:xpi

# 2) Залить в CDN (пример через rclone)
rclone copy ./app/0.3.7.12 remote:cdn.getlifeundo.com/app/0.3.7.12 --progress

# 3) Обновить latest
npm run release:sha
powershell -ExecutionPolicy Bypass -File scripts/release/update_latest.ps1 0.3.7.12

# 4) Пометить git-тег
git tag v0.3.7.12; git push --tags
```

---

## 10) Что нужно от PM сейчас

* Подтвердить: используем CDN `cdn.getlifeundo.com` (S3/B2) и путь `/app/<ver>/...`.
* Дать доступы/учётки для загрузки (или попросить Cursor настроить `rclone` «под ключ»).
* Сказать, где сейчас лежит архив 0.3.7.11 — чтобы переложить в `/app/0.3.7.11/`.

---

**Готово.** Этот документ — «точка правды» для артефактов и релизов 0.3.7.x. Включаем в репозиторий и выполняем задачи из §5 при ближайшем апдейте Cursor.
