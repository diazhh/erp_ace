# 🔐 Planificación: Sistema de Usuarios y Permisos Granulares

**Versión:** 1.0  
**Fecha:** 2025-12-05  
**Sprint:** 12  

---

## 📋 Resumen

Este documento describe la implementación del sistema de usuarios y permisos granulares para el ERP, permitiendo:

1. **Módulo de Usuarios**: CRUD completo con vinculación a empleados
2. **Gestión de Roles**: Crear y editar roles con permisos específicos
3. **Permisos Granulares**: Control a nivel de módulo, acción y campo/tab
4. **Control de UI**: Ocultar tabs y acciones según permisos del usuario

---

## 🏗️ Arquitectura de Permisos

### Formato de Código de Permiso

```
modulo:accion[:campo]
```

**Ejemplos:**
- `employees:*` → Acceso completo al módulo de empleados
- `employees:read` → Ver lista de empleados
- `employees:read:payroll` → Ver tab de nómina en detalle de empleado
- `loans:approve` → Aprobar préstamos

### Niveles de Permisos

| Nivel | Formato | Ejemplo | Descripción |
|-------|---------|---------|-------------|
| **Módulo** | `modulo:*` | `employees:*` | Acceso completo al módulo |
| **Acción** | `modulo:accion` | `employees:read` | Acción específica |
| **Campo/Tab** | `modulo:accion:campo` | `employees:read:payroll` | Sección específica |

### Jerarquía de Verificación

```
*:* (Super Admin)
    ↓
modulo:* (Acceso completo al módulo)
    ↓
modulo:accion (Acción específica)
    ↓
modulo:accion:campo (Campo/Tab específico)
```

---

## 📊 Catálogo de Permisos

### Empleados (`employees`)

| Código | Descripción |
|--------|-------------|
| `employees:*` | Acceso completo |
| `employees:read` | Ver lista de empleados |
| `employees:read:personal` | Ver tab datos personales |
| `employees:read:work` | Ver tab datos laborales |
| `employees:read:payroll` | Ver tab historial de nómina |
| `employees:read:loans` | Ver tab préstamos |
| `employees:read:accounts` | Ver tab cuentas bancarias |
| `employees:read:documents` | Ver tab documentos |
| `employees:read:hierarchy` | Ver tab jerarquía |
| `employees:create` | Crear empleado |
| `employees:update` | Editar empleado |
| `employees:delete` | Eliminar empleado |
| `employees:export` | Exportar datos |

### Préstamos (`loans`)

| Código | Descripción |
|--------|-------------|
| `loans:*` | Acceso completo |
| `loans:read` | Ver préstamos |
| `loans:create` | Solicitar préstamo |
| `loans:update` | Editar préstamo |
| `loans:approve` | Aprobar préstamo |
| `loans:reject` | Rechazar préstamo |
| `loans:cancel` | Cancelar préstamo |
| `loans:pay` | Registrar pago anticipado |

### Nómina (`payroll`)

| Código | Descripción |
|--------|-------------|
| `payroll:*` | Acceso completo |
| `payroll:read` | Ver períodos de nómina |
| `payroll:create` | Crear período |
| `payroll:generate` | Generar nómina |
| `payroll:approve` | Aprobar nómina |
| `payroll:pay` | Marcar como pagada |
| `payroll:export` | Exportar nómina |

### Finanzas (`finance`)

| Código | Descripción |
|--------|-------------|
| `finance:*` | Acceso completo |
| `finance:read` | Ver cuentas y transacciones |
| `finance:create` | Crear transacciones |
| `finance:update` | Editar transacciones |
| `finance:delete` | Eliminar transacciones |
| `finance:transfer` | Realizar transferencias |
| `finance:export` | Exportar datos |

### Caja Chica (`petty_cash`)

| Código | Descripción |
|--------|-------------|
| `petty_cash:*` | Acceso completo |
| `petty_cash:read` | Ver cajas chicas |
| `petty_cash:create` | Crear caja chica |
| `petty_cash:expense` | Registrar gasto |
| `petty_cash:approve` | Aprobar gastos |
| `petty_cash:reject` | Rechazar gastos |
| `petty_cash:replenish` | Reponer caja |

### Proyectos (`projects`)

| Código | Descripción |
|--------|-------------|
| `projects:*` | Acceso completo |
| `projects:read` | Ver proyectos |
| `projects:read:team` | Ver tab equipo |
| `projects:read:milestones` | Ver tab hitos |
| `projects:read:expenses` | Ver tab gastos |
| `projects:read:updates` | Ver tab seguimiento |
| `projects:read:photos` | Ver tab fotos |
| `projects:create` | Crear proyecto |
| `projects:update` | Editar proyecto |
| `projects:delete` | Eliminar proyecto |
| `projects:approve_expense` | Aprobar gastos |

### Inventario (`inventory`)

| Código | Descripción |
|--------|-------------|
| `inventory:*` | Acceso completo |
| `inventory:read` | Ver inventario |
| `inventory:create` | Crear items |
| `inventory:update` | Editar items |
| `inventory:delete` | Eliminar items |
| `inventory:movement` | Registrar movimientos |
| `inventory:adjust` | Ajustar stock |
| `inventory:transfer` | Transferir entre almacenes |

### Flota (`fleet`)

| Código | Descripción |
|--------|-------------|
| `fleet:*` | Acceso completo |
| `fleet:read` | Ver vehículos |
| `fleet:read:assignments` | Ver tab asignaciones |
| `fleet:read:maintenance` | Ver tab mantenimientos |
| `fleet:read:fuel` | Ver tab combustible |
| `fleet:read:costs` | Ver tab costos |
| `fleet:create` | Agregar vehículo |
| `fleet:update` | Editar vehículo |
| `fleet:delete` | Eliminar vehículo |
| `fleet:assign` | Asignar vehículo |
| `fleet:maintenance` | Registrar mantenimiento |
| `fleet:fuel` | Registrar combustible |

### Procura (`procurement`)

| Código | Descripción |
|--------|-------------|
| `procurement:*` | Acceso completo |
| `procurement:read` | Ver órdenes y proveedores |
| `procurement:create` | Crear solicitud |
| `procurement:approve` | Aprobar solicitud |
| `procurement:order` | Generar orden de compra |
| `procurement:receive` | Registrar recepción |

### HSE (`hse`)

| Código | Descripción |
|--------|-------------|
| `hse:*` | Acceso completo |
| `hse:read` | Ver incidentes e inspecciones |
| `hse:create` | Registrar incidente |
| `hse:update` | Editar registros |
| `hse:close` | Cerrar incidente |

### Documentos (`documents`)

| Código | Descripción |
|--------|-------------|
| `documents:*` | Acceso completo |
| `documents:read` | Ver documentos |
| `documents:create` | Subir documentos |
| `documents:update` | Editar documentos |
| `documents:delete` | Eliminar documentos |
| `documents:approve` | Aprobar documentos |
| `documents:share` | Compartir documentos |

### Usuarios (`users`)

| Código | Descripción |
|--------|-------------|
| `users:*` | Acceso completo |
| `users:read` | Ver usuarios |
| `users:create` | Crear usuario |
| `users:update` | Editar usuario |
| `users:delete` | Eliminar usuario |
| `users:reset_password` | Resetear contraseña |

### Roles (`roles`)

| Código | Descripción |
|--------|-------------|
| `roles:*` | Acceso completo |
| `roles:read` | Ver roles |
| `roles:create` | Crear rol |
| `roles:update` | Editar rol |
| `roles:delete` | Eliminar rol |

### Auditoría (`audit`)

| Código | Descripción |
|--------|-------------|
| `audit:read` | Ver logs de auditoría |
| `audit:export` | Exportar logs |

### Reportes (`reports`)

| Código | Descripción |
|--------|-------------|
| `reports:*` | Acceso completo |
| `reports:dashboard` | Ver dashboard |
| `reports:finance` | Reportes financieros |
| `reports:payroll` | Reportes de nómina |
| `reports:projects` | Reportes de proyectos |
| `reports:inventory` | Reportes de inventario |
| `reports:fleet` | Reportes de flota |

---

## 👥 Roles Predefinidos

### Super Administrador
```javascript
permissions: ['*:*']
```

### Gerente General
```javascript
permissions: [
  'employees:read', 'employees:read:*',
  'payroll:read', 'payroll:approve',
  'finance:read', 'finance:export',
  'projects:*',
  'inventory:read',
  'fleet:read',
  'procurement:read', 'procurement:approve',
  'hse:read',
  'documents:read',
  'reports:*',
  'audit:read'
]
```

### Gerente Administrativo
```javascript
permissions: [
  'employees:*',
  'payroll:*',
  'finance:*',
  'petty_cash:*',
  'procurement:*',
  'documents:*',
  'users:read',
  'reports:finance', 'reports:payroll'
]
```

### Gerente de Operaciones
```javascript
permissions: [
  'employees:read',
  'projects:*',
  'inventory:*',
  'fleet:*',
  'hse:*',
  'procurement:create', 'procurement:read',
  'reports:projects', 'reports:inventory', 'reports:fleet'
]
```

### Contador
```javascript
permissions: [
  'employees:read:payroll', 'employees:read:accounts',
  'payroll:read', 'payroll:pay', 'payroll:export',
  'finance:*',
  'petty_cash:read', 'petty_cash:approve',
  'reports:finance', 'reports:payroll'
]
```

### Jefe de RRHH
```javascript
permissions: [
  'employees:*',
  'payroll:*',
  'loans:*',
  'documents:read', 'documents:create',
  'reports:payroll'
]
```

### Supervisor de Proyecto
```javascript
permissions: [
  'employees:read:personal', 'employees:read:work',
  'projects:read', 'projects:update',
  'projects:read:*',
  'inventory:read', 'inventory:movement',
  'fleet:read', 'fleet:fuel',
  'petty_cash:expense',
  'hse:create', 'hse:read'
]
```

### Empleado
```javascript
permissions: [
  'employees:read:personal', // Solo su propio perfil
  'loans:read', 'loans:create', // Solo sus préstamos
  'petty_cash:expense', // Registrar gastos
  'documents:read' // Solo sus documentos
]
```

---

## 🗄️ Modelo de Datos

### Tabla: permissions (extendida)

```sql
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS action VARCHAR(50);
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS field VARCHAR(50);
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS permission_type VARCHAR(20) DEFAULT 'action';

-- permission_type: 'module' | 'action' | 'field'
```

### Tabla: users (extendida)

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP;
```

---

## 🔧 Implementación Backend

### Middleware: authorizeField

```javascript
const authorizeField = (module, action, field = null) => {
  return (req, res, next) => {
    const permissions = req.userPermissions;
    
    // Super admin
    if (permissions.includes('*:*')) return next();
    
    // Módulo completo
    if (permissions.includes(`${module}:*`)) return next();
    
    // Acción específica
    if (permissions.includes(`${module}:${action}`)) return next();
    
    // Campo específico
    if (field && permissions.includes(`${module}:${action}:${field}`)) {
      return next();
    }
    
    // Wildcard de acción con cualquier campo
    if (permissions.includes(`${module}:${action}:*`)) return next();
    
    throw new ForbiddenError('No tiene permiso para esta acción');
  };
};
```

### Helper: checkPermission

```javascript
const checkPermission = (userPermissions, requiredPermission) => {
  // Super admin
  if (userPermissions.includes('*:*')) return true;
  
  const [module, action, field] = requiredPermission.split(':');
  
  // Módulo completo
  if (userPermissions.includes(`${module}:*`)) return true;
  
  // Acción específica
  if (userPermissions.includes(`${module}:${action}`)) return true;
  
  // Campo específico
  if (field && userPermissions.includes(`${module}:${action}:${field}`)) {
    return true;
  }
  
  // Wildcard de acción
  if (userPermissions.includes(`${module}:${action}:*`)) return true;
  
  return false;
};
```

---

## 🎨 Implementación Frontend

### Hook: usePermission

```javascript
import { useSelector } from 'react-redux';

export const usePermission = (permission) => {
  const { permissions } = useSelector(state => state.auth);
  return checkPermission(permissions, permission);
};

export const usePermissions = (permissionList) => {
  const { permissions } = useSelector(state => state.auth);
  return permissionList.map(p => checkPermission(permissions, p));
};
```

### Componente: PermissionGate

```jsx
const PermissionGate = ({ permission, children, fallback = null }) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? children : fallback;
};

// Uso
<PermissionGate permission="employees:read:payroll">
  <Tab label="Nómina" value="payroll" />
</PermissionGate>
```

### Ejemplo: Tabs con Permisos

```jsx
const EmployeeDetail = () => {
  const canViewPayroll = usePermission('employees:read:payroll');
  const canViewLoans = usePermission('employees:read:loans');
  const canViewAccounts = usePermission('employees:read:accounts');
  
  const tabs = [
    { label: 'Información', value: 'info', visible: true },
    { label: 'Laboral', value: 'work', visible: true },
    { label: 'Nómina', value: 'payroll', visible: canViewPayroll },
    { label: 'Préstamos', value: 'loans', visible: canViewLoans },
    { label: 'Cuentas', value: 'accounts', visible: canViewAccounts },
  ].filter(tab => tab.visible);
  
  return <Tabs tabs={tabs} />;
};
```

---

## 📁 Rutas del Módulo

### Backend API

```
POST   /api/users                    → Crear usuario
GET    /api/users                    → Listar usuarios
GET    /api/users/:id                → Obtener usuario
PUT    /api/users/:id                → Actualizar usuario
DELETE /api/users/:id                → Eliminar usuario
POST   /api/users/:id/reset-password → Resetear contraseña
PUT    /api/users/:id/toggle-active  → Activar/Desactivar
POST   /api/users/:id/roles          → Asignar roles

POST   /api/roles                    → Crear rol
GET    /api/roles                    → Listar roles
GET    /api/roles/:id                → Obtener rol con permisos
PUT    /api/roles/:id                → Actualizar rol
DELETE /api/roles/:id                → Eliminar rol
POST   /api/roles/:id/permissions    → Asignar permisos

GET    /api/permissions              → Listar permisos (agrupados por módulo)
GET    /api/permissions/modules      → Listar módulos disponibles
```

### Frontend Routes

```
/admin/users              → Lista de usuarios
/admin/users/new          → Crear usuario
/admin/users/:id          → Detalle de usuario
/admin/users/:id/edit     → Editar usuario

/admin/roles              → Lista de roles
/admin/roles/new          → Crear rol
/admin/roles/:id          → Detalle de rol
/admin/roles/:id/edit     → Editar rol
```

---

## ✅ Checklist de Implementación

### Backend
- [ ] Migración: Extender tabla permissions
- [ ] Migración: Agregar employee_id a users
- [ ] Seeder: Permisos granulares
- [ ] Seeder: Roles predefinidos con permisos
- [ ] Middleware: authorizeField
- [ ] Helper: checkPermission
- [ ] Controller: UserController (CRUD)
- [ ] Controller: RoleController (CRUD)
- [ ] Service: UserService
- [ ] Service: RoleService
- [ ] Routes: /api/users
- [ ] Routes: /api/roles
- [ ] Routes: /api/permissions

### Frontend
- [ ] Hook: usePermission
- [ ] Componente: PermissionGate
- [ ] Slice: usersSlice
- [ ] Slice: rolesSlice
- [ ] Página: UserList
- [ ] Página: UserForm
- [ ] Página: UserDetail
- [ ] Página: RoleList
- [ ] Página: RoleForm
- [ ] Página: RoleDetail
- [ ] Aplicar permisos a EmployeeDetail tabs
- [ ] Aplicar permisos a ProjectDetail tabs
- [ ] Aplicar permisos a VehicleDetail tabs
- [ ] Aplicar permisos a botones de acción
- [ ] Menú lateral condicional según permisos

---

## 📝 Notas de Implementación

1. **Permisos de "solo mi perfil"**: Para empleados que solo pueden ver su propio perfil, el backend debe verificar `req.user.employeeId === req.params.id`

2. **Caché de permisos**: Los permisos se cargan al login y se almacenan en Redux. Si cambian, el usuario debe re-loguearse.

3. **Permisos en menú**: El Layout debe filtrar items del menú según permisos del usuario.

4. **Auditoría**: Todos los cambios de roles y permisos deben registrarse en audit_logs.
