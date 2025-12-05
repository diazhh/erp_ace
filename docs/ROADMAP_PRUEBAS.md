# 🧪 ROADMAP DE PRUEBAS - Sistema ERP

**Última actualización:** 2025-12-05
**Versión:** 1.0.0

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Estrategia General](#estrategia-general)
3. [Usuarios de Prueba](#usuarios-de-prueba)
4. [Pruebas por Módulo](#pruebas-por-módulo)
   - [Autenticación y Usuarios](#módulo-1-autenticación-y-usuarios)
   - [Empleados](#módulo-2-empleados)
   - [Nómina](#módulo-3-nómina)
   - [Finanzas](#módulo-4-finanzas)
   - [Caja Chica](#módulo-5-caja-chica)
   - [Proyectos](#módulo-6-proyectos)
   - [Inventario](#módulo-7-inventario)
   - [Flota](#módulo-8-flota)
   - [Procura](#módulo-9-procura)
   - [HSE](#módulo-10-hse)
   - [Documentos](#módulo-11-documentos)
5. [Plan de Ejecución](#plan-de-ejecución)
6. [Herramientas y Configuración](#herramientas-y-configuración)

---

## 🎯 Introducción

Este documento describe el plan completo de pruebas para el Sistema ERP, abarcando:

- **Pruebas Unitarias**: Funciones, servicios y lógica de negocio
- **Pruebas de Integración**: Interacción entre módulos y base de datos
- **Pruebas de API**: Endpoints REST con diferentes roles y permisos

### Objetivos

✅ Garantizar que cada funcionalidad del sistema opere correctamente
✅ Validar que los permisos y roles funcionen según lo diseñado
✅ Verificar integridad de datos y transacciones
✅ Asegurar que las validaciones de negocio se cumplan
✅ Detectar errores antes de producción

---

## 📊 Estrategia General

### Pirámide de Pruebas

```
         ┌─────────────────┐
         │   API Tests     │  ← Menor cantidad, mayor cobertura funcional
         │    (30%)        │
         ├─────────────────┤
         │  Integration    │  ← Pruebas de módulos completos
         │    Tests        │
         │    (30%)        │
         ├─────────────────┤
         │   Unit Tests    │  ← Mayor cantidad, menor alcance
         │    (40%)        │
         └─────────────────┘
```

### Niveles de Prueba

#### 1. Pruebas Unitarias (40%)
- Probar funciones individuales en servicios
- Validar cálculos (nómina, deducciones, stock, costos)
- Probar helpers y utilidades
- Mock de dependencias externas
- **Framework**: Jest
- **Ubicación**: `backend/src/modules/*/tests/*.test.js`

#### 2. Pruebas de Integración (30%)
- Probar flujos completos entre módulos
- Validar interacciones con la base de datos
- Probar transacciones complejas
- Verificar integridad referencial
- **Framework**: Jest + Sequelize
- **Base de datos**: PostgreSQL de prueba

#### 3. Pruebas de API (30%)
- Probar cada endpoint con diferentes roles
- Validar autenticación y autorización
- Probar CRUD completo de cada entidad
- Validar códigos de estado HTTP
- Validar formato de respuestas
- **Framework**: Supertest + Jest
- **Enfoque**: Autenticación real con JWT

### Cobertura Esperada

- **Código**: Mínimo 70%
- **Endpoints críticos**: 100%
- **Servicios de negocio**: 90%
- **Controladores**: 80%

---

## 👥 Usuarios de Prueba

### Usuarios con Roles Definidos

Cada usuario tendrá un conjunto específico de permisos para probar diferentes escenarios de autorización.

#### 1. Super Administrador
```json
{
  "username": "superadmin",
  "password": "SuperAdmin123!",
  "email": "superadmin@test.com",
  "roles": ["Super Administrador"],
  "permisos": ["*:*"]
}
```
**Pruebas**: Acceso completo a todos los módulos y acciones.

---

#### 2. Gerente General
```json
{
  "username": "gerente.general",
  "password": "Gerente123!",
  "email": "gerente.general@test.com",
  "roles": ["Gerente General"],
  "permisos": [
    "employees:read", "employees:read:*",
    "payroll:read", "payroll:approve",
    "finance:read", "finance:approve",
    "projects:read", "projects:approve",
    "inventory:read", "fleet:read",
    "procurement:read", "procurement:approve",
    "hse:read", "documents:read"
  ]
}
```
**Pruebas**: Lectura completa, aprobaciones, pero sin edición directa.

---

#### 3. Gerente Administrativo
```json
{
  "username": "gerente.admin",
  "password": "GerenteAdmin123!",
  "email": "gerente.admin@test.com",
  "roles": ["Gerente Administrativo"],
  "permisos": [
    "employees:*", "payroll:*", "finance:*",
    "petty_cash:*", "documents:*"
  ]
}
```
**Pruebas**: CRUD completo en RRHH, Finanzas, Nómina.

---

#### 4. Contador
```json
{
  "username": "contador",
  "password": "Contador123!",
  "email": "contador@test.com",
  "roles": ["Contador"],
  "permisos": [
    "finance:*", "payroll:read", "payroll:pay",
    "petty_cash:read", "petty_cash:approve",
    "projects:read", "documents:read"
  ]
}
```
**Pruebas**: Gestión de finanzas, pago de nómina, aprobación de caja chica.

---

#### 5. Jefe de RRHH
```json
{
  "username": "jefe.rrhh",
  "password": "RRHH123!",
  "email": "jefe.rrhh@test.com",
  "roles": ["Jefe de RRHH"],
  "permisos": [
    "employees:*", "payroll:*",
    "documents:read", "documents:read:employees"
  ]
}
```
**Pruebas**: Gestión de empleados, nómina, préstamos.

---

#### 6. Gerente de Operaciones
```json
{
  "username": "gerente.ops",
  "password": "GerenteOps123!",
  "email": "gerente.ops@test.com",
  "roles": ["Gerente de Operaciones"],
  "permisos": [
    "projects:*", "inventory:*", "fleet:*",
    "hse:*", "procurement:read", "procurement:approve"
  ]
}
```
**Pruebas**: Gestión de proyectos, inventario, flota, HSE.

---

#### 7. Supervisor de Proyecto
```json
{
  "username": "supervisor.proyecto",
  "password": "Supervisor123!",
  "email": "supervisor.proyecto@test.com",
  "roles": ["Supervisor de Proyecto"],
  "permisos": [
    "projects:read", "projects:read:assigned",
    "projects:update:assigned",
    "inventory:read", "fleet:read",
    "petty_cash:create", "documents:read"
  ]
}
```
**Pruebas**: Acceso solo a proyectos asignados, solicitar recursos.

---

#### 8. Empleado Regular
```json
{
  "username": "empleado.regular",
  "password": "Empleado123!",
  "email": "empleado.regular@test.com",
  "roles": ["Empleado"],
  "permisos": [
    "employees:read:own",
    "payroll:read:own",
    "loans:create",
    "petty_cash:create",
    "documents:read:own"
  ]
}
```
**Pruebas**: Acceso solo a su propia información, solicitar préstamos.

---

#### 9. Usuario Sin Permisos
```json
{
  "username": "sin.permisos",
  "password": "NoPermiso123!",
  "email": "sin.permisos@test.com",
  "roles": [],
  "permisos": []
}
```
**Pruebas**: Validar que NO puede acceder a ningún recurso (403).

---

### Script de Creación de Usuarios

```bash
# backend/tests/setup/create-test-users.sh
#!/bin/bash

BASE_URL="http://localhost:5000/api"
ADMIN_TOKEN=""

# Login como superadmin inicial
login_admin() {
  ADMIN_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin123!"}' | jq -r '.data.token')
  echo "✓ Admin token obtenido"
}

# Crear usuario de prueba
create_user() {
  local username=$1
  local password=$2
  local email=$3
  local role_ids=$4

  curl -s -X POST $BASE_URL/users \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"$username\",
      \"password\": \"$password\",
      \"email\": \"$email\",
      \"isActive\": true,
      \"roleIds\": $role_ids
    }" | jq '.'

  echo "✓ Usuario $username creado"
}

# Ejecutar
login_admin

create_user "gerente.general" "Gerente123!" "gerente.general@test.com" "[2]"
create_user "gerente.admin" "GerenteAdmin123!" "gerente.admin@test.com" "[3]"
create_user "contador" "Contador123!" "contador@test.com" "[4]"
create_user "jefe.rrhh" "RRHH123!" "jefe.rrhh@test.com" "[5]"
create_user "gerente.ops" "GerenteOps123!" "gerente.ops@test.com" "[6]"
create_user "supervisor.proyecto" "Supervisor123!" "supervisor.proyecto@test.com" "[7]"
create_user "empleado.regular" "Empleado123!" "empleado.regular@test.com" "[8]"

echo ""
echo "✅ Usuarios de prueba creados exitosamente"
```

---

## 🧩 Pruebas por Módulo

---

## MÓDULO 1: Autenticación y Usuarios

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/auth/me` | Obtener usuario actual | Autenticado |
| POST | `/api/auth/logout` | Cerrar sesión | Autenticado |
| POST | `/api/auth/change-password` | Cambiar contraseña | Autenticado |
| GET | `/api/users` | Listar usuarios | `users:read` |
| GET | `/api/users/stats` | Estadísticas de usuarios | `users:read` |
| GET | `/api/users/:id` | Obtener usuario | `users:read` |
| POST | `/api/users` | Crear usuario | `users:create` |
| PUT | `/api/users/:id` | Actualizar usuario | `users:update` |
| DELETE | `/api/users/:id` | Eliminar usuario | `users:delete` |
| PUT | `/api/users/:id/toggle-active` | Activar/Desactivar | `users:update` |
| POST | `/api/users/:id/reset-password` | Resetear contraseña | `users:reset_password` |
| POST | `/api/users/:id/roles` | Asignar roles | `users:update` |
| GET | `/api/roles` | Listar roles | `roles:read` |
| GET | `/api/roles/:id` | Obtener rol | `roles:read` |
| POST | `/api/roles` | Crear rol | `roles:create` |
| PUT | `/api/roles/:id` | Actualizar rol | `roles:update` |
| DELETE | `/api/roles/:id` | Eliminar rol | `roles:delete` |
| POST | `/api/roles/:id/permissions` | Asignar permisos | `roles:update` |

### Pruebas Unitarias

```javascript
// backend/src/modules/auth/tests/auth.service.test.js

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('debe hashear la contraseña correctamente', async () => {});
    it('debe generar hashes diferentes para la misma contraseña', async () => {});
  });

  describe('comparePassword', () => {
    it('debe validar contraseña correcta', async () => {});
    it('debe rechazar contraseña incorrecta', async () => {});
  });

  describe('generateToken', () => {
    it('debe generar un JWT válido', () => {});
    it('debe incluir userId y username en el payload', () => {});
  });

  describe('validateToken', () => {
    it('debe validar un token válido', () => {});
    it('debe rechazar un token expirado', () => {});
    it('debe rechazar un token inválido', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/auth/tests/auth.integration.test.js

describe('Auth Integration Tests', () => {
  describe('User Creation and Login Flow', () => {
    it('debe crear usuario y hacer login exitosamente', async () => {});
    it('debe asignar roles correctamente al crear usuario', async () => {});
    it('debe heredar permisos de los roles asignados', async () => {});
  });

  describe('Password Management', () => {
    it('debe cambiar contraseña exitosamente', async () => {});
    it('debe hashear la nueva contraseña', async () => {});
    it('debe rechazar cambio con contraseña actual incorrecta', async () => {});
  });

  describe('Role Permission Cascade', () => {
    it('debe actualizar permisos del usuario al cambiar permisos del rol', async () => {});
    it('debe revocar permisos al remover rol del usuario', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/auth/tests/auth.api.test.js

describe('Auth API Tests', () => {
  describe('POST /api/auth/login', () => {
    it('[PÚBLICO] debe permitir login con credenciales válidas', async () => {});
    it('[PÚBLICO] debe retornar 401 con credenciales inválidas', async () => {});
    it('[PÚBLICO] debe retornar token JWT en la respuesta', async () => {});
    it('[PÚBLICO] debe retornar datos del usuario (sin password)', async () => {});
    it('[PÚBLICO] debe actualizar lastLogin del usuario', async () => {});
  });

  describe('GET /api/auth/me', () => {
    it('[AUTENTICADO] debe retornar datos del usuario actual', async () => {});
    it('[AUTENTICADO] debe incluir roles y permisos', async () => {});
    it('[NO AUTH] debe retornar 401 sin token', async () => {});
  });

  describe('POST /api/auth/change-password', () => {
    it('[AUTENTICADO] debe cambiar contraseña exitosamente', async () => {});
    it('[AUTENTICADO] debe rechazar contraseña débil', async () => {});
    it('[AUTENTICADO] debe rechazar si contraseña actual es incorrecta', async () => {});
  });

  describe('GET /api/users', () => {
    it('[SUPERADMIN] debe listar todos los usuarios', async () => {});
    it('[GERENTE GENERAL] debe listar usuarios con paginación', async () => {});
    it('[EMPLEADO] debe retornar 403', async () => {});
  });

  describe('POST /api/users', () => {
    it('[SUPERADMIN] debe crear usuario con roles', async () => {});
    it('[SUPERADMIN] debe hashear la contraseña', async () => {});
    it('[SUPERADMIN] debe validar campos requeridos', async () => {});
    it('[CONTADOR] debe retornar 403', async () => {});
  });

  describe('PUT /api/users/:id', () => {
    it('[SUPERADMIN] debe actualizar usuario', async () => {});
    it('[EMPLEADO] NO debe poder editar otro usuario', async () => {});
  });

  describe('DELETE /api/users/:id', () => {
    it('[SUPERADMIN] debe eliminar usuario', async () => {});
    it('[GERENTE ADMIN] debe retornar 403', async () => {});
  });

  describe('POST /api/users/:id/roles', () => {
    it('[SUPERADMIN] debe asignar roles a usuario', async () => {});
    it('[SUPERADMIN] debe remover roles no incluidos', async () => {});
  });

  describe('GET /api/roles', () => {
    it('[SUPERADMIN] debe listar todos los roles', async () => {});
    it('[GERENTE GENERAL] debe listar roles', async () => {});
  });

  describe('POST /api/roles', () => {
    it('[SUPERADMIN] debe crear rol con permisos', async () => {});
    it('[GERENTE ADMIN] debe retornar 403', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~35 pruebas

---

## MÓDULO 2: Empleados

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/employees` | Listar empleados | `employees:read` |
| GET | `/api/employees/stats` | Estadísticas | `employees:read` |
| GET | `/api/employees/expiring-documents` | Docs por vencer | `employees:read` |
| GET | `/api/employees/:id` | Obtener empleado | `employees:read` |
| GET | `/api/employees/:id/full` | Detalle completo | `employees:read` |
| POST | `/api/employees` | Crear empleado | `employees:create` |
| PUT | `/api/employees/:id` | Actualizar empleado | `employees:update` |
| DELETE | `/api/employees/:id` | Eliminar empleado | `employees:delete` |

### Pruebas Unitarias

```javascript
// backend/src/modules/employees/tests/employee.service.test.js

describe('EmployeeService', () => {
  describe('generateEmployeeCode', () => {
    it('debe generar código con formato EMP-XXXX', () => {});
    it('debe generar códigos únicos secuenciales', () => {});
  });

  describe('calculateAge', () => {
    it('debe calcular edad correctamente', () => {});
    it('debe manejar años bisiestos', () => {});
  });

  describe('calculateSeniority', () => {
    it('debe calcular antigüedad en años y meses', () => {});
  });

  describe('validateIdNumber', () => {
    it('debe validar formato de cédula venezolana', () => {});
    it('debe rechazar formato inválido', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/employees/tests/employee.integration.test.js

describe('Employee Integration Tests', () => {
  describe('Employee-User Relationship', () => {
    it('debe vincular empleado con usuario al crear', async () => {});
    it('debe obtener usuario desde empleado', async () => {});
  });

  describe('Employee-Department Relationship', () => {
    it('debe asignar departamento al empleado', async () => {});
    it('debe listar empleados por departamento', async () => {});
  });

  describe('Employee-Supervisor Hierarchy', () => {
    it('debe establecer jerarquía supervisor-subordinado', async () => {});
    it('debe listar subordinados de un supervisor', async () => {});
  });

  describe('Bank Accounts', () => {
    it('debe crear múltiples cuentas bancarias para un empleado', async () => {});
    it('debe establecer cuenta primaria', async () => {});
    it('debe validar suma de porcentajes = 100%', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/employees/tests/employee.api.test.js

describe('Employees API Tests', () => {
  describe('GET /api/employees', () => {
    it('[SUPERADMIN] debe listar todos los empleados', async () => {});
    it('[JEFE RRHH] debe listar con paginación', async () => {});
    it('[JEFE RRHH] debe filtrar por búsqueda (nombre, cédula)', async () => {});
    it('[JEFE RRHH] debe filtrar por status (activo, inactivo)', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('GET /api/employees/stats', () => {
    it('[JEFE RRHH] debe retornar estadísticas correctas', async () => {});
    it('[JEFE RRHH] debe incluir total, activos, inactivos', async () => {});
  });

  describe('GET /api/employees/:id', () => {
    it('[JEFE RRHH] debe retornar empleado con datos básicos', async () => {});
    it('[EMPLEADO REGULAR] puede ver su propio perfil', async () => {});
    it('[EMPLEADO REGULAR] NO puede ver perfil de otro empleado', async () => {});
  });

  describe('GET /api/employees/:id/full', () => {
    it('[JEFE RRHH] debe incluir cuentas bancarias', async () => {});
    it('[JEFE RRHH] debe incluir supervisor y subordinados', async () => {});
    it('[JEFE RRHH] debe incluir departamento y posición', async () => {});
  });

  describe('POST /api/employees', () => {
    it('[JEFE RRHH] debe crear empleado con datos válidos', async () => {});
    it('[JEFE RRHH] debe generar código automáticamente', async () => {});
    it('[JEFE RRHH] debe validar campos requeridos', async () => {});
    it('[JEFE RRHH] debe validar formato de email', async () => {});
    it('[JEFE RRHH] debe validar unicidad de cédula', async () => {});
    it('[CONTADOR] debe retornar 403', async () => {});
  });

  describe('PUT /api/employees/:id', () => {
    it('[JEFE RRHH] debe actualizar empleado', async () => {});
    it('[JEFE RRHH] debe validar datos al actualizar', async () => {});
    it('[EMPLEADO REGULAR] NO puede actualizar', async () => {});
  });

  describe('DELETE /api/employees/:id', () => {
    it('[SUPERADMIN] debe eliminar empleado', async () => {});
    it('[JEFE RRHH] debe poder eliminar empleado', async () => {});
    it('[JEFE RRHH] debe validar que no tenga nóminas activas', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~25 pruebas

---

## MÓDULO 3: Nómina

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/payroll/stats` | Estadísticas | `payroll:read` |
| GET | `/api/payroll/periods` | Listar períodos | `payroll:read` |
| GET | `/api/payroll/periods/:id` | Obtener período | `payroll:read` |
| GET | `/api/payroll/periods/:id/full` | Detalle completo | `payroll:read` |
| POST | `/api/payroll/periods` | Crear período | `payroll:create` |
| PUT | `/api/payroll/periods/:id` | Actualizar período | `payroll:update` |
| DELETE | `/api/payroll/periods/:id` | Eliminar período | `payroll:delete` |
| POST | `/api/payroll/periods/:id/generate` | Generar entradas | `payroll:create` |
| POST | `/api/payroll/periods/:id/approve` | Aprobar período | `payroll:approve` |
| POST | `/api/payroll/periods/:id/pay` | Marcar como pagado | `payroll:pay` |
| GET | `/api/payroll/entries/:id` | Obtener entrada | `payroll:read` |
| PUT | `/api/payroll/entries/:id` | Actualizar entrada | `payroll:update` |
| GET | `/api/payroll/loans` | Listar préstamos | `payroll:read` |
| GET | `/api/payroll/loans/:id` | Obtener préstamo | `payroll:read` |
| POST | `/api/payroll/loans` | Crear préstamo | `payroll:create` |
| POST | `/api/payroll/loans/:id/approve` | Aprobar préstamo | `payroll:approve` |
| POST | `/api/payroll/loans/:id/cancel` | Cancelar préstamo | `payroll:update` |

### Pruebas Unitarias

```javascript
// backend/src/modules/payroll/tests/payroll.service.test.js

describe('PayrollService', () => {
  describe('calculateGrossSalary', () => {
    it('debe calcular salario base + bonos', () => {});
    it('debe manejar salario cero', () => {});
  });

  describe('calculateDeductions - Venezuela', () => {
    it('debe calcular SSO (4%)', () => {});
    it('debe calcular RPE (0.5%)', () => {});
    it('debe calcular FAOV (1%)', () => {});
    it('debe calcular ISLR según tabla progresiva', () => {});
    it('NO debe calcular ISLR si salario < umbral', () => {});
  });

  describe('calculateLoanDeduction', () => {
    it('debe calcular cuota de préstamo', () => {});
    it('debe limitar descuento al saldo pendiente', () => {});
    it('debe manejar última cuota parcial', () => {});
  });

  describe('calculateNetSalary', () => {
    it('debe restar todas las deducciones del bruto', () => {});
    it('debe retornar salario neto correcto', () => {});
  });

  describe('generatePayrollPeriodCode', () => {
    it('debe generar código con formato PAY-YYYYMM-XXX', () => {});
  });

  describe('calculateLoanInterest', () => {
    it('debe calcular interés simple', () => {});
    it('debe manejar préstamos sin interés', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/payroll/tests/payroll.integration.test.js

describe('Payroll Integration Tests', () => {
  describe('Period Creation and Entry Generation', () => {
    it('debe crear período de nómina', async () => {});
    it('debe generar entradas para todos los empleados activos', async () => {});
    it('debe calcular salarios correctamente', async () => {});
    it('NO debe incluir empleados inactivos', async () => {});
  });

  describe('Loan Deduction Integration', () => {
    it('debe descontar cuota de préstamo en nómina', async () => {});
    it('debe crear LoanPayment al generar nómina', async () => {});
    it('debe actualizar saldo pendiente del préstamo', async () => {});
    it('debe marcar préstamo como pagado al última cuota', async () => {});
  });

  describe('Payroll Approval Flow', () => {
    it('debe cambiar estado a APPROVED al aprobar', async () => {});
    it('debe registrar quien aprobó y cuándo', async () => {});
    it('NO debe permitir aprobar período ya aprobado', async () => {});
  });

  describe('Payment Flow', () => {
    it('debe marcar período como PAID', async () => {});
    it('debe crear transacciones en Finance al marcar como pagado', async () => {});
    it('debe distribuir pago en múltiples cuentas bancarias de empleado', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/payroll/tests/payroll.api.test.js

describe('Payroll API Tests', () => {
  describe('GET /api/payroll/periods', () => {
    it('[JEFE RRHH] debe listar períodos de nómina', async () => {});
    it('[JEFE RRHH] debe filtrar por estado', async () => {});
    it('[CONTADOR] debe poder listar períodos', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/payroll/periods', () => {
    it('[JEFE RRHH] debe crear período de nómina', async () => {});
    it('[JEFE RRHH] debe validar que no exista período solapado', async () => {});
    it('[CONTADOR] debe retornar 403', async () => {});
  });

  describe('POST /api/payroll/periods/:id/generate', () => {
    it('[JEFE RRHH] debe generar entradas para todos los empleados', async () => {});
    it('[JEFE RRHH] debe calcular deducciones correctamente', async () => {});
    it('[JEFE RRHH] debe descontar préstamos activos', async () => {});
  });

  describe('POST /api/payroll/periods/:id/approve', () => {
    it('[JEFE RRHH] debe aprobar período', async () => {});
    it('[GERENTE GENERAL] debe poder aprobar', async () => {});
    it('[CONTADOR] NO debe poder aprobar', async () => {});
  });

  describe('POST /api/payroll/periods/:id/pay', () => {
    it('[CONTADOR] debe marcar como pagado', async () => {});
    it('[JEFE RRHH] debe poder marcar como pagado', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('GET /api/payroll/loans', () => {
    it('[JEFE RRHH] debe listar todos los préstamos', async () => {});
    it('[EMPLEADO REGULAR] solo debe ver sus préstamos', async () => {});
    it('[JEFE RRHH] debe filtrar por estado', async () => {});
  });

  describe('POST /api/payroll/loans', () => {
    it('[JEFE RRHH] debe crear préstamo', async () => {});
    it('[EMPLEADO REGULAR] puede crear préstamo', async () => {});
    it('[EMPLEADO REGULAR] debe validar monto máximo permitido', async () => {});
    it('[JEFE RRHH] debe validar campos requeridos', async () => {});
  });

  describe('POST /api/payroll/loans/:id/approve', () => {
    it('[JEFE RRHH] debe aprobar préstamo', async () => {});
    it('[GERENTE GENERAL] debe poder aprobar', async () => {});
    it('[EMPLEADO REGULAR] NO debe poder aprobar', async () => {});
  });

  describe('POST /api/payroll/loans/:id/cancel', () => {
    it('[JEFE RRHH] debe cancelar préstamo', async () => {});
    it('[JEFE RRHH] NO debe cancelar préstamo con pagos realizados', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~40 pruebas

---

## MÓDULO 4: Finanzas

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/finance/stats` | Estadísticas | `finance:read` |
| GET | `/api/finance/cash-flow` | Flujo de caja | `finance:read` |
| GET | `/api/finance/accounts` | Listar cuentas | `finance:read` |
| GET | `/api/finance/accounts/:id` | Obtener cuenta | `finance:read` |
| GET | `/api/finance/accounts/:id/full` | Detalle completo | `finance:read` |
| POST | `/api/finance/accounts` | Crear cuenta | `finance:create` |
| PUT | `/api/finance/accounts/:id` | Actualizar cuenta | `finance:update` |
| DELETE | `/api/finance/accounts/:id` | Eliminar cuenta | `finance:delete` |
| GET | `/api/finance/transactions` | Listar transacciones | `finance:read` |
| GET | `/api/finance/transactions/:id` | Obtener transacción | `finance:read` |
| POST | `/api/finance/transactions` | Crear transacción | `finance:create` |
| PUT | `/api/finance/transactions/:id` | Actualizar transacción | `finance:update` |
| POST | `/api/finance/transactions/:id/cancel` | Cancelar transacción | `finance:update` |
| POST | `/api/finance/transfers` | Crear transferencia | `finance:create` |
| POST | `/api/finance/transactions/:id/reconcile` | Reconciliar | `finance:approve` |
| POST | `/api/finance/reconcile/bulk` | Reconciliación masiva | `finance:approve` |
| GET | `/api/finance/exchange-rates` | Listar tasas | `finance:read` |
| GET | `/api/finance/exchange-rates/current` | Tasa actual | `finance:read` |
| POST | `/api/finance/exchange-rates` | Crear tasa | `finance:create` |
| GET | `/api/finance/categories` | Listar categorías | `finance:read` |
| POST | `/api/finance/categories` | Crear categoría | `finance:create` |

### Pruebas Unitarias

```javascript
// backend/src/modules/finance/tests/finance.service.test.js

describe('FinanceService', () => {
  describe('calculateBalance', () => {
    it('debe calcular saldo con ingresos y gastos', () => {});
    it('debe manejar cuenta sin transacciones (saldo = 0)', () => {});
  });

  describe('convertCurrency', () => {
    it('debe convertir USD a VES según tasa', () => {});
    it('debe convertir VES a USD', () => {});
    it('debe manejar misma moneda (retornar igual)', () => {});
  });

  describe('validateBalance', () => {
    it('debe validar que cuenta tenga saldo suficiente', () => {});
    it('debe rechazar si saldo insuficiente', () => {});
  });

  describe('calculateCashFlow', () => {
    it('debe agrupar ingresos y gastos por mes', () => {});
    it('debe calcular balance neto por mes', () => {});
  });

  describe('generateTransactionCode', () => {
    it('debe generar código con formato TRX-YYYYMMDD-XXX', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/finance/tests/finance.integration.test.js

describe('Finance Integration Tests', () => {
  describe('Account and Transaction Flow', () => {
    it('debe crear cuenta bancaria', async () => {});
    it('debe crear transacción de ingreso y actualizar saldo', async () => {});
    it('debe crear transacción de gasto y restar saldo', async () => {});
    it('debe calcular saldo correctamente con múltiples transacciones', async () => {});
  });

  describe('Transfer Between Accounts', () => {
    it('debe transferir entre cuentas misma moneda', async () => {});
    it('debe restar de cuenta origen y sumar a cuenta destino', async () => {});
    it('debe crear 2 transacciones vinculadas', async () => {});
    it('debe convertir moneda en transferencia USD->VES', async () => {});
  });

  describe('Multi-Currency Handling', () => {
    it('debe manejar cuentas en USD, VES, USDT', async () => {});
    it('debe aplicar tasa de cambio en transferencias', async () => {});
  });

  describe('Transaction Reconciliation', () => {
    it('debe marcar transacción como reconciliada', async () => {});
    it('debe registrar quien reconcilió y cuándo', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/finance/tests/finance.api.test.js

describe('Finance API Tests', () => {
  describe('GET /api/finance/accounts', () => {
    it('[CONTADOR] debe listar todas las cuentas', async () => {});
    it('[GERENTE GENERAL] debe listar cuentas', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/finance/accounts', () => {
    it('[CONTADOR] debe crear cuenta bancaria', async () => {});
    it('[CONTADOR] debe validar campos requeridos', async () => {});
    it('[CONTADOR] debe validar moneda (USD, VES, USDT)', async () => {});
    it('[JEFE RRHH] debe retornar 403', async () => {});
  });

  describe('GET /api/finance/transactions', () => {
    it('[CONTADOR] debe listar transacciones con filtros', async () => {});
    it('[CONTADOR] debe filtrar por tipo (ingreso, gasto)', async () => {});
    it('[CONTADOR] debe filtrar por cuenta', async () => {});
    it('[CONTADOR] debe filtrar por rango de fechas', async () => {});
  });

  describe('POST /api/finance/transactions', () => {
    it('[CONTADOR] debe crear transacción de ingreso', async () => {});
    it('[CONTADOR] debe crear transacción de gasto', async () => {});
    it('[CONTADOR] debe actualizar saldo de la cuenta', async () => {});
    it('[CONTADOR] debe validar saldo suficiente en gastos', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/finance/transfers', () => {
    it('[CONTADOR] debe transferir entre cuentas', async () => {});
    it('[CONTADOR] debe crear 2 transacciones vinculadas', async () => {});
    it('[CONTADOR] debe convertir moneda si necesario', async () => {});
    it('[CONTADOR] debe validar saldo en cuenta origen', async () => {});
  });

  describe('POST /api/finance/transactions/:id/cancel', () => {
    it('[CONTADOR] debe cancelar transacción', async () => {});
    it('[CONTADOR] debe revertir saldo de la cuenta', async () => {});
    it('[CONTADOR] NO debe cancelar transacción reconciliada', async () => {});
  });

  describe('POST /api/finance/transactions/:id/reconcile', () => {
    it('[CONTADOR] debe reconciliar transacción', async () => {});
    it('[GERENTE GENERAL] debe poder reconciliar', async () => {});
    it('[JEFE RRHH] debe retornar 403', async () => {});
  });

  describe('GET /api/finance/exchange-rates', () => {
    it('[CONTADOR] debe listar tasas de cambio', async () => {});
  });

  describe('POST /api/finance/exchange-rates', () => {
    it('[CONTADOR] debe crear nueva tasa', async () => {});
    it('[CONTADOR] debe validar campos requeridos', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~35 pruebas

---

## MÓDULO 5: Caja Chica

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/petty-cash/stats` | Estadísticas generales | `petty_cash:read` |
| GET | `/api/petty-cash/categories` | Categorías | `petty_cash:read` |
| GET | `/api/petty-cash` | Listar cajas | `petty_cash:read` |
| GET | `/api/petty-cash/:id` | Obtener caja | `petty_cash:read` |
| GET | `/api/petty-cash/:id/full` | Detalle completo | `petty_cash:read` |
| POST | `/api/petty-cash` | Crear caja | `petty_cash:create` |
| PUT | `/api/petty-cash/:id` | Actualizar caja | `petty_cash:update` |
| GET | `/api/petty-cash/:id/stats` | Estadísticas de caja | `petty_cash:read` |
| GET | `/api/petty-cash/:id/entries` | Listar movimientos | `petty_cash:read` |
| POST | `/api/petty-cash/:id/entries` | Crear movimiento | `petty_cash:create` |
| POST | `/api/petty-cash/:id/replenishment` | Reponer caja | `petty_cash:approve` |
| GET | `/api/petty-cash/:id/entries/:entryId` | Obtener movimiento | `petty_cash:read` |
| POST | `/api/petty-cash/:id/entries/:entryId/approve` | Aprobar gasto | `petty_cash:approve` |
| POST | `/api/petty-cash/:id/entries/:entryId/reject` | Rechazar gasto | `petty_cash:approve` |
| POST | `/api/petty-cash/:id/entries/:entryId/cancel` | Cancelar movimiento | `petty_cash:update` |

### Pruebas Unitarias

```javascript
// backend/src/modules/petty-cash/tests/petty-cash.service.test.js

describe('PettyCashService', () => {
  describe('calculateBalance', () => {
    it('debe calcular saldo = inicial + reposiciones - gastos', () => {});
    it('debe manejar caja sin movimientos', () => {});
  });

  describe('validateLimit', () => {
    it('debe validar que gasto no exceda saldo disponible', () => {});
    it('debe rechazar gasto mayor al saldo', () => {});
  });

  describe('calculateReplenishmentAmount', () => {
    it('debe calcular monto a reponer = límite - saldo actual', () => {});
  });

  describe('needsReplenishment', () => {
    it('debe retornar true si saldo < umbral', () => {});
    it('debe retornar false si saldo suficiente', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/petty-cash/tests/petty-cash.integration.test.js

describe('PettyCash Integration Tests', () => {
  describe('Petty Cash Creation and Initialization', () => {
    it('debe crear caja chica con saldo inicial', async () => {});
    it('debe asignar custodio', async () => {});
  });

  describe('Expense Flow', () => {
    it('debe crear gasto pendiente de aprobación', async () => {});
    it('debe actualizar saldo al aprobar gasto', async () => {});
    it('debe vincular gasto con empleado y proyecto', async () => {});
  });

  describe('Replenishment Flow', () => {
    it('debe crear reposición para restaurar fondo', async () => {});
    it('debe actualizar saldo de caja chica', async () => {});
    it('debe crear transacción en Finance', async () => {});
  });

  describe('Approval Workflow', () => {
    it('debe aprobar gasto y cambiar estado', async () => {});
    it('debe rechazar gasto con motivo', async () => {});
    it('NO debe afectar saldo si gasto rechazado', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/petty-cash/tests/petty-cash.api.test.js

describe('PettyCash API Tests', () => {
  describe('GET /api/petty-cash', () => {
    it('[CONTADOR] debe listar todas las cajas chicas', async () => {});
    it('[SUPERVISOR PROYECTO] puede ver cajas de sus proyectos', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/petty-cash', () => {
    it('[GERENTE ADMIN] debe crear caja chica', async () => {});
    it('[GERENTE ADMIN] debe asignar custodio', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/petty-cash/:id/entries', () => {
    it('[SUPERVISOR PROYECTO] debe crear gasto', async () => {});
    it('[EMPLEADO REGULAR] puede crear gasto', async () => {});
    it('[SUPERVISOR] debe validar saldo disponible', async () => {});
    it('[SUPERVISOR] debe validar campos requeridos', async () => {});
  });

  describe('POST /api/petty-cash/:id/entries/:entryId/approve', () => {
    it('[CONTADOR] debe aprobar gasto', async () => {});
    it('[GERENTE ADMIN] debe poder aprobar', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/petty-cash/:id/entries/:entryId/reject', () => {
    it('[CONTADOR] debe rechazar gasto con motivo', async () => {});
    it('[CONTADOR] NO debe afectar saldo al rechazar', async () => {});
  });

  describe('POST /api/petty-cash/:id/replenishment', () => {
    it('[CONTADOR] debe crear reposición', async () => {});
    it('[CONTADOR] debe restaurar saldo al límite', async () => {});
    it('[CONTADOR] debe crear transacción en Finance', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~25 pruebas

---

## MÓDULO 6: Proyectos

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/projects/stats` | Estadísticas | `projects:read` |
| GET | `/api/projects/types` | Catálogo de tipos | `projects:read` |
| GET | `/api/projects` | Listar proyectos | `projects:read` |
| GET | `/api/projects/:id` | Obtener proyecto | `projects:read` |
| GET | `/api/projects/:id/full` | Detalle completo | `projects:read` |
| POST | `/api/projects` | Crear proyecto | `projects:create` |
| PUT | `/api/projects/:id` | Actualizar proyecto | `projects:update` |
| DELETE | `/api/projects/:id` | Eliminar proyecto | `projects:delete` |
| GET | `/api/projects/:id/members` | Listar miembros | `projects:read` |
| POST | `/api/projects/:id/members` | Agregar miembro | `projects:update` |
| PUT | `/api/projects/:id/members/:memberId` | Actualizar miembro | `projects:update` |
| DELETE | `/api/projects/:id/members/:memberId` | Remover miembro | `projects:update` |
| GET | `/api/projects/:id/milestones` | Listar hitos | `projects:read` |
| POST | `/api/projects/:id/milestones` | Crear hito | `projects:update` |
| PUT | `/api/projects/:id/milestones/:milestoneId` | Actualizar hito | `projects:update` |
| POST | `/api/projects/:id/milestones/:milestoneId/complete` | Completar hito | `projects:update` |
| DELETE | `/api/projects/:id/milestones/:milestoneId` | Eliminar hito | `projects:update` |
| GET | `/api/projects/:id/expenses` | Listar gastos | `projects:read` |
| POST | `/api/projects/:id/expenses` | Crear gasto | `projects:create` |
| POST | `/api/projects/:id/expenses/:expenseId/approve` | Aprobar gasto | `projects:approve` |
| POST | `/api/projects/:id/expenses/:expenseId/reject` | Rechazar gasto | `projects:approve` |
| GET | `/api/projects/:id/updates` | Listar actualizaciones | `projects:read` |
| POST | `/api/projects/:id/updates` | Crear actualización | `projects:update` |
| GET | `/api/projects/:id/photos` | Listar fotos | `projects:read` |
| POST | `/api/projects/:id/photos` | Agregar foto | `projects:update` |
| GET | `/api/projects/:id/valuations` | Listar valuaciones | `projects:read` |
| POST | `/api/projects/:id/valuations` | Crear valuación | `projects:update` |
| POST | `/api/projects/:id/valuations/:valuationId/approve` | Aprobar valuación | `projects:approve` |

### Pruebas Unitarias

```javascript
// backend/src/modules/projects/tests/project.service.test.js

describe('ProjectService', () => {
  describe('generateProjectCode', () => {
    it('debe generar PRJ-INT-XXX para proyectos internos', () => {});
    it('debe generar PRJ-CTR-XXX para proyectos contratados', () => {});
  });

  describe('calculateProgress', () => {
    it('debe calcular progreso según hitos completados con peso', () => {});
    it('debe retornar 0 si no hay hitos', () => {});
    it('debe retornar 100 si todos los hitos completados', () => {});
  });

  describe('calculateTotalExpenses', () => {
    it('debe sumar gastos aprobados del proyecto', () => {});
    it('NO debe incluir gastos rechazados', () => {});
  });

  describe('calculateProfitMargin', () => {
    it('debe calcular margen = (presupuesto - gastos) / presupuesto', () => {});
  });

  describe('isOverBudget', () => {
    it('debe retornar true si gastos > presupuesto', () => {});
    it('debe retornar false si gastos <= presupuesto', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/projects/tests/project.integration.test.js

describe('Project Integration Tests', () => {
  describe('Project Creation and Team Assignment', () => {
    it('debe crear proyecto', async () => {});
    it('debe asignar miembros del equipo', async () => {});
    it('debe establecer roles en el proyecto', async () => {});
  });

  describe('Milestone Progress Tracking', () => {
    it('debe crear hitos con peso', async () => {});
    it('debe actualizar progreso al completar hito', async () => {});
    it('debe calcular progreso total del proyecto', async () => {});
  });

  describe('Expense Management', () => {
    it('debe crear gasto del proyecto', async () => {});
    it('debe aprobar gasto y actualizar total gastado', async () => {});
    it('debe alertar si proyecto sobre presupuesto', async () => {});
  });

  describe('Project-Employee Relationship', () => {
    it('debe listar proyectos de un empleado', async () => {});
    it('debe listar empleados de un proyecto', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/projects/tests/project.api.test.js

describe('Projects API Tests', () => {
  describe('GET /api/projects', () => {
    it('[GERENTE OPS] debe listar todos los proyectos', async () => {});
    it('[SUPERVISOR PROYECTO] solo debe ver proyectos asignados', async () => {});
    it('[GERENTE OPS] debe filtrar por estado', async () => {});
    it('[EMPLEADO REGULAR] debe retornar 403', async () => {});
  });

  describe('POST /api/projects', () => {
    it('[GERENTE OPS] debe crear proyecto', async () => {});
    it('[GERENTE OPS] debe generar código automáticamente', async () => {});
    it('[GERENTE OPS] debe validar campos requeridos', async () => {});
    it('[SUPERVISOR PROYECTO] debe retornar 403', async () => {});
  });

  describe('POST /api/projects/:id/members', () => {
    it('[GERENTE OPS] debe agregar miembro al proyecto', async () => {});
    it('[SUPERVISOR PROYECTO] puede agregar miembros a su proyecto', async () => {});
    it('[GERENTE OPS] debe asignar rol al miembro', async () => {});
  });

  describe('POST /api/projects/:id/milestones', () => {
    it('[GERENTE OPS] debe crear hito', async () => {});
    it('[SUPERVISOR PROYECTO] puede crear hito en su proyecto', async () => {});
    it('[GERENTE OPS] debe asignar peso al hito', async () => {});
  });

  describe('POST /api/projects/:id/milestones/:milestoneId/complete', () => {
    it('[SUPERVISOR PROYECTO] debe completar hito', async () => {});
    it('[SUPERVISOR] debe actualizar progreso del proyecto', async () => {});
  });

  describe('POST /api/projects/:id/expenses', () => {
    it('[SUPERVISOR PROYECTO] debe crear gasto', async () => {});
    it('[SUPERVISOR] debe validar que gasto no exceda presupuesto', async () => {});
  });

  describe('POST /api/projects/:id/expenses/:expenseId/approve', () => {
    it('[GERENTE OPS] debe aprobar gasto', async () => {});
    it('[GERENTE GENERAL] debe poder aprobar', async () => {});
    it('[SUPERVISOR PROYECTO] NO debe poder aprobar', async () => {});
  });

  describe('POST /api/projects/:id/updates', () => {
    it('[SUPERVISOR PROYECTO] debe crear actualización', async () => {});
  });

  describe('POST /api/projects/:id/photos', () => {
    it('[SUPERVISOR PROYECTO] debe agregar foto con categoría', async () => {});
  });

  describe('POST /api/projects/:id/valuations', () => {
    it('[GERENTE OPS] debe crear valuación', async () => {});
  });

  describe('POST /api/projects/:id/valuations/:valuationId/approve', () => {
    it('[GERENTE GENERAL] debe aprobar valuación', async () => {});
    it('[GERENTE OPS] debe poder aprobar', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~35 pruebas

---

## MÓDULO 7: Inventario

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/inventory/stats` | Estadísticas | `inventory:read` |
| GET | `/api/inventory/warehouse-types` | Tipos de almacén | `inventory:read` |
| GET | `/api/inventory/warehouses` | Listar almacenes | `inventory:read` |
| GET | `/api/inventory/warehouses/:id` | Obtener almacén | `inventory:read` |
| GET | `/api/inventory/warehouses/:id/full` | Detalle completo | `inventory:read` |
| POST | `/api/inventory/warehouses` | Crear almacén | `inventory:create` |
| PUT | `/api/inventory/warehouses/:id` | Actualizar almacén | `inventory:update` |
| DELETE | `/api/inventory/warehouses/:id` | Eliminar almacén | `inventory:delete` |
| GET | `/api/inventory/warehouses/:warehouseId/stock` | Stock por almacén | `inventory:read` |
| GET | `/api/inventory/categories` | Listar categorías | `inventory:read` |
| POST | `/api/inventory/categories` | Crear categoría | `inventory:create` |
| GET | `/api/inventory/items` | Listar items | `inventory:read` |
| GET | `/api/inventory/items/:id` | Obtener item | `inventory:read` |
| GET | `/api/inventory/items/:id/full` | Detalle completo | `inventory:read` |
| POST | `/api/inventory/items` | Crear item | `inventory:create` |
| PUT | `/api/inventory/items/:id` | Actualizar item | `inventory:update` |
| DELETE | `/api/inventory/items/:id` | Eliminar item | `inventory:delete` |
| GET | `/api/inventory/items/:itemId/stock` | Stock por item | `inventory:read` |
| GET | `/api/inventory/movements` | Listar movimientos | `inventory:read` |
| POST | `/api/inventory/movements` | Crear movimiento | `inventory:create` |
| GET | `/api/inventory/movements/:id` | Obtener movimiento | `inventory:read` |
| POST | `/api/inventory/movements/:id/cancel` | Cancelar movimiento | `inventory:delete` |

### Pruebas Unitarias

```javascript
// backend/src/modules/inventory/tests/inventory.service.test.js

describe('InventoryService', () => {
  describe('generateItemCode', () => {
    it('debe generar código con formato ITM-XXX', () => {});
  });

  describe('calculateAverageCost', () => {
    it('debe calcular costo promedio ponderado', () => {});
    it('debe actualizar costo al registrar compra', () => {});
  });

  describe('calculateStockValue', () => {
    it('debe calcular valor = stock * costo promedio', () => {});
  });

  describe('validateStock', () => {
    it('debe validar que haya stock suficiente para salida', () => {});
    it('debe rechazar salida con stock insuficiente', () => {});
  });

  describe('needsRestock', () => {
    it('debe retornar true si stock < mínimo', () => {});
    it('debe retornar false si stock >= mínimo', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/inventory/tests/inventory.integration.test.js

describe('Inventory Integration Tests', () => {
  describe('Item and Warehouse Setup', () => {
    it('debe crear almacén', async () => {});
    it('debe crear item de inventario', async () => {});
    it('debe inicializar stock en 0', async () => {});
  });

  describe('Stock Movements', () => {
    it('debe registrar entrada y aumentar stock', async () => {});
    it('debe registrar salida y disminuir stock', async () => {});
    it('debe registrar transferencia entre almacenes', async () => {});
    it('debe actualizar costo promedio en compras', async () => {});
  });

  describe('Multi-Warehouse Stock', () => {
    it('debe mantener stock por almacén', async () => {});
    it('debe transferir entre almacenes', async () => {});
  });

  describe('Integration with Finance', () => {
    it('debe crear transacción en Finance al registrar compra', async () => {});
  });

  describe('Integration with Projects', () => {
    it('debe vincular movimiento con proyecto', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/inventory/tests/inventory.api.test.js

describe('Inventory API Tests', () => {
  describe('GET /api/inventory/warehouses', () => {
    it('[GERENTE OPS] debe listar almacenes', async () => {});
    it('[SUPERVISOR PROYECTO] puede ver almacenes', async () => {});
  });

  describe('POST /api/inventory/warehouses', () => {
    it('[GERENTE OPS] debe crear almacén', async () => {});
    it('[SUPERVISOR] debe retornar 403', async () => {});
  });

  describe('GET /api/inventory/items', () => {
    it('[GERENTE OPS] debe listar items con filtros', async () => {});
    it('[GERENTE OPS] debe filtrar por tipo', async () => {});
    it('[GERENTE OPS] debe mostrar items con stock bajo', async () => {});
  });

  describe('POST /api/inventory/items', () => {
    it('[GERENTE OPS] debe crear item', async () => {});
    it('[GERENTE OPS] debe generar código automáticamente', async () => {});
  });

  describe('POST /api/inventory/movements', () => {
    it('[GERENTE OPS] debe registrar entrada (compra)', async () => {});
    it('[GERENTE OPS] debe registrar salida', async () => {});
    it('[GERENTE OPS] debe validar stock en salidas', async () => {});
    it('[GERENTE OPS] debe actualizar stock del almacén', async () => {});
    it('[GERENTE OPS] debe crear transacción en Finance si es compra', async () => {});
  });

  describe('POST /api/inventory/movements (Transfer)', () => {
    it('[GERENTE OPS] debe transferir entre almacenes', async () => {});
    it('[GERENTE OPS] debe restar de origen y sumar a destino', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~25 pruebas

---

## MÓDULO 8: Flota

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/fleet/catalogs` | Catálogos | Público |
| GET | `/api/fleet/stats` | Estadísticas | `fleet:read` |
| GET | `/api/fleet/alerts` | Alertas | `fleet:read` |
| GET | `/api/fleet/vehicles` | Listar vehículos | `fleet:read` |
| GET | `/api/fleet/vehicles/:id` | Obtener vehículo | `fleet:read` |
| GET | `/api/fleet/vehicles/:id/full` | Detalle completo | `fleet:read` |
| POST | `/api/fleet/vehicles` | Crear vehículo | `fleet:create` |
| PUT | `/api/fleet/vehicles/:id` | Actualizar vehículo | `fleet:update` |
| DELETE | `/api/fleet/vehicles/:id` | Eliminar vehículo | `fleet:delete` |
| GET | `/api/fleet/assignments` | Listar asignaciones | `fleet:read` |
| POST | `/api/fleet/assignments` | Crear asignación | `fleet:create` |
| POST | `/api/fleet/assignments/:id/end` | Finalizar asignación | `fleet:update` |
| GET | `/api/fleet/maintenances` | Listar mantenimientos | `fleet:read` |
| POST | `/api/fleet/maintenances` | Crear mantenimiento | `fleet:create` |
| PUT | `/api/fleet/maintenances/:id` | Actualizar mantenimiento | `fleet:update` |
| POST | `/api/fleet/maintenances/:id/complete` | Completar mantenimiento | `fleet:update` |
| GET | `/api/fleet/fuel-logs` | Listar combustible | `fleet:read` |
| POST | `/api/fleet/fuel-logs` | Crear registro | `fleet:create` |
| PUT | `/api/fleet/fuel-logs/:id` | Actualizar registro | `fleet:update` |
| DELETE | `/api/fleet/fuel-logs/:id` | Eliminar registro | `fleet:delete` |

### Pruebas Unitarias

```javascript
// backend/src/modules/fleet/tests/fleet.service.test.js

describe('FleetService', () => {
  describe('calculateFuelConsumption', () => {
    it('debe calcular consumo = litros / distancia', () => {});
    it('debe calcular consumo promedio del vehículo', () => {});
  });

  describe('calculateMaintenanceCosts', () => {
    it('debe sumar costos de mantenimientos del vehículo', () => {});
  });

  describe('calculateTotalVehicleCosts', () => {
    it('debe sumar mantenimiento + combustible', () => {});
  });

  describe('needsMaintenance', () => {
    it('debe retornar true si próximo mantenimiento vencido', () => {});
  });

  describe('hasExpiredDocuments', () => {
    it('debe retornar true si seguro vencido', () => {});
    it('debe retornar true si revisión técnica vencida', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/fleet/tests/fleet.integration.test.js

describe('Fleet Integration Tests', () => {
  describe('Vehicle Management', () => {
    it('debe crear vehículo', async () => {});
    it('debe almacenar documentos (seguro, revisión)', async () => {});
  });

  describe('Vehicle Assignment', () => {
    it('debe asignar vehículo a empleado', async () => {});
    it('debe asignar vehículo a proyecto', async () => {});
    it('debe finalizar asignación anterior al asignar nuevo', async () => {});
  });

  describe('Maintenance Tracking', () => {
    it('debe crear mantenimiento preventivo', async () => {});
    it('debe crear mantenimiento correctivo', async () => {});
    it('debe completar mantenimiento y registrar costo', async () => {});
  });

  describe('Fuel Management', () => {
    it('debe registrar carga de combustible', async () => {});
    it('debe calcular consumo por km', async () => {});
  });

  describe('Integration with Finance', () => {
    it('debe crear transacción al registrar mantenimiento', async () => {});
    it('debe crear transacción al registrar combustible', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/fleet/tests/fleet.api.test.js

describe('Fleet API Tests', () => {
  describe('GET /api/fleet/vehicles', () => {
    it('[GERENTE OPS] debe listar vehículos', async () => {});
    it('[GERENTE OPS] debe filtrar por estado', async () => {});
  });

  describe('POST /api/fleet/vehicles', () => {
    it('[GERENTE OPS] debe crear vehículo', async () => {});
    it('[GERENTE OPS] debe validar placa única', async () => {});
  });

  describe('POST /api/fleet/assignments', () => {
    it('[GERENTE OPS] debe asignar vehículo a empleado', async () => {});
    it('[GERENTE OPS] debe asignar vehículo a proyecto', async () => {});
  });

  describe('POST /api/fleet/maintenances', () => {
    it('[GERENTE OPS] debe crear mantenimiento', async () => {});
  });

  describe('POST /api/fleet/maintenances/:id/complete', () => {
    it('[GERENTE OPS] debe completar mantenimiento con costo', async () => {});
    it('[GERENTE OPS] debe crear transacción en Finance', async () => {});
  });

  describe('POST /api/fleet/fuel-logs', () => {
    it('[GERENTE OPS] debe registrar combustible', async () => {});
    it('[GERENTE OPS] debe calcular consumo automáticamente', async () => {});
    it('[GERENTE OPS] debe crear transacción en Finance', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~25 pruebas

---

## MÓDULO 9: Procura

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/procurement/stats` | Estadísticas | `procurement:read` |
| GET | `/api/procurement/quotes` | Listar cotizaciones | `procurement:read` |
| POST | `/api/procurement/quotes` | Crear cotización | `procurement:create` |
| GET | `/api/procurement/quotes/:id` | Obtener cotización | `procurement:read` |
| PUT | `/api/procurement/quotes/:id` | Actualizar cotización | `procurement:update` |
| DELETE | `/api/procurement/quotes/:id` | Eliminar cotización | `procurement:delete` |
| POST | `/api/procurement/quotes/:id/approve` | Aprobar cotización | `procurement:approve` |
| POST | `/api/procurement/quotes/:id/reject` | Rechazar cotización | `procurement:approve` |
| POST | `/api/procurement/quotes/:id/convert-to-po` | Convertir a OC | `procurement:create` |
| GET | `/api/procurement/quote-requests` | Listar solicitudes | `procurement:read` |
| POST | `/api/procurement/quote-requests` | Crear solicitud | `procurement:create` |
| GET | `/api/procurement/quote-requests/:id` | Obtener solicitud | `procurement:read` |
| POST | `/api/procurement/quote-requests/:id/approve` | Aprobar solicitud | `procurement:approve` |
| POST | `/api/procurement/quote-requests/:id/select-quote` | Seleccionar cotización | `procurement:approve` |

### Pruebas Unitarias

```javascript
// backend/src/modules/procurement/tests/procurement.service.test.js

describe('ProcurementService', () => {
  describe('generateQuoteCode', () => {
    it('debe generar código con formato QTE-YYYYMMDD-XXX', () => {});
  });

  describe('generatePurchaseOrderCode', () => {
    it('debe generar código con formato PO-YYYYMMDD-XXX', () => {});
  });

  describe('calculateQuoteTotal', () => {
    it('debe sumar total de items en cotización', () => {});
  });

  describe('compareQuotes', () => {
    it('debe ordenar cotizaciones por precio', () => {});
    it('debe comparar por tiempo de entrega', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/procurement/tests/procurement.integration.test.js

describe('Procurement Integration Tests', () => {
  describe('Quote Request Flow', () => {
    it('debe crear solicitud de cotización', async () => {});
    it('debe aprobar solicitud', async () => {});
  });

  describe('Quote Management', () => {
    it('debe crear cotización de proveedor', async () => {});
    it('debe vincular cotización con solicitud', async () => {});
  });

  describe('Quote Selection and PO Creation', () => {
    it('debe seleccionar mejor cotización', async () => {});
    it('debe convertir cotización a orden de compra', async () => {});
  });

  describe('Integration with Inventory', () => {
    it('debe vincular OC con items de inventario', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/procurement/tests/procurement.api.test.js

describe('Procurement API Tests', () => {
  describe('POST /api/procurement/quote-requests', () => {
    it('[GERENTE OPS] debe crear solicitud de cotización', async () => {});
    it('[SUPERVISOR PROYECTO] puede crear solicitud', async () => {});
  });

  describe('POST /api/procurement/quote-requests/:id/approve', () => {
    it('[GERENTE GENERAL] debe aprobar solicitud', async () => {});
    it('[GERENTE OPS] debe poder aprobar', async () => {});
  });

  describe('POST /api/procurement/quotes', () => {
    it('[GERENTE OPS] debe crear cotización', async () => {});
  });

  describe('POST /api/procurement/quotes/:id/approve', () => {
    it('[GERENTE GENERAL] debe aprobar cotización', async () => {});
  });

  describe('POST /api/procurement/quote-requests/:id/select-quote', () => {
    it('[GERENTE OPS] debe seleccionar cotización ganadora', async () => {});
  });

  describe('POST /api/procurement/quotes/:id/convert-to-po', () => {
    it('[GERENTE OPS] debe convertir cotización a OC', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~20 pruebas

---

## MÓDULO 10: HSE

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/hse/catalogs` | Catálogos | Público |
| GET | `/api/hse/stats` | Estadísticas | `hse:read` |
| GET | `/api/hse/alerts` | Alertas | `hse:read` |
| GET | `/api/hse/incidents` | Listar incidentes | `hse:read` |
| GET | `/api/hse/incidents/:id` | Obtener incidente | `hse:read` |
| POST | `/api/hse/incidents` | Crear incidente | `hse:create` |
| PUT | `/api/hse/incidents/:id` | Actualizar incidente | `hse:update` |
| POST | `/api/hse/incidents/:id/investigate` | Investigar incidente | `hse:update` |
| POST | `/api/hse/incidents/:id/close` | Cerrar incidente | `hse:update` |
| GET | `/api/hse/inspections` | Listar inspecciones | `hse:read` |
| POST | `/api/hse/inspections` | Crear inspección | `hse:create` |
| POST | `/api/hse/inspections/:id/complete` | Completar inspección | `hse:update` |
| GET | `/api/hse/trainings` | Listar capacitaciones | `hse:read` |
| POST | `/api/hse/trainings` | Crear capacitación | `hse:create` |
| POST | `/api/hse/trainings/:id/complete` | Completar capacitación | `hse:update` |
| POST | `/api/hse/trainings/:id/attendances` | Registrar asistencia | `hse:update` |
| GET | `/api/hse/equipment` | Listar equipos | `hse:read` |
| POST | `/api/hse/equipment` | Crear equipo | `hse:create` |
| POST | `/api/hse/equipment/:id/assign` | Asignar equipo | `hse:update` |
| POST | `/api/hse/equipment/:id/return` | Devolver equipo | `hse:update` |

### Pruebas Unitarias

```javascript
// backend/src/modules/hse/tests/hse.service.test.js

describe('HSEService', () => {
  describe('calculateIncidentRate', () => {
    it('debe calcular tasa de incidentes por horas trabajadas', () => {});
  });

  describe('classifyIncidentSeverity', () => {
    it('debe clasificar como leve, moderado, grave, fatal', () => {});
  });

  describe('needsInspection', () => {
    it('debe retornar true si próxima inspección vencida', () => {});
  });

  describe('calculateTrainingCoverage', () => {
    it('debe calcular % de empleados capacitados', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/hse/tests/hse.integration.test.js

describe('HSE Integration Tests', () => {
  describe('Incident Management', () => {
    it('debe crear incidente', async () => {});
    it('debe vincular con empleado y proyecto', async () => {});
    it('debe investigar incidente', async () => {});
    it('debe cerrar incidente con acciones correctivas', async () => {});
  });

  describe('Inspection Flow', () => {
    it('debe crear inspección programada', async () => {});
    it('debe completar inspección con hallazgos', async () => {});
  });

  describe('Training Management', () => {
    it('debe crear capacitación', async () => {});
    it('debe registrar asistencia de empleados', async () => {});
    it('debe completar capacitación', async () => {});
  });

  describe('Safety Equipment', () => {
    it('debe crear equipo de seguridad', async () => {});
    it('debe asignar equipo a empleado', async () => {});
    it('debe devolver equipo', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/hse/tests/hse.api.test.js

describe('HSE API Tests', () => {
  describe('POST /api/hse/incidents', () => {
    it('[GERENTE OPS] debe crear incidente', async () => {});
    it('[SUPERVISOR PROYECTO] puede crear incidente', async () => {});
  });

  describe('POST /api/hse/incidents/:id/investigate', () => {
    it('[GERENTE OPS] debe iniciar investigación', async () => {});
  });

  describe('POST /api/hse/incidents/:id/close', () => {
    it('[GERENTE OPS] debe cerrar incidente', async () => {});
  });

  describe('POST /api/hse/inspections', () => {
    it('[GERENTE OPS] debe crear inspección', async () => {});
  });

  describe('POST /api/hse/inspections/:id/complete', () => {
    it('[GERENTE OPS] debe completar inspección', async () => {});
  });

  describe('POST /api/hse/trainings', () => {
    it('[GERENTE OPS] debe crear capacitación', async () => {});
  });

  describe('POST /api/hse/trainings/:id/attendances', () => {
    it('[GERENTE OPS] debe registrar asistencia', async () => {});
  });

  describe('POST /api/hse/equipment/:id/assign', () => {
    it('[GERENTE OPS] debe asignar equipo a empleado', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~20 pruebas

---

## MÓDULO 11: Documentos

### Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/documents/catalogs` | Catálogos | Público |
| GET | `/api/documents/stats` | Estadísticas | `documents:read` |
| GET | `/api/documents/expiring` | Docs por vencer | `documents:read` |
| GET | `/api/documents/categories` | Listar categorías | `documents:read` |
| POST | `/api/documents/categories` | Crear categoría | `documents:create` |
| GET | `/api/documents` | Listar documentos | `documents:read` |
| GET | `/api/documents/:id` | Obtener documento | `documents:read` |
| POST | `/api/documents` | Crear documento | `documents:create` |
| PUT | `/api/documents/:id` | Actualizar documento | `documents:update` |
| DELETE | `/api/documents/:id` | Eliminar documento | `documents:delete` |
| POST | `/api/documents/:id/submit` | Enviar a revisión | `documents:update` |
| POST | `/api/documents/:id/approve` | Aprobar documento | `documents:approve` |
| POST | `/api/documents/:id/reject` | Rechazar documento | `documents:approve` |
| POST | `/api/documents/:id/archive` | Archivar documento | `documents:update` |
| POST | `/api/documents/:id/versions` | Crear versión | `documents:update` |
| POST | `/api/documents/:id/share` | Compartir documento | `documents:share` |
| DELETE | `/api/documents/:id/share/:shareId` | Remover compartido | `documents:share` |

### Pruebas Unitarias

```javascript
// backend/src/modules/documents/tests/document.service.test.js

describe('DocumentService', () => {
  describe('generateDocumentCode', () => {
    it('debe generar código con formato DOC-YYYYMMDD-XXX', () => {});
  });

  describe('isExpired', () => {
    it('debe retornar true si documento vencido', () => {});
  });

  describe('isExpiringSoon', () => {
    it('debe retornar true si vence en menos de 30 días', () => {});
  });

  describe('canUserAccess', () => {
    it('debe permitir acceso si documento compartido con usuario', () => {});
    it('debe permitir acceso si usuario es creador', () => {});
  });
});
```

### Pruebas de Integración

```javascript
// backend/src/modules/documents/tests/document.integration.test.js

describe('Documents Integration Tests', () => {
  describe('Document Creation and Workflow', () => {
    it('debe crear documento en borrador', async () => {});
    it('debe enviar a revisión', async () => {});
    it('debe aprobar documento', async () => {});
    it('debe rechazar documento con motivo', async () => {});
  });

  describe('Version Control', () => {
    it('debe crear nueva versión de documento', async () => {});
    it('debe mantener historial de versiones', async () => {});
  });

  describe('Document Sharing', () => {
    it('debe compartir documento con usuario', async () => {});
    it('debe compartir documento con departamento', async () => {});
    it('debe validar permisos de acceso', async () => {});
  });

  describe('Integration with Other Modules', () => {
    it('debe vincular documento con empleado', async () => {});
    it('debe vincular documento con proyecto', async () => {});
  });
});
```

### Pruebas de API

```javascript
// backend/src/modules/documents/tests/document.api.test.js

describe('Documents API Tests', () => {
  describe('GET /api/documents', () => {
    it('[GERENTE ADMIN] debe listar documentos', async () => {});
    it('[GERENTE ADMIN] debe filtrar por estado', async () => {});
    it('[EMPLEADO] solo debe ver documentos compartidos', async () => {});
  });

  describe('POST /api/documents', () => {
    it('[GERENTE ADMIN] debe crear documento', async () => {});
    it('[GERENTE ADMIN] debe validar campos requeridos', async () => {});
  });

  describe('POST /api/documents/:id/submit', () => {
    it('[GERENTE ADMIN] debe enviar a revisión', async () => {});
  });

  describe('POST /api/documents/:id/approve', () => {
    it('[GERENTE GENERAL] debe aprobar documento', async () => {});
    it('[GERENTE ADMIN] debe poder aprobar', async () => {});
  });

  describe('POST /api/documents/:id/reject', () => {
    it('[GERENTE GENERAL] debe rechazar con motivo', async () => {});
  });

  describe('POST /api/documents/:id/versions', () => {
    it('[GERENTE ADMIN] debe crear nueva versión', async () => {});
  });

  describe('POST /api/documents/:id/share', () => {
    it('[GERENTE ADMIN] debe compartir con usuario', async () => {});
    it('[GERENTE ADMIN] debe compartir con departamento', async () => {});
  });
});
```

**Total de Pruebas del Módulo**: ~20 pruebas

---

## 📅 Plan de Ejecución

### Fase 1: Configuración y Usuarios de Prueba (Semana 1)

**Objetivos:**
- Configurar entorno de pruebas
- Crear usuarios de prueba
- Configurar base de datos de prueba

**Tareas:**

1. **Setup de Base de Datos de Prueba**
```bash
# Crear base de datos de prueba
createdb erp_test

# Ejecutar migraciones
cd backend
NODE_ENV=test npx sequelize-cli db:migrate

# Ejecutar seeders
NODE_ENV=test npx sequelize-cli db:seed:all
```

2. **Configurar Jest**
```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/**',
    '!src/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

3. **Crear Script de Usuarios de Prueba**
```bash
bash backend/tests/setup/create-test-users.sh
```

**Entregables:**
- ✅ Base de datos de prueba configurada
- ✅ 9 usuarios de prueba creados
- ✅ Jest configurado

---

### Fase 2: Pruebas Unitarias (Semanas 2-4)

**Objetivos:**
- Escribir pruebas unitarias para todos los servicios
- Lograr 90% de cobertura en servicios

**Prioridad por Módulo:**

**Semana 2:**
1. Auth y Usuarios (servicios críticos)
2. Empleados (lógica de validación)
3. Nómina (cálculos complejos)

**Semana 3:**
4. Finanzas (conversión de moneda, balance)
5. Caja Chica (validación de límites)
6. Proyectos (cálculo de progreso)

**Semana 4:**
7. Inventario (stock, costo promedio)
8. Flota (consumo, costos)
9. Procura (comparación de cotizaciones)
10. HSE (tasas de incidentes)
11. Documentos (workflow)

**Comando de Ejecución:**
```bash
npm test -- --coverage --testPathPattern=service.test
```

**Entregables:**
- ✅ 150+ pruebas unitarias
- ✅ Cobertura > 90% en servicios

---

### Fase 3: Pruebas de Integración (Semanas 5-7)

**Objetivos:**
- Probar flujos completos entre módulos
- Validar integridad de datos

**Prioridad por Flujo:**

**Semana 5:**
1. Usuario → Roles → Permisos
2. Empleado → Departamento → Supervisor
3. Empleado → Cuentas Bancarias

**Semana 6:**
4. Nómina → Préstamos → Pagos
5. Nómina → Finanzas (transacciones)
6. Finanzas → Cuentas → Transacciones

**Semana 7:**
7. Proyecto → Miembros → Hitos → Gastos
8. Inventario → Movimientos → Stock
9. Flota → Asignaciones → Mantenimiento
10. Caja Chica → Aprobación → Finanzas

**Comando de Ejecución:**
```bash
npm test -- --testPathPattern=integration.test
```

**Entregables:**
- ✅ 80+ pruebas de integración
- ✅ Validación de transacciones complejas

---

### Fase 4: Pruebas de API (Semanas 8-10)

**Objetivos:**
- Probar todos los endpoints con diferentes roles
- Validar autenticación y autorización

**Prioridad por Módulo:**

**Semana 8:**
1. Auth y Usuarios (35 pruebas)
2. Empleados (25 pruebas)
3. Nómina (40 pruebas)

**Semana 9:**
4. Finanzas (35 pruebas)
5. Caja Chica (25 pruebas)
6. Proyectos (35 pruebas)

**Semana 10:**
7. Inventario (25 pruebas)
8. Flota (25 pruebas)
9. Procura (20 pruebas)
10. HSE (20 pruebas)
11. Documentos (20 pruebas)

**Comando de Ejecución:**
```bash
npm test -- --testPathPattern=api.test
```

**Entregables:**
- ✅ 305+ pruebas de API
- ✅ Validación completa de permisos por rol

---

### Fase 5: Corrección de Bugs y Refinamiento (Semana 11)

**Objetivos:**
- Corregir errores detectados
- Mejorar cobertura en áreas débiles
- Optimizar pruebas lentas

**Tareas:**
1. Revisar logs de pruebas fallidas
2. Priorizar bugs críticos
3. Refactorizar código según hallazgos
4. Mejorar tiempo de ejecución de pruebas

**Entregables:**
- ✅ Todas las pruebas pasando
- ✅ Cobertura total > 70%

---

### Fase 6: Documentación y CI/CD (Semana 12)

**Objetivos:**
- Documentar hallazgos
- Configurar pruebas en CI/CD
- Generar reporte final

**Tareas:**

1. **Configurar GitHub Actions**
```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

2. **Generar Reporte de Cobertura**
```bash
npm test -- --coverage --coverageReporters=html
```

**Entregables:**
- ✅ CI/CD configurado
- ✅ Reporte de cobertura
- ✅ Documentación completa

---

## 🛠️ Herramientas y Configuración

### Frameworks de Pruebas

#### Jest
```bash
npm install --save-dev jest @types/jest
```

#### Supertest (API Testing)
```bash
npm install --save-dev supertest
```

#### Configuración de Base de Datos de Prueba

```javascript
// backend/src/config/database.test.js
module.exports = {
  database: 'erp_test',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
  logging: false
};
```

### Scripts NPM

```json
{
  "scripts": {
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "test:unit": "NODE_ENV=test jest --testPathPattern=service.test",
    "test:integration": "NODE_ENV=test jest --testPathPattern=integration.test",
    "test:api": "NODE_ENV=test jest --testPathPattern=api.test"
  }
}
```

### Helpers de Prueba

```javascript
// backend/tests/helpers/auth.helper.js
const request = require('supertest');
const app = require('../../src/app');

async function loginAs(username, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  return response.body.data.token;
}

module.exports = { loginAs };
```

```javascript
// backend/tests/helpers/db.helper.js
const { sequelize } = require('../../src/database/models');

async function resetDatabase() {
  await sequelize.sync({ force: true });
}

async function seedTestData() {
  // Crear datos de prueba
}

module.exports = { resetDatabase, seedTestData };
```

---

## 📈 Métricas de Éxito

### Objetivos de Cobertura

| Tipo | Objetivo | Crítico |
|------|----------|---------|
| Código Total | 70% | 60% |
| Servicios | 90% | 80% |
| Controladores | 80% | 70% |
| Endpoints Críticos | 100% | 100% |

### Objetivos de Calidad

- ✅ 0 bugs críticos en producción
- ✅ 100% de endpoints documentados
- ✅ Tiempo de ejecución < 5 minutos (suite completa)
- ✅ CI/CD pasando en cada commit

---

## 🎯 Resumen Total de Pruebas

| Módulo | Unitarias | Integración | API | Total |
|--------|-----------|-------------|-----|-------|
| Auth y Usuarios | 15 | 10 | 35 | 60 |
| Empleados | 8 | 10 | 25 | 43 |
| Nómina | 20 | 15 | 40 | 75 |
| Finanzas | 15 | 12 | 35 | 62 |
| Caja Chica | 10 | 10 | 25 | 45 |
| Proyectos | 12 | 12 | 35 | 59 |
| Inventario | 10 | 10 | 25 | 45 |
| Flota | 10 | 10 | 25 | 45 |
| Procura | 8 | 8 | 20 | 36 |
| HSE | 8 | 8 | 20 | 36 |
| Documentos | 8 | 8 | 20 | 36 |
| **TOTAL** | **124** | **113** | **305** | **542** |

---

## ✅ Checklist de Implementación

### Preparación
- [ ] Crear base de datos de prueba
- [ ] Configurar Jest
- [ ] Instalar dependencias (supertest, etc.)
- [ ] Crear usuarios de prueba (9 usuarios)
- [ ] Configurar scripts NPM

### Fase 1: Pruebas Unitarias
- [ ] Auth y Usuarios (15 pruebas)
- [ ] Empleados (8 pruebas)
- [ ] Nómina (20 pruebas)
- [ ] Finanzas (15 pruebas)
- [ ] Caja Chica (10 pruebas)
- [ ] Proyectos (12 pruebas)
- [ ] Inventario (10 pruebas)
- [ ] Flota (10 pruebas)
- [ ] Procura (8 pruebas)
- [ ] HSE (8 pruebas)
- [ ] Documentos (8 pruebas)

### Fase 2: Pruebas de Integración
- [ ] Flujos de autenticación y permisos
- [ ] Flujos de empleados y organización
- [ ] Flujos de nómina y préstamos
- [ ] Flujos de finanzas y transacciones
- [ ] Flujos de proyectos completos
- [ ] Integración Inventario-Finanzas
- [ ] Integración Flota-Finanzas
- [ ] Integración Caja Chica-Finanzas

### Fase 3: Pruebas de API
- [ ] Auth (35 pruebas con 9 roles diferentes)
- [ ] Empleados (25 pruebas)
- [ ] Nómina (40 pruebas)
- [ ] Finanzas (35 pruebas)
- [ ] Caja Chica (25 pruebas)
- [ ] Proyectos (35 pruebas)
- [ ] Inventario (25 pruebas)
- [ ] Flota (25 pruebas)
- [ ] Procura (20 pruebas)
- [ ] HSE (20 pruebas)
- [ ] Documentos (20 pruebas)

### Fase 4: CI/CD y Documentación
- [ ] Configurar GitHub Actions
- [ ] Generar reporte de cobertura
- [ ] Documentar bugs encontrados
- [ ] Crear guía de mantenimiento de pruebas

---

**Próximos Pasos:** Una vez aprobado este roadmap, comenzaremos con la Fase 1 (Configuración y Usuarios de Prueba) y luego avanzaremos módulo por módulo implementando las pruebas.
