# SEO Setup Instructions for LifeUndo

## Google Search Console

1. **Add Property:**
   - URL: `https://getlifeundo.com`
   - Verification: HTML file upload to `public/`

2. **Submit Sitemap:**
   - URL: `https://getlifeundo.com/sitemap.xml`

3. **Check hreflang:**
   - Verify `/ru` and `/en` have proper `hreflang` tags
   - Check canonical URLs point to correct locale

## Bing Webmaster Tools

1. **Add Site:**
   - URL: `https://getlifeundo.com`
   - Verification: Same HTML file as Google

2. **Submit Sitemap:**
   - URL: `https://getlifeundo.com/sitemap.xml`

## Verification Commands

```bash
# Check hreflang
curl -s https://getlifeundo.com/ru | grep -i hreflang
curl -s https://getlifeundo.com/en | grep -i hreflang

# Check canonical
curl -s https://getlifeundo.com/ru | grep -i canonical
curl -s https://getlifeundo.com/en | grep -i canonical

# Check sitemap
curl -s https://getlifeundo.com/sitemap.xml
```

## Expected Results

- **hreflang:** `rel="alternate" hreflang="ru"` and `rel="alternate" hreflang="en"`
- **canonical:** Points to current locale URL
- **sitemap:** Contains all RU/EN pages with proper priorities
