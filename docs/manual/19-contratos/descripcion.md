# 📜 Módulo de Contratos O&G - Descripción

## ¿Qué hace este módulo?

El módulo de **Contratos O&G** gestiona los contratos de operación petrolera, concesiones y acuerdos con socios. Permite administrar contratos de servicios, participaciones y obligaciones contractuales.

## Funcionalidades Principales

### 1. Gestión de Contratos
- **Registrar** contratos de operación
- **Definir** partes y participaciones
- **Control** de vigencia
- **Seguimiento** de obligaciones

### 2. Concesiones
- **Registrar** concesiones petroleras
- **Asociar** campos y bloques
- **Control** de vencimientos
- **Obligaciones** regulatorias

### 3. Participaciones
- **Definir** porcentajes de participación
- **Socios** operadores y no operadores
- **Distribución** de costos y producción

### 4. Dashboard de Contratos
- **KPIs**: Contratos activos, por vencer
- **Alertas**: Vencimientos próximos
- **Distribución** por tipo

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Contract` | Contratos de operación |
| `Concession` | Concesiones petroleras |
| `ContractParty` | Partes del contrato |
| `ContractObligation` | Obligaciones contractuales |

## Tipos de Contrato

| Tipo | Descripción |
|------|-------------|
| **SERVICE** | Contrato de servicios |
| **JOINT_VENTURE** | Asociación conjunta |
| **OPERATING** | Contrato de operación |
| **CONCESSION** | Concesión |

## Estados del Contrato

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **ACTIVE** | Verde | Vigente |
| **EXPIRED** | Rojo | Vencido |
| **TERMINATED** | Gris | Terminado |
| **SUSPENDED** | Naranja | Suspendido |

## Campos del Contrato

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre del contrato |
| `contractType` | Enum | Tipo de contrato |
| `startDate` | Date | Fecha de inicio |
| `endDate` | Date | Fecha de fin |
| `value` | Decimal | Valor del contrato |
| `currency` | String | Moneda |
| `status` | Enum | Estado |
| `parties` | Array | Partes involucradas |
| `description` | Text | Descripción |

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/contracts` | Dashboard | Dashboard de contratos |
| `/contracts/list` | Lista | Lista de contratos |
| `/contracts/new` | Formulario | Crear contrato |
| `/contracts/:id` | Detalle | Detalle del contrato |
| `/contracts/concessions` | Lista | Lista de concesiones |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `contracts:read` | Ver contratos |
| `contracts:create` | Crear contratos |
| `contracts:update` | Editar contratos |
| `contracts:delete` | Eliminar contratos |

## Screenshots

- `screenshots/dashboard.png` - Dashboard de contratos
- `screenshots/lista.png` - Lista de contratos
- `screenshots/detalle.png` - Detalle del contrato
