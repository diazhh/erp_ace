# 🛒 Compras y Procura

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Procura"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Órdenes de Compra**: Gestión de compras
   - **Facturas**: Facturas de proveedores
   - **Pagos**: Pagos realizados
   - **Cotizaciones**: Solicitudes de cotización

---

## Órdenes de Compra

### Ver Lista de Órdenes

![Lista de Órdenes de Compra](./images/09-procura-ordenes-lista.png)

1. En el menú, seleccione **"Procura"** → **"Órdenes de Compra"**
2. Verá la tabla/tarjetas de órdenes

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o título |
| **Estado** | Borrador, Pendiente, Aprobada, etc. |
| **Tipo** | Compra, Servicio, Obra |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Compra, Servicio, Obra |
| **Título** | Descripción breve |
| **Contratista** | Proveedor |
| **Fecha** | Fecha de la orden |
| **Total** | Monto total |
| **Progreso** | Porcentaje de entrega |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar |

---

### Crear una Orden de Compra

![Nueva Orden de Compra](./images/09-procura-ordenes-nueva.png)

1. Haga clic en el botón **"+ Nueva Orden"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "OC-2025-001") |
| **Título** | ✅ Sí | Descripción breve |
| **Tipo** | ✅ Sí | Compra, Servicio, Obra |
| **Contratista** | ✅ Sí | Seleccione proveedor |
| **Proyecto** | ❌ No | Proyecto asociado |
| **Fecha** | ✅ Sí | Fecha de la orden |
| **Fecha de Entrega** | ❌ No | Fecha esperada |
| **Moneda** | ✅ Sí | USD, VES |
| **Descripción** | ❌ No | Detalle de la orden |

#### Agregar Ítems

1. En la sección de ítems, haga clic en **"Agregar Ítem"**
2. Complete:
   - Descripción del ítem
   - Cantidad
   - Unidad
   - Precio unitario
3. El sistema calcula el subtotal automáticamente

3. Haga clic en **"Guardar"**
4. La orden queda en estado "Borrador"

---

### Flujo de una Orden de Compra

```
1. BORRADOR → Crear y editar la orden
   ↓
2. PENDIENTE → Enviar para aprobación
   ↓
3. APROBADA → Aprobada por supervisor
   ↓
4. ENVIADA → Enviada al proveedor
   ↓
5. CONFIRMADA → Proveedor confirma
   ↓
6. EN PROGRESO → Entregas en curso
   ↓
7. COMPLETADA → Todo entregado
```

---

### Ver Detalle de una Orden

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información general
   - Lista de ítems
   - Historial de entregas
   - Facturas asociadas
   - Documentos adjuntos

---

## Facturas de Proveedores

### Ver Lista de Facturas

1. En el menú, seleccione **"Procura"** → **"Facturas"**
2. Verá la lista de facturas recibidas

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Estado** | Pendiente, Aprobada, Pagada, etc. |
| **Contratista** | Filtrar por proveedor |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Código interno |
| **Nº Factura** | Número del proveedor |
| **Contratista** | Proveedor |
| **Fecha** | Fecha de factura |
| **Vencimiento** | Fecha de pago |
| **Total** | Monto total |
| **Pagado** | Monto ya pagado |
| **Estado** | Estado actual |
| **Acciones** | Ver, Aprobar |

---

### Registrar una Factura

1. Haga clic en el botón **"+ Nueva Factura"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Contratista** | ✅ Sí | Proveedor que emite |
| **Nº Factura** | ✅ Sí | Número de la factura |
| **Fecha** | ✅ Sí | Fecha de emisión |
| **Vencimiento** | ✅ Sí | Fecha límite de pago |
| **Orden de Compra** | ❌ No | Orden asociada |
| **Subtotal** | ✅ Sí | Monto sin impuestos |
| **Impuestos** | ❌ No | Monto de impuestos |
| **Total** | Auto | Se calcula automáticamente |
| **Moneda** | ✅ Sí | USD, VES |

3. Haga clic en **"Guardar"**
4. La factura queda en estado "Pendiente"

---

### Aprobar una Factura

1. En la lista de facturas, busque una en estado "Pendiente"
2. Haga clic en el ícono de **check verde** (✅)
3. Confirme la aprobación
4. El estado cambia a "Aprobada"
5. La factura está lista para pago

---

## Pagos a Proveedores

### Ver Lista de Pagos

1. En el menú, seleccione **"Procura"** → **"Pagos"**
2. Verá el historial de pagos realizados

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador del pago |
| **Contratista** | Proveedor |
| **Factura** | Factura pagada |
| **Fecha** | Fecha del pago |
| **Monto** | Cantidad pagada |
| **Método** | Transferencia, Cheque, etc. |
| **Estado** | Completado, Pendiente |

---

### Registrar un Pago

1. Haga clic en el botón **"+ Nuevo Pago"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Factura** | ✅ Sí | Factura a pagar |
| **Fecha** | ✅ Sí | Fecha del pago |
| **Monto** | ✅ Sí | Cantidad a pagar |
| **Método de Pago** | ✅ Sí | Transferencia, Cheque, Efectivo |
| **Referencia** | ❌ No | Número de transferencia |
| **Cuenta Bancaria** | ❌ No | Cuenta de origen |
| **Notas** | ❌ No | Observaciones |

3. Haga clic en **"Guardar"**
4. El monto se descuenta del saldo de la factura

---

## Cotizaciones

### Ver Lista de Cotizaciones

1. En el menú, seleccione **"Procura"** → **"Cotizaciones"**
2. Verá las cotizaciones solicitadas y recibidas

### Crear una Solicitud de Cotización

1. Haga clic en **"+ Nueva Cotización"**
2. Complete:
   - Descripción de lo que necesita
   - Proveedores a consultar
   - Fecha límite de respuesta
3. Envíe la solicitud

### Comparar Cotizaciones

1. Cuando reciba respuestas, regístrelas en el sistema
2. Compare precios, plazos y condiciones
3. Seleccione la mejor opción
4. Convierta a orden de compra

---

## Consejos Útiles

### Para Órdenes de Compra
- ✅ Siempre asocie a un proyecto si aplica
- ✅ Detalle bien los ítems para evitar confusiones
- ✅ Verifique los precios antes de aprobar
- ✅ Actualice el progreso al recibir entregas

### Para Facturas
- ✅ Registre las facturas inmediatamente al recibirlas
- ✅ Verifique que coincidan con las órdenes de compra
- ✅ Controle las fechas de vencimiento
- ✅ Adjunte copia digital de la factura

### Para Pagos
- ✅ Registre la referencia de transferencia
- ✅ Puede hacer pagos parciales
- ✅ Verifique el saldo pendiente antes de pagar

---

## Preguntas Frecuentes

### ¿Puedo editar una orden aprobada?
No. Una vez aprobada, la orden no puede editarse. Si necesita cambios, debe cancelarla y crear una nueva.

### ¿Cómo registro una entrega parcial?
En el detalle de la orden, registre la cantidad recibida. El sistema actualiza el progreso automáticamente.

### ¿Puedo pagar una factura en partes?
Sí. Puede registrar múltiples pagos parciales hasta completar el total.

### ¿Qué pasa si rechazo una factura?
La factura queda en estado "Rechazada" y no puede pagarse. Debe comunicarse con el proveedor para resolver.

### ¿Cómo asocio una factura a una orden?
Al crear la factura, seleccione la orden de compra correspondiente en el campo "Orden de Compra".

### ¿Puedo ver el historial de un proveedor?
Sí. En el detalle del contratista puede ver todas sus órdenes, facturas y pagos.
