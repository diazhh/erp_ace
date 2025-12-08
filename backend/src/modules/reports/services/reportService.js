const pdfService = require('./pdfService');
const logger = require('../../../shared/utils/logger');

/**
 * Servicio principal de reportes
 * Coordina la generación de diferentes tipos de reportes
 */
class ReportService {
  /**
   * Generar reporte de proyecto
   */
  async generateProjectReport(project, options = {}) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Proyecto - ${project.code}`,
        Subject: `Información del proyecto ${project.name}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE PROYECTO',
      subtitle: `${project.code} - ${project.name}`,
    });

    // Información general
    y = pdfService.addSectionTitle(doc, 'Información General', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: project.code },
      { label: 'Nombre', value: project.name },
      { label: 'Estado', value: project.status },
      { label: 'Prioridad', value: project.priority },
      { label: 'Tipo de Ejecución', value: project.executionType },
      { label: 'Tipo de Proyecto', value: project.projectType },
      { label: 'Fecha Inicio', value: pdfService.formatDate(project.startDate) },
      { label: 'Fecha Fin', value: pdfService.formatDate(project.endDate) },
    ], y, { columns: 2 });

    // Cliente
    if (project.clientName) {
      y = pdfService.addSectionTitle(doc, 'Información del Cliente', y);
      
      y = pdfService.addKeyValuePairs(doc, [
        { label: 'Cliente', value: project.clientName },
        { label: 'Contacto', value: project.clientContact },
        { label: 'Email', value: project.clientEmail },
        { label: 'Teléfono', value: project.clientPhone },
      ], y, { columns: 2 });
    }

    // Ubicación
    if (project.location || project.address) {
      y = pdfService.addSectionTitle(doc, 'Ubicación', y);
      
      y = pdfService.addKeyValuePairs(doc, [
        { label: 'Ubicación', value: project.location },
        { label: 'Dirección', value: project.address },
      ], y, { columns: 1 });
    }

    // Información financiera
    y = pdfService.addSectionTitle(doc, 'Información Financiera', y);
    
    y = pdfService.addSummaryBox(doc, [
      { label: 'Presupuesto', value: pdfService.formatCurrency(project.budget, project.currency) },
      { label: 'Costo Estimado', value: pdfService.formatCurrency(project.estimatedCost, project.currency) },
      { label: 'Costo Real', value: pdfService.formatCurrency(project.actualCost, project.currency) },
      { label: 'Monto Contrato', value: pdfService.formatCurrency(project.contractAmount, project.currency), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    // Descripción
    if (project.description) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Descripción', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(project.description, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
           align: 'justify',
         });
    }

    // Notas
    if (project.notes) {
      y = doc.y + 20;
      y = pdfService.addSectionTitle(doc, 'Notas', y);
      
      doc.font(pdfService.fonts.italic)
         .fontSize(9)
         .fillColor(pdfService.colors.textLight)
         .text(project.notes, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de lista de proyectos
   */
  async generateProjectsListReport(projects, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Proyectos',
        Subject: 'Reporte de proyectos del sistema',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE PROYECTOS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Proyectos', value: projects.length.toString() },
      { label: 'Activos', value: activeProjects.toString() },
      { label: 'Completados', value: completedProjects.toString() },
      { label: 'Presupuesto Total', value: pdfService.formatCurrency(totalBudget) },
    ], y, { columns: 4 });

    y += 10;

    // Tabla de proyectos
    const headers = ['Código', 'Nombre', 'Cliente', 'Estado', 'Prioridad', 'Presupuesto', 'Inicio', 'Fin'];
    const rows = projects.map(p => [
      p.code,
      p.name?.substring(0, 30) + (p.name?.length > 30 ? '...' : ''),
      p.clientName?.substring(0, 20) || '-',
      p.status,
      p.priority,
      pdfService.formatCurrency(p.budget, p.currency),
      pdfService.formatDate(p.startDate),
      pdfService.formatDate(p.endDate),
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.10,  // Código
      pageWidth * 0.20,  // Nombre
      pageWidth * 0.15,  // Cliente
      pageWidth * 0.10,  // Estado
      pageWidth * 0.08,  // Prioridad
      pageWidth * 0.12,  // Presupuesto
      pageWidth * 0.12,  // Inicio
      pageWidth * 0.13,  // Fin
    ];

    y = pdfService.createTable(doc, {
      headers,
      rows,
      startY: y,
      columnWidths,
      options: {
        columnAligns: ['left', 'left', 'left', 'center', 'center', 'right', 'center', 'center'],
      },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de empleado
   */
  async generateEmployeeReport(employee, options = {}) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Ficha de Empleado - ${employee.employeeCode}`,
        Subject: `Información del empleado ${employee.firstName} ${employee.lastName}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'FICHA DE EMPLEADO',
      subtitle: `${employee.employeeCode} - ${employee.firstName} ${employee.lastName}`,
    });

    // Información personal
    y = pdfService.addSectionTitle(doc, 'Información Personal', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: employee.employeeCode },
      { label: 'Nombre Completo', value: `${employee.firstName} ${employee.lastName}` },
      { label: 'Documento', value: `${employee.documentType}: ${employee.documentNumber}` },
      { label: 'Fecha Nacimiento', value: pdfService.formatDate(employee.birthDate) },
      { label: 'Género', value: employee.gender },
      { label: 'Estado Civil', value: employee.maritalStatus },
      { label: 'Nacionalidad', value: employee.nationality },
      { label: 'Email Personal', value: employee.personalEmail },
      { label: 'Teléfono', value: employee.phone },
      { label: 'Dirección', value: employee.address },
    ], y, { columns: 2 });

    // Información laboral
    y = pdfService.addSectionTitle(doc, 'Información Laboral', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Cargo', value: employee.position?.name || employee.position },
      { label: 'Departamento', value: employee.department?.name || employee.department },
      { label: 'Fecha Ingreso', value: pdfService.formatDate(employee.hireDate) },
      { label: 'Tipo Contrato', value: employee.contractType },
      { label: 'Estado', value: employee.status },
      { label: 'Email Corporativo', value: employee.workEmail },
      { label: 'Extensión', value: employee.workExtension },
      { label: 'Supervisor', value: employee.supervisor?.firstName ? 
        `${employee.supervisor.firstName} ${employee.supervisor.lastName}` : '-' },
    ], y, { columns: 2 });

    // Información salarial (si se incluye)
    if (options.includeSalary && employee.baseSalary) {
      y = pdfService.addSectionTitle(doc, 'Información Salarial', y);
      
      y = pdfService.addSummaryBox(doc, [
        { label: 'Salario Base', value: pdfService.formatCurrency(employee.baseSalary, employee.currency) },
        { label: 'Bonificaciones', value: pdfService.formatCurrency(employee.bonuses, employee.currency) },
        { label: 'Deducciones', value: pdfService.formatCurrency(employee.deductions, employee.currency) },
      ], y, { alignRight: false, width: 280 });
    }

    // Contacto de emergencia
    if (employee.emergencyContactName) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Contacto de Emergencia', y);
      
      y = pdfService.addKeyValuePairs(doc, [
        { label: 'Nombre', value: employee.emergencyContactName },
        { label: 'Relación', value: employee.emergencyContactRelation },
        { label: 'Teléfono', value: employee.emergencyContactPhone },
      ], y, { columns: 3 });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de lista de empleados
   */
  async generateEmployeesListReport(employees, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Empleados',
        Subject: 'Reporte de empleados del sistema',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE EMPLEADOS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Empleados', value: employees.length.toString() },
      { label: 'Activos', value: activeEmployees.toString() },
      { label: 'Inactivos', value: (employees.length - activeEmployees).toString() },
    ], y, { columns: 3 });

    y += 10;

    // Tabla de empleados
    const headers = ['Código', 'Nombre', 'Documento', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado'];
    const rows = employees.map(e => [
      e.employeeCode,
      `${e.firstName} ${e.lastName}`.substring(0, 25),
      e.documentNumber,
      e.position?.name?.substring(0, 20) || '-',
      e.department?.name?.substring(0, 15) || '-',
      pdfService.formatDate(e.hireDate),
      e.status,
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.10,
      pageWidth * 0.20,
      pageWidth * 0.12,
      pageWidth * 0.18,
      pageWidth * 0.15,
      pageWidth * 0.13,
      pageWidth * 0.12,
    ];

    y = pdfService.createTable(doc, {
      headers,
      rows,
      startY: y,
      columnWidths,
      options: {
        columnAligns: ['left', 'left', 'left', 'left', 'left', 'center', 'center'],
      },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de nómina
   */
  async generatePayrollReport(payroll, details = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Nómina - ${payroll.period}`,
        Subject: `Nómina del período ${payroll.period}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE NÓMINA',
      subtitle: `Período: ${payroll.period} | Estado: ${payroll.status}`,
    });

    // Información del período
    y = pdfService.addSectionTitle(doc, 'Información del Período', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Período', value: payroll.period },
      { label: 'Fecha Inicio', value: pdfService.formatDate(payroll.startDate) },
      { label: 'Fecha Fin', value: pdfService.formatDate(payroll.endDate) },
      { label: 'Fecha Pago', value: pdfService.formatDate(payroll.paymentDate) },
      { label: 'Estado', value: payroll.status },
      { label: 'Total Empleados', value: details.length.toString() },
    ], y, { columns: 3 });

    // Resumen financiero
    y = pdfService.addSectionTitle(doc, 'Resumen Financiero', y);
    
    const totalGross = details.reduce((sum, d) => sum + (parseFloat(d.grossSalary) || 0), 0);
    const totalDeductions = details.reduce((sum, d) => sum + (parseFloat(d.totalDeductions) || 0), 0);
    const totalNet = details.reduce((sum, d) => sum + (parseFloat(d.netSalary) || 0), 0);

    y = pdfService.addSummaryBox(doc, [
      { label: 'Total Bruto', value: pdfService.formatCurrency(totalGross) },
      { label: 'Total Deducciones', value: pdfService.formatCurrency(totalDeductions) },
      { label: 'Total Neto a Pagar', value: pdfService.formatCurrency(totalNet), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    // Detalle por empleado (si hay espacio)
    if (details.length > 0 && details.length <= 20) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Detalle por Empleado', y);

      const headers = ['Empleado', 'Salario Bruto', 'Deducciones', 'Salario Neto'];
      const rows = details.map(d => [
        d.employee ? `${d.employee.firstName} ${d.employee.lastName}` : d.employeeId,
        pdfService.formatCurrency(d.grossSalary),
        pdfService.formatCurrency(d.totalDeductions),
        pdfService.formatCurrency(d.netSalary),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.40,
        pageWidth * 0.20,
        pageWidth * 0.20,
        pageWidth * 0.20,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['left', 'right', 'right', 'right'],
        },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar recibo de pago individual
   */
  async generatePayslipReport(payrollDetail, employee) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      info: {
        Title: `Recibo de Pago - ${employee.employeeCode}`,
        Subject: `Recibo de pago de ${employee.firstName} ${employee.lastName}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'RECIBO DE PAGO',
      subtitle: `Período: ${payrollDetail.payroll?.period || 'N/A'}`,
    });

    // Información del empleado
    y = pdfService.addSectionTitle(doc, 'Datos del Empleado', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: employee.employeeCode },
      { label: 'Nombre', value: `${employee.firstName} ${employee.lastName}` },
      { label: 'Documento', value: employee.documentNumber },
      { label: 'Cargo', value: employee.position?.name || '-' },
      { label: 'Departamento', value: employee.department?.name || '-' },
      { label: 'Fecha Ingreso', value: pdfService.formatDate(employee.hireDate) },
    ], y, { columns: 2 });

    // Ingresos
    y = pdfService.addSectionTitle(doc, 'Ingresos', y);
    
    const ingresos = [
      { label: 'Salario Base', value: pdfService.formatCurrency(payrollDetail.baseSalary) },
    ];

    if (payrollDetail.overtimeAmount > 0) {
      ingresos.push({ label: 'Horas Extra', value: pdfService.formatCurrency(payrollDetail.overtimeAmount) });
    }
    if (payrollDetail.bonuses > 0) {
      ingresos.push({ label: 'Bonificaciones', value: pdfService.formatCurrency(payrollDetail.bonuses) });
    }
    if (payrollDetail.commissions > 0) {
      ingresos.push({ label: 'Comisiones', value: pdfService.formatCurrency(payrollDetail.commissions) });
    }
    ingresos.push({ label: 'Total Ingresos', value: pdfService.formatCurrency(payrollDetail.grossSalary), isTotal: true });

    y = pdfService.addSummaryBox(doc, ingresos, y, { alignRight: false, width: 280 });

    // Deducciones
    y = pdfService.addSectionTitle(doc, 'Deducciones', y);
    
    const deducciones = [];
    if (payrollDetail.socialSecurityEmployee > 0) {
      deducciones.push({ label: 'Seguro Social', value: pdfService.formatCurrency(payrollDetail.socialSecurityEmployee) });
    }
    if (payrollDetail.incomeTax > 0) {
      deducciones.push({ label: 'Impuesto sobre la Renta', value: pdfService.formatCurrency(payrollDetail.incomeTax) });
    }
    if (payrollDetail.otherDeductions > 0) {
      deducciones.push({ label: 'Otras Deducciones', value: pdfService.formatCurrency(payrollDetail.otherDeductions) });
    }
    deducciones.push({ label: 'Total Deducciones', value: pdfService.formatCurrency(payrollDetail.totalDeductions), isTotal: true });

    y = pdfService.addSummaryBox(doc, deducciones, y, { alignRight: false, width: 280 });

    // Neto a pagar
    y += 20;
    doc.rect(doc.page.margins.left, y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 40)
       .fill(pdfService.colors.primary);

    doc.font(pdfService.fonts.bold)
       .fontSize(14)
       .fillColor('#ffffff')
       .text('NETO A PAGAR', doc.page.margins.left + 20, y + 12);

    doc.font(pdfService.fonts.bold)
       .fontSize(16)
       .fillColor('#ffffff')
       .text(pdfService.formatCurrency(payrollDetail.netSalary), 
             doc.page.margins.left + 20, y + 12, {
               width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 40,
               align: 'right',
             });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de inventario
   */
  async generateInventoryReport(items, warehouse = null) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Reporte de Inventario',
        Subject: warehouse ? `Inventario de ${warehouse.name}` : 'Inventario General',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE INVENTARIO',
      subtitle: warehouse ? `Almacén: ${warehouse.name}` : 'Inventario General',
    });

    // Resumen
    const totalItems = items.length;
    const totalValue = items.reduce((sum, i) => sum + ((parseFloat(i.quantity) || 0) * (parseFloat(i.unitPrice) || 0)), 0);
    const lowStock = items.filter(i => i.quantity <= (i.minStock || 0)).length;

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Productos', value: totalItems.toString() },
      { label: 'Valor Total', value: pdfService.formatCurrency(totalValue) },
      { label: 'Stock Bajo', value: lowStock.toString() },
    ], y, { columns: 3 });

    y += 10;

    // Tabla de inventario
    const headers = ['Código', 'Producto', 'Categoría', 'Cantidad', 'Unidad', 'P. Unitario', 'Valor Total', 'Stock Mín.'];
    const rows = items.map(i => [
      i.code || i.sku,
      i.name?.substring(0, 25) || '-',
      i.category?.name || i.category || '-',
      i.quantity?.toString() || '0',
      i.unit || '-',
      pdfService.formatCurrency(i.unitPrice),
      pdfService.formatCurrency((i.quantity || 0) * (i.unitPrice || 0)),
      i.minStock?.toString() || '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.10,
      pageWidth * 0.22,
      pageWidth * 0.12,
      pageWidth * 0.10,
      pageWidth * 0.08,
      pageWidth * 0.12,
      pageWidth * 0.14,
      pageWidth * 0.12,
    ];

    y = pdfService.createTable(doc, {
      headers,
      rows,
      startY: y,
      columnWidths,
      options: {
        columnAligns: ['left', 'left', 'left', 'right', 'center', 'right', 'right', 'right'],
      },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte financiero
   */
  async generateFinancialReport(data, period) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte Financiero - ${period}`,
        Subject: `Estado financiero del período ${period}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE FINANCIERO',
      subtitle: `Período: ${period}`,
    });

    // Resumen de ingresos
    y = pdfService.addSectionTitle(doc, 'Ingresos', y);
    
    if (data.income && data.income.length > 0) {
      const incomeItems = data.income.map(i => ({
        label: i.category || i.description,
        value: pdfService.formatCurrency(i.amount),
      }));
      incomeItems.push({
        label: 'Total Ingresos',
        value: pdfService.formatCurrency(data.totalIncome),
        isTotal: true,
      });
      y = pdfService.addSummaryBox(doc, incomeItems, y, { alignRight: false, width: 350 });
    }

    // Resumen de gastos
    y += 10;
    y = pdfService.addSectionTitle(doc, 'Gastos', y);
    
    if (data.expenses && data.expenses.length > 0) {
      const expenseItems = data.expenses.map(e => ({
        label: e.category || e.description,
        value: pdfService.formatCurrency(e.amount),
      }));
      expenseItems.push({
        label: 'Total Gastos',
        value: pdfService.formatCurrency(data.totalExpenses),
        isTotal: true,
      });
      y = pdfService.addSummaryBox(doc, expenseItems, y, { alignRight: false, width: 350 });
    }

    // Balance
    y += 20;
    const balance = (data.totalIncome || 0) - (data.totalExpenses || 0);
    const balanceColor = balance >= 0 ? pdfService.colors.success : pdfService.colors.danger;

    doc.rect(doc.page.margins.left, y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 50)
       .fill(balanceColor);

    doc.font(pdfService.fonts.bold)
       .fontSize(14)
       .fillColor('#ffffff')
       .text('BALANCE DEL PERÍODO', doc.page.margins.left + 20, y + 10);

    doc.font(pdfService.fonts.bold)
       .fontSize(20)
       .fillColor('#ffffff')
       .text(pdfService.formatCurrency(balance), doc.page.margins.left + 20, y + 10, {
         width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 40,
         align: 'right',
       });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de caja chica
   */
  async generatePettyCashReport(pettyCash, transactions = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Caja Chica - ${pettyCash.name}`,
        Subject: `Estado de caja chica ${pettyCash.name}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE CAJA CHICA',
      subtitle: pettyCash.name,
    });

    // Información general
    y = pdfService.addSectionTitle(doc, 'Información General', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Nombre', value: pettyCash.name },
      { label: 'Responsable', value: pettyCash.custodian?.firstName ? 
        `${pettyCash.custodian.firstName} ${pettyCash.custodian.lastName}` : '-' },
      { label: 'Estado', value: pettyCash.status },
      { label: 'Moneda', value: pettyCash.currency },
    ], y, { columns: 2 });

    // Balance
    y = pdfService.addSectionTitle(doc, 'Balance', y);
    
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto Inicial', value: pdfService.formatCurrency(pettyCash.initialAmount, pettyCash.currency) },
      { label: 'Total Ingresos', value: pdfService.formatCurrency(pettyCash.totalDeposits, pettyCash.currency) },
      { label: 'Total Gastos', value: pdfService.formatCurrency(pettyCash.totalExpenses, pettyCash.currency) },
      { label: 'Saldo Actual', value: pdfService.formatCurrency(pettyCash.currentBalance, pettyCash.currency), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    // Últimas transacciones
    if (transactions.length > 0) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Últimas Transacciones', y);

      const headers = ['Fecha', 'Tipo', 'Descripción', 'Monto'];
      const rows = transactions.slice(0, 15).map(t => [
        pdfService.formatDate(t.date),
        t.type,
        t.description?.substring(0, 40) || '-',
        pdfService.formatCurrency(t.amount, pettyCash.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.20,
        pageWidth * 0.15,
        pageWidth * 0.45,
        pageWidth * 0.20,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['center', 'center', 'left', 'right'],
        },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de flota/vehículos
   */
  async generateFleetReport(vehicles) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Reporte de Flota Vehicular',
        Subject: 'Estado de la flota de vehículos',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE FLOTA VEHICULAR',
      subtitle: `Total: ${vehicles.length} vehículos`,
    });

    // Resumen
    const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE' || v.status === 'AVAILABLE').length;
    const inMaintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Vehículos', value: vehicles.length.toString() },
      { label: 'Disponibles', value: activeVehicles.toString() },
      { label: 'En Mantenimiento', value: inMaintenance.toString() },
    ], y, { columns: 3 });

    y += 10;

    // Tabla de vehículos
    const headers = ['Placa', 'Marca/Modelo', 'Año', 'Tipo', 'Kilometraje', 'Estado', 'Conductor'];
    const rows = vehicles.map(v => [
      v.plate || v.licensePlate,
      `${v.brand || ''} ${v.model || ''}`.trim() || '-',
      v.year?.toString() || '-',
      v.type || v.vehicleType || '-',
      v.mileage ? `${v.mileage.toLocaleString()} km` : '-',
      v.status,
      v.driver ? `${v.driver.firstName} ${v.driver.lastName}` : '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.10,
      pageWidth * 0.20,
      pageWidth * 0.08,
      pageWidth * 0.12,
      pageWidth * 0.12,
      pageWidth * 0.12,
      pageWidth * 0.26,
    ];

    y = pdfService.createTable(doc, {
      headers,
      rows,
      startY: y,
      columnWidths,
      options: {
        columnAligns: ['left', 'left', 'center', 'center', 'right', 'center', 'left'],
      },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte HSE (Seguridad y Salud)
   */
  async generateHSEReport(incidents, period) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte HSE - ${period}`,
        Subject: `Reporte de incidentes de seguridad ${period}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE SEGURIDAD Y SALUD (HSE)',
      subtitle: `Período: ${period}`,
    });

    // Resumen de incidentes
    y = pdfService.addSectionTitle(doc, 'Resumen de Incidentes', y);
    
    const totalIncidents = incidents.length;
    const highSeverity = incidents.filter(i => i.severity === 'HIGH' || i.severity === 'CRITICAL').length;
    const resolved = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Incidentes', value: totalIncidents.toString() },
      { label: 'Alta Severidad', value: highSeverity.toString() },
      { label: 'Resueltos', value: resolved.toString() },
      { label: 'Pendientes', value: (totalIncidents - resolved).toString() },
    ], y, { columns: 4 });

    // Lista de incidentes
    if (incidents.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Detalle de Incidentes', y);

      const headers = ['Fecha', 'Tipo', 'Severidad', 'Ubicación', 'Estado'];
      const rows = incidents.map(i => [
        pdfService.formatDate(i.date || i.incidentDate),
        i.type || i.incidentType || '-',
        i.severity || '-',
        i.location?.substring(0, 25) || '-',
        i.status || '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.18,
        pageWidth * 0.22,
        pageWidth * 0.15,
        pageWidth * 0.27,
        pageWidth * 0.18,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['center', 'left', 'center', 'left', 'center'],
        },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Construir subtítulo basado en filtros
   */
  _buildFilterSubtitle(filters) {
    const parts = [];
    
    if (filters.status) parts.push(`Estado: ${filters.status}`);
    if (filters.department) parts.push(`Depto: ${filters.department}`);
    if (filters.startDate && filters.endDate) {
      parts.push(`${pdfService.formatDate(filters.startDate)} - ${pdfService.formatDate(filters.endDate)}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'Todos los registros';
  }
}

module.exports = new ReportService();
