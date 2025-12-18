# 🛒 Módulo de Procura - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Compras"** o **"Procura"**
2. Se despliegan las opciones:
   - Órdenes de Compra
   - Facturas
   - Pagos
   - Cotizaciones

---

## Órdenes de Compra

### Lista de Órdenes

**Ruta:** `/procurement/purchase-orders`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o proveedor |
| **Estado** | Borrador, Pendiente, Aprobada, etc. |
| **Tipo** | Compra, Servicio, Obra |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único (OC-XXXXX) |
| **Tipo** | Compra/Servicio/Obra |
| **Proveedor** | Nombre del proveedor |
| **Fecha** | Fecha de la orden |
| **Total** | Monto total |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, PDF |

---

### Crear Orden de Compra

**Ruta:** `/procurement/purchase-orders/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Compra, Servicio, Obra |
| **Proveedor** | ✅ | Seleccionar proveedor |
| **Proyecto** | ❌ | Proyecto asociado |
| **Fecha** | ✅ | Fecha de la orden |
| **Fecha Entrega** | ❌ | Fecha esperada de entrega |
| **Moneda** | ✅ | USD, VES |
| **Notas** | ❌ | Observaciones |

#### Items de la Orden

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Descripción** | ✅ | Descripción del item |
| **Cantidad** | ✅ | Cantidad solicitada |
| **Unidad** | ✅ | Unidad de medida |
| **Precio Unitario** | ✅ | Precio por unidad |
| **Impuesto** | ❌ | Porcentaje de impuesto |

#### Pasos
1. Hacer clic en **"+ Nueva Orden"**
2. Seleccionar tipo de orden
3. Seleccionar proveedor
4. Agregar items con cantidades y precios
5. Definir fecha de entrega
6. Hacer clic en **"Guardar"** (queda como borrador)

---

### Detalle de Orden

**Ruta:** `/procurement/purchase-orders/:id`

#### Encabezado
- Código y tipo
- Proveedor
- Estado (chip de color)
- Fechas
- Totales

#### Acciones según Estado

| Estado | Acciones Disponibles |
|--------|---------------------|
| **DRAFT** | Editar, Enviar para Aprobación, Eliminar |
| **PENDING** | Aprobar, Rechazar |
| **APPROVED** | Enviar a Proveedor |
| **SENT** | Marcar como Confirmada |
| **CONFIRMED** | Registrar Recepción |
| **IN_PROGRESS** | Registrar Recepción, Completar |

#### Tabs Disponibles
- **Items**: Lista de items de la orden
- **Recepciones**: Entregas recibidas
- **Facturas**: Facturas asociadas
- **Documentos**: Archivos adjuntos
- **Auditoría**: Historial de cambios

---

### Flujo de Aprobación

1. **Crear Orden** → Estado: DRAFT
2. **Enviar para Aprobación** → Estado: PENDING
3. **Aprobar** → Estado: APPROVED
4. **Enviar a Proveedor** → Estado: SENT
5. **Proveedor Confirma** → Estado: CONFIRMED
6. **Recibir Mercancía** → Estado: IN_PROGRESS o PARTIAL
7. **Completar** → Estado: COMPLETED

---

## Facturas de Proveedores

### Lista de Facturas

**Ruta:** `/procurement/invoices`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Proveedor** | Todos los proveedores |
| **Estado** | Pendiente, Verificada, Aprobada, Pagada |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Código interno |
| **Nº Factura** | Número del proveedor |
| **Proveedor** | Nombre del proveedor |
| **Fecha** | Fecha de factura |
| **Vencimiento** | Fecha de vencimiento |
| **Total** | Monto total |
| **Pagado** | Monto pagado |
| **Estado** | Estado actual |

---

### Registrar Factura

**Ruta:** `/procurement/invoices/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Proveedor** | ✅ | Seleccionar proveedor |
| **Nº Factura** | ✅ | Número de factura del proveedor |
| **Orden de Compra** | ❌ | OC asociada |
| **Fecha Factura** | ✅ | Fecha de emisión |
| **Fecha Vencimiento** | ✅ | Fecha de pago |
| **Subtotal** | ✅ | Monto antes de impuestos |
| **Impuesto** | ❌ | Monto de impuestos |
| **Total** | ✅ | Monto total |
| **Moneda** | ✅ | USD, VES |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nueva Factura"**
2. Seleccionar proveedor
3. Ingresar número de factura
4. Asociar a orden de compra (si aplica)
5. Ingresar fechas y montos
6. Adjuntar copia de factura
7. Hacer clic en **"Guardar"**

---

### Detalle de Factura

**Ruta:** `/procurement/invoices/:id`

#### Información
- Código interno y número de factura
- Proveedor
- Orden de compra asociada
- Fechas
- Montos (subtotal, impuesto, total)
- Monto pagado y pendiente
- Estado

#### Acciones según Estado

| Estado | Acciones |
|--------|----------|
| **PENDING** | Verificar, Cancelar |
| **VERIFIED** | Aprobar, Rechazar |
| **APPROVED** | Registrar Pago |
| **PARTIAL** | Registrar Pago |

#### Tabs
- **Pagos**: Pagos realizados
- **Documentos**: Factura adjunta
- **Auditoría**: Historial

---

## Pagos a Proveedores

### Lista de Pagos

**Ruta:** `/procurement/payments`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Proveedor** | Todos los proveedores |
| **Estado** | Pendiente, Procesando, Completado |
| **Método** | Transferencia, Cheque, etc. |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Código del pago |
| **Factura** | Factura asociada |
| **Proveedor** | Nombre del proveedor |
| **Fecha** | Fecha del pago |
| **Monto** | Monto pagado |
| **Método** | Método de pago |
| **Estado** | Estado del pago |

---

### Registrar Pago

**Ruta:** `/procurement/payments/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Factura** | ✅ | Factura a pagar |
| **Monto** | ✅ | Monto del pago |
| **Fecha** | ✅ | Fecha del pago |
| **Método** | ✅ | Transferencia, Cheque, etc. |
| **Cuenta Bancaria** | ✅ | Cuenta de origen |
| **Referencia** | ❌ | Número de referencia |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nuevo Pago"**
2. Seleccionar factura a pagar
3. Ingresar monto (puede ser parcial)
4. Seleccionar método de pago
5. Seleccionar cuenta bancaria
6. Ingresar referencia bancaria
7. Hacer clic en **"Guardar"**

---

## Cotizaciones

### Lista de Cotizaciones

**Ruta:** `/procurement/quotes`

Permite gestionar cotizaciones recibidas de proveedores para comparar y seleccionar la mejor opción.

---

## Tips y Mejores Prácticas

### Para Órdenes de Compra
- ✅ Verificar stock antes de crear OC
- ✅ Comparar cotizaciones de varios proveedores
- ✅ Definir fechas de entrega realistas
- ✅ Documentar especificaciones detalladas

### Para Facturas
- ✅ Verificar que coincida con la OC
- ✅ Verificar cantidades y precios
- ✅ Adjuntar siempre la factura original
- ✅ Registrar antes del vencimiento

### Para Pagos
- ✅ Verificar fondos disponibles
- ✅ Registrar referencia bancaria
- ✅ Mantener documentación de pagos
- ✅ Conciliar con estados de cuenta

---

## Solución de Problemas

### "No puedo aprobar la orden"
- Verificar que tenga permiso `procurement:approve`
- Verificar que la orden esté en estado PENDING
- Verificar que tenga items agregados

### "La factura no coincide con la OC"
- Verificar cantidades y precios
- Verificar que sea el proveedor correcto
- Contactar al proveedor para aclarar

### "El pago no se refleja"
- Verificar que el pago esté en estado COMPLETED
- Verificar que se asoció a la factura correcta
- Verificar el monto registrado

### "Orden parcialmente recibida"
- Registrar cada recepción parcial
- El estado cambia a PARTIAL
- Completar cuando se reciba todo
