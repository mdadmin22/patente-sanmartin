require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function agregarConstraintUnique() {
  try {
    await client.connect();
    const query = `
      ALTER TABLE valores_dnrpa
      ADD CONSTRAINT unique_mtm_fmm UNIQUE (MTM_FMM);
    `;
    await client.query(query);
    console.log('✅ Restricción UNIQUE agregada a MTM_FMM correctamente.');
  } catch (error) {
    if (error.code === '23505') {
      console.error('❌ Ya existen valores duplicados en MTM_FMM. Eliminalos antes de agregar la restricción.');
    } else if (error.code === '23514') {
      console.error('❌ Violación de restricción al intentar aplicar UNIQUE.');
    } else if (error.code === '42710') {
      console.error('⚠️ La restricción UNIQUE ya existe.');
    } else {
      console.error('❌ Error al agregar la restricción UNIQUE:', error.message);
    }
  } finally {
    await client.end();
  }
}

agregarConstraintUnique();
