const express = require('express');
const router = express.Router();
const afeController = require('../controllers/afeController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard & Reports
router.get('/dashboard', authorize('afe:read'), afeController.getDashboard);
router.get('/pending-approvals', authorize('afe:approve'), afeController.getPendingApprovals);

// AFE CRUD
router.get('/', authorize('afe:read'), afeController.findAll);
router.post('/', authorize('afe:create'), afeController.create);
router.get('/:id', authorize('afe:read'), afeController.findById);
router.put('/:id', authorize('afe:update'), afeController.update);
router.delete('/:id', authorize('afe:delete'), afeController.delete);

// Workflow
router.post('/:id/submit', authorize('afe:update'), afeController.submit);
router.post('/:id/approve', authorize('afe:approve'), afeController.approve);
router.post('/:id/reject', authorize('afe:approve'), afeController.reject);
router.post('/:id/start', authorize('afe:update'), afeController.startExecution);
router.post('/:id/close', authorize('afe:update'), afeController.close);

// Categories
router.post('/:id/categories', authorize('afe:update'), afeController.addCategory);
router.put('/:id/categories/:categoryId', authorize('afe:update'), afeController.updateCategory);
router.delete('/:id/categories/:categoryId', authorize('afe:update'), afeController.deleteCategory);

// Expenses
router.get('/:id/expenses', authorize('afe:read'), afeController.getExpenses);
router.post('/:id/expenses', authorize('afe:create'), afeController.addExpense);
router.post('/:id/expenses/:expenseId/approve', authorize('afe:approve'), afeController.approveExpense);

// Variances
router.post('/:id/variances', authorize('afe:create'), afeController.requestVariance);
router.post('/:id/variances/:varianceId/approve', authorize('afe:approve'), afeController.approveVariance);
router.post('/:id/variances/:varianceId/reject', authorize('afe:approve'), afeController.rejectVariance);

module.exports = router;
