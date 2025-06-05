-- Archivo: agregar_campos_contacto.sql
-- Agrega columnas para email y teléfono en la tabla inscripciones

ALTER TABLE inscripciones
ADD COLUMN mail TEXT,
ADD COLUMN mail_repetir TEXT,
ADD COLUMN telefono TEXT;
