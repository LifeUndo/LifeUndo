# Скрипт упаковки Firefox расширения в XPI
param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

Write-Host "Упаковка Firefox расширения версии $Version" -ForegroundColor Green

# Пути
$extensionPath = "extension"  # Папка с расширением
$outputDir = "public/app/$Version"
$xpiName = "lifeundo-$Version.xpi"

# Проверяем существование папки расширения
if (-not (Test-Path $extensionPath)) {
    Write-Host "ОШИБКА: Папка '$extensionPath' не найдена!" -ForegroundColor Red
    Write-Host "Создайте папку 'extension' с содержимым расширения" -ForegroundColor Yellow
    exit 1
}

# Создаем выходную папку
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Упаковываем в ZIP (XPI это ZIP)
$zipPath = Join-Path $outputDir $xpiName
Write-Host "Создание XPI: $zipPath" -ForegroundColor Cyan

# Удаляем старый файл если есть
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Создаем ZIP архив
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($extensionPath, $zipPath)

if (Test-Path $zipPath) {
    $fileSize = (Get-Item $zipPath).Length
    Write-Host "XPI создан: $xpiName ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
} else {
    Write-Host "Ошибка создания XPI!" -ForegroundColor Red
    exit 1
}

Write-Host "Готово! XPI сохранен в: $zipPath" -ForegroundColor Green
