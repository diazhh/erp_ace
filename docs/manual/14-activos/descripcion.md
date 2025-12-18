# 🏢 Módulo de Activos Fijos - Descripción

## ¿Qué hace este módulo?

El módulo de **Activos Fijos** gestiona los bienes de capital de la empresa. Permite registrar activos, controlar depreciación, asignaciones, mantenimientos y bajas.

## Funcionalidades Principales

### 1. Gestión de Activos
- **Registrar** activos con datos completos
- **Categorizar** por tipo
- **Asignar** a empleados o ubicaciones
- **Controlar** estado y condición
- **Dar de baja** activos

### 2. Depreciación
- **Calcular** depreciación automática
- **Métodos**: Línea recta, saldos decrecientes
- **Valor en libros** actualizado
- **Reportes** de depreciación

### 3. Asignaciones
- **Asignar** a empleados
- **Asignar** a ubicaciones/departamentos
- **Historial** de asignaciones
- **Transferencias** entre responsables

### 4. Mantenimientos
- **Programar** mantenimientos
- **Registrar** reparaciones
- **Costos** de mantenimiento
- **Historial** de intervenciones

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Asset` | Activos fijos |
| `AssetCategory` | Categorías de activos |
| `AssetAssignment` | Asignaciones |
| `AssetMaintenance` | Mantenimientos |
| `AssetDepreciation` | Registros de depreciación |

## Estados del Activo

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | En uso |
| **IN_MAINTENANCE** | Naranja | En mantenimiento |
| **STORED** | Azul | Almacenado |
| **DISPOSED** | Gris | Dado de baja |
| **SOLD** | Gris | Vendido |
| **LOST** | Rojo | Perdido |
| **DAMAGED** | Rojo | Dañado |

## Condición del Activo

| Condición | Descripción |
|-----------|-------------|
| **EXCELLENT** | Excelente estado |
| **GOOD** | Buen estado |
| **FAIR** | Estado regular |
| **POOR** | Mal estado |

## Campos del Activo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre del activo |
| `description` | Text | Descripción |
| `categoryId` | UUID | Categoría |
| `serialNumber` | String | Número de serie |
| `brand` | String | Marca |
| `model` | String | Modelo |
| `purchaseDate` | Date | Fecha de compra |
| `purchasePrice` | Decimal | Precio de compra |
| `currentValue` | Decimal | Valor actual |
| `usefulLife` | Integer | Vida útil (meses) |
| `depreciationMethod` | Enum | Método de depreciación |
| `status` | Enum | Estado |
| `condition` | Enum | Condición física |
| `location` | String | Ubicación |
| `assignedToId` | UUID | Empleado asignado |

## Métodos de Depreciación

| Método | Descripción |
|--------|-------------|
| **STRAIGHT_LINE** | Línea recta (constante) |
| **DECLINING_BALANCE** | Saldos decrecientes |
| **NONE** | Sin depreciación |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                      ACTIVOS FIJOS                           │
│  (Activos, Categorías, Asignaciones, Depreciación)          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │   FINANZAS    │    │  ORGANIZACIÓN │
│ - Asignación  │    │ - Depreciación│    │ - Ubicación   │
│   de activos  │    │ - Valor       │    │   por depto   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/assets` | Lista | Lista de activos |
| `/assets/new` | Formulario | Crear activo |
| `/assets/:id` | Detalle | Detalle del activo |
| `/assets/:id/edit` | Formulario | Editar activo |
| `/assets/categories` | Lista | Categorías |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `assets:read` | Ver activos |
| `assets:create` | Crear activos |
| `assets:update` | Editar activos |
| `assets:delete` | Eliminar activos |
| `assets:assign` | Asignar activos |
| `assets:dispose` | Dar de baja |

## Ejemplos de Uso

### Caso 1: Registrar Nuevo Activo
1. Ir a Activos → Nuevo
2. Completar datos del activo
3. Definir valor y vida útil
4. Seleccionar método de depreciación
5. Guardar

### Caso 2: Asignar Activo a Empleado
1. Ir al detalle del activo
2. Clic en "Asignar"
3. Seleccionar empleado
4. Definir fecha de asignación
5. Guardar

### Caso 3: Dar de Baja Activo
1. Ir al detalle del activo
2. Clic en "Dar de Baja"
3. Seleccionar motivo
4. Documentar la baja
5. Confirmar

## Screenshots

- `screenshots/lista.png` - Lista de activos
- `screenshots/detalle.png` - Detalle del activo
- `screenshots/categorias.png` - Categorías
