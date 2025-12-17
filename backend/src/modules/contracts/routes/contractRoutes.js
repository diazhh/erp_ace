const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', authorize('contracts:read'), contractController.getDashboard);

// ==================== CONTRACT ROUTES ====================
router.get('/', authorize('contracts:read'), contractController.findAllContracts);
router.post('/', authorize('contracts:create'), contractController.createContract);
router.get('/:id', authorize('contracts:read'), contractController.findContractById);
router.put('/:id', authorize('contracts:update'), contractController.updateContract);
router.delete('/:id', authorize('contracts:delete'), contractController.deleteContract);

// Contract workflow
router.post('/:id/activate', authorize('contracts:approve'), contractController.activateContract);
router.post('/:id/terminate', authorize('contracts:approve'), contractController.terminateContract);

// ==================== PARTY ROUTES ====================
router.get('/:id/parties', authorize('contracts:read'), contractController.getContractParties);
router.post('/:id/parties', authorize('contracts:update'), contractController.addParty);
router.put('/:id/parties/:partyId', authorize('contracts:update'), contractController.updateParty);
router.delete('/:id/parties/:partyId', authorize('contracts:update'), contractController.deleteParty);

// ==================== WORKING INTEREST ROUTES ====================
router.get('/:id/working-interests', authorize('contracts:read'), contractController.getWorkingInterests);
router.post('/:id/working-interests', authorize('contracts:update'), contractController.addWorkingInterest);
router.put('/:id/working-interests/:wiId', authorize('contracts:update'), contractController.updateWorkingInterest);

// ==================== ROYALTY ROUTES ====================
router.get('/:id/royalties', authorize('contracts:read'), contractController.getRoyalties);
router.post('/:id/royalties/calculate', authorize('contracts:create'), contractController.calculateRoyalty);
router.post('/:id/royalties/:royaltyId/pay', authorize('contracts:approve'), contractController.payRoyalty);

// ==================== CONCESSION ROUTES ====================
router.get('/concessions/list', authorize('contracts:read'), contractController.findAllConcessions);
router.post('/concessions', authorize('contracts:create'), contractController.createConcession);
router.get('/concessions/:id', authorize('contracts:read'), contractController.findConcessionById);
router.put('/concessions/:id', authorize('contracts:update'), contractController.updateConcession);
router.delete('/concessions/:id', authorize('contracts:delete'), contractController.deleteConcession);

module.exports = router;
