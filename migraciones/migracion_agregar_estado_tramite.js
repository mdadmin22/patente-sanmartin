const { Client } = require('pg');
require('dotenv').config({ path: './.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function agregarColumnaEstadoTramite() {
  await client.connect();

  try {
    await client.query(`
      ALTER TABLE inscripciones
      ADD COLUMN estado_tramite TEXT DEFAULT 'pendiente';
    `);

    console.log("✅ Columna 'estado_tramite' agregada correctamente.");
  } catch (err) {
    console.error("❌ Error al agregar columna:", err);
  } finally {
    await client.end();
  }
}

agregarColumnaEstadoTramite();
