CREATE TABLE IF NOT EXISTS cuotas_contribuyente (
  id SERIAL PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  dominio VARCHAR(10) NOT NULL,
  año INT NOT NULL,
  cuota_nro INT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  monto NUMERIC(10, 2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_pago DATE,
  forma_pago VARCHAR(30),
  id_pago_mercadopago VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
