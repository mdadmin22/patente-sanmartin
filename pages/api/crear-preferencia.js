import { MercadoPagoConfig, Preference } from 'mercadopago';

const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { inscripcion_id, nombre, monto, dominio } = req.body;

  try {
    const preference = new Preference(mp);

    console.log("🧾 Preferencia enviada a MercadoPago:");
    console.log({
      title: `Pago patente dominio ${dominio}`,
      quantity: 1,
      unit_price: parseFloat(monto),
      external_reference: String(inscripcion_id),
      nombre,
    });

    const result = await preference.create({
      body: {
        items: [
          {
            title: `Pago patente dominio ${dominio}`,
            quantity: 1,
            unit_price: parseFloat(monto),
          },
        ],
        external_reference: String(inscripcion_id),
        back_urls: {
          success: "https://tusitio.com/exito",
          failure: "https://tusitio.com/fallo",
          pending: "https://tusitio.com/pendiente",
        },
        auto_return: "approved",
        payer: {
          email: "TESTUSER1285526912", // 🔁 Cambiar por el email del test comprador
        },
      },
    });

    console.log("📦 Respuesta MercadoPago:", result);

    return res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    console.error("❌ Error MercadoPago:", error);
    return res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
  }
}
