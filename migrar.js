// Importamos dotenv para leer variables desde el archivo .env.local
import dotenv from "dotenv";

// Importamos el cliente de PostgreSQL
import { Client } from "pg"; // ⚠️ Esto es fundamental para poder conectarse a la base

// Cargamos las variables de entorno desde el archivo .env.local
dotenv.config({ path: ".env.local" });

// Configuramos el cliente PostgreSQL con la cadena de conexión (DATABASE_URL)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Función principal que ejecuta la migración de la base de datos
async function migrar() {
  try {
    // Conectamos a la base de datos
    await client.connect();

    // Ejecutamos SQL para eliminar (si existe) y volver a crear la tabla "inscripciones"
    await client.query(`
      DROP TABLE IF EXISTS inscripciones;

      CREATE TABLE inscripciones (
        id SERIAL PRIMARY KEY, -- ID autoincremental
        tipo_documento TEXT NOT NULL, -- Ej: DNI, CUIT, CÉDULA
        dni_cuit TEXT NOT NULL,       -- Número de documento o CUIT
        provincia TEXT NOT NULL,      -- Provincia (fijo: Chaco)
        departamento TEXT NOT NULL,   -- Departamento (fijo: Ldor. Gral. San Martín)
        localidad TEXT NOT NULL,      -- Localidad elegida por el usuario
        domicilio TEXT NOT NULL,      -- Dirección del contribuyente
        dominio TEXT NOT NULL,        -- Patente del vehículo
        tipo_dominio TEXT NOT NULL,   -- Mercosur o Modelo Anterior
        cedula_frente_url TEXT,       -- URL de la imagen frontal de la cédula (subida a Cloudinary)
        cedula_dorso_url TEXT,        -- URL de la imagen del dorso de la cédula (subida a Cloudinary)
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha y hora del registro
      );
    `);

    // Mensaje de éxito si todo salió bien
    console.log("✅ Migración ejecutada correctamente.");
  } catch (error) {
    // Mostramos un error si la migración falla
    console.error("❌ Error en la migración:", error);
  } finally {
    // Cerramos la conexión a la base de datos pase lo que pase
    await client.end();
  }
}

// Ejecutamos la función de migración
migrar();
