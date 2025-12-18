# 🛒 Compras y Procura

## ¿Qué es este módulo?

El módulo de **Procura** (también llamado Compras) permite gestionar todo el proceso de adquisición de bienes y servicios: desde la creación de órdenes de compra hasta el pago a proveedores. Incluye la gestión de contratistas, cotizaciones, órdenes de compra, facturas y pagos.

Piense en este módulo como su "departamento de compras digital": controla qué se compra, a quién, por cuánto, y el estado de cada transacción con proveedores.

## ¿Para quién es útil?

- **Personal de Compras**: Para crear y gestionar órdenes de compra
- **Gerentes de Proyecto**: Para solicitar materiales y servicios
- **Finanzas**: Para aprobar facturas y programar pagos
- **Administración**: Para gestionar proveedores y contratistas

## ¿Qué puedo hacer aquí?

### Órdenes de Compra
- **Crear órdenes** de compra, servicio u obra
- **Asociar a proyectos** para control de costos
- **Dar seguimiento** al progreso de entrega
- **Aprobar y enviar** a proveedores

### Facturas de Proveedores
- **Registrar facturas** recibidas
- **Aprobar facturas** para pago
- **Controlar vencimientos** y pagos pendientes
- **Asociar a órdenes** de compra

### Pagos a Proveedores
- **Registrar pagos** realizados
- **Pagos parciales** o totales
- **Historial de pagos** por proveedor

### Cotizaciones
- **Solicitar cotizaciones** a proveedores
- **Comparar precios** y condiciones
- **Convertir a orden** de compra

## Conceptos Importantes

### Tipos de Orden

| Tipo | Descripción | Ícono |
|------|-------------|-------|
| **Compra** | Adquisición de bienes | 🛒 |
| **Servicio** | Contratación de servicios | ⚙️ |
| **Obra** | Trabajos de construcción | 🏗️ |

### Estados de la Orden de Compra

| Estado | Descripción |
|--------|-------------|
| **Borrador** | En elaboración, no enviada |
| **Pendiente** | Esperando aprobación |
| **Aprobada** | Lista para enviar |
| **Enviada** | Enviada al proveedor |
| **Confirmada** | Proveedor confirmó recepción |
| **En Progreso** | En proceso de entrega |
| **Parcial** | Entrega parcial recibida |
| **Completada** | Totalmente recibida |
| **Cancelada** | Orden anulada |

### Estados de la Factura

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Recibida, sin aprobar |
| **Aprobada** | Lista para pago |
| **Pago Parcial** | Pagada parcialmente |
| **Pagada** | Totalmente pagada |
| **Rechazada** | No aprobada |
| **Cancelada** | Anulada |

### Progreso de la Orden

Las órdenes de compra muestran un porcentaje de progreso que indica:
- **0%**: Sin entregas
- **1-99%**: Entregas parciales
- **100%**: Completamente entregada

### Contratistas/Proveedores

Son las empresas o personas a quienes se compra. Cada contratista tiene:
- Datos de la empresa
- Contactos
- Historial de órdenes
- Historial de pagos

## Relación con Otros Módulos

El módulo de Procura se conecta con:

- **Proyectos**: Las órdenes de compra pueden asociarse a proyectos para control de presupuesto.

- **Inventario**: Al recibir mercancía, se generan entradas de inventario.

- **Finanzas**: Los pagos a proveedores se registran como transacciones financieras.

- **Documentos**: Las facturas y órdenes se adjuntan como documentos.
