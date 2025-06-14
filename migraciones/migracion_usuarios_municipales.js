const { Client } = require('pg');
require('dotenv').config({ path: './.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function crearTablaUsuarios() {
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios_municipales (
        id SERIAL PRIMARY KEY,
        nombre_completo TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        contraseña_hash TEXT NOT NULL,
        rol TEXT NOT NULL DEFAULT 'operador',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tabla 'usuarios_municipales' creada correctamente.");
  } catch (err) {
    console.error("❌ Error al crear la tabla:", err);
  } finally {
    await client.end();
  }
}

crearTablaUsuarios();
