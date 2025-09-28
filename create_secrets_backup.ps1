# PowerShell скрипт для создания зашифрованного архива секретов
# Запуск: powershell -ExecutionPolicy Bypass -File create_secrets_backup.ps1

param(
    [string]$Password = "",
    [string]$BackupPath = "C:\Загрузки\secrets_backup"
)

# Проверяем наличие 7-Zip
$sevenZipPath = "C:\Program Files\7-Zip\7z.exe"
if (-not (Test-Path $sevenZipPath)) {
    Write-Error "7-Zip не найден по пути: $sevenZipPath"
    Write-Host "Установите 7-Zip или укажите правильный путь"
    exit 1
}

# Создаем папку для бэкапа
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force
    Write-Host "Создана папка для бэкапа: $BackupPath"
}

# Генерируем пароль если не указан
if ([string]::IsNullOrEmpty($Password)) {
    $Password = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 16 | ForEach-Object {[char]$_})
    Write-Host "Сгенерирован пароль: $Password"
    Write-Host "ВАЖНО: Сохраните этот пароль в безопасном месте!"
}

# Путь к файлу секретов
$secretsPath = "C:\Users\Home\Downloads\LifeUndo\business\secrets\credentials.json"
if (-not (Test-Path $secretsPath)) {
    Write-Error "Файл секретов не найден: $secretsPath"
    exit 1
}

# Создаем архив с текущей датой
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$archivePath = Join-Path $BackupPath "credentials_$timestamp.7z"

Write-Host "Создаем зашифрованный архив..."
Write-Host "Источник: $secretsPath"
Write-Host "Архив: $archivePath"

# Создаем зашифрованный архив
try {
    & $sevenZipPath a -t7z $archivePath $secretsPath -p$Password -mhe=on -mx=9
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Архив успешно создан: $archivePath"
        Write-Host "🔐 Пароль: $Password"
        Write-Host ""
        Write-Host "ВАЖНЫЕ ИНСТРУКЦИИ:"
        Write-Host "1. Сохраните пароль в безопасном месте"
        Write-Host "2. НЕ храните пароль рядом с архивом"
        Write-Host "3. Удалите этот скрипт после использования"
        Write-Host "4. Регулярно создавайте новые архивы"
    } else {
        Write-Error "Ошибка создания архива"
        exit 1
    }
} catch {
    Write-Error "Ошибка выполнения 7-Zip: $_"
    exit 1
}

# Устанавливаем права доступа только для владельца
Write-Host ""
Write-Host "Устанавливаем права доступа..."

try {
    # Сбрасываем наследование
    icacls $BackupPath /inheritance:r
    # Даем полный доступ только текущему пользователю
    icacls $BackupPath /grant:r "$env:USERNAME:(OI)(CI)F"
    
    Write-Host "✅ Права доступа установлены"
} catch {
    Write-Warning "Не удалось установить права доступа: $_"
}

Write-Host ""
Write-Host "🎉 Резервное копирование завершено!"
Write-Host "📁 Архив: $archivePath"
Write-Host "🔐 Пароль: $Password"
