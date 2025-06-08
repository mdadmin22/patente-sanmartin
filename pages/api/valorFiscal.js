// API que consulta la base de datos por el código MTM/FMM y año del vehículo
import { Client } from "pg";

export default async function handler(req, res) {
  const { codigo_mtm, anio } = req.query;

  // Validación básica
  if (!codigo_mtm || !anio) {
    return res.status(400).json({ error: "Faltan parámetros en la consulta" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🌐 DB URL:", process.env.DATABASE_URL);

    await client.connect();

    // Consulta que compara sin distinguir mayúsculas/minúsculas
    const result = await client.query(
      `SELECT * FROM valores_dnrpa WHERE LOWER(mtm_fmm) = LOWER($1) LIMIT 1`,
      [codigo_mtm]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Código no encontrado" });
    }

    const fila = result.rows[0];
    console.log("🧾 Claves de la fila:", Object.keys(fila));
    console.log("🧮 Valores:", fila);

    // Obtener valor fiscal según el año solicitado
    const columnaAnio = `anio_${anio}`;
    const valorFiscal = fila[columnaAnio] || "0";

    return res.status(200).json({
      valorFiscal,
      descripcion: `${fila.desc_marca} ${fila.desc_modelo} ${
        fila.desc_tipo || ""
      }`.trim(),
      datosAutomotor: {
        marca: fila.marca,
        modelo: fila.mod,
        tipo: fila.tipo,
        anioFabricacion: fila.fab,
        codigoMTM: fila.mtm_fmm,
        descMarca: fila.desc_marca,
        descModelo: fila.desc_modelo,
        descTipo: fila.desc_tipo,
      },
    });
  } catch (error) {
    console.error("❌ Error al consultar la base de datos:", error);

    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await client.end();
  }
}
