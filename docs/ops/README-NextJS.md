# GetLifeUndo — Next.js integration pack

This pack contains:
- Static pages for `/public` (support, pricing, success, fail, fund) in RU/EN
- `src/components/Footer.tsx` (React/Tailwind)
- Patches & notes (`patches/*`)
- Date: 2025-09-27

## Install
Copy `public/*` into your Next.js project's `/public`.
Copy `src/components/Footer.tsx` to your Next.js app and render it in `src/app/layout.tsx` (see `patches/add_footer_usage.md`).

## Build & Deploy
Add ENV in Vercel, redeploy without build cache.
Run smoke checks as in PROJECT_READINESS.md.
