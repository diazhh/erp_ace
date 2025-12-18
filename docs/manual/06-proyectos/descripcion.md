# 📁 Módulo de Proyectos - Descripción

## ¿Qué hace este módulo?

El módulo de **Proyectos** gestiona proyectos empresariales completos, incluyendo equipo de trabajo, hitos, gastos, actualizaciones, fotos y valuaciones. Soporta proyectos internos y contratados (outsourced).

## Funcionalidades Principales

### 1. Gestión de Proyectos
- **Crear** proyectos con presupuesto y fechas
- **Asignar** tipo de ejecución (interno/contratado)
- **Definir** prioridad y estado
- **Seguimiento** de progreso
- **Dashboard** con métricas

### 2. Equipo del Proyecto
- **Agregar miembros** del equipo
- **Asignar roles** (Gerente, Coordinador, Miembro, etc.)
- **Definir** fecha de inicio y fin de participación
- **Ver** historial de participación

### 3. Hitos (Milestones)
- **Crear hitos** con fechas objetivo
- **Asignar peso** porcentual al progreso
- **Marcar** como completados
- **Seguimiento** de hitos atrasados

### 4. Gastos del Proyecto
- **Registrar gastos** por categoría
- **Aprobar/Rechazar** gastos
- **Control** de presupuesto vs gastado
- **Adjuntar** comprobantes

### 5. Actualizaciones
- **Registrar avances** del proyecto
- **Tipos**: Avance, Problema, Decisión, etc.
- **Historial** cronológico

### 6. Fotos del Proyecto
- **Subir fotos** de avance
- **Categorizar** por tipo
- **Galería** visual del proyecto

### 7. Valuaciones (para proyectos contratados)
- **Crear valuaciones** de avance
- **Enviar** para aprobación
- **Aprobar/Rechazar** valuaciones
- **Generar facturas** desde valuaciones

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Project` | Proyecto principal |
| `ProjectMember` | Miembros del equipo |
| `ProjectMilestone` | Hitos del proyecto |
| `ProjectExpense` | Gastos del proyecto |
| `ProjectUpdate` | Actualizaciones de avance |
| `ProjectPhoto` | Fotos del proyecto |
| `ProjectValuation` | Valuaciones de avance |

## Estados del Proyecto

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PLANNING** | Azul claro | En planificación |
| **IN_PROGRESS** | Azul | En ejecución |
| **ON_HOLD** | Naranja | En espera/pausado |
| **COMPLETED** | Verde | Completado |
| **CANCELLED** | Rojo | Cancelado |

## Prioridades

| Prioridad | Color | Descripción |
|-----------|-------|-------------|
| **LOW** | Gris | Baja prioridad |
| **MEDIUM** | Azul | Prioridad media |
| **HIGH** | Naranja | Alta prioridad |
| **CRITICAL** | Rojo | Prioridad crítica |

## Tipos de Ejecución

| Tipo | Descripción |
|------|-------------|
| **INTERNAL** | Proyecto ejecutado con personal interno |
| **OUTSOURCED** | Proyecto ejecutado por contratista externo |

## Estados de Hito

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Gris | Pendiente de iniciar |
| **IN_PROGRESS** | Azul | En progreso |
| **COMPLETED** | Verde | Completado |
| **DELAYED** | Rojo | Atrasado |
| **CANCELLED** | Gris | Cancelado |

## Estados de Gasto

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente de aprobación |
| **APPROVED** | Verde | Aprobado |
| **REJECTED** | Rojo | Rechazado |
| **PAID** | Azul | Pagado |

## Estados de Valuación

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **SUBMITTED** | Azul claro | Enviada |
| **UNDER_REVIEW** | Naranja | En revisión |
| **APPROVED** | Verde | Aprobada |
| **REJECTED** | Rojo | Rechazada |
| **INVOICED** | Azul | Facturada |
| **PAID** | Verde | Pagada |

## Campos del Proyecto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único (PRJ-XXXXX) |
| `name` | String | Nombre del proyecto |
| `description` | Text | Descripción detallada |
| `executionType` | Enum | INTERNAL, OUTSOURCED |
| `status` | Enum | Estado del proyecto |
| `priority` | Enum | Prioridad |
| `startDate` | Date | Fecha de inicio |
| `endDate` | Date | Fecha de fin planificada |
| `actualEndDate` | Date | Fecha de fin real |
| `budget` | Decimal | Presupuesto total |
| `currency` | String | Moneda |
| `progress` | Integer | Porcentaje de avance (0-100) |
| `managerId` | UUID | Gerente del proyecto |
| `clientId` | UUID | Cliente (si aplica) |
| `contractorId` | UUID | Contratista (si outsourced) |
| `location` | String | Ubicación del proyecto |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        PROYECTOS                             │
│  (Equipo, Hitos, Gastos, Valuaciones, Fotos)                │
└─────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────┬───────────┼───────────┬─────────────┐
    │             │           │           │             │
    ▼             ▼           ▼           ▼             ▼
┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐
│EMPLEADOS│ │FINANZAS │  │INVENTARIO│ │  CRM   │  │DOCUMENTOS│
│- Equipo │  │- Gastos │  │- Materiales│ │-Cliente│  │- Adjuntos│
│- Gerente│  │- Pagos  │  │          │ │        │  │          │
└────────┘  └─────────┘  └─────────┘  └────────┘  └─────────┘
```

### Módulos Relacionados:
- **Empleados**: Miembros del equipo y gerente
- **Finanzas**: Gastos y pagos del proyecto
- **Inventario**: Materiales utilizados
- **CRM**: Cliente del proyecto
- **Documentos**: Archivos adjuntos
- **Contratistas**: Para proyectos outsourced

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/projects` | Lista | Lista de proyectos |
| `/projects/dashboard` | Dashboard | Dashboard de proyectos |
| `/projects/new` | Formulario | Crear proyecto |
| `/projects/:id` | Detalle | Detalle con tabs |
| `/projects/:id/edit` | Formulario | Editar proyecto |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `projects:read` | Ver proyectos |
| `projects:create` | Crear proyectos |
| `projects:update` | Editar proyectos |
| `projects:delete` | Eliminar proyectos |
| `projects:approve` | Aprobar gastos y valuaciones |

## Ejemplos de Uso

### Caso 1: Crear Proyecto Interno
1. Ir a Proyectos → Nuevo
2. Seleccionar tipo "Interno"
3. Completar nombre, fechas y presupuesto
4. Asignar gerente
5. Guardar
6. Agregar miembros del equipo
7. Crear hitos

### Caso 2: Gestionar Proyecto Contratado
1. Crear proyecto tipo "Contratado"
2. Asignar contratista
3. Definir hitos de entrega
4. Recibir valuaciones del contratista
5. Revisar y aprobar valuaciones
6. Generar facturas

### Caso 3: Seguimiento de Avance
1. Ir al detalle del proyecto
2. Revisar KPIs (presupuesto, progreso, hitos)
3. Ver actualizaciones recientes
4. Revisar fotos de avance
5. Verificar gastos vs presupuesto

## Screenshots

- `screenshots/lista.png` - Lista de proyectos
- `screenshots/dashboard.png` - Dashboard de proyectos
- `screenshots/detalle.png` - Detalle con tabs
- `screenshots/hitos.png` - Tab de hitos
- `screenshots/gastos.png` - Tab de gastos
- `screenshots/valuaciones.png` - Tab de valuaciones
