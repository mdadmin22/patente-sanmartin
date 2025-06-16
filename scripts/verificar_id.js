// scripts/verificar_id.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT id, creado_por, tipo_tramite, dominio 
    FROM inscripciones 
    ORDER BY id DESC 
    LIMIT 10;
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(err => console.error('Error ejecutando verificación:', err));
