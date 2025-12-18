# 🗺️ ROADMAP V2 - ERP Sistema Petrolero

**Última actualización:** 2025-01-27  
**Versión actual:** 0.17.0  
**Tipo de empresa:** Petrolera mediana (upstream/midstream)

---

## 📊 Resumen Ejecutivo

Este roadmap documenta el estado actual del ERP y los módulos pendientes necesarios para una empresa petrolera mediana. Se divide en:

1. **Módulos Core ERP** - Funcionalidades empresariales generales (95% completado)
2. **Módulos Específicos O&G** - Funcionalidades específicas de la industria petrolera (20% completado)
3. **Mejoras Técnicas** - Optimizaciones de infraestructura y UX

---

## 🎯 Visión General de Progreso

### Módulos Core ERP (Completados)

| Sprint | Módulo | Estado | Descripción |
|--------|--------|--------|-------------|
| 0 | Setup & Fundamentos | ✅ 100% | Infraestructura, auth, i18n |
| 1 | Empleados | ✅ 100% | RRHH, documentos, org structure |
| 2 | Nómina | ✅ 100% | Períodos, deducciones VE, préstamos |
| 3 | Finanzas | ✅ 100% | Cuentas, transacciones, tasas cambio |
| 4 | Caja Chica | ✅ 100% | Gastos menores, reembolsos |
| 5 | Proyectos | ✅ 100% | Contratistas, hitos, valuaciones |
| 6 | Inventario | ✅ 100% | Almacenes, items, movimientos |
| 7 | Flota | ✅ 100% | Vehículos, mantenimiento, combustible |
| 8 | Procura | ✅ 100% | Cotizaciones, órdenes de compra |
| 9 | HSE | ✅ 100% | Incidentes, inspecciones, EPP |
| 10 | Documentos | ✅ 100% | Gestión documental, versiones |
| 11 | Dashboard | ✅ 100% | KPIs, gráficos |
| 12 | Usuarios/Permisos | ✅ 100% | RBAC, roles |
| 13 | Attachments | ✅ 100% | Archivos adjuntos polimórficos |
| 14 | WhatsApp | ✅ 100% | Notificaciones Baileys |
| 15 | Email | ✅ 100% | SMTP, plantillas |
| 16 | Assets | ✅ 100% | Activos fijos, depreciación |
| 17 | CRM | ✅ 100% | Clientes, oportunidades |
| 18 | Quality | ✅ 100% | Inspecciones, NC, CAPA |

### Módulos Pendientes

| Sprint | Módulo | Prioridad | Estado | Esfuerzo Est. |
|--------|--------|-----------|--------|---------------|
| 19 | Reportes Avanzados | Alta | ✅ 100% | 2 semanas |
| 20 | Producción y Pozos | **Crítica** | ✅ 100% | 4 semanas |
| 21 | AFE (Autorizaciones) | **Crítica** | ✅ 100% | 2 semanas |
| 22 | Contratos O&G | **Crítica** | ✅ 100% | 3 semanas |
| 23 | Compliance Regulatorio | Alta | ✅ 100% | 2 semanas |
| 24 | Joint Interest Billing | Alta | ✅ 100% | 2 semanas |
| 25 | Permisos de Trabajo | Media | ✅ 100% | 2 semanas |
| 26 | Reservas | Media | 🔲 0% | 2 semanas |
| 27 | Transporte Hidrocarburos | Media | 🔲 0% | 2 semanas |
| 28 | Mejoras Técnicas | Continua | 🔲 0% | Ongoing |

**Progreso Total: ~92%** (considerando módulos O&G)

```
Módulos Core:     [██████████████████████████████] 100%
Módulos O&G:      [█████████████████████████░░░░░] 85%
Total Proyecto:   [████████████████████████████░░] 92%
```

---

## ⚠️ REGLAS OBLIGATORIAS PARA NUEVOS MÓDULOS

> **IMPORTANTE:** Todos los nuevos módulos DEBEN cumplir con estas reglas antes de considerarse completados.

### 1. 100% Responsive (Mobile-First)

Cada página y componente debe ser completamente responsive:

```jsx
// ✅ OBLIGATORIO: Usar Grid con breakpoints
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Component />
  </Grid>
</Grid>

// ✅ OBLIGATORIO: Tablas → Cards en mobile
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
{isMobile ? <CardList data={data} /> : <DataTable data={data} />}

// ✅ OBLIGATORIO: Formularios responsive
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <TextField fullWidth label="Campo" />
  </Grid>
</Grid>

// ✅ OBLIGATORIO: Padding/margin responsive
sx={{ p: { xs: 1, sm: 2, md: 3 } }}
```

**Breakpoints MUI:**
- `xs`: 0-599px (móvil)
- `sm`: 600-899px (tablet)
- `md`: 900-1199px (laptop)
- `lg`: 1200px+ (desktop)

**Checklist Responsive:**
- [ ] Lista de entidades: Cards en mobile, Tabla en desktop
- [ ] Formularios: Campos en columna única en mobile
- [ ] Tabs: scrollables en mobile (`variant="scrollable"`)
- [ ] Botones: `fullWidth` en mobile
- [ ] Sidebar: colapsable en mobile
- [ ] Modales: solo para confirmaciones, NO para formularios

### 2. Multi-idioma (i18n) Obligatorio

Cada nuevo módulo DEBE incluir traducciones en los 3 idiomas soportados:

**Archivos a modificar:**
```
frontend/src/i18n/locales/
├── es.json   # Español (idioma por defecto)
├── en.json   # Inglés
└── pt.json   # Portugués
```

**Estructura de traducciones por módulo:**
```json
{
  "production": {
    "title": "Producción",
    "fields": {
      "title": "Campos",
      "wells": "Pozos",
      "dailyProduction": "Producción Diaria"
    },
    "form": {
      "fieldName": "Nombre del Campo",
      "wellCode": "Código del Pozo",
      "oilVolume": "Volumen de Petróleo (bbl)"
    },
    "status": {
      "active": "Activo",
      "inactive": "Inactivo",
      "shutIn": "Cerrado"
    },
    "messages": {
      "created": "Registro creado exitosamente",
      "updated": "Registro actualizado",
      "deleted": "Registro eliminado"
    }
  }
}
```

**Uso en componentes:**
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Typography>{t('production.title')}</Typography>
    <TextField label={t('production.form.fieldName')} />
  );
};
```

**Checklist i18n:**
- [ ] Todas las etiquetas de UI traducidas
- [ ] Mensajes de éxito/error traducidos
- [ ] Opciones de select/dropdown traducidas
- [ ] Tooltips y placeholders traducidos
- [ ] Títulos de páginas traducidos
- [ ] Breadcrumbs traducidos
- [ ] Columnas de tablas traducidas
- [ ] Botones de acción traducidos

### 3. NO Modales para Crear/Editar

**PROHIBIDO:** Usar modales/dialogs para formularios de creación o edición.

**PERMITIDO:** Modales solo para:
- Confirmaciones (eliminar, aprobar)
- Alertas y notificaciones
- Previews rápidos

**Patrón de rutas obligatorio:**
```
/module              → Lista (tabla/cards)
/module/new          → Formulario de creación (página completa)
/module/:id          → Vista detalle con tabs
/module/:id/edit     → Formulario de edición (página completa)
```

### 4. Checklist de Completitud por Módulo

Antes de marcar un módulo como completado, verificar:

**Backend:**
- [ ] Modelos con validaciones
- [ ] Servicio con lógica de negocio
- [ ] Controlador con CRUD completo
- [ ] Rutas protegidas con permisos
- [ ] Endpoints probados con curl/Postman
- [ ] Seeders de datos de prueba

**Frontend:**
- [ ] Redux slice con thunks
- [ ] Página de lista (responsive)
- [ ] Página de detalle con tabs
- [ ] Formulario de crear (página completa)
- [ ] Formulario de editar (página completa)
- [ ] Dashboard/KPIs del módulo
- [ ] Menú lateral actualizado

**i18n:**
- [ ] Traducciones en es.json
- [ ] Traducciones en en.json
- [ ] Traducciones en pt.json

**Permisos:**
- [ ] Permisos definidos en seeder
- [ ] Permisos asignados a roles
- [ ] Rutas protegidas en frontend

---

## ✅ MÓDULOS CORE COMPLETADOS (Sprints 0-18)

### Sprint 0 - Setup & Fundamentos ✅

**Infraestructura:**
- Docker Compose con PostgreSQL 16 (puerto 5433)
- Backend: Node.js + Express + Sequelize
- Frontend: React + Vite + Material UI + Redux Toolkit
- Variables de entorno configuradas

**Backend Base:**
- Conexión a BD con Sequelize ORM
- Sistema de logging (Winston)
- Manejo de errores centralizado
- Middleware JWT + RBAC

**Frontend Base:**
- Redux Toolkit para estado global
- React Router para navegación
- Tema MUI personalizado
- Layout con sidebar colapsable
- Login y Dashboard inicial

**Autenticación:**
- Modelos: User, Role, Permission
- Relaciones many-to-many
- JWT tokens
- Cambio de contraseña
- Seeders iniciales

**i18n:**
- i18next configurado
- Idiomas: ES (default), EN, PT
- Selector de idioma en UI
- Persistencia en localStorage

---

### Sprint 1 - Empleados ✅

**Modelos:**
- `Employee` - Datos personales, laborales, bancarios
- `EmployeeDocument` - Documentos con vencimiento
- `Department` - Departamentos jerárquicos
- `Position` - Cargos
- `EmployeeBankAccount` - Cuentas bancarias

**Funcionalidades:**
- CRUD completo con soft delete
- Paginación y búsqueda
- Estados: activo, inactivo, licencia, terminado
- Documentos con alertas de vencimiento

**Rutas Frontend:**
- `/employees` - Lista
- `/employees/new` - Crear
- `/employees/:id` - Detalle con tabs
- `/employees/:id/edit` - Editar

---

### Sprint 2 - Nómina ✅

**Modelos:**
- `PayrollPeriod` - Períodos de nómina
- `PayrollEntry` - Entradas por empleado
- `EmployeeLoan` - Préstamos
- `LoanPayment` - Pagos de préstamos

**Deducciones Venezolanas:**
- SSO (4%)
- RPE (0.5%)
- FAOV (1%)
- ISLR (simplificado)

**Funcionalidades:**
- Generación automática de entradas
- Cálculo proporcional por días
- Gestión de préstamos con cuotas
- Flujo: Borrador → Aprobado → Pagado

---

### Sprint 3 - Finanzas ✅

**Modelos:**
- `BankAccount` - Cuentas bancarias
- `Transaction` - Transacciones
- `TransactionCategory` - Categorías
- `ExchangeRate` - Tasas de cambio

**Funcionalidades:**
- Multi-moneda (USD, VES, USDT)
- Ingresos y egresos
- Transferencias entre cuentas
- Dashboard financiero

---

### Sprint 4 - Caja Chica ✅

**Modelos:**
- `PettyCash` - Fondos de caja chica
- `PettyCashEntry` - Movimientos
- `ExpenseReport` - Reportes de gastos
- `ExpenseReportItem` - Items de reporte

**Funcionalidades:**
- Registro de fondos
- Gastos por empleado
- Flujo de aprobación
- Conciliación

---

### Sprint 5 - Proyectos ✅

**Modelos:**
- `Project` - Proyectos
- `ProjectMember` - Miembros del equipo
- `ProjectMilestone` - Hitos
- `ProjectExpense` - Gastos
- `ProjectUpdate` - Actualizaciones
- `ProjectPhoto` - Fotos de avance
- `ProjectValuation` - Valuaciones
- `Contractor` - Contratistas
- `ContractorInvoice` - Facturas
- `ContractorPayment` - Pagos

**Funcionalidades:**
- Gestión de contratistas
- Registro de avances con fotos
- Presupuesto vs real
- Hitos y timeline

---

### Sprint 6 - Inventario ✅

**Modelos:**
- `Warehouse` - Almacenes (MAIN, SECONDARY, TRANSIT, PROJECT)
- `InventoryCategory` - Categorías jerárquicas
- `InventoryItem` - Items
- `WarehouseStock` - Stock por almacén
- `InventoryMovement` - Movimientos
- `Product` - Productos
- `InventoryUnit` - Unidades serializadas

**Tipos de Movimiento:**
- ENTRY, EXIT, TRANSFER
- ADJUSTMENT_IN, ADJUSTMENT_OUT
- RETURN, RESERVATION, RELEASE

**Funcionalidades:**
- Códigos automáticos
- Costo promedio ponderado
- Stock mínimo/máximo
- Alertas de reorden

---

### Sprint 7 - Flota ✅

**Modelos:**
- `Vehicle` - Vehículos
- `VehicleAssignment` - Asignaciones
- `VehicleMaintenance` - Mantenimientos
- `FuelLog` - Registro de combustible

**Funcionalidades:**
- Asignación a empleados/proyectos
- Programación de mantenimientos
- Consumo de combustible
- Costos operativos

---

### Sprint 8 - Procura ✅

**Modelos:**
- `Quote` - Cotizaciones de proveedores
- `QuoteItem` - Items de cotización
- `QuoteRequest` - Solicitudes de cotización
- `PurchaseOrder` - Órdenes de compra
- `PurchaseOrderItem` - Items de OC

**Funcionalidades:**
- Solicitud de cotizaciones
- Comparación de ofertas
- Generación de OC
- Recepción de mercancía

---

### Sprint 9 - HSE (Seguridad Industrial) ✅

**Modelos:**
- `Incident` - Incidentes
- `Inspection` - Inspecciones de seguridad
- `Training` - Capacitaciones
- `TrainingAttendance` - Asistencia
- `SafetyEquipment` - EPP

**Funcionalidades:**
- Registro de incidentes
- Inspecciones programadas
- Control de EPP por empleado
- Capacitaciones con certificados

---

### Sprint 10 - Documentos ✅

**Modelos:**
- `Document` - Documentos
- `DocumentVersion` - Versiones
- `DocumentCategory` - Categorías
- `DocumentShare` - Compartir

**Funcionalidades:**
- Versionamiento automático
- Categorización
- Permisos por documento
- Búsqueda

---

### Sprint 11-12 - Dashboard y Usuarios ✅

**Dashboard:**
- KPIs por módulo
- Gráficos con Recharts
- Widgets de alertas
- Actividad reciente

**Usuarios:**
- Gestión de usuarios
- Asignación de roles
- Permisos granulares
- Auditoría de acciones

---

### Sprint 13 - Attachments ✅

**Modelo:**
- `Attachment` - Relación polimórfica

**Entidades Soportadas:**
- transaction, petty_cash_entry, vehicle_maintenance
- fuel_log, contractor_payment, project_expense
- project, incident, inspection, quote
- purchase_order, contractor_invoice, inventory_movement
- loan_payment, employee_document, training

**Características:**
- Drag & drop upload
- Thumbnails automáticos
- Galería con lightbox
- Máx 10MB/archivo

---

### Sprint 14-15 - WhatsApp y Email ✅

**WhatsApp (Baileys):**
- `WhatsAppSession` - Sesiones
- `UserWhatsApp` - Configuración usuario
- `WhatsAppTemplate` - Plantillas
- `WhatsAppLog` - Historial

**Email (Nodemailer):**
- `EmailConfig` - Configuración SMTP
- `EmailTemplate` - Plantillas
- `UserEmail` - Email de usuario
- `EmailLog` - Historial

---

### Sprint 16 - Assets (Activos Fijos) ✅

**Modelos:**
- `AssetCategory` - Categorías
- `Asset` - Activos
- `AssetMaintenance` - Mantenimientos
- `AssetTransfer` - Transferencias
- `AssetDepreciation` - Depreciación

**Funcionalidades:**
- Registro de activos
- Depreciación automática
- Transferencias entre ubicaciones
- Mantenimientos programados

---

### Sprint 17 - CRM ✅

**Modelos:**
- `Client` - Clientes (empresas/personas)
- `ClientContact` - Contactos
- `Opportunity` - Oportunidades
- `CrmQuote` - Cotizaciones
- `CrmQuoteItem` - Items
- `CrmActivity` - Actividades

**Funcionalidades:**
- Pipeline de ventas
- Seguimiento de oportunidades
- Cotizaciones
- Actividades y tareas

---

### Sprint 18 - Control de Calidad ✅

**Modelos:**
- `QualityPlan` - Planes de calidad
- `QualityInspection` - Inspecciones
- `NonConformance` - No conformidades
- `CorrectiveAction` - Acciones correctivas
- `QualityCertificate` - Certificados

**Funcionalidades:**
- Planes por proyecto
- Inspecciones con resultados
- NC con clasificación
- CAPA (Acciones Correctivas/Preventivas)

---

## 🔲 MÓDULOS PENDIENTES - CORE ERP

### Sprint 19 - Reportes Avanzados 🔲

**Prioridad:** Alta  
**Esfuerzo estimado:** 2 semanas  
**Dependencias:** Todos los módulos anteriores

#### Backend - Por hacer
- [ ] Servicio de generación de reportes
- [ ] Exportación a PDF (pdfkit o puppeteer)
- [ ] Exportación a Excel (exceljs)
- [ ] Programación de reportes automáticos
- [ ] Caché de reportes pesados

#### Reportes Requeridos

**Nómina:**
- [ ] Recibo de pago individual (PDF)
- [ ] Resumen de período (PDF/Excel)
- [ ] Histórico por empleado
- [ ] Deducciones consolidadas

**Finanzas:**
- [ ] Estado de resultados (P&L)
- [ ] Balance general
- [ ] Flujo de caja
- [ ] Conciliación bancaria

**Proyectos:**
- [ ] Avance de proyecto
- [ ] Presupuesto vs real
- [ ] Rentabilidad por proyecto
- [ ] Pagos a contratistas

**Inventario:**
- [ ] Valorización de inventario
- [ ] Movimientos por período
- [ ] Items bajo stock mínimo
- [ ] Rotación de inventario

**HSE:**
- [ ] Estadísticas de incidentes
- [ ] Inspecciones por período
- [ ] Capacitaciones completadas
- [ ] Vencimientos de EPP

#### Frontend - Por hacer
- [ ] Página `/reports` con categorías
- [ ] Selector de parámetros (fechas, filtros)
- [ ] Preview en pantalla
- [ ] Botones de descarga PDF/Excel
- [ ] Historial de reportes generados

---

## 🛢️ MÓDULOS ESPECÍFICOS OIL & GAS (Nuevos)

### Sprint 20 - Producción y Pozos ✅ (100%)

**Prioridad:** CRÍTICA  
**Esfuerzo estimado:** 4 semanas  
**Justificación:** Módulo core para cualquier empresa petrolera upstream  
**Estado:** COMPLETADO

#### Descripción
Gestión de pozos petroleros, producción diaria, allocations y reportes operacionales.
Este es el módulo más importante para diferenciar el ERP como solución petrolera.

#### ✅ Implementado

**Backend:**
- ✅ Modelos: Field, Well, WellProduction, ProductionAllocation, MorningReport, **WellLog (NUEVO)**
- ✅ Servicio completo con CRUD, estadísticas y dashboard
- ✅ Rutas API protegidas con permisos
- ✅ Seeders con datos de prueba completos
- ✅ **Bitácoras de pozos** (mantenimientos, workovers, incidentes, inspecciones)
- ✅ **Vinculación de proyectos y órdenes de compra a pozos/campos**
- ✅ **Tipos de levantamiento artificial** (ESP, Balancín, Gas Lift, BCP, etc.)

**Frontend:**
- ✅ Dashboard de producción con KPIs
- ✅ Lista de campos con filtros
- ✅ **Detalle de campo** con tabs (producción, pozos, información)
- ✅ Formulario de campo (crear/editar)
- ✅ Lista de pozos con filtros
- ✅ **Detalle de pozo** con tabs (producción, bitácoras, técnico, información)
- ✅ **Formulario de pozo** completo (crear/editar)
- ✅ **Gráficos de producción** con selector de fechas (Recharts)
- ✅ Traducciones i18n (ES, EN, PT)
- ✅ 100% responsive (mobile-first)
- ✅ **Producción Diaria** - Lista, Formulario, Detalle con verificación/aprobación
- ✅ **Allocations Mensuales** - Lista, Detalle, Generación automática

**Nuevas funcionalidades:**
- ✅ WellLog: Sistema de bitácoras para mantenimientos, workovers, incidentes
- ✅ Vinculación de proyectos a pozos/campos
- ✅ Vinculación de órdenes de compra a pozos/campos
- ✅ Campos adicionales en Well: pump_model, pump_depth, motor_hp, strokes_per_minute
- ✅ Acumulados de producción en Well: cumulative_oil, cumulative_gas, cumulative_water
- ✅ Fechas de mantenimiento: last_maintenance_date, next_maintenance_date

#### Backend - Modelos

```
Field (Campos petroleros) ✅
├── id, code, name, location
├── type: ONSHORE | OFFSHORE
├── status: ACTIVE | INACTIVE | ABANDONED
├── coordinates (lat, lng)
├── discovery_date, production_start_date
└── operator_id, working_interest

Well (Pozos) ✅ MEJORADO
├── id, code, name, field_id
├── type: PRODUCER | INJECTOR | OBSERVATION | DISPOSAL | EXPLORATION
├── status: ACTIVE | INACTIVE | SHUT_IN | ABANDONED | DRILLING | WORKOVER
├── spud_date, completion_date, first_production_date
├── total_depth, current_depth, perforation_top, perforation_bottom
├── api_gravity, formation
├── artificial_lift: NONE | ESP | ROD_PUMP | GAS_LIFT | PCP | BCP | ...
├── pump_model, pump_depth_ft, motor_hp, strokes_per_minute
├── cumulative_oil_bbl, cumulative_gas_mcf, cumulative_water_bbl
├── last_maintenance_date, next_maintenance_date
└── coordinates

WellProduction (Producción diaria) ✅
├── id, well_id, production_date
├── oil_volume (bbl), gas_volume (mcf), water_volume (bbl)
├── oil_rate, gas_rate, water_rate
├── choke_size, tubing_pressure, casing_pressure
├── hours_on, downtime_hours, downtime_reason
├── bsw (%), api_gravity
└── reported_by, verified_by

WellLog (Bitácoras de pozos) ✅ NUEVO
├── id, well_id, log_type, log_date
├── title, description, status, priority
├── start_date, end_date, downtime_hours
├── cost_estimated, cost_actual
├── contractor_id, project_id, purchase_order_id
├── findings, actions_taken, recommendations
└── responsible_id, created_by

ProductionAllocation (Allocations mensuales) ✅
├── id, field_id, month, year
├── total_oil, total_gas, total_water
├── allocated_oil, allocated_gas
└── allocation_method, status

MorningReport (Reportes matutinos) ✅
├── id, report_date, field_id
├── summary, issues, actions
├── total_production, wells_producing
├── wells_down, downtime_summary
└── created_by
```

#### Backend - API Endpoints

```
GET    /api/production/fields              # Lista de campos
POST   /api/production/fields              # Crear campo
GET    /api/production/fields/:id          # Detalle campo
PUT    /api/production/fields/:id          # Actualizar campo
DELETE /api/production/fields/:id          # Eliminar campo

GET    /api/production/wells               # Lista de pozos
POST   /api/production/wells               # Crear pozo
GET    /api/production/wells/:id           # Detalle pozo
PUT    /api/production/wells/:id           # Actualizar pozo
GET    /api/production/wells/:id/production # Historial producción

POST   /api/production/daily               # Registrar producción diaria
GET    /api/production/daily               # Consultar producción
PUT    /api/production/daily/:id           # Corregir registro

GET    /api/production/allocations         # Allocations
POST   /api/production/allocations/generate # Generar allocation mensual

GET    /api/production/morning-reports     # Reportes matutinos
POST   /api/production/morning-reports     # Crear reporte

GET    /api/production/dashboard           # KPIs de producción
GET    /api/production/statistics          # Estadísticas
```

#### Frontend - Páginas

```
/production                    → Dashboard de producción
/production/fields             → Lista de campos
/production/fields/new         → Nuevo campo
/production/fields/:id         → Detalle campo con pozos
/production/fields/:id/edit    → Editar campo

/production/wells              → Lista de pozos
/production/wells/new          → Nuevo pozo
/production/wells/:id          → Detalle pozo (tabs: info, producción, gráficos)
/production/wells/:id/edit     → Editar pozo

/production/daily              → Captura de producción diaria
/production/daily/entry        → Formulario de entrada rápida

/production/allocations        → Allocations mensuales
/production/morning-reports    → Reportes matutinos
```

#### Dashboard de Producción - KPIs

- Producción total del día (bbl oil, mcf gas)
- Producción acumulada del mes
- Pozos activos vs inactivos
- Gráfico de tendencia de producción
- Top 10 pozos productores
- Pozos con problemas (downtime)
- Comparativo mes actual vs anterior

#### Permisos

```
production:*        # Todos los permisos
production:read     # Ver producción
production:create   # Registrar producción
production:update   # Modificar registros
production:delete   # Eliminar registros
production:approve  # Aprobar allocations
```

---

### Sprint 21 - AFE (Authorization for Expenditure) ✅ COMPLETADO

**Prioridad:** CRÍTICA  
**Esfuerzo estimado:** 2 semanas  
**Justificación:** Control de presupuesto para proyectos de capital en O&G  
**Completado:** 2024-12-17

#### Descripción
Sistema de autorización de gastos de capital (CAPEX) con flujo de aprobación
multinivel. Esencial para control financiero en proyectos petroleros.

#### Backend - Modelos

```
AFE (Autorización de Gasto)
├── id, code (AFE-YYYY-XXXX)
├── title, description
├── type: DRILLING | WORKOVER | FACILITIES | EXPLORATION | OTHER
├── project_id, field_id, well_id (opcionales)
├── estimated_cost, currency
├── start_date, end_date
├── status: DRAFT | PENDING | APPROVED | REJECTED | CLOSED
├── justification
├── created_by, approved_by, approved_at
└── closed_at, final_cost, variance

AFECategory (Categorías de AFE)
├── id, afe_id
├── category: DRILLING | COMPLETION | FACILITIES | SERVICES | CONTINGENCY
├── description
├── estimated_amount
└── actual_amount

AFEApproval (Flujo de Aprobación)
├── id, afe_id
├── approver_id, approval_level
├── status: PENDING | APPROVED | REJECTED
├── comments
└── approved_at

AFEExpense (Gastos contra AFE)
├── id, afe_id, category_id
├── description, vendor
├── amount, currency
├── invoice_number, invoice_date
├── transaction_id (link a finanzas)
└── created_by, approved_by

AFEVariance (Variaciones)
├── id, afe_id
├── variance_type: COST | SCOPE | SCHEDULE
├── description, amount
├── justification
├── status: PENDING | APPROVED
└── requested_by, approved_by
```

#### Backend - API Endpoints

```
GET    /api/afe                    # Lista de AFEs
POST   /api/afe                    # Crear AFE
GET    /api/afe/:id                # Detalle AFE
PUT    /api/afe/:id                # Actualizar AFE
DELETE /api/afe/:id                # Eliminar AFE (solo draft)

POST   /api/afe/:id/submit         # Enviar a aprobación
POST   /api/afe/:id/approve        # Aprobar
POST   /api/afe/:id/reject         # Rechazar
POST   /api/afe/:id/close          # Cerrar AFE

GET    /api/afe/:id/expenses       # Gastos del AFE
POST   /api/afe/:id/expenses       # Registrar gasto
GET    /api/afe/:id/variance       # Variaciones
POST   /api/afe/:id/variance       # Solicitar variación

GET    /api/afe/dashboard          # KPIs
GET    /api/afe/pending-approvals  # Pendientes de aprobar
```

#### Frontend - Páginas

```
/afe                    → Dashboard AFE
/afe/list               → Lista de AFEs
/afe/new                → Crear AFE
/afe/:id                → Detalle AFE (tabs: info, categorías, gastos, aprobaciones)
/afe/:id/edit           → Editar AFE
/afe/pending            → Pendientes de aprobación
```

#### Flujo de Aprobación

```
1. Usuario crea AFE en estado DRAFT
2. Agrega categorías y estimados
3. Envía a aprobación (PENDING)
4. Aprobadores según nivel de monto:
   - < $10,000: Supervisor
   - $10,000 - $100,000: Gerente
   - > $100,000: Director + VP
5. Si aprobado → APPROVED, se pueden registrar gastos
6. Si rechazado → REJECTED, puede editar y reenviar
7. Al completar → CLOSED con costo final y varianza
```

#### Dashboard AFE - KPIs

- AFEs activos y su valor total
- Presupuesto aprobado vs ejecutado
- Variaciones pendientes
- AFEs por vencer
- Top AFEs por monto
- Gráfico de ejecución mensual

---

### Sprint 22 - Contratos O&G ✅ COMPLETADO

**Prioridad:** CRÍTICA  
**Esfuerzo estimado:** 3 semanas  
**Justificación:** Gestión de contratos petroleros, JVs y participaciones
**Completado:** Enero 2025

#### Descripción
Gestión de contratos de operación, joint ventures, concesiones y
participaciones (working interest) en campos y pozos.

#### Backend - Modelos

```
OGContract (Contratos O&G)
├── id, code, name
├── type: PSA | SERVICE | JOA | CONCESSION | FARMOUT | OTHER
│   - PSA: Production Sharing Agreement
│   - SERVICE: Contrato de Servicios
│   - JOA: Joint Operating Agreement
│   - CONCESSION: Concesión
│   - FARMOUT: Cesión de participación
├── description
├── start_date, end_date, renewal_date
├── status: DRAFT | ACTIVE | EXPIRED | TERMINATED
├── operator_id (empresa operadora)
├── government_entity (ente gubernamental)
├── royalty_rate (% regalías)
├── cost_recovery_limit (% límite recuperación costos)
└── attachments

ContractParty (Partes del Contrato)
├── id, contract_id
├── party_type: OPERATOR | PARTNER | GOVERNMENT
├── party_name, party_id (client_id o contractor_id)
├── working_interest (% participación)
├── cost_bearing_interest
├── revenue_interest
└── is_operator (boolean)

WorkingInterest (Participación por Activo)
├── id, contract_id, party_id
├── asset_type: FIELD | WELL | BLOCK
├── asset_id
├── working_interest (%)
├── net_revenue_interest (%)
├── effective_date, end_date
└── status

RoyaltyPayment (Pagos de Regalías)
├── id, contract_id
├── period_month, period_year
├── production_volume, production_value
├── royalty_rate, royalty_amount
├── payment_date, payment_reference
├── status: CALCULATED | PAID | PENDING
└── government_receipt

Concession (Concesiones/Bloques)
├── id, code, name
├── contract_id
├── location, coordinates (polygon)
├── area_km2
├── type: EXPLORATION | DEVELOPMENT | PRODUCTION
├── award_date, expiry_date
├── status: ACTIVE | RELINQUISHED | EXPIRED
└── commitments (JSON: work program)
```

#### Backend - API Endpoints

```
GET    /api/contracts                    # Lista contratos
POST   /api/contracts                    # Crear contrato
GET    /api/contracts/:id                # Detalle
PUT    /api/contracts/:id                # Actualizar
DELETE /api/contracts/:id                # Eliminar

GET    /api/contracts/:id/parties        # Partes del contrato
POST   /api/contracts/:id/parties        # Agregar parte
PUT    /api/contracts/:id/parties/:pid   # Actualizar participación

GET    /api/contracts/:id/working-interest  # Participaciones
POST   /api/contracts/:id/working-interest  # Registrar WI

GET    /api/contracts/:id/royalties      # Regalías
POST   /api/contracts/:id/royalties      # Calcular regalías

GET    /api/concessions                  # Concesiones
POST   /api/concessions                  # Crear concesión
GET    /api/concessions/:id              # Detalle
```

#### Frontend - Páginas

```
/contracts                    → Dashboard contratos
/contracts/list               → Lista de contratos
/contracts/new                → Nuevo contrato
/contracts/:id                → Detalle (tabs: info, partes, WI, regalías, docs)
/contracts/:id/edit           → Editar

/concessions                  → Lista de concesiones
/concessions/:id              → Detalle concesión con mapa
```

#### Funcionalidades Clave

- Cálculo automático de regalías según producción
- Alertas de vencimiento de contratos
- Distribución de costos por working interest
- Historial de cambios de participación
- Mapa de concesiones (integración GIS opcional)

---

### Sprint 23 - Compliance Regulatorio ✅

**Prioridad:** Alta  
**Esfuerzo estimado:** 2 semanas  
**Estado:** ✅ COMPLETADO  
**Justificación:** La industria petrolera es altamente regulada

#### Descripción
Gestión de cumplimiento regulatorio, permisos ambientales, auditorías
y reportes a entes gubernamentales.

#### Backend - Modelos

```
RegulatoryReport (Reportes Regulatorios)
├── id, code
├── type: PRODUCTION | ENVIRONMENTAL | FISCAL | SAFETY
├── entity: MENPET | SENIAT | INEA | MINEA | OTHER
├── period_start, period_end
├── due_date, submitted_date
├── status: DRAFT | PENDING | SUBMITTED | ACCEPTED | REJECTED
├── data (JSON con datos del reporte)
├── attachments
└── submitted_by, response_reference

EnvironmentalPermit (Permisos Ambientales)
├── id, code, name
├── type: EIA | WATER | EMISSIONS | WASTE | DRILLING
├── issuing_authority
├── issue_date, expiry_date
├── status: ACTIVE | EXPIRED | PENDING_RENEWAL | REVOKED
├── conditions (JSON)
├── field_id, project_id
└── attachments

ComplianceAudit (Auditorías)
├── id, code
├── type: INTERNAL | EXTERNAL | REGULATORY
├── auditor, auditor_company
├── scope, objectives
├── start_date, end_date
├── status: PLANNED | IN_PROGRESS | COMPLETED | CLOSED
├── findings (JSON array)
├── recommendations
└── follow_up_date

Policy (Políticas Internas)
├── id, code, title
├── category: HSE | OPERATIONS | HR | FINANCE | IT
├── version, effective_date
├── status: DRAFT | ACTIVE | SUPERSEDED
├── content, summary
├── approved_by, approved_date
└── next_review_date

Certification (Certificaciones)
├── id, name
├── type: ISO_9001 | ISO_14001 | ISO_45001 | API | OTHER
├── issuing_body
├── issue_date, expiry_date
├── scope
├── status: ACTIVE | EXPIRED | SUSPENDED
└── attachments
```

#### Frontend - Páginas

```
/compliance                    → Dashboard compliance
/compliance/reports            → Reportes regulatorios
/compliance/permits            → Permisos ambientales
/compliance/audits             → Auditorías
/compliance/policies           → Políticas
/compliance/certifications     → Certificaciones
```

#### Alertas Automáticas

- Permisos próximos a vencer (30, 60, 90 días)
- Reportes con fecha límite cercana
- Auditorías programadas
- Políticas que requieren revisión
- Certificaciones por renovar

---

### Sprint 24 - Joint Interest Billing (JIB) ✅

**Prioridad:** Alta  
**Esfuerzo estimado:** 2 semanas  
**Justificación:** Facturación a socios en operaciones conjuntas

#### Descripción
Sistema de facturación a socios (partners) en joint ventures,
distribución de costos según working interest y cash calls.

#### Backend - Modelos

```
JointInterestBilling (Facturación JIB)
├── id, code (JIB-YYYY-MM-XXXX)
├── contract_id
├── billing_period (month/year)
├── status: DRAFT | SENT | PARTIALLY_PAID | PAID | DISPUTED
├── total_costs
├── operator_share, partners_share
├── due_date
└── created_by, sent_date

JIBLineItem (Items del JIB)
├── id, jib_id
├── cost_category: DRILLING | COMPLETION | OPERATIONS | G&A | OTHER
├── description
├── amount
├── afe_id (opcional, link a AFE)
└── supporting_docs

JIBPartnerShare (Distribución por Socio)
├── id, jib_id, party_id
├── working_interest (%)
├── share_amount
├── status: PENDING | INVOICED | PAID | DISPUTED
├── invoice_number, invoice_date
├── payment_date, payment_reference
└── dispute_reason, dispute_resolved

CashCall (Solicitud de Fondos)
├── id, code
├── contract_id
├── purpose: OPERATIONS | AFE | EMERGENCY
├── description
├── total_amount
├── due_date
├── status: DRAFT | SENT | PARTIALLY_FUNDED | FUNDED
└── created_by

CashCallResponse (Respuesta de Socios)
├── id, cash_call_id, party_id
├── requested_amount
├── funded_amount
├── funded_date, payment_reference
└── status: PENDING | FUNDED | PARTIAL | DEFAULTED
```

#### Frontend - Páginas

```
/jib                    → Dashboard JIB
/jib/billings           → Lista de JIBs
/jib/billings/new       → Crear JIB
/jib/billings/:id       → Detalle JIB (tabs: items, distribución, pagos)

/jib/cash-calls         → Cash Calls
/jib/cash-calls/new     → Nuevo Cash Call
/jib/cash-calls/:id     → Detalle y respuestas
```

---

### Sprint 25 - Permisos de Trabajo (PTW) 🔲

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas  
**Justificación:** Extensión del módulo HSE para operaciones petroleras

#### Descripción
Sistema de permisos de trabajo para actividades de alto riesgo
en operaciones petroleras.

#### Backend - Modelos

```
WorkPermit (Permiso de Trabajo)
├── id, code (PTW-YYYY-XXXX)
├── type: HOT_WORK | CONFINED_SPACE | ELECTRICAL | EXCAVATION | 
│         LIFTING | WORKING_AT_HEIGHT | LOCKOUT_TAGOUT | GENERAL
├── title, description
├── location, field_id, well_id
├── work_description, hazards_identified
├── control_measures (JSON array)
├── start_datetime, end_datetime
├── status: DRAFT | PENDING | APPROVED | ACTIVE | CLOSED | CANCELLED
├── requested_by, approved_by
├── contractor_id (si aplica)
└── max_workers, actual_workers

WorkPermitChecklist (Checklist de Seguridad)
├── id, permit_id
├── checklist_type: PRE_WORK | DURING | POST_WORK
├── items (JSON array of checks)
├── completed_by, completed_at
└── all_passed (boolean)

WorkPermitExtension (Extensiones)
├── id, permit_id
├── original_end, new_end
├── reason
├── approved_by, approved_at
└── status

StopWorkAuthority (Parada de Trabajo)
├── id, permit_id (opcional)
├── location, description
├── reason, immediate_actions
├── reported_by, reported_at
├── resolved_by, resolved_at
├── status: OPEN | RESOLVED
└── lessons_learned
```

#### Frontend - Páginas

```
/hse/permits                → Lista de permisos
/hse/permits/new            → Solicitar permiso
/hse/permits/:id            → Detalle permiso
/hse/permits/active         → Permisos activos (tablero)
/hse/stop-work              → Registro de Stop Work
```

---

### Sprint 26 - Reservas de Hidrocarburos ✅

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas  
**Justificación:** Valoración de activos petroleros  
**Completado:** 2025-12-17

#### Descripción
Gestión de estimaciones de reservas de hidrocarburos según
estándares internacionales (PRMS, SEC).

#### Backend - Modelos ✅

```
ReserveEstimate (Estimación de Reservas)
├── id, code, field_id
├── estimate_date, effective_date
├── standard: PRMS | SEC | SPE | PDVSA | OTHER
├── evaluator: INTERNAL | EXTERNAL
├── evaluator_company, evaluator_name, report_number
├── methodology, assumptions (JSONB)
├── status: DRAFT | UNDER_REVIEW | APPROVED | SUPERSEDED | CANCELLED
├── approved_by, approved_at
├── superseded_by, superseded_at
└── notes, created_by

ReserveCategory (Categorías de Reservas)
├── id, estimate_id
├── category: 1P | 2P | 3P | 1C | 2C | 3C | PROSPECTIVE | UNRECOVERABLE
├── sub_category: DEVELOPED_PRODUCING | DEVELOPED_NON_PRODUCING | UNDEVELOPED | etc
├── oil_volume (MMbbl), gas_volume (Bcf)
├── condensate_volume (MMbbl), ngl_volume (MMbbl)
├── boe_volume (MMboe) - calculado
├── recovery_factor, ooip, ogip
└── notes

ReserveValuation (Valoración)
├── id, code, estimate_id
├── valuation_date
├── oil_price, gas_price, condensate_price
├── price_scenario: LOW | BASE | HIGH | STRIP | CUSTOM
├── discount_rate, royalty_rate, tax_rate
├── npv_1p, npv_2p, npv_3p
├── pv10_1p, pv10_2p, pv10_3p
├── undiscounted_cashflow, capex_required, opex_per_boe
├── methodology: DCF | COMPARABLE | COST | OPTION | HYBRID
├── assumptions, sensitivity_analysis (JSONB)
├── status: DRAFT | UNDER_REVIEW | APPROVED | SUPERSEDED
└── approved_by, approved_at, notes, created_by
```

#### Backend - Servicio y Rutas ✅

- **Servicio:** `reserveService.js`
- **Controlador:** `reserveController.js`
- **Rutas:** `/api/reserves/*`

#### Frontend - Páginas ✅

```
/reserves                    → Dashboard de reservas (KPIs, gráficos)
/reserves/estimates          → Lista de estimaciones
/reserves/estimates/new      → Nueva estimación
/reserves/estimates/:id      → Detalle con tabs (General, Categorías, Valoraciones)
/reserves/estimates/:id/edit → Editar estimación
/reserves/valuations         → Lista de valoraciones
/reserves/valuations/new     → Nueva valoración
/reserves/valuations/:id/edit → Editar valoración
```

#### Permisos ✅
- `reserves:*`, `reserves:read`, `reserves:create`, `reserves:update`, `reserves:delete`, `reserves:approve`

#### i18n ✅
- Traducciones completas en ES, EN, PT

#### Seeders ✅
- 3 estimaciones de reservas (2 aprobadas, 1 borrador)
- 11 categorías de reservas (1P, 2P, 3P con sub-categorías)
- 3 valoraciones (diferentes escenarios de precios)

---

### Sprint 27 - Transporte de Hidrocarburos ✅

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas  
**Justificación:** Logística de crudo y productos  
**Estado:** COMPLETADO

#### Descripción
Gestión de transporte de hidrocarburos: tickets de carga,
tanques de almacenamiento, calidad de crudo.

#### Backend - Modelos ✅

```
StorageTank (Tanques de Almacenamiento)
├── id, code, name
├── location, field_id
├── type: CRUDE | WATER | DIESEL | CHEMICALS | GAS | CONDENSATE
├── capacity, current_volume
├── diameter_ft, height_ft
├── last_gauging_date, last_inspection_date, next_inspection_date
└── status: ACTIVE | MAINTENANCE | OUT_OF_SERVICE | DECOMMISSIONED

TankGauging (Mediciones de Tanque)
├── id, tank_id
├── gauging_datetime
├── volume, temperature
├── api_gravity, bsw, level_inches
├── gauged_by, gauging_method
└── notes

LoadingTicket (Tickets de Carga)
├── id, code (TKT-YYYY-XXXX)
├── type: LOADING | UNLOADING | TRANSFER
├── source_tank_id, destination_tank_id, destination
├── vehicle_plate, driver_name, driver_id_number
├── carrier_company
├── product_type, api_gravity, bsw, temperature
├── gross_volume, net_volume
├── loading_start, loading_end
├── seal_numbers (JSON array)
├── initial_tank_volume, final_tank_volume
├── authorized_by, received_by
└── status: DRAFT | IN_PROGRESS | COMPLETED | CANCELLED | VOID

CrudeQuality (Calidad de Crudo)
├── id, code, field_id, tank_id
├── sample_date, sample_time, sample_point
├── api_gravity, bsw, sulfur_content
├── viscosity, pour_point, salt_content
├── h2s_content, reid_vapor_pressure, flash_point
├── lab_report_number, lab_name
├── sampled_by, analyzed_by
└── status: PENDING | ANALYZED | APPROVED | REJECTED

Pipeline (Ductos)
├── id, code, name
├── type: CRUDE | GAS | WATER | MULTIPHASE | CONDENSATE | DIESEL
├── origin, origin_field_id
├── destination, destination_field_id
├── length_km, diameter_inches, wall_thickness_inches
├── material, capacity_bpd, max_pressure_psi
├── installation_date, last_inspection_date, next_inspection_date
├── status: ACTIVE | MAINTENANCE | SHUTDOWN | DECOMMISSIONED
└── operator
```

- **Servicio:** `logisticsService.js`
- **Controlador:** `logisticsController.js`
- **Rutas:** `/api/logistics/*`

#### Frontend - Páginas ✅

```
/logistics                    → Dashboard logística (KPIs, gráficos)
/logistics/tanks              → Lista de tanques
/logistics/tanks/new          → Nuevo tanque
/logistics/tanks/:id          → Detalle tanque con historial de mediciones
/logistics/tanks/:id/edit     → Editar tanque
/logistics/tickets            → Lista de tickets de carga
/logistics/tickets/new        → Nuevo ticket
/logistics/tickets/:id        → Detalle ticket
/logistics/tickets/:id/edit   → Editar ticket
/logistics/quality            → Lista de muestras de calidad
/logistics/quality/new        → Nueva muestra
/logistics/quality/:id/edit   → Editar muestra
/logistics/pipelines          → Lista de ductos
/logistics/pipelines/new      → Nuevo ducto
/logistics/pipelines/:id/edit → Editar ducto
```

#### Permisos ✅
- `logistics:*`, `logistics:read`, `logistics:create`, `logistics:update`, `logistics:delete`, `logistics:approve`

#### i18n ✅
- Traducciones completas en ES, EN, PT

#### Seeders ✅
- 5 tanques de almacenamiento (diferentes tipos)
- 3 mediciones de tanque
- 3 tickets de carga (diferentes estados)
- 3 muestras de calidad de crudo
- 4 ductos (diferentes tipos)

---

## 🔧 MEJORAS TÉCNICAS PENDIENTES

### Sprint 28 - Mejoras de Seguridad 🔲

**Prioridad:** Alta  
**Esfuerzo estimado:** 1-2 semanas

#### Por Implementar

- [ ] **Rate Limiting**
  - Limitar requests por IP/usuario
  - Protección contra brute force
  - Librería: express-rate-limit

- [ ] **Encriptación de Datos Sensibles**
  - Encriptar datos bancarios (AES-256)
  - Encriptar contraseñas de servicios
  - Rotación de claves

- [ ] **Auditoría Completa**
  - Registro de todas las acciones CRUD
  - Cambios en datos sensibles
  - Exportación de logs de auditoría

- [ ] **Bloqueo por Intentos Fallidos**
  - Bloquear cuenta después de N intentos
  - Notificación al usuario
  - Desbloqueo automático o manual

- [ ] **2FA (Two-Factor Authentication)**
  - TOTP (Google Authenticator)
  - Backup codes
  - Opcional por usuario

---

### Sprint 29 - Mejoras de Performance 🔲

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas

#### Por Implementar

- [ ] **Caché con Redis**
  - Caché de consultas frecuentes
  - Sesiones en Redis
  - Invalidación inteligente

- [ ] **Optimización de Consultas**
  - Índices en BD
  - Eager loading optimizado
  - Query profiling

- [ ] **Lazy Loading Frontend**
  - Code splitting por ruta
  - Componentes lazy
  - Prefetch de rutas

- [ ] **Compresión de Imágenes**
  - Thumbnails automáticos (ya existe)
  - WebP conversion
  - CDN para assets

- [ ] **Paginación Optimizada**
  - Cursor-based pagination
  - Infinite scroll donde aplique

---

### Sprint 30 - DevOps y CI/CD 🔲

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas

#### Por Implementar

- [ ] **CI/CD Pipeline**
  - GitHub Actions o GitLab CI
  - Tests automáticos
  - Deploy automático a staging
  - Deploy manual a producción

- [ ] **Docker para Producción**
  - Dockerfile optimizado
  - Docker Compose para producción
  - Health checks

- [ ] **Backups Automáticos**
  - Backup diario de BD
  - Backup de archivos
  - Retención configurable
  - Restore testing

- [ ] **Monitoreo**
  - Sentry para errores
  - Prometheus + Grafana (opcional)
  - Alertas por email/WhatsApp
  - Uptime monitoring

- [ ] **Logging Centralizado**
  - ELK Stack o similar
  - Logs estructurados
  - Búsqueda de logs

---

### Sprint 31 - Mejoras UX/UI ✅

**Prioridad:** Media  
**Esfuerzo estimado:** 2 semanas  
**Completado:** 18 Dic 2024

#### Implementado

- [x] **Modo Oscuro**
  - Toggle en settings (`/settings`)
  - Persistencia en localStorage
  - Tema MUI dark dinámico
  - Archivos: `theme.js`, `uiSlice.js`, `ThemeWrapper.jsx`

- [x] **PWA (Progressive Web App)**
  - Service Worker (`public/sw.js`)
  - Manifest.json (`public/manifest.json`)
  - Instalable en móvil
  - Offline básico con cache
  - Iconos SVG para PWA

- [x] **Notificaciones Push**
  - Web Push API
  - Hook `usePushNotifications.js`
  - Configuración en `/settings`
  - Notificación de prueba
  - Soporte para VAPID keys

- [x] **Accesibilidad (WCAG)**
  - SkipLink para navegación por teclado
  - ARIA labels en componentes principales
  - FocusTrap para modales
  - VisuallyHidden para screen readers
  - Componentes en `components/accessibility/`

- [x] **Mejoras de Formularios**
  - Autoguardado de borradores (`useFormDraft.js`)
  - Validación en tiempo real (`ValidatedTextField.jsx`)
  - Atajos de teclado (`useKeyboardShortcuts.js`)
  - Componente `FormWithDraft.jsx`
  - Persistencia en localStorage

#### Archivos Creados
- `frontend/src/store/slices/uiSlice.js`
- `frontend/src/components/ThemeWrapper.jsx`
- `frontend/src/hooks/usePushNotifications.js`
- `frontend/src/hooks/useFormDraft.js`
- `frontend/src/hooks/useKeyboardShortcuts.js`
- `frontend/src/components/accessibility/SkipLink.jsx`
- `frontend/src/components/accessibility/FocusTrap.jsx`
- `frontend/src/components/accessibility/VisuallyHidden.jsx`
- `frontend/src/components/forms/FormWithDraft.jsx`
- `frontend/src/components/forms/ValidatedTextField.jsx`
- `frontend/public/manifest.json`
- `frontend/public/sw.js`
- `frontend/public/icons/icon-192x192.svg`
- `frontend/public/icons/icon-512x512.svg`

#### Archivos Modificados
- `frontend/src/theme.js` - Soporte dark mode dinámico
- `frontend/src/main.jsx` - ThemeWrapper
- `frontend/src/store/index.js` - uiReducer
- `frontend/src/pages/Settings.jsx` - Toggle tema + push notifications
- `frontend/src/components/Layout.jsx` - SkipLink + ARIA
- `frontend/index.html` - PWA meta tags + SW registration
- `frontend/src/i18n/locales/{es,en,pt}.json` - Traducciones

---

### Sprint 32 - Integraciones Externas 🔲

**Prioridad:** Baja (según necesidad)  
**Esfuerzo estimado:** Variable

#### Posibles Integraciones

- [ ] **Bancos**
  - Conciliación automática
  - Pagos masivos
  - Consulta de saldos

- [ ] **SCADA/IoT**
  - Datos de sensores de campo
  - Producción en tiempo real
  - Alertas de equipos

- [ ] **GIS/Mapas**
  - Ubicación de pozos
  - Mapas de concesiones
  - Rutas de transporte

- [ ] **Contabilidad Externa**
  - Exportación a sistemas contables
  - Formato SENIAT
  - Integración con SAP/Oracle (si aplica)

- [ ] **Proveedores**
  - EDI para órdenes de compra
  - Catálogos de productos
  - Tracking de entregas

---

## 📅 CRONOGRAMA SUGERIDO

### Fase 1: Completar Core ERP (Q1 2025)

| Semana | Sprint | Módulo | Entregable |
|--------|--------|--------|------------|
| 1-2 | 19 | Reportes Avanzados | Exportación PDF/Excel, reportes básicos |

### Fase 2: Módulos O&G Críticos (Q1-Q2 2025)

| Semana | Sprint | Módulo | Entregable |
|--------|--------|--------|------------|
| 3-6 | 20 | Producción y Pozos | Campos, pozos, producción diaria, dashboard |
| 7-8 | 21 | AFE | Autorizaciones, flujo aprobación, gastos |
| 9-11 | 22 | Contratos O&G | Contratos, WI, regalías, concesiones |

### Fase 3: Módulos O&G Complementarios (Q2 2025)

| Semana | Sprint | Módulo | Entregable |
|--------|--------|--------|------------|
| 12-13 | 23 | Compliance | Reportes regulatorios, permisos, auditorías |
| 14-15 | 24 | JIB | Facturación a socios, cash calls |
| 16-17 | 25 | Permisos de Trabajo | PTW, checklists, stop work |

### Fase 4: Módulos Avanzados (Q3 2025)

| Semana | Sprint | Módulo | Entregable |
|--------|--------|--------|------------|
| 18-19 | 26 | Reservas | Estimaciones, categorías, valoración |
| 20-21 | 27 | Transporte | Tanques, tickets, calidad, ductos |

### Fase 5: Mejoras Técnicas (Continuo)

| Sprint | Módulo | Cuándo |
|--------|--------|--------|
| 28 | Seguridad | Paralelo a desarrollo |
| 29 | Performance | Post-lanzamiento O&G |
| 30 | DevOps | Continuo |
| 31 | UX/UI | Continuo |
| 32 | Integraciones | Según demanda |

---

## 📊 MÉTRICAS DE ÉXITO

### Indicadores de Progreso

| Métrica | Actual | Meta Q2 2025 |
|---------|--------|--------------|
| Módulos Core completados | 18/18 | 18/18 |
| Módulos O&G completados | 1/8 | 6/8 |
| Cobertura de tests | ~30% | 70% |
| Documentación API | 60% | 90% |

### Indicadores de Calidad

- Tiempo de respuesta API < 200ms
- Uptime > 99.5%
- Errores críticos en producción < 5/mes
- Satisfacción de usuarios > 4/5

---

## 🔗 REFERENCIAS

### Documentación Interna

- `WINDSURF_CONTEXT.md` - Contexto para desarrollo
- `docs/ARQUITECTURA_TRAZABILIDAD.md` - Patrones de UI/UX
- `ROADMAP.md` - Roadmap original (legacy)

### Estándares de la Industria

- **PRMS** - Petroleum Resources Management System
- **SEC** - Securities and Exchange Commission (reporting)
- **API** - American Petroleum Institute
- **COPAS** - Council of Petroleum Accountants Societies

### Regulaciones Venezuela

- **MENPET** - Ministerio de Petróleo
- **PDVSA** - Normativas operacionales
- **SENIAT** - Reportes fiscales
- **INEA** - Permisos ambientales

---

## 📝 HISTORIAL DE VERSIONES

### v0.19.0 (2025-12-17)
- ✅ Módulo Permisos de Trabajo (PTW) completo
  - Backend: Modelos WorkPermit, WorkPermitChecklist, WorkPermitExtension, StopWorkAuthority
  - Backend: Servicio ptwService.js con CRUD completo, workflow y dashboard
  - Backend: Controlador y rutas API protegidas
  - Backend: Seeder con datos de prueba
  - Backend: Permisos ptw:* agregados
  - Frontend: Redux slice ptwSlice.js
  - Frontend: PTWDashboard con KPIs
  - Frontend: PermitList, PermitDetail, PermitForm
  - Frontend: StopWorkList, StopWorkDetail, StopWorkForm
  - Frontend: Traducciones i18n (ES, EN, PT)
  - Frontend: Menú lateral actualizado
  - Funcionalidades: Permisos de trabajo, checklists, extensiones, Stop Work Authority

### v0.18.0 (2025-12-17)
- ✅ Módulo Joint Interest Billing (JIB) completo
  - Backend: Modelos JointInterestBilling, JIBLineItem, JIBPartnerShare, CashCall, CashCallResponse
  - Backend: Servicio jibService.js con CRUD completo, workflow y dashboard
  - Backend: Controlador y rutas API protegidas
  - Backend: Seeder con datos de prueba
  - Backend: Permisos jib:* agregados
  - Frontend: Redux slice jibSlice.js
  - Frontend: JIBDashboard con KPIs
  - Frontend: JIBList, JIBDetail, JIBForm
  - Frontend: CashCallList, CashCallDetail, CashCallForm
  - Frontend: Traducciones i18n (ES, EN, PT)
  - Frontend: Menú lateral actualizado
  - Funcionalidades: Facturación a socios, distribución por WI, pagos, disputas, cash calls

### v0.17.0 (2025-12-17)
- 🔄 Módulo Producción y Pozos (70% completado)
  - Backend: Modelos Field, Well, WellProduction, ProductionAllocation, MorningReport
  - Backend: Servicio productionService.js con CRUD completo
  - Backend: Controlador y rutas API
  - Backend: Seeder con datos de prueba (3 campos, 23 pozos, 30 días de producción)
  - Backend: Permisos production:* agregados
  - Frontend: Redux slice productionSlice.js
  - Frontend: ProductionDashboard con KPIs y gráficos
  - Frontend: FieldList y FieldForm
  - Frontend: WellList
  - Frontend: Traducciones i18n (ES, EN, PT)
  - Frontend: Menú lateral actualizado
  - Pendiente: Detalle de campo/pozo, formulario de pozos, producción diaria, allocations, reportes matutinos

### v0.16.0 (2025-12-10)
- ✅ Módulo CRM completo
- ✅ Módulo Control de Calidad completo

### v0.15.0 (2025-12-09)
- ✅ Sistema de Email con nodemailer

### v0.14.0 (2025-12-09)
- ✅ Sistema WhatsApp con Baileys

### v0.13.0 (2025-12-08)
- ✅ Sistema de Attachments polimórfico

### v0.12.0 (2025-12-07)
- ✅ Gestión de usuarios y permisos

### Versiones Anteriores
Ver `ROADMAP.md` para historial completo.

---

## 📞 CONTACTO Y SOPORTE

**Desarrollador Principal:** [Tu nombre]  
**Repositorio:** [URL del repo]  
**Ambiente de Desarrollo:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5433

**Credenciales de Prueba:**
- Usuario: admin
- Contraseña: Admin123!

---

*Documento generado el 2025-12-17*  
*Próxima revisión: 2025-01-15*
