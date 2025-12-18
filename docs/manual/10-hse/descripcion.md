# 🛡️ Módulo de HSE - Descripción

## ¿Qué hace este módulo?

El módulo de **HSE** (Higiene, Seguridad y Ambiente) gestiona la seguridad industrial de la empresa. Incluye registro de incidentes, inspecciones de seguridad, capacitaciones y equipos de protección personal.

## Funcionalidades Principales

### 1. Gestión de Incidentes
- **Reportar** incidentes y accidentes
- **Clasificar** por tipo y severidad
- **Investigar** causas raíz
- **Definir** acciones correctivas
- **Seguimiento** hasta cierre

### 2. Inspecciones de Seguridad
- **Programar** inspecciones periódicas
- **Ejecutar** checklists de inspección
- **Registrar** hallazgos
- **Generar** acciones correctivas
- **Seguimiento** de cumplimiento

### 3. Capacitaciones
- **Programar** cursos y entrenamientos
- **Registrar** asistencia
- **Control** de vencimientos
- **Certificaciones** de empleados

### 4. Equipos de Protección
- **Inventario** de EPP
- **Asignación** a empleados
- **Control** de vencimientos
- **Reposición** de equipos

### 5. Dashboard HSE
- **KPIs**: Días sin accidentes, incidentes abiertos
- **Alertas**: Capacitaciones por vencer, inspecciones pendientes
- **Estadísticas**: Tendencias de incidentes

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Incident` | Incidentes y accidentes |
| `Inspection` | Inspecciones de seguridad |
| `Training` | Capacitaciones |
| `SafetyEquipment` | Equipos de protección |
| `EquipmentAssignment` | Asignación de EPP |

## Tipos de Incidente

| Tipo | Descripción |
|------|-------------|
| **ACCIDENT** | Accidente con lesión |
| **NEAR_MISS** | Casi accidente |
| **UNSAFE_CONDITION** | Condición insegura |
| **UNSAFE_ACT** | Acto inseguro |
| **ENVIRONMENTAL** | Incidente ambiental |
| **PROPERTY_DAMAGE** | Daño a propiedad |

## Severidades

| Severidad | Color | Descripción |
|-----------|-------|-------------|
| **LOW** | Verde | Baja - Sin lesiones |
| **MEDIUM** | Naranja | Media - Lesiones menores |
| **HIGH** | Rojo | Alta - Lesiones graves |
| **CRITICAL** | Morado | Crítica - Fatalidad o incapacidad |

## Estados de Incidente

| Estado | Color | Descripción |
|--------|-------|-------------|
| **REPORTED** | Naranja | Reportado |
| **INVESTIGATING** | Azul | En investigación |
| **PENDING_ACTIONS** | Azul | Pendiente de acciones |
| **IN_PROGRESS** | Azul | Acciones en progreso |
| **CLOSED** | Verde | Cerrado |
| **CANCELLED** | Gris | Cancelado |

## Estados de Inspección

| Estado | Color | Descripción |
|--------|-------|-------------|
| **SCHEDULED** | Azul | Programada |
| **IN_PROGRESS** | Naranja | En ejecución |
| **COMPLETED** | Verde | Completada |
| **CANCELLED** | Gris | Cancelada |

## Estados de Capacitación

| Estado | Color | Descripción |
|--------|-------|-------------|
| **SCHEDULED** | Azul | Programada |
| **IN_PROGRESS** | Naranja | En curso |
| **COMPLETED** | Verde | Completada |
| **CANCELLED** | Gris | Cancelada |

## Campos de Incidente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `incidentType` | Enum | Tipo de incidente |
| `severity` | Enum | Severidad |
| `incidentDate` | DateTime | Fecha y hora del incidente |
| `location` | String | Ubicación |
| `description` | Text | Descripción detallada |
| `reportedById` | UUID | Quien reporta |
| `involvedEmployees` | Array | Empleados involucrados |
| `rootCause` | Text | Causa raíz |
| `correctiveActions` | Text | Acciones correctivas |
| `status` | Enum | Estado |

## Campos de Inspección

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `inspectionType` | String | Tipo de inspección |
| `scheduledDate` | Date | Fecha programada |
| `completedDate` | Date | Fecha de ejecución |
| `inspectorId` | UUID | Inspector |
| `location` | String | Área inspeccionada |
| `findings` | Text | Hallazgos |
| `score` | Integer | Puntuación (0-100) |
| `status` | Enum | Estado |

## Campos de Capacitación

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre del curso |
| `trainingType` | String | Tipo de capacitación |
| `startDate` | Date | Fecha de inicio |
| `endDate` | Date | Fecha de fin |
| `instructorId` | UUID | Instructor |
| `participants` | Array | Participantes |
| `validityMonths` | Integer | Meses de validez |
| `status` | Enum | Estado |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                           HSE                                │
│  (Incidentes, Inspecciones, Capacitaciones, EPP)            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │  PROYECTOS    │    │  INVENTARIO   │
│ - Involucrados│    │ - Incidentes  │    │ - EPP         │
│ - Capacitados │    │   en proyecto │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Involucrados en incidentes, participantes de capacitaciones
- **Proyectos**: Incidentes en proyectos
- **Inventario**: Equipos de protección personal

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/hse` | Dashboard | Dashboard HSE |
| `/hse/incidents` | Lista | Lista de incidentes |
| `/hse/incidents/new` | Formulario | Reportar incidente |
| `/hse/incidents/:id` | Detalle | Detalle de incidente |
| `/hse/inspections` | Lista | Lista de inspecciones |
| `/hse/inspections/new` | Formulario | Crear inspección |
| `/hse/inspections/:id` | Detalle | Detalle de inspección |
| `/hse/trainings` | Lista | Lista de capacitaciones |
| `/hse/trainings/new` | Formulario | Crear capacitación |
| `/hse/equipment` | Lista | Lista de equipos |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `hse:read` | Ver incidentes, inspecciones, capacitaciones |
| `hse:create` | Crear registros HSE |
| `hse:update` | Editar registros HSE |
| `hse:delete` | Eliminar registros |
| `hse:investigate` | Investigar incidentes |
| `hse:close` | Cerrar incidentes |

## Ejemplos de Uso

### Caso 1: Reportar Incidente
1. Ir a HSE → Incidentes → Nuevo
2. Seleccionar tipo de incidente
3. Ingresar fecha, hora y ubicación
4. Describir lo ocurrido
5. Identificar empleados involucrados
6. Guardar

### Caso 2: Ejecutar Inspección
1. Ir a HSE → Inspecciones
2. Seleccionar inspección programada
3. Ejecutar checklist
4. Registrar hallazgos
5. Asignar puntuación
6. Completar inspección

### Caso 3: Programar Capacitación
1. Ir a HSE → Capacitaciones → Nueva
2. Definir nombre y tipo
3. Establecer fechas
4. Asignar instructor
5. Agregar participantes
6. Guardar

## Screenshots

- `screenshots/dashboard.png` - Dashboard HSE
- `screenshots/incidentes-lista.png` - Lista de incidentes
- `screenshots/incidente-detalle.png` - Detalle de incidente
- `screenshots/inspecciones.png` - Lista de inspecciones
- `screenshots/capacitaciones.png` - Lista de capacitaciones
