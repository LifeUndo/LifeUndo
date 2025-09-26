const { Client } = require('pg');

async function checkDB() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    const result = await client.query('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log('📊 Tables in DB:', result.rows[0].count);
    
    // Check specific tables
    const tables = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name', ['public']);
    console.log('📋 Table names:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    await client.end();
    console.log('✅ Database check completed');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}

checkDB();
