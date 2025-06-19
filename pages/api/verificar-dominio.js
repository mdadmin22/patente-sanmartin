// pages/api/verificar-dominio.js
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const { dominio } = req.query;

    const resultado = await client.query(
      `SELECT id FROM inscripciones 
       WHERE LOWER(dominio) = LOWER($1) 
       AND tipo_tramite = 'ALTA' 
       AND estado_pago_contribuyente = 'aprobado'`,
      [dominio]
    );

    res.status(200).json({ yaExiste: resultado.rows.length > 0 });
  } catch (error) {
    console.error("Error al verificar dominio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    await client.end();
  }
}
