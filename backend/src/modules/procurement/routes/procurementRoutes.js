const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const contractorExtendedController = require('../../projects/controllers/contractorExtendedController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS ====================
router.get('/stats', authorize('procurement:read'), procurementController.getStats);

// ==================== COTIZACIONES ====================
router.get('/quotes', authorize('procurement:read'), procurementController.listQuotes);
router.post('/quotes', authorize('procurement:create'), procurementController.createQuote);
router.get('/quotes/:id', authorize('procurement:read'), procurementController.getQuoteById);
router.put('/quotes/:id', authorize('procurement:update'), procurementController.updateQuote);
router.delete('/quotes/:id', authorize('procurement:delete'), procurementController.deleteQuote);
router.post('/quotes/:id/approve', authorize('procurement:approve'), procurementController.approveQuote);
router.post('/quotes/:id/reject', authorize('procurement:approve'), procurementController.rejectQuote);
router.post('/quotes/:id/convert-to-po', authorize('procurement:create'), procurementController.convertQuoteToPO);

// ==================== SOLICITUDES DE COTIZACIÓN ====================
router.get('/quote-requests', authorize('procurement:read'), procurementController.listQuoteRequests);
router.post('/quote-requests', authorize('procurement:create'), procurementController.createQuoteRequest);
router.get('/quote-requests/:id', authorize('procurement:read'), procurementController.getQuoteRequestById);
router.post('/quote-requests/:id/approve', authorize('procurement:approve'), procurementController.approveQuoteRequest);
router.post('/quote-requests/:id/select-quote', authorize('procurement:approve'), procurementController.selectQuote);

// ==================== ÓRDENES DE COMPRA ====================
router.get('/purchase-orders', authorize('procurement:read'), contractorExtendedController.listPurchaseOrders);
router.post('/purchase-orders', authorize('procurement:create'), contractorExtendedController.createPurchaseOrder);
router.get('/purchase-orders/:orderId', authorize('procurement:read'), contractorExtendedController.getPurchaseOrderById);
router.put('/purchase-orders/:orderId', authorize('procurement:update'), contractorExtendedController.updatePurchaseOrder);
router.post('/purchase-orders/:orderId/approve', authorize('procurement:approve'), contractorExtendedController.approvePurchaseOrder);
router.post('/purchase-orders/:orderId/send', authorize('procurement:update'), contractorExtendedController.sendPurchaseOrder);

module.exports = router;
