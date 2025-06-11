// pages/api/inscripcion.js
import { Client } from "pg";

export default async function handler(req, res) {
  const { id } = req.query;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query("SELECT * FROM inscripciones WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inscripción no encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al consultar inscripción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await client.end();
  }
}
