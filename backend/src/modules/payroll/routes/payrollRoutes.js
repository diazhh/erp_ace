const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== PAYROLL PERIODS ====================

// Obtener estadísticas
router.get('/stats', authorize('payroll:read'), payrollController.getStats);

// CRUD de períodos
router.post('/periods', authorize('payroll:create'), payrollController.createPeriod);
router.get('/periods', authorize('payroll:read'), payrollController.getPeriods);
router.get('/periods/:id', authorize('payroll:read'), payrollController.getPeriodById);
router.get('/periods/:id/full', authorize('payroll:read'), payrollController.getPeriodFullById);
router.put('/periods/:id', authorize('payroll:update'), payrollController.updatePeriod);
router.delete('/periods/:id', authorize('payroll:delete'), payrollController.deletePeriod);

// Acciones de período
router.post('/periods/:id/generate', authorize('payroll:create'), payrollController.generateEntries);
router.post('/periods/:id/approve', authorize('payroll:approve'), payrollController.approvePeriod);
router.post('/periods/:id/pay', authorize('payroll:pay'), payrollController.markAsPaid);

// ==================== PAYROLL ENTRIES ====================

router.get('/entries/:id', authorize('payroll:read'), payrollController.getEntryById);
router.put('/entries/:id', authorize('payroll:update'), payrollController.updateEntry);

// ==================== EMPLOYEE LOANS ====================

router.post('/loans', authorize('payroll:create'), payrollController.createLoan);
router.get('/loans', authorize('payroll:read'), payrollController.getLoans);
router.get('/loans/:id', authorize('payroll:read'), payrollController.getLoanById);
router.post('/loans/:id/approve', authorize('payroll:approve'), payrollController.approveLoan);
router.post('/loans/:id/cancel', authorize('payroll:update'), payrollController.cancelLoan);

module.exports = router;
