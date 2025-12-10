const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ========== CATÁLOGOS ==========
router.get('/catalogs', assetController.getCatalogs);

// ========== ESTADÍSTICAS ==========
router.get('/stats', authorize('assets:read'), assetController.getStats);
router.get('/alerts', authorize('assets:read'), assetController.getAlerts);

// ========== CATEGORÍAS ==========
router.get('/categories', authorize('assets:read'), assetController.getCategories);
router.get('/categories/:id', authorize('assets:read'), assetController.getCategoryById);
router.post('/categories', authorize('assets:create'), assetController.createCategory);
router.put('/categories/:id', authorize('assets:update'), assetController.updateCategory);
router.delete('/categories/:id', authorize('assets:delete'), assetController.deleteCategory);

// ========== ACTIVOS ==========
router.get('/', authorize('assets:read'), assetController.getAssets);
router.get('/:id', authorize('assets:read'), assetController.getAssetById);
router.get('/:id/full', authorize('assets:read'), assetController.getAssetFull);
router.post('/', authorize('assets:create'), assetController.createAsset);
router.put('/:id', authorize('assets:update'), assetController.updateAsset);
router.delete('/:id', authorize('assets:delete'), assetController.deleteAsset);
router.post('/:id/dispose', authorize('assets:dispose'), assetController.disposeAsset);

// ========== MANTENIMIENTOS ==========
router.get('/maintenances/list', authorize('assets:read'), assetController.getMaintenances);
router.get('/maintenances/:id', authorize('assets:read'), assetController.getMaintenanceById);
router.post('/maintenances', authorize('assets:maintenance'), assetController.createMaintenance);
router.put('/maintenances/:id', authorize('assets:maintenance'), assetController.updateMaintenance);
router.post('/maintenances/:id/complete', authorize('assets:maintenance'), assetController.completeMaintenance);

// ========== TRANSFERENCIAS ==========
router.get('/transfers/list', authorize('assets:read'), assetController.getTransfers);
router.get('/transfers/:id', authorize('assets:read'), assetController.getTransferById);
router.post('/transfers', authorize('assets:transfer'), assetController.createTransfer);
router.post('/transfers/:id/approve', authorize('assets:transfer_approve'), assetController.approveTransfer);
router.post('/transfers/:id/complete', authorize('assets:transfer'), assetController.completeTransfer);

// ========== DEPRECIACIÓN ==========
router.get('/depreciations', authorize('assets:depreciation'), assetController.getDepreciations);
router.post('/depreciations/calculate', authorize('assets:depreciation'), assetController.calculateDepreciation);
router.post('/depreciations/run-monthly', authorize('assets:depreciation'), assetController.runMonthlyDepreciation);

module.exports = router;
