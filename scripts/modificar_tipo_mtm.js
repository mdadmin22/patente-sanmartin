require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function modificarColumna() {
  try {
    await client.connect();
    await client.query(`ALTER TABLE valores_dnrpa ALTER COLUMN mtm_fmm TYPE TEXT;`);
    console.log('✅ Columna mtm_fmm cambiada a tipo TEXT correctamente.');
  } catch (error) {
    console.error('❌ Error al modificar la columna:', error.message);
  } finally {
    await client.end();
  }
}

modificarColumna();
