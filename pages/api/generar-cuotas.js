import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const calcularVencimiento = (inicio, nroCuota) => {
  const vencimiento = new Date(inicio);
  vencimiento.setMonth(vencimiento.getMonth() + nroCuota - 1);
  vencimiento.setDate(10);
  return vencimiento;
};

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  try {
    // 1. Buscar inscripciones aprobadas SIN cuotas generadas
    const inscripciones = await client.query(`
      SELECT i.id, i.dominio, i.fecha_pago, i.meses
      FROM inscripciones i
      WHERE i.estado_pago_contribuyente = 'aprobado'
      AND NOT EXISTS (
        SELECT 1 FROM cuotas_contribuyente c
        WHERE c.dominio = i.dominio
      )
    `);

    const resultados = [];

    for (const insc of inscripciones.rows) {
      const {
        id,
        cuit,
        dominio,
        fecha_pago,
        meses: cuotasPagadas
      } = insc;

      const fechaInicio = new Date(fecha_pago);
      const montoPorCuota = 10000; // ajustar según lógica real
      const cuotasTotales = 60;

      for (let i = 1; i <= cuotasTotales; i++) {
        const vencimiento = calcularVencimiento(fechaInicio, i);
        const estado = i <= cuotasPagadas ? 'pagada' : 'pendiente';
        const fechaPago = i <= cuotasPagadas ? fechaInicio : null;

        await client.query(`
          INSERT INTO cuotas_contribuyente (
            id_contribuyente, dominio, año, cuota_nro,
            fecha_vencimiento, monto, estado, fecha_pago
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          id,
          dominio,
          vencimiento.getFullYear(),
          i,
          vencimiento,
          montoPorCuota,
          estado,
          fechaPago
        ]);
      }

      resultados.push(`✔️ Generadas cuotas para dominio ${dominio}`);
    }

    res.status(200).json({ ok: true, resultados });
  } catch (err) {
    console.error('❌ Error al generar cuotas:', err);
    res.status(500).json({ error: 'Error al generar cuotas' });
  } finally {
    await client.end();
  }
}
