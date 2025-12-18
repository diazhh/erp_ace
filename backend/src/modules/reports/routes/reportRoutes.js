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

/**
 * @route   GET /api/reports/transactions/:id
 * @desc    Descargar comprobante de transacción en PDF
 * @access  Private
 */
router.get('/transactions/:id', reportController.downloadTransactionReport);

// ==================== PRÉSTAMOS ====================

/**
 * @route   GET /api/reports/loans/:id
 * @desc    Descargar reporte de préstamo en PDF
 * @access  Private
 */
router.get('/loans/:id', reportController.downloadLoanReport);

// ==================== COMPRAS ====================

/**
 * @route   GET /api/reports/quotes/:id
 * @desc    Descargar cotización en PDF
 * @access  Private
 */
router.get('/quotes/:id', reportController.downloadQuoteReport);

/**
 * @route   GET /api/reports/purchase-orders/:id
 * @desc    Descargar orden de compra en PDF
 * @access  Private
 */
router.get('/purchase-orders/:id', reportController.downloadPurchaseOrderReport);

// ==================== CONTRATISTAS ====================

/**
 * @route   GET /api/reports/contractor-payments/:id
 * @desc    Descargar comprobante de pago a contratista en PDF
 * @access  Private
 */
router.get('/contractor-payments/:id', reportController.downloadContractorPaymentReport);

/**
 * @route   GET /api/reports/contractor-invoices/:id
 * @desc    Descargar factura de contratista en PDF
 * @access  Private
 */
router.get('/contractor-invoices/:id', reportController.downloadContractorInvoiceReport);

// ==================== VEHÍCULOS ====================

/**
 * @route   GET /api/reports/vehicles/:id
 * @desc    Descargar reporte de vehículo en PDF
 * @access  Private
 */
router.get('/vehicles/:id', reportController.downloadVehicleReport);

/**
 * @route   GET /api/reports/fuel-logs
 * @desc    Descargar listado de recargas de combustible en PDF
 * @access  Private
 * @query   startDate, endDate, vehicleId
 */
router.get('/fuel-logs', reportController.downloadFuelLogsReport);

/**
 * @route   GET /api/reports/fuel-logs/:id
 * @desc    Descargar detalle de recarga de combustible en PDF
 * @access  Private
 */
router.get('/fuel-logs/:id', reportController.downloadFuelLogReport);

/**
 * @route   GET /api/reports/maintenances
 * @desc    Descargar listado de mantenimientos en PDF
 * @access  Private
 * @query   startDate, endDate, vehicleId, maintenanceType
 */
router.get('/maintenances', reportController.downloadMaintenancesReport);

/**
 * @route   GET /api/reports/maintenances/:id
 * @desc    Descargar detalle de mantenimiento en PDF
 * @access  Private
 */
router.get('/maintenances/:id', reportController.downloadMaintenanceReport);

// ==================== TRANSACCIONES ====================

/**
 * @route   GET /api/reports/transactions
 * @desc    Descargar listado de transacciones en PDF
 * @access  Private
 * @query   startDate, endDate, type, accountId, categoryId
 */
router.get('/transactions', reportController.downloadTransactionsListReport);

// ==================== CUENTAS BANCARIAS ====================

/**
 * @route   GET /api/reports/bank-accounts/:id
 * @desc    Descargar reporte de cuenta bancaria con transacciones en PDF
 * @access  Private
 */
router.get('/bank-accounts/:id', reportController.downloadBankAccountReport);

// ==================== PRÉSTAMOS ====================

/**
 * @route   GET /api/reports/loans
 * @desc    Descargar listado de préstamos en PDF
 * @access  Private
 * @query   status, startDate, endDate, employeeId
 */
router.get('/loans', reportController.downloadLoansListReport);

// ==================== CAJA CHICA MOVIMIENTOS ====================

/**
 * @route   GET /api/reports/petty-cash-entries/:id
 * @desc    Descargar comprobante de movimiento de caja chica en PDF
 * @access  Private
 */
router.get('/petty-cash-entries/:id', reportController.downloadPettyCashEntryReport);

// ==================== COTIZACIONES ====================

/**
 * @route   GET /api/reports/quotes
 * @desc    Descargar listado de cotizaciones en PDF
 * @access  Private
 * @query   status, startDate, endDate, supplierId
 */
router.get('/quotes', reportController.downloadQuotesListReport);

// ==================== ÓRDENES DE COMPRA ====================

/**
 * @route   GET /api/reports/purchase-orders
 * @desc    Descargar listado de órdenes de compra en PDF
 * @access  Private
 * @query   status, startDate, endDate, supplierId
 */
router.get('/purchase-orders', reportController.downloadPurchaseOrdersListReport);

// ==================== FACTURAS DE CONTRATISTAS ====================

/**
 * @route   GET /api/reports/contractor-invoices
 * @desc    Descargar listado de facturas de contratistas en PDF
 * @access  Private
 * @query   status, startDate, endDate, contractorId
 */
router.get('/contractor-invoices', reportController.downloadContractorInvoicesListReport);

// ==================== PAGOS A CONTRATISTAS ====================

/**
 * @route   GET /api/reports/contractor-payments
 * @desc    Descargar listado de pagos a contratistas en PDF
 * @access  Private
 * @query   startDate, endDate, contractorId
 */
router.get('/contractor-payments', reportController.downloadContractorPaymentsListReport);

// ==================== INVENTARIO ====================

/**
 * @route   GET /api/reports/inventory/items/:id
 * @desc    Descargar reporte de item de inventario en PDF
 * @access  Private
 */
router.get('/inventory/items/:id', reportController.downloadInventoryItemReport);

/**
 * @route   GET /api/reports/inventory/warehouses/:id
 * @desc    Descargar reporte de almacén en PDF
 * @access  Private
 */
router.get('/inventory/warehouses/:id', reportController.downloadWarehouseReport);

// ==================== LOGISTICS ====================

/**
 * @route   GET /api/reports/logistics/quality/:id
 * @desc    Descargar reporte de muestra de calidad en PDF
 * @access  Private
 */
router.get('/logistics/quality/:id', reportController.downloadQualityReport);

/**
 * @route   GET /api/reports/logistics/pipeline/:id
 * @desc    Descargar reporte de ducto en PDF
 * @access  Private
 */
router.get('/logistics/pipeline/:id', reportController.downloadPipelineReport);

// ==================== EXCEL EXPORTS ====================

/**
 * @route   GET /api/reports/excel/employees
 * @desc    Exportar listado de empleados a Excel
 * @access  Private
 * @query   status, departmentId, positionId
 */
router.get('/excel/employees', reportController.downloadEmployeesExcel);

/**
 * @route   GET /api/reports/excel/payroll/:id
 * @desc    Exportar nómina a Excel
 * @access  Private
 */
router.get('/excel/payroll/:id', reportController.downloadPayrollExcel);

/**
 * @route   GET /api/reports/excel/projects
 * @desc    Exportar listado de proyectos a Excel
 * @access  Private
 * @query   status, priority, executionType, departmentId
 */
router.get('/excel/projects', reportController.downloadProjectsExcel);

/**
 * @route   GET /api/reports/excel/inventory
 * @desc    Exportar inventario a Excel
 * @access  Private
 * @query   warehouseId
 */
router.get('/excel/inventory', reportController.downloadInventoryExcel);

/**
 * @route   GET /api/reports/excel/transactions
 * @desc    Exportar transacciones a Excel
 * @access  Private
 * @query   startDate, endDate, type, accountId
 */
router.get('/excel/transactions', reportController.downloadTransactionsExcel);

/**
 * @route   GET /api/reports/excel/fleet
 * @desc    Exportar flota vehicular a Excel
 * @access  Private
 * @query   status
 */
router.get('/excel/fleet', reportController.downloadFleetExcel);

/**
 * @route   GET /api/reports/excel/hse
 * @desc    Exportar reporte HSE a Excel
 * @access  Private
 * @query   startDate, endDate, severity
 */
router.get('/excel/hse', reportController.downloadHSEExcel);

module.exports = router;
