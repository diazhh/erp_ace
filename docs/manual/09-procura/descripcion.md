# 🛒 Módulo de Procura - Descripción

## ¿Qué hace este módulo?

El módulo de **Procura** gestiona el proceso completo de compras y contrataciones, desde la solicitud hasta el pago. Incluye órdenes de compra, facturas de proveedores y pagos.

## Funcionalidades Principales

### 1. Órdenes de Compra
- **Crear** órdenes de compra, servicio u obra
- **Aprobar** órdenes según flujo de autorización
- **Enviar** a proveedores
- **Seguimiento** de entregas parciales
- **Completar** cuando se recibe todo

### 2. Tipos de Orden
- **PURCHASE**: Compra de bienes/materiales
- **SERVICE**: Contratación de servicios
- **WORK**: Contratación de obras

### 3. Facturas de Proveedores
- **Registrar** facturas recibidas
- **Asociar** a órdenes de compra
- **Verificar** montos y cantidades
- **Aprobar** para pago

### 4. Pagos a Proveedores
- **Programar** pagos
- **Registrar** pagos realizados
- **Múltiples métodos** de pago
- **Seguimiento** de cuentas por pagar

### 5. Cotizaciones
- **Solicitar** cotizaciones a proveedores
- **Comparar** ofertas
- **Seleccionar** mejor opción

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `PurchaseOrder` | Órdenes de compra/servicio/obra |
| `PurchaseOrderItem` | Items de la orden |
| `SupplierInvoice` | Facturas de proveedores |
| `SupplierPayment` | Pagos a proveedores |
| `Quote` | Cotizaciones |

## Estados de Orden de Compra

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **PENDING** | Naranja | Pendiente de aprobación |
| **APPROVED** | Azul claro | Aprobada |
| **SENT** | Azul | Enviada al proveedor |
| **CONFIRMED** | Azul | Confirmada por proveedor |
| **IN_PROGRESS** | Azul claro | En proceso de entrega |
| **PARTIAL** | Naranja | Entrega parcial |
| **COMPLETED** | Verde | Completada |
| **CANCELLED** | Rojo | Cancelada |

## Tipos de Orden

| Tipo | Ícono | Descripción |
|------|-------|-------------|
| **PURCHASE** | 🛒 | Compra de bienes |
| **SERVICE** | ⚙️ | Contratación de servicios |
| **WORK** | 🏗️ | Contratación de obras |

## Estados de Factura

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente de verificación |
| **VERIFIED** | Azul | Verificada |
| **APPROVED** | Verde | Aprobada para pago |
| **PARTIAL** | Naranja | Pago parcial |
| **PAID** | Verde | Pagada |
| **CANCELLED** | Rojo | Cancelada |

## Estados de Pago

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente |
| **PROCESSING** | Azul | En proceso |
| **COMPLETED** | Verde | Completado |
| **FAILED** | Rojo | Fallido |
| **CANCELLED** | Gris | Cancelado |

## Campos de Orden de Compra

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (OC-XXXXX) |
| `orderType` | Enum | PURCHASE, SERVICE, WORK |
| `supplierId` | UUID | Proveedor |
| `projectId` | UUID | Proyecto asociado (opcional) |
| `orderDate` | Date | Fecha de la orden |
| `deliveryDate` | Date | Fecha de entrega esperada |
| `subtotal` | Decimal | Subtotal |
| `tax` | Decimal | Impuestos |
| `total` | Decimal | Total |
| `currency` | String | Moneda |
| `status` | Enum | Estado de la orden |
| `notes` | Text | Notas adicionales |

## Campos de Factura

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código interno |
| `invoiceNumber` | String | Número de factura del proveedor |
| `supplierId` | UUID | Proveedor |
| `purchaseOrderId` | UUID | Orden de compra asociada |
| `invoiceDate` | Date | Fecha de factura |
| `dueDate` | Date | Fecha de vencimiento |
| `subtotal` | Decimal | Subtotal |
| `tax` | Decimal | Impuestos |
| `total` | Decimal | Total |
| `paidAmount` | Decimal | Monto pagado |
| `status` | Enum | Estado |

## Campos de Pago

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código del pago |
| `invoiceId` | UUID | Factura asociada |
| `amount` | Decimal | Monto del pago |
| `paymentDate` | Date | Fecha del pago |
| `paymentMethod` | String | Método de pago |
| `reference` | String | Referencia bancaria |
| `bankAccountId` | UUID | Cuenta bancaria |
| `status` | Enum | Estado |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                         PROCURA                              │
│  (Órdenes, Facturas, Pagos, Cotizaciones)                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  INVENTARIO   │    │   FINANZAS    │    │  PROYECTOS    │
│ - Entradas    │    │ - Pagos       │    │ - Compras     │
│   de stock    │    │ - Cuentas     │    │   del proyecto│
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Inventario**: Entradas de stock por recepciones
- **Finanzas**: Pagos y cuentas por pagar
- **Proyectos**: Compras asociadas a proyectos
- **Proveedores**: Gestión de proveedores

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/procurement/purchase-orders` | Lista | Lista de órdenes |
| `/procurement/purchase-orders/new` | Formulario | Crear orden |
| `/procurement/purchase-orders/:id` | Detalle | Detalle de orden |
| `/procurement/purchase-orders/:id/edit` | Formulario | Editar orden |
| `/procurement/invoices` | Lista | Lista de facturas |
| `/procurement/invoices/new` | Formulario | Registrar factura |
| `/procurement/invoices/:id` | Detalle | Detalle de factura |
| `/procurement/payments` | Lista | Lista de pagos |
| `/procurement/payments/new` | Formulario | Registrar pago |
| `/procurement/quotes` | Lista | Lista de cotizaciones |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `procurement:read` | Ver órdenes, facturas, pagos |
| `procurement:create` | Crear órdenes y facturas |
| `procurement:update` | Editar órdenes y facturas |
| `procurement:delete` | Eliminar órdenes |
| `procurement:approve` | Aprobar órdenes y facturas |
| `procurement:pay` | Registrar pagos |

## Flujo de Trabajo

### Flujo de Compra
```
1. Crear Orden de Compra (DRAFT)
   ↓
2. Enviar para Aprobación (PENDING)
   ↓
3. Aprobar Orden (APPROVED)
   ↓
4. Enviar a Proveedor (SENT)
   ↓
5. Proveedor Confirma (CONFIRMED)
   ↓
6. Recibir Mercancía (IN_PROGRESS/PARTIAL)
   ↓
7. Completar Orden (COMPLETED)
```

### Flujo de Pago
```
1. Recibir Factura del Proveedor
   ↓
2. Registrar Factura (PENDING)
   ↓
3. Verificar contra OC (VERIFIED)
   ↓
4. Aprobar para Pago (APPROVED)
   ↓
5. Programar Pago
   ↓
6. Ejecutar Pago (PAID)
```

## Ejemplos de Uso

### Caso 1: Crear Orden de Compra
1. Ir a Procura → Órdenes → Nueva
2. Seleccionar tipo (Compra/Servicio/Obra)
3. Seleccionar proveedor
4. Agregar items con cantidades y precios
5. Definir fecha de entrega
6. Guardar como borrador
7. Enviar para aprobación

### Caso 2: Registrar Factura
1. Recibir factura del proveedor
2. Ir a Procura → Facturas → Nueva
3. Seleccionar proveedor
4. Asociar a orden de compra
5. Ingresar número de factura y montos
6. Adjuntar copia de factura
7. Guardar

### Caso 3: Registrar Pago
1. Ir a Procura → Pagos → Nuevo
2. Seleccionar factura a pagar
3. Ingresar monto del pago
4. Seleccionar método y cuenta bancaria
5. Ingresar referencia
6. Guardar

## Screenshots

- `screenshots/ordenes-lista.png` - Lista de órdenes
- `screenshots/orden-detalle.png` - Detalle de orden
- `screenshots/facturas-lista.png` - Lista de facturas
- `screenshots/pagos-lista.png` - Lista de pagos
