# 💵 Módulo de Caja Chica - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Caja Chica"**
2. Se despliegan las opciones:
   - Cajas Chicas
   - Reportes de Gastos

---

## Lista de Cajas Chicas

**Ruta:** `/petty-cash`

### KPIs en la Parte Superior

| KPI | Descripción |
|-----|-------------|
| **Cajas Activas** | Cantidad de cajas en operación |
| **Saldo Total** | Suma de saldos de todas las cajas |
| **Necesitan Reposición** | Cajas con saldo bajo el mínimo |
| **Pendientes de Aprobación** | Gastos sin aprobar |
| **Gastos del Mes** | Total gastado en el mes |

### Tarjetas de Caja Chica

Cada caja se muestra como una tarjeta con:
- Nombre y código
- Estado (chip de color)
- Custodio asignado
- Saldo actual vs inicial
- Barra de progreso del saldo
- Alerta si saldo bajo el mínimo
- Botones: Ver, Editar

### Indicadores de Saldo

| Color | Significado |
|-------|-------------|
| 🟢 Verde | Saldo saludable (> 150% del mínimo) |
| 🟡 Naranja | Saldo bajo (entre 100% y 150% del mínimo) |
| 🔴 Rojo | Necesita reposición (< mínimo) |

---

## Crear Caja Chica

**Ruta:** `/petty-cash/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre descriptivo (ej: "Caja Oficina Principal") |
| **Código** | ✅ | Código único (ej: "PC-001") |
| **Custodio** | ✅ | Empleado responsable |
| **Moneda** | ✅ | USD, VES |
| **Monto Inicial** | ✅ | Saldo de apertura |
| **Saldo Mínimo** | ✅ | Monto para alerta de reposición |
| **Descripción** | ❌ | Propósito de la caja |
| **Estado** | ❌ | Activa (default) |

### Pasos
1. Hacer clic en **"+ Nueva Caja Chica"**
2. Completar nombre y código
3. Seleccionar custodio
4. Definir moneda y montos
5. Hacer clic en **"Guardar"**
6. Se crea movimiento inicial automáticamente

---

## Detalle de Caja Chica

**Ruta:** `/petty-cash/:id`

### Encabezado
- Nombre y código
- Estado (chip de color)
- Custodio (enlace al empleado)
- Botones: Editar, Refrescar

### KPIs de la Caja

| KPI | Descripción |
|-----|-------------|
| **Saldo Actual** | Saldo disponible |
| **Monto Inicial** | Saldo de apertura |
| **Total Gastado** | Suma de gastos aprobados |
| **Pendientes** | Gastos por aprobar |

### Barra de Saldo
- Muestra porcentaje del saldo actual vs inicial
- Color según nivel de saldo
- Alerta si está bajo el mínimo

### Acciones Principales

| Botón | Descripción |
|-------|-------------|
| **Nuevo Gasto** | Registrar un gasto |
| **Solicitar Reposición** | Pedir fondos adicionales |
| **Descargar PDF** | Exportar movimientos |

### Tabs Disponibles

#### Tab: Movimientos
Lista de todos los movimientos:
- Fecha
- Tipo (Gasto, Reposición, Ajuste)
- Descripción
- Empleado
- Monto
- Estado
- Acciones (Aprobar/Rechazar si pendiente)

#### Tab: Documentos
Comprobantes adjuntos a los movimientos.

#### Tab: Auditoría
Historial de cambios en la caja.

---

## Registrar Gasto

### Desde el Detalle de Caja
1. Hacer clic en **"Nuevo Gasto"**
2. Se abre diálogo de gasto

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Gasto (default) |
| **Monto** | ✅ | Monto del gasto |
| **Categoría** | ✅ | Suministros, Transporte, etc. |
| **Descripción** | ✅ | Detalle del gasto |
| **Empleado** | ❌ | Quien realizó el gasto |
| **Referencia** | ❌ | Número de factura/recibo |
| **Fecha** | ✅ | Fecha del gasto |

### Pasos
1. Clic en "Nuevo Gasto"
2. Ingresar monto y descripción
3. Seleccionar categoría
4. Agregar referencia de factura
5. Hacer clic en **"Guardar"**
6. El gasto queda en estado PENDING
7. Adjuntar comprobante (opcional pero recomendado)

---

## Aprobar/Rechazar Gastos

### Desde la Lista de Movimientos
1. Ir al detalle de la caja chica
2. En tab "Movimientos", ver gastos pendientes
3. Para cada gasto:
   - Revisar descripción y monto
   - Ver comprobante adjunto
   - Clic en ✅ para aprobar o ❌ para rechazar

### Aprobar
- El gasto se marca como APPROVED
- El saldo de la caja disminuye
- Se registra quién aprobó y cuándo

### Rechazar
- El gasto se marca como REJECTED
- El saldo NO se afecta
- Se puede agregar motivo de rechazo

---

## Solicitar Reposición

### Cuándo Solicitar
- Cuando el saldo está bajo el mínimo
- Cuando hay muchos gastos pendientes de fondos

### Pasos
1. Ir al detalle de la caja chica
2. Clic en **"Solicitar Reposición"**
3. Ingresar monto a reponer
4. Agregar justificación
5. Hacer clic en **"Enviar Solicitud"**
6. La solicitud queda pendiente de aprobación

### Aprobar Reposición
1. Supervisor recibe notificación
2. Revisa solicitud y justificación
3. Aprueba o rechaza
4. Si aprobado, Finanzas procesa transferencia
5. Se registra reposición y saldo aumenta

---

## Reportes de Gastos

### Lista de Reportes

**Ruta:** `/petty-cash/expense-reports`

Lista de reportes de gastos creados:
- Código del reporte
- Caja chica asociada
- Período
- Total de gastos
- Estado
- Acciones

### Crear Reporte de Gastos

**Ruta:** `/petty-cash/expense-reports/new`

1. Seleccionar caja chica
2. Definir período (fecha inicio y fin)
3. El sistema agrupa los gastos aprobados del período
4. Revisar y ajustar si necesario
5. Guardar reporte
6. Enviar para aprobación

### Detalle del Reporte

**Ruta:** `/petty-cash/expense-reports/:id`

- Información del reporte
- Lista de gastos incluidos
- Total por categoría
- Comprobantes adjuntos
- Estado de aprobación
- Exportar a PDF

---

## Adjuntar Comprobantes

### Al Registrar Gasto
1. Después de guardar el gasto
2. En el detalle del movimiento
3. Clic en "Adjuntar Archivo"
4. Seleccionar imagen o PDF
5. El archivo se asocia al movimiento

### Tipos de Archivo Permitidos
- Imágenes: JPG, PNG
- Documentos: PDF
- Tamaño máximo: 5MB

### Buenas Prácticas
- Adjuntar siempre el comprobante original
- Asegurar que sea legible
- Incluir número de factura en la referencia

---

## Tips y Mejores Prácticas

### Para Custodios
- ✅ Registrar gastos el mismo día que ocurren
- ✅ Adjuntar comprobantes inmediatamente
- ✅ Solicitar reposición antes de quedarse sin fondos
- ✅ Mantener organizado el archivo físico de comprobantes

### Para Supervisores
- ✅ Revisar gastos pendientes diariamente
- ✅ Verificar comprobantes antes de aprobar
- ✅ Rechazar gastos sin justificación adecuada
- ✅ Monitorear cajas con saldo bajo

### Para Control
- ✅ Realizar arqueos periódicos
- ✅ Comparar saldo físico vs sistema
- ✅ Investigar diferencias inmediatamente
- ✅ Generar reportes mensuales

---

## Solución de Problemas

### "El saldo no coincide con el efectivo físico"
1. Verificar gastos pendientes de aprobar
2. Buscar gastos rechazados que se pagaron
3. Verificar reposiciones registradas
4. Realizar ajuste si es necesario

### "No puedo registrar gasto"
- Verificar que la caja esté activa
- Verificar que tenga saldo suficiente
- Verificar permisos de usuario

### "La reposición no se refleja"
- Verificar que la reposición esté aprobada
- Verificar que se haya registrado correctamente
- Contactar a Finanzas si hay dudas

### "No aparece el comprobante"
- Verificar que el archivo se subió correctamente
- Verificar el tamaño del archivo (máx 5MB)
- Intentar subir nuevamente

### "Gasto rechazado por error"
- Los gastos rechazados no se pueden aprobar después
- Crear nuevo registro de gasto
- Documentar el error para auditoría
