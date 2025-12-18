# 🛡️ Módulo de HSE - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"HSE"**
2. Se despliegan las opciones:
   - Dashboard
   - Incidentes
   - Inspecciones
   - Capacitaciones
   - Equipos

---

## Dashboard HSE

**Ruta:** `/hse`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Días sin Accidentes** | Contador desde el último accidente |
| **Incidentes Abiertos** | Incidentes sin cerrar |
| **Inspecciones Pendientes** | Inspecciones programadas |
| **Capacitaciones por Vencer** | Certificaciones próximas a expirar |

### Alertas
- Incidentes de alta severidad
- Inspecciones vencidas
- Capacitaciones por renovar
- EPP por vencer

### Estadísticas
- Tendencia de incidentes por mes
- Distribución por tipo
- Cumplimiento de inspecciones

---

## Incidentes

### Lista de Incidentes

**Ruta:** `/hse/incidents`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Accidente, Casi Accidente, Condición Insegura, etc. |
| **Severidad** | Baja, Media, Alta, Crítica |
| **Estado** | Reportado, Investigando, En Progreso, Cerrado |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Fecha** | Fecha del incidente |
| **Tipo** | Tipo de incidente |
| **Severidad** | Nivel de severidad |
| **Ubicación** | Lugar del incidente |
| **Estado** | Estado actual |
| **Acciones** | Ver detalle |

---

### Reportar Incidente

**Ruta:** `/hse/incidents/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Tipo de incidente |
| **Severidad** | ✅ | Nivel de severidad |
| **Fecha y Hora** | ✅ | Cuándo ocurrió |
| **Ubicación** | ✅ | Dónde ocurrió |
| **Descripción** | ✅ | Qué pasó |
| **Empleados Involucrados** | ❌ | Personas afectadas |
| **Testigos** | ❌ | Personas que presenciaron |
| **Proyecto** | ❌ | Proyecto asociado |
| **Fotos** | ❌ | Evidencia fotográfica |

#### Pasos
1. Hacer clic en **"+ Reportar Incidente"**
2. Seleccionar tipo de incidente
3. Evaluar y seleccionar severidad
4. Ingresar fecha, hora y ubicación
5. Describir detalladamente lo ocurrido
6. Identificar empleados involucrados
7. Adjuntar fotos si las hay
8. Hacer clic en **"Guardar"**

---

### Detalle del Incidente

**Ruta:** `/hse/incidents/:id`

#### Información del Incidente
- Código y tipo
- Severidad (chip de color)
- Fecha y hora
- Ubicación
- Descripción
- Empleados involucrados
- Estado

#### Tabs Disponibles

##### Tab: Información
Datos generales del incidente.

##### Tab: Investigación
- Causa raíz
- Factores contribuyentes
- Análisis de causas

##### Tab: Acciones Correctivas
- Lista de acciones definidas
- Responsables
- Fechas límite
- Estado de cada acción

##### Tab: Documentos
- Fotos del incidente
- Reportes
- Evidencias

##### Tab: Auditoría
Historial de cambios.

#### Flujo de Investigación

1. **Reportado** → Incidente recién registrado
2. **Investigando** → Se está analizando
3. **Pendiente de Acciones** → Se definieron acciones
4. **En Progreso** → Acciones en ejecución
5. **Cerrado** → Todas las acciones completadas

---

## Inspecciones

### Lista de Inspecciones

**Ruta:** `/hse/inspections`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Tipo de inspección |
| **Estado** | Programada, En Progreso, Completada |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Tipo** | Tipo de inspección |
| **Fecha Programada** | Cuándo se debe realizar |
| **Inspector** | Quien realiza |
| **Ubicación** | Área a inspeccionar |
| **Puntuación** | Resultado (0-100) |
| **Estado** | Estado actual |

---

### Crear Inspección

**Ruta:** `/hse/inspections/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Tipo de inspección |
| **Fecha Programada** | ✅ | Cuándo realizar |
| **Inspector** | ✅ | Quien inspecciona |
| **Ubicación** | ✅ | Área a inspeccionar |
| **Checklist** | ❌ | Puntos a verificar |
| **Notas** | ❌ | Observaciones |

#### Pasos
1. Hacer clic en **"+ Nueva Inspección"**
2. Seleccionar tipo de inspección
3. Definir fecha programada
4. Asignar inspector
5. Indicar ubicación/área
6. Hacer clic en **"Guardar"**

---

### Ejecutar Inspección

1. Ir al detalle de la inspección programada
2. Clic en **"Iniciar Inspección"**
3. Completar checklist de verificación
4. Registrar hallazgos encontrados
5. Asignar puntuación general
6. Clic en **"Completar Inspección"**

---

## Capacitaciones

### Lista de Capacitaciones

**Ruta:** `/hse/trainings`

#### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Tipo** | Tipo de capacitación |
| **Estado** | Programada, En Curso, Completada |
| **Fecha Desde** | Fecha inicial |
| **Fecha Hasta** | Fecha final |

#### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del curso |
| **Tipo** | Tipo de capacitación |
| **Fechas** | Inicio - Fin |
| **Instructor** | Quien imparte |
| **Participantes** | Cantidad de asistentes |
| **Estado** | Estado actual |

---

### Crear Capacitación

**Ruta:** `/hse/trainings/new`

#### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre del curso |
| **Tipo** | ✅ | Tipo de capacitación |
| **Fecha Inicio** | ✅ | Cuándo inicia |
| **Fecha Fin** | ✅ | Cuándo termina |
| **Instructor** | ❌ | Quien imparte |
| **Ubicación** | ❌ | Dónde se realiza |
| **Participantes** | ❌ | Empleados a capacitar |
| **Validez (meses)** | ❌ | Duración de la certificación |
| **Descripción** | ❌ | Contenido del curso |

#### Pasos
1. Hacer clic en **"+ Nueva Capacitación"**
2. Ingresar nombre del curso
3. Seleccionar tipo
4. Definir fechas de inicio y fin
5. Asignar instructor
6. Agregar participantes
7. Definir validez de la certificación
8. Hacer clic en **"Guardar"**

---

### Registrar Asistencia

1. Ir al detalle de la capacitación
2. Tab "Participantes"
3. Marcar asistencia de cada participante
4. Al completar, se generan certificaciones

---

## Equipos de Protección

### Lista de Equipos

**Ruta:** `/hse/equipment`

#### Información Mostrada
- Tipo de equipo
- Cantidad en inventario
- Asignados
- Disponibles
- Por vencer

### Asignar EPP a Empleado

1. Ir al detalle del equipo
2. Clic en "Asignar"
3. Seleccionar empleado
4. Definir fecha de entrega
5. Definir fecha de vencimiento
6. Guardar

---

## Tips y Mejores Prácticas

### Para Incidentes
- ✅ Reportar inmediatamente después de ocurrir
- ✅ Incluir toda la información disponible
- ✅ Adjuntar fotos como evidencia
- ✅ Identificar todos los involucrados
- ✅ No omitir casi-accidentes

### Para Inspecciones
- ✅ Programar inspecciones periódicas
- ✅ Usar checklists estandarizados
- ✅ Documentar todos los hallazgos
- ✅ Dar seguimiento a acciones correctivas

### Para Capacitaciones
- ✅ Mantener registro de asistencia
- ✅ Controlar vencimientos de certificaciones
- ✅ Programar renovaciones con anticipación
- ✅ Documentar contenido impartido

### Para EPP
- ✅ Mantener inventario actualizado
- ✅ Controlar fechas de vencimiento
- ✅ Registrar todas las entregas
- ✅ Verificar uso correcto

---

## Solución de Problemas

### "No puedo cerrar el incidente"
- Verificar que todas las acciones correctivas estén completadas
- Verificar que la investigación esté completa
- Verificar permisos de usuario

### "La inspección no se puede completar"
- Verificar que todos los puntos del checklist estén evaluados
- Verificar que se haya asignado puntuación

### "Capacitación sin participantes"
- Agregar participantes antes de iniciar
- Verificar que los empleados estén activos

### "EPP no disponible"
- Verificar inventario
- Solicitar reposición si es necesario
- Verificar asignaciones activas
