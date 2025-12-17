const express = require('express');
const router = express.Router();
const expenseReportController = require('../controllers/expenseReportController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Catálogos
router.get('/catalogs', expenseReportController.getCatalogs);

// Estadísticas
router.get('/stats', authorize('expense_reports:read', 'expense_reports:*', 'petty_cash:*'), expenseReportController.getStats);

// CRUD de reportes
router.get('/', authorize('expense_reports:read', 'expense_reports:*', 'petty_cash:read', 'petty_cash:*'), expenseReportController.list);
router.get('/:id', authorize('expense_reports:read', 'expense_reports:*', 'petty_cash:read', 'petty_cash:*'), expenseReportController.getById);
router.post('/', authorize('expense_reports:create', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*'), expenseReportController.create);
router.put('/:id', authorize('expense_reports:update', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*'), expenseReportController.update);

// Flujo de aprobación
router.post('/:id/submit', authorize('expense_reports:create', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*'), expenseReportController.submit);
router.post('/:id/approve', authorize('expense_reports:approve', 'expense_reports:*', 'petty_cash:approve', 'petty_cash:*'), expenseReportController.approve);
router.post('/:id/reject', authorize('expense_reports:approve', 'expense_reports:*', 'petty_cash:approve', 'petty_cash:*'), expenseReportController.reject);

// Items
router.post('/:id/items', authorize('expense_reports:update', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*'), expenseReportController.addItem);
router.delete('/:id/items/:itemId', authorize('expense_reports:update', 'expense_reports:*', 'petty_cash:expense', 'petty_cash:*'), expenseReportController.removeItem);

module.exports = router;
