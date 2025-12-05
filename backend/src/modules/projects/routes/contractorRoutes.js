const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');
const extendedController = require('../controllers/contractorExtendedController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS ====================
router.get('/stats', authorize('contractors:read'), contractorController.getStats);

// ==================== CATÁLOGOS ====================
router.get('/specialties', authorize('contractors:read'), contractorController.getSpecialties);
router.get('/document-types', authorize('contractors:read'), extendedController.getDocumentTypes);
router.get('/order-types', authorize('contractors:read'), extendedController.getOrderTypes);

// ==================== CRUD CONTRATISTAS ====================
router.post('/', authorize('contractors:create'), contractorController.create);
router.get('/', authorize('contractors:read'), contractorController.list);
router.get('/:id', authorize('contractors:read'), contractorController.getById);
router.get('/:id/full', authorize('contractors:read'), contractorController.getFullById);
router.put('/:id', authorize('contractors:update'), contractorController.update);
router.delete('/:id', authorize('contractors:delete'), contractorController.delete);

// ==================== CUENTAS BANCARIAS ====================
router.get('/:id/bank-accounts', authorize('contractors:read'), extendedController.listBankAccounts);
router.post('/:id/bank-accounts', authorize('contractors:update'), extendedController.createBankAccount);
router.put('/:id/bank-accounts/:accountId', authorize('contractors:update'), extendedController.updateBankAccount);
router.post('/:id/bank-accounts/:accountId/verify', authorize('contractors:approve'), extendedController.verifyBankAccount);
router.delete('/:id/bank-accounts/:accountId', authorize('contractors:delete'), extendedController.deleteBankAccount);

// ==================== DOCUMENTOS ====================
router.get('/:id/documents', authorize('contractors:read'), extendedController.listDocuments);
router.post('/:id/documents', authorize('contractors:update'), extendedController.createDocument);
router.put('/:id/documents/:documentId', authorize('contractors:update'), extendedController.updateDocument);
router.post('/:id/documents/:documentId/verify', authorize('contractors:approve'), extendedController.verifyDocument);
router.post('/:id/documents/:documentId/reject', authorize('contractors:approve'), extendedController.rejectDocument);
router.delete('/:id/documents/:documentId', authorize('contractors:delete'), extendedController.deleteDocument);

// ==================== FACTURAS (globales) ====================
router.get('/invoices/all', authorize('contractors:read'), extendedController.listInvoices);
router.post('/invoices', authorize('contractors:create'), extendedController.createInvoice);
router.get('/invoices/:invoiceId', authorize('contractors:read'), extendedController.getInvoiceById);
router.post('/invoices/:invoiceId/approve', authorize('contractors:approve'), extendedController.approveInvoice);
router.post('/invoices/:invoiceId/reject', authorize('contractors:approve'), extendedController.rejectInvoice);

// ==================== PAGOS (globales) ====================
router.get('/payments/all', authorize('contractors:read'), extendedController.listPayments);
router.post('/payments', authorize('contractors:create'), extendedController.createPayment);
router.get('/payments/:paymentId', authorize('contractors:read'), extendedController.getPaymentById);
router.post('/payments/:paymentId/approve', authorize('contractors:approve'), extendedController.approvePayment);
router.post('/payments/:paymentId/process', authorize('contractors:pay'), extendedController.processPayment);

// ==================== ÓRDENES DE COMPRA/SERVICIO (globales) ====================
router.get('/purchase-orders/all', authorize('contractors:read'), extendedController.listPurchaseOrders);
router.post('/purchase-orders', authorize('contractors:create'), extendedController.createPurchaseOrder);
router.get('/purchase-orders/:orderId', authorize('contractors:read'), extendedController.getPurchaseOrderById);
router.put('/purchase-orders/:orderId', authorize('contractors:update'), extendedController.updatePurchaseOrder);
router.post('/purchase-orders/:orderId/approve', authorize('contractors:approve'), extendedController.approvePurchaseOrder);
router.post('/purchase-orders/:orderId/send', authorize('contractors:update'), extendedController.sendPurchaseOrder);
router.post('/purchase-orders/:orderId/confirm', authorize('contractors:update'), extendedController.confirmPurchaseOrder);
router.post('/purchase-orders/:orderId/progress', authorize('contractors:update'), extendedController.updatePurchaseOrderProgress);

module.exports = router;
