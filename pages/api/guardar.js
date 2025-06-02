// Importamos las librerías necesarias
import formidable from "formidable"; // Para manejar formularios con archivos
import fs from "fs"; // No lo usamos directamente aquí, pero suele usarse para manejo de archivos
import { v2 as cloudinary } from "cloudinary"; // Para subir imágenes a Cloudinary
import { Client } from "pg"; // Cliente para conectar con PostgreSQL

// Configuramos Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Desactivamos el body parser de Next.js para manejar el form-data con formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handler de la API que se ejecuta cuando se hace una solicitud POST
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // Creamos el form parser
  const form = formidable({ keepExtensions: true });

  // Parseamos el formulario
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    try {
      // Función auxiliar para subir imágenes a Cloudinary
      const uploadImage = async (file) => {
        const result = await cloudinary.uploader.upload(file.filepath);
        return result.secure_url;
      };

      // Tomamos los archivos (pueden venir como arreglo o directamente)
      const cedulaFrente = files.cedula_frente?.[0] || files.cedula_frente;
      const cedulaDorso = files.cedula_dorso?.[0] || files.cedula_dorso;

      // Validamos que ambos archivos estén presentes
      if (!cedulaFrente?.filepath || !cedulaDorso?.filepath) {
        return res.status(400).json({ message: "Faltan archivos para subir." });
      }

      // Subimos las imágenes a Cloudinary
      const cedulaFrenteUrl = await uploadImage(cedulaFrente);
      const cedulaDorsoUrl = await uploadImage(cedulaDorso);

      // Conectamos a la base de datos PostgreSQL
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();

      // Insertamos los datos en la tabla inscripciones
      await client.query(
        `INSERT INTO inscripciones (
          tipo_documento, dni_cuit, provincia, departamento, localidad, domicilio, dominio,
          tipo_dominio, cedula_frente_url, cedula_dorso_url
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
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

      // Cerramos conexión y respondemos OK
      await client.end();
      res.status(200).json({ message: "Datos guardados correctamente" });
    } catch (error) {
      console.error("Error al guardar en la base o subir imágenes:", error);
      res.status(500).json({ message: "Error al guardar los datos" });
    }
  });
}
