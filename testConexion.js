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


//MERCADOPAGO_TOKEN=APP_USR-7837264786850582-060823-17b7941a90cf7e8a76339c756065b793-2488276438
