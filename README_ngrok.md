Uso de ngrok en el proyecto de Registro de Patentes Municipales
Este proyecto utiliza MercadoPago, que requiere URLs públicas accesibles para redirecciones (`success`, `failure`) y notificaciones automáticas (`notification_url`). Para poder testearlo en entorno local, usamos ngrok.


🚀 Cómo usar ngrok paso a paso
1. Instalar ngrok (si no lo tenés):
npm install -g ngrok
2. Iniciar el servidor local de Next.js:
npm run dev
Esto deja la app corriendo en http://localhost:3000
3. Iniciar ngrok en otra terminal:
ngrok http 3000
Esto te dará una URL pública como:
https://4404-190-183-203-40.ngrok-free.app
🔁 Actualizar URLs en MercadoPago
Abrir el archivo pages/api/crear-preferencia.js y reemplazar:
back_urls: {
  success: "https://TU_URL_NGROK/exito",
  failure: "https://TU_URL_NGROK/fallo",
  pending: "https://TU_URL_NGROK/pendiente",
},
notification_url: "https://TU_URL_NGROK/api/webhook",
⚠️ Esto es obligatorio cada vez que reinicies ngrok porque la URL cambia.
✅ Recomendaciones
- Usá https, ngrok lo ofrece por defecto.
- Si tenés cuenta en ngrok podés configurar un subdominio estático.
- Recordá reiniciar ngrok cada vez que cambies de red, de computadora o cierres la terminal.


npx ngrok config add-authtoken TU_AUTHTOKEN

npx ngrok http 3000