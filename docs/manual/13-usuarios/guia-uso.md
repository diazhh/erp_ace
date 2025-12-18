# 👥 Módulo de Usuarios y Permisos - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Administración"**
2. Se despliegan las opciones:
   - Usuarios
   - Roles
   - Configuración Email
   - Configuración WhatsApp

---

## Usuarios

### Lista de Usuarios

**Ruta:** `/admin/users`

#### KPIs en la Parte Superior

| KPI | Descripción |
|-----|-------------|
| **Total Usuarios** | Cantidad total de usuarios |
| **Activos** | Usuarios que pueden acceder |
| **Inactivos** | Usuarios bloqueados |

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por username o email |
| **Estado** | Activo, Inactivo |
| **Rol** | Todos los roles |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Usuario** | Avatar, username y email |
| **Empleado** | Empleado vinculado |
| **Rol** | Rol asignado |
| **Estado** | Activo/Inactivo |
| **Último Acceso** | Fecha del último login |
| **Acciones** | Ver, Editar, Activar/Desactivar, Reset Password |

---

### Crear Usuario

**Ruta:** `/admin/users/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Username** | ✅ | Nombre de usuario único |
| **Email** | ✅ | Correo electrónico |
| **Empleado** | ❌ | Vincular con empleado |
| **Rol** | ✅ | Rol a asignar |
| **Activo** | ❌ | Estado inicial (default: activo) |

#### Pasos
1. Hacer clic en **"+ Nuevo Usuario"**
2. Ingresar username único
3. Ingresar email
4. Seleccionar empleado (opcional)
5. Asignar rol
6. Hacer clic en **"Guardar"**
7. Se genera contraseña temporal
8. **Importante**: Copiar y comunicar la contraseña al usuario

---

### Detalle del Usuario

**Ruta:** `/admin/users/:id`

#### Información del Usuario
- Username y email
- Empleado vinculado (enlace)
- Rol asignado
- Estado
- Fecha de creación
- Último acceso

#### Acciones Disponibles

| Acción | Descripción |
|--------|-------------|
| **Editar** | Modificar datos del usuario |
| **Activar/Desactivar** | Cambiar estado |
| **Restablecer Contraseña** | Generar nueva contraseña |

---

### Activar/Desactivar Usuario

1. En la lista o detalle del usuario
2. Clic en el botón de activar/desactivar
3. Confirmar la acción
4. El usuario podrá/no podrá acceder al sistema

---

### Restablecer Contraseña

1. En la lista o detalle del usuario
2. Clic en **"Restablecer Contraseña"**
3. Confirmar la acción
4. Se genera contraseña temporal
5. **Copiar la contraseña** mostrada en el diálogo
6. Comunicar al usuario
7. El usuario deberá cambiarla en el primer acceso

---

## Roles

### Lista de Roles

**Ruta:** `/admin/roles`

#### Información Mostrada
- Nombre del rol
- Descripción
- Cantidad de usuarios con ese rol
- Si es rol del sistema (no editable)
- Acciones

#### Roles del Sistema
Los roles marcados como "Sistema" no pueden ser editados ni eliminados:
- Super Admin
- Admin

---

### Crear Rol

**Ruta:** `/admin/roles/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre del rol |
| **Descripción** | ❌ | Descripción del rol |
| **Permisos** | ✅ | Permisos a asignar |

#### Pasos
1. Hacer clic en **"+ Nuevo Rol"**
2. Ingresar nombre descriptivo
3. Agregar descripción
4. Seleccionar permisos necesarios
5. Hacer clic en **"Guardar"**

---

### Asignar Permisos

Los permisos se organizan por módulo:

#### Estructura de Permisos
```
📁 Empleados
  ☑️ employees:read    - Ver empleados
  ☑️ employees:create  - Crear empleados
  ☑️ employees:update  - Editar empleados
  ☐ employees:delete  - Eliminar empleados

📁 Proyectos
  ☑️ projects:read     - Ver proyectos
  ☑️ projects:create   - Crear proyectos
  ☑️ projects:update   - Editar proyectos
  ☐ projects:delete   - Eliminar proyectos
  ☑️ projects:approve  - Aprobar proyectos
```

#### Selección Rápida
- **Seleccionar Todos**: Marca todos los permisos del módulo
- **Deseleccionar Todos**: Desmarca todos los permisos

---

### Detalle del Rol

**Ruta:** `/admin/roles/:id`

#### Información
- Nombre y descripción
- Lista de permisos asignados
- Usuarios con este rol

#### Acciones
- Editar (si no es rol del sistema)
- Eliminar (si no tiene usuarios asignados)

---

## Configuración de Email

**Ruta:** `/admin/email-config`

### Campos de Configuración

| Campo | Descripción |
|-------|-------------|
| **Host SMTP** | Servidor de correo |
| **Puerto** | Puerto del servidor |
| **Usuario** | Usuario de autenticación |
| **Contraseña** | Contraseña del correo |
| **Remitente** | Email que aparece como remitente |
| **TLS/SSL** | Usar conexión segura |

### Probar Configuración
1. Completar todos los campos
2. Clic en **"Probar Conexión"**
3. Se envía email de prueba
4. Verificar recepción

---

## Configuración de WhatsApp

**Ruta:** `/admin/whatsapp-config`

### Integración con Baileys
El sistema usa Baileys para integración con WhatsApp.

### Pasos para Conectar
1. Ir a configuración de WhatsApp
2. Clic en **"Generar QR"**
3. Escanear QR con WhatsApp del teléfono
4. Esperar confirmación de conexión
5. El sistema puede enviar notificaciones por WhatsApp

---

## Tips y Mejores Prácticas

### Para Usuarios
- ✅ Usar usernames descriptivos
- ✅ Vincular siempre con empleado
- ✅ Asignar rol apropiado
- ✅ Desactivar usuarios que ya no trabajan

### Para Roles
- ✅ Crear roles específicos por función
- ✅ Aplicar principio de mínimo privilegio
- ✅ Documentar propósito de cada rol
- ✅ Revisar permisos periódicamente

### Para Seguridad
- ✅ Forzar cambio de contraseña inicial
- ✅ Revisar usuarios inactivos
- ✅ Auditar accesos regularmente
- ✅ No compartir credenciales

---

## Solución de Problemas

### "Usuario no puede acceder"
- Verificar que el usuario esté activo
- Verificar que tenga rol asignado
- Verificar credenciales correctas
- Restablecer contraseña si es necesario

### "Usuario no ve cierto módulo"
- Verificar permisos del rol asignado
- El rol debe tener permiso `modulo:read`
- Asignar permiso o cambiar rol

### "No puedo eliminar el rol"
- Verificar que no sea rol del sistema
- Verificar que no tenga usuarios asignados
- Reasignar usuarios a otro rol primero

### "Contraseña temporal no funciona"
- Las contraseñas temporales expiran
- Generar nueva contraseña
- Verificar que se copió correctamente
