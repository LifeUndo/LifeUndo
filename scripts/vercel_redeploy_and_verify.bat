@echo off
setlocal enableextensions enabledelayedexpansion

REM === User-configurable ===
set PREVIEW_URL=https://getlifeundo-git-main-alexs-projects-ef5d9b64.vercel.app
set ALT_PREVIEW_URL=https://getlifeundo-kibpm7456-alexs-projects-ef5d9b64.vercel.app

REM === Check Node.js ===
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is required. Install from https://nodejs.org/ and rerun.
  exit /b 1
)

REM === Install Vercel CLI if missing ===
where vercel >nul 2>&1
if errorlevel 1 (
  echo Installing Vercel CLI...
  npm i -g vercel@latest || (
    echo [ERROR] Failed to install vercel CLI. Try running CMD as Administrator.
    exit /b 1
  )
)

REM === Login (opens browser; you can choose GitHub SSO in UI) ===
vercel logout >nul 2>&1
vercel login || (
  echo [ERROR] Login failed.
  exit /b 1
)

REM === Optional: force redeploy of the latest preview for cache bust ===
echo Forcing no-cache warmup via GET...
curl -s -L "%PREVIEW_URL%/en/pricing" >nul 2>&1
curl -s -L "%PREVIEW_URL%/ru/pricing" >nul 2>&1

REM === Wait for build propagation ===
echo Waiting 25 seconds for CDN propagation...
powershell -NoProfile -Command "Start-Sleep -Seconds 25"

REM === Verification 1: EN pricing has English heading ===
echo [Verify] EN heading should contain: Pricing
curl -s "%PREVIEW_URL%/en/pricing" | findstr /C:"Pricing" >nul
if errorlevel 1 (
  echo [FAIL] EN page likely not updated (missing English heading)
) else (
  echo [OK] EN heading found
)

REM === Verification 2: FK create endpoint returns pay_url on .net ===
echo [Verify] FreeKassa create endpoint...
set BODY={"plan":"starter_6m","email":"test@example.com"}
curl -s -X POST -H "Content-Type: application/json" -d %BODY% "%PREVIEW_URL%/api/payments/freekassa/create" > "%TEMP%\fk_create.json"
for /f "usebackq tokens=*" %%i in ("%TEMP%\fk_create.json") do set RESP=%%i

echo Response: !RESP!
echo !RESP! | findstr /C:"pay.freekassa.net" >nul
if errorlevel 1 (
  echo [FAIL] pay_url not found or not on .net
) else (
  echo [OK] pay_url on .net
)

REM === Verification 3: Summary soft-OK (without DB) ===
echo [Verify] Summary API soft OK...
for /f "tokens=2 delims::,{}\" " %%a in ('type "%TEMP%\fk_create.json" ^| findstr /C:"orderId"') do set ORDERID=%%a
if not defined ORDERID set ORDERID=test
curl -s "%PREVIEW_URL%/api/payment/summary?order_id=!ORDERID!" | findstr /C:"\"ok\": true" >nul
if errorlevel 1 (
  echo [WARN] Summary did not return ok:true (may still be building)
) else (
  echo [OK] Summary soft response detected
)

echo ---
echo If you want to test alternate preview:
echo   set PREVIEW_URL=%ALT_PREVIEW_URL%
echo   and rerun this script.

endlocal
exit /b 0
