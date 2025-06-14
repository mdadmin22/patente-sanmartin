// pages/api/login.js
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(
      'SELECT * FROM usuarios_municipales WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) return res.json({ success: false });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.contraseña_hash);

    if (!match) return res.json({ success: false });

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secreto123', {
      expiresIn: '2h',
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    await client.end();
  }
}
