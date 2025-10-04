# AMO Upload Instructions

## Step-by-step guide for Firefox Add-ons submission

### 1. Prepare files
- ✅ `lifeundo-0.3.7.12.xpi` - готов в `public/app/0.3.7.12/`
- ✅ `manifest.json` - обновлен для AMO
- ✅ Release notes - готовы в `store/amo/RELEASE_NOTES.md`
- ✅ Privacy policy - ссылка на сайт
- ⚠️ **Нужно:** иконки PNG (16/32/48/64/96/128/256) и скриншоты (1280×800)

### 2. Go to AMO Developer Hub
- URL: https://addons.mozilla.org/ru/developers/addons
- Login with Firefox account

### 3. Submit process

#### 3.1 Upload XPI
- Click **"Submit a New Add-on"** (first time) or **"Submit a New Version"** (update)
- Upload `lifeundo-0.3.7.12.xpi`
- Wait for validation (should pass)

#### 3.2 Fill listing information

**Basic Info:**
- Name (EN): `GetLifeUndo`
- Name (RU): `GetLifeUndo`
- Categories: `Productivity`, `Privacy & Security`
- Tags: `undo, forms, clipboard, privacy, restore`

**Summary:**
- EN: `Ctrl+Z for your online life. Restore lost form text, clipboard history and closed tabs — 100% local, private.`
- RU: `Ctrl+Z для жизни в интернете. Верни потерянный текст форм, историю буфера и закрытые вкладки — 100% локально, приватно.`

**Description:**
- EN: Use text from `store/amo/LISTING_TEXTS.md`
- RU: Use text from `store/amo/LISTING_TEXTS.md`

**URLs:**
- Homepage: `https://getlifeundo.com`
- Support: `mailto:support@getlifeundo.com`
- Privacy Policy: `https://getlifeundo.com/ru/privacy`

#### 3.3 Upload images
- **Icons:** 16/32/48/64/96/128/256 PNG (square, no transparency issues)
- **Screenshots:** 2-4 images per language, 1280×800 or 1365×768

#### 3.4 Release notes
- Use texts from `store/amo/RELEASE_NOTES.md`
- Both EN and RU versions

#### 3.5 Privacy & Permissions
- **Data collection:** No
- **Privacy policy:** Link to website
- **Permissions justification:** Use text from `store/amo/PRIVACY_POLICY.md`

#### 3.6 Review notes
- Use text from `store/amo/RELEASE_NOTES.md` section "Review Notes"

### 4. Submit for review
- Click **Submit**
- Status: In Review → Approved
- Get public URL: `https://addons.mozilla.org/firefox/addon/getlifeundo/`

### 5. After approval
1. **Update latest.json:**
   ```json
   {
     "files": {
       "firefox": "https://addons.mozilla.org/firefox/addon/getlifeundo/"
     }
   }
   ```

2. **Deploy to CDN:**
   - Upload updated `latest.json` to CDN
   - Site will automatically show Firefox button

3. **Test:**
   - Check `/downloads` RU/EN - Firefox button should be visible
   - Check `/downloads/archive` - both versions listed

## Files needed:
- [ ] Icons (16/32/48/64/96/128/256 PNG)
- [ ] Screenshots (2-4 per language, 1280×800)
- [ ] XPI file (ready: `public/app/0.3.7.12/lifeundo-0.3.7.12.xpi`)

## After AMO approval:
- [ ] Get AMO URL
- [ ] Update `latest.json` with AMO URL
- [ ] Deploy to CDN
- [ ] Test site functionality
