# 📦 Módulo de Inventario - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Inventario"**
2. Se despliegan las opciones:
   - Dashboard
   - Items
   - Almacenes
   - Movimientos
   - Categorías

---

## Dashboard de Inventario

**Ruta:** `/inventory`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Total Items** | Cantidad de items activos |
| **Valor del Inventario** | Suma del valor de todo el stock |
| **Items con Stock Bajo** | Items bajo el mínimo |
| **Movimientos del Mes** | Cantidad de movimientos |

### Gráficos
- **Stock por Categoría**: Distribución del inventario
- **Movimientos Recientes**: Entradas vs salidas
- **Items Críticos**: Lista de items con stock bajo

---

## Items de Inventario

### Lista de Items

**Ruta:** `/inventory/items`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Categoría** | Todas las categorías |
| **Tipo** | Producto, Material, Herramienta, etc. |
| **Estado** | Activo, Inactivo, Descontinuado |
| **Stock Bajo** | Solo items bajo mínimo |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | SKU del item |
| **Nombre** | Nombre del item |
| **Categoría** | Categoría asignada |
| **Tipo** | Tipo de item |
| **Stock** | Cantidad actual |
| **Mínimo** | Stock mínimo |
| **Costo** | Precio de costo |
| **Estado** | Activo/Inactivo |
| **Acciones** | Ver, Editar, Eliminar |

#### Indicadores de Stock

| Indicador | Significado |
|-----------|-------------|
| 🔴 Rojo | Stock bajo el mínimo |
| 🟡 Naranja | Stock cerca del mínimo |
| 🟢 Verde | Stock saludable |

---

### Crear Item

**Ruta:** `/inventory/items/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | SKU único del item |
| **Nombre** | ✅ | Nombre descriptivo |
| **Descripción** | ❌ | Descripción detallada |
| **Categoría** | ❌ | Categoría del item |
| **Tipo** | ✅ | Producto, Material, etc. |
| **Unidad** | ✅ | Unidad de medida (UN, KG, LT, etc.) |
| **Stock Mínimo** | ❌ | Cantidad para alerta |
| **Stock Máximo** | ❌ | Cantidad máxima |
| **Precio de Costo** | ❌ | Costo unitario |
| **Precio de Venta** | ❌ | Precio de venta |
| **Moneda** | ❌ | USD, VES |
| **Estado** | ❌ | Activo (default) |

#### Pasos
1. Hacer clic en **"+ Nuevo Item"**
2. Ingresar código único (SKU)
3. Completar nombre y descripción
4. Seleccionar categoría y tipo
5. Definir unidad de medida
6. Establecer stock mínimo/máximo
7. Ingresar precios
8. Hacer clic en **"Guardar"**

---

### Detalle del Item

**Ruta:** `/inventory/items/:id`

#### Información del Item
- Código y nombre
- Descripción
- Categoría y tipo
- Unidad de medida
- Precios (costo y venta)
- Estado

#### Stock por Almacén
Tabla con stock en cada almacén:
- Almacén
- Cantidad disponible
- Cantidad reservada
- Total

#### Historial de Movimientos
Lista de movimientos del item:
- Fecha
- Tipo de movimiento
- Almacén
- Cantidad
- Referencia

#### Tabs Disponibles
- **Información**: Datos generales
- **Stock**: Stock por almacén
- **Movimientos**: Historial
- **Documentos**: Archivos adjuntos

---

## Almacenes

### Lista de Almacenes

**Ruta:** `/inventory/warehouses`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Tipo** | Principal, Secundario, Tránsito, Proyecto |
| **Estado** | Activo, Inactivo, Cerrado |

#### Información Mostrada
- Código y nombre
- Tipo de almacén
- Ubicación
- Responsable
- Cantidad de items
- Valor del stock
- Estado

---

### Crear Almacén

**Ruta:** `/inventory/warehouses/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único |
| **Nombre** | ✅ | Nombre del almacén |
| **Tipo** | ✅ | Principal, Secundario, etc. |
| **Dirección** | ❌ | Ubicación física |
| **Responsable** | ❌ | Empleado encargado |
| **Estado** | ❌ | Activo (default) |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nuevo Almacén"**
2. Ingresar código y nombre
3. Seleccionar tipo de almacén
4. Ingresar dirección
5. Asignar responsable
6. Hacer clic en **"Guardar"**

---

### Detalle del Almacén

**Ruta:** `/inventory/warehouses/:id`

#### Información del Almacén
- Código y nombre
- Tipo
- Dirección
- Responsable
- Estado

#### Stock del Almacén
Lista de items con stock en este almacén:
- Item (código y nombre)
- Cantidad
- Valor

#### Movimientos del Almacén
Historial de entradas y salidas.

---

## Movimientos de Inventario

### Lista de Movimientos

**Ruta:** `/inventory/movements`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Compra, Venta, Transferencia, Ajuste, etc. |
| **Almacén** | Todos los almacenes |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador del movimiento |
| **Fecha** | Fecha del movimiento |
| **Tipo** | Tipo de movimiento |
| **Item** | Item afectado |
| **Almacén** | Almacén origen/destino |
| **Cantidad** | Cantidad movida |
| **Referencia** | OC, factura, etc. |
| **Usuario** | Quien registró |

---

### Crear Movimiento

**Ruta:** `/inventory/movements/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Tipo de movimiento |
| **Almacén** | ✅ | Almacén origen |
| **Almacén Destino** | ✅* | Solo para transferencias |
| **Item** | ✅ | Item a mover |
| **Cantidad** | ✅ | Cantidad a mover |
| **Costo Unitario** | ❌ | Costo del item |
| **Referencia** | ❌ | Número de documento |
| **Fecha** | ✅ | Fecha del movimiento |
| **Notas** | ❌ | Observaciones |

#### Tipos de Movimiento

##### Compra (Entrada)
1. Seleccionar tipo "Compra"
2. Seleccionar almacén destino
3. Seleccionar item
4. Ingresar cantidad recibida
5. Ingresar costo unitario
6. Agregar referencia de OC
7. Guardar

##### Consumo (Salida)
1. Seleccionar tipo "Consumo"
2. Seleccionar almacén origen
3. Seleccionar item
4. Ingresar cantidad consumida
5. Agregar referencia (proyecto, etc.)
6. Guardar

##### Transferencia
1. Seleccionar tipo "Transferencia"
2. Seleccionar almacén origen
3. Seleccionar almacén destino
4. Seleccionar item
5. Ingresar cantidad
6. Guardar
7. Se generan dos movimientos: salida y entrada

##### Ajuste
1. Seleccionar tipo "Ajuste Positivo" o "Ajuste Negativo"
2. Seleccionar almacén
3. Seleccionar item
4. Ingresar cantidad de diferencia
5. Documentar motivo en notas
6. Guardar

---

## Categorías

### Gestión de Categorías

Las categorías permiten organizar los items del inventario.

#### Crear Categoría
1. Ir a Inventario → Categorías
2. Clic en "Nueva Categoría"
3. Ingresar código y nombre
4. Seleccionar categoría padre (si es subcategoría)
5. Guardar

#### Estructura Jerárquica
Las categorías pueden tener subcategorías:
```
Materiales
├── Materiales de Construcción
├── Materiales Eléctricos
└── Materiales de Plomería
Herramientas
├── Herramientas Manuales
└── Herramientas Eléctricas
```

---

## Tips y Mejores Prácticas

### Para Items
- ✅ Usar códigos SKU consistentes
- ✅ Definir stock mínimo realista
- ✅ Mantener precios actualizados
- ✅ Categorizar correctamente

### Para Almacenes
- ✅ Asignar responsable a cada almacén
- ✅ Documentar ubicación exacta
- ✅ Realizar conteos periódicos

### Para Movimientos
- ✅ Registrar movimientos inmediatamente
- ✅ Siempre incluir referencia
- ✅ Documentar ajustes con detalle
- ✅ Verificar stock antes de salidas

### Para Control
- ✅ Revisar alertas de stock bajo diariamente
- ✅ Realizar inventario físico mensual
- ✅ Investigar diferencias inmediatamente
- ✅ Mantener documentación de ajustes

---

## Solución de Problemas

### "Stock negativo"
- El sistema permite stock negativo para no bloquear operaciones
- Investigar movimientos recientes
- Verificar si hay entradas pendientes de registrar
- Realizar ajuste si es necesario

### "No puedo eliminar el item"
- El item tiene movimientos registrados
- Cambiar estado a "Descontinuado" en lugar de eliminar

### "Diferencia en inventario físico"
1. Verificar movimientos no registrados
2. Buscar errores en cantidades
3. Verificar transferencias pendientes
4. Registrar ajuste documentando el motivo

### "No aparece el item en el almacén"
- Verificar que el item tenga stock en ese almacén
- Verificar filtros aplicados
- Verificar estado del item (debe ser Activo)
