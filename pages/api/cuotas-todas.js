// pages/api/cuotas-todas.js
import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(`
      SELECT DISTINCT dominio FROM cuotas_contribuyente ORDER BY dominio LIMIT 100
    `);

    res.status(200).json({ dominios: result.rows });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Error al consultar dominios' });
  } finally {
    await client.end();
  }
}
