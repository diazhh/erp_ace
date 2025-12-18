# 🛢️ Producción y Pozos

## ¿Qué es este módulo?

El módulo de **Producción** permite gestionar las operaciones de producción petrolera: campos, pozos, producción diaria y asignaciones. Es específico para empresas del sector de hidrocarburos y permite controlar la producción de petróleo y gas.

Piense en este módulo como su "centro de control de producción": registra campos y pozos, monitorea la producción diaria y genera reportes de rendimiento.

## ¿Para quién es útil?

- **Ingenieros de Producción**: Para registrar y monitorear producción
- **Operadores de Campo**: Para reportar producción diaria
- **Gerencia de Operaciones**: Para analizar rendimiento
- **Planificación**: Para proyectar producción futura

## ¿Qué puedo hacer aquí?

### Gestión de Campos
- **Registrar campos** petroleros
- **Clasificar por tipo** (onshore/offshore)
- **Asociar pozos** a cada campo
- **Monitorear producción** por campo

### Gestión de Pozos
- **Registrar pozos** con características técnicas
- **Clasificar por tipo** (productor, inyector, observación)
- **Controlar estado** (activo, inactivo, cerrado)
- **Historial de intervenciones**

### Producción Diaria
- **Registrar producción** de petróleo, gas y agua
- **Reportes diarios** por pozo y campo
- **Análisis de tendencias**
- **Alertas de desviaciones**

### Asignaciones
- **Asignar producción** a socios o contratos
- **Calcular participaciones**
- **Reportes de asignación**

## Conceptos Importantes

### Tipos de Campo

| Tipo | Descripción |
|------|-------------|
| **Onshore** | Campo terrestre |
| **Offshore** | Campo marino |

### Estados del Campo

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Activo** | En producción | Verde |
| **Inactivo** | Sin producción temporal | Gris |
| **En Desarrollo** | En construcción | Amarillo |
| **Abandonado** | Cerrado permanentemente | Rojo |

### Tipos de Pozo

| Tipo | Descripción | Color |
|------|-------------|-------|
| **Productor** | Extrae hidrocarburos | Verde |
| **Inyector** | Inyecta agua o gas | Azul |
| **Observación** | Monitoreo de yacimiento | Gris |
| **Disposición** | Disposición de agua | Amarillo |
| **Exploración** | Pozo exploratorio | Púrpura |

### Estados del Pozo

| Estado | Descripción |
|--------|-------------|
| **Activo** | Produciendo o inyectando |
| **Inactivo** | Temporalmente cerrado |
| **Cerrado** | Shut-in |
| **Abandonado** | Cerrado permanentemente |
| **Perforando** | En perforación |
| **Completando** | En completación |
| **Workover** | En intervención |

### Clasificación del Pozo

| Clasificación | Descripción |
|---------------|-------------|
| **Petróleo** | Principalmente produce petróleo |
| **Gas** | Principalmente produce gas |
| **Mixto** | Produce ambos |

### Producción Diaria

Cada registro de producción incluye:
- **Fecha**: Día de producción
- **Pozo**: Pozo que produjo
- **Petróleo**: Barriles de petróleo (BOPD)
- **Gas**: Miles de pies cúbicos (MCFD)
- **Agua**: Barriles de agua (BWPD)
- **Horas**: Horas de operación

## Relación con Otros Módulos

El módulo de Producción se conecta con:

- **Proyectos**: Los campos y pozos pueden asociarse a proyectos.

- **Finanzas**: La producción genera ingresos por ventas.

- **HSE**: Incidentes y inspecciones en campos y pozos.

- **Mantenimiento**: Intervenciones y workovers de pozos.

- **Contratos**: Asignación de producción según contratos.
