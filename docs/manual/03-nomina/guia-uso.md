# 💰 Módulo de Nómina - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Nómina"**
2. Se despliegan las opciones:
   - Períodos
   - Préstamos

---

## Períodos de Nómina

### Lista de Períodos

**Ruta:** `/payroll`

#### KPIs en la Parte Superior
| KPI | Descripción |
|-----|-------------|
| **Total Anual** | Suma de nóminas pagadas en el año |
| **Períodos Pendientes** | Períodos sin pagar |
| **Préstamos Activos** | Cantidad de préstamos vigentes |
| **Monto Total Préstamos** | Saldo pendiente de préstamos |

#### Filtros Disponibles
| Filtro | Opciones |
|--------|----------|
| **Estado** | Todos, Borrador, Calculando, Pendiente, Aprobado, Pagado |
| **Año** | Últimos 5 años |

#### Columnas de la Tabla (Desktop)
| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único (NOM-2025-01) |
| **Nombre** | Nombre descriptivo del período |
| **Fecha Inicio** | Inicio del período |
| **Fecha Fin** | Fin del período |
| **Fecha Pago** | Fecha programada de pago |
| **Total Neto** | Monto total a pagar |
| **Empleados** | Cantidad de empleados |
| **Estado** | Borrador, Aprobado, Pagado, etc. |
| **Acciones** | Ver, Editar, Eliminar |

#### Vista Mobile
Tarjetas con:
- Código y nombre
- Estado (chip de color)
- Fechas de inicio y fin
- Total neto y cantidad de empleados
- Botones de acción

---

### Crear Período de Nómina

1. Hacer clic en **"+ Nuevo Período"**
2. Se abre un diálogo con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único (ej: NOM-2025-01) |
| **Nombre** | ✅ | Nombre descriptivo |
| **Tipo de Período** | ✅ | Semanal, Quincenal, Mensual |
| **Fecha Inicio** | ✅ | Primer día del período |
| **Fecha Fin** | ✅ | Último día del período |
| **Fecha de Pago** | ✅ | Fecha de procesamiento del pago |
| **Moneda** | ✅ | USD, VES |
| **Tasa de Cambio** | ❌ | Tasa USD/VES si aplica |

3. Hacer clic en **"Guardar"**
4. El período se crea en estado **DRAFT**

---

### Detalle del Período

**Ruta:** `/payroll/periods/:id`

#### Encabezado
- Nombre del período
- Código
- Estado (chip de color)
- Botón de volver

#### KPIs del Período
| KPI | Descripción |
|-----|-------------|
| **Total Bruto** | Suma de salarios brutos |
| **Total Deducciones** | Suma de todas las deducciones |
| **Total Neto** | Monto a pagar (Bruto - Deducciones) |
| **Empleados** | Cantidad de empleados en el período |

#### Información del Período
- Tipo de período (Semanal, Quincenal, Mensual)
- Fecha de inicio
- Fecha de fin
- Fecha de pago
- Moneda
- Tasa de cambio

#### Acciones Disponibles

| Estado Actual | Acción | Descripción |
|---------------|--------|-------------|
| **DRAFT** | Generar Entradas | Crea entradas para todos los empleados activos |
| **CALCULATING/PENDING** | Aprobar | Autoriza el período para pago |
| **APPROVED** | Marcar como Pagado | Indica que el pago fue procesado |
| **Cualquiera** | Descargar PDF | Exporta resumen del período |

#### Tabla de Entradas

| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre del empleado (enlace al detalle) |
| **Apellido** | Apellido del empleado |
| **Cargo** | Posición del empleado |
| **Salario Base** | Salario mensual base |
| **Salario Bruto** | Bruto del período (proporcional) |
| **Deducciones** | Total de deducciones |
| **Neto** | Monto a recibir |
| **Estado Pago** | Pendiente/Pagado |
| **Acciones** | Editar entrada |

---

### Flujo de Trabajo Completo

#### Paso 1: Crear Período
1. Clic en "Nuevo Período"
2. Completar datos
3. Guardar (estado: DRAFT)

#### Paso 2: Generar Entradas
1. Abrir detalle del período
2. Clic en **"Generar Entradas"**
3. Confirmar en el diálogo
4. El sistema:
   - Obtiene todos los empleados activos
   - Calcula salario proporcional por días
   - Aplica deducciones legales (SSO, RPE, FAOV, ISLR)
   - Descuenta cuotas de préstamos activos
5. Estado cambia a CALCULATING o PENDING_APPROVAL

#### Paso 3: Revisar y Ajustar
1. Revisar cada entrada en la tabla
2. Si necesita ajustes, clic en **"Editar"** en la entrada
3. Modificar montos de bonos, deducciones adicionales
4. Guardar cambios

#### Paso 4: Aprobar
1. Clic en **"Aprobar"**
2. Confirmar en el diálogo
3. Estado cambia a APPROVED
4. Ya no se pueden editar entradas

#### Paso 5: Procesar Pago
1. Realizar transferencias bancarias (proceso externo)
2. Verificar que todos los pagos fueron procesados

#### Paso 6: Marcar como Pagado
1. Clic en **"Marcar como Pagado"**
2. Confirmar en el diálogo
3. Estado cambia a PAID
4. Se registra la fecha de pago real

---

## Préstamos

### Lista de Préstamos

**Ruta:** `/payroll/loans`

#### Filtros Disponibles
| Filtro | Opciones |
|--------|----------|
| **Estado** | Todos, Activo, Pagado, Cancelado, Pausado |
| **Tipo** | Todos, Personal, Adelanto, Emergencia, Otro |
| **Fecha Inicio** | Desde fecha |
| **Fecha Fin** | Hasta fecha |

#### Columnas de la Tabla (Desktop)
| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único (LOAN-XXXXX) |
| **Empleado** | Nombre del beneficiario |
| **Tipo** | Personal, Adelanto, Emergencia, Otro |
| **Monto** | Monto total del préstamo |
| **Cuota** | Monto de cada cuota |
| **Progreso** | Cuotas pagadas / Total |
| **Saldo** | Monto pendiente |
| **Estado** | Activo, Pagado, Cancelado, Pausado |
| **Acciones** | Ver detalle |

#### Vista Mobile
Tarjetas con:
- Código y empleado
- Estado (chip de color)
- Tipo de préstamo
- Monto y cuota
- Progreso (cuotas pagadas)
- Saldo pendiente
- Barra de progreso visual

---

### Crear Préstamo

**Ruta:** `/payroll/loans/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Empleado** | ✅ | Seleccionar empleado |
| **Tipo de Préstamo** | ✅ | Personal, Adelanto, Emergencia, Otro |
| **Monto** | ✅ | Monto total del préstamo |
| **Moneda** | ✅ | USD, VES |
| **Número de Cuotas** | ✅ | Cantidad de cuotas |
| **Fecha de Inicio** | ✅ | Cuándo empezar a descontar |
| **Descripción** | ❌ | Motivo del préstamo |

#### Pasos
1. Hacer clic en **"+ Nuevo Préstamo"**
2. Seleccionar empleado
3. Elegir tipo de préstamo
4. Ingresar monto y número de cuotas
5. El sistema calcula automáticamente el monto de cada cuota
6. Establecer fecha de inicio de descuento
7. Hacer clic en **"Guardar"**
8. El préstamo queda pendiente de aprobación

---

### Detalle del Préstamo

**Ruta:** `/payroll/loans/:id`

#### Información del Préstamo
- Código
- Empleado (enlace al detalle)
- Tipo de préstamo
- Monto total
- Monto de cuota
- Cuotas pagadas / Total
- Saldo pendiente
- Fecha de inicio
- Estado

#### Historial de Pagos
Tabla con cada pago/cuota:
- Número de cuota
- Fecha
- Monto
- Período de nómina asociado
- Estado

#### Acciones Disponibles

| Estado | Acción | Descripción |
|--------|--------|-------------|
| **Pendiente** | Aprobar | Activa el préstamo |
| **Pendiente** | Rechazar | Cancela la solicitud |
| **Activo** | Pausar | Suspende temporalmente los descuentos |
| **Pausado** | Reactivar | Reanuda los descuentos |
| **Activo** | Cancelar | Cancela el préstamo (con saldo pendiente) |

---

## Cálculo de Deducciones

### Deducciones Legales Venezolanas

El sistema calcula automáticamente:

```
Salario Bruto = Salario Base × (Días del Período / 30)

SSO (4%)     = Salario Bruto × 0.04
RPE (0.5%)   = Salario Bruto × 0.005
FAOV (1%)    = Salario Bruto × 0.01
ISLR         = Según tabla simplificada

Total Deducciones = SSO + RPE + FAOV + ISLR + Cuota Préstamo

Salario Neto = Salario Bruto - Total Deducciones
```

### Descuento de Préstamos

- Los préstamos activos se descuentan automáticamente
- Una cuota por período de nómina
- El descuento se registra como pago del préstamo
- Cuando se completan todas las cuotas, el préstamo pasa a PAID

---

## Tips y Mejores Prácticas

### Al Crear Períodos
- ✅ Usar códigos consistentes (NOM-2025-01, NOM-2025-02)
- ✅ Verificar fechas de inicio y fin correctas
- ✅ Establecer fecha de pago realista
- ✅ Verificar tasa de cambio actualizada

### Al Generar Entradas
- ✅ Verificar que todos los empleados activos tienen salario asignado
- ✅ Revisar empleados nuevos o con cambios recientes
- ✅ Verificar cuentas bancarias actualizadas

### Al Aprobar
- ✅ Revisar totales antes de aprobar
- ✅ Verificar que no hay entradas con errores
- ✅ Confirmar disponibilidad de fondos

### Para Préstamos
- ✅ Verificar capacidad de pago del empleado
- ✅ Documentar el motivo del préstamo
- ✅ Establecer cuotas razonables según salario

---

## Solución de Problemas

### "No se generaron entradas"
- Verificar que existen empleados con estado ACTIVE
- Verificar que los empleados tienen salario asignado
- Verificar que el período no se superpone con otro

### "El monto neto es incorrecto"
- Revisar deducciones manuales agregadas
- Verificar préstamos activos del empleado
- Revisar cálculo de días trabajados

### "No puedo editar el período"
- Solo se puede editar en estado DRAFT
- Una vez aprobado, no se pueden hacer cambios
- Si necesita correcciones, crear un período de ajuste

### "El préstamo no se descuenta"
- Verificar que el préstamo está en estado ACTIVE
- Verificar que la fecha de inicio ya pasó
- Verificar que el empleado está en el período de nómina

### "No puedo aprobar el período"
- Verificar que tiene el permiso `payroll:approve`
- Verificar que el período tiene entradas generadas
- Verificar que no hay errores en las entradas
