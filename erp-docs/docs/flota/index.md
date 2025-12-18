# 🚗 Gestión de Flota

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Flota"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Vehículos**: Gestión de vehículos
   - **Mantenimientos**: Programación y seguimiento
   - **Combustible**: Registro de cargas

---

## Dashboard de Flota

![Dashboard de Flota](./images/08-flota-dashboard.png)

### Acceder al Dashboard

1. En el menú, seleccione **"Flota"** → **"Dashboard"**
2. Verá el panel principal con indicadores y alertas

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Total Vehículos** | Cantidad de vehículos registrados |
| **Disponibles** | Vehículos listos para usar |
| **Mant. Pendientes** | Mantenimientos programados |
| **Doc. por Vencer** | Documentos próximos a expirar |

### Alertas

El dashboard muestra alertas de:
- Documentos por vencer (seguro, revisión técnica)
- Mantenimientos programados próximos
- Vehículos fuera de servicio

---

## Vehículos

### Ver Lista de Vehículos

![Lista de Vehículos](./images/08-flota-vehiculos-lista.png)

1. En el menú, seleccione **"Flota"** → **"Vehículos"**
2. Verá indicadores y la tabla/tarjetas de vehículos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código, placa, marca |
| **Estado** | Disponible, Asignado, En Mantenimiento, etc. |
| **Tipo** | Automóvil, Camioneta, Camión, etc. |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador interno |
| **Placa** | Número de placa |
| **Vehículo** | Marca, modelo y año |
| **Tipo** | Tipo de vehículo |
| **Kilometraje** | Odómetro actual |
| **Estado** | Estado actual |
| **Asignado a** | Empleado o proyecto |
| **Acciones** | Ver, Editar |

---

### Crear un Nuevo Vehículo

1. Haga clic en el botón **"+ Nuevo"**
2. Se abrirá una página con el formulario

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código interno (ej: "VEH-001") |
| **Placa** | ✅ Sí | Número de placa |
| **Marca** | ✅ Sí | Marca del vehículo |
| **Modelo** | ✅ Sí | Modelo específico |
| **Año** | ✅ Sí | Año de fabricación |
| **Tipo** | ✅ Sí | Automóvil, Camioneta, etc. |
| **Color** | ❌ No | Color del vehículo |
| **VIN** | ❌ No | Número de identificación |
| **Kilometraje** | ❌ No | Odómetro actual |
| **Tipo de Combustible** | ❌ No | Gasolina, Diesel, etc. |
| **Capacidad de Tanque** | ❌ No | Litros |
| **Estado** | ✅ Sí | Estado inicial |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

### Ver Detalle de un Vehículo

![Detalle de Vehículo](./images/08-flota-vehiculos-detalle.png)

1. En la lista, haga clic en el ícono de **ojo** (👁)
2. Verá la página de detalle con pestañas

#### Pestañas Disponibles

| Pestaña | Contenido |
|---------|-----------|
| **Información** | Datos generales del vehículo |
| **Asignaciones** | Historial de asignaciones |
| **Mantenimientos** | Historial de mantenimientos |
| **Combustible** | Historial de cargas |
| **Documentos** | Archivos adjuntos |

---

### Asignar un Vehículo

1. En el detalle del vehículo, vaya a la pestaña **"Asignaciones"**
2. Haga clic en **"Nueva Asignación"**
3. Complete el formulario:

| Campo | Descripción |
|-------|-------------|
| **Tipo** | Empleado o Proyecto |
| **Empleado/Proyecto** | Seleccione a quién asignar |
| **Fecha Inicio** | Desde cuándo |
| **Fecha Fin** | Hasta cuándo (opcional) |
| **Notas** | Observaciones |

4. Haga clic en **"Guardar"**
5. El estado del vehículo cambia a "Asignado"

---

## Mantenimientos

### Ver Lista de Mantenimientos

![Lista de Mantenimientos](./images/08-flota-mantenimientos-lista.png)

1. En el menú, seleccione **"Flota"** → **"Mantenimientos"**
2. Verá la lista de todos los mantenimientos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Estado** | Programado, En Progreso, Completado, Cancelado |
| **Tipo** | Preventivo, Correctivo, Inspección |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador del mantenimiento |
| **Vehículo** | Placa y modelo |
| **Tipo** | Tipo de mantenimiento |
| **Descripción** | Detalle del trabajo |
| **Fecha** | Fecha programada |
| **Costo** | Costo total |
| **Estado** | Estado actual |
| **Acciones** | Ver, Completar |

---

### Programar un Mantenimiento

1. Haga clic en el botón **"+ Nuevo"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Vehículo** | ✅ Sí | Seleccione el vehículo |
| **Tipo** | ✅ Sí | Preventivo, Correctivo, Inspección |
| **Descripción** | ✅ Sí | Detalle del trabajo a realizar |
| **Fecha Programada** | ✅ Sí | Cuándo se realizará |
| **Kilometraje** | ❌ No | Odómetro al momento |
| **Proveedor** | ❌ No | Taller o proveedor |
| **Costo Estimado** | ❌ No | Costo aproximado |
| **Notas** | ❌ No | Observaciones |

3. Haga clic en **"Guardar"**
4. El mantenimiento queda en estado "Programado"

---

### Completar un Mantenimiento

1. En la lista de mantenimientos, busque uno en estado "Programado" o "En Progreso"
2. Haga clic en el ícono de **check verde** (✅)
3. Complete la información final:
   - Fecha de completado
   - Costo real
   - Notas finales
4. Confirme la acción
5. El estado cambia a "Completado"

---

## Registro de Combustible

### Ver Lista de Cargas

![Lista de Cargas de Combustible](./images/08-flota-combustible-lista.png)

1. En el menú, seleccione **"Flota"** → **"Combustible"**
2. Verá el historial de cargas de combustible

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Fecha Desde** | Inicio del período |
| **Fecha Hasta** | Fin del período |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador de la carga |
| **Vehículo** | Placa y modelo |
| **Fecha** | Fecha de la carga |
| **Cantidad** | Litros cargados |
| **Costo** | Monto pagado |
| **Kilometraje** | Odómetro al cargar |
| **Conductor** | Quién realizó la carga |
| **Acciones** | Editar, Eliminar |

---

### Registrar una Carga de Combustible

1. Haga clic en el botón **"+ Nuevo"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Vehículo** | ✅ Sí | Seleccione el vehículo |
| **Fecha** | ✅ Sí | Fecha de la carga |
| **Cantidad** | ✅ Sí | Litros cargados |
| **Precio por Litro** | ✅ Sí | Precio unitario |
| **Costo Total** | Auto | Se calcula automáticamente |
| **Kilometraje** | ✅ Sí | Odómetro actual |
| **Conductor** | ❌ No | Quién realizó la carga |
| **Estación** | ❌ No | Nombre de la estación |
| **Tipo de Combustible** | ❌ No | Gasolina, Diesel |
| **Notas** | ❌ No | Observaciones |

3. Haga clic en **"Guardar"**

---

## Exportar Reportes

### Reporte de Mantenimientos

1. En la lista de mantenimientos, aplique los filtros deseados
2. Haga clic en **"Descargar PDF"**
3. Se genera un PDF con los mantenimientos filtrados

### Reporte de Combustible

1. En la lista de combustible, seleccione el rango de fechas
2. Haga clic en **"Descargar PDF"**
3. Se genera un PDF con el consumo del período

---

## Consejos Útiles

### Para Vehículos
- ✅ Mantenga actualizado el kilometraje
- ✅ Registre todos los documentos con fechas de vencimiento
- ✅ Asigne siempre un responsable

### Para Mantenimientos
- ✅ Programe mantenimientos preventivos regularmente
- ✅ Registre el costo real al completar
- ✅ Documente los trabajos realizados

### Para Combustible
- ✅ Registre cada carga inmediatamente
- ✅ Siempre anote el kilometraje
- ✅ Revise el rendimiento (km/litro) periódicamente

---

## Preguntas Frecuentes

### ¿Por qué no puedo asignar un vehículo?
Verifique que el vehículo esté en estado "Disponible". Los vehículos en mantenimiento o fuera de servicio no pueden asignarse.

### ¿Cómo veo el historial de un vehículo?
En el detalle del vehículo, las pestañas muestran el historial de asignaciones, mantenimientos y cargas de combustible.

### ¿Puedo asignar un vehículo a un proyecto?
Sí. Al crear una asignación, seleccione "Proyecto" como tipo y elija el proyecto correspondiente.

### ¿Cómo calculo el rendimiento de combustible?
El sistema calcula automáticamente el rendimiento (km/litro) basándose en las cargas registradas y el kilometraje.

### ¿Qué pasa cuando vence un documento?
El sistema muestra una alerta en el dashboard indicando los documentos próximos a vencer o ya vencidos.

### ¿Puedo eliminar un vehículo?
No directamente. Debe cambiar el estado a "Vendido" para indicar que ya no pertenece a la empresa.
