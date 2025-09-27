# Firefox 0.3.7.11 XPI Build & AMO Upload

## 1. Build XPI File

### Prerequisites:
- `web-ext` installed globally: `npm i -g web-ext@7`
- Firefox extension files in `extension_firefox/` directory
- `manifest.json` version set to `0.3.7.11`

### Build Command:
```bash
npx web-ext build --source-dir=extension_firefox --artifacts-dir=./dist --overwrite-dest
```

### Expected Output:
- XPI file: `dist/lifeundo-0.3.7.11.xpi`
- File size: ~500KB-1MB
- Valid manifest with correct version

## 2. AMO Upload Process

### Step 1: Login to AMO
1. Go to https://addons.mozilla.org/
2. Login with developer account
3. Go to Developer Hub

### Step 2: Upload XPI
1. Click "Submit New Add-on"
2. Upload `lifeundo-0.3.7.11.xpi`
3. Select "On this site" (listed)
4. Fill in required fields

### Step 3: Release Notes
Use content from `LifeUndo_handoff_0_3_7.txt`:

```
What's new in v0.3.7.11:

- Pro button now routes to /pricing (RU) or /en/pricing (EN) based on browser language
- Improved RU/EN language detection
- UI polish and stability improvements
- One-click VIP activation from popup
- Unified license verification core
```

### Step 4: Review & Submit
1. Review all information
2. Submit for review
3. Wait for AMO approval (usually 24-48 hours)

## 3. Verification

### Pro Button Functionality:
- **RU browser**: Pro button → `/pricing`
- **EN browser**: Pro button → `/en/pricing`
- **Fallback**: Pro button → `/en/pricing` (default)

### Test Steps:
1. Install extension from AMO
2. Open popup
3. Click "Pro" button
4. Verify correct page opens
5. Test with different browser languages

## 4. Release Notes Template

### English:
```
LifeUndo v0.3.7.11 - Smart Pro Button Routing

New Features:
- Pro button automatically detects browser language
- Routes to correct pricing page (RU/EN)
- Improved user experience for international users

Improvements:
- Better language detection
- UI polish and stability
- One-click VIP activation
- Unified license core

Bug Fixes:
- Fixed Pro button routing issues
- Improved popup responsiveness
```

### Russian:
```
LifeUndo v0.3.7.11 - Умная маршрутизация кнопки Pro

Новые функции:
- Кнопка Pro автоматически определяет язык браузера
- Переход на правильную страницу тарифов (RU/EN)
- Улучшенный опыт для международных пользователей

Улучшения:
- Лучшее определение языка
- Полировка интерфейса и стабильность
- Активация VIP в один клик
- Единое ядро лицензий

Исправления:
- Исправлены проблемы маршрутизации кнопки Pro
- Улучшена отзывчивость попапа
```

## 5. Post-Release

### Monitoring:
- Check AMO review status
- Monitor user feedback
- Track download statistics
- Watch for any issues

### Social Media:
- Announce new version
- Highlight Pro button improvements
- Share user testimonials
- Update support documentation

## 6. Success Criteria

✅ **XPI builds successfully**  
✅ **AMO upload completes**  
✅ **Review passes**  
✅ **Pro button routes correctly**  
✅ **No critical issues reported**  
✅ **Download statistics increase**

## 7. Next Steps

1. **Monitor AMO review** (24-48 hours)
2. **Social media announcement** after approval
3. **User feedback collection**
4. **Plan next version** based on feedback
5. **Update documentation** and support materials
