const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== STATISTICS ====================

router.get('/stats', authorize('finance:read'), financeController.getStats);
router.get('/cash-flow', authorize('finance:read'), financeController.getCashFlow);

// ==================== BANK ACCOUNTS ====================

router.post('/accounts', authorize('finance:create'), financeController.createAccount);
router.get('/accounts', authorize('finance:read'), financeController.getAccounts);
router.get('/accounts/:id', authorize('finance:read'), financeController.getAccountById);
router.get('/accounts/:id/full', authorize('finance:read'), financeController.getAccountFullById);
router.put('/accounts/:id', authorize('finance:update'), financeController.updateAccount);
router.delete('/accounts/:id', authorize('finance:delete'), financeController.deleteAccount);

// ==================== TRANSACTIONS ====================

router.post('/transactions', authorize('finance:create'), financeController.createTransaction);
router.get('/transactions', authorize('finance:read'), financeController.getTransactions);
router.get('/transactions/:id', authorize('finance:read'), financeController.getTransactionById);
router.put('/transactions/:id', authorize('finance:update'), financeController.updateTransaction);
router.post('/transactions/:id/cancel', authorize('finance:update'), financeController.cancelTransaction);

// ==================== TRANSFERS ====================

router.post('/transfers', authorize('finance:create'), financeController.createTransfer);

// ==================== RECONCILIATION ====================

router.post('/transactions/:id/reconcile', authorize('finance:approve'), financeController.reconcileTransaction);
router.post('/reconcile/bulk', authorize('finance:approve'), financeController.bulkReconcile);

// ==================== EXCHANGE RATES ====================

router.post('/exchange-rates', authorize('finance:create'), financeController.createExchangeRate);
router.get('/exchange-rates', authorize('finance:read'), financeController.getExchangeRates);
router.get('/exchange-rates/current', authorize('finance:read'), financeController.getCurrentRate);

// ==================== CATEGORIES ====================

router.get('/categories', authorize('finance:read'), financeController.getCategories);
router.post('/categories', authorize('finance:create'), financeController.createCategory);

module.exports = router;
