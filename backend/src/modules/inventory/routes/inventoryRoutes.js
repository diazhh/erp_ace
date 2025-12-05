const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS Y CATÁLOGOS ====================

router.get('/stats', authorize('inventory:read'), inventoryController.getStats);
router.get('/warehouse-types', authorize('inventory:read'), inventoryController.getWarehouseTypes);
router.get('/item-types', authorize('inventory:read'), inventoryController.getItemTypes);
router.get('/movement-types', authorize('inventory:read'), inventoryController.getMovementTypes);
router.get('/movement-reasons', authorize('inventory:read'), inventoryController.getMovementReasons);
router.get('/units', authorize('inventory:read'), inventoryController.getUnits);

// ==================== ALMACENES ====================

router.get('/warehouses', authorize('inventory:read'), inventoryController.listWarehouses);
router.post('/warehouses', authorize('inventory:create'), inventoryController.createWarehouse);
router.get('/warehouses/:id', authorize('inventory:read'), inventoryController.getWarehouseById);
router.get('/warehouses/:id/full', authorize('inventory:read'), inventoryController.getWarehouseFull);
router.put('/warehouses/:id', authorize('inventory:update'), inventoryController.updateWarehouse);
router.delete('/warehouses/:id', authorize('inventory:delete'), inventoryController.deleteWarehouse);
router.get('/warehouses/:warehouseId/stock', authorize('inventory:read'), inventoryController.getWarehouseStock);

// ==================== CATEGORÍAS ====================

router.get('/categories', authorize('inventory:read'), inventoryController.listCategories);
router.post('/categories', authorize('inventory:create'), inventoryController.createCategory);
router.get('/categories/:id', authorize('inventory:read'), inventoryController.getCategoryById);
router.put('/categories/:id', authorize('inventory:update'), inventoryController.updateCategory);
router.delete('/categories/:id', authorize('inventory:delete'), inventoryController.deleteCategory);

// ==================== ITEMS ====================

router.get('/items', authorize('inventory:read'), inventoryController.listItems);
router.post('/items', authorize('inventory:create'), inventoryController.createItem);
router.get('/items/:id', authorize('inventory:read'), inventoryController.getItemById);
router.get('/items/:id/full', authorize('inventory:read'), inventoryController.getItemFull);
router.put('/items/:id', authorize('inventory:update'), inventoryController.updateItem);
router.delete('/items/:id', authorize('inventory:delete'), inventoryController.deleteItem);
router.get('/items/:itemId/stock', authorize('inventory:read'), inventoryController.getItemStock);

// ==================== MOVIMIENTOS ====================

router.get('/movements', authorize('inventory:read'), inventoryController.listMovements);
router.post('/movements', authorize('inventory:create'), inventoryController.createMovement);
router.get('/movements/:id', authorize('inventory:read'), inventoryController.getMovementById);
router.post('/movements/:id/cancel', authorize('inventory:delete'), inventoryController.cancelMovement);

module.exports = router;
