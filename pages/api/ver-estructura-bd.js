// pages/api/ver-estructura-bd.js
import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    const tablas = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    const estructura = {};

    for (const { table_name } of tablas.rows) {
      const columnas = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_name = $1;
      `, [table_name]);
      estructura[table_name] = columnas.rows;
    }

    await client.end();
    res.status(200).json({ estructura });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
    