const express = require('express');
const router = express.Router();
const pettyCashController = require('../controllers/pettyCashController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS GENERALES ====================
router.get('/stats', authorize('petty_cash:read'), pettyCashController.getGeneralStats);

// ==================== CATEGORÍAS ====================
router.get('/categories', authorize('petty_cash:read'), pettyCashController.getCategories);

// ==================== CAJAS CHICAS ====================

// CRUD de cajas chicas
router.post('/', authorize('petty_cash:create'), pettyCashController.create);
router.get('/', authorize('petty_cash:read'), pettyCashController.list);
router.get('/:id', authorize('petty_cash:read'), pettyCashController.getById);
router.get('/:id/full', authorize('petty_cash:read'), pettyCashController.getFullById);
router.put('/:id', authorize('petty_cash:update'), pettyCashController.update);

// Estadísticas de una caja específica
router.get('/:id/stats', authorize('petty_cash:read'), pettyCashController.getStats);

// ==================== MOVIMIENTOS ====================

// Listar movimientos de una caja
router.get('/:id/entries', authorize('petty_cash:read'), pettyCashController.listEntries);

// Crear movimiento (gasto, ajuste)
router.post('/:id/entries', authorize('petty_cash:create'), pettyCashController.createEntry);

// Crear reposición
router.post('/:id/replenishment', authorize('petty_cash:approve'), pettyCashController.createReplenishment);

// Obtener movimiento específico
router.get('/:id/entries/:entryId', authorize('petty_cash:read'), pettyCashController.getEntryById);

// Aprobar movimiento
router.post('/:id/entries/:entryId/approve', authorize('petty_cash:approve'), pettyCashController.approveEntry);

// Rechazar movimiento
router.post('/:id/entries/:entryId/reject', authorize('petty_cash:approve'), pettyCashController.rejectEntry);

// Cancelar movimiento
router.post('/:id/entries/:entryId/cancel', authorize('petty_cash:update'), pettyCashController.cancelEntry);

module.exports = router;
