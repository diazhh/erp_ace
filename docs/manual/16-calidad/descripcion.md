# ✅ Módulo de Control de Calidad - Descripción

## ¿Qué hace este módulo?

El módulo de **Control de Calidad** gestiona los procesos de aseguramiento de calidad. Incluye planes de calidad, inspecciones, no conformidades, acciones correctivas y certificados.

## Funcionalidades Principales

### 1. Planes de Calidad
- **Crear** planes de calidad por proyecto/proceso
- **Definir** puntos de inspección
- **Establecer** criterios de aceptación
- **Seguimiento** de cumplimiento

### 2. Inspecciones
- **Programar** inspecciones
- **Ejecutar** con checklists
- **Registrar** resultados
- **Generar** no conformidades

### 3. No Conformidades (NC)
- **Registrar** desviaciones de calidad
- **Clasificar** por severidad
- **Investigar** causas raíz
- **Definir** acciones correctivas

### 4. Acciones Correctivas
- **Crear** acciones para resolver NC
- **Asignar** responsables
- **Seguimiento** de implementación
- **Verificar** efectividad

### 5. Certificados
- **Emitir** certificados de calidad
- **Control** de vigencia
- **Historial** de certificaciones

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `QualityPlan` | Planes de calidad |
| `QualityInspection` | Inspecciones |
| `NonConformance` | No conformidades |
| `CorrectiveAction` | Acciones correctivas |
| `QualityCertificate` | Certificados |

## Tipos de No Conformidad

| Tipo | Color | Descripción |
|------|-------|-------------|
| **MINOR** | Verde | Menor - Desviación leve |
| **MAJOR** | Naranja | Mayor - Desviación significativa |
| **CRITICAL** | Rojo | Crítica - Afecta seguridad/funcionalidad |

## Estados de No Conformidad

| Estado | Color | Descripción |
|--------|-------|-------------|
| **OPEN** | Rojo | Abierta |
| **IN_PROGRESS** | Naranja | En tratamiento |
| **PENDING_VERIFICATION** | Azul | Pendiente de verificación |
| **CLOSED** | Verde | Cerrada |
| **CANCELLED** | Gris | Cancelada |

## Estados de Inspección

| Estado | Color | Descripción |
|--------|-------|-------------|
| **SCHEDULED** | Azul | Programada |
| **IN_PROGRESS** | Naranja | En ejecución |
| **COMPLETED** | Verde | Completada |
| **CANCELLED** | Gris | Cancelada |

## Resultados de Inspección

| Resultado | Color | Descripción |
|-----------|-------|-------------|
| **PASS** | Verde | Aprobada |
| **FAIL** | Rojo | Rechazada |
| **CONDITIONAL** | Naranja | Aprobación condicional |

## Campos de No Conformidad

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (NC-XXXXX) |
| `title` | String | Título descriptivo |
| `description` | Text | Descripción detallada |
| `ncType` | Enum | MINOR, MAJOR, CRITICAL |
| `source` | String | Origen (inspección, auditoría, etc.) |
| `detectedDate` | Date | Fecha de detección |
| `detectedById` | UUID | Quien detectó |
| `responsibleId` | UUID | Responsable de resolver |
| `rootCause` | Text | Causa raíz |
| `status` | Enum | Estado |
| `projectId` | UUID | Proyecto asociado |

## Campos de Inspección

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `inspectionType` | String | Tipo de inspección |
| `scheduledDate` | Date | Fecha programada |
| `completedDate` | Date | Fecha de ejecución |
| `inspectorId` | UUID | Inspector |
| `result` | Enum | PASS, FAIL, CONDITIONAL |
| `findings` | Text | Hallazgos |
| `status` | Enum | Estado |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTROL DE CALIDAD                        │
│  (Planes, Inspecciones, NC, Acciones Correctivas)           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PROYECTOS    │    │     HSE       │    │   PROCURA     │
│ - Inspecciones│    │ - NC de       │    │ - Calidad de  │
│   del proyecto│    │   seguridad   │    │   proveedores │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/quality` | Dashboard | Dashboard de calidad |
| `/quality/inspections` | Lista | Lista de inspecciones |
| `/quality/inspections/new` | Formulario | Crear inspección |
| `/quality/inspections/:id` | Detalle | Detalle de inspección |
| `/quality/non-conformances` | Lista | Lista de NC |
| `/quality/non-conformances/new` | Formulario | Crear NC |
| `/quality/non-conformances/:id` | Detalle | Detalle de NC |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `quality:read` | Ver inspecciones y NC |
| `quality:create` | Crear inspecciones y NC |
| `quality:update` | Editar registros |
| `quality:delete` | Eliminar registros |
| `quality:approve` | Cerrar NC |

## Ejemplos de Uso

### Caso 1: Registrar No Conformidad
1. Ir a Calidad → No Conformidades → Nueva
2. Ingresar título y descripción
3. Clasificar severidad
4. Asignar responsable
5. Guardar

### Caso 2: Ejecutar Inspección
1. Ir a inspección programada
2. Clic en "Iniciar"
3. Completar checklist
4. Registrar hallazgos
5. Definir resultado
6. Completar

### Caso 3: Cerrar No Conformidad
1. Verificar acciones correctivas implementadas
2. Verificar efectividad
3. Documentar verificación
4. Cerrar NC

## Screenshots

- `screenshots/dashboard.png` - Dashboard de calidad
- `screenshots/inspecciones.png` - Lista de inspecciones
- `screenshots/nc-lista.png` - Lista de no conformidades
- `screenshots/nc-detalle.png` - Detalle de NC
