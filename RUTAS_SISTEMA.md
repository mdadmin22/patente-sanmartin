# 🗺️ Rutas del Sistema Municipal de Registro de Patentes

Este documento describe las principales rutas públicas y administrativas del sistema, indicando su funcionalidad y archivo correspondiente en el proyecto Next.js.

---

## 🧾 Sitio Público (Contribuyentes)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `pages/index.js` | Pantalla de bienvenida pública |
| `/alta` | `pages/alta.js` | Alta de dominio: formulario completo para ciudadanos |
| `/exito` | `pages/exito.js` | Pantalla post-pago con comprobante e información del trámite |

---

## 🔐 Sitio Administrativo (Municipio)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin/login` | `pages/admin/login.tsx` | Login de administrador u operador |
| `/admin` | `pages/admin/index.tsx` | Panel principal con accesos rápidos (listado, crear usuarios, trámites presenciales) |
| `/admin/tramites` | `pages/admin/tramites.tsx` | Listado de trámites con filtros, búsqueda y botones de aprobación/rechazo |
| `/admin/usuarios` | `pages/admin/usuarios.tsx` | Administración de usuarios (creación y listado) |

---

## 🧩 Formularios para uso municipal

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/alta?origen=municipio` | `pages/alta.js` | Mismo formulario que el público pero ejecutado desde el municipio (usa `creado_por = municipio`) |
| `/transferencia?origen=municipio` | `pages/transferencia.js` | (Si aplica) Formulario de transferencia desde el panel |
| `/baja?origen=municipio` | `pages/baja.js` | (Si aplica) Formulario de baja desde el panel |

---

## 📁 Información adicional

- Las rutas que usan `?origen=municipio` activan lógicas internas en los formularios (`alta.js`, etc.) para registrar correctamente que el trámite fue iniciado desde el panel del municipio.
- Las rutas están protegidas con autenticación (`JWT`) y verificación de roles (`admin`) en la carpeta `/admin`.

---
