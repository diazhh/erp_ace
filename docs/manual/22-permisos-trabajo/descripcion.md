# 🔒 Módulo de Permisos de Trabajo - Descripción

## ¿Qué hace este módulo?

El módulo de **Permisos de Trabajo** (PTW - Permit to Work) gestiona los permisos requeridos para trabajos de alto riesgo. Incluye permisos de trabajo en caliente, espacios confinados, altura, excavaciones y otros.

## Funcionalidades Principales

### 1. Gestión de Permisos
- **Solicitar** permisos de trabajo
- **Flujo de aprobación** multinivel
- **Control** de vigencia
- **Cierre** de permisos

### 2. Tipos de Permiso
- **Trabajo en Caliente**: Soldadura, corte
- **Espacios Confinados**: Tanques, recipientes
- **Trabajo en Altura**: Andamios, techos
- **Excavaciones**: Zanjas, pozos
- **Eléctrico**: Trabajos eléctricos
- **General**: Otros trabajos de riesgo

### 3. Análisis de Riesgos
- **JSA** (Job Safety Analysis)
- **Identificación** de peligros
- **Medidas** de control

## Estados del Permiso

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **PENDING** | Naranja | Pendiente de aprobación |
| **APPROVED** | Verde | Aprobado |
| **ACTIVE** | Azul | En ejecución |
| **CLOSED** | Morado | Cerrado |
| **REJECTED** | Rojo | Rechazado |
| **EXPIRED** | Rojo | Vencido |

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/ptw` | Dashboard | Dashboard de permisos |
| `/ptw/permits` | Lista | Lista de permisos |
| `/ptw/permits/new` | Formulario | Solicitar permiso |
| `/ptw/permits/:id` | Detalle | Detalle del permiso |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `ptw:read` | Ver permisos |
| `ptw:create` | Solicitar permisos |
| `ptw:approve` | Aprobar permisos |
| `ptw:close` | Cerrar permisos |
