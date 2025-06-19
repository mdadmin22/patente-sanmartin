// pages/api/limpiar-tablas.js
import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();

    await client.query('BEGIN');
    
    await client.query('TRUNCATE TABLE cuotas_contribuyente, inscripciones RESTART IDENTITY CASCADE;');

    await client.query('COMMIT');

    await client.end();
    return res.status(200).json({ exito: true, mensaje: 'Tablas limpiadas correctamente.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al limpiar tablas:', error);
    return res.status(500).json({ exito: false, error: error.message });
  }
}
