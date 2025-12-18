# 💵 Módulo de Caja Chica - Descripción

## ¿Qué hace este módulo?

El módulo de **Caja Chica** gestiona los fondos de gastos menores de la empresa. Permite crear múltiples cajas chicas asignadas a custodios, registrar gastos, solicitar reposiciones y controlar el flujo de efectivo para gastos operativos pequeños.

## Funcionalidades Principales

### 1. Gestión de Cajas Chicas
- **Crear** cajas chicas con monto inicial
- **Asignar custodio** responsable
- **Definir monto mínimo** para alertas de reposición
- **Activar/Suspender/Cerrar** cajas
- **Ver historial** de movimientos

### 2. Registro de Gastos
- **Registrar gastos** con categoría y descripción
- **Adjuntar comprobantes** (facturas, recibos)
- **Aprobar/Rechazar** gastos pendientes
- **Seguimiento** por empleado que realizó el gasto

### 3. Reposiciones
- **Solicitar reposición** cuando el saldo es bajo
- **Aprobar reposiciones** por supervisor
- **Registrar transferencia** desde cuenta bancaria
- **Historial** de reposiciones

### 4. Reportes de Gastos
- **Crear reportes** agrupando varios gastos
- **Aprobar reportes** completos
- **Exportar a PDF** para archivo

### 5. Alertas y Control
- **Alerta de saldo bajo** (menor al mínimo)
- **Gastos pendientes** de aprobación
- **Cajas que necesitan reposición**

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `PettyCash` | Caja chica con saldo y custodio |
| `PettyCashEntry` | Movimientos (gastos, reposiciones, ajustes) |
| `ExpenseReport` | Reportes de gastos agrupados |

## Estados de Caja Chica

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | Caja activa, operando normalmente |
| **INACTIVE** | Gris | Caja inactiva temporalmente |
| **SUSPENDED** | Naranja | Caja suspendida por auditoría |
| **CLOSED** | Rojo | Caja cerrada permanentemente |

## Tipos de Movimiento

| Tipo | Color | Descripción | Efecto en Saldo |
|------|-------|-------------|-----------------|
| **EXPENSE** | Rojo | Gasto registrado | Disminuye |
| **REPLENISHMENT** | Verde | Reposición de fondos | Aumenta |
| **ADJUSTMENT** | Azul | Ajuste de saldo | Variable |
| **INITIAL** | Azul | Apertura inicial | Establece |

## Estados de Movimiento

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente de aprobación |
| **APPROVED** | Verde | Aprobado |
| **REJECTED** | Rojo | Rechazado |
| **CANCELLED** | Gris | Cancelado |

## Campos de Caja Chica

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre de la caja |
| `code` | String | Código único |
| `custodianId` | UUID | Empleado custodio |
| `currency` | String | Moneda (USD, VES) |
| `initialAmount` | Decimal | Monto inicial |
| `currentBalance` | Decimal | Saldo actual |
| `minimumBalance` | Decimal | Saldo mínimo para alerta |
| `status` | Enum | ACTIVE, INACTIVE, SUSPENDED, CLOSED |
| `description` | String | Descripción/propósito |

## Campos de Movimiento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `pettyCashId` | UUID | Caja chica asociada |
| `entryType` | Enum | EXPENSE, REPLENISHMENT, ADJUSTMENT, INITIAL |
| `amount` | Decimal | Monto del movimiento |
| `description` | String | Descripción del gasto |
| `category` | String | Categoría del gasto |
| `employeeId` | UUID | Empleado que realizó el gasto |
| `reference` | String | Número de factura/recibo |
| `entryDate` | Date | Fecha del movimiento |
| `status` | Enum | PENDING, APPROVED, REJECTED, CANCELLED |
| `approvedById` | UUID | Usuario que aprobó |
| `approvedAt` | DateTime | Fecha de aprobación |

## Categorías de Gasto

| Categoría | Descripción |
|-----------|-------------|
| **OFFICE_SUPPLIES** | Suministros de oficina |
| **TRANSPORT** | Transporte y movilización |
| **FOOD** | Alimentación |
| **MAINTENANCE** | Mantenimiento menor |
| **CLEANING** | Limpieza |
| **UTILITIES** | Servicios (agua, luz, etc.) |
| **OTHER** | Otros gastos |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                       CAJA CHICA                             │
│  (Cajas, Movimientos, Reportes)                             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │   FINANZAS    │    │  DOCUMENTOS   │
│ - Custodio    │    │ - Reposición  │    │ - Comprobantes│
│ - Quien gasta │    │   desde cuenta│    │ - Facturas    │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Custodios y empleados que realizan gastos
- **Finanzas**: Reposiciones desde cuentas bancarias
- **Documentos**: Comprobantes adjuntos

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/petty-cash` | Lista | Lista de cajas chicas |
| `/petty-cash/new` | Formulario | Crear caja chica |
| `/petty-cash/:id` | Detalle | Detalle con movimientos |
| `/petty-cash/:id/edit` | Formulario | Editar caja chica |
| `/petty-cash/expense-reports` | Lista | Reportes de gastos |
| `/petty-cash/expense-reports/new` | Formulario | Crear reporte |
| `/petty-cash/expense-reports/:id` | Detalle | Detalle de reporte |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `pettyCash:read` | Ver cajas y movimientos |
| `pettyCash:create` | Crear cajas y registrar gastos |
| `pettyCash:update` | Editar cajas y movimientos |
| `pettyCash:delete` | Eliminar cajas y movimientos |
| `pettyCash:approve` | Aprobar gastos y reposiciones |

## Flujo de Trabajo

### Flujo de Gasto
```
1. Empleado realiza gasto
   ↓
2. Registra gasto en caja chica (estado: PENDING)
   ↓
3. Adjunta comprobante
   ↓
4. Supervisor revisa y aprueba/rechaza
   ↓
5. Si aprobado: saldo se actualiza
   Si rechazado: gasto no afecta saldo
```

### Flujo de Reposición
```
1. Saldo llega al mínimo (alerta)
   ↓
2. Custodio solicita reposición
   ↓
3. Supervisor aprueba reposición
   ↓
4. Finanzas transfiere fondos
   ↓
5. Se registra reposición (saldo aumenta)
```

## Ejemplos de Uso

### Caso 1: Registrar Gasto de Oficina
1. Ir a la caja chica asignada
2. Clic en "Nuevo Gasto"
3. Seleccionar categoría "Suministros de Oficina"
4. Ingresar monto y descripción
5. Adjuntar foto de factura
6. Guardar (queda pendiente de aprobación)

### Caso 2: Aprobar Gastos Pendientes
1. Ir al detalle de la caja chica
2. Ver tab "Movimientos"
3. Filtrar por estado "Pendiente"
4. Revisar cada gasto y comprobante
5. Aprobar o rechazar según corresponda

### Caso 3: Solicitar Reposición
1. Ver alerta de saldo bajo
2. Ir al detalle de la caja chica
3. Clic en "Solicitar Reposición"
4. Ingresar monto a reponer
5. Enviar solicitud
6. Esperar aprobación de supervisor

## Screenshots

- `screenshots/lista.png` - Lista de cajas chicas
- `screenshots/detalle.png` - Detalle con movimientos
- `screenshots/nuevo-gasto.png` - Formulario de gasto
- `screenshots/reportes.png` - Lista de reportes de gastos
