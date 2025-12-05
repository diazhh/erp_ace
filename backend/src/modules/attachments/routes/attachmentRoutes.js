const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Catálogos (sin permisos especiales)
router.get('/catalogs', attachmentController.getCatalogs);

// Estadísticas (requiere permiso de lectura)
router.get('/stats', authorize('attachments:read'), attachmentController.getStats);

// Reordenar attachments
router.put('/reorder', authorize('attachments:create'), attachmentController.reorder);

// Obtener attachment por ID
router.get('/:id', authorize('attachments:read'), attachmentController.getById);

// Actualizar attachment
router.put('/:id', authorize('attachments:create'), attachmentController.update);

// Eliminar attachment
router.delete('/:id', authorize('attachments:delete'), attachmentController.deleteAttachment);

// Subir múltiples archivos a una entidad
router.post(
  '/:entityType/:entityId',
  authorize('attachments:create'),
  attachmentController.uploadMiddleware,
  attachmentController.uploadFiles
);

// Subir un solo archivo a una entidad
router.post(
  '/:entityType/:entityId/single',
  authorize('attachments:create'),
  attachmentController.uploadSingleMiddleware,
  attachmentController.uploadSingle
);

// Obtener attachments de una entidad
router.get(
  '/:entityType/:entityId',
  authorize('attachments:read'),
  attachmentController.getByEntity
);

// Eliminar todos los attachments de una entidad
router.delete(
  '/:entityType/:entityId',
  authorize('attachments:delete'),
  attachmentController.deleteByEntity
);

module.exports = router;
