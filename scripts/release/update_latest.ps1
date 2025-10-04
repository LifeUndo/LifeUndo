# Скрипт обновления latest.json и копирования файлов в /latest
param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

Write-Host "Обновление latest для версии $Version" -ForegroundColor Green

$versionPath = "public/app/$Version"
$latestPath = "public/app/latest"

# Проверяем существование папки версии
if (-not (Test-Path $versionPath)) {
    Write-Host "ОШИБКА: Папка '$versionPath' не найдена!" -ForegroundColor Red
    exit 1
}

# Создаем папку latest если не существует
if (-not (Test-Path $latestPath)) {
    New-Item -ItemType Directory -Path $latestPath -Force | Out-Null
}

# Очищаем папку latest
Get-ChildItem -Path $latestPath -File | Remove-Item -Force

Write-Host "Копирование файлов в /latest..." -ForegroundColor Cyan

# Копируем файлы и создаем latest.json
$latestJson = @{
    version = $Version
    publishedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    files = @{}
}

# Копируем файлы и обновляем JSON
$patterns = @(
    @{pattern="*.xpi"; key="firefox"},
    @{pattern="*.exe"; key="win"},
    @{pattern="*.dmg"; key="mac"}
)

foreach ($fileType in $patterns) {
    $files = Get-ChildItem -Path $versionPath -Filter $fileType.pattern
    if ($files.Count -gt 0) {
        $sourceFile = $files[0]
        $latestFileName = $sourceFile.Name -replace $Version, "latest"
        $latestFilePath = Join-Path $latestPath $latestFileName
        
        # Копируем файл
        Copy-Item -Path $sourceFile.FullName -Destination $latestFilePath -Force
        Write-Host "  Скопирован: $($sourceFile.Name) -> $latestFileName" -ForegroundColor Green
        
        # Добавляем в JSON
        $latestJson.files[$fileType.key] = "https://cdn.getlifeundo.com/app/latest/$latestFileName"
    }
}

# Записываем latest.json
$latestJsonPath = Join-Path $latestPath "latest.json"
$latestJson | ConvertTo-Json -Depth 3 | Out-File -FilePath $latestJsonPath -Encoding UTF8

Write-Host "✅ latest.json создан: $latestJsonPath" -ForegroundColor Green
Write-Host "Содержимое:" -ForegroundColor Cyan
Get-Content $latestJsonPath | ForEach-Object { Write-Host "  $_" -ForegroundColor White }

Write-Host "Готово! Latest обновлен для версии $Version" -ForegroundColor Green
