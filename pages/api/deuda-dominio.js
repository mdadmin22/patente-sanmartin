import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default async function handler(req, res) {
  const dominio = req.query.dominio;
  if (!dominio) {
    return res.status(400).json({ error: 'Dominio requerido' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(`
      SELECT COUNT(*) AS cuotas_pendientes, SUM(monto) AS deuda_total
      FROM cuotas_contribuyente
      WHERE dominio = $1 AND estado = 'pendiente'
    `, [dominio]);

    const { cuotas_pendientes, deuda_total } = result.rows[0];

    res.status(200).json({
      dominio,
      cuotas_pendientes: parseInt(cuotas_pendientes),
      deuda_total: parseFloat(deuda_total || 0),
    });
  } catch (err) {
    console.error('❌ Error al consultar deuda:', err);
    res.status(500).json({ error: 'Error al consultar deuda' });
  } finally {
    await client.end();
  }
}
