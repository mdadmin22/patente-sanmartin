import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default async function handler(req, res) {
  const dominio = req.query.dominio;
  if (!dominio) return res.status(400).json({ error: 'Dominio requerido' });

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(`
      SELECT cuota_nro, fecha_vencimiento, monto, estado, fecha_pago
      FROM cuotas_contribuyente
      WHERE dominio = $1
      ORDER BY cuota_nro
    `, [dominio]);

    res.status(200).json({ cuotas: result.rows });
  } catch (err) {
    console.error('Error al consultar cuotas:', err);
    res.status(500).json({ error: 'Error al consultar cuotas' });
  } finally {
    await client.end();
  }
}
