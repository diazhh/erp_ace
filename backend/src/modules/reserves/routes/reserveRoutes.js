const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', authorize('reserves:read'), reserveController.getDashboard);

// Reserve Estimates
router.get('/estimates', authorize('reserves:read'), reserveController.findAllEstimates);
router.get('/estimates/:id', authorize('reserves:read'), reserveController.findEstimateById);
router.post('/estimates', authorize('reserves:create'), reserveController.createEstimate);
router.put('/estimates/:id', authorize('reserves:update'), reserveController.updateEstimate);
router.delete('/estimates/:id', authorize('reserves:delete'), reserveController.deleteEstimate);
router.post('/estimates/:id/approve', authorize('reserves:approve'), reserveController.approveEstimate);

// Reserve Categories
router.get('/estimates/:estimateId/categories', authorize('reserves:read'), reserveController.findCategoriesByEstimate);
router.post('/categories', authorize('reserves:create'), reserveController.createCategory);
router.put('/categories/:id', authorize('reserves:update'), reserveController.updateCategory);
router.delete('/categories/:id', authorize('reserves:delete'), reserveController.deleteCategory);

// Reserve Valuations
router.get('/valuations', authorize('reserves:read'), reserveController.findAllValuations);
router.get('/valuations/:id', authorize('reserves:read'), reserveController.findValuationById);
router.post('/valuations', authorize('reserves:create'), reserveController.createValuation);
router.put('/valuations/:id', authorize('reserves:update'), reserveController.updateValuation);
router.delete('/valuations/:id', authorize('reserves:delete'), reserveController.deleteValuation);
router.post('/valuations/:id/approve', authorize('reserves:approve'), reserveController.approveValuation);

// Field reserves
router.get('/fields/:fieldId', authorize('reserves:read'), reserveController.getFieldReserves);

module.exports = router;
