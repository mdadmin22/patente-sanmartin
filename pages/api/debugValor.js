import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client();
  await client.connect();

  try {
    const result = await client.query(
      `SELECT * FROM valores_fiscales WHERE "MTM_FMM" = '08017088'`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró ese código' });
    }

    const fila = result.rows[0];
    const valor2019 = fila["2019"] || "No hay valor 2019";

    res.status(200).json({
      valor2019,
      fila,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la consulta' });
  } finally {
    await client.end();
  }
}
