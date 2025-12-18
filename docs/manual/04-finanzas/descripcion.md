# 🏦 Módulo de Finanzas - Descripción

## ¿Qué hace este módulo?

El módulo de **Finanzas** gestiona las cuentas bancarias de la empresa, transacciones financieras, conciliaciones y proporciona un dashboard con métricas financieras clave. Soporta múltiples monedas y tipos de cuenta.

## Funcionalidades Principales

### 1. Gestión de Cuentas Bancarias
- **Crear** cuentas bancarias de diferentes tipos
- **Editar** información de cuentas
- **Eliminar** cuentas (si no tienen transacciones)
- **Marcar cuenta por defecto** para operaciones
- **Activar/Desactivar** cuentas
- **Ver saldos** por moneda

### 2. Tipos de Cuenta Soportados
- **CHECKING**: Cuenta corriente
- **SAVINGS**: Cuenta de ahorro
- **CRYPTO_WALLET**: Billetera de criptomonedas
- **CASH**: Caja/Efectivo
- **PAGO_MOVIL**: Pago Móvil (Venezuela)
- **ZELLE**: Cuenta Zelle

### 3. Transacciones Financieras
- **Ingresos**: Dinero que entra (ventas, cobros)
- **Gastos**: Dinero que sale (pagos, compras)
- **Transferencias**: Entre cuentas propias
- **Ajustes**: Correcciones de saldo

### 4. Estados de Transacción
- **PENDING**: Pendiente de confirmación
- **CONFIRMED**: Confirmada
- **RECONCILED**: Conciliada con banco
- **CANCELLED**: Cancelada

### 5. Dashboard Financiero
- **KPIs**: Saldos totales, ingresos, gastos del mes
- **Gráficos**: Flujo de caja, distribución por tipo de cuenta
- **Transacciones recientes**
- **Cuentas con saldos**

### 6. Conciliación Bancaria
- Marcar transacciones como conciliadas
- Comparar con estados de cuenta bancarios
- Identificar diferencias

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `BankAccount` | Cuentas bancarias de la empresa |
| `Transaction` | Transacciones financieras |
| `TransactionCategory` | Categorías de transacciones |

## Campos de Cuenta Bancaria

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre descriptivo |
| `bankName` | String | Nombre del banco |
| `accountNumber` | String | Número de cuenta |
| `accountType` | Enum | CHECKING, SAVINGS, CRYPTO_WALLET, etc. |
| `currency` | String | Moneda (USD, VES, USDT) |
| `currentBalance` | Decimal | Saldo actual |
| `initialBalance` | Decimal | Saldo inicial |
| `isActive` | Boolean | Cuenta activa |
| `isDefault` | Boolean | Cuenta por defecto |

## Campos de Transacción

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (TRX-XXXXX) |
| `transactionType` | Enum | INCOME, EXPENSE, TRANSFER, ADJUSTMENT |
| `accountId` | UUID | Cuenta origen |
| `toAccountId` | UUID | Cuenta destino (para transferencias) |
| `amount` | Decimal | Monto de la transacción |
| `currency` | String | Moneda |
| `exchangeRate` | Decimal | Tasa de cambio |
| `category` | String | Categoría (SALES, PAYROLL, etc.) |
| `description` | String | Descripción |
| `reference` | String | Referencia bancaria |
| `transactionDate` | Date | Fecha de la transacción |
| `status` | Enum | PENDING, CONFIRMED, RECONCILED, CANCELLED |

## Categorías de Transacción

| Categoría | Descripción | Tipo |
|-----------|-------------|------|
| **SALES** | Ventas | Ingreso |
| **SERVICES** | Servicios prestados | Ingreso |
| **PAYROLL** | Nómina | Gasto |
| **SUPPLIES** | Suministros | Gasto |
| **UTILITIES** | Servicios públicos | Gasto |
| **TRANSPORT** | Transporte | Gasto |
| **MAINTENANCE** | Mantenimiento | Gasto |
| **OTHER** | Otros | Ambos |

## Monedas Soportadas

| Moneda | Descripción |
|--------|-------------|
| **USD** | Dólar estadounidense |
| **VES** | Bolívar venezolano |
| **EUR** | Euro |
| **USDT** | Tether (criptomoneda) |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        FINANZAS                              │
│  (Cuentas, Transacciones, Dashboard)                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    NÓMINA     │    │  CAJA CHICA   │    │  PROYECTOS    │
│ - Pagos de    │    │ - Reembolsos  │    │ - Gastos de   │
│   salarios    │    │ - Fondos      │    │   proyecto    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   PROCURA     │    │   REPORTES    │    │   EMPLEADOS   │
│ - Pagos a     │    │ - Estados     │    │ - Cuentas     │
│   proveedores │    │   financieros │    │   bancarias   │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Nómina**: Transacciones de pago de salarios
- **Caja Chica**: Reposición de fondos
- **Proyectos**: Gastos asociados a proyectos
- **Procura**: Pagos a proveedores
- **Empleados**: Cuentas bancarias para pagos
- **Reportes**: Estados financieros

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/finance` | Dashboard | Dashboard financiero |
| `/finance/accounts` | Lista | Lista de cuentas bancarias |
| `/finance/accounts/new` | Formulario | Crear cuenta |
| `/finance/accounts/:id` | Detalle | Detalle de cuenta |
| `/finance/accounts/:id/edit` | Formulario | Editar cuenta |
| `/finance/transactions` | Lista | Lista de transacciones |
| `/finance/transactions/new` | Formulario | Crear transacción |
| `/finance/transactions/:id` | Detalle | Detalle de transacción |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `finance:read` | Ver cuentas y transacciones |
| `finance:create` | Crear cuentas y transacciones |
| `finance:update` | Editar cuentas y transacciones |
| `finance:delete` | Eliminar cuentas y transacciones |
| `finance:reconcile` | Conciliar transacciones |

## Ejemplos de Uso

### Caso 1: Registrar Ingreso por Venta
1. Ir a Finanzas → Transacciones → Nueva
2. Seleccionar tipo "Ingreso"
3. Seleccionar cuenta destino
4. Ingresar monto y categoría "Ventas"
5. Agregar referencia y descripción
6. Guardar

### Caso 2: Registrar Pago de Nómina
1. El sistema crea transacciones automáticamente al pagar nómina
2. Se registra como tipo "Gasto" categoría "Nómina"
3. Se descuenta de la cuenta seleccionada

### Caso 3: Transferencia entre Cuentas
1. Ir a Finanzas → Transacciones → Nueva
2. Seleccionar tipo "Transferencia"
3. Seleccionar cuenta origen y destino
4. Ingresar monto
5. Si son diferentes monedas, ingresar tasa de cambio
6. Guardar

### Caso 4: Conciliación Bancaria
1. Obtener estado de cuenta del banco
2. Ir a lista de transacciones
3. Filtrar por cuenta y período
4. Comparar con estado de cuenta
5. Marcar como "Conciliada" las que coinciden
6. Investigar diferencias

## Screenshots

- `screenshots/dashboard.png` - Dashboard financiero
- `screenshots/cuentas-lista.png` - Lista de cuentas bancarias
- `screenshots/cuenta-detalle.png` - Detalle de cuenta
- `screenshots/transacciones-lista.png` - Lista de transacciones
- `screenshots/transaccion-nueva.png` - Formulario de transacción
