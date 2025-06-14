// pages/api/tramites.js
import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Sin token' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const resultado = await client.query(`
      SELECT 
        id, 
        tipo_tramite, 
        dominio, 
        estado_pago_contribuyente, 
        estado_tramite, 
        nombre, 
        apellido, 
        creado_en,
        creado_por,
        payment_id_mercadopago,
        descuento,
        total,
        mail,
        telefono,
        domicilio_calle,
        domicilio_nro
      FROM inscripciones
      ORDER BY creado_en DESC
    `);

    res.json({ success: true, tramites: resultado.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los trámites' });
  } finally {
    await client.end();
  }
}
