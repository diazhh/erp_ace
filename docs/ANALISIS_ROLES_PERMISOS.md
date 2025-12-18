# 🔐 Análisis del Sistema de Roles y Permisos

**Fecha:** 2025-01-18  
**Versión ERP:** 0.17.0

---

## 📊 Estado Actual

### Módulos con Permisos Definidos (22 módulos)

| Módulo | Permisos | Estado |
|--------|----------|--------|
| system | 1 | ✅ |
| users | 6 | ✅ |
| roles | 5 | ✅ |
| employees | 13 | ✅ |
| loans | 8 | ✅ |
| payroll | 7 | ✅ |
| finance | 7 | ✅ |
| petty_cash | 9 | ✅ |
| projects | 12 | ✅ |
| contractors | 6 | ✅ |
| inventory | 8 | ✅ |
| fleet | 14 | ✅ |
| procurement | 6 | ✅ |
| hse | 5 | ✅ |
| documents | 7 | ✅ |
| organization | 5 | ✅ |
| audit | 2 | ✅ |
| reports | 7 | ✅ |
| whatsapp | 3 | ✅ |
| email | 3 | ✅ |
| assets | 13 | ✅ |
| crm | 5 | ✅ |
| quality | 6 | ✅ |
| expense_reports | 5 | ✅ |
| production | 6 | ✅ |
| afe | 6 | ✅ |
| contracts | 6 | ✅ |
| compliance | 6 | ✅ |
| jib | 6 | ✅ |
| ptw | 6 | ✅ |
| reserves | 6 | ✅ |

### Roles Actuales (7 roles)

1. **Super Administrador** - Acceso total (`*:*`)
2. **Gerente General** - Supervisión y aprobaciones
3. **Gerente Administrativo** - Finanzas, RRHH, activos
4. **Gerente de Operaciones** - Proyectos, inventario, producción O&G
5. **Contador** - Contabilidad y pagos
6. **Jefe de RRHH** - Recursos humanos
7. **Supervisor de Proyecto** - Proyectos asignados
8. **Empleado** - Acceso básico

---

## ❌ Problemas Identificados

### 1. Módulo `logistics` sin permisos definidos

El módulo de logística (transporte de hidrocarburos) existe y usa permisos `logistics:*` en las rutas, pero **NO están definidos en el seeder**.

```javascript
// logisticsRoutes.js usa estos permisos:
authorize('logistics:read')
authorize('logistics:create')
authorize('logistics:update')
authorize('logistics:delete')
authorize('logistics:approve')
```

**Impacto:** Nadie puede acceder al módulo de logística excepto Super Admin.

### 2. Permisos granulares faltantes en módulos O&G

Los módulos de producción, AFE, contratos, etc. tienen permisos básicos pero les faltan permisos granulares para:
- Ver tabs específicos (producción diaria, pozos, campos)
- Acciones especializadas (verificar producción, cerrar AFE)

### 3. Roles especializados O&G faltantes

Para una empresa petrolera, faltan roles específicos:
- **Ingeniero de Producción** - Solo producción y pozos
- **Coordinador HSE** - HSE + PTW
- **Analista de Reservas** - Solo reservas
- **Coordinador de Logística** - Transporte de crudo
- **Analista de Contratos** - Contratos y JIB
- **Almacenista** - Solo movimientos de inventario

### 4. Permisos de inventario incompletos

Falta un permiso para **solo ver stock** sin poder hacer movimientos:
- `inventory:read:stock` - Ver niveles de stock
- `inventory:read:movements` - Ver historial de movimientos

### 5. Roles no tienen permisos de módulos nuevos

Los roles existentes no incluyen permisos para:
- `logistics:*` (nadie lo tiene)
- `crm:*` (solo Gerente General debería tenerlo)
- `quality:*` (Gerente de Operaciones debería tenerlo)

---

## ✅ Mejoras Propuestas

### 1. Agregar permisos de Logística

```javascript
logistics: [
  { code: 'logistics:*', name: 'Logística - Acceso Completo', ... },
  { code: 'logistics:read', name: 'Ver Logística', ... },
  { code: 'logistics:read:tanks', name: 'Ver Tanques', field: 'tanks', ... },
  { code: 'logistics:read:tickets', name: 'Ver Tickets de Carga', field: 'tickets', ... },
  { code: 'logistics:read:quality', name: 'Ver Calidad de Crudo', field: 'quality', ... },
  { code: 'logistics:read:pipelines', name: 'Ver Ductos', field: 'pipelines', ... },
  { code: 'logistics:create', name: 'Crear en Logística', ... },
  { code: 'logistics:update', name: 'Editar en Logística', ... },
  { code: 'logistics:delete', name: 'Eliminar en Logística', ... },
  { code: 'logistics:approve', name: 'Aprobar Calidad', ... },
  { code: 'logistics:gauging', name: 'Registrar Mediciones', ... },
]
```

### 2. Permisos granulares para Producción

```javascript
production: [
  // Existentes...
  { code: 'production:read:fields', name: 'Ver Campos', field: 'fields', ... },
  { code: 'production:read:wells', name: 'Ver Pozos', field: 'wells', ... },
  { code: 'production:read:daily', name: 'Ver Producción Diaria', field: 'daily', ... },
  { code: 'production:read:allocations', name: 'Ver Allocations', field: 'allocations', ... },
  { code: 'production:read:logs', name: 'Ver Bitácoras', field: 'logs', ... },
  { code: 'production:verify', name: 'Verificar Producción', action: 'verify', ... },
  { code: 'production:export', name: 'Exportar Producción', action: 'export', ... },
]
```

### 3. Permisos granulares para Inventario

```javascript
inventory: [
  // Existentes...
  { code: 'inventory:read:stock', name: 'Ver Stock', field: 'stock', ... },
  { code: 'inventory:read:movements', name: 'Ver Movimientos', field: 'movements', ... },
  { code: 'inventory:read:warehouses', name: 'Ver Almacenes', field: 'warehouses', ... },
  { code: 'inventory:approve', name: 'Aprobar Ajustes', action: 'approve', ... },
  { code: 'inventory:export', name: 'Exportar Inventario', action: 'export', ... },
]
```

### 4. Nuevos Roles Especializados O&G

```javascript
'Ingeniero de Producción': {
  description: 'Gestión de producción y pozos',
  isSystemRole: true,
  permissions: [
    'production:*',
    'reserves:read',
    'logistics:read', 'logistics:gauging',
    'hse:read', 'hse:create',
    'ptw:read', 'ptw:create',
    'reports:dashboard',
  ],
},

'Coordinador HSE': {
  description: 'Seguridad industrial y permisos de trabajo',
  isSystemRole: true,
  permissions: [
    'hse:*',
    'ptw:*',
    'quality:read', 'quality:create',
    'employees:read:personal',
    'projects:read',
    'reports:dashboard',
  ],
},

'Coordinador de Logística': {
  description: 'Transporte y almacenamiento de hidrocarburos',
  isSystemRole: true,
  permissions: [
    'logistics:*',
    'production:read',
    'inventory:read', 'inventory:movement',
    'fleet:read', 'fleet:fuel',
    'reports:dashboard',
  ],
},

'Almacenista': {
  description: 'Gestión de almacén e inventario',
  isSystemRole: true,
  permissions: [
    'inventory:read', 'inventory:movement', 'inventory:transfer',
    'inventory:read:stock', 'inventory:read:movements', 'inventory:read:warehouses',
    'procurement:read', 'procurement:receive',
    'reports:inventory',
  ],
},

'Analista de Contratos': {
  description: 'Gestión de contratos O&G y JIB',
  isSystemRole: true,
  permissions: [
    'contracts:*',
    'jib:*',
    'afe:read',
    'crm:read',
    'finance:read',
    'reports:dashboard',
  ],
},

'Analista de Reservas': {
  description: 'Estimación y valoración de reservas',
  isSystemRole: true,
  permissions: [
    'reserves:*',
    'production:read',
    'contracts:read',
    'reports:dashboard',
  ],
},

'Ejecutivo Comercial': {
  description: 'Gestión comercial y CRM',
  isSystemRole: true,
  permissions: [
    'crm:*',
    'projects:read',
    'contractors:read',
    'documents:read', 'documents:create',
    'reports:dashboard',
  ],
},

'Inspector de Calidad': {
  description: 'Control de calidad e inspecciones',
  isSystemRole: true,
  permissions: [
    'quality:*',
    'projects:read',
    'hse:read',
    'documents:read', 'documents:create',
    'reports:dashboard',
  ],
},
```

### 5. Actualizar Roles Existentes

**Gerente General** - Agregar:
```javascript
'logistics:read', 'logistics:approve',
'crm:read',
'quality:read', 'quality:approve',
```

**Gerente de Operaciones** - Agregar:
```javascript
'logistics:*',
'quality:*',
'ptw:*',
'jib:read',
```

**Contador** - Agregar:
```javascript
'jib:read', 'jib:update', // Para registrar pagos
'contracts:read', // Para ver regalías
```

**Supervisor de Proyecto** - Agregar:
```javascript
'quality:read', 'quality:create',
'ptw:read', 'ptw:create',
'production:read',
```

---

## 📋 Permisos de Reportes Faltantes

```javascript
reports: [
  // Existentes...
  { code: 'reports:production', name: 'Reportes de Producción', ... },
  { code: 'reports:hse', name: 'Reportes de HSE', ... },
  { code: 'reports:quality', name: 'Reportes de Calidad', ... },
  { code: 'reports:logistics', name: 'Reportes de Logística', ... },
  { code: 'reports:contracts', name: 'Reportes de Contratos', ... },
  { code: 'reports:reserves', name: 'Reportes de Reservas', ... },
  { code: 'reports:crm', name: 'Reportes de CRM', ... },
]
```

---

## 🔧 Implementación Recomendada

### Paso 1: Actualizar `permissions-granular.js`

Agregar los permisos faltantes de `logistics` y los permisos granulares adicionales.

### Paso 2: Agregar nuevos roles

Agregar los 8 roles especializados propuestos.

### Paso 3: Actualizar roles existentes

Agregar los permisos de módulos nuevos a los roles existentes.

### Paso 4: Ejecutar seed

```bash
cd backend
node src/database/seed.js
```

### Paso 5: Verificar en BD

```sql
SELECT COUNT(*) FROM permissions;
SELECT COUNT(*) FROM roles;
SELECT r.name, COUNT(rp.permission_id) as permisos
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name;
```

---

## 📊 Resumen de Cambios

| Tipo | Actual | Propuesto | Diferencia |
|------|--------|-----------|------------|
| Permisos | ~150 | ~180 | +30 |
| Roles | 7 | 15 | +8 |
| Módulos con permisos | 22 | 23 | +1 (logistics) |

---

## ⚠️ Consideraciones

1. **Migración de usuarios existentes**: Los usuarios con roles actuales seguirán funcionando. Los nuevos roles son adicionales.

2. **Permisos granulares opcionales**: Los permisos de campo (`:field`) son opcionales. Si un usuario tiene `module:action`, automáticamente tiene acceso a todos los campos.

3. **Roles personalizados**: El sistema permite crear roles personalizados desde la UI. Los roles del sistema (`isSystemRole: true`) no pueden ser eliminados.

4. **Auditoría**: Todos los cambios de permisos quedan registrados en `audit_logs`.
