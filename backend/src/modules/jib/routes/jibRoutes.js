const express = require('express');
const router = express.Router();
const jibController = require('../controllers/jibController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard & Reports
router.get('/dashboard', authorize('jib:read'), jibController.getDashboard);
router.get('/partner-statement/:partyId', authorize('jib:read'), jibController.getPartnerStatement);

// ==================== JIB Routes ====================
router.get('/billings', authorize('jib:read'), jibController.findAllJIBs);
router.post('/billings', authorize('jib:create'), jibController.createJIB);
router.get('/billings/:id', authorize('jib:read'), jibController.findJIBById);
router.put('/billings/:id', authorize('jib:update'), jibController.updateJIB);
router.delete('/billings/:id', authorize('jib:delete'), jibController.deleteJIB);

// JIB Workflow
router.post('/billings/:id/send', authorize('jib:update'), jibController.sendJIB);

// JIB Line Items
router.post('/billings/:id/items', authorize('jib:update'), jibController.addLineItem);
router.put('/billings/:id/items/:itemId', authorize('jib:update'), jibController.updateLineItem);
router.delete('/billings/:id/items/:itemId', authorize('jib:update'), jibController.deleteLineItem);

// JIB Partner Shares
router.put('/billings/:id/shares/:shareId', authorize('jib:update'), jibController.updatePartnerShare);
router.post('/billings/:id/shares/:shareId/payment', authorize('jib:update'), jibController.recordPartnerPayment);
router.post('/billings/:id/shares/:shareId/dispute', authorize('jib:update'), jibController.disputePartnerShare);

// ==================== Cash Call Routes ====================
router.get('/cash-calls', authorize('jib:read'), jibController.findAllCashCalls);
router.post('/cash-calls', authorize('jib:create'), jibController.createCashCall);
router.get('/cash-calls/:id', authorize('jib:read'), jibController.findCashCallById);
router.put('/cash-calls/:id', authorize('jib:update'), jibController.updateCashCall);
router.delete('/cash-calls/:id', authorize('jib:delete'), jibController.deleteCashCall);

// Cash Call Workflow
router.post('/cash-calls/:id/send', authorize('jib:update'), jibController.sendCashCall);
router.post('/cash-calls/:id/responses/:responseId/fund', authorize('jib:update'), jibController.recordCashCallFunding);
router.post('/cash-calls/:id/responses/:responseId/default', authorize('jib:update'), jibController.markPartnerDefault);

module.exports = router;
