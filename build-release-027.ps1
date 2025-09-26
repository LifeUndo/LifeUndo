# Build LifeUndo v0.2.7
Write-Host "Building LifeUndo v0.2.7..."

# Create release directory
$releaseDir = "releases/0.2.7"
if (!(Test-Path $releaseDir)) {
    New-Item -ItemType Directory -Path $releaseDir -Force
}

# Copy Firefox files
Write-Host "Copying Firefox files..."
$firefoxDir = "$releaseDir/LifeUndo-0.2.7-firefox"
if (Test-Path $firefoxDir) {
    Remove-Item $firefoxDir -Recurse -Force
}
Copy-Item "extension_firefox" $firefoxDir -Recurse

# Copy Chrome files  
Write-Host "Copying Chrome files..."
$chromeDir = "$releaseDir/LifeUndo-0.2.7-chromium"
if (Test-Path $chromeDir) {
    Remove-Item $chromeDir -Recurse -Force
}
Copy-Item "extension" $chromeDir -Recurse

# Create Firefox XPI
Write-Host "Creating Firefox XPI..."
Set-Location $firefoxDir
Compress-Archive -Path * -DestinationPath "../LifeUndo-0.2.7-firefox.zip" -Force
Set-Location "../.."

# Create Chrome ZIP
Write-Host "Creating Chrome ZIP..."
Set-Location $chromeDir
Compress-Archive -Path * -DestinationPath "../LifeUndo-0.2.7-chromium.zip" -Force
Set-Location "../.."

# Generate checksums
Write-Host "Generating checksums..."
$checksumFile = "$releaseDir/checksums.txt"
$files = @(
    "LifeUndo-0.2.7-firefox.zip",
    "LifeUndo-0.2.7-chromium.zip"
)

$checksums = @()
foreach ($file in $files) {
    $filePath = "$releaseDir/$file"
    if (Test-Path $filePath) {
        $hash = Get-FileHash $filePath -Algorithm SHA256
        $checksums += "$($hash.Hash)  $file"
    }
}

$checksums | Out-File $checksumFile -Encoding UTF8

# Create release notes
$releaseNotesEn = @"
# LifeUndo v0.2.7 — Stable Popup & VIP

## What's New
- **Live RU/EN switching** - Instant language toggle with runtime locale loading
- **Single "What's New" modal** - Toggle behavior, closes on ESC/backdrop click
- **Robust VIP import** - Visual feedback with spinner, success/error messages
- **Upgrade to Pro stub** - Opens pricing page instead of dead button
- **Support link** - Direct Telegram access + Settings option
- **Trial hidden on VIP** - Clean UI when VIP license is active

## Bug Fixes
- Fixed RU/EN buttons not changing text
- Fixed "What's New" opening multiple times
- Fixed VIP import silent failures
- Fixed dead "Upgrade to Pro" button
- Fixed unclear "Settings" link

## Technical
- Runtime i18n loading from _locales
- Proper modal state management
- Enhanced error handling for VIP import
- Improved popup re-rendering on events
"@

$releaseNotesRu = @"
# LifeUndo v0.2.7 — Стабильный попап и VIP

## Что нового
- **Живое переключение RU/EN** - Мгновенная смена языка с runtime загрузкой
- **Единственное окно "Что нового"** - Toggle поведение, закрытие по ESC/клик
- **Надёжный импорт VIP** - Визуальный отклик со спиннером, сообщения об успехе/ошибках
- **Заглушка "Перейти на Pro"** - Открывает страницу тарифов вместо мёртвой кнопки
- **Ссылка поддержки** - Прямой доступ в Telegram + настройки
- **Trial скрыт при VIP** - Чистый UI при активной VIP лицензии

## Исправления
- Исправлены кнопки RU/EN, не меняющие текст
- Исправлено многократное открытие "Что нового"
- Исправлены тихие сбои импорта VIP
- Исправлена мёртвая кнопка "Перейти на Pro"
- Исправлена неясная ссылка "Settings"

## Техническое
- Runtime загрузка i18n из _locales
- Правильное управление состоянием модалов
- Улучшенная обработка ошибок импорта VIP
- Улучшенная перерисовка попапа по событиям
"@

$releaseNotesEn | Out-File "$releaseDir/release_notes_en.md" -Encoding UTF8
$releaseNotesRu | Out-File "$releaseDir/release_notes_ru.md" -Encoding UTF8

# Create README
$readme = @"
LifeUndo v0.2.7 Release

Files:
- LifeUndo-0.2.7-firefox.zip - Firefox extension (XPI format)
- LifeUndo-0.2.7-chromium.zip - Chrome/Chromium extension
- checksums.txt - SHA256 checksums

Release Notes:
- release_notes_en.md - English
- release_notes_ru.md - Russian

This release focuses on popup stability and VIP functionality improvements.
"@

$readme | Out-File "$releaseDir/README.txt" -Encoding UTF8

Write-Host "Build complete!"
Write-Host "Files created in $releaseDir/:"
Get-ChildItem $releaseDir | ForEach-Object { Write-Host "  $($_.Name)" }




















