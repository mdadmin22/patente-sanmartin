// migrar_cuotas.js
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('👉 DATABASE_URL usada:', process.env.DATABASE_URL);

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // 1. Asegurar que las columnas existen (ya hecho antes, pero por si acaso)
    await client.query(`
      ALTER TABLE cuotas_contribuyente
      ADD COLUMN IF NOT EXISTS importe NUMERIC(12,2),
      ADD COLUMN IF NOT EXISTS payment_id_mercadopago TEXT
    `);

    // 2. Calcular nuevo importe: total / meses pagados (campo "meses" en inscripciones)
    //    y asignarlo a todas las cuotas de ese dominio
    const result = await client.query(`
      SELECT dominio, total, meses
      FROM inscripciones
      WHERE meses IS NOT NULL AND total IS NOT NULL
    `);

    for (const row of result.rows) {
      const { dominio, total, meses } = row;
      if (!dominio || !total || !meses || meses === 0) continue;

      const importe = (parseFloat(total) / parseInt(meses)).toFixed(2);

      await client.query(
        `UPDATE cuotas_contribuyente
         SET importe = $1
         WHERE dominio = $2`,
        [importe, dominio]
      );

      console.log(`✅ Cuotas de ${dominio} actualizadas con importe: ${importe}`);
    }

    console.log('✅ Migración finalizada correctamente');
  } catch (err) {
    console.error('❌ Error al ejecutar la migración:', err.message);
    console.error(err);
  } finally {
    await client.end();
  }
})();
