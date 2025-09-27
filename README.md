# LifeUndo Project

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
