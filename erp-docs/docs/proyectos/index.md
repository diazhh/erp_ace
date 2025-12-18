# 📁 Gestión de Proyectos

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Proyectos"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores y gráficos
   - **Lista**: Todos los proyectos

---

## Dashboard de Proyectos

![Dashboard de Proyectos](./images/06-proyectos-dashboard.png)

### Acceder al Dashboard

1. En el menú, seleccione **"Proyectos"** → **"Dashboard"**
2. Verá el panel principal con toda la información de proyectos

### Indicadores Principales (KPIs)

| Indicador | Descripción |
|-----------|-------------|
| **Total** | Cantidad total de proyectos |
| **Activos** | Proyectos en planificación o en progreso |
| **Completados** | Proyectos finalizados |
| **Atrasados** | Proyectos con fecha vencida |

### Sección de Presupuesto

Muestra un resumen financiero de todos los proyectos:
- **Presupuesto Total**: Suma de presupuestos de todos los proyectos
- **Costo Real**: Suma de costos reales gastados
- **Restante**: Diferencia entre presupuesto y costo
- **Barra de uso**: Porcentaje del presupuesto consumido

### Gráficos Disponibles

| Gráfico | Descripción |
|---------|-------------|
| **Por Estado** | Distribución de proyectos por estado (pastel) |
| **Por Prioridad** | Cantidad de proyectos por nivel de prioridad (barras) |

### Lista de Proyectos

![Lista de Proyectos](./images/06-proyectos-lista.png) Activos

Muestra los 5 proyectos más recientes que están activos, con:
- Nombre y código
- Estado (chip de color)
- Alerta si está atrasado
- Presupuesto y progreso

Haga clic en cualquier proyecto para ir a su detalle.

---

## Lista de Proyectos

![Lista de Proyectos](./images/06-proyectos-lista.png)

### Ver Todos los Proyectos

1. En el menú, seleccione **"Proyectos"** → **"Lista"**
2. Verá indicadores y la tabla/tarjetas de proyectos

### Indicadores de la Lista

| Indicador | Descripción |
|-----------|-------------|
| **Total** | Cantidad de proyectos |
| **Activos** | En planificación o progreso |
| **Atrasados** | Con fecha vencida |
| **Presupuesto** | Suma de presupuestos |
| **Costo Real** | Suma de costos |
| **Ganancia** | Diferencia presupuesto - costo |

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por nombre, código o cliente |
| **Tipo** | Interno, Contratado |
| **Estado** | Planificación, En Progreso, En Espera, Completado, Cancelado |
| **Prioridad** | Baja, Media, Alta, Crítica |

### Columnas de la Tabla (Desktop)

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del proyecto y gerente |
| **Tipo** | Interno o Contratado |
| **Cliente** | Nombre del cliente (si aplica) |
| **Estado** | Estado actual |
| **Prioridad** | Nivel de prioridad |
| **Progreso** | Barra de avance |
| **Presupuesto** | Monto asignado |
| **Fechas** | Inicio y fin planificados |
| **Acciones** | Ver, Editar, Eliminar |

### Vista en Dispositivos Móviles

En celulares, los proyectos se muestran como tarjetas con toda la información resumida.

---

## Crear un Nuevo Proyecto

1. Haga clic en el botón **"+ Nuevo Proyecto"**
2. Se abrirá una página con el formulario

### Campos del Formulario

#### Información Básica

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único (ej: "PRY-2025-001") |
| **Nombre** | ✅ Sí | Nombre descriptivo del proyecto |
| **Descripción** | ❌ No | Descripción detallada |
| **Tipo de Ejecución** | ✅ Sí | Interno o Contratado |
| **Estado** | ✅ Sí | Estado inicial (generalmente "Planificación") |
| **Prioridad** | ✅ Sí | Baja, Media, Alta, Crítica |

#### Fechas

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Fecha de Inicio** | ✅ Sí | Cuándo comienza el proyecto |
| **Fecha de Fin** | ✅ Sí | Cuándo debe terminar |

#### Responsables

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Gerente de Proyecto** | ❌ No | Empleado responsable |
| **Cliente** | ❌ No | Nombre del cliente |

#### Financiero

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Presupuesto** | ❌ No | Monto asignado |
| **Moneda** | ❌ No | USD, VES, EUR |
| **Costo Real** | ❌ No | Monto gastado (se actualiza durante ejecución) |

#### Ubicación

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Ubicación** | ❌ No | Lugar donde se ejecuta el proyecto |

3. Complete los campos requeridos
4. Haga clic en **"Guardar"**

---

## Ver Detalle de un Proyecto

1. En la lista, haga clic en el ícono de **ojo** (👁) o en el nombre del proyecto
2. Se abrirá la página de detalle

### Información del Encabezado

- **Nombre** y código del proyecto
- **Estado** (chip de color)
- **Tipo** de ejecución
- **Prioridad**
- **Gerente** responsable
- **Fechas** de inicio y fin

### Pestañas Disponibles

#### Pestaña: Resumen
- Información general del proyecto
- Progreso actual
- Presupuesto vs costo real
- Descripción

#### Pestaña: Equipo
- Miembros asignados al proyecto
- Roles de cada miembro

#### Pestaña: Tareas
- Lista de tareas del proyecto
- Estado de cada tarea

#### Pestaña: Documentos
- Archivos adjuntos (planos, contratos, etc.)

#### Pestaña: Historial
- Registro de cambios y actividades

---

## Actualizar Progreso

1. En el detalle del proyecto, busque la sección de progreso
2. Modifique el porcentaje de avance
3. Guarde los cambios

También puede actualizar el progreso desde la edición del proyecto.

---

## Editar un Proyecto

1. En la lista o detalle, haga clic en el ícono de **lápiz** (✏️)
2. Se abrirá el formulario con los datos actuales
3. Modifique los campos necesarios:
   - Actualizar estado
   - Cambiar prioridad
   - Modificar fechas
   - Actualizar progreso
   - Registrar costo real
4. Haga clic en **"Guardar"**

---

## Eliminar un Proyecto

1. En la lista, haga clic en el ícono de **papelera** (🗑️)
2. Confirme la eliminación

> ⚠️ **Importante**: Solo puede eliminar proyectos en estado "Planificación". Los proyectos en progreso o completados no pueden eliminarse.

---

## Flujo de Trabajo Típico

```
1. CREAR PROYECTO (Estado: Planificación)
   ↓
2. DEFINIR EQUIPO Y TAREAS
   ↓
3. INICIAR PROYECTO (Estado: En Progreso)
   ↓
4. ACTUALIZAR PROGRESO REGULARMENTE
   ↓
5. REGISTRAR COSTOS REALES
   ↓
6. COMPLETAR PROYECTO (Estado: Completado)
```

---

## Consejos Útiles

### Para la Planificación
- ✅ Defina fechas realistas
- ✅ Establezca un presupuesto adecuado
- ✅ Asigne un gerente responsable
- ✅ Documente bien el alcance

### Para el Seguimiento
- ✅ Actualice el progreso semanalmente
- ✅ Registre los costos reales a medida que ocurren
- ✅ Revise proyectos atrasados diariamente
- ✅ Documente los cambios importantes

### Para el Control
- ✅ Compare presupuesto vs costo real regularmente
- ✅ Identifique desviaciones temprano
- ✅ Ajuste fechas si es necesario
- ✅ Comunique cambios al equipo

---

## Preguntas Frecuentes

### ¿Por qué no puedo eliminar un proyecto?
Solo puede eliminar proyectos en estado "Planificación". Si el proyecto ya inició, debe cancelarlo en lugar de eliminarlo.

### ¿Cómo marco un proyecto como atrasado?
No es necesario. El sistema detecta automáticamente los proyectos atrasados cuando la fecha de fin ya pasó y el estado no es "Completado".

### ¿Puedo cambiar el tipo de proyecto después de crearlo?
Sí, puede cambiar entre "Interno" y "Contratado" editando el proyecto.

### ¿Cómo asigno miembros al equipo?
En el detalle del proyecto, vaya a la pestaña "Equipo" y agregue los miembros.

### ¿Puedo tener varios gerentes en un proyecto?
El campo "Gerente de Proyecto" es único, pero puede agregar otros responsables en el equipo con roles específicos.

### ¿Cómo exporto la información del proyecto?
En el detalle del proyecto, busque el botón "Descargar PDF" para exportar un resumen.
