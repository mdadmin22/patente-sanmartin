require('dotenv').config({ path: '.env.local' });

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Función segura para convertir valores vacíos o inválidos a 0
const parseEntero = (valor) => {
  if (!valor || valor.trim() === '' || valor === null) return 0;
  const num = parseInt(valor.replace(/\D/g, '')); // Elimina caracteres no numéricos
  return isNaN(num) ? 0 : num;
};

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function importarCSV() {
  const csvPath = path.join(__dirname, '../data/data_valores02062025-comas.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');

  await client.connect();

  const registros = parse(fileContent, {
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  for (const row of registros) {
    const query = `
      INSERT INTO valores_dnrpa (
        I_N, MTM_FMM, T, Fab, Marca, Tipo, Mod, 
        Desc_marca, Desc_modelo, Desc_tipo, 
        anio_2025, anio_2024, anio_2023, anio_2022, anio_2021, 
        anio_2020, anio_2019, anio_2018, anio_2017, anio_2016,
        anio_2015, anio_2014, anio_2013, anio_2012, anio_2011,
        anio_2010, anio_2009, anio_2008, anio_2007, anio_2006,
        anio_2005, anio_2004, anio_2003, anio_2002, anio_2001, anio_2000
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,
        $26,$27,$28,$29,$30,
        $31,$32,$33,$34,$35,$36
      )
      ON CONFLICT (MTM_FMM) DO NOTHING;
    `;

    const valores = [
      row.I_N, row.MTM_FMM, row.T,
      parseEntero(row.Fab),
      parseEntero(row.Marca),
      parseEntero(row.Tipo),
      parseEntero(row.Mod),
      row['Desc marca'], row['Desc Modelo'], row['Desc Tipo'],
      parseEntero(row.anio_2025), parseEntero(row.anio_2024), parseEntero(row.anio_2023),
      parseEntero(row.anio_2022), parseEntero(row.anio_2021), parseEntero(row.anio_2020),
      parseEntero(row.anio_2019), parseEntero(row.anio_2018), parseEntero(row.anio_2017),
      parseEntero(row.anio_2016), parseEntero(row.anio_2015), parseEntero(row.anio_2014),
      parseEntero(row.anio_2013), parseEntero(row.anio_2012), parseEntero(row.anio_2011),
      parseEntero(row.anio_2010), parseEntero(row.anio_2009), parseEntero(row.anio_2008),
      parseEntero(row.anio_2007), parseEntero(row.anio_2006), parseEntero(row.anio_2005),
      parseEntero(row.anio_2004), parseEntero(row.anio_2003), parseEntero(row.anio_2002),
      parseEntero(row.anio_2001), parseEntero(row.anio_2000),
    ];

    try {
      await client.query(query, valores);
      console.log(`✔️ Insertado: ${row.MTM_FMM} - ${row['Desc Modelo']}`);
    } catch (error) {
      console.error(`❌ Error al insertar MTM ${row.MTM_FMM}:`, error.message);
    }
  }

  await client.end();
  console.log('✅ Importación finalizada correctamente.');
}

importarCSV();
