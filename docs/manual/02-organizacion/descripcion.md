# 🏢 Módulo de Organización - Descripción

## ¿Qué hace este módulo?

El módulo de **Organización** gestiona la estructura organizacional de la empresa. Permite definir departamentos jerárquicos, cargos/posiciones, visualizar el organigrama y consultar el directorio de empleados.

## Funcionalidades Principales

### 1. Gestión de Departamentos
- **Crear** departamentos con estructura jerárquica (padre/hijo)
- **Editar** información de departamentos
- **Eliminar** departamentos
- **Asignar manager** a cada departamento
- **Tipos de departamento**: Dirección, Gerencia, Departamento, Área, Unidad

### 2. Gestión de Posiciones/Cargos
- **Crear** cargos con niveles jerárquicos
- **Definir rangos salariales** por cargo
- **Establecer headcount máximo** por posición
- **Niveles**: Ejecutivo (0), Director (1), Gerente (2), Coordinador (3), Analista (4), Asistente (5), Operativo (6)
- **Marcar posiciones de supervisión**

### 3. Organigrama Interactivo
- **Vista por Departamentos**: Muestra la estructura de departamentos con sus managers
- **Vista por Jerarquía**: Muestra la cadena de mando (supervisor → subordinados)
- **Nodos expandibles/colapsables**
- **Navegación directa** a empleados y departamentos
- **Estadísticas**: Total empleados, departamentos, posiciones

### 4. Directorio de Empleados
- **Búsqueda** por nombre
- **Filtro alfabético** (A-Z)
- **Filtro por departamento**
- **Vista en grid** (tarjetas) o **lista**
- **Acceso rápido** a email y teléfono
- **Paginación**
- **Exportar a PDF**

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Department` | Departamentos con estructura jerárquica |
| `Position` | Cargos/Posiciones con niveles y rangos salariales |

## Campos de Departamento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único del departamento |
| `name` | String | Nombre del departamento |
| `description` | String | Descripción |
| `type` | Enum | DIRECTION, MANAGEMENT, DEPARTMENT, AREA, UNIT |
| `parentId` | UUID | Departamento padre (jerárquico) |
| `managerId` | UUID | Empleado que es manager |
| `location` | String | Ubicación física |
| `costCenter` | String | Centro de costo |
| `color` | String | Color para visualización (#hex) |
| `status` | Enum | ACTIVE, INACTIVE |

## Campos de Posición

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único del cargo |
| `name` | String | Nombre del cargo |
| `description` | String | Descripción del cargo |
| `departmentId` | UUID | Departamento al que pertenece |
| `level` | Integer | Nivel jerárquico (0-6) |
| `minSalary` | Decimal | Salario mínimo del rango |
| `maxSalary` | Decimal | Salario máximo del rango |
| `salaryCurrency` | String | Moneda (USD, VES, EUR) |
| `requirements` | Text | Requisitos del cargo |
| `responsibilities` | Text | Responsabilidades |
| `isSupervisory` | Boolean | Es cargo de supervisión |
| `maxHeadcount` | Integer | Cantidad máxima de empleados |
| `status` | Enum | ACTIVE, INACTIVE |

## Tipos de Departamento

| Tipo | Color | Descripción |
|------|-------|-------------|
| **DIRECTION** | Rojo | Nivel más alto (Dirección General) |
| **MANAGEMENT** | Naranja | Gerencias |
| **DEPARTMENT** | Azul | Departamentos |
| **AREA** | Celeste | Áreas dentro de departamentos |
| **UNIT** | Gris | Unidades operativas |

## Niveles de Posición

| Nivel | Nombre | Descripción |
|-------|--------|-------------|
| 0 | Ejecutivo | C-Level (CEO, CFO, etc.) |
| 1 | Director | Directores de área |
| 2 | Gerente | Gerentes de departamento |
| 3 | Coordinador | Coordinadores de equipo |
| 4 | Analista | Analistas y especialistas |
| 5 | Asistente | Asistentes y auxiliares |
| 6 | Operativo | Personal operativo |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                      ORGANIZACIÓN                            │
│  (Departamentos, Posiciones, Organigrama, Directorio)       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │   PROYECTOS   │    │    FLOTA      │
│ - Departamento│    │ - Asignación  │    │ - Asignación  │
│ - Cargo       │    │   por depto   │    │   por depto   │
│ - Supervisor  │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Cada empleado pertenece a un departamento y tiene un cargo
- **Nómina**: Los rangos salariales de posiciones guían la nómina
- **Proyectos**: Proyectos pueden asignarse por departamento
- **Flota**: Vehículos pueden asignarse a departamentos
- **Reportes**: Reportes por departamento

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/organization/departments` | Lista | Lista de departamentos |
| `/organization/departments/new` | Formulario | Crear departamento |
| `/organization/departments/:id` | Detalle | Detalle con tabs |
| `/organization/departments/:id/edit` | Formulario | Editar departamento |
| `/organization/positions` | Lista | Lista de posiciones |
| `/organization/positions/new` | Formulario | Crear posición |
| `/organization/positions/:id` | Detalle | Detalle de posición |
| `/organization/positions/:id/edit` | Formulario | Editar posición |
| `/organization/chart` | Organigrama | Vista interactiva |
| `/organization/directory` | Directorio | Directorio de empleados |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `organization:read` | Ver departamentos, posiciones, organigrama |
| `organization:create` | Crear departamentos y posiciones |
| `organization:update` | Editar departamentos y posiciones |
| `organization:delete` | Eliminar departamentos y posiciones |

## Ejemplos de Uso

### Caso 1: Crear Estructura Organizacional
1. Crear departamentos de nivel superior (Direcciones)
2. Crear departamentos hijos (Gerencias, Departamentos)
3. Asignar managers a cada departamento
4. Crear posiciones para cada departamento
5. Asignar empleados a departamentos y posiciones

### Caso 2: Consultar Organigrama
1. Ir a Organización → Organigrama
2. Seleccionar vista: Por Departamentos o Por Jerarquía
3. Expandir/colapsar nodos para ver estructura
4. Hacer clic en un empleado para ver su detalle

### Caso 3: Buscar Empleado en Directorio
1. Ir a Organización → Directorio
2. Usar búsqueda por nombre o filtro alfabético
3. Filtrar por departamento si es necesario
4. Hacer clic en el empleado para ver detalle
5. Usar botones de email/teléfono para contactar

## Screenshots

- `screenshots/departamentos-lista.png` - Lista de departamentos
- `screenshots/departamentos-detalle.png` - Detalle de departamento con tabs
- `screenshots/posiciones-lista.png` - Lista de posiciones
- `screenshots/organigrama-departamentos.png` - Vista por departamentos
- `screenshots/organigrama-jerarquia.png` - Vista por jerarquía
- `screenshots/directorio.png` - Directorio de empleados
