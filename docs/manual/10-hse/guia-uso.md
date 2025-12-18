# 🦺 Seguridad y Salud (HSE) - Guía de Uso

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"HSE"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Incidentes**: Gestión de incidentes
   - **Inspecciones**: Inspecciones de seguridad
   - **Capacitaciones**: Entrenamientos
   - **Equipos**: Equipos de protección

---

## Dashboard de HSE

### Acceder al Dashboard

1. En el menú, seleccione **"HSE"** → **"Dashboard"**
2. Verá el panel principal con indicadores de seguridad

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Incidentes del Mes** | Cantidad de incidentes reportados |
| **Inspecciones Pendientes** | Inspecciones programadas |
| **Capacitaciones Próximas** | Entrenamientos por realizar |
| **Días sin Incidentes** | Racha de días seguros |

---

## Incidentes

### Ver Lista de Incidentes

1. En el menú, seleccione **"HSE"** → **"Incidentes"**
2. Verá la tabla/tarjetas de incidentes

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Accidente, Casi-accidente, Ambiental, etc. |
| **Severidad** | Baja, Media, Alta, Crítica |
| **Estado** | Reportado, Investigando, Cerrado, etc. |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Tipo de incidente |
| **Título** | Descripción breve |
| **Ubicación** | Dónde ocurrió |
| **Fecha** | Cuándo ocurrió |
| **Severidad** | Nivel de gravedad |
| **Estado** | Estado actual |
| **Acciones** | Ver detalle |

---

### Reportar un Incidente

1. Haga clic en el botón **"+ Nuevo Incidente"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ Sí | Accidente, Casi-accidente, etc. |
| **Título** | ✅ Sí | Descripción breve |
| **Fecha y Hora** | ✅ Sí | Cuándo ocurrió |
| **Ubicación** | ✅ Sí | Dónde ocurrió |
| **Severidad** | ✅ Sí | Baja, Media, Alta, Crítica |
| **Descripción** | ✅ Sí | Detalle de lo ocurrido |
| **Proyecto** | ❌ No | Proyecto relacionado |
| **Empleados Involucrados** | ❌ No | Personas afectadas |
| **Testigos** | ❌ No | Quiénes presenciaron |

3. Haga clic en **"Guardar"**
4. El incidente queda en estado "Reportado"

---

### Investigar un Incidente

1. En el detalle del incidente, cambie el estado a "Investigando"
2. Complete la investigación:
   - Causa raíz
   - Factores contribuyentes
   - Evidencias
3. Defina acciones correctivas
4. Asigne responsables y fechas

---

### Cerrar un Incidente

1. Verifique que todas las acciones correctivas estén completadas
2. Cambie el estado a "Cerrado"
3. Agregue notas de cierre

---

## Inspecciones

### Ver Lista de Inspecciones

1. En el menú, seleccione **"HSE"** → **"Inspecciones"**
2. Verá la lista de inspecciones

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Lugar de Trabajo, Equipos, Vehículos, etc. |
| **Estado** | Programada, En Progreso, Completada |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Tipo de inspección |
| **Título** | Descripción |
| **Inspector** | Quién realiza |
| **Fecha** | Fecha programada |
| **Resultado** | Satisfactorio, Necesita Mejoras, etc. |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar |

---

### Programar una Inspección

1. Haga clic en el botón **"+ Nueva Inspección"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ Sí | Lugar de Trabajo, Equipos, etc. |
| **Título** | ✅ Sí | Descripción de la inspección |
| **Fecha Programada** | ✅ Sí | Cuándo se realizará |
| **Inspector** | ✅ Sí | Empleado que inspecciona |
| **Ubicación** | ❌ No | Área a inspeccionar |
| **Proyecto** | ❌ No | Proyecto relacionado |
| **Checklist** | ❌ No | Lista de verificación |

3. Haga clic en **"Guardar"**

---

### Completar una Inspección

1. En el detalle de la inspección, registre los hallazgos
2. Marque cada ítem del checklist
3. Agregue observaciones y fotos
4. Seleccione el resultado:
   - **Satisfactorio**: Todo en orden
   - **Necesita Mejoras**: Observaciones menores
   - **No Satisfactorio**: Problemas graves
5. Cambie el estado a "Completada"

---

## Capacitaciones

### Ver Lista de Capacitaciones

1. En el menú, seleccione **"HSE"** → **"Capacitaciones"**
2. Verá la lista de entrenamientos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Inducción, Primeros Auxilios, Trabajo en Alturas, etc. |
| **Estado** | Programada, En Progreso, Completada |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Tipo de capacitación |
| **Título** | Nombre del curso |
| **Instructor** | Quién imparte |
| **Fecha** | Fecha programada |
| **Duración** | Horas de duración |
| **Participantes** | Cantidad de asistentes |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar |

---

### Programar una Capacitación

1. Haga clic en el botón **"+ Nueva Capacitación"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ Sí | Inducción, Primeros Auxilios, etc. |
| **Título** | ✅ Sí | Nombre del curso |
| **Fecha** | ✅ Sí | Cuándo se realizará |
| **Duración** | ✅ Sí | Horas de duración |
| **Instructor** | ❌ No | Quién imparte |
| **Ubicación** | ❌ No | Dónde se realizará |
| **Descripción** | ❌ No | Contenido del curso |
| **Participantes** | ❌ No | Empleados convocados |

3. Haga clic en **"Guardar"**

---

### Registrar Asistencia

1. En el detalle de la capacitación, vaya a la pestaña "Participantes"
2. Marque la asistencia de cada empleado
3. Registre la calificación si aplica
4. Al finalizar, cambie el estado a "Completada"

---

## Equipos de Protección (EPP)

### Ver Lista de Equipos

1. En el menú, seleccione **"HSE"** → **"Equipos"**
2. Verá el inventario de equipos de protección

### Registrar un Equipo

1. Haga clic en **"+ Nuevo Equipo"**
2. Complete:
   - Tipo de equipo (casco, guantes, arnés, etc.)
   - Marca y modelo
   - Fecha de vencimiento
   - Cantidad disponible

### Asignar Equipo a Empleado

1. En el detalle del equipo, haga clic en "Asignar"
2. Seleccione el empleado
3. Registre la fecha de entrega
4. El empleado firma la recepción

---

## Consejos Útiles

### Para Incidentes
- ✅ Reporte inmediatamente, no espere
- ✅ Documente con fotos si es posible
- ✅ Identifique testigos
- ✅ No altere la escena hasta documentar

### Para Inspecciones
- ✅ Use checklists estandarizados
- ✅ Tome fotos de hallazgos
- ✅ Defina acciones con fechas
- ✅ Haga seguimiento a las mejoras

### Para Capacitaciones
- ✅ Programe con anticipación
- ✅ Confirme asistencia previa
- ✅ Registre asistencia el mismo día
- ✅ Entregue certificados

---

## Preguntas Frecuentes

### ¿Quién puede reportar un incidente?
Cualquier empleado puede y debe reportar incidentes. Es responsabilidad de todos.

### ¿Qué diferencia hay entre accidente y casi-accidente?
El accidente causa daño real (lesión o pérdida). El casi-accidente pudo causar daño pero no lo hizo.

### ¿Cada cuánto debo hacer inspecciones?
Depende del área y riesgo. Generalmente: diarias para áreas críticas, semanales para equipos, mensuales para instalaciones.

### ¿Las capacitaciones son obligatorias?
Algunas sí, como la inducción y las específicas del puesto. Otras son recomendadas según el rol.

### ¿Cómo sé si un EPP está vencido?
El sistema muestra alertas de equipos próximos a vencer. Revise las fechas de vencimiento regularmente.

### ¿Puedo adjuntar fotos a los incidentes?
Sí. En el detalle del incidente puede adjuntar fotos, videos y documentos como evidencia.
