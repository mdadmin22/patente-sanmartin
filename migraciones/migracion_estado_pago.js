// migracion_estado_pago.js
const { Client } = require('pg');
require('dotenv').config({ path: '../.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function migrar() {
  await client.connect();

  try {
    await client.query(`
      ALTER TABLE inscripciones
        ADD COLUMN IF NOT EXISTS creado_por TEXT DEFAULT 'contribuyente',
        ADD COLUMN IF NOT EXISTS estado_pago_contribuyente TEXT DEFAULT 'pendiente',
        ADD COLUMN IF NOT EXISTS fecha_pago TIMESTAMP,
        ADD COLUMN IF NOT EXISTS payment_id_mercadopago TEXT;
    `);

    console.log("✅ Columnas agregadas a 'inscripciones'.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.end();
  }
}

migrar();
