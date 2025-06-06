// migracion_corregir_columnas.js
const { Client } = require('pg');
require('dotenv').config({ path: '../.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function corregir() {
  await client.connect();

  try {
    await client.query(`
      ALTER TABLE inscripciones
        DROP COLUMN IF EXISTS cedula_frente,
        DROP COLUMN IF EXISTS cedula_dorso,
        DROP COLUMN IF EXISTS foto_titulo;
    `);

    await client.query(`
      ALTER TABLE inscripciones
        ADD COLUMN IF NOT EXISTS cedula_frente_url TEXT,
        ADD COLUMN IF NOT EXISTS cedula_dorso_url TEXT,
        ADD COLUMN IF NOT EXISTS foto_titulo_url TEXT;
    `);

    console.log("✅ Columnas corregidas en 'inscripciones'.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.end();
  }
}

corregir();
