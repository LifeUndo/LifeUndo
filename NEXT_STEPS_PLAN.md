# Next Steps Plan - GetLifeUndo

## 🚀 Immediate Actions (Ready to Execute)

### 1. Create PR for Current Release
**Branch**: `maintenance/release-lock-20250130-02` → `main`
**Link**: https://github.com/LifeUndo/LifeUndo/pull/new/maintenance/release-lock-20250130-02

**What's included**:
- ✅ Content verification (unified slogan, YouTube URL fix)
- ✅ Smoke testing artifacts (`ops/checks/`)
- ✅ Build verification (successful `npm run build`)
- ✅ Release notes with rollback instructions

### 2. After PR Merge → Vercel Actions
1. **Promote to Production** the latest deploy
2. **Protect** the new production deploy
3. **Run smoke tests** on production:
   ```powershell
   cd ops/checks
   .\smoke.ps1 -Base "https://getlifeundo.com"
   ```

## 📋 Next Phase Materials (Ready to Deploy)

### 3. English i18n Support
**Files created**:
- `src/messages/en.json` - English translations
- Updated `LanguageSwitcher.tsx` - Shows only when `NEXT_PUBLIC_SHOW_LANG_SWITCH=true`

**To activate**:
1. Set environment variable `NEXT_PUBLIC_SHOW_LANG_SWITCH=true` in Vercel (Preview only)
2. Test language switching on Preview
3. Expand English content as needed

### 4. SEO Enhancement
**Added to `src/app/[locale]/layout.tsx`**:
- ✅ Organization JSON-LD
- ✅ SoftwareApplication JSON-LD  
- ✅ FAQ JSON-LD

**Benefits**:
- Better search engine understanding
- Rich snippets in search results
- Improved click-through rates

## 🎯 Future Phases (In Order)

### Phase 1: FreeKassa Integration
- **Status**: Awaiting merchant activation
- **Action**: Replace placeholder payment buttons with live FreeKassa integration
- **Files**: Update `/ru/pricing` page with real payment forms

### Phase 2: Extension Publication
- **Firefox AMO**: Prepare store listing, screenshots, descriptions (RU/EN)
- **Chrome Web Store**: Backup store listing with same media assets
- **Action**: Update `/ru/download` page with live download buttons

### Phase 3: Social Media Setup
**Assets needed** (hand off to designer):
- Avatar 800×800 (dark/light backgrounds)
- Banners: YouTube 2560×1440, X 1500×500, TG 1280×720, GitHub 1280×640
- Product screenshots 1280×800 (3-5 pieces, no personal data)
- Promo banner 1400×560

**Content plan**: 12 posts/month covering features, use cases, tips

### Phase 4: Analytics & Feedback
- **Web analytics**: Privacy-friendly visitor tracking
- **CTA tracking**: Monitor download/purchase button clicks
- **User feedback**: Contact forms → `support@getlifeundo.com`

### Phase 5: English Content Expansion
- **Pages**: Features, Use-cases, Pricing (full English versions)
- **Action**: Move hardcoded text to `en.json` translation files
- **Timeline**: Gradual rollout based on user demand

## 🔧 Technical Debt & Quality

### Performance
- **Lighthouse budget**: LCP <2.5s target
- **Image optimization**: WebP/AVIF formats
- **Bundle analysis**: Monitor JavaScript bundle size

### CI/CD
- **Linting**: ESLint + Prettier on PR
- **Type checking**: TypeScript strict mode
- **Smoke tests**: Automated on every deploy
- **Security headers**: HSTS, CSP validation

## 📊 Success Metrics

### Short-term (1 month)
- ✅ Stable production deployment
- ✅ Zero critical errors
- ✅ All smoke tests passing
- ✅ FreeKassa integration live

### Medium-term (3 months)
- ✅ Extension published on AMO/Chrome
- ✅ Social media profiles active
- ✅ English content available
- ✅ Analytics data flowing

### Long-term (6 months)
- ✅ Multi-language support complete
- ✅ User feedback system active
- ✅ Performance targets met
- ✅ SEO rankings improved

---

## 🚨 Emergency Procedures

### Rollback (if needed)
1. **Vercel**: Use previous stable production deploy
2. **Git**: `git checkout <last-stable-tag> && git push origin HEAD:main`
3. **Environment**: Revert `NEWSITE_MODE` to `false` if needed

### Contact Points
- **Support**: `support@getlifeundo.com`
- **Technical**: GitHub Issues
- **Social**: `@LifeUndoSupport` (Telegram)

---

*All materials are ready for immediate deployment. Each phase can be executed independently without affecting production stability.*
