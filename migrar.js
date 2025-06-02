// migrar.js
import dotenv from "dotenv";
import { Client } from "pg"; // ✅ FALTABA ESTO

dotenv.config({ path: ".env.local" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrar() {
  try {
    await client.connect();
    await client.query(`
      DROP TABLE IF EXISTS inscripciones;

      CREATE TABLE inscripciones (
        id SERIAL PRIMARY KEY,
        tipo_documento TEXT NOT NULL,
        dni_cuit TEXT NOT NULL,
        provincia TEXT NOT NULL,
        departamento TEXT NOT NULL,
        localidad TEXT NOT NULL,
        domicilio TEXT NOT NULL,
        dominio TEXT NOT NULL,
        tipo_dominio TEXT NOT NULL,
        cedula_frente_url TEXT,
        cedula_dorso_url TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Migración ejecutada correctamente.");
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    await client.end();
  }
}

migrar();
