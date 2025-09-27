# LifeUndo Project Structure Guide

## 📁 Directory Structure

```
LifeUndo/
├── src/                    # Next.js application source code
│   ├── app/               # App Router pages and API routes
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   ├── db/                # Database configuration
│   ├── services/          # Background services
│   └── middleware.ts      # Next.js middleware
├── public/                # Static files and pages
│   ├── api/               # Static API documentation
│   ├── en/                # English static pages
│   ├── success/           # Success page
│   ├── fail/              # Fail page
│   └── index.html         # Homepage
├── extension/             # Chrome extension
├── extension_firefox/     # Firefox extension
├── migrations/            # Database migrations
├── docs/                  # All documentation
│   ├── checklists/        # Project checklists and plans
│   ├── patches/           # Patch documentation
│   ├── setup/             # Setup guides and instructions
│   ├── releases/          # Release notes and changelogs
│   ├── scripts/           # Build and utility scripts
│   └── temp/              # Temporary files and archives
├── releases/              # Extension release archives
├── business/              # Business plans and documentation
├── assets/                # Project assets
├── icons/                 # Extension icons
├── lifeundo-web-icons/    # Web icons
├── store/                 # Store-related files
├── packages/              # NPM packages
├── cloudflare/            # Cloudflare configuration
├── monitoring/            # Monitoring setup
├── tests/                 # Test files
├── utils/                 # Utility functions
└── README.md              # Project overview
```

## 📋 File Placement Rules

### ✅ Where to Place New Files

**Documentation:**
- `docs/setup/` - Setup guides, configuration instructions
- `docs/checklists/` - Project checklists, verification steps
- `docs/releases/` - Release notes, changelog entries
- `docs/scripts/` - Build scripts, utility scripts
- `docs/patches/` - Patch documentation
- `docs/temp/` - Temporary files, old archives

**Code:**
- `src/app/` - Next.js pages and API routes
- `src/components/` - React components
- `src/lib/` - Utility libraries
- `src/services/` - Background services
- `migrations/` - Database migrations
- `tests/` - Test files

**Assets:**
- `public/` - Static files and pages
- `assets/` - Project assets
- `icons/` - Extension icons
- `lifeundo-web-icons/` - Web icons

**Extensions:**
- `extension/` - Chrome extension
- `extension_firefox/` - Firefox extension
- `releases/` - Extension release archives

### ❌ What NOT to Do

**DO NOT:**
- Place documentation files in the root directory
- Create new folders in the root without a clear purpose
- Mix different types of files in the same directory
- Leave temporary files in the root directory

## 🔄 Maintenance Rules

### When Adding New Files:
1. **Check the structure** - Does a suitable directory already exist?
2. **Follow the pattern** - Place files in the most appropriate subdirectory
3. **Update documentation** - If creating a new category, update this guide
4. **Commit with clear message** - Use descriptive commit messages

### When Moving Files:
1. **Use git mv** - Preserve file history
2. **Update references** - Check for broken links or imports
3. **Test the change** - Ensure nothing breaks
4. **Document the change** - Update relevant documentation

### When Cleaning Up:
1. **Move to docs/temp/** - Don't delete immediately
2. **Archive old releases** - Keep in releases/ directory
3. **Remove duplicates** - Consolidate similar files
4. **Update README.md** - Keep project overview current

## 📝 Naming Conventions

### Files:
- Use kebab-case for file names: `setup-vercel-env.md`
- Use descriptive names: `firefox-xpi-build.md`
- Include version numbers: `PATCH-0.4.3-A-SDK-CHART.md`

### Directories:
- Use lowercase: `docs/`, `src/`, `public/`
- Use descriptive names: `extension_firefox/`, `lifeundo-web-icons/`
- Avoid abbreviations: `business/` not `biz/`

## 🚨 Common Mistakes to Avoid

1. **Creating files in the wrong place** - Check the structure first
2. **Not updating documentation** - Keep guides current
3. **Leaving temporary files** - Move to `docs/temp/`
4. **Breaking existing structure** - Follow established patterns
5. **Not using git properly** - Use `git mv` for moves

## 🔍 Quick Reference

**Need to find something?**
- Setup guides → `docs/setup/`
- Project checklists → `docs/checklists/`
- Release notes → `docs/releases/`
- Build scripts → `docs/scripts/`
- Patch docs → `docs/patches/`
- Temporary files → `docs/temp/`

**Need to add something?**
- New setup guide → `docs/setup/`
- New checklist → `docs/checklists/`
- New release notes → `docs/releases/`
- New script → `docs/scripts/`
- New patch doc → `docs/patches/`
- Temporary file → `docs/temp/`

## 📚 Related Documentation

- [README.md](../README.md) - Project overview
- [docs/setup/](../setup/) - Setup guides
- [docs/checklists/](../checklists/) - Project checklists
- [docs/releases/](../releases/) - Release notes
- [docs/scripts/](../scripts/) - Build scripts
