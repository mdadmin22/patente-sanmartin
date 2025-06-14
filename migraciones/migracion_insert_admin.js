const { Client } = require('pg');
require('dotenv').config({ path: './.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function insertarAdmin() {
  await client.connect();

  try {
    await client.query(`
      INSERT INTO usuarios_municipales (nombre_completo, email, contraseña_hash, rol)
      VALUES (
        'Administrador Municipal',
        'admin@sanmartin.gob.ar',
        '$2b$10$.lS0oehdEzbG/xZ7B7UFR.w9GFu/uTa4S8MnWb6WO78HOm22SK066',
        'admin'
      );
    `);

    console.log("✅ Usuario administrador insertado correctamente.");
  } catch (err) {
    console.error("❌ Error al insertar usuario admin:", err);
  } finally {
    await client.end();
  }
}

insertarAdmin();
