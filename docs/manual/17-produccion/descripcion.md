# 🛢️ Módulo de Producción y Pozos - Descripción

## ¿Qué hace este módulo?

El módulo de **Producción y Pozos** gestiona las operaciones de producción de hidrocarburos. Incluye campos petroleros, pozos, producción diaria, asignaciones y análisis de tendencias.

## Funcionalidades Principales

### 1. Gestión de Campos
- **Registrar** campos petroleros
- **Definir** ubicación y características
- **Asociar** pozos al campo
- **Estadísticas** por campo

### 2. Gestión de Pozos
- **Registrar** pozos con datos técnicos
- **Estados**: Activo, Inactivo, Cerrado
- **Historial** de producción
- **Logs** de operaciones

### 3. Producción Diaria
- **Registrar** producción diaria por pozo
- **Petróleo, gas, agua** producidos
- **Cálculo** de corte de agua
- **Tendencias** de producción

### 4. Asignaciones (Allocations)
- **Distribuir** producción entre socios
- **Porcentajes** de participación
- **Reportes** de asignación

### 5. Dashboard de Producción
- **KPIs**: Producción total, pozos activos
- **Gráficos**: Tendencias, distribución
- **Alertas**: Pozos con baja producción

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Field` | Campos petroleros |
| `Well` | Pozos |
| `DailyProduction` | Producción diaria |
| `WellLog` | Logs de operaciones |
| `Allocation` | Asignaciones de producción |

## Estados del Pozo

| Estado | Color | Descripción |
|--------|-------|-------------|
| **ACTIVE** | Verde | Produciendo |
| **INACTIVE** | Naranja | Temporalmente inactivo |
| **CLOSED** | Rojo | Cerrado permanentemente |
| **DRILLING** | Azul | En perforación |
| **WORKOVER** | Morado | En workover |

## Tipos de Pozo

| Tipo | Descripción |
|------|-------------|
| **PRODUCER** | Pozo productor |
| **INJECTOR** | Pozo inyector |
| **OBSERVATION** | Pozo de observación |

## Campos de Producción Diaria

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `wellId` | UUID | Pozo |
| `productionDate` | Date | Fecha de producción |
| `oilProduction` | Decimal | Barriles de petróleo |
| `gasProduction` | Decimal | MCF de gas |
| `waterProduction` | Decimal | Barriles de agua |
| `hoursProduced` | Integer | Horas de producción |
| `choke` | String | Tamaño del choke |
| `pressure` | Decimal | Presión |
| `temperature` | Decimal | Temperatura |
| `notes` | Text | Observaciones |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCCIÓN Y POZOS                        │
│  (Campos, Pozos, Producción Diaria, Asignaciones)           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│     AFE       │    │  CONTRATOS    │    │     JIB       │
│ - Gastos de   │    │ - Operadores  │    │ - Distribución│
│   operación   │    │ - Socios      │    │   de costos   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/production` | Dashboard | Dashboard de producción |
| `/production/fields` | Lista | Lista de campos |
| `/production/fields/new` | Formulario | Crear campo |
| `/production/fields/:id` | Detalle | Detalle del campo |
| `/production/wells` | Lista | Lista de pozos |
| `/production/wells/new` | Formulario | Crear pozo |
| `/production/wells/:id` | Detalle | Detalle del pozo |
| `/production/daily` | Lista | Producción diaria |
| `/production/allocations` | Lista | Asignaciones |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `production:read` | Ver producción |
| `production:create` | Registrar producción |
| `production:update` | Editar registros |
| `production:delete` | Eliminar registros |

## Ejemplos de Uso

### Caso 1: Registrar Producción Diaria
1. Ir a Producción → Diaria → Nueva
2. Seleccionar pozo
3. Ingresar fecha
4. Registrar volúmenes (petróleo, gas, agua)
5. Guardar

### Caso 2: Analizar Tendencias
1. Ir al Dashboard de Producción
2. Seleccionar campo o pozo
3. Ver gráficos de tendencia
4. Identificar cambios en producción

## Screenshots

- `screenshots/dashboard.png` - Dashboard de producción
- `screenshots/pozos-lista.png` - Lista de pozos
- `screenshots/produccion-diaria.png` - Registro diario
