require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client();

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log(res.rows);
  })
  .catch(err => {
    console.error('❌ Error al conectar:', err);
  })
  .finally(() => client.end());
