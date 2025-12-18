# 🏦 Módulo de Finanzas - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Finanzas"**
2. Se despliegan las opciones:
   - Dashboard
   - Cuentas Bancarias
   - Transacciones

---

## Dashboard Financiero

**Ruta:** `/finance`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Saldo Total USD** | Suma de saldos en dólares |
| **Saldo Total VES** | Suma de saldos en bolívares |
| **Ingresos del Mes** | Total de ingresos del mes actual |
| **Gastos del Mes** | Total de gastos del mes actual |
| **Pendientes por Conciliar** | Transacciones sin conciliar |

### Gráficos

- **Flujo de Caja**: Ingresos vs Gastos por mes
- **Distribución por Tipo de Cuenta**: Pie chart de saldos
- **Tendencia de Saldos**: Evolución histórica

### Acciones Rápidas

| Botón | Acción |
|-------|--------|
| **Nueva Transacción** | Ir a crear transacción |
| **Ver Cuentas** | Ir a lista de cuentas |
| **Ver Transacciones** | Ir a lista de transacciones |
| **Refrescar** | Actualizar datos |

### Filtro de Año
Selector para ver datos de años anteriores.

---

## Cuentas Bancarias

### Lista de Cuentas

**Ruta:** `/finance/accounts`

#### Totales por Moneda
En la parte superior se muestran tarjetas con el total de saldos por cada moneda (USD, VES, etc.).

#### Tarjetas de Cuenta
Cada cuenta se muestra como una tarjeta con:
- Ícono según tipo de cuenta
- Nombre de la cuenta
- Tipo (Corriente, Ahorro, Crypto, etc.)
- Banco
- Número de cuenta (parcialmente oculto)
- Saldo actual
- Estado (Activa/Inactiva)
- Badge si es cuenta por defecto
- Botones: Ver, Editar, Eliminar

#### Íconos por Tipo de Cuenta

| Tipo | Ícono | Color |
|------|-------|-------|
| CHECKING | 🏦 Banco | Azul |
| SAVINGS | 🏦 Banco | Verde |
| CRYPTO_WALLET | 💱 Crypto | Naranja |
| CASH | 💵 Efectivo | Gris |
| PAGO_MOVIL | 📱 Móvil | Celeste |
| ZELLE | 👛 Wallet | Morado |

---

### Crear Cuenta Bancaria

**Ruta:** `/finance/accounts/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre descriptivo (ej: "Cuenta Principal BOD") |
| **Banco** | ❌ | Nombre del banco |
| **Número de Cuenta** | ❌ | Número completo de la cuenta |
| **Tipo de Cuenta** | ✅ | Corriente, Ahorro, Crypto, etc. |
| **Moneda** | ✅ | USD, VES, EUR, USDT |
| **Saldo Inicial** | ❌ | Saldo al crear la cuenta |
| **Es Cuenta por Defecto** | ❌ | Marcar como cuenta principal |
| **Está Activa** | ❌ | Cuenta activa (default: sí) |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nueva Cuenta"**
2. Completar nombre y tipo (obligatorios)
3. Seleccionar moneda
4. Ingresar saldo inicial si tiene
5. Marcar como cuenta por defecto si corresponde
6. Hacer clic en **"Guardar"**

---

### Detalle de Cuenta

**Ruta:** `/finance/accounts/:id`

#### Información de la Cuenta
- Nombre
- Banco
- Número de cuenta
- Tipo
- Moneda
- Saldo actual
- Estado

#### Historial de Transacciones
Lista de transacciones de esta cuenta:
- Fecha
- Código
- Tipo (Ingreso/Gasto/Transferencia)
- Descripción
- Monto
- Saldo resultante

#### Acciones
- **Editar**: Modificar datos de la cuenta
- **Nueva Transacción**: Crear transacción en esta cuenta
- **Exportar**: Descargar historial

---

### Editar Cuenta

**Ruta:** `/finance/accounts/:id/edit`

1. Desde el detalle o lista, hacer clic en **"Editar"**
2. Modificar los campos necesarios
3. Hacer clic en **"Guardar"**

> ⚠️ **Nota**: No se puede cambiar la moneda si la cuenta tiene transacciones.

---

### Eliminar Cuenta

1. En la lista o detalle, hacer clic en **🗑️ Eliminar**
2. Confirmar en el diálogo

> ⚠️ **Nota**: No se puede eliminar una cuenta que tenga transacciones. Primero debe eliminar o transferir las transacciones.

---

## Transacciones

### Lista de Transacciones

**Ruta:** `/finance/transactions`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Todos, Ingreso, Gasto, Transferencia, Ajuste |
| **Cuenta** | Todas las cuentas activas |
| **Estado** | Todos, Pendiente, Confirmada, Conciliada, Cancelada |

#### Columnas de la Tabla (Desktop)

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único (TRX-XXXXX) |
| **Fecha** | Fecha de la transacción |
| **Tipo** | Ingreso, Gasto, Transferencia |
| **Cuenta** | Cuenta afectada |
| **Categoría** | Categoría de la transacción |
| **Descripción** | Descripción breve |
| **Monto** | Monto (verde=ingreso, rojo=gasto) |
| **Estado** | Pendiente, Confirmada, Conciliada |
| **Acciones** | Ver, Conciliar, Cancelar |

#### Vista Mobile
Tarjetas con:
- Código y tipo (ícono)
- Fecha
- Cuenta
- Monto (con color según tipo)
- Estado (chip)
- Botón de ver detalle

#### Acciones en Lista

| Acción | Descripción |
|--------|-------------|
| **Ver** | Ir al detalle de la transacción |
| **Conciliar** | Marcar como conciliada (si está confirmada) |
| **Cancelar** | Cancelar la transacción (si está pendiente) |

---

### Crear Transacción

**Ruta:** `/finance/transactions/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Ingreso, Gasto, Transferencia, Ajuste |
| **Cuenta** | ✅ | Cuenta origen |
| **Cuenta Destino** | ✅* | Solo para transferencias |
| **Monto** | ✅ | Monto de la transacción |
| **Moneda** | ✅ | Moneda (heredada de la cuenta) |
| **Tasa de Cambio** | ❌ | Si hay conversión de moneda |
| **Categoría** | ❌ | Categoría de la transacción |
| **Fecha** | ✅ | Fecha de la transacción |
| **Referencia** | ❌ | Número de referencia bancaria |
| **Descripción** | ❌ | Descripción detallada |

#### Tipos de Transacción

##### Ingreso
- Seleccionar cuenta destino
- El saldo de la cuenta aumenta

##### Gasto
- Seleccionar cuenta origen
- El saldo de la cuenta disminuye

##### Transferencia
- Seleccionar cuenta origen y destino
- El saldo de origen disminuye
- El saldo de destino aumenta
- Si son diferentes monedas, ingresar tasa de cambio

##### Ajuste
- Para correcciones de saldo
- Puede ser positivo o negativo

#### Pasos para Crear
1. Hacer clic en **"+ Nueva Transacción"**
2. Seleccionar tipo de transacción
3. Seleccionar cuenta(s)
4. Ingresar monto
5. Seleccionar categoría
6. Ingresar fecha
7. Agregar referencia y descripción (opcional)
8. Hacer clic en **"Guardar"**

---

### Detalle de Transacción

**Ruta:** `/finance/transactions/:id`

#### Información
- Código
- Tipo
- Cuenta(s) involucrada(s)
- Monto
- Moneda
- Tasa de cambio (si aplica)
- Categoría
- Fecha
- Referencia
- Descripción
- Estado
- Fecha de creación
- Usuario que creó

#### Acciones Disponibles

| Estado Actual | Acciones |
|---------------|----------|
| **PENDING** | Confirmar, Cancelar |
| **CONFIRMED** | Conciliar, Cancelar |
| **RECONCILED** | Solo consulta |
| **CANCELLED** | Solo consulta |

---

### Conciliar Transacción

La conciliación es el proceso de verificar que la transacción coincide con el estado de cuenta bancario.

1. En la lista o detalle, hacer clic en **"Conciliar"**
2. Confirmar en el diálogo
3. El estado cambia a RECONCILED
4. Ya no se puede modificar ni cancelar

---

### Cancelar Transacción

1. En la lista o detalle, hacer clic en **"Cancelar"**
2. Confirmar en el diálogo
3. El estado cambia a CANCELLED
4. El saldo de la cuenta se revierte

> ⚠️ **Nota**: Solo se pueden cancelar transacciones en estado PENDING o CONFIRMED.

---

## Flujo de Trabajo Recomendado

### Diario
1. Registrar todas las transacciones del día
2. Verificar saldos de cuentas

### Semanal
1. Revisar transacciones pendientes
2. Confirmar transacciones verificadas

### Mensual
1. Obtener estados de cuenta bancarios
2. Conciliar transacciones con estados de cuenta
3. Investigar diferencias
4. Generar reportes financieros

---

## Tips y Mejores Prácticas

### Para Cuentas
- ✅ Usar nombres descriptivos (incluir banco y tipo)
- ✅ Mantener una cuenta por defecto para operaciones frecuentes
- ✅ Desactivar cuentas que ya no se usan (no eliminar)
- ✅ Verificar saldos iniciales al crear cuentas

### Para Transacciones
- ✅ Registrar transacciones el mismo día que ocurren
- ✅ Usar categorías consistentes
- ✅ Incluir referencias bancarias para facilitar conciliación
- ✅ Agregar descripciones claras

### Para Conciliación
- ✅ Conciliar al menos una vez por semana
- ✅ Investigar diferencias inmediatamente
- ✅ Mantener documentación de ajustes

---

## Solución de Problemas

### "El saldo no coincide con el banco"
1. Verificar transacciones pendientes
2. Buscar transacciones duplicadas
3. Verificar transacciones canceladas
4. Revisar transferencias entre cuentas

### "No puedo eliminar la cuenta"
- La cuenta tiene transacciones asociadas
- Primero debe eliminar o transferir las transacciones

### "No puedo cancelar la transacción"
- La transacción ya está conciliada
- Las transacciones conciliadas no se pueden cancelar

### "La transferencia no actualiza los saldos"
- Verificar que ambas cuentas estén activas
- Verificar que la tasa de cambio sea correcta (si aplica)
- Verificar que la transacción esté confirmada
