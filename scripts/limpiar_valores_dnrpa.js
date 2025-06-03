require('dotenv').config({ path: '.env.local' });

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function limpiarTabla() {
  try {
    await client.connect();
    await client.query('DELETE FROM valores_dnrpa;');
    console.log('✅ Tabla valores_dnrpa vaciada correctamente.');
  } catch (error) {
    console.error('❌ Error al vaciar la tabla:', error.message);
  } finally {
    await client.end();
  }
}

limpiarTabla();
