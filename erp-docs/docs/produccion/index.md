# 🛢️ Producción y Pozos

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Producción"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Campos**: Gestión de campos
   - **Pozos**: Gestión de pozos
   - **Producción Diaria**: Registro de producción
   - **Asignaciones**: Asignación de producción

---

## Dashboard de Producción

![Dashboard de Producción](./images/17-produccion-dashboard.png)

### Acceder al Dashboard

1. En el menú, seleccione **"Producción"** → **"Dashboard"**
2. Verá el panel principal con indicadores de producción

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Producción Total** | Barriles producidos hoy |
| **Pozos Activos** | Pozos en producción |
| **Campos Activos** | Campos operativos |
| **Tendencia** | Comparación con período anterior |

---

## Campos

### Ver Lista de Campos

![Lista de Campos](./images/17-produccion-campos-lista.png)

1. En el menú, seleccione **"Producción"** → **"Campos"**
2. Verá la tabla/tarjetas de campos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Estado** | Activo, Inactivo, En Desarrollo, Abandonado |
| **Tipo** | Onshore, Offshore |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del campo |
| **Tipo** | Onshore/Offshore |
| **Ubicación** | Localización geográfica |
| **Pozos** | Cantidad de pozos |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Registrar un Campo

1. Haga clic en el botón **"+ Nuevo Campo"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Nombre** | ✅ Sí | Nombre del campo |
| **Tipo** | ✅ Sí | Onshore, Offshore |
| **Estado** | ✅ Sí | Estado inicial |
| **Ubicación** | ❌ No | Localización |
| **Coordenadas** | ❌ No | Latitud/Longitud |
| **Descripción** | ❌ No | Detalles |

3. Haga clic en **"Guardar"**

---

## Pozos

### Ver Lista de Pozos

![Lista de Pozos](./images/17-produccion-pozos-lista.png)

1. En el menú, seleccione **"Producción"** → **"Pozos"**
2. Verá la tabla/tarjetas de pozos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Campo** | Filtrar por campo |
| **Estado** | Activo, Inactivo, Cerrado, etc. |
| **Tipo** | Productor, Inyector, Observación |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del pozo |
| **Campo** | Campo al que pertenece |
| **Tipo** | Productor, Inyector, etc. |
| **Clasificación** | Petróleo, Gas, Mixto |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Eliminar |

---

### Registrar un Pozo

1. Haga clic en el botón **"+ Nuevo Pozo"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Nombre** | ✅ Sí | Nombre del pozo |
| **Campo** | ✅ Sí | Campo al que pertenece |
| **Tipo** | ✅ Sí | Productor, Inyector, etc. |
| **Clasificación** | ❌ No | Petróleo, Gas, Mixto |
| **Estado** | ✅ Sí | Estado inicial |
| **Profundidad** | ❌ No | Profundidad total |
| **Coordenadas** | ❌ No | Ubicación |
| **Fecha Perforación** | ❌ No | Cuándo se perforó |

3. Haga clic en **"Guardar"**

---

### Ver Detalle de un Pozo

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá:
   - Información técnica del pozo
   - Historial de producción
   - Intervenciones realizadas
   - Gráficos de rendimiento

---

## Producción Diaria

### Ver Lista de Producción

1. En el menú, seleccione **"Producción"** → **"Producción Diaria"**
2. Verá los registros de producción

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Fecha** | Rango de fechas |
| **Campo** | Filtrar por campo |
| **Pozo** | Filtrar por pozo |

---

### Registrar Producción Diaria

1. Haga clic en el botón **"+ Nueva Producción"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Fecha** | ✅ Sí | Día de producción |
| **Pozo** | ✅ Sí | Pozo que produjo |
| **Petróleo (BOPD)** | ❌ No | Barriles de petróleo |
| **Gas (MCFD)** | ❌ No | Miles de pies cúbicos de gas |
| **Agua (BWPD)** | ❌ No | Barriles de agua |
| **Horas Operación** | ❌ No | Horas de producción |
| **Presión Cabezal** | ❌ No | Presión en cabezal |
| **Temperatura** | ❌ No | Temperatura |
| **Notas** | ❌ No | Observaciones |

3. Haga clic en **"Guardar"**

---

## Asignaciones

### Ver Asignaciones

1. En el menú, seleccione **"Producción"** → **"Asignaciones"**
2. Verá las asignaciones de producción a socios

### Crear Asignación

1. Haga clic en **"+ Nueva Asignación"**
2. Seleccione el período y los socios
3. El sistema calcula las participaciones
4. Revise y confirme

---

## Consejos Útiles

### Para Campos
- ✅ Use códigos estándar de la industria
- ✅ Mantenga actualizada la ubicación
- ✅ Documente cambios de estado

### Para Pozos
- ✅ Registre todos los datos técnicos
- ✅ Actualice el estado cuando cambie
- ✅ Documente intervenciones

### Para Producción
- ✅ Registre diariamente
- ✅ Verifique los datos antes de guardar
- ✅ Investigue desviaciones significativas

---

## Preguntas Frecuentes

### ¿Puedo registrar producción de días anteriores?
Sí, puede seleccionar cualquier fecha pasada al registrar producción.

### ¿Cómo veo la producción acumulada de un pozo?
En el detalle del pozo, la pestaña de producción muestra el historial y acumulados.

### ¿Qué pasa si un pozo cambia de productor a inyector?
Cambie el tipo del pozo en la edición. El historial de producción se mantiene.

### ¿Cómo genero reportes de producción?
Use el módulo de Reportes para generar informes de producción por período, campo o pozo.

### ¿Puedo importar datos de producción?
Consulte con el administrador sobre la funcionalidad de importación masiva.
