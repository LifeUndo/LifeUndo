# Скрипт генерации checksums.txt для релиза
param(
    [Parameter(Mandatory=$true)]
    [string]$VersionPath
)

Write-Host "Генерация checksums.txt для $VersionPath" -ForegroundColor Green

# Проверяем существование папки
if (-not (Test-Path $VersionPath)) {
    Write-Host "ОШИБКА: Папка '$VersionPath' не найдена!" -ForegroundColor Red
    exit 1
}

$checksumsFile = Join-Path $VersionPath "checksums.txt"
$files = @()

# Ищем файлы релиза
$patterns = @("*.xpi", "*.exe", "*.dmg")
foreach ($pattern in $patterns) {
    $foundFiles = Get-ChildItem -Path $VersionPath -Filter $pattern
    $files += $foundFiles
}

if ($files.Count -eq 0) {
    Write-Host "ОШИБКА: Не найдено файлов для подсчета checksums!" -ForegroundColor Red
    exit 1
}

Write-Host "Найдено файлов: $($files.Count)" -ForegroundColor Cyan

# Генерируем SHA256 для каждого файла
$checksums = @()
foreach ($file in $files) {
    Write-Host "Обработка: $($file.Name)" -ForegroundColor Yellow
    $hash = Get-FileHash -Path $file.FullName -Algorithm SHA256
    $checksums += "$($hash.Hash.ToLower())  $($file.Name)"
}

# Записываем в файл
$checksums | Out-File -FilePath $checksumsFile -Encoding UTF8

Write-Host "✅ checksums.txt создан: $checksumsFile" -ForegroundColor Green
Write-Host "Содержимое:" -ForegroundColor Cyan
Get-Content $checksumsFile | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
