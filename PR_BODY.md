Summary
Add unified plan map PlanKey -> productId in src/business/pricing/plans.ts (PROM/VIPL/TEAM5/S6M).
FreeKassaButton posts { plan, productId }, shows i18n errors on failure.
ModernFooter derives locale from usePathname(); removes dead /contacts.
Single source of truth for version: public/version.json.
ReleaseBanner uses RSC-safe absolute fetch via next/headers.
Downloads page shows the same version from /version.json with cache-buster.
Pricing page uses FK button with plan keys.

How to test
Pricing → FK → pay.fk.money or localized error.
Footer → no /contacts; links keep locale.
Version → /ru/developers and /ru/downloads show 0.3.7.32 from /version.json.

Smokes
HTTP 200 on /ru, /en, /ru/developers, /en/developers, /ru/partners, /en/partners.
CSP present; no unsafe-eval.
FreeKassa API: POST { plan:"pro_month" } and { productId:"PROM" } → pay_url.
Version unified from public/version.json.
