// scripts/agregar-estado-pago.js
require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();

    const query = `
      ALTER TABLE inscripciones
      ADD COLUMN IF NOT EXISTS estado_pago_contribuyente TEXT DEFAULT 'pendiente';
    `;

    await client.query(query);
    console.log("✅ Columna 'estado_pago_contribuyente' agregada correctamente.");
  } catch (err) {
    console.error("❌ Error al modificar la tabla:", err);
  } finally {
    await client.end();
  }
}

main();
