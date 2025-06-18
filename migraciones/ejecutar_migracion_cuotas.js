//migraciones/ejecutar_migracion_cuotas.js

require('dotenv').config({ path: '../.env.local' }); // ⬅️ Esto carga las variables
const fs = require('fs');
const { Client } = require('pg');


// 🚨 Asegurate que esta URL esté en tu .env.local
const connectionString = process.env.DATABASE_URL;

console.log('📡 DATABASE_URL desde env:', connectionString);


const sql = fs.readFileSync('./migracion_crear_cuotas_contribuyente.sql', 'utf8');

const client = new Client({
  connectionString,
});

client.connect()
  .then(() => {
    return client.query(sql);
  })
  .then(() => {
    console.log('✅ Migración ejecutada correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al ejecutar migración:', err);
  })
  .finally(() => {
    client.end();
  });
