@echo off
setlocal enableextensions enabledelayedexpansion

REM === User-configurable ===
set REPO_DIR=%~dp0..\
set BRANCH=main
set GIT_USER_NAME=LifeUndo Bot
set GIT_USER_EMAIL=bot@getlifeundo.com

REM === Optional preview to check after push ===
set PREVIEW_URL=https://getlifeundo-git-main-alexs-projects-ef5d9b64.vercel.app

REM === Check Git & GitHub CLI ===
where git >nul 2>&1 || (echo [ERROR] Git is required: https://git-scm.com/ & exit /b 1)
where gh  >nul 2>&1 || (
  echo Installing GitHub CLI...
  winget install --id GitHub.cli -e --source winget || (
    echo [ERROR] Failed to install GitHub CLI. Install manually: https://cli.github.com/
    exit /b 1
  )
)

REM === GitHub auth (browser flow) ===
echo Launching GitHub auth in browser...
gh auth login -w -s repo,workflow || (
  echo [ERROR] GitHub auth failed.
  exit /b 1
)

REM === Configure Git identity (local) ===
pushd "%REPO_DIR%" || (echo [ERROR] Repo dir not found: %REPO_DIR% & exit /b 1)
git config user.name "%GIT_USER_NAME%"
git config user.email "%GIT_USER_EMAIL%"

REM === Optional: create commit if there are staged changes ===
echo Creating test no-op commit to force Vercel preview (optional)...
echo.> .vercel-preview-touch.txt
git add .vercel-preview-touch.txt
git commit -m "chore: touch preview to trigger redeploy" || echo (nothing to commit)
git push origin %BRANCH% || (echo [ERROR] git push failed & popd & exit /b 1)
popd

REM === Wait for Vercel to deploy preview ===
echo Waiting 30 seconds for Vercel preview...
powershell -NoProfile -Command "Start-Sleep -Seconds 30"

echo [Verify] EN heading should contain: Pricing
curl -s "%PREVIEW_URL%/en/pricing" | findstr /C:"Pricing" >nul
if errorlevel 1 (
  echo [FAIL] EN page likely not updated (missing English heading)
) else (
  echo [OK] EN heading found
)

echo Done.
endlocal
exit /b 0
