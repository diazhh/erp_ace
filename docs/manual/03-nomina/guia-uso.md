# 💰 Nómina y Pagos - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Nómina"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Períodos**: Gestión de períodos de nómina
   - **Préstamos**: Gestión de préstamos a empleados

---

## Períodos de Nómina

### Ver Lista de Períodos

1. En el menú, seleccione **"Nómina"** → **"Períodos"**
2. Verá indicadores en la parte superior con:
   - **Total del Año**: Suma de nóminas pagadas en el año
   - **Períodos Pendientes**: Períodos sin aprobar
   - **Préstamos Activos**: Cantidad de préstamos vigentes
   - **Monto en Préstamos**: Total de préstamos activos

#### Filtros Disponibles

| Filtro | Descripción |
|--------|-------------|
| **Estado** | Borrador, Calculando, Pendiente, Aprobado, Pagado |
| **Año** | Filtrar por año |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único del período |
| **Nombre** | Nombre descriptivo (ej: "Quincena 1 Enero") |
| **Fecha Inicio** | Primer día del período |
| **Fecha Fin** | Último día del período |
| **Fecha de Pago** | Cuándo se realiza el pago |
| **Total Neto** | Monto total a pagar |
| **Empleados** | Cantidad de empleados incluidos |
| **Estado** | Estado actual del período |
| **Acciones** | Ver, Editar, Eliminar |

---

### Crear un Nuevo Período

1. En la lista de períodos, haga clic en el botón **"+ Nuevo Período"**
2. Se abrirá un formulario con los siguientes campos:

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "NOM-2025-01") |
| **Nombre** | ✅ Sí | Nombre descriptivo |
| **Tipo de Período** | ✅ Sí | Semanal, Quincenal o Mensual |
| **Fecha de Inicio** | ✅ Sí | Primer día del período |
| **Fecha de Fin** | ✅ Sí | Último día del período |
| **Fecha de Pago** | ✅ Sí | Cuándo se realizará el pago |
| **Moneda** | ✅ Sí | USD o VES |
| **Tasa de Cambio** | ❌ No | Tasa de cambio del día |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**
5. El período se crea en estado **"Borrador"**

---

### Procesar un Período de Nómina

El proceso de nómina sigue estos pasos:

#### Paso 1: Generar Entradas

1. Abra el detalle del período (clic en el ícono de ojo 👁)
2. Haga clic en el botón **"Generar Entradas"**
3. Confirme la acción
4. El sistema:
   - Busca todos los empleados activos
   - Calcula el salario base de cada uno
   - Aplica las deducciones legales (SSO, RPE, FAOV, ISLR)
   - Descuenta cuotas de préstamos activos
   - Genera una entrada por cada empleado

#### Paso 2: Revisar Entradas

1. En el detalle del período, verá la tabla de entradas
2. Cada entrada muestra:
   - Nombre del empleado
   - Cargo
   - Salario base
   - Total bruto
   - Deducciones
   - Neto a pagar
3. Si necesita ajustar alguna entrada, haga clic en el ícono de **lápiz** (✏️)

#### Paso 3: Aprobar el Período

1. Una vez revisadas las entradas, haga clic en **"Aprobar"**
2. Confirme la acción
3. El estado cambia a **"Aprobado"**
4. Ya no se pueden modificar las entradas

#### Paso 4: Marcar como Pagado

1. Después de realizar el pago (transferencias, cheques, etc.)
2. Haga clic en **"Marcar como Pagado"**
3. Confirme la acción
4. El estado cambia a **"Pagado"**

---

### Ver Detalle de un Período

1. En la lista, haga clic en el ícono de **ojo** (👁) en la columna de acciones
2. Verá:

#### Indicadores Principales
- **Total Bruto**: Suma de salarios antes de deducciones
- **Total Deducciones**: Suma de todas las deducciones
- **Total Neto**: Monto total a pagar
- **Empleados**: Cantidad de empleados en el período

#### Información del Período
- Tipo de período
- Fechas de inicio, fin y pago
- Moneda y tasa de cambio

#### Tabla de Entradas
Lista de todos los empleados con sus montos calculados.

---

### Descargar Documentos

#### Resumen de Nómina
1. En el detalle del período, haga clic en **"Descargar PDF"**
2. Se genera un PDF con el resumen completo

#### Recibo Individual
1. En la tabla de entradas, haga clic en el ícono de **recibo** (🧾) del empleado
2. Se genera el recibo de pago individual

---

## Préstamos a Empleados

### Ver Lista de Préstamos

1. En el menú, seleccione **"Nómina"** → **"Préstamos"**
2. Verá la lista de todos los préstamos

#### Filtros Disponibles

| Filtro | Descripción |
|--------|-------------|
| **Estado** | Activo, Pagado, Cancelado, Pausado |
| **Tipo** | Personal, Adelanto, Emergencia, Otro |
| **Fecha Desde** | Filtrar por fecha de inicio |
| **Fecha Hasta** | Filtrar por fecha de fin |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador del préstamo |
| **Empleado** | Nombre del empleado |
| **Tipo** | Tipo de préstamo |
| **Monto** | Monto total del préstamo |
| **Cuota** | Monto de cada cuota |
| **Progreso** | Cuotas pagadas / Total cuotas |
| **Pendiente** | Monto que falta por pagar |
| **Estado** | Estado actual |
| **Acciones** | Ver detalle |

---

### Crear un Nuevo Préstamo

1. En la lista de préstamos, haga clic en **"+ Nuevo Préstamo"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Empleado** | ✅ Sí | Seleccione el empleado |
| **Tipo de Préstamo** | ✅ Sí | Personal, Adelanto, Emergencia, Otro |
| **Monto Total** | ✅ Sí | Monto del préstamo |
| **Moneda** | ✅ Sí | USD o VES |
| **Número de Cuotas** | ✅ Sí | En cuántas cuotas se pagará |
| **Fecha de Inicio** | ✅ Sí | Desde cuándo empezar a descontar |
| **Motivo** | ❌ No | Razón del préstamo |

3. El sistema calcula automáticamente el monto de cada cuota
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Préstamo

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:

#### Información del Préstamo
- Código y tipo
- Empleado (enlace a su ficha)
- Monto total y cuota
- Fecha de inicio
- Estado

#### Progreso de Pago
- Barra de progreso visual
- Cuotas pagadas vs total
- Monto pendiente

#### Historial de Pagos
Lista de cuotas descontadas:
- Fecha del descuento
- Período de nómina
- Monto descontado

---

### Acciones sobre Préstamos

#### Pausar un Préstamo
1. En el detalle del préstamo, haga clic en **"Pausar"**
2. El préstamo deja de descontarse de la nómina
3. Puede reactivarlo cuando desee

#### Cancelar un Préstamo
1. En el detalle del préstamo, haga clic en **"Cancelar"**
2. Confirme la acción
3. El préstamo se marca como cancelado
4. El saldo pendiente queda sin cobrar

#### Registrar Pago Manual
1. Si el empleado paga una cuota fuera de nómina
2. Haga clic en **"Registrar Pago"**
3. Ingrese el monto y la fecha
4. El sistema actualiza el saldo pendiente

---

## Flujo Completo de Nómina

```
1. CREAR PERÍODO
   ↓
2. GENERAR ENTRADAS (automático)
   ↓
3. REVISAR Y AJUSTAR (si es necesario)
   ↓
4. APROBAR
   ↓
5. REALIZAR PAGOS (fuera del sistema)
   ↓
6. MARCAR COMO PAGADO
```

---

## Consejos Útiles

### Para Períodos de Nómina
- ✅ Verifique que todos los empleados tengan salario base registrado
- ✅ Revise las entradas antes de aprobar
- ✅ Genere los recibos individuales para cada empleado
- ✅ Guarde el PDF del resumen para sus registros

### Para Préstamos
- ✅ Defina cuotas que el empleado pueda pagar cómodamente
- ✅ Documente el motivo del préstamo
- ✅ Revise el estado de préstamos antes de cada nómina
- ✅ Use "Pausar" en lugar de "Cancelar" si es temporal

### Mejores Prácticas
- ✅ Procese la nómina con suficiente anticipación
- ✅ Mantenga actualizada la información de empleados
- ✅ Revise los totales antes de aprobar
- ✅ Archive los PDFs de cada período

---

## Preguntas Frecuentes

### ¿Por qué un empleado no aparece en la nómina?
Verifique que el empleado tenga estado "Activo" y que tenga un salario base registrado en su ficha.

### ¿Puedo modificar una entrada después de aprobar?
No. Una vez aprobado el período, las entradas no se pueden modificar. Si hay un error, debe cancelar el período y crear uno nuevo.

### ¿Cómo se calculan las deducciones?
El sistema aplica automáticamente los porcentajes legales venezolanos sobre el salario base: SSO (4%), RPE (0.5%), FAOV (1%) e ISLR (variable según el monto).

### ¿Qué pasa si un empleado tiene un préstamo activo?
La cuota del préstamo se descuenta automáticamente al generar las entradas de nómina.

### ¿Puedo tener varios préstamos para un mismo empleado?
Sí, un empleado puede tener varios préstamos activos. Todas las cuotas se descontarán de su nómina.

### ¿Cómo veo el historial de pagos de un empleado?
Vaya a la ficha del empleado en el módulo de Empleados y busque la pestaña de "Nómina" o "Pagos".
