# 👤 Usuarios y Accesos

## ¿Qué es este módulo?

El módulo de **Usuarios** permite gestionar las cuentas de acceso al sistema ERP. Incluye la creación de usuarios, asignación de roles y permisos, control de acceso y gestión de contraseñas.

Piense en este módulo como su "control de acceso": determina quién puede entrar al sistema, qué puede ver y qué acciones puede realizar.

## ¿Para quién es útil?

- **Administradores del Sistema**: Para crear y gestionar usuarios
- **Recursos Humanos**: Para vincular usuarios con empleados
- **Seguridad IT**: Para controlar accesos y permisos

## ¿Qué puedo hacer aquí?

### Gestión de Usuarios
- **Crear usuarios** con nombre, email y contraseña
- **Vincular a empleados** del sistema
- **Asignar roles** que determinan los permisos
- **Activar/Desactivar** cuentas
- **Restablecer contraseñas**

### Gestión de Roles
- **Crear roles** personalizados
- **Asignar permisos** a cada rol
- **Roles predefinidos**: Administrador, Supervisor, Usuario

### Control de Acceso
- **Ver usuarios activos** e inactivos
- **Auditar accesos** al sistema
- **Gestionar sesiones**

## Conceptos Importantes

### Usuario vs Empleado

| Concepto | Descripción |
|----------|-------------|
| **Usuario** | Cuenta para acceder al sistema (username + password) |
| **Empleado** | Persona que trabaja en la empresa |

Un usuario puede estar vinculado a un empleado, pero no es obligatorio. Por ejemplo, un consultor externo puede tener usuario sin ser empleado.

### Estados del Usuario

| Estado | Descripción |
|--------|-------------|
| **Activo** | Puede iniciar sesión |
| **Inactivo** | No puede iniciar sesión |

### Roles

Los roles agrupan permisos. Ejemplos:

| Rol | Descripción |
|-----|-------------|
| **Administrador** | Acceso total al sistema |
| **Supervisor** | Acceso a su área con capacidad de aprobar |
| **Usuario** | Acceso básico de lectura y creación |
| **Auditor** | Solo lectura en todos los módulos |

### Permisos

Los permisos determinan qué puede hacer un usuario:

| Permiso | Descripción |
|---------|-------------|
| **Leer** | Ver información |
| **Crear** | Agregar nuevos registros |
| **Editar** | Modificar registros existentes |
| **Eliminar** | Borrar registros |
| **Aprobar** | Aprobar solicitudes o documentos |

### Estructura de Permisos

Los permisos siguen el formato: `modulo:accion`

Ejemplos:
- `employees:read` - Ver empleados
- `projects:create` - Crear proyectos
- `finance:approve` - Aprobar transacciones

## Relación con Otros Módulos

El módulo de Usuarios se conecta con:

- **Empleados**: Los usuarios pueden vincularse a empleados para heredar información.

- **Todos los módulos**: Los permisos determinan qué módulos puede ver y usar cada usuario.

- **Auditoría**: Las acciones de los usuarios se registran para trazabilidad.
