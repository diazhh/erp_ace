# 📦 Inventario y Almacén

## ¿Qué es este módulo?

El módulo de **Inventario** permite gestionar todos los artículos, materiales, herramientas y equipos de la empresa. Puede controlar el stock en múltiples almacenes, registrar entradas y salidas, realizar transferencias entre ubicaciones, y recibir alertas cuando el inventario está bajo.

Piense en este módulo como su "bodega digital": sabe exactamente qué tiene, dónde está, cuánto queda, y cuándo necesita reabastecer. Es fundamental para operaciones, proyectos y compras.

## ¿Para quién es útil?

- **Almacenistas**: Para registrar entradas, salidas y controlar el stock físico
- **Gerentes de Proyecto**: Para solicitar materiales y ver disponibilidad
- **Compras/Procura**: Para identificar qué necesita reabastecerse
- **Contabilidad**: Para valorar el inventario y controlar costos

## ¿Qué puedo hacer aquí?

### Gestión de Artículos
- **Crear artículos** con código, descripción, categoría y tipo
- **Definir stock mínimo** para alertas de reabastecimiento
- **Establecer costos unitarios** y precios
- **Clasificar por categoría** y tipo de artículo
- **Ver stock total** y disponible por artículo

### Gestión de Almacenes
- **Crear almacenes** de diferentes tipos (Principal, Secundario, Tránsito, Proyecto)
- **Asignar encargados** a cada almacén
- **Vincular a proyectos** para almacenes de obra
- **Ver inventario** por almacén

### Movimientos de Inventario
- **Registrar entradas**: Compras, devoluciones, ajustes positivos
- **Registrar salidas**: Uso en proyectos, ventas, ajustes negativos
- **Transferencias**: Mover stock entre almacenes
- **Cancelar movimientos**: Revertir operaciones erróneas

### Dashboard y Reportes
- **Ver indicadores**: Total de artículos, valor del inventario, alertas
- **Identificar stock bajo**: Artículos que necesitan reposición
- **Exportar reportes**: Listados en PDF

## Conceptos Importantes

### Tipos de Artículo

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Producto** | Artículo terminado | Producto para venta |
| **Material** | Materia prima | Cemento, arena |
| **Herramienta** | Equipo de trabajo | Taladro, martillo |
| **Equipo** | Maquinaria | Generador, compresor |
| **Consumible** | Uso único | Guantes, mascarillas |
| **Repuesto** | Pieza de reemplazo | Filtro, correa |

### Estados del Artículo

| Estado | Descripción |
|--------|-------------|
| **Activo** | Artículo en uso normal |
| **Inactivo** | Temporalmente sin uso |
| **Descontinuado** | Ya no se usa ni repone |

### Tipos de Almacén

| Tipo | Descripción |
|------|-------------|
| **Principal** | Almacén central de la empresa |
| **Secundario** | Almacén auxiliar |
| **Tránsito** | Para mercancía en movimiento |
| **Proyecto** | Almacén de obra específico |

### Tipos de Movimiento

| Tipo | Descripción | Efecto |
|------|-------------|--------|
| **Entrada** | Ingreso de mercancía | Aumenta stock |
| **Salida** | Egreso de mercancía | Disminuye stock |
| **Transferencia** | Movimiento entre almacenes | Cambia ubicación |
| **Ajuste (+)** | Corrección positiva | Aumenta stock |
| **Ajuste (-)** | Corrección negativa | Disminuye stock |
| **Devolución** | Retorno de mercancía | Aumenta stock |
| **Reserva** | Apartado para uso futuro | Reduce disponible |
| **Liberación** | Libera reserva | Aumenta disponible |

### Razones de Movimiento

| Razón | Uso típico |
|-------|------------|
| **Compra** | Entrada por compra a proveedor |
| **Uso en Proyecto** | Salida para obra |
| **Venta** | Salida por venta |
| **Daño** | Ajuste por artículo dañado |
| **Pérdida** | Ajuste por extravío |
| **Ajuste por Conteo** | Corrección tras inventario físico |
| **Devolución a Proveedor** | Retorno de mercancía defectuosa |

### Stock Total vs Disponible

| Concepto | Descripción |
|----------|-------------|
| **Stock Total** | Cantidad física en almacén |
| **Stock Disponible** | Total menos reservas |
| **Stock Mínimo** | Nivel para alerta de reposición |

### Alertas de Stock

El sistema muestra alertas visuales cuando:
- 🔴 **Sin stock**: Cantidad = 0
- 🟡 **Stock bajo**: Cantidad ≤ Stock mínimo

## Relación con Otros Módulos

El módulo de Inventario se conecta con:

- **Proyectos**: Los almacenes de proyecto se vinculan a proyectos específicos. Las salidas de material se asocian a proyectos.

- **Procura**: Las órdenes de compra generan entradas de inventario al recibir mercancía.

- **Finanzas**: Los movimientos de inventario pueden generar transacciones financieras.

- **Activos**: Los equipos y herramientas pueden registrarse también como activos fijos.

- **Flota**: Los repuestos y consumibles de vehículos se gestionan en inventario.
