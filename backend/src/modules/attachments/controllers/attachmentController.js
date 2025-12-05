const AttachmentService = require('../services/attachmentService');
const { upload } = require('../services/uploadService');
const models = require('../../../database/models');

const attachmentService = new AttachmentService(models);

/**
 * Sube archivos para una entidad
 * POST /api/attachments/:entityType/:entityId
 */
const uploadFiles = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { category, description } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se han proporcionado archivos',
      });
    }

    const attachments = await attachmentService.createMany(
      { entityType, entityId, category, description },
      req.files,
      userId
    );

    res.status(201).json({
      success: true,
      message: `${attachments.length} archivo(s) subido(s) correctamente`,
      data: attachments,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al subir archivos',
    });
  }
};

/**
 * Sube un solo archivo
 * POST /api/attachments/:entityType/:entityId/single
 */
const uploadSingle = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { category, description } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado archivo',
      });
    }

    const attachment = await attachmentService.create(
      { entityType, entityId, category, description },
      req.file,
      userId
    );

    res.status(201).json({
      success: true,
      message: 'Archivo subido correctamente',
      data: attachment,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al subir archivo',
    });
  }
};

/**
 * Obtiene attachments de una entidad
 * GET /api/attachments/:entityType/:entityId
 */
const getByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { category } = req.query;

    const attachments = await attachmentService.getByEntity(entityType, entityId, { category });

    res.json({
      success: true,
      data: attachments,
      count: attachments.length,
    });
  } catch (error) {
    console.error('Error getting attachments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener archivos',
    });
  }
};

/**
 * Obtiene un attachment por ID
 * GET /api/attachments/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const attachment = await attachmentService.getById(id);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
      });
    }

    res.json({
      success: true,
      data: attachment,
    });
  } catch (error) {
    console.error('Error getting attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener archivo',
    });
  }
};

/**
 * Actualiza un attachment
 * PUT /api/attachments/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, sortOrder } = req.body;

    const attachment = await attachmentService.update(id, {
      category,
      description,
      sortOrder,
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Archivo actualizado correctamente',
      data: attachment,
    });
  } catch (error) {
    console.error('Error updating attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar archivo',
    });
  }
};

/**
 * Elimina un attachment
 * DELETE /api/attachments/:id
 */
const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    const deleted = await attachmentService.delete(id, hard === 'true');

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Archivo eliminado correctamente',
    });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar archivo',
    });
  }
};

/**
 * Elimina todos los attachments de una entidad
 * DELETE /api/attachments/:entityType/:entityId
 */
const deleteByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { hard } = req.query;

    const count = await attachmentService.deleteByEntity(entityType, entityId, hard === 'true');

    res.json({
      success: true,
      message: `${count} archivo(s) eliminado(s)`,
      count,
    });
  } catch (error) {
    console.error('Error deleting attachments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar archivos',
    });
  }
};

/**
 * Reordena attachments
 * PUT /api/attachments/reorder
 */
const reorder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de items con id y sortOrder',
      });
    }

    await attachmentService.reorder(items);

    res.json({
      success: true,
      message: 'Orden actualizado correctamente',
    });
  } catch (error) {
    console.error('Error reordering attachments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reordenar archivos',
    });
  }
};

/**
 * Obtiene estadísticas de attachments
 * GET /api/attachments/stats
 */
const getStats = async (req, res) => {
  try {
    const { entityType, startDate, endDate } = req.query;

    const stats = await attachmentService.getStats({
      entityType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
    });
  }
};

/**
 * Obtiene catálogos de attachments
 * GET /api/attachments/catalogs
 */
const getCatalogs = async (req, res) => {
  try {
    const catalogs = {
      entityTypes: [
        { value: 'transaction', label: 'Transacción' },
        { value: 'petty_cash_entry', label: 'Movimiento de Caja Chica' },
        { value: 'vehicle_maintenance', label: 'Mantenimiento de Vehículo' },
        { value: 'fuel_log', label: 'Registro de Combustible' },
        { value: 'contractor_payment', label: 'Pago a Contratista' },
        { value: 'project_expense', label: 'Gasto de Proyecto' },
        { value: 'project', label: 'Proyecto' },
        { value: 'incident', label: 'Incidente' },
        { value: 'inspection', label: 'Inspección' },
        { value: 'quote', label: 'Cotización' },
        { value: 'purchase_order', label: 'Orden de Compra' },
        { value: 'contractor_invoice', label: 'Factura de Contratista' },
        { value: 'inventory_movement', label: 'Movimiento de Inventario' },
        { value: 'loan_payment', label: 'Pago de Préstamo' },
        { value: 'employee_document', label: 'Documento de Empleado' },
        { value: 'training', label: 'Capacitación' },
      ],
      categories: [
        { value: 'RECEIPT', label: 'Recibo' },
        { value: 'INVOICE', label: 'Factura' },
        { value: 'PHOTO', label: 'Foto' },
        { value: 'BEFORE', label: 'Foto Antes' },
        { value: 'AFTER', label: 'Foto Después' },
        { value: 'PROGRESS', label: 'Foto de Avance' },
        { value: 'EVIDENCE', label: 'Evidencia' },
        { value: 'DOCUMENT', label: 'Documento' },
        { value: 'CONTRACT', label: 'Contrato' },
        { value: 'REPORT', label: 'Informe' },
        { value: 'OTHER', label: 'Otro' },
      ],
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    };

    res.json({
      success: true,
      data: catalogs,
    });
  } catch (error) {
    console.error('Error getting catalogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener catálogos',
    });
  }
};

// Middleware de multer para múltiples archivos
const uploadMiddleware = upload.array('files', 10);

// Middleware de multer para un solo archivo
const uploadSingleMiddleware = upload.single('file');

// Wrapper para manejar errores de multer
const handleUpload = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'El archivo excede el tamaño máximo permitido (10MB)',
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Se excedió el número máximo de archivos (10)',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Error al procesar archivo',
      });
    }
    next();
  });
};

module.exports = {
  uploadFiles,
  uploadSingle,
  getByEntity,
  getById,
  update,
  deleteAttachment,
  deleteByEntity,
  reorder,
  getStats,
  getCatalogs,
  uploadMiddleware: handleUpload(uploadMiddleware),
  uploadSingleMiddleware: handleUpload(uploadSingleMiddleware),
};
