# ⚖️ Módulo de Compliance - Descripción

## ¿Qué hace este módulo?

El módulo de **Compliance** gestiona el cumplimiento regulatorio de la empresa. Incluye obligaciones legales, reportes regulatorios, auditorías y seguimiento de normativas.

## Funcionalidades Principales

### 1. Obligaciones Regulatorias
- **Registrar** obligaciones legales
- **Control** de fechas límite
- **Seguimiento** de cumplimiento
- **Alertas** de vencimiento

### 2. Reportes Regulatorios
- **Programar** reportes periódicos
- **Seguimiento** de entregas
- **Historial** de presentaciones

### 3. Auditorías
- **Programar** auditorías internas/externas
- **Registrar** hallazgos
- **Seguimiento** de acciones

## Estados de Obligación

| Estado | Color | Descripción |
|--------|-------|-------------|
| **PENDING** | Naranja | Pendiente |
| **IN_PROGRESS** | Azul | En proceso |
| **COMPLETED** | Verde | Cumplida |
| **OVERDUE** | Rojo | Vencida |

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/compliance` | Dashboard | Dashboard de compliance |
| `/compliance/obligations` | Lista | Obligaciones |
| `/compliance/reports` | Lista | Reportes regulatorios |
| `/compliance/audits` | Lista | Auditorías |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `compliance:read` | Ver obligaciones |
| `compliance:create` | Crear obligaciones |
| `compliance:update` | Editar obligaciones |
