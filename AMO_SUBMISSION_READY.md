# 🚀 AMO Submission Ready - Final Instructions

## ✅ What's Ready:

1. **XPI file:** `public/app/0.3.7.12/lifeundo-0.3.7.12.xpi` (32.06 KB)
2. **Manifest:** Updated for AMO with proper gecko.id and homepage
3. **AMO materials:** All texts and instructions in `store/amo/`
4. **Latest files:** Updated with new XPI

## 📋 What You Need to Do:

### 1. Get Missing Assets
- **Icons:** 16/32/48/64/96/128/256 PNG (square, no transparency)
- **Screenshots:** 2-4 images per language, 1280×800 resolution

### 2. Submit to AMO
- Go to: https://addons.mozilla.org/ru/developers/addons
- Upload `lifeundo-0.3.7.12.xpi`
- Use all texts from `store/amo/LISTING_TEXTS.md`
- Use release notes from `store/amo/RELEASE_NOTES.md`
- Privacy policy: https://getlifeundo.com/ru/privacy

### 3. After AMO Approval
When you get the AMO URL (like `https://addons.mozilla.org/firefox/addon/getlifeundo/`):

1. **Update latest.json:**
   ```json
   {
     "files": {
       "firefox": "https://addons.mozilla.org/firefox/addon/getlifeundo/"
     }
   }
   ```

2. **Deploy to CDN:**
   - Upload `public/app/latest/latest.json` to CDN
   - Site will automatically show Firefox button

3. **Test:**
   - Check `/downloads` - Firefox button should be visible
   - Check `/downloads/archive` - both versions listed

## 📁 File Structure:
```
store/amo/
├── RELEASE_NOTES.md ✅
├── PRIVACY_POLICY.md ✅
├── LISTING_TEXTS.md ✅
└── AMO_INSTRUCTIONS.md ✅

public/app/0.3.7.12/
├── lifeundo-0.3.7.12.xpi ✅ (32.06 KB)
├── checksums.txt ✅
└── RELEASE_NOTES.md ✅

public/app/latest/
├── lifeundo-latest.xpi ✅
├── latest.json ✅
└── [other files] ✅
```

## 🎯 Next Steps:
1. **Get icons/screenshots** → Upload to AMO
2. **Submit for review** → Wait for approval
3. **Get AMO URL** → Update latest.json
4. **Deploy to CDN** → Site shows Firefox button

**Everything is ready for AMO submission!** 🚀
