# 🚗 Módulo de Flota - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Flota"**
2. Se despliegan las opciones:
   - Dashboard
   - Vehículos
   - Combustible
   - Mantenimientos

---

## Dashboard de Flota

**Ruta:** `/fleet`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Total Vehículos** | Cantidad total de vehículos |
| **Disponibles** | Vehículos sin asignar |
| **Mant. Pendientes** | Mantenimientos programados |
| **Doc. por Vencer** | Documentos próximos a vencer |

### Alertas
- Vehículos con documentos por vencer
- Mantenimientos pendientes
- Vehículos con alto kilometraje

---

## Vehículos

### Lista de Vehículos

**Ruta:** `/fleet/vehicles`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por placa, marca o modelo |
| **Estado** | Disponible, Asignado, En Mantenimiento, etc. |
| **Tipo** | Sedan, Camioneta, Camión, etc. |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Placa** | Placa del vehículo |
| **Marca/Modelo** | Marca y modelo |
| **Año** | Año de fabricación |
| **Tipo** | Tipo de vehículo |
| **Kilometraje** | Km actuales |
| **Estado** | Estado actual |
| **Asignado a** | Empleado/Proyecto |
| **Acciones** | Ver, Editar |

#### Vista Mobile
Tarjetas con información resumida del vehículo.

---

### Crear Vehículo

**Ruta:** `/fleet/vehicles/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código interno |
| **Placa** | ✅ | Placa del vehículo |
| **Marca** | ✅ | Marca del vehículo |
| **Modelo** | ✅ | Modelo |
| **Año** | ✅ | Año de fabricación |
| **Color** | ❌ | Color del vehículo |
| **Tipo** | ✅ | Sedan, Camioneta, etc. |
| **Combustible** | ✅ | Gasolina, Diesel, etc. |
| **VIN** | ❌ | Número de serie |
| **Kilometraje** | ❌ | Km inicial |
| **Fecha Compra** | ❌ | Fecha de adquisición |
| **Precio Compra** | ❌ | Costo de adquisición |
| **Estado** | ❌ | Disponible (default) |

#### Pasos
1. Hacer clic en **"+ Nuevo Vehículo"**
2. Ingresar placa y código
3. Completar marca, modelo y año
4. Seleccionar tipo y combustible
5. Ingresar kilometraje inicial
6. Hacer clic en **"Guardar"**

---

### Detalle del Vehículo

**Ruta:** `/fleet/vehicles/:id`

#### Encabezado
- Placa y código
- Marca/Modelo/Año
- Estado (chip de color)
- Kilometraje actual
- Asignación actual (si tiene)
- Botones: Editar, Asignar/Finalizar

#### Tabs Disponibles

##### Tab: Información
Datos generales del vehículo:
- Marca, modelo, año
- Color, tipo, combustible
- VIN
- Fecha y precio de compra
- Kilometraje

##### Tab: Asignaciones
Historial de asignaciones:
- Tipo (Empleado/Proyecto)
- Asignado a
- Fecha inicio - fin
- Km inicio - fin
- Propósito

**Asignar Vehículo:**
1. Clic en "Asignar"
2. Seleccionar tipo (Empleado o Proyecto)
3. Seleccionar empleado/proyecto
4. Ingresar propósito
5. Guardar

**Finalizar Asignación:**
1. Clic en "Finalizar Asignación"
2. Ingresar fecha de fin
3. Ingresar kilometraje final
4. Agregar notas
5. Guardar

##### Tab: Combustible
Registros de carga de combustible:
- Fecha
- Litros
- Precio/litro
- Total
- Kilometraje
- Estación

##### Tab: Mantenimientos
Historial de mantenimientos:
- Fecha
- Tipo (Preventivo/Correctivo)
- Descripción
- Costo
- Estado

##### Tab: Documentos
Documentos del vehículo:
- Seguro
- Revisión técnica
- Permisos
- Otros documentos

##### Tab: Auditoría
Historial de cambios.

---

## Combustible

### Lista de Registros

**Ruta:** `/fleet/fuel`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Vehículo** | Todos los vehículos |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Fecha** | Fecha de carga |
| **Vehículo** | Placa del vehículo |
| **Litros** | Cantidad cargada |
| **Precio/L** | Precio por litro |
| **Total** | Costo total |
| **Km** | Kilometraje al cargar |
| **Estación** | Estación de servicio |

---

### Registrar Carga de Combustible

**Ruta:** `/fleet/fuel/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Vehículo** | ✅ | Seleccionar vehículo |
| **Fecha** | ✅ | Fecha de la carga |
| **Tipo Combustible** | ✅ | Gasolina, Diesel, etc. |
| **Litros** | ✅ | Cantidad en litros |
| **Precio por Litro** | ✅ | Precio unitario |
| **Kilometraje** | ✅ | Km al momento de cargar |
| **Estación** | ❌ | Nombre de la estación |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nueva Carga"**
2. Seleccionar vehículo
3. Ingresar fecha y tipo de combustible
4. Ingresar litros y precio
5. Registrar kilometraje actual
6. Hacer clic en **"Guardar"**

---

## Mantenimientos

### Lista de Mantenimientos

**Ruta:** `/fleet/maintenance`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Vehículo** | Todos los vehículos |
| **Tipo** | Preventivo, Correctivo, Inspección |
| **Estado** | Programado, En Proceso, Completado |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Fecha** | Fecha programada/realizada |
| **Vehículo** | Placa del vehículo |
| **Tipo** | Preventivo/Correctivo |
| **Descripción** | Trabajo realizado |
| **Costo** | Costo del mantenimiento |
| **Estado** | Estado actual |
| **Acciones** | Ver, Completar |

---

### Crear Mantenimiento

**Ruta:** `/fleet/maintenance/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Vehículo** | ✅ | Seleccionar vehículo |
| **Tipo** | ✅ | Preventivo, Correctivo, Inspección |
| **Fecha Programada** | ✅ | Fecha del mantenimiento |
| **Descripción** | ✅ | Trabajo a realizar |
| **Kilometraje** | ❌ | Km al momento |
| **Proveedor** | ❌ | Taller/Proveedor |
| **Costo Estimado** | ❌ | Costo aproximado |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nuevo Mantenimiento"**
2. Seleccionar vehículo
3. Seleccionar tipo de mantenimiento
4. Definir fecha programada
5. Describir el trabajo
6. Hacer clic en **"Guardar"**

### Completar Mantenimiento
1. Ir al detalle del mantenimiento
2. Clic en "Completar"
3. Ingresar fecha real de completación
4. Ingresar costo real
5. Agregar notas del trabajo realizado
6. Guardar

---

## Flujo de Trabajo

### Ciclo de Vida del Vehículo
```
DISPONIBLE → ASIGNADO → DISPONIBLE
     ↓           ↓
EN MANTENIMIENTO ←
     ↓
FUERA DE SERVICIO
     ↓
VENDIDO
```

### Flujo de Asignación
```
1. Vehículo disponible
   ↓
2. Asignar a empleado/proyecto
   ↓
3. Registrar propósito y km inicial
   ↓
4. Vehículo en uso
   ↓
5. Finalizar asignación
   ↓
6. Registrar km final
   ↓
7. Vehículo disponible
```

---

## Tips y Mejores Prácticas

### Para Vehículos
- ✅ Mantener kilometraje actualizado
- ✅ Registrar todos los documentos
- ✅ Programar mantenimientos preventivos
- ✅ Verificar documentos antes de vencer

### Para Asignaciones
- ✅ Registrar propósito de cada asignación
- ✅ Verificar kilometraje al asignar y devolver
- ✅ Documentar cualquier incidente

### Para Combustible
- ✅ Registrar cada carga de combustible
- ✅ Verificar rendimiento (km/litro)
- ✅ Investigar consumos anormales

### Para Mantenimientos
- ✅ Programar mantenimientos preventivos
- ✅ No posponer mantenimientos
- ✅ Documentar trabajos realizados
- ✅ Guardar facturas y garantías

---

## Solución de Problemas

### "No puedo asignar el vehículo"
- Verificar que el vehículo esté en estado DISPONIBLE
- Verificar que no tenga asignación activa
- Verificar permisos de usuario

### "El kilometraje no se actualiza"
- El kilometraje se actualiza al:
  - Registrar carga de combustible
  - Finalizar asignación
  - Completar mantenimiento
- Verificar que se ingresó correctamente

### "Documentos por vencer"
- Revisar alertas en el dashboard
- Renovar documentos antes del vencimiento
- Actualizar fechas en el sistema

### "Consumo de combustible alto"
- Verificar registros de combustible
- Comparar con histórico del vehículo
- Revisar si necesita mantenimiento
- Verificar estilo de conducción
