// pages/api/webhook.js
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { type, data } = req.body;

  // Aseguramos que el tipo sea "payment"
  if (type === "payment") {
    const paymentId = data.id;

    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_TOKEN}`,
        },
      });

      const paymentInfo = await mpRes.json();

      if (paymentInfo.status === "approved") {
        const inscripcionId = parseInt(paymentInfo.external_reference);

        const client = new Client({
          connectionString: process.env.DATABASE_URL,
        });

        await client.connect();

        await client.query(
          `UPDATE inscripciones
           SET estado_pago_contribuyente = 'aprobado',
               payment_id_mercadopago = $1,
               fecha_pago = NOW()
           WHERE id = $2`,
          [paymentId, inscripcionId]
        );

        await client.end();

        console.log("✅ Webhook actualizado para inscripción ID:", inscripcionId);
        return res.status(200).json({ success: true });
      } else {
        console.log("⚠️ Pago aún no aprobado:", paymentInfo.status);
      }
    } catch (error) {
      console.error("❌ Error procesando webhook:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(200).json({ received: true });
}
