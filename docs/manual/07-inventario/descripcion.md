# 📦 Módulo de Inventario - Descripción

## ¿Qué hace este módulo?

El módulo de **Inventario** gestiona el control de stock de la empresa, incluyendo almacenes, items, categorías y movimientos de inventario. Permite llevar un registro preciso de entradas, salidas y transferencias de materiales.

## Funcionalidades Principales

### 1. Gestión de Almacenes
- **Crear** almacenes de diferentes tipos
- **Asignar** responsable del almacén
- **Definir** ubicación física
- **Ver** stock por almacén

### 2. Gestión de Items
- **Crear** items con código y descripción
- **Categorizar** por tipo y categoría
- **Definir** stock mínimo y máximo
- **Establecer** precios de costo y venta
- **Alertas** de stock bajo

### 3. Movimientos de Inventario
- **Entradas**: Compras, devoluciones, ajustes positivos
- **Salidas**: Consumos, ventas, ajustes negativos
- **Transferencias**: Entre almacenes
- **Historial** completo de movimientos

### 4. Dashboard de Inventario
- **KPIs**: Total items, valor del inventario, stock bajo
- **Gráficos**: Distribución por categoría, movimientos recientes
- **Alertas**: Items que necesitan reposición

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Warehouse` | Almacenes físicos |
| `InventoryItem` | Items/productos del inventario |
| `InventoryCategory` | Categorías de items |
| `InventoryMovement` | Movimientos de stock |
| `InventoryStock` | Stock por almacén |

## Tipos de Almacén

| Tipo | Color | Descripción |
|------|-------|-------------|
| **MAIN** | Azul | Almacén principal |
| **SECONDARY** | Celeste | Almacén secundario |
| **TRANSIT** | Naranja | Almacén de tránsito |
| **PROJECT** | Morado | Almacén de proyecto |

## Tipos de Item

| Tipo | Descripción |
|------|-------------|
| **PRODUCT** | Producto terminado |
| **MATERIAL** | Materia prima |
| **TOOL** | Herramienta |
| **EQUIPMENT** | Equipo |
| **CONSUMABLE** | Consumible |
| **SPARE_PART** | Repuesto |

## Estados de Item

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | Item activo |
| **INACTIVE** | Gris | Item inactivo |
| **DISCONTINUED** | Rojo | Item descontinuado |

## Estados de Almacén

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | Almacén operativo |
| **INACTIVE** | Gris | Almacén inactivo |
| **CLOSED** | Rojo | Almacén cerrado |

## Tipos de Movimiento

| Tipo | Efecto | Descripción |
|------|--------|-------------|
| **PURCHASE** | +Stock | Compra de items |
| **SALE** | -Stock | Venta de items |
| **TRANSFER_IN** | +Stock | Entrada por transferencia |
| **TRANSFER_OUT** | -Stock | Salida por transferencia |
| **ADJUSTMENT_IN** | +Stock | Ajuste positivo |
| **ADJUSTMENT_OUT** | -Stock | Ajuste negativo |
| **CONSUMPTION** | -Stock | Consumo interno |
| **RETURN** | +Stock | Devolución |

## Campos de Almacén

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre del almacén |
| `warehouseType` | Enum | MAIN, SECONDARY, TRANSIT, PROJECT |
| `address` | String | Dirección física |
| `managerId` | UUID | Responsable del almacén |
| `status` | Enum | ACTIVE, INACTIVE, CLOSED |

## Campos de Item

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (SKU) |
| `name` | String | Nombre del item |
| `description` | Text | Descripción detallada |
| `categoryId` | UUID | Categoría |
| `itemType` | Enum | Tipo de item |
| `unit` | String | Unidad de medida |
| `minStock` | Integer | Stock mínimo (alerta) |
| `maxStock` | Integer | Stock máximo |
| `costPrice` | Decimal | Precio de costo |
| `salePrice` | Decimal | Precio de venta |
| `currency` | String | Moneda |
| `status` | Enum | ACTIVE, INACTIVE, DISCONTINUED |

## Campos de Movimiento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `movementType` | Enum | Tipo de movimiento |
| `itemId` | UUID | Item afectado |
| `warehouseId` | UUID | Almacén origen |
| `toWarehouseId` | UUID | Almacén destino (transferencias) |
| `quantity` | Integer | Cantidad |
| `unitCost` | Decimal | Costo unitario |
| `reference` | String | Referencia (OC, factura, etc.) |
| `notes` | Text | Notas adicionales |
| `movementDate` | Date | Fecha del movimiento |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                       INVENTARIO                             │
│  (Almacenes, Items, Movimientos, Stock)                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   PROCURA     │    │  PROYECTOS    │    │    FLOTA      │
│ - Compras     │    │ - Materiales  │    │ - Repuestos   │
│ - Recepciones │    │   de proyecto │    │ - Consumibles │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Procura**: Órdenes de compra generan entradas
- **Proyectos**: Consumo de materiales por proyecto
- **Flota**: Repuestos y consumibles para vehículos
- **Finanzas**: Valorización del inventario

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/inventory` | Dashboard | Dashboard de inventario |
| `/inventory/items` | Lista | Lista de items |
| `/inventory/items/new` | Formulario | Crear item |
| `/inventory/items/:id` | Detalle | Detalle del item |
| `/inventory/items/:id/edit` | Formulario | Editar item |
| `/inventory/warehouses` | Lista | Lista de almacenes |
| `/inventory/warehouses/new` | Formulario | Crear almacén |
| `/inventory/warehouses/:id` | Detalle | Detalle del almacén |
| `/inventory/movements` | Lista | Lista de movimientos |
| `/inventory/movements/new` | Formulario | Crear movimiento |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `inventory:read` | Ver items, almacenes, movimientos |
| `inventory:create` | Crear items, almacenes, movimientos |
| `inventory:update` | Editar items y almacenes |
| `inventory:delete` | Eliminar items y almacenes |
| `inventory:adjust` | Realizar ajustes de inventario |

## Ejemplos de Uso

### Caso 1: Registrar Compra
1. Recibir mercancía del proveedor
2. Ir a Inventario → Movimientos → Nuevo
3. Seleccionar tipo "Compra"
4. Seleccionar almacén destino
5. Agregar items y cantidades
6. Ingresar referencia de OC
7. Guardar

### Caso 2: Transferir entre Almacenes
1. Ir a Inventario → Movimientos → Nuevo
2. Seleccionar tipo "Transferencia"
3. Seleccionar almacén origen y destino
4. Agregar items y cantidades
5. Guardar
6. Se genera salida en origen y entrada en destino

### Caso 3: Ajuste de Inventario
1. Realizar conteo físico
2. Comparar con stock del sistema
3. Ir a Inventario → Movimientos → Nuevo
4. Seleccionar tipo "Ajuste"
5. Registrar diferencias (+ o -)
6. Documentar motivo del ajuste

## Screenshots

- `screenshots/dashboard.png` - Dashboard de inventario
- `screenshots/items-lista.png` - Lista de items
- `screenshots/item-detalle.png` - Detalle de item
- `screenshots/almacenes-lista.png` - Lista de almacenes
- `screenshots/movimientos.png` - Lista de movimientos
