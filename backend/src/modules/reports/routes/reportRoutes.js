const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../../auth/middleware/authenticate');

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/reports
 * @desc    Listar tipos de reportes disponibles
 * @access  Private
 */
router.get('/', reportController.listAvailableReports);

// ==================== PROYECTOS ====================

/**
 * @route   GET /api/reports/projects
 * @desc    Descargar listado de proyectos en PDF
 * @access  Private
 * @query   status, priority, executionType, departmentId, startDate, endDate
 */
router.get('/projects', reportController.downloadProjectsListReport);

/**
 * @route   GET /api/reports/projects/:id
 * @desc    Descargar reporte de proyecto individual en PDF
 * @access  Private
 */
router.get('/projects/:id', reportController.downloadProjectReport);

// ==================== EMPLEADOS ====================

/**
 * @route   GET /api/reports/employees
 * @desc    Descargar listado de empleados en PDF
 * @access  Private
 * @query   status, departmentId, positionId
 */
router.get('/employees', reportController.downloadEmployeesListReport);

/**
 * @route   GET /api/reports/employees/:id
 * @desc    Descargar ficha de empleado en PDF
 * @access  Private
 * @query   includeSalary (true/false)
 */
router.get('/employees/:id', reportController.downloadEmployeeReport);

// ==================== NÓMINA ====================

/**
 * @route   GET /api/reports/payroll/:id
 * @desc    Descargar reporte de nómina en PDF
 * @access  Private
 */
router.get('/payroll/:id', reportController.downloadPayrollReport);

/**
 * @route   GET /api/reports/payroll/:payrollId/employee/:employeeId
 * @desc    Descargar recibo de pago individual en PDF
 * @access  Private
 */
router.get('/payroll/:payrollId/employee/:employeeId', reportController.downloadPayslipReport);

// ==================== INVENTARIO ====================

/**
 * @route   GET /api/reports/inventory
 * @desc    Descargar reporte de inventario en PDF
 * @access  Private
 * @query   warehouseId
 */
router.get('/inventory', reportController.downloadInventoryReport);

// ==================== CAJA CHICA ====================

/**
 * @route   GET /api/reports/petty-cash/:id
 * @desc    Descargar reporte de caja chica en PDF
 * @access  Private
 */
router.get('/petty-cash/:id', reportController.downloadPettyCashReport);

// ==================== FLOTA ====================

/**
 * @route   GET /api/reports/fleet
 * @desc    Descargar reporte de flota vehicular en PDF
 * @access  Private
 * @query   status
 */
router.get('/fleet', reportController.downloadFleetReport);

// ==================== HSE ====================

/**
 * @route   GET /api/reports/hse
 * @desc    Descargar reporte HSE en PDF
 * @access  Private
 * @query   startDate, endDate, severity
 */
router.get('/hse', reportController.downloadHSEReport);

// ==================== FINANCIERO ====================

/**
 * @route   GET /api/reports/financial
 * @desc    Descargar reporte financiero en PDF
 * @access  Private
 * @query   startDate, endDate (requeridos)
 */
router.get('/financial', reportController.downloadFinancialReport);

module.exports = router;
