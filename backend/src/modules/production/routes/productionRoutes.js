const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== DASHBOARD ====================
router.get('/dashboard', authorize('production:read'), productionController.getDashboard);
router.get('/trend', authorize('production:read'), productionController.getProductionTrend);

// ==================== FIELDS ====================
router.get('/fields', authorize('production:read'), productionController.getFields);
router.post('/fields', authorize('production:create'), productionController.createField);
router.get('/fields/:id/detail', authorize('production:read'), productionController.getFieldDetail);
router.get('/fields/:id/production', authorize('production:read'), productionController.getFieldProduction);
router.get('/fields/:id', authorize('production:read'), productionController.getFieldById);
router.put('/fields/:id', authorize('production:update'), productionController.updateField);
router.delete('/fields/:id', authorize('production:delete'), productionController.deleteField);

// ==================== WELLS ====================
router.get('/wells', authorize('production:read'), productionController.getWells);
router.post('/wells', authorize('production:create'), productionController.createWell);
router.get('/wells/:id/detail', authorize('production:read'), productionController.getWellDetail);
router.get('/wells/:id/production', authorize('production:read'), productionController.getWellProduction);
router.get('/wells/:id/production-chart', authorize('production:read'), productionController.getWellProductionByDateRange);
router.get('/wells/:id', authorize('production:read'), productionController.getWellById);
router.put('/wells/:id', authorize('production:update'), productionController.updateWell);
router.delete('/wells/:id', authorize('production:delete'), productionController.deleteWell);

// ==================== WELL LOGS (BITÁCORAS) ====================
router.get('/logs', authorize('production:read'), productionController.getWellLogs);
router.post('/logs', authorize('production:create'), productionController.createWellLog);
router.get('/logs/:id', authorize('production:read'), productionController.getWellLogById);
router.put('/logs/:id', authorize('production:update'), productionController.updateWellLog);
router.delete('/logs/:id', authorize('production:delete'), productionController.deleteWellLog);

// ==================== DAILY PRODUCTION ====================
router.get('/daily', authorize('production:read'), productionController.getDailyProduction);
router.post('/daily', authorize('production:create'), productionController.createProduction);
router.get('/daily/:id', authorize('production:read'), productionController.getProductionById);
router.put('/daily/:id', authorize('production:update'), productionController.updateProduction);
router.delete('/daily/:id', authorize('production:delete'), productionController.deleteProduction);
router.post('/daily/:id/verify', authorize('production:approve'), productionController.verifyProduction);
router.post('/daily/:id/approve', authorize('production:approve'), productionController.approveProduction);

// ==================== ALLOCATIONS ====================
router.get('/allocations', authorize('production:read'), productionController.getAllocations);
router.post('/allocations/generate', authorize('production:create'), productionController.generateAllocation);
router.get('/allocations/:id', authorize('production:read'), productionController.getAllocationById);
router.post('/allocations/:id/approve', authorize('production:approve'), productionController.approveAllocation);

// ==================== MORNING REPORTS ====================
router.get('/morning-reports', authorize('production:read'), productionController.getMorningReports);
router.post('/morning-reports', authorize('production:create'), productionController.createMorningReport);
router.get('/morning-reports/:id', authorize('production:read'), productionController.getMorningReportById);
router.put('/morning-reports/:id', authorize('production:update'), productionController.updateMorningReport);
router.delete('/morning-reports/:id', authorize('production:delete'), productionController.deleteMorningReport);
router.post('/morning-reports/:id/submit', authorize('production:update'), productionController.submitMorningReport);
router.post('/morning-reports/:id/approve', authorize('production:approve'), productionController.approveMorningReport);

module.exports = router;
