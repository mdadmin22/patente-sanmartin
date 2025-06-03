// 👇 Asegurate de que esta línea esté antes que cualquier uso de process.env
require('dotenv').config({ path: '.env.local' }); // ✅ Correcto


const { Client } = require('pg');

async function crearTabla() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS valores_dnrpa (
      I_N TEXT,
      MTM_FMM INTEGER,
      T TEXT,
      Fab INTEGER,
      Marca INTEGER,
      Tipo INTEGER,
      Mod INTEGER,
      Desc_marca TEXT,
      Desc_modelo TEXT,
      Desc_tipo TEXT,
      anio_2025 NUMERIC,
      anio_2024 NUMERIC,
      anio_2023 NUMERIC,
      anio_2022 NUMERIC,
      anio_2021 NUMERIC,
      anio_2020 NUMERIC,
      anio_2019 NUMERIC,
      anio_2018 NUMERIC,
      anio_2017 NUMERIC,
      anio_2016 NUMERIC,
      anio_2015 NUMERIC,
      anio_2014 NUMERIC,
      anio_2013 NUMERIC,
      anio_2012 NUMERIC,
      anio_2011 NUMERIC,
      anio_2010 NUMERIC,
      anio_2009 NUMERIC,
      anio_2008 NUMERIC,
      anio_2007 NUMERIC,
      anio_2006 NUMERIC,
      anio_2005 NUMERIC,
      anio_2004 NUMERIC,
      anio_2003 NUMERIC,
      anio_2002 NUMERIC,
      anio_2001 NUMERIC,
      anio_2000 NUMERIC
    );
  `);

  console.log("✅ Tabla valores_dnrpa creada correctamente.");
  await client.end();
}

crearTabla().catch(console.error);
