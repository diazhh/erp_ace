# 🛢️ Módulo de Producción y Pozos - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Producción"**
2. Se despliegan las opciones:
   - Dashboard
   - Campos
   - Pozos
   - Producción Diaria
   - Asignaciones

---

## Dashboard de Producción

**Ruta:** `/production`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Producción de Petróleo** | BBL/día total |
| **Producción de Gas** | MCF/día total |
| **Producción de Agua** | BBL/día total |
| **Pozos Activos** | Cantidad produciendo |

### Filtro por Campo
Selector para ver producción de un campo específico.

### Gráficos
- **Tendencia de Producción**: Últimos 30 días
- **Distribución por Campo**: Pie chart
- **Corte de Agua**: Evolución del BSW

---

## Campos Petroleros

### Lista de Campos

**Ruta:** `/production/fields`

#### Información Mostrada
- Nombre del campo
- Ubicación
- Cantidad de pozos
- Producción total
- Estado

### Crear Campo

**Ruta:** `/production/fields/new`

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único |
| **Nombre** | ✅ | Nombre del campo |
| **Ubicación** | ❌ | Ubicación geográfica |
| **Operador** | ❌ | Empresa operadora |
| **Estado** | ❌ | Activo (default) |

### Detalle del Campo

**Ruta:** `/production/fields/:id`

- Información general
- Lista de pozos del campo
- Producción acumulada
- Gráficos de tendencia

---

## Pozos

### Lista de Pozos

**Ruta:** `/production/wells`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Campo** | Todos los campos |
| **Estado** | Activo, Inactivo, Cerrado |
| **Tipo** | Productor, Inyector, Observación |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador del pozo |
| **Nombre** | Nombre del pozo |
| **Campo** | Campo asociado |
| **Tipo** | Productor/Inyector |
| **Estado** | Estado actual |
| **Última Producción** | Fecha del último registro |
| **Acciones** | Ver, Editar |

---

### Crear Pozo

**Ruta:** `/production/wells/new`

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ | Código único |
| **Nombre** | ✅ | Nombre del pozo |
| **Campo** | ✅ | Campo asociado |
| **Tipo** | ✅ | Productor, Inyector, etc. |
| **Coordenadas** | ❌ | Ubicación GPS |
| **Profundidad** | ❌ | Profundidad total |
| **Fecha Completación** | ❌ | Cuándo se completó |
| **Estado** | ❌ | Activo (default) |

---

### Detalle del Pozo

**Ruta:** `/production/wells/:id`

#### Información
- Código y nombre
- Campo asociado
- Tipo y estado
- Datos técnicos

#### Tabs Disponibles

##### Tab: Información
Datos generales del pozo.

##### Tab: Producción
Historial de producción diaria:
- Fecha
- Petróleo (BBL)
- Gas (MCF)
- Agua (BBL)
- Horas producidas

##### Tab: Logs
Historial de operaciones:
- Fecha
- Tipo de operación
- Descripción
- Responsable

##### Tab: Documentos
Archivos adjuntos.

---

## Producción Diaria

### Lista de Registros

**Ruta:** `/production/daily`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Pozo** | Todos los pozos |
| **Campo** | Todos los campos |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Fecha** | Fecha de producción |
| **Pozo** | Pozo productor |
| **Petróleo** | BBL producidos |
| **Gas** | MCF producidos |
| **Agua** | BBL de agua |
| **BSW** | Corte de agua (%) |
| **Horas** | Horas de producción |
| **Acciones** | Ver, Editar |

---

### Registrar Producción Diaria

**Ruta:** `/production/daily/new`

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Pozo** | ✅ | Seleccionar pozo |
| **Fecha** | ✅ | Fecha de producción |
| **Petróleo (BBL)** | ✅ | Barriles de petróleo |
| **Gas (MCF)** | ❌ | Miles de pies cúbicos |
| **Agua (BBL)** | ❌ | Barriles de agua |
| **Horas Producidas** | ❌ | Horas de operación |
| **Choke** | ❌ | Tamaño del choke |
| **Presión** | ❌ | Presión de cabezal |
| **Temperatura** | ❌ | Temperatura |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nueva Producción"**
2. Seleccionar pozo
3. Ingresar fecha
4. Registrar volúmenes producidos
5. Agregar parámetros operacionales
6. Hacer clic en **"Guardar"**

---

## Asignaciones (Allocations)

### Lista de Asignaciones

**Ruta:** `/production/allocations`

Muestra la distribución de producción entre socios según porcentajes de participación.

#### Información Mostrada
- Período
- Campo
- Producción total
- Distribución por socio

---

## Tips y Mejores Prácticas

### Para Producción Diaria
- ✅ Registrar producción diariamente
- ✅ Verificar datos antes de guardar
- ✅ Incluir observaciones relevantes
- ✅ Reportar anomalías inmediatamente

### Para Pozos
- ✅ Mantener datos técnicos actualizados
- ✅ Registrar cambios de estado
- ✅ Documentar operaciones en logs

### Para Análisis
- ✅ Revisar tendencias regularmente
- ✅ Identificar pozos con declinación
- ✅ Comparar con históricos

---

## Solución de Problemas

### "No puedo registrar producción"
- Verificar que el pozo esté activo
- Verificar que no exista registro para esa fecha
- Verificar permisos de usuario

### "Datos de producción incorrectos"
- Editar el registro existente
- Documentar la corrección en notas

### "Pozo no aparece en lista"
- Verificar filtros aplicados
- Verificar estado del pozo
- Verificar campo seleccionado
