const express = require('express');
const router = express.Router();
const hseController = require('../controllers/hseController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== CATALOGS & STATS ====================
router.get('/catalogs', hseController.getCatalogs);
router.get('/stats', authorize('hse:read'), hseController.getStats);
router.get('/alerts', authorize('hse:read'), hseController.getAlerts);

// ==================== INCIDENTS ====================
router.get('/incidents', authorize('hse:read'), hseController.listIncidents);
router.get('/incidents/:id', authorize('hse:read'), hseController.getIncident);
router.post('/incidents', authorize('hse:create'), hseController.createIncident);
router.put('/incidents/:id', authorize('hse:update'), hseController.updateIncident);
router.post('/incidents/:id/investigate', authorize('hse:update'), hseController.investigateIncident);
router.post('/incidents/:id/close', authorize('hse:update'), hseController.closeIncident);

// ==================== INSPECTIONS ====================
router.get('/inspections', authorize('hse:read'), hseController.listInspections);
router.get('/inspections/:id', authorize('hse:read'), hseController.getInspection);
router.post('/inspections', authorize('hse:create'), hseController.createInspection);
router.put('/inspections/:id', authorize('hse:update'), hseController.updateInspection);
router.post('/inspections/:id/complete', authorize('hse:update'), hseController.completeInspection);

// ==================== TRAININGS ====================
router.get('/trainings', authorize('hse:read'), hseController.listTrainings);
router.get('/trainings/:id', authorize('hse:read'), hseController.getTraining);
router.post('/trainings', authorize('hse:create'), hseController.createTraining);
router.put('/trainings/:id', authorize('hse:update'), hseController.updateTraining);
router.post('/trainings/:id/complete', authorize('hse:update'), hseController.completeTraining);
router.post('/trainings/:id/attendances', authorize('hse:update'), hseController.registerAttendance);
router.put('/trainings/:id/attendances/:attendanceId', authorize('hse:update'), hseController.updateAttendance);

// ==================== SAFETY EQUIPMENT ====================
router.get('/equipment', authorize('hse:read'), hseController.listEquipment);
router.get('/equipment/:id', authorize('hse:read'), hseController.getEquipment);
router.post('/equipment', authorize('hse:create'), hseController.createEquipment);
router.put('/equipment/:id', authorize('hse:update'), hseController.updateEquipment);
router.post('/equipment/:id/assign', authorize('hse:update'), hseController.assignEquipment);
router.post('/equipment/:id/return', authorize('hse:update'), hseController.returnEquipment);

module.exports = router;
