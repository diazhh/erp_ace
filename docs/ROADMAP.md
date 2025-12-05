# 🗺️ ROADMAP - ERP Sistema de Gestión Empresarial

**Última actualización:** 2025-12-05  
**Versión actual:** 0.12.0 (Sistema de Usuarios y Permisos Granulares)

---

## 📊 Resumen de Progreso General

| Sprint | Módulo | Estado | Progreso |
|--------|--------|--------|----------|
| Sprint 0 | Setup & Fundamentos | ✅ Completado | 100% |
| Sprint 1 | Empleados | ✅ Completado | 100% |
| Sprint 1.5 | Organización | ✅ Completado | 100% |
| Sprint 2 | Nómina | ✅ Completado | 100% |
| Sprint 3 | Finanzas | ✅ Completado | 100% |
| Sprint 4 | Caja Chica | ✅ Completado | 100% |
| Sprint 5 | Proyectos | ✅ Completado | 100% |
| Sprint 6 | Inventario | ✅ Completado | 100% |
| Sprint 7 | Flota | ✅ Completado | 100% |
| Sprint 8 | Procura | ✅ Completado | 100% |
| Sprint 9 | HSE | ✅ Completado | 100% |
| Sprint 10 | Documentos | ✅ Completado | 100% |
| Sprint 11 | Reportes & Dashboard | 🔄 En Progreso | 85% |
| Sprint 12 | Usuarios y Permisos | ✅ Completado | 100% |

**Progreso Total del Proyecto: ~99%**

```
[█████████████████████████████░] 98%
```

---

## 🔗 PRINCIPIO FUNDAMENTAL: TRAZABILIDAD TOTAL

### Concepto

El ERP debe funcionar como un **sistema interconectado** donde cada entidad tiene visibilidad completa de sus relaciones. Esto permite:

1. **Auditoría completa**: Saber quién hizo qué, cuándo y por qué
2. **Navegación intuitiva**: Desde cualquier entidad, acceder a sus relaciones
3. **Reportes cruzados**: Generar informes que crucen múltiples módulos
4. **Toma de decisiones**: Ver el impacto de cada acción en el sistema

### Implementación por Entidad

#### 👤 Empleado (Vista Detalle)
Desde el detalle de un empleado se debe poder ver:
- **Datos Personales**: Información básica, contacto, documentos
- **Datos Laborales**: Cargo, departamento, fecha ingreso, contrato
- **Nómina**: Historial de pagos, salario actual, deducciones
- **Préstamos**: Préstamos activos, historial de pagos, saldo pendiente
- **Proyectos**: Proyectos asignados (actuales e históricos)
- **Vehículos**: Vehículo asignado (si aplica)
- **Caja Chica**: Gastos realizados, reembolsos pendientes
- **Documentos**: Documentos del empleado con fechas de vencimiento
- **Auditoría**: Historial de cambios en su registro

#### 💰 Cuenta Bancaria (Vista Detalle)
- **Información de la Cuenta**: Banco, número, titular, tipo
- **Saldo Actual**: Con gráfico de evolución
- **Transacciones**: Historial completo con filtros
- **Transferencias**: Entradas y salidas
- **Conciliación**: Estado de conciliación
- **Pagos de Nómina**: Pagos realizados desde esta cuenta
- **Proyectos**: Gastos de proyectos pagados desde esta cuenta

#### 📋 Proyecto (Vista Detalle)
- **Información General**: Cliente, fechas, presupuesto, estado
- **Equipo**: Empleados asignados con roles
- **Finanzas**: Ingresos, gastos, rentabilidad
- **Vehículos**: Vehículos asignados al proyecto
- **Inventario**: Materiales utilizados
- **Caja Chica**: Gastos menores del proyecto
- **Documentos**: Contratos, informes, entregables
- **Timeline**: Hitos y avances

#### 🚗 Vehículo (Vista Detalle)
- **Información**: Marca, modelo, placa, año
- **Asignación**: Empleado/Proyecto asignado
- **Mantenimientos**: Historial y próximos programados
- **Combustible**: Consumo y costos
- **Documentos**: Seguro, revisión técnica, permisos
- **Costos**: Total de gastos del vehículo

#### 📄 Período de Nómina (Vista Detalle)
- **Resumen**: Totales, empleados, estado
- **Entradas**: Detalle por empleado
- **Deducciones**: Préstamos descontados
- **Pagos**: Transacciones generadas
- **Aprobaciones**: Quién aprobó y cuándo

### Diagrama de Relaciones

```
                    ┌─────────────┐
                    │   EMPLEADO  │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  NÓMINA  │    │ PROYECTO │    │ VEHÍCULO │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │PRÉSTAMOS │    │INVENTARIO│    │MANTENIM. │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                  ┌──────────────┐
                  │   FINANZAS   │
                  │  (Cuentas,   │
                  │Transacciones)│
                  └──────────────┘
```

---

## ✅ SPRINT 0 - Setup y Fundamentos (100%)

### Infraestructura
- [x] Docker Compose con PostgreSQL 16 (puerto 5433)
- [x] Estructura de proyecto backend (Node.js + Express)
- [x] Estructura de proyecto frontend (React + Vite + MUI)
- [x] Configuración de variables de entorno

### Backend Base
- [x] Conexión a base de datos con Sequelize
- [x] Sistema de logging (Winston)
- [x] Manejo de errores centralizado
- [x] Middleware de autenticación JWT
- [x] Middleware de autorización RBAC

### Frontend Base
- [x] Configuración de Redux Toolkit
- [x] Configuración de React Router
- [x] Tema Material UI personalizado
- [x] Layout principal con sidebar
- [x] Página de Login
- [x] Dashboard inicial

### Autenticación y Seguridad
- [x] Modelo de Usuario
- [x] Modelo de Rol
- [x] Modelo de Permiso
- [x] Relaciones many-to-many (User-Role, Role-Permission)
- [x] Login con JWT
- [x] Endpoint /me para obtener usuario actual
- [x] Logout
- [x] Cambio de contraseña
- [x] Seeders con roles y permisos iniciales

### Internacionalización
- [x] Configuración i18next
- [x] Traducciones en Español
- [x] Traducciones en Inglés
- [x] Traducciones en Portugués
- [x] Selector de idioma en UI
- [x] Persistencia de preferencia en localStorage

---

## ✅ SPRINT 1 - Módulo de Empleados (100%)

### Backend
- [x] Modelo Employee (datos personales, laborales, bancarios)
- [x] Modelo EmployeeDocument (documentos con vencimiento)
- [x] Controlador CRUD completo
- [x] Rutas protegidas con permisos
- [x] Endpoint de estadísticas
- [x] Paginación y búsqueda
- [x] Endpoint `/employees/:id/full` con trazabilidad completa

### Frontend
- [x] Página de listado de empleados
- [x] Tabla con paginación
- [x] Búsqueda por nombre/cédula
- [x] Formulario de creación/edición (PÁGINA COMPLETA - sin modal)
- [x] Diálogo de confirmación de eliminación

### ✅ Vista Detalle Empleado
- [x] Página de detalle `/employees/:id`
- [x] Tabs: Información, Laboral, Cuentas, Jerarquía, Nómina, Préstamos, Documentos, Auditoría
- [x] Stats cards con métricas clave
- [x] Enlaces a entidades relacionadas (EntityLink)

---

## ✅ SPRINT 1.5 - Estructura Organizacional (100%)

### Backend
- [x] Modelo Department (Direcciones, Gerencias, Departamentos, Áreas, Unidades)
- [x] Modelo Position (Cargos con nivel jerárquico y rango salarial)
- [x] Modelo EmployeeBankAccount (Múltiples cuentas por empleado)
- [x] Jerarquía de empleados (supervisorId, subordinados)
- [x] Controlador de organización (CRUD departamentos y posiciones)
- [x] Endpoint `/organization/org-chart` para organigrama
- [x] Endpoint `/organization/directory` para directorio
- [x] Endpoint `/organization/stats` para estadísticas

### Frontend
- [x] Página de Departamentos (`/organization/departments`)
- [x] Página de Posiciones/Cargos (`/organization/positions`)
- [x] Organigrama interactivo (`/organization/chart`)
- [x] Directorio de empleados (`/organization/directory`)
- [x] Formulario de empleado mejorado (fecha nacimiento, supervisor, departamento)
- [x] Tab de Cuentas Bancarias en detalle de empleado
- [x] Tab de Jerarquía (supervisor y subordinados)

### Características
- [x] Estructura jerárquica de departamentos (padre/hijo)
- [x] Múltiples cuentas bancarias por empleado (Corriente, Ahorro, Pago Móvil, Zelle, Crypto)
- [x] Cuenta primaria para pagos de nómina
- [x] Porcentaje de pago por cuenta
- [x] Organigrama visual con navegación (toggle entre vista por departamentos y por jerarquía)
- [x] Directorio con filtro alfabético y por departamento
- [x] Vista responsive (cards en móvil, árbol en desktop)
- [x] Gestión de cuentas bancarias en detalle de empleado (agregar, editar, eliminar, establecer primaria)

---

## ✅ SPRINT 2 - Módulo de Nómina (100%)

### Backend
- [x] Modelo PayrollPeriod
- [x] Modelo PayrollEntry
- [x] Modelo EmployeeLoan
- [x] Modelo LoanPayment
- [x] Servicio de cálculo de nómina
- [x] Deducciones legales venezolanas (SSO, RPE, FAOV, ISLR)
- [x] Gestión de préstamos con cuotas

### Frontend
- [x] Página de períodos de nómina
- [x] Página de detalle de período
- [x] Página de préstamos
- [x] Formularios de creación/edición

### ✅ Mejoras de Trazabilidad
- [x] Endpoint `/payroll/periods/:id/full` con trazabilidad completa
- [x] Enlace desde entrada de nómina al empleado (EntityLink)
- [x] Historial de nóminas en detalle de empleado
- [x] Vista detalle de préstamo con historial de pagos (`/payroll/loans/:id`)
- [x] Formulario de préstamo como página completa (`/payroll/loans/new`)
- [x] Aprobación de préstamos en página de detalle (no en lista)

---

## ✅ SPRINT 3 - Módulo de Finanzas (100%)

### Backend
- [x] Modelo BankAccount (múltiples tipos: banco, crypto, efectivo, pago móvil)
- [x] Modelo Transaction (ingresos, gastos, transferencias)
- [x] Modelo ExchangeRate (tasas de cambio)
- [x] Modelo TransactionCategory
- [x] Servicio de finanzas
- [x] Multi-moneda (USD, VES, USDT)

### Frontend
- [x] Página de cuentas bancarias
- [x] Página de transacciones
- [x] Formularios de creación
- [x] Diálogo de detalle de transacción

### ✅ Mejoras de Trazabilidad
- [x] Endpoint `/finance/accounts/:id/full` con trazabilidad completa
- [x] Vista detalle de cuenta con historial de transacciones
- [x] Estadísticas por tipo de transacción
- [x] Transferencias entrantes
- [x] Formulario de cuenta bancaria como página completa (`/finance/accounts/new`, `/finance/accounts/:id/edit`)
- [ ] Gráfico de evolución de saldo (pendiente)
- [ ] Dashboard financiero con KPIs (pendiente)

---

## 📊 DASHBOARDS Y KPIs

### Principio
Cada módulo debe tener visualizaciones que permitan toma de decisiones rápida.

### Dashboard Principal (Home)
- **KPIs Generales**:
  - Empleados activos
  - Proyectos en curso
  - Balance financiero del mes
  - Alertas pendientes
- **Gráficos**:
  - Flujo de caja últimos 6 meses (línea)
  - Distribución de gastos por categoría (pie)
  - Proyectos por estado (barras)
- **Widgets**:
  - Próximos vencimientos (documentos, seguros)
  - Tareas pendientes
  - Actividad reciente

### Dashboard Financiero
- **KPIs**:
  - Ingresos del mes
  - Gastos del mes
  - Balance neto
  - Cuentas por cobrar/pagar
- **Gráficos**:
  - Flujo de caja mensual (barras comparativas ingreso vs gasto)
  - Evolución de saldos por cuenta (línea)
  - Top 10 categorías de gasto (horizontal bar)
  - Distribución por moneda (donut)

### Dashboard de Nómina
- **KPIs**:
  - Total nómina del mes
  - Empleados pagados
  - Préstamos activos
  - Próximo pago
- **Gráficos**:
  - Evolución de nómina últimos 12 meses
  - Distribución por departamento
  - Deducciones por tipo

### Dashboard de Proyectos
- **KPIs**:
  - Proyectos activos
  - Rentabilidad promedio
  - Horas trabajadas
  - Proyectos atrasados
- **Gráficos**:
  - Gantt de proyectos
  - Presupuesto vs Real por proyecto
  - Distribución de equipo

### Dashboard de Flota
- **KPIs**:
  - Vehículos activos
  - Costo promedio por vehículo
  - Mantenimientos pendientes
  - Consumo de combustible
- **Gráficos**:
  - Costos por vehículo (barras)
  - Consumo de combustible (línea)
  - Distribución de costos (pie)

### Librerías Recomendadas
- **Recharts**: Gráficos React
- **MUI X Charts**: Integrado con Material UI
- **ApexCharts**: Alternativa con más opciones

---

## ⚙️ CONFIGURACIÓN DE USUARIO

### Funcionalidades
Cada usuario debe poder personalizar su experiencia:

#### Página de Configuración (`/settings`)
- **Perfil**:
  - Cambiar nombre
  - Cambiar foto de perfil
  - Cambiar email
- **Seguridad**:
  - Cambiar contraseña
  - Ver sesiones activas
  - Cerrar otras sesiones
- **Preferencias**:
  - **Idioma**: Selector ES/EN/PT (guarda en BD y localStorage)
  - **Tema**: Claro/Oscuro/Sistema
  - **Zona horaria**
  - **Formato de fecha**
  - **Formato de moneda**
- **Notificaciones**:
  - Alertas de vencimientos
  - Notificaciones de aprobación
  - Resumen diario/semanal

#### Backend
- Modelo `UserPreferences` o campo JSONB en `User`
- Endpoint `PUT /api/auth/preferences`
- Endpoint `GET /api/auth/preferences`

#### Frontend
- Página `/settings` con tabs
- Persistencia de idioma en BD (no solo localStorage)
- Hook `useUserPreferences()`

### Idioma por Defecto
- **Sistema**: Español (es)
- **Usuario nuevo**: Hereda del sistema
- **Usuario existente**: Usa su preferencia guardada

---

## ✅ SPRINT 4 - Módulo de Caja Chica (100%)

### Backend
- [x] Modelo PettyCash (caja chica)
- [x] Modelo PettyCashEntry (movimientos)
- [x] Servicio de caja chica (validaciones, estadísticas)
- [x] Controlador con CRUD completo
- [x] Endpoint `/petty-cash/:id/full` con trazabilidad
- [x] Límites y alertas de reposición
- [x] Aprobación de gastos

### Frontend
- [x] Página de listado de cajas chicas
- [x] Página de detalle con tabs
- [x] Formulario de creación/edición como página completa (`/petty-cash/new`, `/petty-cash/:id/edit`)
- [x] Diálogo de registro de gastos
- [x] Diálogo de reposición
- [x] Aprobación/rechazo de movimientos
- [x] Estadísticas y KPIs
- [ ] Vista detalle con trazabilidad a empleado y proyecto

---

## ✅ SPRINT 5 - Módulo de Proyectos (100%)

### Backend
- [x] Modelo Project (información general, cliente, presupuesto, estado)
- [x] Modelo ProjectMember (asignación de empleados con rol y dedicación)
- [x] Modelo ProjectMilestone (hitos con peso para progreso)
- [x] Modelo ProjectExpense (gastos del proyecto con aprobación)
- [x] Servicio de proyectos (generación de códigos, cálculo de progreso, estadísticas)
- [x] Controlador con CRUD completo
- [x] Rutas protegidas con permisos
- [x] Endpoint `/projects/:id/full` con trazabilidad completa

### Frontend
- [x] Página de listado de proyectos (tabla/cards responsive)
- [x] Formulario de creación/edición como página completa
- [x] Vista detalle con tabs: Info, Equipo, Hitos, Gastos, Auditoría
- [x] Gestión de miembros del equipo
- [x] Gestión de hitos con completación
- [x] Gestión de gastos con aprobación/rechazo
- [x] Stats cards con KPIs del proyecto
- [x] Barra de progreso visual

### Trazabilidad
- [x] Empleados asignados con enlace a su detalle
- [x] Gastos con estado y aprobación
- [x] Historial de auditoría
- [ ] Vehículos asignados (pendiente módulo Flota)
- [ ] Materiales utilizados (pendiente módulo Inventario)

---

## ✅ SPRINT 5.1 - Proyectos Internos vs Contratados (100%)

### Backend
- [x] Campo `executionType` en modelo Project (INTERNAL, OUTSOURCED)
- [x] Modelo ProjectUpdate para seguimiento de proyectos
- [x] Modelo ProjectPhoto para registros fotográficos
- [x] Campo `projectId` en PettyCashEntry para trazabilidad
- [x] Generación de códigos diferenciados (PRJ-INT-XXX, PRJ-CTR-XXX)
- [x] Endpoints para updates: crear, listar, eliminar
- [x] Endpoints para photos: agregar, listar, actualizar, eliminar
- [x] Catálogos de tipos de actualización y categorías de fotos
- [x] Migración para nuevos campos y tablas

### Frontend
- [x] Selector de tipo de ejecución al crear proyecto
- [x] Filtro por tipo de ejecución en lista de proyectos
- [x] Chip de tipo en lista y cards
- [x] Tab de Seguimiento con actualizaciones
- [x] Tab de Fotos con galería
- [x] Diálogo para crear actualizaciones
- [x] Diálogo para agregar fotos

### Diferencias por Tipo
**Proyectos Internos (INTERNAL)**:
- Ejecutados por personal de la empresa
- Asignación de empleados (ProjectMember)
- Hitos y tareas internas (ProjectMilestone)
- Gastos de caja chica con trazabilidad al proyecto

**Proyectos Contratados (OUTSOURCED)**:
- Ejecutados por contratistas externos
- Contratista asignado (Contractor)
- Monto del contrato y pagos
- Seguimiento y fotos para verificación del avance

---

## ✅ SPRINT 6 - Módulo de Inventario (100%)

### Backend
- [x] Modelo Warehouse (almacenes: MAIN, SECONDARY, TRANSIT, PROJECT)
- [x] Modelo InventoryItem (items con stock, costos, niveles)
- [x] Modelo InventoryMovement (movimientos con tipos y razones)
- [x] Modelo InventoryCategory (categorías jerárquicas)
- [x] Modelo WarehouseStock (stock por almacén)
- [x] Servicio de inventario (códigos, stock, costo promedio)
- [x] Controlador con CRUD completo
- [x] Rutas protegidas con permisos `inventory:*`

### Frontend
- [x] Página de items (`/inventory`) con filtros y paginación
- [x] Página de almacenes (`/inventory/warehouses`)
- [x] Página de movimientos (`/inventory/movements`)
- [x] Formularios de creación/edición como páginas completas
- [x] Vista detalle de item con tabs (info, stock por almacén, movimientos)
- [x] Vista detalle de almacén con stock y movimientos
- [x] Responsive (cards en mobile, tablas en desktop)

### Trazabilidad e Integración
- [x] Movimientos enlazados a proyectos
- [x] Movimientos enlazados a empleados
- [x] Integración con Finanzas: compras generan transacciones automáticas
- [x] Catálogos de tipos (almacén, item, movimiento, unidades)

---

## ✅ SPRINT 7 - Módulo de Flota (100%)

### Backend
- [x] Modelo Vehicle (información completa del vehículo, documentos, vencimientos)
- [x] Modelo VehicleAssignment (asignaciones a empleados/proyectos/departamentos)
- [x] Modelo VehicleMaintenance (mantenimientos preventivos y correctivos)
- [x] Modelo FuelLog (registros de combustible con trazabilidad)
- [x] Servicio de flota con lógica de negocio completa
- [x] Controlador y rutas de flota
- [x] Estadísticas y alertas de flota

### Frontend
- [x] Página de vehículos con filtros y estadísticas
- [x] Vista detalle: Info, Asignaciones, Mantenimientos, Combustible, Costos
- [x] Formulario de vehículos (página completa)
- [x] Lista y formulario de mantenimientos
- [x] Lista y formulario de registros de combustible
- [x] Responsive (cards en mobile, tablas en desktop)
- [x] Alertas de documentos por vencer

### Trazabilidad
- [x] Asignación actual (empleado/proyecto/departamento)
- [x] Historial de asignaciones con kilometraje
- [x] Costos totales del vehículo (mantenimiento + combustible)
- [x] Documentos del vehículo con alertas de vencimiento
- [x] Consumo promedio de combustible
- [x] Integración con empleados, proyectos y finanzas

---

## 🔲 SPRINT 8-11 - Módulos Adicionales

- **Procura**: Proveedores, órdenes de compra, cotizaciones
- **HSE**: Incidentes, inspecciones, capacitaciones
- **Documentos**: Gestión documental centralizada
- **Reportes**: Dashboard ejecutivo, reportes personalizados

---

## 🧪 PLAN DE PRUEBAS

### Política de Pruebas

**REGLA**: Cada endpoint debe ser probado antes de considerar una funcionalidad completa.

### Checklist de Pruebas por Endpoint

#### Autenticación ✅
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Get Me
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### Empleados ✅
```bash
# Listar
curl http://localhost:5000/api/employees -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","idNumber":"V12345678",...}'

# Obtener por ID
curl http://localhost:5000/api/employees/{id} -H "Authorization: Bearer $TOKEN"

# Actualizar
curl -X PUT http://localhost:5000/api/employees/{id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated"}'

# Eliminar
curl -X DELETE http://localhost:5000/api/employees/{id} \
  -H "Authorization: Bearer $TOKEN"
```

#### Nómina ✅
```bash
# Períodos - CRUD
curl http://localhost:5000/api/payroll/periods -H "Authorization: Bearer $TOKEN"
curl http://localhost:5000/api/payroll/periods/{id} -H "Authorization: Bearer $TOKEN"

# Generar entradas
curl -X POST http://localhost:5000/api/payroll/periods/{id}/generate \
  -H "Authorization: Bearer $TOKEN"

# Aprobar
curl -X POST http://localhost:5000/api/payroll/periods/{id}/approve \
  -H "Authorization: Bearer $TOKEN"

# Marcar como pagado
curl -X POST http://localhost:5000/api/payroll/periods/{id}/pay \
  -H "Authorization: Bearer $TOKEN"

# Préstamos
curl http://localhost:5000/api/payroll/loans -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:5000/api/payroll/loans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"...","amount":100,"totalInstallments":2,"startDate":"2025-01-01"}'
```

#### Finanzas ✅
```bash
# Cuentas
curl http://localhost:5000/api/finance/accounts -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:5000/api/finance/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cuenta Principal","accountType":"CHECKING","currency":"USD"}'

# Transacciones
curl http://localhost:5000/api/finance/transactions -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:5000/api/finance/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transactionType":"EXPENSE","accountId":"...","amount":50,"category":"SUPPLIES","description":"Test","transactionDate":"2025-12-04"}'

# Transferencias
curl -X POST http://localhost:5000/api/finance/transfers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId":"...","toAccountId":"...","amount":100,"transactionDate":"2025-12-04","description":"Transfer test"}'

# Estadísticas
curl http://localhost:5000/api/finance/stats -H "Authorization: Bearer $TOKEN"
```

### Script de Pruebas Automatizadas

Crear archivo `backend/tests/api-tests.sh`:

```bash
#!/bin/bash
# Script de pruebas de API

BASE_URL="http://localhost:5000/api"
TOKEN=""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Login y obtener token
login() {
  TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin123!"}' | jq -r '.data.token')
  
  if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login exitoso${NC}"
  else
    echo -e "${RED}✗ Login fallido${NC}"
    exit 1
  fi
}

# Test genérico
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=$4
  
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN")
  fi
  
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ $method $endpoint - Status: $status${NC}"
  else
    echo -e "${RED}✗ $method $endpoint - Expected: $expected_status, Got: $status${NC}"
    echo "$body" | jq .
  fi
}

# Ejecutar pruebas
echo "=== Iniciando pruebas de API ==="
login

echo ""
echo "=== Auth ==="
test_endpoint "GET" "/auth/me" "" 200

echo ""
echo "=== Employees ==="
test_endpoint "GET" "/employees" "" 200
test_endpoint "GET" "/employees/stats" "" 200

echo ""
echo "=== Payroll ==="
test_endpoint "GET" "/payroll/periods" "" 200
test_endpoint "GET" "/payroll/loans" "" 200
test_endpoint "GET" "/payroll/stats" "" 200

echo ""
echo "=== Finance ==="
test_endpoint "GET" "/finance/accounts" "" 200
test_endpoint "GET" "/finance/transactions" "" 200
test_endpoint "GET" "/finance/stats" "" 200
test_endpoint "GET" "/finance/exchange-rates" "" 200

echo ""
echo "=== Pruebas completadas ==="
```

---

## 📝 Notas de Desarrollo

### Servicios Activos
- **PostgreSQL**: puerto 5433 (Docker)
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Credenciales
- **Usuario**: `admin`
- **Contraseña**: `Admin123!`

### Comandos Útiles
```bash
# Iniciar servicios
cd backend && npm run dev
cd frontend && npm run dev

# Ver logs del backend
tail -f backend/logs/combined.log

# Ejecutar pruebas
cd backend && bash tests/api-tests.sh
```

---

## 📌 Próximos Pasos Inmediatos

1. ~~**Implementar vistas de detalle** con trazabilidad completa~~ ✅
2. ~~**Crear página de detalle de empleado** como modelo~~ ✅
3. ~~**Agregar enlaces entre entidades** en todas las vistas~~ ✅ (EntityLink)
4. ~~**Implementar módulo de Caja Chica**~~ ✅
5. ~~**Vista detalle de préstamo** con historial de pagos~~ ✅
6. ~~**Eliminar modales para crear/editar** - usar páginas completas~~ ✅
7. ~~**Mejorar organigrama** con vista por departamentos~~ ✅
8. **Agregar gráficos de evolución de saldo** en cuentas
9. **Crear dashboards con KPIs** por módulo
10. ~~**Implementar módulo de Proyectos**~~ ✅
11. **Implementar módulo de Inventario**
12. **Implementar módulo de Flota**

---

## 📝 Cambios v0.12.0 (2025-12-05)

### Sprint 11 - Reportes & Dashboard (En Progreso)
- ✅ **Backend**: Módulo de Dashboard con endpoints consolidados
  - `/api/dashboard/stats` - Estadísticas principales
  - `/api/dashboard/cash-flow` - Flujo de caja mensual
  - `/api/dashboard/projects-by-status` - Proyectos por estado
  - `/api/dashboard/employees-by-department` - Empleados por departamento
  - `/api/dashboard/alerts` - Alertas pendientes
  - `/api/dashboard/activity` - Actividad reciente
- ✅ **Frontend**: Dashboard Principal mejorado
  - KPIs de empleados, proyectos, finanzas, inventario, flota
  - Gráfico de flujo de caja mensual (BarChart)
  - Gráfico de proyectos por estado (PieChart)
  - Gráfico de gastos por categoría (BarChart horizontal)
  - Panel de alertas con navegación
  - Saldos por moneda con barras de progreso
  - Presupuesto de proyectos vs gastado
  - 100% responsive
- ✅ **Frontend**: Dashboard Financiero
  - KPIs de ingresos, gastos, balance neto
  - Gráfico de flujo de caja con áreas
  - Gráfico de cuentas por tipo (PieChart)
  - Gráfico de gastos por categoría
  - Gráfico de balance neto mensual (LineChart)
  - Selector de año para filtrar datos
- ✅ **Frontend**: Dashboard de Proyectos
  - KPIs de proyectos totales, activos, completados, atrasados
  - Gráfico de proyectos por estado (PieChart)
  - Gráfico de proyectos por prioridad (BarChart)
  - Presupuesto total vs gastado con barra de progreso
  - Lista de proyectos activos con navegación
- ✅ **Frontend**: Dashboard de Inventario
  - KPIs de items, almacenes, stock bajo, valor total
  - Gráfico de items por tipo (PieChart)
  - Gráfico de stock por almacén (BarChart)
  - Lista de items con stock bajo
- ✅ **Frontend**: Dashboard de Flota
  - KPIs de vehículos totales, activos, en mantenimiento, docs por vencer
  - Gráfico de vehículos por estado (PieChart)
  - Gráfico de vehículos por tipo (BarChart)
  - Lista de mantenimientos programados
- 🔲 **Pendiente**: Dashboard de Nómina

---

## 📝 Cambios v0.11.0 (2025-12-05)

### Módulo de Documentos - Completo
- ✅ **Backend**: Modelos Document, DocumentCategory, DocumentVersion, DocumentShare
- ✅ **Backend**: Controlador con CRUD completo para documentos y categorías
- ✅ **Backend**: Workflow de documentos (borrador → revisión → aprobado/rechazado → archivado)
- ✅ **Backend**: Sistema de versiones de documentos
- ✅ **Backend**: Compartición de documentos por usuario o departamento
- ✅ **Backend**: Estadísticas y alertas de vencimiento
- ✅ **Backend**: Rutas protegidas con permisos `documents:*`
- ✅ **Frontend**: Slice de Redux con todas las acciones
- ✅ **Frontend**: Dashboard con KPIs y acciones rápidas
- ✅ **Frontend**: Listado con filtros por estado, tipo, categoría
- ✅ **Frontend**: Vista detalle con tabs (Info, Versiones, Compartido)
- ✅ **Frontend**: Formulario de creación/edición como página completa
- ✅ **Frontend**: Gestión de categorías jerárquicas
- ✅ **Frontend**: Acciones de workflow (enviar a revisión, aprobar, rechazar, archivar)

#### Características del Módulo
- **Tipos de Documento**: Contrato, Convenio, Política, Procedimiento, Manual, Formulario, Informe, Certificado, Licencia, Permiso, Factura, Recibo, Carta, Memorando, Acta, Especificación, Plano, Fotografía, Documento de Identidad, Otro
- **Estados**: Borrador, Pendiente de Revisión, Aprobado, Rechazado, Vencido, Archivado, Cancelado
- **Confidencialidad**: Público, Interno, Confidencial, Restringido
- **Entidades Relacionadas**: Empleado, Proyecto, Contratista, Vehículo, Cuenta Bancaria, Caja Chica, Incidente, Capacitación, Inspección, Orden de Compra, Factura, General
- **Módulos de Categorías**: General, Empleados, Proyectos, Contratistas, Flota, Finanzas, HSE, Legal, Administrativo

---

## 📝 Cambios v0.6.0 (2025-12-04)

### Módulo de Proyectos - Completo
- ✅ **Backend**: Modelos Project, ProjectMember, ProjectMilestone, ProjectExpense
- ✅ **Backend**: Servicio con generación de códigos, cálculo de progreso, estadísticas
- ✅ **Backend**: Controlador con CRUD completo y endpoints de trazabilidad
- ✅ **Backend**: Rutas protegidas con permisos `projects:*`
- ✅ **Frontend**: Slice de Redux con todas las acciones
- ✅ **Frontend**: Página de listado con tabla/cards responsive
- ✅ **Frontend**: Formulario de creación/edición como página completa
- ✅ **Frontend**: Vista detalle con tabs (Info, Equipo, Hitos, Gastos, Auditoría)
- ✅ **Frontend**: Gestión de miembros del equipo con roles
- ✅ **Frontend**: Gestión de hitos con completación y cálculo de progreso
- ✅ **Frontend**: Gestión de gastos con aprobación/rechazo
- ✅ **i18n**: Traducciones en español

---

## 📝 Cambios v0.5.1 (2025-12-04)

### UI/UX - Eliminación de Modales
- ✅ Préstamos: Nuevo formulario `/payroll/loans/new`, detalle `/payroll/loans/:id`
- ✅ Cuentas Bancarias (Finance): Formulario `/finance/accounts/new`, `/finance/accounts/:id/edit`
- ✅ Caja Chica: Formulario `/petty-cash/new`, `/petty-cash/:id/edit`
- ✅ Cuentas Bancarias (Empleado): Formulario `/employees/:id/accounts/new`, `/employees/:id/accounts/:id/edit`

### Organigrama Mejorado
- ✅ Toggle entre vista por Departamentos y vista por Jerarquía
- ✅ Nodos de departamento con color, manager y contador de empleados
- ✅ Vista responsive (lista en móvil, árbol en desktop)

### Aprobaciones en Detalle
- ✅ Aprobación de préstamos movida a página de detalle con confirmación
- ✅ Cancelación de préstamos con confirmación explícita

### Gestión de Cuentas Bancarias de Empleados
- ✅ Agregar, editar, eliminar cuentas desde el detalle del empleado
- ✅ Establecer cuenta como primaria
- ✅ Formulario completo con tipos: Corriente, Ahorro, Pago Móvil, Zelle, Crypto

---

## 📝 Cambios v0.12.0 (2025-12-05)

### Sprint 12: Sistema de Usuarios y Permisos Granulares

#### Backend
- ✅ Migración: Campos `action`, `field`, `permissionType` en tabla `permissions`
- ✅ Migración: Campo `employee_id` en tabla `users` para vincular con empleados
- ✅ Migración: Campo `must_change_password` en tabla `users`
- ✅ Seeder: 100+ permisos granulares organizados por módulo
- ✅ Seeder: 8 roles predefinidos con permisos específicos
- ✅ Middleware `authorizeField`: Control de acceso a campos/tabs específicos
- ✅ Middleware `authorizeOwn`: Verificación de acceso a recursos propios
- ✅ Helper `checkPermission`: Verificación jerárquica de permisos
- ✅ CRUD completo de usuarios con vinculación a empleados
- ✅ CRUD completo de roles con asignación de permisos
- ✅ Endpoints de permisos agrupados por módulo

#### Frontend
- ✅ Hook `usePermission`: Verificación de permisos en componentes
- ✅ Hook `usePermissions`, `useAnyPermission`, `useAllPermissions`
- ✅ Componente `PermissionGate`: Renderizado condicional por permisos
- ✅ Componente `CanDo`: Wrapper simple para acciones
- ✅ Slice Redux `usersSlice`: Estado de usuarios
- ✅ Slice Redux `rolesSlice`: Estado de roles y permisos
- ✅ Página `/admin/users`: Lista de usuarios con filtros y estadísticas
- ✅ Página `/admin/users/new`: Crear usuario con roles y empleado
- ✅ Página `/admin/users/:id`: Detalle de usuario con permisos consolidados
- ✅ Página `/admin/users/:id/edit`: Editar usuario
- ✅ Página `/admin/roles`: Lista de roles con conteo de usuarios
- ✅ Página `/admin/roles/new`: Crear rol con selector de permisos por módulo
- ✅ Página `/admin/roles/:id`: Detalle de rol con usuarios y permisos
- ✅ Página `/admin/roles/:id/edit`: Editar rol
- ✅ Menú de Administración en sidebar
- ✅ Tabs dinámicos en EmployeeDetail según permisos del usuario

#### Formato de Permisos
```
modulo:accion[:campo]

Ejemplos:
- employees:*           → Acceso completo al módulo
- employees:read        → Ver lista de empleados
- employees:read:payroll → Ver tab de nómina en detalle
- loans:approve         → Aprobar préstamos
```

#### Roles Predefinidos
1. **Super Administrador**: `*:*` (acceso total)
2. **Gerente General**: Lectura y aprobaciones en todos los módulos
3. **Gerente Administrativo**: RRHH, Nómina, Finanzas, Documentos
4. **Gerente de Operaciones**: Proyectos, Inventario, Flota, HSE
5. **Contador**: Finanzas, Nómina (lectura y pago)
6. **Jefe de RRHH**: Empleados, Préstamos, Nómina
7. **Supervisor de Proyecto**: Proyectos asignados, Inventario, Flota
8. **Empleado**: Perfil propio, solicitar préstamos, gastos de caja chica

#### Documentación
- ✅ `docs/PLANIFICACION_USUARIOS_PERMISOS.md`: Planificación completa del sistema
