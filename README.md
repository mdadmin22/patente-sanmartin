# Sistema de Registro de Patente Municipal

Este proyecto es una aplicación web construida con Next.js y PostgreSQL que permite a los ciudadanos del Departamento Ldor. Gral. San Martín (Provincia del Chaco) registrar su vehículo en el padrón municipal, incluyendo el envío de imágenes.

## Requisitos

- Node.js 18 o superior
- PostgreSQL (local o servicio en la nube como Railway)
- Cuenta en [Cloudinary](https://cloudinary.com/) para almacenar las imágenes
- Git

## Funcionalidades

- Registro de contribuyentes mediante DNI, CUIT o Cédula
- Selección de localidad dentro del Departamento Ldor. Gral. San Martín
- Validación de campos obligatorios
- Carga de imágenes
- Almacenamiento de las imágenes en Cloudinary
- Persistencia de todos los datos en una base de datos PostgreSQL
- Interfaz amigable desarrollada en Next.js

---

## Tecnologías utilizadas

- **[Next.js](https://nextjs.org/)**: Framework de React para desarrollo web fullstack
- **[PostgreSQL](https://www.postgresql.org/)**: Base de datos relacional utilizada para almacenar los registros
- **[Cloudinary](https://cloudinary.com/)**: Servicio externo para alojar imágenes
- **[Formidable](https://www.npmjs.com/package/formidable)**: Librería para procesar formularios con archivos
- **[Railway](https://railway.app/)**: Servicio de hosting de bases de datos PostgreSQL
- **Node.js y Express API routes** (integrado en Next.js)

---

## Instalación

1. Clonar este repositorio en tu máquina local:

```bash
git clone https://github.com/usuario/patente-sanmartin.git
cd patente-sanmartin
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env.local` en la raíz del proyecto (ver ejemplo abajo).

4. Ejecutar la migración para crear la tabla en la base de datos:

```bash
node migrar.js
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Variables de Entorno

Para el correcto funcionamiento del proyecto, se deben definir las siguientes variables de entorno en un archivo llamado `.env.local`.

A continuación, se incluye un ejemplo:

### `.env.example`

```env
# Cadena de conexión a la base de datos PostgreSQL
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_basededatos
DATABASE_URL=postgresql://usuario:contraseña@host:5432/base_de_datos

# Configuración de Cloudinary para subir imágenes
CLOUDINARY_CLOUD_NAME=tu_nombre_en_cloudinary
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Este archivo `.env.example` sirve como guía. No contiene credenciales reales. El archivo real `.env.local` está incluido en `.gitignore` .

## Estructura del Proyecto

- `pages/index.js`: Página principal con el formulario de inscripción.
- `pages/api/guardar.js`: Endpoint que recibe el formulario, sube las imágenes a Cloudinary y guarda los datos en PostgreSQL.
- `migrar.js`: Script para crear la tabla `inscripciones` en la base de datos.

## Producción

Para desplegar el proyecto en producción, se recomienda:

- Usar servicios como Vercel o Railway.
- Definir las variables de entorno en el entorno de producción.
- Configurar HTTPS si se gestiona de forma local.



## Contacto

Este sistema de prueba fue desarrollado para el uso exclusivo del Municipio de General José de San Martín, Chaco, como parte del plan de modernización digital del registro vehicular.

Para más información, contactarse via mail a la casilla de correo: adm.rs6002@gmail.com


desarollado por mdadmin22
