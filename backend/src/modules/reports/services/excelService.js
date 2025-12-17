const ExcelJS = require('exceljs');
const logger = require('../../../shared/utils/logger');

/**
 * Servicio de generación de reportes Excel
 */
class ExcelService {
  constructor() {
    this.defaultStyles = {
      headerFill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1976D2' },
      },
      headerFont: {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
      },
      titleFont: {
        bold: true,
        size: 14,
        color: { argb: 'FF1976D2' },
      },
      currencyFormat: '"$"#,##0.00',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '#,##0.00',
    };
  }

  /**
   * Crear workbook base
   */
  createWorkbook() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ERP Sistema';
    workbook.created = new Date();
    return workbook;
  }

  /**
   * Agregar encabezado a hoja
   */
  addHeader(worksheet, title, subtitle = null) {
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = this.defaultStyles.titleFont;
    titleCell.alignment = { horizontal: 'center' };

    if (subtitle) {
      worksheet.mergeCells('A2:H2');
      const subtitleCell = worksheet.getCell('A2');
      subtitleCell.value = subtitle;
      subtitleCell.font = { size: 10, italic: true };
      subtitleCell.alignment = { horizontal: 'center' };
      return 4;
    }
    return 3;
  }

  /**
   * Aplicar estilos de encabezado a fila
   */
  styleHeaderRow(row) {
    row.eachCell((cell) => {
      cell.fill = this.defaultStyles.headerFill;
      cell.font = this.defaultStyles.headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    row.height = 25;
  }

  /**
   * Aplicar estilos a celdas de datos
   */
  styleDataRow(row, isAlternate = false) {
    row.eachCell((cell) => {
      if (isAlternate) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' },
        };
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      };
    });
  }

  /**
   * Formatear fecha
   */
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES');
  }

  /**
   * Formatear moneda
   */
  formatCurrency(amount, currency = 'USD') {
    if (amount === null || amount === undefined) return '-';
    const num = parseFloat(amount);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(num);
  }

  /**
   * Generar buffer del workbook
   */
  async generateBuffer(workbook) {
    return await workbook.xlsx.writeBuffer();
  }

  // ==================== REPORTES ESPECÍFICOS ====================

  /**
   * Reporte de empleados
   */
  async generateEmployeesReport(employees, filters = {}) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Empleados');

    const startRow = this.addHeader(
      worksheet,
      'LISTADO DE EMPLEADOS',
      `Generado: ${new Date().toLocaleDateString('es-ES')}`
    );

    // Definir columnas
    worksheet.columns = [
      { header: 'Código', key: 'code', width: 12 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Documento', key: 'document', width: 15 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Departamento', key: 'department', width: 20 },
      { header: 'Fecha Ingreso', key: 'hireDate', width: 15 },
      { header: 'Estado', key: 'status', width: 12 },
      { header: 'Email', key: 'email', width: 25 },
    ];

    // Agregar encabezados
    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Nombre', 'Documento', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado', 'Email'];
    this.styleHeaderRow(headerRow);

    // Agregar datos
    employees.forEach((emp, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      row.values = [
        emp.employeeCode || emp.code,
        `${emp.firstName} ${emp.lastName}`,
        emp.documentNumber,
        emp.position?.name || emp.position || '-',
        emp.department?.name || emp.department || '-',
        this.formatDate(emp.hireDate),
        emp.status,
        emp.workEmail || emp.personalEmail || '-',
      ];
      this.styleDataRow(row, index % 2 === 1);
    });

    // Resumen
    const summaryRow = startRow + employees.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Empleados:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow}`).value = employees.length;

    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
    worksheet.getCell(`A${summaryRow + 1}`).value = 'Activos:';
    worksheet.getCell(`A${summaryRow + 1}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 1}`).value = activeCount;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte de nómina
   */
  async generatePayrollReport(payroll, entries) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Nómina');

    const startRow = this.addHeader(
      worksheet,
      `REPORTE DE NÓMINA - ${payroll.name || payroll.period}`,
      `Período: ${this.formatDate(payroll.startDate)} al ${this.formatDate(payroll.endDate)}`
    );

    // Definir columnas
    worksheet.columns = [
      { header: 'Código', key: 'code', width: 12 },
      { header: 'Empleado', key: 'employee', width: 30 },
      { header: 'Salario Base', key: 'baseSalary', width: 15 },
      { header: 'Bonificaciones', key: 'bonuses', width: 15 },
      { header: 'Horas Extra', key: 'overtime', width: 15 },
      { header: 'Total Bruto', key: 'gross', width: 15 },
      { header: 'Deducciones', key: 'deductions', width: 15 },
      { header: 'Neto', key: 'net', width: 15 },
    ];

    // Encabezados
    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Empleado', 'Salario Base', 'Bonificaciones', 'Horas Extra', 'Total Bruto', 'Deducciones', 'Neto'];
    this.styleHeaderRow(headerRow);

    // Datos
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    entries.forEach((entry, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      const gross = parseFloat(entry.grossSalary || entry.gross_salary) || 0;
      const deductions = parseFloat(entry.totalDeductions || entry.total_deductions) || 0;
      const net = parseFloat(entry.netSalary || entry.net_salary) || 0;

      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;

      row.values = [
        entry.employee?.employeeCode || entry.employeeCode || '-',
        entry.employee ? `${entry.employee.firstName} ${entry.employee.lastName}` : (entry.employeeName || '-'),
        parseFloat(entry.baseSalary || entry.base_salary) || 0,
        parseFloat(entry.totalBonuses || entry.total_bonuses) || 0,
        parseFloat(entry.overtimeAmount || entry.overtime_amount) || 0,
        gross,
        deductions,
        net,
      ];
      this.styleDataRow(row, index % 2 === 1);

      // Formato de moneda
      ['C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
        row.getCell(col).numFmt = this.defaultStyles.currencyFormat;
      });
    });

    // Totales
    const totalRow = worksheet.getRow(startRow + entries.length + 2);
    totalRow.values = ['', 'TOTALES', '', '', '', totalGross, totalDeductions, totalNet];
    totalRow.font = { bold: true };
    totalRow.getCell('F').numFmt = this.defaultStyles.currencyFormat;
    totalRow.getCell('G').numFmt = this.defaultStyles.currencyFormat;
    totalRow.getCell('H').numFmt = this.defaultStyles.currencyFormat;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte de proyectos
   */
  async generateProjectsReport(projects, filters = {}) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Proyectos');

    const startRow = this.addHeader(
      worksheet,
      'LISTADO DE PROYECTOS',
      `Generado: ${new Date().toLocaleDateString('es-ES')}`
    );

    worksheet.columns = [
      { header: 'Código', key: 'code', width: 12 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Cliente', key: 'client', width: 25 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Prioridad', key: 'priority', width: 12 },
      { header: 'Presupuesto', key: 'budget', width: 15 },
      { header: 'Progreso', key: 'progress', width: 12 },
      { header: 'Fecha Inicio', key: 'startDate', width: 15 },
      { header: 'Fecha Fin', key: 'endDate', width: 15 },
    ];

    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Nombre', 'Cliente', 'Estado', 'Prioridad', 'Presupuesto', 'Progreso', 'Fecha Inicio', 'Fecha Fin'];
    this.styleHeaderRow(headerRow);

    let totalBudget = 0;

    projects.forEach((project, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      const budget = parseFloat(project.budget) || 0;
      totalBudget += budget;

      row.values = [
        project.code,
        project.name,
        project.clientName || '-',
        project.status,
        project.priority,
        budget,
        `${project.progress || 0}%`,
        this.formatDate(project.startDate),
        this.formatDate(project.endDate),
      ];
      this.styleDataRow(row, index % 2 === 1);
      row.getCell('F').numFmt = this.defaultStyles.currencyFormat;
    });

    // Resumen
    const summaryRow = startRow + projects.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Proyectos:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow}`).value = projects.length;

    worksheet.getCell(`A${summaryRow + 1}`).value = 'Presupuesto Total:';
    worksheet.getCell(`A${summaryRow + 1}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 1}`).value = totalBudget;
    worksheet.getCell(`B${summaryRow + 1}`).numFmt = this.defaultStyles.currencyFormat;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte de inventario
   */
  async generateInventoryReport(items, warehouse = null) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Inventario');

    const subtitle = warehouse ? `Almacén: ${warehouse.name}` : 'Inventario General';
    const startRow = this.addHeader(worksheet, 'REPORTE DE INVENTARIO', subtitle);

    worksheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Producto', key: 'name', width: 30 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Cantidad', key: 'quantity', width: 12 },
      { header: 'Unidad', key: 'unit', width: 10 },
      { header: 'Costo Unit.', key: 'unitCost', width: 15 },
      { header: 'Valor Total', key: 'totalValue', width: 15 },
      { header: 'Stock Mín.', key: 'minStock', width: 12 },
      { header: 'Estado', key: 'status', width: 12 },
    ];

    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Producto', 'Categoría', 'Cantidad', 'Unidad', 'Costo Unit.', 'Valor Total', 'Stock Mín.', 'Estado'];
    this.styleHeaderRow(headerRow);

    let totalValue = 0;

    items.forEach((item, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      const quantity = parseFloat(item.quantity || item.totalStock) || 0;
      const unitCost = parseFloat(item.unitCost || item.unitPrice) || 0;
      const itemValue = quantity * unitCost;
      totalValue += itemValue;

      const minStock = parseFloat(item.minStock) || 0;
      let stockStatus = 'OK';
      if (quantity <= 0) stockStatus = 'Sin Stock';
      else if (quantity <= minStock) stockStatus = 'Bajo';

      row.values = [
        item.code || item.sku,
        item.name,
        item.category?.name || item.category || '-',
        quantity,
        item.unit || '-',
        unitCost,
        itemValue,
        minStock,
        stockStatus,
      ];
      this.styleDataRow(row, index % 2 === 1);
      row.getCell('F').numFmt = this.defaultStyles.currencyFormat;
      row.getCell('G').numFmt = this.defaultStyles.currencyFormat;

      // Resaltar stock bajo
      if (stockStatus === 'Bajo' || stockStatus === 'Sin Stock') {
        row.getCell('I').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCDD2' },
        };
      }
    });

    // Resumen
    const summaryRow = startRow + items.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Items:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow}`).value = items.length;

    worksheet.getCell(`A${summaryRow + 1}`).value = 'Valor Total:';
    worksheet.getCell(`A${summaryRow + 1}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 1}`).value = totalValue;
    worksheet.getCell(`B${summaryRow + 1}`).numFmt = this.defaultStyles.currencyFormat;

    const lowStock = items.filter(i => {
      const qty = parseFloat(i.quantity || i.totalStock) || 0;
      const min = parseFloat(i.minStock) || 0;
      return qty <= min;
    }).length;
    worksheet.getCell(`A${summaryRow + 2}`).value = 'Items Stock Bajo:';
    worksheet.getCell(`A${summaryRow + 2}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 2}`).value = lowStock;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte de transacciones financieras
   */
  async generateTransactionsReport(transactions, filters = {}) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Transacciones');

    let subtitle = `Generado: ${new Date().toLocaleDateString('es-ES')}`;
    if (filters.startDate && filters.endDate) {
      subtitle = `Período: ${this.formatDate(filters.startDate)} al ${this.formatDate(filters.endDate)}`;
    }

    const startRow = this.addHeader(worksheet, 'LISTADO DE TRANSACCIONES', subtitle);

    worksheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Fecha', key: 'date', width: 12 },
      { header: 'Tipo', key: 'type', width: 12 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Descripción', key: 'description', width: 35 },
      { header: 'Cuenta', key: 'account', width: 20 },
      { header: 'Monto', key: 'amount', width: 15 },
      { header: 'Estado', key: 'status', width: 12 },
    ];

    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Fecha', 'Tipo', 'Categoría', 'Descripción', 'Cuenta', 'Monto', 'Estado'];
    this.styleHeaderRow(headerRow);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      const amount = parseFloat(tx.amount) || 0;
      const type = tx.transactionType || tx.transaction_type || tx.type;

      if (type === 'INCOME') totalIncome += amount;
      else if (type === 'EXPENSE') totalExpense += amount;

      row.values = [
        tx.code,
        this.formatDate(tx.transactionDate || tx.transaction_date || tx.date),
        type,
        tx.category?.name || tx.category || '-',
        tx.description || '-',
        tx.account?.name || tx.bankAccount?.name || '-',
        amount,
        tx.status,
      ];
      this.styleDataRow(row, index % 2 === 1);
      row.getCell('G').numFmt = this.defaultStyles.currencyFormat;

      // Color por tipo
      if (type === 'INCOME') {
        row.getCell('G').font = { color: { argb: 'FF2E7D32' } };
      } else if (type === 'EXPENSE') {
        row.getCell('G').font = { color: { argb: 'FFC62828' } };
      }
    });

    // Resumen
    const summaryRow = startRow + transactions.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Ingresos:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true, color: { argb: 'FF2E7D32' } };
    worksheet.getCell(`B${summaryRow}`).value = totalIncome;
    worksheet.getCell(`B${summaryRow}`).numFmt = this.defaultStyles.currencyFormat;

    worksheet.getCell(`A${summaryRow + 1}`).value = 'Total Gastos:';
    worksheet.getCell(`A${summaryRow + 1}`).font = { bold: true, color: { argb: 'FFC62828' } };
    worksheet.getCell(`B${summaryRow + 1}`).value = totalExpense;
    worksheet.getCell(`B${summaryRow + 1}`).numFmt = this.defaultStyles.currencyFormat;

    worksheet.getCell(`A${summaryRow + 2}`).value = 'Balance:';
    worksheet.getCell(`A${summaryRow + 2}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 2}`).value = totalIncome - totalExpense;
    worksheet.getCell(`B${summaryRow + 2}`).numFmt = this.defaultStyles.currencyFormat;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte de flota vehicular
   */
  async generateFleetReport(vehicles) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('Flota');

    const startRow = this.addHeader(
      worksheet,
      'REPORTE DE FLOTA VEHICULAR',
      `Generado: ${new Date().toLocaleDateString('es-ES')}`
    );

    worksheet.columns = [
      { header: 'Placa', key: 'plate', width: 12 },
      { header: 'Marca', key: 'brand', width: 15 },
      { header: 'Modelo', key: 'model', width: 15 },
      { header: 'Año', key: 'year', width: 8 },
      { header: 'Tipo', key: 'type', width: 15 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Conductor', key: 'driver', width: 25 },
      { header: 'Kilometraje', key: 'mileage', width: 12 },
    ];

    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Placa', 'Marca', 'Modelo', 'Año', 'Tipo', 'Estado', 'Conductor', 'Kilometraje'];
    this.styleHeaderRow(headerRow);

    vehicles.forEach((vehicle, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      row.values = [
        vehicle.plate,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.vehicleType || vehicle.type,
        vehicle.status,
        vehicle.driver ? `${vehicle.driver.firstName} ${vehicle.driver.lastName}` : '-',
        vehicle.currentMileage || vehicle.mileage || 0,
      ];
      this.styleDataRow(row, index % 2 === 1);
      row.getCell('H').numFmt = '#,##0';
    });

    // Resumen
    const summaryRow = startRow + vehicles.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Vehículos:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow}`).value = vehicles.length;

    const available = vehicles.filter(v => v.status === 'AVAILABLE').length;
    worksheet.getCell(`A${summaryRow + 1}`).value = 'Disponibles:';
    worksheet.getCell(`A${summaryRow + 1}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow + 1}`).value = available;

    return this.generateBuffer(workbook);
  }

  /**
   * Reporte HSE
   */
  async generateHSEReport(incidents, period) {
    const workbook = this.createWorkbook();
    const worksheet = workbook.addWorksheet('HSE');

    const startRow = this.addHeader(worksheet, 'REPORTE HSE - INCIDENTES', `Período: ${period}`);

    worksheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Fecha', key: 'date', width: 12 },
      { header: 'Tipo', key: 'type', width: 15 },
      { header: 'Severidad', key: 'severity', width: 12 },
      { header: 'Ubicación', key: 'location', width: 20 },
      { header: 'Descripción', key: 'description', width: 40 },
      { header: 'Estado', key: 'status', width: 12 },
    ];

    const headerRow = worksheet.getRow(startRow);
    headerRow.values = ['Código', 'Fecha', 'Tipo', 'Severidad', 'Ubicación', 'Descripción', 'Estado'];
    this.styleHeaderRow(headerRow);

    incidents.forEach((incident, index) => {
      const row = worksheet.getRow(startRow + 1 + index);
      row.values = [
        incident.code,
        this.formatDate(incident.incidentDate || incident.incident_date),
        incident.incidentType || incident.incident_type || incident.type,
        incident.severity,
        incident.location || '-',
        incident.description || '-',
        incident.status,
      ];
      this.styleDataRow(row, index % 2 === 1);

      // Color por severidad
      const severityColors = {
        LOW: 'FF4CAF50',
        MEDIUM: 'FFFFC107',
        HIGH: 'FFFF9800',
        CRITICAL: 'FFF44336',
      };
      if (severityColors[incident.severity]) {
        row.getCell('D').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: severityColors[incident.severity] },
        };
      }
    });

    // Resumen
    const summaryRow = startRow + incidents.length + 3;
    worksheet.getCell(`A${summaryRow}`).value = 'Total Incidentes:';
    worksheet.getCell(`A${summaryRow}`).font = { bold: true };
    worksheet.getCell(`B${summaryRow}`).value = incidents.length;

    return this.generateBuffer(workbook);
  }
}

module.exports = new ExcelService();
