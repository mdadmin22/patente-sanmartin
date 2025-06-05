import { Client } from "pg";

export default async function handler(req, res) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const resultado = await client.query("SELECT * FROM inscripciones ORDER BY id DESC LIMIT 10");

  await client.end();
  res.status(200).json(resultado.rows);
}
