// pages/api/guardar-inscripcion.js
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const {
      tipo_tramite,
      apellido,
      nombre,
      razon_social,
      tipo_documento,
      dni_cuit,
      provincia,
      departamento,
      localidad,
      domicilio_calle,
      domicilio_nro,
      telefono,
      mail,
      mail_repetir,
      tipo_dominio,
      dominio,
      origen,
      anio,
      foto_titulo_url,
      cedula_frente_url,
      cedula_dorso_url,
      codigo_mtm,
      valor_fiscal,
      valor_declarado,
      forma_pago,
      tipo_pago,
      mayor_valor,
      base_fija,
      meses,
      alicuota,
      base_variable,
      subtotal1,
      subtotal2,
      descuento,
      total,
    } = req.body;

    const result = await client.query(
      `
      INSERT INTO inscripciones (
        tipo_tramite, apellido, nombre, razon_social, tipo_documento, dni_cuit,
        provincia, departamento, localidad, domicilio_calle, domicilio_nro, telefono, mail, mail_repetir,
        tipo_dominio, dominio, origen, anio, foto_titulo_url, cedula_frente_url, cedula_dorso_url,
        codigo_mtm, valor_fiscal, valor_declarado, forma_pago, tipo_pago,
        mayor_valor, base_fija, meses, alicuota, base_variable,
        subtotal1, subtotal2, descuento, total, creado_en
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31,
        $32, $33, $34, $35, NOW()
      )
      RETURNING id
      `,
      [
        tipo_tramite, apellido, nombre, razon_social, tipo_documento, dni_cuit,
        provincia, departamento, localidad, domicilio_calle, domicilio_nro, telefono, mail, mail_repetir,
        tipo_dominio, dominio, origen, anio, foto_titulo_url, cedula_frente_url, cedula_dorso_url,
        codigo_mtm, valor_fiscal, valor_declarado, forma_pago, tipo_pago,
        mayor_valor, base_fija, meses, alicuota, base_variable,
        subtotal1, subtotal2, descuento, total
      ]
    );

    const id = result.rows[0]?.id;

    if (!id) {
      throw new Error("No se pudo obtener el ID generado");
    }

    res.status(200).json({ id });
  } catch (error) {
    console.error("❌ Error al guardar en la base:", error);
    res.status(500).json({ error: "Error al guardar en la base" });
  } finally {
    await client.end();
  }
}
