// columnas_cuotas.js
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const res = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'cuotas_contribuyente'
  `);

  console.log('📋 Columnas en cuotas_contribuyente:');
  res.rows.forEach(row => console.log('-', row.column_name));

  await client.end();
})();
