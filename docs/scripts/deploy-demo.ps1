# Deploy Demo Script for lifeundo.ru
# This script deploys the demo version to a separate Vercel project

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "lifeundo-ru-demo",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "lifeundo.ru"
)

Write-Host "🚀 Deploying LifeUndo Demo to Vercel" -ForegroundColor Cyan
Write-Host "📦 Project: $ProjectName" -ForegroundColor Yellow
Write-Host "🌐 Domain: $Domain" -ForegroundColor Yellow
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Backup original config
if (Test-Path "next.config.js") {
    Copy-Item "next.config.js" "next.config.prod.js" -Force
    Write-Host "📋 Backed up production config" -ForegroundColor Green
}

# Use demo config
if (Test-Path "next.config.demo.js") {
    Copy-Item "next.config.demo.js" "next.config.js" -Force
    Write-Host "🔄 Switched to demo config" -ForegroundColor Green
} else {
    Write-Host "❌ Demo config not found: next.config.demo.js" -ForegroundColor Red
    exit 1
}

# Set demo environment variables
$env:NEXT_PUBLIC_ENV = "demo"
$env:FK_MERCHANT_ID = "65875"
$env:FK_SECRET1 = "myavF/PTAGmJz,("
$env:FK_SECRET2 = "2aqzSYf?29aO-w6"
$env:ALLOWED_ORIGIN = "https://$Domain"
$env:CURRENCY = "RUB"

Write-Host "🔧 Set demo environment variables" -ForegroundColor Green

# Build the project
Write-Host "🔨 Building demo project..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
try {
    # Create or link to project
    vercel --prod --name $ProjectName --yes
    
    Write-Host "✅ Deployment successful" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Demo deployed successfully!" -ForegroundColor Green
    Write-Host "🌐 Demo URL: https://$ProjectName.vercel.app" -ForegroundColor Cyan
    Write-Host "🔗 Production URL: https://$Domain" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Configure custom domain in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Set up DNS records for $Domain" -ForegroundColor White
    Write-Host "3. Test demo functionality" -ForegroundColor White
    Write-Host "4. Update FreeKassa notify URL to demo project" -ForegroundColor White
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Restore original config
    if (Test-Path "next.config.prod.js") {
        Copy-Item "next.config.prod.js" "next.config.js" -Force
        Remove-Item "next.config.prod.js" -Force
        Write-Host "🔄 Restored production config" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Demo deployment completed!" -ForegroundColor Green
