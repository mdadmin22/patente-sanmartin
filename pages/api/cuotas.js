// pages/api/cuotas.js
import { Client } from "pg";

export default async function handler(req, res) {
  const { dominio } = req.query;

  if (!dominio) {
    return res.status(400).json({ ok: false, error: "Dominio requerido" });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log("🔍 Dominio buscado:", dominio);

    const result = await client.query(
      `SELECT * FROM cuotas_contribuyente 
       WHERE TRIM(LOWER(dominio)) = TRIM(LOWER($1))
       ORDER BY fecha_vencimiento`,
      [dominio]
    );

    console.log("📋 Resultados:", result.rows);

    res.status(200).json({ ok: true, cuotas: result.rows });
  } catch (error) {
    console.error("❌ Error al buscar cuotas:", error);
    res.status(500).json({ ok: false, error: "Error interno" });
  } finally {
    await client.end();
  }
}

