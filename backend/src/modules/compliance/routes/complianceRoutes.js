const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// ========== DASHBOARD & ALERTS ==========
router.get('/dashboard', authorize('compliance:read'), complianceController.getDashboard);
router.get('/alerts', authorize('compliance:read'), complianceController.getAlerts);

// ========== REGULATORY REPORTS ==========
router.get('/reports', authorize('compliance:read'), complianceController.getReports);
router.post('/reports', authorize('compliance:create'), complianceController.createReport);
router.get('/reports/:id', authorize('compliance:read'), complianceController.getReportById);
router.put('/reports/:id', authorize('compliance:update'), complianceController.updateReport);
router.delete('/reports/:id', authorize('compliance:delete'), complianceController.deleteReport);
router.post('/reports/:id/submit', authorize('compliance:update'), complianceController.submitReport);
router.post('/reports/:id/mark-submitted', authorize('compliance:update'), complianceController.markReportSubmitted);
router.post('/reports/:id/response', authorize('compliance:update'), complianceController.updateReportResponse);

// ========== ENVIRONMENTAL PERMITS ==========
router.get('/permits', authorize('compliance:read'), complianceController.getPermits);
router.post('/permits', authorize('compliance:create'), complianceController.createPermit);
router.get('/permits/:id', authorize('compliance:read'), complianceController.getPermitById);
router.put('/permits/:id', authorize('compliance:update'), complianceController.updatePermit);
router.delete('/permits/:id', authorize('compliance:delete'), complianceController.deletePermit);

// ========== COMPLIANCE AUDITS ==========
router.get('/audits', authorize('compliance:read'), complianceController.getAudits);
router.post('/audits', authorize('compliance:create'), complianceController.createAudit);
router.get('/audits/:id', authorize('compliance:read'), complianceController.getAuditById);
router.put('/audits/:id', authorize('compliance:update'), complianceController.updateAudit);
router.delete('/audits/:id', authorize('compliance:delete'), complianceController.deleteAudit);
router.post('/audits/:id/start', authorize('compliance:update'), complianceController.startAudit);
router.post('/audits/:id/complete', authorize('compliance:update'), complianceController.completeAudit);
router.post('/audits/:id/close', authorize('compliance:approve'), complianceController.closeAudit);

// ========== POLICIES ==========
router.get('/policies', authorize('compliance:read'), complianceController.getPolicies);
router.post('/policies', authorize('compliance:create'), complianceController.createPolicy);
router.get('/policies/:id', authorize('compliance:read'), complianceController.getPolicyById);
router.put('/policies/:id', authorize('compliance:update'), complianceController.updatePolicy);
router.delete('/policies/:id', authorize('compliance:delete'), complianceController.deletePolicy);
router.post('/policies/:id/submit-review', authorize('compliance:update'), complianceController.submitPolicyForReview);
router.post('/policies/:id/approve', authorize('compliance:approve'), complianceController.approvePolicy);
router.post('/policies/:id/supersede', authorize('compliance:approve'), complianceController.supersededPolicy);

// ========== CERTIFICATIONS ==========
router.get('/certifications', authorize('compliance:read'), complianceController.getCertifications);
router.post('/certifications', authorize('compliance:create'), complianceController.createCertification);
router.get('/certifications/:id', authorize('compliance:read'), complianceController.getCertificationById);
router.put('/certifications/:id', authorize('compliance:update'), complianceController.updateCertification);
router.delete('/certifications/:id', authorize('compliance:delete'), complianceController.deleteCertification);

module.exports = router;
