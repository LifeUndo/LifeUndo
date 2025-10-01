# Internationalization (i18n) Guide

## Overview

GetLifeUndo uses `next-intl` for internationalization support.

## Supported Locales

- `ru` (Russian) - Default
- `en` (English) - Fallback (currently copy of RU, to be translated)

## URL Structure

- `/ru/pricing` - Russian pricing page
- `/en/pricing` - English pricing page
- `/` - Redirects to `/ru/`

## Adding New Language

### 1. Update Config

Edit `src/i18n/config.ts`:
```ts
export const locales = ['ru', 'en', 'es'] as const; // Add 'es'
```

### 2. Create Message Files

Copy existing locale folder:
```bash
cp -r messages/ru messages/es
```

### 3. Translate Messages

Edit JSON files in `messages/es/`:
- `common.json`
- `pricing.json`
- `success.json`
- `support.json`

### 4. Test

Visit `/es/pricing` to verify translations work.

## Message File Structure

### `common.json`
Common UI elements: navigation, CTAs, badges

### `pricing.json`
Pricing page specific: plan names, buttons, descriptions

### `success.json`
Payment success page: titles, steps, hints

### `support.json`
Support page: FAQ, form labels

## Naming Conventions

- Use dot notation: `"cta.learnMore"`
- Group related keys: `"nav.pricing"`, `"nav.features"`
- Keep keys descriptive and semantic

## Missing Keys

If a translation key is missing, next-intl will:
1. Fall back to default locale (ru)
2. Log warning in development
3. Show key name in brackets

## Best Practices

- Keep translations short and concise
- Avoid HTML in translation strings
- Use placeholders for dynamic content: `{date}`, `{email}`
- Test all locales before deployment

