const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/roles - Listar roles
router.get('/', authorize('roles:read'), roleController.findAll);

// GET /api/roles/stats - Estadísticas de roles
router.get('/stats', authorize('roles:read'), roleController.getStats);

// GET /api/roles/:id - Obtener rol por ID
router.get('/:id', authorize('roles:read'), roleController.findById);

// POST /api/roles - Crear rol
router.post('/', authorize('roles:create'), roleController.create);

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', authorize('roles:update'), roleController.update);

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', authorize('roles:delete'), roleController.delete);

// POST /api/roles/:id/permissions - Asignar permisos
router.post('/:id/permissions', authorize('roles:update'), roleController.assignPermissions);

module.exports = router;
