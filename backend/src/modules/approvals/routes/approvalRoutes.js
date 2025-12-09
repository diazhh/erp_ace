const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Estadísticas de aprobaciones (para dashboard)
router.get('/stats', approvalController.getApprovalStats);

// Solicitudes pendientes de aprobación
// Requiere permiso de aprobar caja chica O aprobar combustible
router.get('/pending', authorize(['petty_cash:approve', 'fleet:fuel_approve']), approvalController.getPendingApprovals);

// Solicitudes aprobadas pendientes de pago
// Requiere permiso de pagar caja chica O pagar combustible
router.get('/payments', authorize(['petty_cash:pay', 'fleet:fuel_pay']), approvalController.getPendingPayments);

module.exports = router;
