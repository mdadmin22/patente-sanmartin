// migracion_inscripciones.js

//require('dotenv').config({ path: '../.env.local' });

const { Client } = require('pg');
require('dotenv').config({ path: '../.env.local' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function modificarTabla() {
  await client.connect();

  const columnas = [
    ["tipo_tramite", "TEXT"],
    ["tipo_documento", "TEXT"],
    ["dni_cuit", "TEXT"],
    ["apellido", "TEXT"],
    ["nombre", "TEXT"],
    ["localidad", "TEXT"],
    ["domicilio_calle", "TEXT"],
    ["domicilio_nro", "TEXT"],
    ["tipo_dominio", "TEXT"],
    ["dominio", "TEXT"],
    ["origen", "TEXT"],
    ["anio", "TEXT"],
    ["codigo_mtm", "TEXT"],
    ["valor_fiscal", "INTEGER"],
    ["valor_declarado", "INTEGER"],
    ["mayor_valor", "INTEGER"],
    ["base_fija", "INTEGER"],
    ["alicuota", "NUMERIC"],
    ["base_variable", "NUMERIC"],
    ["tipo_pago", "INTEGER"],
    ["subtotal1", "INTEGER"],
    ["subtotal2", "INTEGER"],
    ["descuento", "INTEGER"],
    ["total", "NUMERIC"],
    ["foto_titulo", "TEXT"],
    ["cedula_frente", "TEXT"],
    ["cedula_dorso", "TEXT"],
    ["creado_en", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"]
  ];

  for (const [nombre, tipo] of columnas) {
    try {
      await client.query(`ALTER TABLE inscripciones ADD COLUMN ${nombre} ${tipo}`);
      console.log(`✅ Columna agregada: ${nombre}`);
    } catch (err) {
      if (err.code === '42701') {
        console.log(`ℹ️ Columna ya existe: ${nombre}`);
      } else {
        console.error(`❌ Error al agregar columna ${nombre}:`, err);
      }
    }
  }

  await client.end();
}

modificarTabla();
