require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function ejecutarMigracion() {
  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, 'agregar_campos_contacto.sql'), 'utf-8');
    await client.query(sql);
    console.log("✅ Migración ejecutada con éxito.");
  } catch (err) {
    console.error("❌ Error en la migración:", err);
  } finally {
    await client.end();
  }
}

ejecutarMigracion();
// Este archivo ya fue ejecutado el 2025-06-04
// Agregó las columnas: mail, mail_repetir, telefono a la tabla inscripciones
// No volver a ejecutar para evitar errores de duplicación
