# apply-migrations-ready.ps1
# Wrapper for migrations and table checks

Write-Host "Starting database migrations..." -ForegroundColor Cyan

# Check DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "ERROR: DATABASE_URL not set!" -ForegroundColor Red
    Write-Host "Set variable: `$env:DATABASE_URL='postgresql://...'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Running migrations..." -ForegroundColor Green
try {
    npm run db:migrate
    Write-Host "Migrations completed successfully" -ForegroundColor Green
} catch {
    Write-Host "Error running migrations: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Checking tables..." -ForegroundColor Green
# Simple DB connection check
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => client.query('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = \\'public\\''))
  .then(result => {
    console.log('Tables in DB:', result.rows[0].count);
    client.end();
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });
"

Write-Host "Migrations and DB check completed." -ForegroundColor Green