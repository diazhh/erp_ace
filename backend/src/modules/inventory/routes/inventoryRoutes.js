const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const productController = require('../controllers/productController');
const inventoryUnitController = require('../controllers/inventoryUnitController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS Y CATÁLOGOS ====================

router.get('/stats', authorize('inventory:read'), inventoryController.getStats);
router.get('/units-stats', authorize('inventory:read'), inventoryUnitController.getStats);
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

// ==================== PRODUCTOS (CATÁLOGO) ====================

router.get('/products/catalogs', authorize('inventory:read'), productController.getCatalogs);
router.get('/products', authorize('inventory:read'), productController.listProducts);
router.post('/products', authorize('inventory:create'), productController.createProduct);
router.get('/products/:id', authorize('inventory:read'), productController.getProduct);
router.get('/products/:id/full', authorize('inventory:read'), productController.getProductFull);
router.put('/products/:id', authorize('inventory:update'), productController.updateProduct);
router.delete('/products/:id', authorize('inventory:delete'), productController.deleteProduct);
router.get('/products/:id/units', authorize('inventory:read'), productController.getProductUnits);

// ==================== UNIDADES DE INVENTARIO ====================

router.get('/inventory-units/catalogs', authorize('inventory:read'), inventoryUnitController.getCatalogs);
router.get('/inventory-units', authorize('inventory:read'), inventoryUnitController.listUnits);
router.post('/inventory-units', authorize('inventory:create'), inventoryUnitController.createUnits);
router.get('/inventory-units/:id', authorize('inventory:read'), inventoryUnitController.getUnit);
router.get('/inventory-units/:id/full', authorize('inventory:read'), inventoryUnitController.getUnitFull);
router.put('/inventory-units/:id', authorize('inventory:update'), inventoryUnitController.updateUnit);
router.get('/inventory-units/:id/history', authorize('inventory:read'), inventoryUnitController.getUnitHistory);

// Acciones sobre unidades
router.post('/inventory-units/:id/transfer', authorize('inventory:update'), inventoryUnitController.transferUnit);
router.post('/inventory-units/:id/assign', authorize('inventory:update'), inventoryUnitController.assignUnit);
router.post('/inventory-units/:id/return', authorize('inventory:update'), inventoryUnitController.returnUnit);
router.post('/inventory-units/:id/change-status', authorize('inventory:update'), inventoryUnitController.changeStatus);

// Acciones masivas
router.post('/inventory-units/bulk-assign', authorize('inventory:update'), inventoryUnitController.bulkAssign);
router.post('/inventory-units/bulk-return', authorize('inventory:update'), inventoryUnitController.bulkReturn);

// Unidades por empleado/proyecto
router.get('/employees/:employeeId/units', authorize('inventory:read'), inventoryUnitController.getEmployeeUnits);
router.get('/projects/:projectId/units', authorize('inventory:read'), inventoryUnitController.getProjectUnits);

module.exports = router;
