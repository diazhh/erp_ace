const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/permissions - Listar permisos agrupados por módulo
router.get('/', authorize('roles:read'), roleController.getPermissions);

// GET /api/permissions/modules - Listar módulos disponibles
router.get('/modules', authorize('roles:read'), roleController.getModules);

module.exports = router;
