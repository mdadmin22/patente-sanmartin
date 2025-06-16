// pages/api/crear-usuario.js
import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const { nombre, email, contraseña, rol } = req.body;

  if (!nombre || !email || !contraseña || !rol) {
    res.status(400).json({ success: false, error: 'Faltan datos' });
    return;
  }

  const hash = await bcrypt.hash(contraseña, 10);

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(
      `INSERT INTO usuarios_municipales (nombre_completo, email, contraseña_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre_completo AS nombre, email, rol`,
      [nombre, email, hash, rol]
    );

    res.status(200).json({ success: true, nuevoUsuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    await client.end();
  }
}
