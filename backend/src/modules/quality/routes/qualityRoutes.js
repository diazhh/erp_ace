const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/qualityController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ========== ESTADÍSTICAS ==========
router.get('/stats', authorize('quality:read'), qualityController.getStats);

// ========== PLANES DE CALIDAD ==========
router.get('/plans', authorize('quality:read'), qualityController.getPlans);
router.get('/plans/:id', authorize('quality:read'), qualityController.getPlanById);
router.post('/plans', authorize('quality:create'), qualityController.createPlan);
router.put('/plans/:id', authorize('quality:update'), qualityController.updatePlan);
router.post('/plans/:id/approve', authorize('quality:approve'), qualityController.approvePlan);
router.delete('/plans/:id', authorize('quality:delete'), qualityController.deletePlan);

// ========== INSPECCIONES ==========
router.get('/inspections', authorize('quality:read'), qualityController.getInspections);
router.get('/inspections/:id', authorize('quality:read'), qualityController.getInspectionById);
router.post('/inspections', authorize('quality:create'), qualityController.createInspection);
router.put('/inspections/:id', authorize('quality:update'), qualityController.updateInspection);
router.delete('/inspections/:id', authorize('quality:delete'), qualityController.deleteInspection);

// ========== NO CONFORMIDADES ==========
router.get('/non-conformances', authorize('quality:read'), qualityController.getNonConformances);
router.get('/non-conformances/:id', authorize('quality:read'), qualityController.getNonConformanceById);
router.post('/non-conformances', authorize('quality:create'), qualityController.createNonConformance);
router.put('/non-conformances/:id', authorize('quality:update'), qualityController.updateNonConformance);
router.post('/non-conformances/:id/close', authorize('quality:approve'), qualityController.closeNonConformance);
router.delete('/non-conformances/:id', authorize('quality:delete'), qualityController.deleteNonConformance);

// ========== ACCIONES CORRECTIVAS ==========
router.get('/corrective-actions', authorize('quality:read'), qualityController.getCorrectiveActions);
router.post('/corrective-actions', authorize('quality:create'), qualityController.createCorrectiveAction);
router.put('/corrective-actions/:id', authorize('quality:update'), qualityController.updateCorrectiveAction);
router.post('/corrective-actions/:id/complete', authorize('quality:update'), qualityController.completeCorrectiveAction);
router.post('/corrective-actions/:id/verify', authorize('quality:approve'), qualityController.verifyCorrectiveAction);
router.delete('/corrective-actions/:id', authorize('quality:delete'), qualityController.deleteCorrectiveAction);

// ========== CERTIFICADOS ==========
router.get('/certificates', authorize('quality:read'), qualityController.getCertificates);
router.get('/certificates/:id', authorize('quality:read'), qualityController.getCertificateById);
router.post('/certificates', authorize('quality:create'), qualityController.createCertificate);
router.put('/certificates/:id', authorize('quality:update'), qualityController.updateCertificate);
router.post('/certificates/:id/issue', authorize('quality:approve'), qualityController.issueCertificate);
router.delete('/certificates/:id', authorize('quality:delete'), qualityController.deleteCertificate);

module.exports = router;
