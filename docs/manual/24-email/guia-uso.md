# 📧 Módulo de Email - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Administración"**
2. Seleccionar **"Configuración Email"**

---

## Configuración de Email

**Ruta:** `/admin/email-config`

### Campos de Configuración

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Host SMTP** | ✅ | Servidor de correo |
| **Puerto** | ✅ | Puerto (587, 465, 25) |
| **Usuario** | ✅ | Usuario de autenticación |
| **Contraseña** | ✅ | Contraseña |
| **Remitente** | ✅ | Email que aparece como remitente |
| **Usar TLS** | ❌ | Conexión segura |

### Pasos para Configurar
1. Ir a configuración de email
2. Ingresar datos del servidor SMTP
3. Ingresar credenciales
4. Clic en **"Probar Conexión"**
5. Verificar que llegue el email de prueba
6. Guardar configuración

---

## Probar Configuración

1. Completar todos los campos
2. Clic en **"Probar Conexión"**
3. Se envía email de prueba
4. Verificar recepción en bandeja de entrada

---

## Tips

- ✅ Usar servidor SMTP confiable
- ✅ Verificar credenciales correctas
- ✅ Probar antes de guardar
- ✅ Revisar carpeta de spam si no llega
