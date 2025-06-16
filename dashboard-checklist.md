# ✅ Sistema Municipal de Registro de Patentes - Checklist General

Este documento resume las funcionalidades implementadas, en desarrollo y pendientes para el sistema digital de gestión de patentes municipales.

---



## 🔐 0. GitHub

1.Después de esto, los cambios estarán disponibles en GitHub (o el servicio que uses). Crear el pull request más adelante para fusionar esta rama con main.


## 🔐 1. Autenticación y Seguridad

| Estado | Tarea |
|--------|-------|
| ✅ | Inicio de sesión para administradores con JWT |
| ✅ | Verificación de rol `'admin'` antes de mostrar el dashboard |
| ✅ | Redirección automática a `/admin/login` si no está autenticado |
| ⏳ | Recuperación de contraseña / validación por email (si se desea) |

---

## 🧾 2. Trámites: Panel Administrativo

| Estado | Tarea |
|--------|-------|
| ✅ | Vista `/admin/tramites` con listado completo de trámites |
| ✅ | Mostrar datos personales y vehiculares en tabla |
| ✅ | pagina de los usuarios
| ⏳ | Formateo de montos en moneda argentina |
| ✅ | Botones de aprobación (`✅`) y rechazo (`❌`) funcionales |
| ✅ | Actualización inmediata de estado en frontend y backend |
| ⏳ | Filtros por tipo de trámite, estado o dominio |
| ⏳ | Buscador por CUIT, dominio o nombre |
| ⏳ | Mostrar icono o color según estado del trámite |

---

## 🗃️ 3. Base de Datos

| Estado | Tarea |
|--------|-------|
| ✅ | Tabla `inscripciones` con campos completos (estado, montos, datos, etc.) |
| ✅ | Tabla `usuarios` para almacenar credenciales y roles |
| ✅ | Estructura compatible con PostgreSQL y `pg` |
| 🔄 | Agregar tracking de fecha de pago (`fecha_pago`), `payment_id`, etc. |

---

## 🧠 4. Backend (API)

| Estado | Tarea |
|--------|-------|
| ✅ | `/api/tramites`: obtiene trámites desde la base de datos |
| ✅ | `/api/actualizar-tramite`: actualiza estado del trámite (admin) |
| 🔄 | Webhook de MercadoPago para actualizar automáticamente el estado de pago |
| ⏳ | API para crear nuevos administradores (sólo admins pueden usarla) |
| ⏳ | API para exportar trámites a PDF o CSV |

---

## 🧾 5. Comprobante / Volantes

| Estado | Tarea |
|--------|-------|
| ✅ | Cálculo y generación de montos desde tabla de valores fiscales |
| ⏳ | Comprobante en PDF para cada trámite (visualizable por contribuyente y admin) |
| ⏳ | Envío por WhatsApp o mail al contribuyente |
| ⏳ | Botón "Ver comprobante" desde el panel admin |

---

## 👥 6. Gestión de Usuarios

| Estado | Tarea |
|--------|-------|
| ✅ | Login de administrador funcionando |
| ⏳ | Crear usuarios desde el panel (solo por admins) |
| ⏳ | Edición y eliminación de usuarios admin (opcional) |
| ⏳ | Asignar permisos si se agregan más roles |

---

## 📊 7. Dashboard Estadístico (opcional)

| Estado | Tarea |
|--------|-------|
| ⏳ | Contador de trámites por estado |
| ⏳ | Gráfico de trámites por día / mes |
| ⏳ | Total recaudado y cantidad de pagos aprobados |

---

## 📁 Archivo generado por: `ChatGPT + Marco`
Fecha: {{fecha_actual}}

