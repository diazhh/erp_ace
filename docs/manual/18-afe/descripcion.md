# 💰 Módulo de AFE - Descripción

## ¿Qué hace este módulo?

El módulo de **AFE** (Authorization for Expenditure) gestiona las autorizaciones de gasto para operaciones petroleras. Permite crear, aprobar y dar seguimiento a presupuestos de proyectos de perforación, workover, facilidades y otros.

## Funcionalidades Principales

### 1. Gestión de AFEs
- **Crear** AFEs con presupuesto detallado
- **Categorizar** por tipo de operación
- **Asociar** a campos y pozos
- **Flujo de aprobación**

### 2. Tipos de AFE
- **DRILLING**: Perforación de pozos
- **WORKOVER**: Trabajos de reacondicionamiento
- **FACILITIES**: Instalaciones y facilidades
- **EXPLORATION**: Exploración
- **MAINTENANCE**: Mantenimiento mayor
- **OTHER**: Otros gastos

### 3. Control de Gastos
- **Presupuesto** vs gastado
- **Variaciones** y alertas
- **Seguimiento** de ejecución

### 4. Dashboard AFE
- **KPIs**: AFEs activos, presupuesto total
- **Gráficos**: Distribución por tipo
- **Alertas**: AFEs sobre presupuesto

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `AFE` | Autorizaciones de gasto |
| `AFEItem` | Items del presupuesto |
| `AFEExpense` | Gastos registrados |

## Estados del AFE

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **PENDING** | Naranja | Pendiente de aprobación |
| **APPROVED** | Verde | Aprobado |
| **REJECTED** | Rojo | Rechazado |
| **IN_PROGRESS** | Azul | En ejecución |
| **CLOSED** | Morado | Cerrado |
| **CANCELLED** | Gris | Cancelado |

## Campos del AFE

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (AFE-XXXXX) |
| `title` | String | Título descriptivo |
| `afeType` | Enum | Tipo de AFE |
| `fieldId` | UUID | Campo asociado |
| `wellId` | UUID | Pozo asociado (opcional) |
| `estimatedBudget` | Decimal | Presupuesto estimado |
| `approvedBudget` | Decimal | Presupuesto aprobado |
| `actualSpent` | Decimal | Gastado real |
| `currency` | String | Moneda |
| `startDate` | Date | Fecha de inicio |
| `endDate` | Date | Fecha de fin |
| `status` | Enum | Estado |
| `description` | Text | Descripción |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                           AFE                                │
│  (Autorizaciones, Presupuestos, Gastos)                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PRODUCCIÓN   │    │   FINANZAS    │    │     JIB       │
│ - Campos      │    │ - Gastos      │    │ - Distribución│
│ - Pozos       │    │ - Pagos       │    │   de costos   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/afe` | Dashboard | Dashboard de AFEs |
| `/afe/list` | Lista | Lista de AFEs |
| `/afe/new` | Formulario | Crear AFE |
| `/afe/:id` | Detalle | Detalle del AFE |
| `/afe/:id/edit` | Formulario | Editar AFE |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `afe:read` | Ver AFEs |
| `afe:create` | Crear AFEs |
| `afe:update` | Editar AFEs |
| `afe:delete` | Eliminar AFEs |
| `afe:approve` | Aprobar AFEs |

## Ejemplos de Uso

### Caso 1: Crear AFE de Perforación
1. Ir a AFE → Nuevo
2. Seleccionar tipo "Perforación"
3. Asociar campo y pozo
4. Agregar items de presupuesto
5. Enviar para aprobación

### Caso 2: Aprobar AFE
1. Revisar AFE pendiente
2. Verificar presupuesto
3. Aprobar o rechazar
4. Agregar comentarios

## Screenshots

- `screenshots/dashboard.png` - Dashboard de AFEs
- `screenshots/lista.png` - Lista de AFEs
- `screenshots/detalle.png` - Detalle del AFE
