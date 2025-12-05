const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../../auth/middleware/authenticate');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Estadísticas principales del dashboard
router.get('/stats', dashboardController.getMainStats);

// Flujo de caja para gráficos
router.get('/cash-flow', dashboardController.getCashFlow);

// Proyectos por estado
router.get('/projects-by-status', dashboardController.getProjectsByStatus);

// Empleados por departamento
router.get('/employees-by-department', dashboardController.getEmployeesByDepartment);

// Alertas pendientes
router.get('/alerts', dashboardController.getAlerts);

// Actividad reciente
router.get('/activity', dashboardController.getRecentActivity);

module.exports = router;
