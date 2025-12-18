# 🚗 Módulo de Flota - Descripción

## ¿Qué hace este módulo?

El módulo de **Flota** gestiona los vehículos de la empresa, incluyendo asignaciones a empleados o proyectos, registro de combustible, mantenimientos y documentación vehicular.

## Funcionalidades Principales

### 1. Gestión de Vehículos
- **Crear** vehículos con datos completos
- **Registrar** marca, modelo, año, placa
- **Seguimiento** de kilometraje
- **Control** de documentos (seguro, revisión, etc.)
- **Estados**: Disponible, Asignado, En Mantenimiento, etc.

### 2. Asignaciones
- **Asignar** vehículos a empleados
- **Asignar** vehículos a proyectos
- **Registrar** propósito de la asignación
- **Finalizar** asignaciones con kilometraje final
- **Historial** de asignaciones

### 3. Registro de Combustible
- **Registrar** cargas de combustible
- **Seguimiento** de consumo
- **Cálculo** de rendimiento (km/litro)
- **Costos** de combustible

### 4. Mantenimientos
- **Programar** mantenimientos preventivos
- **Registrar** mantenimientos correctivos
- **Seguimiento** de costos
- **Alertas** de mantenimientos pendientes

### 5. Dashboard de Flota
- **KPIs**: Total vehículos, disponibles, en mantenimiento
- **Alertas**: Documentos por vencer, mantenimientos pendientes
- **Gráficos**: Costos, consumo de combustible

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Vehicle` | Vehículos de la flota |
| `VehicleAssignment` | Asignaciones a empleados/proyectos |
| `FuelLog` | Registros de combustible |
| `VehicleMaintenance` | Mantenimientos |
| `VehicleDocument` | Documentos del vehículo |

## Estados del Vehículo

| Estado | Color | Descripción |
|--------|-------|-------------|
| **AVAILABLE** | Verde | Disponible para asignar |
| **ASSIGNED** | Azul | Asignado a empleado/proyecto |
| **IN_MAINTENANCE** | Naranja | En mantenimiento |
| **OUT_OF_SERVICE** | Rojo | Fuera de servicio |
| **SOLD** | Gris | Vendido/dado de baja |

## Tipos de Asignación

| Tipo | Descripción |
|------|-------------|
| **EMPLOYEE** | Asignado a un empleado |
| **PROJECT** | Asignado a un proyecto |
| **DEPARTMENT** | Asignado a un departamento |

## Tipos de Mantenimiento

| Tipo | Descripción |
|------|-------------|
| **PREVENTIVE** | Mantenimiento preventivo programado |
| **CORRECTIVE** | Mantenimiento correctivo (reparación) |
| **INSPECTION** | Inspección técnica |

## Estados de Mantenimiento

| Estado | Color | Descripción |
|--------|-------|-------------|
| **SCHEDULED** | Azul | Programado |
| **IN_PROGRESS** | Naranja | En proceso |
| **COMPLETED** | Verde | Completado |
| **CANCELLED** | Gris | Cancelado |

## Campos del Vehículo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código interno |
| `plate` | String | Placa del vehículo |
| `brand` | String | Marca |
| `model` | String | Modelo |
| `year` | Integer | Año de fabricación |
| `color` | String | Color |
| `vehicleType` | String | Tipo (Sedan, Camioneta, etc.) |
| `fuelType` | String | Tipo de combustible |
| `mileage` | Integer | Kilometraje actual |
| `vin` | String | Número de serie |
| `status` | Enum | Estado del vehículo |
| `purchaseDate` | Date | Fecha de compra |
| `purchasePrice` | Decimal | Precio de compra |

## Campos de Asignación

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `vehicleId` | UUID | Vehículo asignado |
| `assignmentType` | Enum | EMPLOYEE, PROJECT, DEPARTMENT |
| `employeeId` | UUID | Empleado (si aplica) |
| `projectId` | UUID | Proyecto (si aplica) |
| `startDate` | Date | Fecha de inicio |
| `endDate` | Date | Fecha de fin |
| `startMileage` | Integer | Kilometraje inicial |
| `endMileage` | Integer | Kilometraje final |
| `purpose` | String | Propósito de la asignación |

## Campos de Combustible

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `vehicleId` | UUID | Vehículo |
| `date` | Date | Fecha de carga |
| `fuelType` | String | Tipo de combustible |
| `liters` | Decimal | Litros cargados |
| `pricePerLiter` | Decimal | Precio por litro |
| `totalCost` | Decimal | Costo total |
| `mileage` | Integer | Kilometraje al cargar |
| `station` | String | Estación de servicio |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                          FLOTA                               │
│  (Vehículos, Asignaciones, Combustible, Mantenimientos)     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │  PROYECTOS    │    │  INVENTARIO   │
│ - Asignación  │    │ - Asignación  │    │ - Repuestos   │
│   de vehículo │    │   de vehículo │    │ - Consumibles │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Asignación de vehículos a empleados
- **Proyectos**: Asignación de vehículos a proyectos
- **Inventario**: Repuestos y consumibles
- **Finanzas**: Costos de mantenimiento y combustible

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/fleet` | Dashboard | Dashboard de flota |
| `/fleet/vehicles` | Lista | Lista de vehículos |
| `/fleet/vehicles/new` | Formulario | Crear vehículo |
| `/fleet/vehicles/:id` | Detalle | Detalle con tabs |
| `/fleet/vehicles/:id/edit` | Formulario | Editar vehículo |
| `/fleet/fuel` | Lista | Registros de combustible |
| `/fleet/fuel/new` | Formulario | Registrar carga |
| `/fleet/maintenance` | Lista | Lista de mantenimientos |
| `/fleet/maintenance/new` | Formulario | Crear mantenimiento |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `fleet:read` | Ver vehículos y registros |
| `fleet:create` | Crear vehículos y registros |
| `fleet:update` | Editar vehículos |
| `fleet:delete` | Eliminar vehículos |
| `fleet:assign` | Asignar vehículos |

## Ejemplos de Uso

### Caso 1: Asignar Vehículo a Empleado
1. Ir al detalle del vehículo
2. Verificar que esté disponible
3. Clic en "Asignar"
4. Seleccionar tipo "Empleado"
5. Seleccionar empleado
6. Ingresar propósito y fecha
7. Guardar

### Caso 2: Registrar Carga de Combustible
1. Ir a Flota → Combustible → Nuevo
2. Seleccionar vehículo
3. Ingresar litros y precio
4. Registrar kilometraje actual
5. Guardar

### Caso 3: Programar Mantenimiento
1. Ir a Flota → Mantenimientos → Nuevo
2. Seleccionar vehículo
3. Seleccionar tipo (Preventivo/Correctivo)
4. Definir fecha programada
5. Agregar descripción del trabajo
6. Guardar

## Screenshots

- `screenshots/dashboard.png` - Dashboard de flota
- `screenshots/vehiculos-lista.png` - Lista de vehículos
- `screenshots/vehiculo-detalle.png` - Detalle con tabs
- `screenshots/combustible.png` - Registros de combustible
- `screenshots/mantenimientos.png` - Lista de mantenimientos
