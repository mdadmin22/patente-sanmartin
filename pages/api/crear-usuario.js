import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    if (decoded.rol !== 'admin') return res.status(403).json({ success: false });
  } catch {
    return res.status(403).json({ success: false });
  }

  const { nombre, email, clave, rol } = req.body;
  const hash = await bcrypt.hash(clave, 10);

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(
      `INSERT INTO usuarios_municipales (nombre, email, contraseña_hash, rol)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol`,
      [nombre, email, hash, rol]
    );

    res.json({ success: true, nuevoUsuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    await client.end();
  }
}
