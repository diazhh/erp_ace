# 👥 Módulo de Usuarios y Permisos - Descripción

## ¿Qué hace este módulo?

El módulo de **Usuarios y Permisos** gestiona el acceso al sistema. Permite crear usuarios, asignar roles, definir permisos granulares y controlar qué puede hacer cada usuario en el sistema.

## Funcionalidades Principales

### 1. Gestión de Usuarios
- **Crear** usuarios del sistema
- **Vincular** con empleados existentes
- **Activar/Desactivar** usuarios
- **Restablecer** contraseñas
- **Asignar** roles

### 2. Gestión de Roles
- **Crear** roles personalizados
- **Definir** permisos por rol
- **Asignar** roles a usuarios
- **Roles predefinidos**: Admin, Gerente, Usuario

### 3. Sistema de Permisos
- **Permisos granulares** por módulo
- **CRUD** por entidad (read, create, update, delete)
- **Permisos especiales** (approve, export, etc.)

### 4. Configuraciones
- **Email**: Configuración SMTP
- **WhatsApp**: Integración con Baileys

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `User` | Usuarios del sistema |
| `Role` | Roles de usuario |
| `Permission` | Permisos individuales |
| `RolePermission` | Relación rol-permiso |

## Estados de Usuario

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Activo** | Verde | Usuario puede acceder |
| **Inactivo** | Rojo | Usuario bloqueado |

## Roles Predefinidos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Super Admin** | Acceso total | Todos los permisos |
| **Admin** | Administrador | Casi todos los permisos |
| **Manager** | Gerente | Lectura y aprobaciones |
| **User** | Usuario básico | Solo lectura |

## Estructura de Permisos

Los permisos siguen el formato: `modulo:accion`

### Acciones Comunes

| Acción | Descripción |
|--------|-------------|
| `read` | Ver información |
| `create` | Crear registros |
| `update` | Editar registros |
| `delete` | Eliminar registros |
| `approve` | Aprobar items |
| `export` | Exportar datos |

### Ejemplos de Permisos

| Permiso | Descripción |
|---------|-------------|
| `employees:read` | Ver empleados |
| `employees:create` | Crear empleados |
| `projects:approve` | Aprobar proyectos |
| `finance:export` | Exportar datos financieros |
| `users:*` | Todos los permisos de usuarios |

## Campos de Usuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | String | Nombre de usuario único |
| `email` | String | Correo electrónico |
| `password` | String | Contraseña (encriptada) |
| `employeeId` | UUID | Empleado vinculado |
| `roleId` | UUID | Rol asignado |
| `isActive` | Boolean | Estado activo/inactivo |
| `lastLogin` | DateTime | Último acceso |
| `mustChangePassword` | Boolean | Debe cambiar contraseña |

## Campos de Rol

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del rol |
| `description` | String | Descripción |
| `isSystem` | Boolean | Rol del sistema (no editable) |
| `permissions` | Array | Lista de permisos |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                   USUARIOS Y PERMISOS                        │
│  (Usuarios, Roles, Permisos)                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TODOS LOS MÓDULOS                         │
│  (Control de acceso basado en permisos)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       EMPLEADOS                              │
│  (Vinculación usuario-empleado)                             │
└─────────────────────────────────────────────────────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin/users` | Lista | Lista de usuarios |
| `/admin/users/new` | Formulario | Crear usuario |
| `/admin/users/:id` | Detalle | Detalle de usuario |
| `/admin/users/:id/edit` | Formulario | Editar usuario |
| `/admin/roles` | Lista | Lista de roles |
| `/admin/roles/new` | Formulario | Crear rol |
| `/admin/roles/:id` | Detalle | Detalle de rol |
| `/admin/roles/:id/edit` | Formulario | Editar rol |
| `/admin/email-config` | Config | Configuración de email |
| `/admin/whatsapp-config` | Config | Configuración de WhatsApp |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `users:read` | Ver usuarios |
| `users:create` | Crear usuarios |
| `users:update` | Editar usuarios |
| `users:delete` | Eliminar usuarios |
| `roles:read` | Ver roles |
| `roles:create` | Crear roles |
| `roles:update` | Editar roles |
| `roles:delete` | Eliminar roles |
| `settings:*` | Configuraciones del sistema |

## Ejemplos de Uso

### Caso 1: Crear Usuario para Empleado
1. Ir a Administración → Usuarios → Nuevo
2. Ingresar username y email
3. Seleccionar empleado a vincular
4. Asignar rol
5. Guardar (se genera contraseña temporal)

### Caso 2: Crear Rol Personalizado
1. Ir a Administración → Roles → Nuevo
2. Ingresar nombre y descripción
3. Seleccionar permisos necesarios
4. Guardar
5. Asignar a usuarios

### Caso 3: Restablecer Contraseña
1. Ir a lista de usuarios
2. Buscar usuario
3. Clic en "Restablecer Contraseña"
4. Se genera contraseña temporal
5. Comunicar al usuario

## Screenshots

- `screenshots/usuarios-lista.png` - Lista de usuarios
- `screenshots/usuario-detalle.png` - Detalle de usuario
- `screenshots/roles-lista.png` - Lista de roles
- `screenshots/rol-permisos.png` - Asignación de permisos
