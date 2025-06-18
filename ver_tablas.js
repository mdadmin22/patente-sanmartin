const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();

  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);

  console.log('📋 Tablas en la base de datos:');
  res.rows.forEach(row => console.log('-', row.table_name));

  await client.end();
})();
