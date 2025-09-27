# Эмулятор FreeKassa notify для тестирования подписей и идемпотентности (PowerShell)
# Использование: .\fk-notify-sim.ps1 <https://project.vercel.app> <MERCHANT_ID> <AMOUNT> <ORDER_ID> <SECRET2>

param(
    [Parameter(Mandatory=$true)][string]$Base,
    [Parameter(Mandatory=$true)][string]$MerchantId,
    [Parameter(Mandatory=$true)][string]$Amount,
    [Parameter(Mandatory=$true)][string]$OrderId,
    [Parameter(Mandatory=$true)][string]$Secret2
)

Write-Host "🧪 Эмулятор FreeKassa notify" -ForegroundColor Cyan
Write-Host "🔗 URL: $Base/api/fk/notify" -ForegroundColor Yellow
Write-Host "📋 Данные:" -ForegroundColor Green
Write-Host "   Merchant ID: $MerchantId" -ForegroundColor Gray
Write-Host "   Amount: $Amount" -ForegroundColor Gray
Write-Host "   Order ID: $OrderId" -ForegroundColor Gray
Write-Host "   Secret2: $($Secret2.Substring(0, 4))***" -ForegroundColor Gray
Write-Host ""

# Генерируем подпись по схеме: merchant_id:amount:secret2:order_id
$raw = "$MerchantId:$Amount:$Secret2:$OrderId"
$md5 = [System.Security.Cryptography.MD5]::Create()
$hash = ($md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($raw)) | ForEach-Object ToString x2) -join ''

Write-Host "🔐 Подпись: $hash" -ForegroundColor Yellow
Write-Host ""

# Подготавливаем тело запроса
$body = @{
    MERCHANT_ID = $MerchantId
    AMOUNT      = $Amount
    PAYMENT_ID  = $OrderId
    SIGN        = $hash
    intid       = 999999
    us_email    = 'test@example.com'
    us_plan     = 'vip_lifetime'
}

Write-Host "📤 Отправляем notify..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Method Post -Uri "$Base/api/fk/notify" -ContentType "application/x-www-form-urlencoded" -Body $body
    Write-Host "📥 Ответ: $response" -ForegroundColor Green
    
    if ($response -eq "OK") {
        Write-Host "✅ Успешно! Проверьте логи Vercel на [FK][notify] OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Ошибка! Проверьте логи Vercel" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка сети: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Для тестирования идемпотентности запустите команду ещё раз с теми же параметрами" -ForegroundColor Yellow
Write-Host "   Ожидаемо: OK, но без повторной бизнес-логики в логах" -ForegroundColor Gray
