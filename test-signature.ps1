# FreeKassa Signature Test (PowerShell)
# Используйте этот скрипт для проверки подписи

$merchant = "54c3ac0581ad5eeac3fbee2ffac83f6c"
$amount = "599.00"
$order = "1706630400000-test123"
$secret1 = "ponOk=W5^2W9t]["

Write-Host "Testing FreeKassa signature generation..."
Write-Host "Merchant ID: $merchant"
Write-Host "Amount: $amount"
Write-Host "Order ID: $order"
Write-Host "Secret1: $($secret1.Substring(0,4))***"

# Формируем строку для подписи
$payload = "$merchant`:$amount`:$secret1`:$order"
Write-Host "Signature string: $payload"

# Создаем MD5 хеш
$md5 = New-Object System.Security.Cryptography.MD5CryptoServiceProvider
$hash = ($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($payload)) | ForEach-Object { $_.ToString("x2") }) -join ""
$signature = $hash.ToLower()

Write-Host "MD5 signature: $signature"

# Формируем URL
$url = "https://pay.freekassa.ru/?m=$merchant&oa=$amount&o=$order&s=$signature"
Write-Host "Generated URL: $url"

Write-Host "`nParameters check:"
Write-Host "m (merchant): $merchant"
Write-Host "oa (amount): $amount"
Write-Host "o (order): $order"
Write-Host "s (signature): $signature"
