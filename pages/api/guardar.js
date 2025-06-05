// importamos solo lo necesario
import { Client } from "pg";

// ✅ Esta configuración ya no es necesaria porque no usamos multipart/form-data ni archivos
// import formidable from "formidable";
// import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// ❌ Esta configuración se usaba para desactivar el bodyParser de Next.js con formidable
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    // ✅ Obtenemos los datos normalmente desde req.body (no desde formidable)
    const {
      tipo_documento,
      dni_cuit,
      provincia,
      departamento,
      localidad,
      domicilio,
      dominio,
      tipo_dominio,
      mail,
      mail_repetir,
      telefono
    } = req.body;

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    // ✅ Nueva consulta con los campos agregados
    await client.query(
      `INSERT INTO inscripciones (
        tipo_documento, dni_cuit, provincia, departamento, localidad, domicilio,
        dominio, tipo_dominio, mail, mail_repetir, telefono
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        tipo_documento,
        dni_cuit,
        provincia,
        departamento,
        localidad,
        domicilio,
        dominio,
        tipo_dominio,
        mail,
        mail_repetir,
        telefono
      ]
    );

    await client.end();
    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("❌ Error al guardar los datos:", error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }

  // ❌ Lógica antigua para manejo de archivos e imágenes (desactivada por ahora)
  /*
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    try {
      const uploadImage = async (file) => {
        const result = await cloudinary.uploader.upload(file.filepath);
        return result.secure_url;
      };

      const cedulaFrente = files.cedula_frente?.[0] || files.cedula_frente;
      const cedulaDorso = files.cedula_dorso?.[0] || files.cedula_dorso;

      if (!cedulaFrente?.filepath || !cedulaDorso?.filepath) {
        return res.status(400).json({ message: "Faltan archivos para subir." });
      }

      const cedulaFrenteUrl = await uploadImage(cedulaFrente);
      const cedulaDorsoUrl = await uploadImage(cedulaDorso);

      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();

      await client.query(
        INSERT INTO inscripciones (
          tipo_documento, dni_cuit, provincia, departamento, localidad, domicilio, dominio,
          tipo_dominio, cedula_frente_url, cedula_dorso_url
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10),
        [
          fields.tipo_documento,
          fields.dni_cuit,
          fields.provincia,
          fields.departamento,
          fields.localidad,
          fields.domicilio,
          fields.dominio,
          fields.tipo_dominio,
          cedulaFrenteUrl,
          cedulaDorsoUrl,
        ]
      );

      await client.end();
      res.status(200).json({ message: "Datos guardados correctamente" });
    } catch (error) {
      console.error("Error al guardar en la base o subir imágenes:", error);
      res.status(500).json({ message: "Error al guardar los datos" });
    }
  });
  */
}
