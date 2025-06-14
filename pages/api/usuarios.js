import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    if (decoded.rol !== 'admin') return res.status(403).json({ success: false });
  } catch {
    return res.status(403).json({ success: false });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(`SELECT id, nombre, email, rol FROM usuarios_municipales ORDER BY id`);
    res.json({ success: true, usuarios: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    await client.end();
  }
}
