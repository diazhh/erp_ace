# 💰 Módulo de Nómina - Descripción

## ¿Qué hace este módulo?

El módulo de **Nómina** gestiona el proceso completo de pago de salarios a los empleados. Incluye la creación de períodos de nómina, cálculo automático de deducciones legales venezolanas, gestión de préstamos y seguimiento de pagos.

## Funcionalidades Principales

### 1. Períodos de Nómina
- **Crear** períodos de nómina (semanal, quincenal, mensual)
- **Generar entradas** automáticamente para todos los empleados activos
- **Calcular deducciones** legales venezolanas (SSO, RPE, FAOV, ISLR)
- **Aprobar** períodos para autorizar el pago
- **Marcar como pagado** una vez procesado
- **Exportar a PDF** el resumen de nómina

### 2. Entradas de Nómina
- **Detalle por empleado**: salario base, bonos, deducciones, neto
- **Editar entradas** individuales antes de aprobar
- **Deducciones automáticas**: préstamos activos se descuentan
- **Cálculo proporcional** por días trabajados

### 3. Préstamos a Empleados
- **Crear préstamos** con cuotas definidas
- **Tipos**: Personal, Adelanto, Emergencia, Otro
- **Aprobar/Rechazar** préstamos
- **Seguimiento de pagos** con historial
- **Descuento automático** en nómina
- **Pausar/Cancelar** préstamos

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `PayrollPeriod` | Período de nómina con fechas y totales |
| `PayrollEntry` | Entrada individual por empleado |
| `EmployeeLoan` | Préstamos a empleados |
| `LoanPayment` | Pagos/cuotas de préstamos |

## Estados de Período de Nómina

| Estado | Color | Descripción | Acciones Disponibles |
|--------|-------|-------------|---------------------|
| **DRAFT** | Gris | Borrador, en preparación | Editar, Generar entradas, Eliminar |
| **CALCULATING** | Azul | Calculando entradas | Aprobar |
| **PENDING_APPROVAL** | Naranja | Pendiente de aprobación | Aprobar |
| **APPROVED** | Azul | Aprobado, listo para pagar | Marcar como pagado |
| **PAID** | Verde | Pagado | Solo consulta |
| **CANCELLED** | Rojo | Cancelado | Solo consulta |

## Estados de Préstamo

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | Préstamo activo, descontando cuotas |
| **PAID** | Azul | Préstamo completamente pagado |
| **CANCELLED** | Rojo | Préstamo cancelado |
| **PAUSED** | Naranja | Préstamo pausado temporalmente |

## Tipos de Préstamo

| Tipo | Descripción |
|------|-------------|
| **PERSONAL** | Préstamo personal |
| **ADVANCE** | Adelanto de salario |
| **EMERGENCY** | Préstamo de emergencia |
| **OTHER** | Otro tipo de préstamo |

## Tipos de Período

| Tipo | Descripción |
|------|-------------|
| **WEEKLY** | Semanal |
| **BIWEEKLY** | Quincenal |
| **MONTHLY** | Mensual |

## Deducciones Legales Venezolanas

| Deducción | Porcentaje | Descripción |
|-----------|------------|-------------|
| **SSO** | 4% | Seguro Social Obligatorio |
| **RPE** | 0.5% | Régimen Prestacional de Empleo |
| **FAOV** | 1% | Fondo de Ahorro Obligatorio para la Vivienda |
| **ISLR** | Variable | Impuesto Sobre la Renta (simplificado) |

## Campos de Período de Nómina

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (NOM-2025-01) |
| `name` | String | Nombre descriptivo |
| `periodType` | Enum | WEEKLY, BIWEEKLY, MONTHLY |
| `startDate` | Date | Fecha de inicio del período |
| `endDate` | Date | Fecha de fin del período |
| `paymentDate` | Date | Fecha de pago |
| `currency` | String | Moneda (USD, VES) |
| `exchangeRate` | Decimal | Tasa de cambio |
| `totalGross` | Decimal | Total bruto |
| `totalDeductions` | Decimal | Total deducciones |
| `totalNet` | Decimal | Total neto a pagar |
| `totalEmployees` | Integer | Cantidad de empleados |
| `status` | Enum | Estado del período |

## Campos de Préstamo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (LOAN-XXXXX) |
| `employeeId` | UUID | Empleado beneficiario |
| `loanType` | Enum | PERSONAL, ADVANCE, EMERGENCY, OTHER |
| `amount` | Decimal | Monto total del préstamo |
| `currency` | String | Moneda |
| `totalInstallments` | Integer | Número total de cuotas |
| `paidInstallments` | Integer | Cuotas pagadas |
| `installmentAmount` | Decimal | Monto de cada cuota |
| `remainingAmount` | Decimal | Saldo pendiente |
| `startDate` | Date | Fecha de inicio de descuento |
| `status` | Enum | ACTIVE, PAID, CANCELLED, PAUSED |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                         NÓMINA                               │
│  (Períodos, Entradas, Préstamos, Pagos)                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │   FINANZAS    │    │   REPORTES    │
│ - Salario base│    │ - Transacc.   │    │ - Recibos     │
│ - Cuentas     │    │   de pago     │    │ - Resumen     │
│   bancarias   │    │               │    │   período     │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Salario base, cuentas bancarias para pago
- **Finanzas**: Transacciones de pago de nómina
- **Reportes**: Recibos de pago, resumen de período

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/payroll` | Lista | Lista de períodos de nómina |
| `/payroll/periods/:id` | Detalle | Detalle del período con entradas |
| `/payroll/loans` | Lista | Lista de préstamos |
| `/payroll/loans/new` | Formulario | Crear nuevo préstamo |
| `/payroll/loans/:id` | Detalle | Detalle del préstamo |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `payroll:read` | Ver períodos y préstamos |
| `payroll:create` | Crear períodos y préstamos |
| `payroll:update` | Editar períodos y préstamos |
| `payroll:delete` | Eliminar períodos (solo borrador) |
| `payroll:approve` | Aprobar períodos y préstamos |
| `payroll:pay` | Marcar períodos como pagados |

## Flujo de Trabajo de Nómina

```
1. CREAR PERÍODO
   ↓
2. GENERAR ENTRADAS (automático para empleados activos)
   ↓
3. REVISAR/EDITAR ENTRADAS (ajustes manuales si necesario)
   ↓
4. APROBAR PERÍODO (autorización gerencial)
   ↓
5. PROCESAR PAGO (transferencias bancarias)
   ↓
6. MARCAR COMO PAGADO
```

## Ejemplos de Uso

### Caso 1: Procesar Nómina Mensual
1. Crear período con tipo "Mensual"
2. Definir fechas de inicio, fin y pago
3. Generar entradas automáticamente
4. Revisar y ajustar si es necesario
5. Aprobar el período
6. Procesar pagos bancarios
7. Marcar como pagado

### Caso 2: Otorgar Préstamo a Empleado
1. Ir a Préstamos → Nuevo Préstamo
2. Seleccionar empleado
3. Definir monto y número de cuotas
4. Establecer fecha de inicio de descuento
5. Guardar (queda pendiente de aprobación)
6. Aprobar el préstamo
7. Las cuotas se descuentan automáticamente en cada nómina

### Caso 3: Consultar Historial de Empleado
1. Ir al detalle del empleado
2. Seleccionar tab "Nómina"
3. Ver historial de pagos recibidos
4. Seleccionar tab "Préstamos"
5. Ver préstamos activos y pagados

## Screenshots

- `screenshots/periodos-lista.png` - Lista de períodos de nómina
- `screenshots/periodo-detalle.png` - Detalle con entradas
- `screenshots/prestamos-lista.png` - Lista de préstamos
- `screenshots/prestamo-detalle.png` - Detalle de préstamo
