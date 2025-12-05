const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleetController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ========== CATALOGS & STATS ==========
router.get('/catalogs', fleetController.getCatalogs);
router.get('/stats', authorize('fleet:read'), fleetController.getStats);
router.get('/alerts', authorize('fleet:read'), fleetController.getAlerts);

// ========== VEHICLES ==========
router.get('/vehicles', authorize('fleet:read'), fleetController.getVehicles);
router.get('/vehicles/:id', authorize('fleet:read'), fleetController.getVehicleById);
router.get('/vehicles/:id/full', authorize('fleet:read'), fleetController.getVehicleFull);
router.post('/vehicles', authorize('fleet:create'), fleetController.createVehicle);
router.put('/vehicles/:id', authorize('fleet:update'), fleetController.updateVehicle);
router.delete('/vehicles/:id', authorize('fleet:delete'), fleetController.deleteVehicle);

// ========== ASSIGNMENTS ==========
router.get('/assignments', authorize('fleet:read'), fleetController.getAssignments);
router.post('/assignments', authorize('fleet:create'), fleetController.createAssignment);
router.post('/assignments/:id/end', authorize('fleet:update'), fleetController.endAssignment);

// ========== MAINTENANCES ==========
router.get('/maintenances', authorize('fleet:read'), fleetController.getMaintenances);
router.get('/maintenances/:id', authorize('fleet:read'), fleetController.getMaintenanceById);
router.post('/maintenances', authorize('fleet:create'), fleetController.createMaintenance);
router.put('/maintenances/:id', authorize('fleet:update'), fleetController.updateMaintenance);
router.post('/maintenances/:id/complete', authorize('fleet:update'), fleetController.completeMaintenance);

// ========== FUEL LOGS ==========
router.get('/fuel-logs', authorize('fleet:read'), fleetController.getFuelLogs);
router.get('/fuel-logs/:id', authorize('fleet:read'), fleetController.getFuelLogById);
router.post('/fuel-logs', authorize('fleet:create'), fleetController.createFuelLog);
router.put('/fuel-logs/:id', authorize('fleet:update'), fleetController.updateFuelLog);
router.delete('/fuel-logs/:id', authorize('fleet:delete'), fleetController.deleteFuelLog);

module.exports = router;
