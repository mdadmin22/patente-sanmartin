
require('dotenv').config({ path: '../.env.local' });
const { Client } = require('pg');

const client = new Client();

async function main() {
  try {
    await client.connect();

    await client.query(`
      DROP TABLE IF EXISTS inscripciones;

      CREATE TABLE inscripciones (
        id SERIAL PRIMARY KEY,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- PASO 1
        tipo_tramite TEXT,
        apellido TEXT,
        nombre TEXT,
        razon_social TEXT,
        tipo_documento TEXT,
        dni_cuit TEXT,
        provincia TEXT,
        departamento TEXT,
        localidad TEXT,
        domicilio_calle TEXT,
        domicilio_nro TEXT,
        telefono TEXT,
        mail TEXT,
        mail_repetir TEXT,

        -- PASO 2
        tipo_dominio TEXT,
        dominio TEXT,
        origen TEXT,
        anio INTEGER,
        foto_titulo_url TEXT,
        cedula_frente_url TEXT,
        cedula_dorso_url TEXT,

        -- PASO 3
        codigo_mtm TEXT,
        apellido_nombre TEXT,
        tipo_documento_repetido TEXT,
        dni_cuit_repetido TEXT,
        valor_fiscal NUMERIC,
        valor_declarado NUMERIC,
        forma_pago TEXT,
        tipo_pago INTEGER,

        -- PASO 4
        mayor_valor NUMERIC,
        base_fija NUMERIC,
        meses INTEGER,
        alicuota NUMERIC,
        base_variable NUMERIC,
        subtotal1 NUMERIC,
        subtotal2 NUMERIC,
        descuento NUMERIC,
        total NUMERIC,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tabla 'inscripciones' creada correctamente.");
  } catch (error) {
    console.error("❌ Error al crear la tabla:", error);
  } finally {
    await client.end();
  }
}

main();
