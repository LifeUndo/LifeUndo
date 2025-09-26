# apply-migrations-ready.ps1
# Обёртка для миграций и проверки таблиц

Write-Host "🗄️ Запуск миграций базы данных..." -ForegroundColor Cyan

# Проверяем наличие DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL не установлен!" -ForegroundColor Red
    Write-Host "Установите переменную: `$env:DATABASE_URL='postgresql://...'" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Выполнение миграций..." -ForegroundColor Green
try {
    npm run db:migrate
    Write-Host "✅ Миграции выполнены успешно" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка при выполнении миграций: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Проверка таблиц..." -ForegroundColor Green
# Простая проверка подключения к БД
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => client.query('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = \\'public\\''))
  .then(result => {
    console.log('✅ Таблиц в БД:', result.rows[0].count);
    client.end();
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к БД:', err.message);
    process.exit(1);
  });
"

Write-Host "✅ Миграции и проверка БД завершены." -ForegroundColor Green