Summary

Add unified plan map PlanKey -> productId in src/business/pricing/plans.ts (PROM/VIPL/TEAM5/S6M).
FreeKassaButton posts { plan, productId }, shows i18n errors on failure: src/components/payments/FreeKassaButton.tsx.
ModernFooter derives locale from usePathname(); removes dead /contacts: src/components/ModernFooter.tsx.
Single source of truth for version: public/version.json.
ReleaseBanner uses RSC-safe absolute fetch via next/headers: src/components/ReleaseBanner.tsx.
Downloads page shows the same version from /version.json with cache-buster: src/app/[locale]/downloads/DownloadsClient.tsx.
Pricing page uses FK button with plan keys: src/app/[locale]/pricing/page.tsx.

How to test

Pricing → click any FK button → should redirect to pay.fk.money or show localized error.
Footer → no /contacts; internal links preserve the current locale segment.
Version → /ru/developers banner and /ru/downloads show the same version from /version.json.

Smokes

HTTP 200: /ru, /en, /ru/developers, /en/developers, /ru/partners, /en/partners.
CSP present; no unsafe-eval.
FreeKassa API: POST both { plan:"pro_month" } and { productId:"PROM" } → returns pay_url.
Version unified from public/version.json.

Risks / notes

If using a real i18n hook (e.g., next-intl), replace temporary useI18n() in Footer and FK button and ensure keys:
RU: errors.unknownPlan, errors.fkUnavailable, common.payWithFreeKassa
EN: errors.unknownPlan, errors.fkUnavailable, common.payWithFreeKassa
CDN HTML can cache markup; banner fetch uses no-store but may need a hard refresh once.

Status

All target files updated; banner fetch is production-safe in RSC.
