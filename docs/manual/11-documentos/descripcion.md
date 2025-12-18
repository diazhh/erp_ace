# 📄 Módulo de Documentos - Descripción

## ¿Qué hace este módulo?

El módulo de **Documentos** gestiona el repositorio documental de la empresa. Permite almacenar, categorizar, versionar y controlar documentos con flujos de aprobación y control de vencimientos.

## Funcionalidades Principales

### 1. Gestión de Documentos
- **Subir** documentos de cualquier tipo
- **Categorizar** por tipo y categoría
- **Versionar** documentos
- **Buscar** por nombre, tipo o contenido
- **Descargar** documentos

### 2. Flujo de Aprobación
- **Enviar** para revisión
- **Aprobar/Rechazar** documentos
- **Historial** de revisiones

### 3. Control de Vencimientos
- **Definir** fecha de vencimiento
- **Alertas** de documentos por vencer
- **Renovación** de documentos

### 4. Categorías
- **Crear** categorías jerárquicas
- **Organizar** documentos por categoría
- **Permisos** por categoría

### 5. Dashboard de Documentos
- **KPIs**: Total documentos, pendientes, vencidos
- **Alertas**: Documentos por vencer
- **Actividad reciente**

## Entidades que Maneja

| Entidad | Descripción |
|---------|-------------|
| `Document` | Documentos del repositorio |
| `DocumentVersion` | Versiones de documentos |
| `DocumentCategory` | Categorías de documentos |
| `DocumentReview` | Revisiones y aprobaciones |

## Estados del Documento

| Estado | Color | Descripción |
|--------|-------|-------------|
| **DRAFT** | Gris | Borrador |
| **PENDING_REVIEW** | Naranja | Pendiente de revisión |
| **APPROVED** | Verde | Aprobado |
| **REJECTED** | Rojo | Rechazado |
| **EXPIRED** | Rojo | Vencido |
| **ARCHIVED** | Azul | Archivado |
| **CANCELLED** | Gris | Cancelado |

## Tipos de Documento

| Tipo | Descripción |
|------|-------------|
| **POLICY** | Políticas |
| **PROCEDURE** | Procedimientos |
| **MANUAL** | Manuales |
| **FORM** | Formularios |
| **CONTRACT** | Contratos |
| **CERTIFICATE** | Certificados |
| **REPORT** | Reportes |
| **OTHER** | Otros |

## Campos del Documento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `title` | String | Título del documento |
| `description` | Text | Descripción |
| `documentType` | Enum | Tipo de documento |
| `categoryId` | UUID | Categoría |
| `version` | String | Versión actual |
| `effectiveDate` | Date | Fecha de vigencia |
| `expirationDate` | Date | Fecha de vencimiento |
| `ownerId` | UUID | Propietario/responsable |
| `status` | Enum | Estado |
| `filePath` | String | Ruta del archivo |
| `fileSize` | Integer | Tamaño en bytes |
| `mimeType` | String | Tipo de archivo |

## Campos de Categoría

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único |
| `name` | String | Nombre de la categoría |
| `description` | Text | Descripción |
| `parentId` | UUID | Categoría padre |
| `status` | Enum | ACTIVE, INACTIVE |

## Relaciones con Otros Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                       DOCUMENTOS                             │
│  (Documentos, Versiones, Categorías, Revisiones)            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   EMPLEADOS   │    │  PROYECTOS    │    │     HSE       │
│ - Documentos  │    │ - Documentos  │    │ - Documentos  │
│   personales  │    │   del proyecto│    │   de seguridad│
└───────────────┘    └───────────────┘    └───────────────┘
```

### Módulos Relacionados:
- **Empleados**: Documentos personales de empleados
- **Proyectos**: Documentación de proyectos
- **HSE**: Documentos de seguridad
- **Procura**: Contratos y documentos de proveedores

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/documents` | Dashboard | Dashboard de documentos |
| `/documents/list` | Lista | Lista de documentos |
| `/documents/new` | Formulario | Subir documento |
| `/documents/:id` | Detalle | Detalle del documento |
| `/documents/:id/edit` | Formulario | Editar documento |
| `/documents/categories` | Lista | Lista de categorías |
| `/documents/categories/new` | Formulario | Crear categoría |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `documents:read` | Ver documentos |
| `documents:create` | Subir documentos |
| `documents:update` | Editar documentos |
| `documents:delete` | Eliminar documentos |
| `documents:approve` | Aprobar/rechazar documentos |

## Ejemplos de Uso

### Caso 1: Subir Documento
1. Ir a Documentos → Nuevo
2. Seleccionar archivo
3. Completar título y descripción
4. Seleccionar tipo y categoría
5. Definir fecha de vencimiento (si aplica)
6. Guardar

### Caso 2: Aprobar Documento
1. Ir a documentos pendientes de revisión
2. Revisar contenido del documento
3. Aprobar o rechazar con comentarios
4. El documento cambia de estado

### Caso 3: Renovar Documento Vencido
1. Ver alertas de documentos vencidos
2. Subir nueva versión del documento
3. Actualizar fecha de vencimiento
4. Enviar para aprobación

## Screenshots

- `screenshots/dashboard.png` - Dashboard de documentos
- `screenshots/lista.png` - Lista de documentos
- `screenshots/detalle.png` - Detalle del documento
- `screenshots/categorias.png` - Lista de categorías
