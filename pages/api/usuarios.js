// pages/api/usuarios.js
import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false });
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    if (decoded.rol !== 'admin') {
      res.status(403).json({ success: false });
      return;
    }
  } catch {
    res.status(403).json({ success: false });
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(`
      SELECT id, nombre_completo AS nombre, email, rol
      FROM usuarios_municipales
      ORDER BY id
    `);
    res.status(200).json({ success: true, usuarios: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    await client.end();
  }
}
