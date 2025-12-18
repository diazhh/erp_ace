# 💵 Finanzas y Contabilidad - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Finanzas"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores y gráficos
   - **Cuentas**: Gestión de cuentas bancarias
   - **Transacciones**: Registro de ingresos y gastos

---

## Dashboard Financiero

### Acceder al Dashboard

1. En el menú, seleccione **"Finanzas"** → **"Dashboard"**
2. Verá el panel principal con toda la información financiera

### Indicadores Principales (KPIs)

| Indicador | Descripción | Color |
|-----------|-------------|-------|
| **Total Ingresos** | Suma de ingresos del mes | Verde |
| **Total Gastos** | Suma de gastos del mes | Rojo |
| **Balance Neto** | Ingresos menos gastos | Verde/Rojo según resultado |
| **Pendientes de Conciliar** | Transacciones sin verificar | Naranja |

### Saldos por Moneda

Debajo de los KPIs verá tarjetas con el saldo total por cada moneda (USD, VES, etc.), mostrando cuántas cuentas tiene en cada moneda.

### Gráficos Disponibles

| Gráfico | Descripción |
|---------|-------------|
| **Flujo de Caja** | Ingresos vs gastos por mes (área) |
| **Cuentas por Tipo** | Distribución de saldos por tipo de cuenta (pastel) |
| **Gastos por Categoría** | Desglose de gastos (barras horizontales) |
| **Balance Neto Mensual** | Tendencia del resultado neto (línea) |

### Crear Transacción Rápida

1. Haga clic en el botón **"+ Nueva Transacción"** (esquina superior derecha)
2. Se despliega un menú con opciones:
   - **Nuevo Ingreso** (verde)
   - **Nuevo Gasto** (rojo)
   - **Nueva Transferencia** (azul)
3. Seleccione la opción deseada

### Cambiar Año de Visualización

1. Use el selector de **Año** en la esquina superior derecha
2. Los gráficos se actualizarán con los datos del año seleccionado

---

## Cuentas Bancarias

### Ver Lista de Cuentas

1. En el menú, seleccione **"Finanzas"** → **"Cuentas"**
2. Verá tarjetas con todas las cuentas de la empresa

### Información de Cada Cuenta

Cada tarjeta muestra:
- **Nombre** de la cuenta
- **Tipo** (Corriente, Ahorro, Efectivo, etc.)
- **Moneda** (USD, VES, EUR)
- **Banco** (si aplica)
- **Número de cuenta** (si aplica)
- **Saldo actual** (en verde si positivo, rojo si negativo)
- **Etiqueta "Predeterminada"** si es la cuenta principal

### Crear Nueva Cuenta

1. Haga clic en el botón **"+ Nueva Cuenta"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ Sí | Nombre descriptivo (ej: "Cuenta Principal BOD") |
| **Tipo de Cuenta** | ✅ Sí | Corriente, Ahorro, Efectivo, etc. |
| **Moneda** | ✅ Sí | USD, VES, EUR |
| **Banco** | ❌ No | Nombre del banco |
| **Número de Cuenta** | ❌ No | Número de la cuenta |
| **Saldo Inicial** | ❌ No | Saldo al momento de crear |
| **Es Predeterminada** | ❌ No | Marcar como cuenta principal |
| **Activa** | ❌ No | Si la cuenta está operativa |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

### Ver Detalle de una Cuenta

1. En la lista de cuentas, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información completa de la cuenta
   - Historial de transacciones
   - Gráfico de movimientos

### Editar una Cuenta

1. Haga clic en el ícono de **lápiz** (✏️) en la tarjeta de la cuenta
2. Modifique los campos necesarios
3. Haga clic en **"Guardar"**

### Eliminar una Cuenta

1. Haga clic en el ícono de **papelera** (🗑️)
2. Confirme la eliminación

> ⚠️ **Importante**: No puede eliminar una cuenta que tenga transacciones registradas.

---

## Transacciones

### Ver Lista de Transacciones

1. En el menú, seleccione **"Finanzas"** → **"Transacciones"**
2. Verá indicadores y la tabla de transacciones

### Indicadores de la Lista

| Indicador | Descripción |
|-----------|-------------|
| **Total Ingresos** | Suma de ingresos (verde) |
| **Total Gastos** | Suma de gastos (rojo) |
| **Balance Neto** | Diferencia |
| **Pendientes** | Transacciones sin conciliar |

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Ingreso, Gasto, Transferencia |
| **Cuenta** | Todas las cuentas registradas |
| **Estado** | Pendiente, Confirmada, Conciliada, Cancelada |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Fecha** | Fecha de la transacción |
| **Código** | Identificador único |
| **Tipo** | Ingreso/Gasto/Transferencia |
| **Categoría** | Clasificación del movimiento |
| **Descripción** | Detalle de la transacción |
| **Cuenta** | Cuenta afectada |
| **Monto** | Cantidad (+ para ingresos, - para gastos) |
| **Estado** | Estado actual |
| **Acciones** | Ver, Conciliar, Cancelar |

---

### Registrar un Ingreso

1. Haga clic en el botón **"+ Nuevo Ingreso"** (verde)
2. Se abrirá el formulario de transacción

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Cuenta** | ✅ Sí | Cuenta donde entra el dinero |
| **Monto** | ✅ Sí | Cantidad del ingreso |
| **Fecha** | ✅ Sí | Fecha de la transacción |
| **Categoría** | ✅ Sí | Ventas, Servicios, Otros |
| **Descripción** | ❌ No | Detalle del ingreso |
| **Referencia** | ❌ No | Número de factura o referencia |

3. Complete los campos
4. Haga clic en **"Guardar"**

---

### Registrar un Gasto

1. Haga clic en el botón **"+ Nuevo Gasto"** (rojo)
2. Complete el formulario similar al de ingreso
3. Seleccione la categoría apropiada:
   - Nómina
   - Suministros
   - Servicios
   - Transporte
   - Mantenimiento
   - Otros

---

### Realizar una Transferencia

1. Haga clic en el botón **"+ Nueva Transferencia"** (azul)
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Cuenta Origen** | ✅ Sí | De dónde sale el dinero |
| **Cuenta Destino** | ✅ Sí | A dónde llega el dinero |
| **Monto** | ✅ Sí | Cantidad a transferir |
| **Fecha** | ✅ Sí | Fecha de la transferencia |
| **Descripción** | ❌ No | Motivo de la transferencia |

3. Haga clic en **"Guardar"**
4. El sistema crea automáticamente dos movimientos: salida de origen y entrada a destino

---

### Conciliar una Transacción

La conciliación marca una transacción como verificada con el banco.

1. En la lista de transacciones, busque una transacción en estado **"Confirmada"**
2. Haga clic en el ícono de **check verde** (✅)
3. Confirme la acción
4. El estado cambia a **"Conciliada"**

> 💡 **Tip**: Concilie las transacciones después de verificar que aparecen en su estado de cuenta bancario.

---

### Cancelar una Transacción

1. En la lista de transacciones, busque la transacción a cancelar
2. Haga clic en el ícono de **X roja** (❌)
3. Confirme la acción
4. El estado cambia a **"Cancelada"**
5. El saldo de la cuenta se revierte automáticamente

> ⚠️ **Importante**: Solo puede cancelar transacciones que no estén conciliadas.

---

### Ver Detalle de una Transacción

1. Haga clic en el ícono de **ojo** (👁) o en cualquier parte de la fila
2. Verá:
   - Información completa de la transacción
   - Cuenta afectada
   - Historial de cambios

---

## Exportar Reportes

### Reporte de Transacciones

1. En la lista de transacciones, aplique los filtros deseados
2. Haga clic en el botón **"Descargar PDF"**
3. Se genera un PDF con las transacciones filtradas

---

## Consejos Útiles

### Para Cuentas
- ✅ Cree una cuenta por cada cuenta bancaria real
- ✅ Use nombres descriptivos (ej: "Corriente BOD USD")
- ✅ Marque una cuenta como predeterminada para agilizar el registro
- ✅ Mantenga actualizados los saldos iniciales

### Para Transacciones
- ✅ Registre las transacciones el mismo día que ocurren
- ✅ Use descripciones claras y detalladas
- ✅ Categorice correctamente para mejores reportes
- ✅ Concilie regularmente con los estados de cuenta

### Para el Dashboard
- ✅ Revise los KPIs diariamente
- ✅ Monitoree las transacciones pendientes de conciliar
- ✅ Use los gráficos para identificar tendencias

---

## Preguntas Frecuentes

### ¿Por qué no puedo eliminar una cuenta?
La cuenta tiene transacciones registradas. Debe cancelar o transferir las transacciones antes de eliminar.

### ¿Cómo corrijo una transacción con monto incorrecto?
Cancele la transacción errónea y cree una nueva con el monto correcto.

### ¿Qué significa "Pendiente de Conciliar"?
Son transacciones registradas pero no verificadas con el banco. Debe conciliarlas después de confirmar que aparecen en su estado de cuenta.

### ¿Puedo modificar una transacción conciliada?
No. Las transacciones conciliadas no pueden modificarse ni cancelarse para mantener la integridad de los registros.

### ¿Cómo registro un pago en efectivo?
Cree una cuenta tipo "Efectivo" y registre las transacciones en esa cuenta.

### ¿Puedo tener cuentas en diferentes monedas?
Sí. Puede crear cuentas en USD, VES, EUR u otras monedas. El sistema muestra los totales separados por moneda.
