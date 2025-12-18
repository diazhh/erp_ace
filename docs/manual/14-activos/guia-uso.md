# 🏢 Módulo de Activos Fijos - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Activos Fijos"**
2. Se despliegan las opciones:
   - Lista de Activos
   - Categorías

---

## Lista de Activos

**Ruta:** `/assets`

### KPIs en la Parte Superior

| KPI | Descripción |
|-----|-------------|
| **Total Activos** | Cantidad de activos |
| **Valor Total** | Suma del valor actual |
| **En Mantenimiento** | Activos en reparación |
| **Depreciación Mensual** | Depreciación del mes |

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Estado** | Activo, En Mantenimiento, Almacenado, etc. |
| **Categoría** | Todas las categorías |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del activo |
| **Categoría** | Categoría asignada |
| **Valor Actual** | Valor después de depreciación |
| **Estado** | Estado actual |
| **Condición** | Estado físico |
| **Asignado a** | Empleado responsable |
| **Acciones** | Ver, Editar |

---

## Crear Activo

**Ruta:** `/assets/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único |
| **Nombre** | ✅ | Nombre del activo |
| **Descripción** | ❌ | Descripción detallada |
| **Categoría** | ✅ | Categoría del activo |
| **Número de Serie** | ❌ | Serial del fabricante |
| **Marca** | ❌ | Marca del activo |
| **Modelo** | ❌ | Modelo |
| **Fecha de Compra** | ✅ | Cuándo se adquirió |
| **Precio de Compra** | ✅ | Costo de adquisición |
| **Vida Útil (meses)** | ✅ | Duración estimada |
| **Método Depreciación** | ✅ | Línea recta, Saldos decrecientes |
| **Ubicación** | ❌ | Dónde está el activo |
| **Estado** | ❌ | Activo (default) |
| **Condición** | ❌ | Estado físico |

### Pasos
1. Hacer clic en **"+ Nuevo Activo"**
2. Ingresar código único
3. Completar nombre y descripción
4. Seleccionar categoría
5. Ingresar datos de compra
6. Definir vida útil y método de depreciación
7. Hacer clic en **"Guardar"**

---

## Detalle del Activo

**Ruta:** `/assets/:id`

### Información del Activo
- Código y nombre
- Categoría
- Marca, modelo, serial
- Fecha de compra
- Valor de compra vs valor actual
- Depreciación acumulada
- Estado y condición
- Ubicación
- Asignado a

### Tabs Disponibles

#### Tab: Información
Datos generales del activo.

#### Tab: Depreciación
- Valor original
- Depreciación acumulada
- Valor en libros
- Historial de depreciación mensual

#### Tab: Asignaciones
Historial de asignaciones:
- Empleado
- Fecha inicio - fin
- Notas

#### Tab: Mantenimientos
Historial de mantenimientos:
- Fecha
- Tipo
- Descripción
- Costo
- Estado

#### Tab: Documentos
Archivos adjuntos (facturas, garantías, etc.)

#### Tab: Auditoría
Historial de cambios.

### Acciones Disponibles

| Acción | Descripción |
|--------|-------------|
| **Editar** | Modificar datos |
| **Asignar** | Asignar a empleado |
| **Transferir** | Cambiar responsable |
| **Mantenimiento** | Registrar mantenimiento |
| **Dar de Baja** | Retirar del inventario |

---

## Asignar Activo

1. Ir al detalle del activo
2. Clic en **"Asignar"**
3. Seleccionar empleado
4. Ingresar fecha de asignación
5. Agregar notas (opcional)
6. Guardar

### Transferir Activo
1. Ir al detalle del activo asignado
2. Clic en **"Transferir"**
3. Seleccionar nuevo responsable
4. Documentar motivo
5. Guardar

---

## Depreciación

### Cálculo Automático
El sistema calcula la depreciación mensualmente según el método configurado.

### Método Línea Recta
```
Depreciación Mensual = (Valor Compra - Valor Residual) / Vida Útil
```

### Método Saldos Decrecientes
```
Depreciación Mensual = Valor en Libros × Tasa de Depreciación
```

### Ver Depreciación
1. Ir al detalle del activo
2. Tab "Depreciación"
3. Ver historial y proyección

---

## Mantenimientos

### Registrar Mantenimiento
1. Ir al detalle del activo
2. Clic en **"Registrar Mantenimiento"**
3. Seleccionar tipo (Preventivo/Correctivo)
4. Ingresar descripción
5. Registrar costo
6. Guardar

### Estados de Mantenimiento
- **Programado**: Pendiente de realizar
- **En Proceso**: En ejecución
- **Completado**: Finalizado

---

## Dar de Baja

### Motivos de Baja
- **DISPOSED**: Dado de baja por obsolescencia
- **SOLD**: Vendido
- **LOST**: Perdido
- **DAMAGED**: Dañado irreparablemente

### Proceso
1. Ir al detalle del activo
2. Clic en **"Dar de Baja"**
3. Seleccionar motivo
4. Documentar la baja
5. Confirmar
6. El activo cambia a estado correspondiente

---

## Categorías

### Lista de Categorías

**Ruta:** `/assets/categories`

Muestra las categorías de activos:
- Equipos de Cómputo
- Mobiliario
- Vehículos
- Maquinaria
- Herramientas

### Crear Categoría
1. Clic en **"Nueva Categoría"**
2. Ingresar código y nombre
3. Definir vida útil por defecto
4. Definir método de depreciación por defecto
5. Guardar

---

## Tips y Mejores Prácticas

### Para Activos
- ✅ Usar códigos consistentes
- ✅ Registrar número de serie
- ✅ Adjuntar factura de compra
- ✅ Mantener ubicación actualizada

### Para Depreciación
- ✅ Definir vida útil realista
- ✅ Revisar valores periódicamente
- ✅ Ajustar si cambia la vida útil

### Para Asignaciones
- ✅ Documentar cada asignación
- ✅ Actualizar al cambiar responsable
- ✅ Verificar estado al transferir

---

## Solución de Problemas

### "El valor no se deprecia"
- Verificar método de depreciación
- Verificar vida útil configurada
- Verificar que el activo esté activo

### "No puedo dar de baja"
- Verificar permisos de usuario
- Verificar que no tenga asignación activa
- Documentar motivo de baja

### "Activo no aparece en lista"
- Verificar filtros aplicados
- Verificar estado del activo
- Buscar por código exacto
