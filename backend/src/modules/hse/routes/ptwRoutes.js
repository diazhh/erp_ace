const express = require('express');
const router = express.Router();
const ptwController = require('../controllers/ptwController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard & Board
router.get('/dashboard', authorize('ptw:read'), ptwController.getDashboard);
router.get('/active-board', authorize('ptw:read'), ptwController.getActivePermitsBoard);

// ==================== Work Permits ====================
router.get('/permits', authorize('ptw:read'), ptwController.findAllPermits);
router.post('/permits', authorize('ptw:create'), ptwController.createPermit);
router.get('/permits/:id', authorize('ptw:read'), ptwController.findPermitById);
router.put('/permits/:id', authorize('ptw:update'), ptwController.updatePermit);
router.delete('/permits/:id', authorize('ptw:delete'), ptwController.deletePermit);

// Permit Workflow
router.post('/permits/:id/submit', authorize('ptw:update'), ptwController.submitPermit);
router.post('/permits/:id/approve', authorize('ptw:approve'), ptwController.approvePermit);
router.post('/permits/:id/reject', authorize('ptw:approve'), ptwController.rejectPermit);
router.post('/permits/:id/activate', authorize('ptw:update'), ptwController.activatePermit);
router.post('/permits/:id/close', authorize('ptw:update'), ptwController.closePermit);
router.post('/permits/:id/cancel', authorize('ptw:update'), ptwController.cancelPermit);

// Checklists
router.put('/permits/:id/checklists/:checklistId', authorize('ptw:update'), ptwController.updateChecklist);

// Extensions
router.post('/permits/:id/extensions', authorize('ptw:update'), ptwController.requestExtension);
router.post('/permits/:id/extensions/:extensionId/approve', authorize('ptw:approve'), ptwController.approveExtension);
router.post('/permits/:id/extensions/:extensionId/reject', authorize('ptw:approve'), ptwController.rejectExtension);

// ==================== Stop Work Authority ====================
router.get('/stop-work', authorize('ptw:read'), ptwController.findAllStopWork);
router.post('/stop-work', authorize('ptw:create'), ptwController.createStopWork);
router.get('/stop-work/:id', authorize('ptw:read'), ptwController.findStopWorkById);
router.post('/stop-work/:id/resolve', authorize('ptw:update'), ptwController.resolveStopWork);
router.post('/stop-work/:id/resume', authorize('ptw:approve'), ptwController.resumeWork);

module.exports = router;
