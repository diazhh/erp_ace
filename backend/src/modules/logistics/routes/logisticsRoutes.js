const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', authorize('logistics:read'), logisticsController.getDashboard);

// Storage Tanks
router.get('/tanks', authorize('logistics:read'), logisticsController.findAllTanks);
router.get('/tanks/:id', authorize('logistics:read'), logisticsController.findTankById);
router.post('/tanks', authorize('logistics:create'), logisticsController.createTank);
router.put('/tanks/:id', authorize('logistics:update'), logisticsController.updateTank);
router.delete('/tanks/:id', authorize('logistics:delete'), logisticsController.deleteTank);

// Tank Gaugings
router.get('/tanks/:tankId/gaugings', authorize('logistics:read'), logisticsController.findGaugingsByTank);
router.post('/gaugings', authorize('logistics:create'), logisticsController.createGauging);
router.delete('/gaugings/:id', authorize('logistics:delete'), logisticsController.deleteGauging);

// Loading Tickets
router.get('/tickets', authorize('logistics:read'), logisticsController.findAllTickets);
router.get('/tickets/:id', authorize('logistics:read'), logisticsController.findTicketById);
router.post('/tickets', authorize('logistics:create'), logisticsController.createTicket);
router.put('/tickets/:id', authorize('logistics:update'), logisticsController.updateTicket);
router.delete('/tickets/:id', authorize('logistics:delete'), logisticsController.deleteTicket);
router.post('/tickets/:id/complete', authorize('logistics:update'), logisticsController.completeTicket);

// Crude Quality
router.get('/quality', authorize('logistics:read'), logisticsController.findAllQualities);
router.get('/quality/:id', authorize('logistics:read'), logisticsController.findQualityById);
router.post('/quality', authorize('logistics:create'), logisticsController.createQuality);
router.put('/quality/:id', authorize('logistics:update'), logisticsController.updateQuality);
router.delete('/quality/:id', authorize('logistics:delete'), logisticsController.deleteQuality);
router.post('/quality/:id/approve', authorize('logistics:approve'), logisticsController.approveQuality);

// Pipelines
router.get('/pipelines', authorize('logistics:read'), logisticsController.findAllPipelines);
router.get('/pipelines/:id', authorize('logistics:read'), logisticsController.findPipelineById);
router.post('/pipelines', authorize('logistics:create'), logisticsController.createPipeline);
router.put('/pipelines/:id', authorize('logistics:update'), logisticsController.updatePipeline);
router.delete('/pipelines/:id', authorize('logistics:delete'), logisticsController.deletePipeline);

module.exports = router;
