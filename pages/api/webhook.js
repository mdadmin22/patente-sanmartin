// pages/api/webhook.js
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { type, data } = req.body;

  if (type === "payment") {
    const paymentId = data.id;

    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}` },
      });

      const paymentInfo = await mpRes.json();

      if (paymentInfo.status === "approved") {
        const inscripcionId = parseInt(paymentInfo.external_reference);
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        // ✅ Marcar inscripción como pagada
        await client.query(
          `UPDATE inscripciones
           SET estado_pago_contribuyente = 'aprobado',
               payment_id_mercadopago = $1,
               fecha_pago = NOW()
           WHERE id = $2`,
          [paymentId, inscripcionId]
        );

        // ✅ Obtener dominio, meses, total
        const { rows } = await client.query(
          `SELECT dominio, meses, total FROM inscripciones WHERE id = $1`,
          [inscripcionId]
        );

        if (rows.length === 0) {
          await client.end();
          return res.status(404).json({ error: "Inscripción no encontrada" });
        }

        const { dominio, meses, total } = rows[0];
        const cuotasTotales = 60;
        const montoPorCuota = Number(total) / Number(meses);


        // ✅ Verificamos si ya hay cuotas
        const { rows: cuotasExistentes } = await client.query(
          `SELECT 1 FROM cuotas_contribuyente WHERE dominio = $1 LIMIT 1`,
          [dominio]
        );

        if (cuotasExistentes.length === 0) {
          const fechaInicio = new Date();
          fechaInicio.setDate(1);

          const calcularVencimiento = (inicio, nroCuota) => {
            const venc = new Date(inicio);
            venc.setMonth(venc.getMonth() + nroCuota - 1);
            venc.setDate(10);
            return venc;
          };

          for (let i = 1; i <= cuotasTotales; i++) {
            const vencimiento = calcularVencimiento(fechaInicio, i);

            await client.query(
              `INSERT INTO cuotas_contribuyente (
                id_contribuyente, dominio, año, cuota_nro,
                fecha_vencimiento, monto, estado, fecha_pago,
                payment_id_mercadopago, forma_pago
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [
                inscripcionId,
                dominio,
                vencimiento.getFullYear(),
                i,
                vencimiento,
                montoPorCuota,
                i <= meses ? "pagada" : "pendiente",
                i <= meses ? new Date() : null,
                i <= meses ? paymentId : null,
                i <= meses ? "MercadoPago" : null,
              ]
            );
          }

          console.log(`✅ Se generaron ${cuotasTotales} cuotas para ${dominio}, de las cuales ${meses} se marcaron como pagadas.`);
        } else {
          // ✅ Actualizamos cuotas existentes
          const result = await client.query(
            `
            WITH cuotas_a_pagar AS (
              SELECT id
              FROM cuotas_contribuyente
              WHERE dominio = $1 AND estado = 'pendiente'
              ORDER BY fecha_vencimiento
              LIMIT $2
            )
            UPDATE cuotas_contribuyente
            SET
              estado = 'pagada',
              fecha_pago = NOW(),
              payment_id_mercadopago = $3,
              forma_pago = 'MercadoPago',
              monto = $4
            WHERE id IN (SELECT id FROM cuotas_a_pagar)
            RETURNING id
          `,
            [dominio, meses, paymentId, montoPorCuota]
          );

          console.log(`♻️ Cuotas existentes actualizadas para ${dominio}: ${result.rowCount} cuotas marcadas como pagadas.`);
        }

        await client.end();
        return res.status(200).json({ success: true });
      } else {
        console.log("⚠️ El pago no está aprobado:", paymentInfo.status);
      }
    } catch (error) {
      console.error("❌ Error en webhook:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(200).json({ received: true });
}
