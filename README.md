# GetLifeUndo

## Android (1.0.0+10 rev5a)

- Скачать APK: https://github.com/LifeUndo/LifeUndo/releases/tag/v1.0.0-10-rev5a
- Что делает: восстанавливает недавно закрытые вкладки, введённый текст в полях и историю буфера. 100% локально, без облака.
- Требования: Android 8.0+.
- Установка APK:
  1) Скачайте APK по ссылке выше.
  2) Разрешите установку из неизвестных источников.
  3) Откройте приложение → включите «Input & closed tabs tracking» и выдайте доступ в «Специальных возможностях».
- Ограничения Android: ретроскан вкладок невозможен без Accessibility; текущие вкладки подхватываются при посещении экранов «Недавние/История» браузера.
- Приватность: данные хранятся локально на устройстве, не отправляются на сервер.

## Соцсети и площадки

Соцсети:
- Telegram: https://t.me/getlifeundo
- X/Twitter: https://x.com/getlifeundo
- YouTube: https://youtube.com/@getlifeundo
- Reddit: https://reddit.com/r/getlifeundo
- GitHub: https://github.com/LifeUndo
- VK: https://vk.ru/GetLifeUndo

Площадки (по мере готовности):
- RuStore: https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app
- Huawei AppGallery: https://appgallery.huawei.com/
- Samsung Galaxy Store: https://galaxystore.samsung.com/
- F-Droid: (будет добавлено)
- RuStore Apps: https://www.rustore.ru/catalog/app/com.getlifeundo.lifeundo_app

## Полезные ссылки:
- Сайт: https://getlifeundo.com
- Загрузки: https://getlifeundo.com/ru/downloads
- Тарифы: https://getlifeundo.com/ru/pricing
- Поддержка: https://getlifeundo.com/ru/support

**Ctrl+Z для вашей онлайн-жизни** — восстанавливает случайно удаленные данные на любых устройствах.

[![Website](https://img.shields.io/badge/Website-getlifeundo.com-blue)](https://getlifeundo.com)
[![Firefox Add-on](https://img.shields.io/badge/Firefox-Add--on-orange)](https://addons.mozilla.org/firefox/addon/lifeundo/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](https://getlifeundo.com/ru/privacy)

## 🚀 Features

- **Восстановление форм** — автоматическое сохранение введённого текста
- **История вкладок** — восстановление случайно закрытых страниц  
- **Буфер обмена** — история скопированного текста
- **100% локально** — все данные остаются в вашем браузере
- **Без телеметрии** — никаких данных не передается на серверы

## 📦 Installation

### Firefox
[![Download Firefox Add-on](https://img.shields.io/badge/Download-Firefox%20Add--on-orange)](https://addons.mozilla.org/firefox/addon/lifeundo/)

### Desktop Apps
- **Windows**: [Download EXE](https://cdn.getlifeundo.com/app/latest/undo-setup-latest.exe)
- **macOS**: [Download DMG](https://cdn.getlifeundo.com/app/latest/undo-latest.dmg)

### Mobile Apps (Coming Soon)
- **iOS**: Q1 2025
- **Android**: Q1 2025  
- **RuStore**: Q1 2025

## 💳 Pricing

- **Free**: 7 дней бесплатно, базовые функции
- **Pro**: 599 ₽/месяц, расширенные возможности
- **VIP**: 9 990 ₽ (lifetime), все функции без ограничений

[View all plans →](https://getlifeundo.com/ru/pricing)

## 🔧 Development

### Quick Start
```bash
npm install
npm run dev
```

### Environment Setup
```bash
cp .env.example .env.local
# Configure your environment variables
```

### Build & Deploy
```bash
npm run build
npm run deploy
```

## 📁 Project Structure

### Core Application
- `src/` - Next.js application source code
- `public/` - Static files and pages
- `api/` - API routes
- `migrations/` - Database migrations
- `utils/` - Utility functions

### Extensions
- `extension/` - Chrome extension
- `extension_firefox/` - Firefox extension
- `ext/` - Additional extension files

### Configuration
- `drizzle.config.ts` - Database configuration
- `next.config.mjs` - Next.js configuration
- `playwright.config.ts` - E2E testing configuration
- `vercel.json` - Vercel deployment configuration

### Documentation
- `docs/` - All documentation organized by category
  - `checklists/` - Project checklists and plans
  - `patches/` - Patch documentation
  - `setup/` - Setup guides and instructions
  - `releases/` - Release notes and changelogs
  - `scripts/` - Build and utility scripts
  - `temp/` - Temporary files and archives

### Business & Assets
- `business/` - Business plans and documentation
- `assets/` - Project assets
- `icons/` - Extension icons
- `lifeundo-web-icons/` - Web icons
- `store/` - Store-related files

### Releases & Packages
- `releases/` - Extension release archives
- `packages/` - NPM packages (lifeundo-js, lifeundo-python)

### Infrastructure
- `cloudflare/` - Cloudflare configuration
- `monitoring/` - Monitoring setup
- `GetLifeUndo/` - Legacy project files

### Testing
- `tests/` - Test files
- `test-results/` - Test results
- `scripts/` - Utility and smoke test scripts

## 💳 FreeKassa Integration (Preview)

### Overview
FreeKassa payment integration is implemented in the `feature/fk-from-prod-lock` branch and is ready for testing on Preview environments.

### Environment Variables
Set these variables in your Vercel environment:

```bash
# Enable FreeKassa UI (Preview only - CRITICAL!)
NEXT_PUBLIC_FK_ENABLED=true

# FreeKassa Configuration
FREEKASSA_MERCHANT_ID=your_merchant_id
FREEKASSA_SECRET1=your_secret1
FREEKASSA_SECRET2=your_secret2
FREEKASSA_PAYMENT_URL=https://pay.freekassa.net/
FREEKASSA_CURRENCY=RUB
```

**⚠️ CRITICAL Security Settings:** 
- `NEXT_PUBLIC_FK_ENABLED` → Scope: **Preview only** (NEVER All Environments!)
- `FREEKASSA_*` variables → Scope: Preview + Production (safe)
- Only use `FREEKASSA_*` variables (no `FK_*` duplicates)

📋 **Detailed setup:** See `VERCEL_ENV_SETUP_INSTRUCTIONS.md`

### API Endpoints

#### Debug API (Preview only)
```bash
GET /api/debug/fk
```
Returns configuration status without exposing secrets.

#### Create Payment
```bash
POST /api/payments/freekassa/create
Content-Type: application/json

# Format 1: Product ID
{
  "productId": "getlifeundo_pro|getlifeundo_vip|getlifeundo_team",
  "email": "optional@example.com"
}

# Format 2: Alternative (for testing)
{
  "currency": "RUB",
  "order_id": "100500", 
  "description": "Pro plan|VIP plan|Team plan"
}
```

### Smoke Testing
Run the smoke test script on your Preview deployment:

```powershell
.\scripts\freekassa-smoke-test.ps1 -PreviewUrl "https://your-preview-url.vercel.app"
```

### Products & Pricing
- **Pro Plan**: `getlifeundo_pro` - 599.00 RUB/month
- **VIP Plan**: `getlifeundo_vip` - 9990.00 RUB (lifetime)
- **Team Plan**: `getlifeundo_team` - 2990.00 RUB/month (5 seats)

### Release Checklist
- [ ] Preview smoke tests pass
- [ ] Payment URLs generate correctly
- [ ] UI shows FreeKassa buttons only when enabled
- [ ] Debug API returns proper configuration
- [ ] Error handling works for invalid requests
- [ ] Promote to Production
- [ ] Set Production environment variables
- [ ] Run final smoke test on Production

## 🚀 Quick Start

1. Install dependencies: `npm install`
2. Set up environment: Copy `env.example` to `.env.local`
3. Run migrations: `npm run db:migrate`
4. Start development: `npm run dev`

## 📋 Current Status

- ✅ AMO upload ready (Firefox 0.3.7.11)
- ✅ lifeundo.ru pages fixed
- ⏳ Vercel ENV + redeploy needed for getlifeundo.com
- ⏳ FreeKassa E2E testing pending

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run smtp:start` - Start SMTP listener
- `npm run relay:start` - Start email relay

## 📚 Documentation

All documentation is organized in the `docs/` directory:
- **Setup guides** in `docs/setup/` - Configuration, deployment, environment setup
- **Checklists** in `docs/checklists/` - Project checklists, plans, verification steps
- **Release notes** in `docs/releases/` - Changelogs, release notes, version history
- **Scripts** in `docs/scripts/` - Build scripts, utilities, automation tools
- **Patches** in `docs/patches/` - Patch documentation and implementation guides
- **Temp files** in `docs/temp/` - Temporary files, archives, old configs

### 📁 File Placement Rules

**New files should be placed in:**
- `docs/setup/` - New setup guides, configuration instructions
- `docs/checklists/` - New project checklists, verification steps
- `docs/releases/` - New release notes, changelog entries
- `docs/scripts/` - New build scripts, utility scripts
- `docs/patches/` - New patch documentation
- `docs/temp/` - Temporary files, old archives, deprecated configs

**DO NOT** place new documentation files in the root directory - they belong in `docs/` subdirectories.

## 🏗️ Architecture

- **Frontend**: Next.js with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Extensions**: Chrome (Manifest V2) and Firefox
- **Deployment**: Vercel for web, AMO for Firefox
- **Payments**: FreeKassa integration
- **Email**: SMTP relay system
