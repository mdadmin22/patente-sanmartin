// pages/api/actualizar-tramite.js
import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token faltante' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }

  if (decoded.rol !== 'admin') {
    return res.status(403).json({ error: 'Solo administradores pueden actualizar trámites' });
  }

  const { id, nuevoEstado } = req.body;
  if (!id || !nuevoEstado) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query(
      `UPDATE inscripciones SET estado_tramite = $1 WHERE id = $2`,
      [nuevoEstado, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el trámite' });
  } finally {
    await client.end();
  }
}
