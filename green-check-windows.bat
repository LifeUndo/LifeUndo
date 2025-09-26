@echo off
REM green-check-windows.bat — итоговая валидация 0.4.2 для .com и .ru (Windows)

set DOMAINS=getlifeundo.com lifeundo.ru
set BEGET_IP=<BEGET_IP>
set EXPECT_VER=0.4.2

echo ========================================
echo Green Check for 0.4.2 Validation
echo ========================================

for %%d in (%DOMAINS%) do (
    echo — — — %%d — — —
    
    REM 1) DNS → A (должен указывать на Beget)
    for /f %%a in ('dig @1.1.1.1 +short %%d A') do set A=%%a
    if "%A%"=="%BEGET_IP%" (
        echo [PASS] A %%d = %A%
    ) else (
        echo [FAIL] A %%d = %A% (ожидаем %BEGET_IP%)
        set EXIT=1
    )
    
    REM 1.1) Нет левых AAAA
    for /f %%a in ('dig @1.1.1.1 +short %%d AAAA') do set AAAA=%%a
    if "%AAAA%"=="" (
        echo [PASS] AAAA %%d отсутствуют
    ) else (
        echo [WARN] AAAA присутствуют: %AAAA% (убрать/поправить при необходимости)
    )
    
    REM 2) Заголовки (через Cloudflare, без Vercel)
    curl -sS --max-time 15 -I -H "Cache-Control: no-cache" -L "https://%%d/?cb=%RANDOM%" > temp_headers.txt
    findstr /i "server: cloudflare" temp_headers.txt >nul
    if %errorlevel%==0 (
        echo [PASS] Server: cloudflare
    ) else (
        echo [FAIL] Server не cloudflare
        set EXIT=1
    )
    
    findstr /i "cf-cache-status:" temp_headers.txt | findstr /i "DYNAMIC MISS BYPASS" >nul
    if %errorlevel%==0 (
        echo [PASS] cf-cache-status OK
    ) else (
        echo [WARN] cf-cache-status не MISS/DYNAMIC
    )
    
    findstr /i "x-vercel" temp_headers.txt >nul
    if %errorlevel%==0 (
        echo [FAIL] Найден x-vercel-* (остались записи на Vercel?)
        set EXIT=1
    ) else (
        echo [PASS] Нет x-vercel-*
    )
    
    REM 3) /status → App version
    curl -sS --max-time 15 "https://%%d/status" | findstr /i "App version" | findstr "%EXPECT_VER%" >nul
    if %errorlevel%==0 (
        echo [PASS] /status = %EXPECT_VER%
    ) else (
        echo [FAIL] /status не %EXPECT_VER%
        set EXIT=1
    )
    
    REM 4) pricing JSON доступен
    curl -sS --max-time 15 "https://%%d/api/public/pricing" | findstr /r ".*" >nul
    if %errorlevel%==0 (
        echo [PASS] /api/public/pricing отвечает
    ) else (
        echo [FAIL] /api/public/pricing не отвечает
        set EXIT=1
    )
    
    echo.
)

del temp_headers.txt 2>nul

echo ========================================
if "%EXIT%"=="1" (
    echo [FAIL] Есть проблемы — см. FAIL выше ⛑️
    exit /b 1
) else (
    echo [PASS] ALL GREEN — 0.4.2 принято ✅
    exit /b 0
)

