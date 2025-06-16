README_DEPENDENCIAS.txt

Este documento detalla los pasos necesarios para clonar, instalar y ejecutar el proyecto `patente-sanmartin` en una nueva máquina (como tu notebook).

------------------------------------------------------
1. Clonar el repositorio

Desde la terminal, ubicarse en la carpeta deseada:

cd C:/Users/ryrco/Desktop/sm1
git clone https://github.com/mdadmin22/patente-sanmartin.git
cd patente-sanmartin

------------------------------------------------------
2. Instalar las dependencias del proyecto

npm install

Este comando instalará automáticamente todas las dependencias definidas en package.json, incluyendo:

- next
- react
- pg
- axios
- jsonwebtoken
- cloudinary
- formidable
- pdf-lib
- y otras utilizadas por el sistema

------------------------------------------------------
3. Agregar archivo .env.local

Copiar el archivo .env.local desde la PC original (por email, pendrive, drive, etc.) y colocarlo en la raíz del proyecto.

Este archivo debe contener variables como:

DATABASE_URL=...
JWT_SECRET=...
NEXT_PUBLIC_URL_BASE=...
MERCADOPAGO_TOKEN=...
CLOUDINARY_API_KEY=...
CELULAR_MUNICIPIO=...

------------------------------------------------------
4. Iniciar el proyecto en desarrollo

npm run dev

Acceder en el navegador a:
http://localhost:3000

------------------------------------------------------
5. Exponer el servidor con ngrok (opcional para pruebas externas)

Instalar ngrok globalmente (si no está instalado):

npm install -g ngrok

Usar ngrok para exponer el servidor local:

ngrok http 3000

Copiar el link público generado (por ejemplo https://....ngrok-free.app) y usarlo en otros dispositivos o para pruebas remotas.

------------------------------------------------------
6. Otras dependencias externas si usás OCR

Si usás OCR con Google Vision API (versión con Flask), recordá también:

- Instalar Python y Flask en la notebook
- Colocar el archivo .json con la clave de servicio de Google
- Exportar la variable de entorno:

set GOOGLE_APPLICATION_CREDENTIALS="C:/ruta/a/clave_google.json"

------------------------------------------------------
7. Recomendación de mantenimiento

Para mantener actualizado tu entorno:

Corregir vulnerabilidades leves:
npm audit fix

Actualizar npm (opcional):
npm install -g npm@latest

------------------------------------------------------

------------------------------------------------------
8. Dependencias criptográficas para contraseñas

Este sistema utiliza `bcrypt` para encriptar contraseñas de usuarios nuevos.

Si al ejecutar el proyecto aparece un error como:
"Module not found: Can't resolve 'bcrypt'"

Entonces debés instalar la librería manualmente:

npm install bcrypt

✅ Alternativa si estás en Windows y da error de compilación:

npm install bcryptjs

Y reemplazar en el código:

import bcrypt from 'bcrypt';

por:

import bcrypt from 'bcryptjs';

Esto permite usar encriptación compatible sin necesidad de compilar librerías nativas en algunos entornos Windows.




Todo listo ✅

Con estos pasos vas a tener el proyecto funcionando igual que en tu PC de escritorio.
¡Ya podés continuar trabajando desde la notebook!
