# 📚 ROADMAP - Manual de Usuario ERP

**Última actualización:** 2025-12-17  
**Propósito:** Planificación para documentación de cada módulo del sistema

---

## 📋 Estructura de Documentación por Módulo

Cada módulo tendrá su propia carpeta con:

```
docs/manual/
├── ROADMAP_MANUAL.md          # Este archivo (planificación)
├── 00-introduccion/           # Introducción general al sistema
│   ├── descripcion.md         # Qué es el ERP, para quién es
│   ├── guia-uso.md            # Cómo acceder, login, navegación básica
│   └── screenshots/           # Capturas de pantalla
├── 01-empleados/
│   ├── descripcion.md         # Qué hace el módulo
│   ├── guia-uso.md            # Cómo usar cada funcionalidad
│   └── screenshots/           # Capturas de pantalla
├── 02-organizacion/
│   ├── descripcion.md
│   ├── guia-uso.md
│   └── screenshots/
... (un folder por cada módulo)
```

---

## 📝 Formato de Archivos

### descripcion.md
- Qué hace el módulo
- Funcionalidades principales
- Ejemplos de uso / casos de uso
- Entidades que maneja
- Relaciones con otros módulos

### guia-uso.md
- Cómo acceder al módulo
- Cómo listar elementos
- Cómo crear un nuevo elemento
- Cómo editar un elemento
- Cómo eliminar un elemento
- Tabs y características especiales
- Filtros y búsquedas
- Acciones especiales (aprobar, rechazar, etc.)
- Tips y mejores prácticas

### screenshots/
- Capturas de cada pantalla importante
- Nombradas descriptivamente: `lista.png`, `detalle.png`, `formulario-crear.png`, etc.

---

## 🗂️ Lista de Módulos a Documentar

| # | Módulo | Carpeta | Estado | Prioridad |
|---|--------|---------|--------|-----------|
| 0 | Introducción | `00-introduccion` | ✅ Completado | Alta |
| 1 | Empleados | `01-empleados` | ✅ Completado | Alta |
| 2 | Organización | `02-organizacion` | ✅ Completado | Alta |
| 3 | Nómina | `03-nomina` | ✅ Completado | Alta |
| 4 | Finanzas | `04-finanzas` | ✅ Completado | Alta |
| 5 | Caja Chica | `05-caja-chica` | ✅ Completado | Media |
| 6 | Proyectos | `06-proyectos` | ✅ Completado | Alta |
| 7 | Inventario | `07-inventario` | ✅ Completado | Alta |
| 8 | Flota | `08-flota` | ✅ Completado | Media |
| 9 | Procura | `09-procura` | ✅ Completado | Alta |
| 10 | HSE | `10-hse` | ✅ Completado | Media |
| 11 | Documentos | `11-documentos` | ✅ Completado | Media |
| 12 | Dashboard | `12-dashboard` | ✅ Completado | Alta |
| 13 | Usuarios y Permisos | `13-usuarios` | ✅ Completado | Alta |
| 14 | Activos Fijos | `14-activos` | ✅ Completado | Media |
| 15 | CRM | `15-crm` | ✅ Completado | Media |
| 16 | Control de Calidad | `16-calidad` | ✅ Completado | Media |
| 17 | Producción y Pozos | `17-produccion` | ✅ Completado | Alta |
| 18 | AFE | `18-afe` | ✅ Completado | Alta |
| 19 | Contratos O&G | `19-contratos` | ✅ Completado | Alta |
| 20 | Compliance | `20-compliance` | ✅ Completado | Media |
| 21 | JIB | `21-jib` | ✅ Completado | Media |
| 22 | Permisos de Trabajo | `22-permisos-trabajo` | ✅ Completado | Media |
| 23 | WhatsApp | `23-whatsapp` | ✅ Completado | Baja |
| 24 | Email | `24-email` | ✅ Completado | Baja |
| 25 | Configuración | `25-configuracion` | ✅ Completado | Media |

---

## 🔧 Instrucciones para Documentar un Módulo

### Paso 1: Preparación
1. Revisar ROADMAP.md y ROADMAP_V2.md para entender el módulo
2. Identificar todas las rutas frontend del módulo
3. Identificar modelos y funcionalidades backend

### Paso 2: Crear Carpeta
```bash
mkdir -p docs/manual/XX-nombre-modulo/screenshots
```

### Paso 3: Crear descripcion.md
- Describir propósito del módulo
- Listar funcionalidades
- Dar ejemplos de uso

### Paso 4: Crear guia-uso.md
- Documentar cada acción paso a paso
- Incluir referencias a screenshots

### Paso 5: Tomar Screenshots con Puppeteer

**Resolución estándar: 2560x1600**

```
# Autenticación (primera vez, usar allowDangerous y launchOptions)
1. mcp2_puppeteer_navigate → http://localhost:5173
   - launchOptions: {"headless": true, "args": ["--no-sandbox", "--disable-setuid-sandbox"]}
   - allowDangerous: true
2. mcp2_puppeteer_fill → input[type="text"] → admin
3. mcp2_puppeteer_fill → input[type="password"] → Admin123!
4. mcp2_puppeteer_click → button[type="submit"]

# Navegar al módulo
5. mcp2_puppeteer_navigate → http://localhost:5173/ruta-del-modulo

# Tomar screenshot
6. mcp2_puppeteer_screenshot → name: nombre-descriptivo, width: 2560, height: 1600
```

### Paso 6: Guardar Screenshots
Los screenshots se guardan automáticamente y deben moverse a la carpeta correspondiente.

---

## 📊 Detalle por Módulo

### 00 - Introducción
**Rutas:** `/login`, `/dashboard`
**Contenido:**
- Qué es el ERP
- Requisitos del sistema
- Cómo acceder (login)
- Navegación básica (sidebar, header)
- Cambio de idioma
- Cambio de tema (claro/oscuro)

---

### 01 - Empleados
**Rutas:** `/employees`, `/employees/new`, `/employees/:id`, `/employees/:id/edit`
**Modelos:** Employee, EmployeeDocument, EmployeeBankAccount
**Funcionalidades:**
- Lista de empleados con búsqueda y filtros
- Crear nuevo empleado
- Ver detalle con tabs:
  - Información personal
  - Datos laborales
  - Cuentas bancarias
  - Jerarquía (supervisor/subordinados)
  - Nómina (historial)
  - Préstamos
  - Documentos
  - Auditoría
- Editar empleado
- Gestionar cuentas bancarias
- Gestionar documentos

---

### 02 - Organización
**Rutas:** `/organization/departments`, `/organization/positions`, `/organization/chart`, `/organization/directory`
**Modelos:** Department, Position
**Funcionalidades:**
- Gestión de departamentos (jerárquicos)
- Gestión de cargos/posiciones
- Organigrama interactivo
- Directorio de empleados

---

### 03 - Nómina
**Rutas:** `/payroll/periods`, `/payroll/periods/:id`, `/payroll/loans`, `/payroll/loans/:id`
**Modelos:** PayrollPeriod, PayrollEntry, EmployeeLoan, LoanPayment
**Funcionalidades:**
- Períodos de nómina (crear, generar, aprobar, pagar)
- Detalle de período con entradas
- Préstamos (crear, aprobar, pagos)
- Deducciones venezolanas (SSO, RPE, FAOV, ISLR)

---

### 04 - Finanzas
**Rutas:** `/finance/accounts`, `/finance/transactions`, `/finance/exchange-rates`
**Modelos:** BankAccount, Transaction, TransactionCategory, ExchangeRate
**Funcionalidades:**
- Cuentas bancarias (múltiples tipos y monedas)
- Transacciones (ingresos, gastos)
- Transferencias entre cuentas
- Tasas de cambio
- Dashboard financiero

---

### 05 - Caja Chica
**Rutas:** `/petty-cash`, `/petty-cash/new`, `/petty-cash/:id`
**Modelos:** PettyCash, PettyCashEntry
**Funcionalidades:**
- Fondos de caja chica
- Registro de gastos
- Reposiciones
- Aprobación de movimientos

---

### 06 - Proyectos
**Rutas:** `/projects`, `/projects/new`, `/projects/:id`, `/projects/:id/edit`
**Modelos:** Project, ProjectMember, ProjectMilestone, ProjectExpense, ProjectUpdate, ProjectPhoto, Contractor
**Funcionalidades:**
- Lista de proyectos
- Crear/editar proyecto
- Detalle con tabs:
  - Información general
  - Equipo (miembros)
  - Hitos
  - Gastos
  - Seguimiento (updates)
  - Fotos
  - Auditoría
- Contratistas
- Valuaciones

---

### 07 - Inventario
**Rutas:** `/inventory`, `/inventory/warehouses`, `/inventory/movements`
**Modelos:** Warehouse, InventoryItem, InventoryMovement, InventoryCategory, WarehouseStock
**Funcionalidades:**
- Items de inventario
- Almacenes
- Movimientos (entrada, salida, transferencia)
- Stock por almacén
- Alertas de stock bajo

---

### 08 - Flota
**Rutas:** `/fleet`, `/fleet/vehicles/:id`, `/fleet/maintenance`, `/fleet/fuel`
**Modelos:** Vehicle, VehicleAssignment, VehicleMaintenance, FuelLog
**Funcionalidades:**
- Vehículos
- Asignaciones (empleado/proyecto/departamento)
- Mantenimientos
- Registro de combustible
- Costos operativos

---

### 09 - Procura
**Rutas:** `/procurement/quotes`, `/procurement/purchase-orders`
**Modelos:** Quote, QuoteItem, PurchaseOrder, PurchaseOrderItem
**Funcionalidades:**
- Solicitudes de cotización
- Cotizaciones de proveedores
- Órdenes de compra
- Recepción de mercancía

---

### 10 - HSE
**Rutas:** `/hse`, `/hse/incidents`, `/hse/inspections`, `/hse/training`
**Modelos:** Incident, Inspection, Training, TrainingAttendance, SafetyEquipment
**Funcionalidades:**
- Registro de incidentes
- Inspecciones de seguridad
- Capacitaciones
- Control de EPP

---

### 11 - Documentos
**Rutas:** `/documents`, `/documents/:id`, `/documents/categories`
**Modelos:** Document, DocumentVersion, DocumentCategory, DocumentShare
**Funcionalidades:**
- Gestión documental
- Versionamiento
- Categorías
- Compartir documentos
- Workflow (borrador → revisión → aprobado)

---

### 12 - Dashboard
**Rutas:** `/dashboard`, `/dashboard/finance`, `/dashboard/projects`, etc.
**Funcionalidades:**
- KPIs generales
- Gráficos de flujo de caja
- Alertas
- Widgets por módulo

---

### 13 - Usuarios y Permisos
**Rutas:** `/users`, `/roles`, `/permissions`
**Modelos:** User, Role, Permission
**Funcionalidades:**
- Gestión de usuarios
- Roles y permisos
- Asignación de roles

---

### 14 - Activos Fijos
**Rutas:** `/assets`, `/assets/:id`, `/assets/categories`
**Modelos:** Asset, AssetCategory, AssetMaintenance, AssetTransfer, AssetDepreciation
**Funcionalidades:**
- Registro de activos
- Categorías
- Depreciación
- Transferencias
- Mantenimientos

---

### 15 - CRM
**Rutas:** `/crm`, `/crm/clients`, `/crm/opportunities`
**Modelos:** Client, ClientContact, Opportunity, CrmQuote, CrmActivity
**Funcionalidades:**
- Clientes
- Contactos
- Oportunidades (pipeline)
- Cotizaciones
- Actividades

---

### 16 - Control de Calidad
**Rutas:** `/quality`, `/quality/inspections`, `/quality/non-conformances`
**Modelos:** QualityPlan, QualityInspection, NonConformance, CorrectiveAction, QualityCertificate
**Funcionalidades:**
- Planes de calidad
- Inspecciones
- No conformidades
- Acciones correctivas (CAPA)
- Certificados

---

### 17 - Producción y Pozos
**Rutas:** `/production`, `/production/fields`, `/production/wells`, `/production/daily`
**Modelos:** Field, Well, WellProduction, ProductionAllocation, MorningReport, WellLog
**Funcionalidades:**
- Campos petroleros
- Pozos
- Producción diaria
- Allocations mensuales
- Bitácoras de pozos
- Reportes matutinos

---

### 18 - AFE
**Rutas:** `/afe`, `/afe/list`, `/afe/:id`
**Modelos:** AFE, AFECategory, AFEApproval, AFEExpense, AFEVariance
**Funcionalidades:**
- Autorizaciones de gasto
- Categorías de AFE
- Flujo de aprobación
- Registro de gastos
- Variaciones

---

### 19 - Contratos O&G
**Rutas:** `/contracts`, `/contracts/:id`, `/concessions`
**Modelos:** OGContract, ContractParty, WorkingInterest, RoyaltyPayment, Concession
**Funcionalidades:**
- Contratos petroleros
- Partes del contrato
- Working interest
- Regalías
- Concesiones

---

### 20 - Compliance
**Rutas:** `/compliance`, `/compliance/reports`, `/compliance/permits`
**Modelos:** RegulatoryReport, EnvironmentalPermit, ComplianceAudit
**Funcionalidades:**
- Reportes regulatorios
- Permisos ambientales
- Auditorías de cumplimiento

---

### 21 - JIB (Joint Interest Billing)
**Rutas:** `/jib`, `/jib/statements`, `/jib/cash-calls`
**Modelos:** JIBStatement, JIBLineItem, CashCall
**Funcionalidades:**
- Estados de cuenta JIB
- Líneas de detalle
- Cash calls

---

### 22 - Permisos de Trabajo
**Rutas:** `/work-permits`, `/work-permits/:id`
**Modelos:** WorkPermit, WorkPermitApproval
**Funcionalidades:**
- Permisos de trabajo
- Flujo de aprobación
- Tipos de permiso (caliente, frío, altura, etc.)

---

### 23 - WhatsApp
**Rutas:** `/settings/whatsapp`
**Modelos:** WhatsAppSession, WhatsAppTemplate, WhatsAppLog
**Funcionalidades:**
- Configuración de sesión
- Plantillas de mensaje
- Historial de envíos

---

### 24 - Email
**Rutas:** `/settings/email`
**Modelos:** EmailConfig, EmailTemplate, EmailLog
**Funcionalidades:**
- Configuración SMTP
- Plantillas de email
- Historial de envíos

---

### 25 - Configuración
**Rutas:** `/settings`
**Funcionalidades:**
- Perfil de usuario
- Cambio de contraseña
- Preferencias (idioma, tema)
- Notificaciones

---

## ✅ Progreso de Documentación

```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```

**Total módulos:** 26  
**Documentados:** 0  
**Pendientes:** 26

---

## 📌 Notas

- Los screenshots deben tomarse con el sistema corriendo (backend + frontend)
- Usar resolución 1280x800 para consistencia
- Nombrar screenshots de forma descriptiva
- Actualizar este roadmap al completar cada módulo
