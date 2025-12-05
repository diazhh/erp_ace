const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/users - Listar usuarios
router.get('/', authorize('users:read'), userController.findAll);

// GET /api/users/stats - Estadísticas de usuarios
router.get('/stats', authorize('users:read'), userController.getStats);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', authorize('users:read'), userController.findById);

// POST /api/users - Crear usuario
router.post('/', authorize('users:create'), userController.create);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', authorize('users:update'), userController.update);

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', authorize('users:delete'), userController.delete);

// PUT /api/users/:id/toggle-active - Activar/Desactivar usuario
router.put('/:id/toggle-active', authorize('users:update'), userController.toggleActive);

// POST /api/users/:id/reset-password - Resetear contraseña
router.post('/:id/reset-password', authorize('users:reset_password'), userController.resetPassword);

// POST /api/users/:id/roles - Asignar roles
router.post('/:id/roles', authorize('users:update'), userController.assignRoles);

module.exports = router;
