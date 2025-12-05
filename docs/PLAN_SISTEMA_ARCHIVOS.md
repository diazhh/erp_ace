# 📎 Plan de Sistema de Archivos e Imágenes

**Fecha:** 2025-12-05  
**Versión:** 1.0  
**Estado:** Planificación

---

## 📊 Resumen Ejecutivo

El ERP necesita un sistema centralizado de gestión de archivos que permita:
- Subir y almacenar imágenes y documentos
- Asociar archivos a cualquier entidad del sistema
- Visualizar archivos en galerías y previews
- Mantener trazabilidad de quién subió cada archivo

---

## 🔍 Análisis del Estado Actual

### Campos Existentes (solo URLs, sin upload real)

| Modelo | Campo | Tipo | Descripción |
|--------|-------|------|-------------|
| `ProjectPhoto` | `photoUrl` | STRING | Modelo completo para fotos |
| `Transaction` | `attachments` | JSONB[] | Array de URLs |
| `PettyCashEntry` | `receiptImageUrl` | STRING | URL del recibo |
| `Incident` | `photos` | JSONB[] | Array de URLs |
| `Inspection` | `photos` | JSONB[] | Array de URLs |
| `Quote` | `fileUrl` | STRING | Documento de cotización |
| `ContractorPayment` | `receiptUrl` | STRING | Comprobante de pago |

### Problema Actual
- No hay sistema de upload real
- Solo se almacenan URLs externas
- No hay validación de archivos
- No hay thumbnails automáticos
- No hay trazabilidad de uploads

---

## 🎯 Entidades que Requieren Archivos

### Prioridad Alta (Operaciones Diarias)

| Módulo | Entidad | Tipos de Archivo | Casos de Uso |
|--------|---------|------------------|--------------|
| **Finanzas** | `Transaction` | Comprobantes, facturas, transferencias | Evidencia de pagos e ingresos |
| **Caja Chica** | `PettyCashEntry` | Recibos, facturas, tickets | Justificación de gastos |
| **Flota** | `VehicleMaintenance` | Facturas, fotos antes/después, presupuestos | Registro de mantenimientos |
| **Flota** | `FuelLog` | Recibos de combustible | Comprobante de carga |
| **Proyectos** | `ContractorPayment` | Comprobantes de pago, transferencias | Evidencia de pagos a contratistas |
| **Proyectos** | `ProjectExpense` | Facturas, recibos | Justificación de gastos del proyecto |
| **Proyectos** | `ProjectPhoto` | Fotos de avance | Ya existe modelo, mejorar upload |
| **HSE** | `Incident` | Fotos del incidente, informes | Evidencia y documentación |
| **HSE** | `Inspection` | Fotos de inspección, checklists | Registro de hallazgos |

### Prioridad Media

| Módulo | Entidad | Tipos de Archivo | Casos de Uso |
|--------|---------|------------------|--------------|
| **Procura** | `Quote` | Documento de cotización PDF | Archivo de cotizaciones |
| **Procura** | `PurchaseOrder` | OC firmada, documentos | Archivo de órdenes |
| **Contratistas** | `ContractorInvoice` | Factura del contratista | Archivo de facturas |
| **Inventario** | `InventoryMovement` | Guías, notas de entrega | Trazabilidad de movimientos |

### Prioridad Baja

| Módulo | Entidad | Tipos de Archivo | Casos de Uso |
|--------|---------|------------------|--------------|
| **Nómina** | `LoanPayment` | Comprobante de pago | Evidencia de pagos de préstamos |
| **Empleados** | `EmployeeDocument` | Ya tiene sistema propio | Mejorar con upload |

---

## 🏗️ Arquitectura Propuesta

### Opción A: Modelo Centralizado (Recomendada)

```
┌─────────────────────────────────────────────────────────────┐
│                    Attachment (Tabla Central)                │
├─────────────────────────────────────────────────────────────┤
│ id, entityType, entityId, fileUrl, thumbnailUrl, fileName,  │
│ fileSize, mimeType, category, uploadedBy, createdAt         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Transaction          PettyCashEntry       VehicleMaintenance
   (entityType:         (entityType:         (entityType:
    'transaction')       'petty_cash_entry')  'vehicle_maintenance')
```

### Ventajas del Modelo Centralizado
1. **Una sola tabla** para todos los archivos
2. **Queries simples** por entityType + entityId
3. **Reutilización** de componentes y servicios
4. **Estadísticas** globales de almacenamiento
5. **Limpieza** centralizada de archivos huérfanos

### Modelo Attachment

```javascript
const Attachment = sequelize.define('Attachment', {
  id: { type: UUID, primaryKey: true },
  
  // Entidad relacionada (polimórfico)
  entityType: { 
    type: ENUM('transaction', 'petty_cash_entry', 'vehicle_maintenance', 
               'fuel_log', 'contractor_payment', 'project_expense',
               'project_photo', 'incident', 'inspection', 'quote',
               'purchase_order', 'contractor_invoice', 'inventory_movement',
               'loan_payment', 'employee_document'),
    allowNull: false 
  },
  entityId: { type: UUID, allowNull: false },
  
  // Información del archivo
  fileName: { type: STRING(255), allowNull: false },
  originalName: { type: STRING(255), allowNull: false },
  fileSize: { type: INTEGER, allowNull: false }, // bytes
  mimeType: { type: STRING(100), allowNull: false },
  fileUrl: { type: STRING(500), allowNull: false },
  thumbnailUrl: { type: STRING(500), allowNull: true },
  
  // Categorización
  category: {
    type: ENUM('RECEIPT', 'INVOICE', 'PHOTO', 'DOCUMENT', 
               'BEFORE', 'AFTER', 'EVIDENCE', 'OTHER'),
    defaultValue: 'OTHER'
  },
  description: { type: STRING(500), allowNull: true },
  
  // Metadatos
  metadata: { type: JSONB, defaultValue: {} }, // EXIF, dimensiones, etc.
  
  // Auditoría
  uploadedBy: { type: UUID, allowNull: false },
  
  // Orden
  sortOrder: { type: INTEGER, defaultValue: 0 }
}, {
  tableName: 'attachments',
  timestamps: true,
  indexes: [
    { fields: ['entity_type', 'entity_id'] },
    { fields: ['uploaded_by'] },
    { fields: ['category'] },
    { fields: ['mime_type'] }
  ]
});
```

---

## 📁 Estructura de Almacenamiento

### Desarrollo (Local)
```
backend/
└── uploads/
    ├── transactions/
    │   └── {year}/{month}/{uuid}.{ext}
    ├── petty-cash/
    │   └── {year}/{month}/{uuid}.{ext}
    ├── fleet/
    │   ├── maintenance/
    │   └── fuel/
    ├── projects/
    │   ├── expenses/
    │   └── photos/
    ├── hse/
    │   ├── incidents/
    │   └── inspections/
    └── thumbnails/
        └── {uuid}_thumb.{ext}
```

### Producción (S3 Compatible)
```
s3://erp-attachments/
├── transactions/
├── petty-cash/
├── fleet/
├── projects/
├── hse/
└── thumbnails/
```

---

## 🔧 Implementación Backend

### Fase 1: Infraestructura (Sprint 1)

#### 1.1 Modelo Attachment
```bash
# Crear modelo
backend/src/modules/attachments/models/Attachment.js

# Migración
backend/src/database/migrations/20251205-create-attachments.js
```

#### 1.2 Servicio de Upload
```javascript
// backend/src/modules/attachments/services/uploadService.js

const multer = require('multer');
const sharp = require('sharp'); // Para thumbnails
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entityType = req.params.entityType || 'general';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const dir = `uploads/${entityType}/${year}/${month}`;
    // Crear directorio si no existe
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Límites
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 10 // máximo 10 archivos por request
};

module.exports = {
  upload: multer({ storage, fileFilter, limits }),
  generateThumbnail: async (filePath) => {
    // Generar thumbnail para imágenes
  }
};
```

#### 1.3 Controlador de Attachments
```javascript
// backend/src/modules/attachments/controllers/attachmentController.js

// POST /api/attachments/:entityType/:entityId
// GET /api/attachments/:entityType/:entityId
// DELETE /api/attachments/:id
// GET /api/attachments/:id/download
```

#### 1.4 Rutas
```javascript
// backend/src/modules/attachments/routes/attachmentRoutes.js

router.post('/:entityType/:entityId', 
  authenticate, 
  upload.array('files', 10),
  attachmentController.upload
);

router.get('/:entityType/:entityId',
  authenticate,
  attachmentController.getByEntity
);

router.delete('/:id',
  authenticate,
  authorize('attachments:delete'),
  attachmentController.delete
);
```

### Fase 2: Integración por Módulo (Sprint 2-3)

Para cada entidad, agregar:
1. Relación virtual con Attachment
2. Endpoint en controlador existente para obtener attachments
3. Hook para eliminar attachments al eliminar entidad

```javascript
// Ejemplo en transactionController.js
const getById = async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  const attachments = await Attachment.findAll({
    where: { entityType: 'transaction', entityId: req.params.id }
  });
  res.json({ ...transaction.toJSON(), attachments });
};
```

---

## 🎨 Implementación Frontend

### Componentes a Crear

#### 1. FileUpload (Componente de Subida)
```jsx
// frontend/src/components/common/FileUpload.jsx

import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, IconButton } from '@mui/material';
import { CloudUpload, Delete, InsertDriveFile } from '@mui/icons-material';

const FileUpload = ({ 
  entityType, 
  entityId, 
  maxFiles = 10,
  accept = { 'image/*': [], 'application/pdf': [] },
  onUploadComplete 
}) => {
  // Implementación con react-dropzone
};
```

#### 2. AttachmentGallery (Galería de Archivos)
```jsx
// frontend/src/components/common/AttachmentGallery.jsx

const AttachmentGallery = ({ 
  attachments, 
  onDelete, 
  canDelete = true,
  columns = { xs: 2, sm: 3, md: 4 }
}) => {
  // Grid de thumbnails con lightbox para imágenes
  // Lista para documentos
};
```

#### 3. AttachmentPreview (Preview Individual)
```jsx
// frontend/src/components/common/AttachmentPreview.jsx

const AttachmentPreview = ({ attachment, onClose }) => {
  // Modal con imagen grande o visor de PDF
};
```

#### 4. AttachmentList (Lista de Archivos)
```jsx
// frontend/src/components/common/AttachmentList.jsx

const AttachmentList = ({ attachments, onDelete }) => {
  // Lista con iconos, nombres y acciones
};
```

### Integración en Formularios Existentes

```jsx
// Ejemplo en PettyCashEntryForm.jsx

<Grid item xs={12}>
  <Typography variant="subtitle2" gutterBottom>
    {t('pettyCash.attachments')}
  </Typography>
  <FileUpload
    entityType="petty_cash_entry"
    entityId={entryId}
    accept={{ 'image/*': [], 'application/pdf': [] }}
    maxFiles={5}
    onUploadComplete={handleAttachmentsChange}
  />
  {attachments.length > 0 && (
    <AttachmentGallery
      attachments={attachments}
      onDelete={handleDeleteAttachment}
    />
  )}
</Grid>
```

---

## 📋 Plan de Ejecución

### Sprint 1: Infraestructura (3-4 días)
- [ ] Crear modelo Attachment
- [ ] Crear migración
- [ ] Implementar servicio de upload (multer)
- [ ] Implementar generación de thumbnails (sharp)
- [ ] Crear controlador y rutas
- [ ] Agregar permisos `attachments:*`
- [ ] Pruebas de API

### Sprint 2: Frontend Base (2-3 días)
- [ ] Componente FileUpload con drag & drop
- [ ] Componente AttachmentGallery
- [ ] Componente AttachmentPreview (lightbox)
- [ ] Slice de Redux para attachments
- [ ] Traducciones i18n

### Sprint 3: Integración Módulos Prioritarios (4-5 días)
- [ ] **Caja Chica** - PettyCashEntry
- [ ] **Finanzas** - Transaction
- [ ] **Flota** - VehicleMaintenance, FuelLog
- [ ] **Proyectos** - ContractorPayment, ProjectExpense
- [ ] **HSE** - Incident, Inspection

### Sprint 4: Integración Módulos Secundarios (2-3 días)
- [ ] **Procura** - Quote, PurchaseOrder
- [ ] **Contratistas** - ContractorInvoice
- [ ] **Inventario** - InventoryMovement

### Sprint 5: Mejoras y Optimización (2 días)
- [ ] Migrar ProjectPhoto al sistema centralizado
- [ ] Limpieza de archivos huérfanos
- [ ] Compresión de imágenes
- [ ] Lazy loading de galerías

---

## 🔐 Seguridad

### Validaciones
1. **Tipo de archivo**: Solo permitir tipos específicos
2. **Tamaño máximo**: 10MB por archivo
3. **Cantidad máxima**: 10 archivos por request
4. **Sanitización**: Renombrar archivos con UUID
5. **Permisos**: Verificar acceso a la entidad padre

### Permisos RBAC
```javascript
// Nuevos permisos
'attachments:create'  // Subir archivos
'attachments:read'    // Ver archivos
'attachments:delete'  // Eliminar archivos
```

---

## 📦 Dependencias Nuevas

### Backend
```json
{
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.33.0",
  "mime-types": "^2.1.35"
}
```

### Frontend
```json
{
  "react-dropzone": "^14.2.3",
  "react-image-lightbox": "^5.1.4"
}
```

---

## 📈 Métricas de Éxito

1. **Funcionalidad**: Todas las entidades prioritarias con upload funcional
2. **UX**: Upload con drag & drop y preview instantáneo
3. **Performance**: Thumbnails generados automáticamente
4. **Trazabilidad**: Cada archivo con registro de quién lo subió

---

## 🚀 Próximos Pasos

1. Revisar y aprobar este plan
2. Crear rama `feature/attachment-system`
3. Comenzar Sprint 1: Infraestructura Backend
