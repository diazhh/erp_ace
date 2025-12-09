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
  async generateProjectReport(project, relatedData = {}) {
    const { members = [], milestones = [], expenses = [], contractorPayments = [], updates = [] } = relatedData;
    
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Proyecto - ${project.code}`,
        Subject: `Información del proyecto ${project.name}`,
      },
    });

    const executionTypeLabelsHeader = { INTERNAL: 'Interno', OUTSOURCED: 'Contratado' };
    
    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE PROYECTO',
      subtitle: `${project.code} - ${project.name}`,
      entityInfo: `Tipo: ${executionTypeLabelsHeader[project.executionType] || project.executionType} | Cliente: ${project.clientName || '-'}`,
    });

    // Información general
    y = pdfService.addSectionTitle(doc, 'Información General', y);
    
    const executionTypeLabels = { INTERNAL: 'Interno', OUTSOURCED: 'Contratado' };
    const statusLabels = { 
      PLANNING: 'Planificación', IN_PROGRESS: 'En Progreso', ON_HOLD: 'En Espera', 
      COMPLETED: 'Completado', CANCELLED: 'Cancelado' 
    };
    const priorityLabels = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', CRITICAL: 'Crítica' };
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: project.code },
      { label: 'Nombre', value: project.name },
      { label: 'Estado', value: statusLabels[project.status] || project.status },
      { label: 'Prioridad', value: priorityLabels[project.priority] || project.priority },
      { label: 'Tipo de Ejecución', value: executionTypeLabels[project.executionType] || project.executionType },
      { label: 'Gerente', value: project.manager ? `${project.manager.firstName} ${project.manager.lastName}` : '-' },
      { label: 'Departamento', value: project.department?.name || '-' },
      { label: 'Progreso', value: `${project.progress || 0}%` },
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

    // Contratista (para proyectos OUTSOURCED)
    if (project.executionType === 'OUTSOURCED' && project.contractor) {
      y = pdfService.addSectionTitle(doc, 'Contratista', y);
      
      y = pdfService.addKeyValuePairs(doc, [
        { label: 'Empresa', value: project.contractor.companyName || project.contractor.name },
        { label: 'RIF', value: project.contractor.rif || '-' },
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
    
    const financialItems = [
      { label: 'Presupuesto', value: pdfService.formatCurrency(project.budget, project.currency) },
      { label: 'Costo Estimado', value: pdfService.formatCurrency(project.estimatedCost, project.currency) },
      { label: 'Costo Real', value: pdfService.formatCurrency(project.actualCost, project.currency) },
    ];
    
    if (project.executionType === 'OUTSOURCED') {
      financialItems.push({ label: 'Monto Contrato', value: pdfService.formatCurrency(project.contractAmount, project.currency), isTotal: true });
    }
    
    y = pdfService.addSummaryBox(doc, financialItems, y, { alignRight: false, width: 300 });

    // Equipo del proyecto (para proyectos INTERNAL)
    if (members.length > 0) {
      // Verificar si necesitamos nueva página
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Equipo del Proyecto', y);

      const headers = ['Empleado', 'Código', 'Rol'];
      const rows = members.map(m => [
        m.employee ? `${m.employee.firstName} ${m.employee.lastName}` : '-',
        m.employee?.employeeCode || '-',
        m.role || '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.45, pageWidth * 0.25, pageWidth * 0.30];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'left', 'left'] },
      });
    }

    // Hitos del proyecto
    if (milestones.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Hitos del Proyecto', y);

      const milestoneStatusLabels = { 
        PENDING: 'Pendiente', IN_PROGRESS: 'En Progreso', 
        COMPLETED: 'Completado', DELAYED: 'Atrasado', CANCELLED: 'Cancelado' 
      };

      const headers = ['Hito', 'Fecha Límite', 'Estado'];
      const rows = milestones.map(m => [
        m.name || m.title || '-',
        pdfService.formatDate(m.dueDate || m.due_date),
        milestoneStatusLabels[m.status] || m.status || '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.50, pageWidth * 0.25, pageWidth * 0.25];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'center', 'center'] },
      });
    }

    // Gastos del proyecto
    if (expenses.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Gastos del Proyecto', y);

      const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

      const headers = ['Fecha', 'Descripción', 'Tipo', 'Monto'];
      const rows = expenses.slice(0, 10).map(e => [
        pdfService.formatDate(e.expenseDate || e.expense_date || e.date),
        (e.description || '-').substring(0, 30),
        e.expenseType || e.expense_type || '-',
        pdfService.formatCurrency(e.amount, project.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.18, pageWidth * 0.40, pageWidth * 0.22, pageWidth * 0.20];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['center', 'left', 'center', 'right'] },
      });

      // Total de gastos
      y += 5;
      doc.font(pdfService.fonts.bold)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(`Total Gastos: ${pdfService.formatCurrency(totalExpenses, project.currency)}`, 
                doc.page.margins.left, y, { align: 'right', width: pageWidth });
      y += 20;
    }

    // Pagos a contratista (para proyectos OUTSOURCED)
    if (contractorPayments.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Pagos al Contratista', y);

      const totalPayments = contractorPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

      const headers = ['Fecha', 'Referencia', 'Método', 'Monto'];
      const rows = contractorPayments.map(p => [
        pdfService.formatDate(p.paymentDate || p.payment_date),
        p.referenceNumber || p.reference_number || '-',
        p.paymentMethod || p.payment_method || '-',
        pdfService.formatCurrency(p.amount, project.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.20, pageWidth * 0.30, pageWidth * 0.25, pageWidth * 0.25];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['center', 'left', 'center', 'right'] },
      });

      // Total de pagos
      y += 5;
      doc.font(pdfService.fonts.bold)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(`Total Pagado: ${pdfService.formatCurrency(totalPayments, project.currency)}`, 
                doc.page.margins.left, y, { align: 'right', width: pageWidth });
      y += 20;
    }

    // Actualizaciones recientes
    if (updates.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Actualizaciones Recientes', y);

      const headers = ['Fecha', 'Tipo', 'Descripción', 'Por'];
      const rows = updates.slice(0, 5).map(u => [
        pdfService.formatDate(u.createdAt || u.created_at),
        u.updateType || u.update_type || '-',
        (u.description || u.notes || '-').substring(0, 35),
        u.createdByEmployee ? `${u.createdByEmployee.firstName} ${u.createdByEmployee.lastName}` : '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.18, pageWidth * 0.15, pageWidth * 0.42, pageWidth * 0.25];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['center', 'center', 'left', 'left'] },
      });
    }

    // Descripción
    if (project.description) {
      if (y > doc.page.height - 150) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
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
    const { payrollEntries = [], loans = [] } = options;
    
    const doc = pdfService.createDocument({
      info: {
        Title: `Ficha de Empleado - ${employee.employeeCode}`,
        Subject: `Información del empleado ${employee.firstName} ${employee.lastName}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'FICHA DE EMPLEADO',
      subtitle: `${employee.employeeCode} - ${employee.firstName} ${employee.lastName}`,
      entityInfo: `Departamento: ${employee.department?.name || '-'} | Cargo: ${employee.position?.name || '-'}`,
    });

    // Información personal
    y = pdfService.addSectionTitle(doc, 'Información Personal', y);
    
    const statusLabels = { ACTIVE: 'Activo', INACTIVE: 'Inactivo', ON_LEAVE: 'Licencia', TERMINATED: 'Terminado' };
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: employee.employeeCode },
      { label: 'Nombre Completo', value: `${employee.firstName} ${employee.lastName}` },
      { label: 'Documento', value: `${employee.documentType || 'CI'}: ${employee.documentNumber}` },
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
      { label: 'Estado', value: statusLabels[employee.status] || employee.status },
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

    // Historial de nóminas
    if (payrollEntries.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Últimas Nóminas', y);

      const headers = ['Período', 'Salario Bruto', 'Deducciones', 'Neto'];
      const rows = payrollEntries.map(p => [
        p.period?.name || pdfService.formatDate(p.period?.startDate),
        pdfService.formatCurrency(p.grossSalary || p.gross_salary, employee.currency),
        pdfService.formatCurrency(p.totalDeductions || p.total_deductions, employee.currency),
        pdfService.formatCurrency(p.netSalary || p.net_salary, employee.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.35, pageWidth * 0.22, pageWidth * 0.22, pageWidth * 0.21];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'right', 'right', 'right'] },
      });
    }

    // Préstamos
    if (loans.length > 0) {
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Préstamos', y);

      const loanStatusLabels = { PENDING: 'Pendiente', ACTIVE: 'Activo', PAID: 'Pagado', CANCELLED: 'Cancelado' };

      const headers = ['Código', 'Monto', 'Pendiente', 'Cuotas', 'Estado'];
      const rows = loans.map(l => [
        l.code || '-',
        pdfService.formatCurrency(l.amount, l.currency),
        pdfService.formatCurrency(l.remainingAmount || l.remaining_amount, l.currency),
        `${l.paidInstallments || l.paid_installments || 0}/${l.totalInstallments || l.total_installments || 0}`,
        loanStatusLabels[l.status] || l.status,
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.18, pageWidth * 0.22, pageWidth * 0.22, pageWidth * 0.18, pageWidth * 0.20];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'right', 'right', 'center', 'center'] },
      });
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
    const statusLabels = { 
      DRAFT: 'Borrador', CALCULATING: 'Calculando', PENDING_APPROVAL: 'Pendiente Aprobación',
      APPROVED: 'Aprobada', PAID: 'Pagada', CANCELLED: 'Cancelada'
    };
    
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: details.length > 10 ? 'landscape' : 'portrait',
      info: {
        Title: `Reporte de Nómina - ${payroll.name || payroll.period}`,
        Subject: `Nómina del período ${payroll.name || payroll.period}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE NÓMINA',
      subtitle: payroll.name || payroll.period,
      entityInfo: `Período: ${pdfService.formatDate(payroll.startDate)} al ${pdfService.formatDate(payroll.endDate)} | Estado: ${statusLabels[payroll.status] || payroll.status}`,
    });

    // Información del período
    y = pdfService.addSectionTitle(doc, 'Información del Período', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Nombre', value: payroll.name || payroll.period },
      { label: 'Tipo', value: payroll.payrollType || payroll.type || '-' },
      { label: 'Fecha Inicio', value: pdfService.formatDate(payroll.startDate) },
      { label: 'Fecha Fin', value: pdfService.formatDate(payroll.endDate) },
      { label: 'Fecha Pago', value: pdfService.formatDate(payroll.paymentDate) },
      { label: 'Estado', value: statusLabels[payroll.status] || payroll.status },
      { label: 'Total Empleados', value: details.length.toString() },
      { label: 'Moneda', value: payroll.currency || 'USD' },
    ], y, { columns: 4 });

    // Resumen financiero
    y = pdfService.addSectionTitle(doc, 'Resumen Financiero', y);
    
    const totalGross = details.reduce((sum, d) => sum + (parseFloat(d.grossSalary || d.gross_salary) || 0), 0);
    const totalDeductions = details.reduce((sum, d) => sum + (parseFloat(d.totalDeductions || d.total_deductions) || 0), 0);
    const totalNet = details.reduce((sum, d) => sum + (parseFloat(d.netSalary || d.net_salary) || 0), 0);
    const totalBonuses = details.reduce((sum, d) => sum + (parseFloat(d.totalBonuses || d.total_bonuses) || 0), 0);

    y = pdfService.addSummaryBox(doc, [
      { label: 'Total Salario Base', value: pdfService.formatCurrency(totalGross - totalBonuses, payroll.currency) },
      { label: 'Total Bonificaciones', value: pdfService.formatCurrency(totalBonuses, payroll.currency) },
      { label: 'Total Bruto', value: pdfService.formatCurrency(totalGross, payroll.currency) },
      { label: 'Total Deducciones', value: pdfService.formatCurrency(totalDeductions, payroll.currency) },
      { label: 'Total Neto a Pagar', value: pdfService.formatCurrency(totalNet, payroll.currency), isTotal: true },
    ], y, { alignRight: false, width: 350 });

    // Detalle por empleado
    if (details.length > 0) {
      y += 20;
      y = pdfService.addSectionTitle(doc, `Detalle por Empleado (${details.length})`, y);

      const headers = ['Código', 'Empleado', 'Salario Base', 'Bonificaciones', 'Deducciones', 'Neto'];
      const rows = details.map(d => [
        d.employee?.employeeCode || d.employeeCode || '-',
        d.employee ? `${d.employee.firstName} ${d.employee.lastName}` : (d.employeeName || '-'),
        pdfService.formatCurrency(d.baseSalary || d.base_salary, payroll.currency),
        pdfService.formatCurrency(d.totalBonuses || d.total_bonuses, payroll.currency),
        pdfService.formatCurrency(d.totalDeductions || d.total_deductions, payroll.currency),
        pdfService.formatCurrency(d.netSalary || d.net_salary, payroll.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.12,
        pageWidth * 0.28,
        pageWidth * 0.15,
        pageWidth * 0.15,
        pageWidth * 0.15,
        pageWidth * 0.15,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['left', 'left', 'right', 'right', 'right', 'right'],
        },
      });

      // Totales al final de la tabla
      y += 10;
      const pageWidthTotal = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      doc.font(pdfService.fonts.bold)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(`TOTAL A PAGAR: ${pdfService.formatCurrency(totalNet, payroll.currency)}`, 
                doc.page.margins.left, y, { align: 'right', width: pageWidthTotal });
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

    const statusLabels = { ACTIVE: 'Activa', CLOSED: 'Cerrada', SUSPENDED: 'Suspendida' };
    const typeLabels = { EXPENSE: 'Gasto', DEPOSIT: 'Depósito', REPLENISHMENT: 'Reposición' };

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE CAJA CHICA',
      subtitle: pettyCash.name,
      entityInfo: `Responsable: ${pettyCash.custodian?.firstName ? `${pettyCash.custodian.firstName} ${pettyCash.custodian.lastName}` : '-'} | Estado: ${statusLabels[pettyCash.status] || pettyCash.status}`,
    });

    // Información general
    y = pdfService.addSectionTitle(doc, 'Información General', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Nombre', value: pettyCash.name },
      { label: 'Código', value: pettyCash.code || '-' },
      { label: 'Responsable', value: pettyCash.custodian?.firstName ? 
        `${pettyCash.custodian.firstName} ${pettyCash.custodian.lastName}` : '-' },
      { label: 'Estado', value: statusLabels[pettyCash.status] || pettyCash.status },
      { label: 'Moneda', value: pettyCash.currency },
      { label: 'Límite', value: pdfService.formatCurrency(pettyCash.maxAmount || pettyCash.limit, pettyCash.currency) },
    ], y, { columns: 2 });

    // Balance
    y = pdfService.addSectionTitle(doc, 'Balance', y);
    
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto Inicial', value: pdfService.formatCurrency(pettyCash.initialAmount, pettyCash.currency) },
      { label: 'Total Depósitos', value: pdfService.formatCurrency(pettyCash.totalDeposits, pettyCash.currency) },
      { label: 'Total Gastos', value: pdfService.formatCurrency(pettyCash.totalExpenses, pettyCash.currency) },
      { label: 'Saldo Actual', value: pdfService.formatCurrency(pettyCash.currentBalance, pettyCash.currency), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    // Movimientos
    if (transactions.length > 0) {
      y += 20;
      y = pdfService.addSectionTitle(doc, `Movimientos (${transactions.length})`, y);

      const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'];
      const rows = transactions.map(t => [
        pdfService.formatDate(t.date),
        typeLabels[t.type] || t.type,
        t.category || '-',
        (t.description || '-').substring(0, 30),
        pdfService.formatCurrency(t.amount, pettyCash.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.15,
        pageWidth * 0.12,
        pageWidth * 0.15,
        pageWidth * 0.40,
        pageWidth * 0.18,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['center', 'center', 'center', 'left', 'right'],
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
   * Generar reporte de transacción financiera
   */
  async generateTransactionReport(transaction) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Comprobante de Transacción - ${transaction.code}`,
        Subject: `Transacción ${transaction.type}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: transaction.type === 'INCOME' ? 'COMPROBANTE DE INGRESO' : 'COMPROBANTE DE EGRESO',
      subtitle: `Código: ${transaction.code}`,
    });

    // Información de la transacción
    y = pdfService.addSectionTitle(doc, 'Información de la Transacción', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: transaction.code },
      { label: 'Tipo', value: transaction.type === 'INCOME' ? 'Ingreso' : 'Egreso' },
      { label: 'Fecha', value: pdfService.formatDate(transaction.date) },
      { label: 'Estado', value: transaction.status },
      { label: 'Categoría', value: transaction.category?.name || transaction.category || '-' },
      { label: 'Cuenta', value: transaction.bankAccount?.bankName || '-' },
      { label: 'Método de Pago', value: transaction.paymentMethod || '-' },
      { label: 'Referencia', value: transaction.referenceNumber || '-' },
    ], y, { columns: 2 });

    // Monto
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto', value: pdfService.formatCurrency(transaction.amount, transaction.currency), isTotal: true },
    ], y, { alignRight: false, width: 250 });

    // Descripción
    if (transaction.description) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Descripción', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(transaction.description, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de préstamo
   */
  async generateLoanReport(loan, payments = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Préstamo - ${loan.code}`,
        Subject: `Préstamo a ${loan.employee?.firstName} ${loan.employee?.lastName}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE PRÉSTAMO',
      subtitle: `Código: ${loan.code}`,
    });

    // Información del préstamo
    y = pdfService.addSectionTitle(doc, 'Información del Préstamo', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: loan.code },
      { label: 'Empleado', value: `${loan.employee?.firstName || ''} ${loan.employee?.lastName || ''}` },
      { label: 'Tipo', value: loan.loanType || '-' },
      { label: 'Estado', value: loan.status },
      { label: 'Fecha Solicitud', value: pdfService.formatDate(loan.requestDate) },
      { label: 'Fecha Aprobación', value: pdfService.formatDate(loan.approvalDate) },
      { label: 'Cuotas Totales', value: loan.totalInstallments?.toString() || '-' },
      { label: 'Cuotas Pagadas', value: loan.paidInstallments?.toString() || '0' },
    ], y, { columns: 2 });

    // Resumen financiero
    y += 10;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto del Préstamo', value: pdfService.formatCurrency(loan.amount, loan.currency) },
      { label: 'Cuota Mensual', value: pdfService.formatCurrency(loan.installmentAmount, loan.currency) },
      { label: 'Total Pagado', value: pdfService.formatCurrency(loan.amount - loan.remainingAmount, loan.currency) },
      { label: 'Saldo Pendiente', value: pdfService.formatCurrency(loan.remainingAmount, loan.currency), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    // Historial de pagos
    if (payments.length > 0) {
      y += 30;
      y = pdfService.addSectionTitle(doc, 'Historial de Pagos', y);

      const headers = ['Fecha', 'Monto', 'Método', 'Referencia', 'Estado'];
      const rows = payments.map(p => [
        pdfService.formatDate(p.paymentDate),
        pdfService.formatCurrency(p.amount, loan.currency),
        p.paymentMethod || '-',
        p.referenceNumber || '-',
        p.status || '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.20,
        pageWidth * 0.20,
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
          columnAligns: ['center', 'right', 'center', 'center', 'center'],
        },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de cotización
   */
  async generateQuoteReport(quote, items = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Cotización - ${quote.code}`,
        Subject: `Cotización de ${quote.supplier?.name || 'Proveedor'}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'COTIZACIÓN',
      subtitle: `Código: ${quote.code}`,
    });

    // Información de la cotización
    y = pdfService.addSectionTitle(doc, 'Información de la Cotización', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: quote.code },
      { label: 'Proveedor', value: quote.supplier?.name || quote.supplierName || '-' },
      { label: 'Fecha', value: pdfService.formatDate(quote.quoteDate || quote.date) },
      { label: 'Válida hasta', value: pdfService.formatDate(quote.validUntil) },
      { label: 'Estado', value: quote.status },
      { label: 'Proyecto', value: quote.project?.name || '-' },
    ], y, { columns: 2 });

    // Items de la cotización
    if (items.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Detalle de Items', y);

      const headers = ['Item', 'Cantidad', 'Precio Unit.', 'Total'];
      const rows = items.map(i => [
        i.description || i.item?.name || '-',
        i.quantity?.toString() || '-',
        pdfService.formatCurrency(i.unitPrice, quote.currency),
        pdfService.formatCurrency(i.total || (i.quantity * i.unitPrice), quote.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.40,
        pageWidth * 0.15,
        pageWidth * 0.22,
        pageWidth * 0.23,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['left', 'center', 'right', 'right'],
        },
      });
    }

    // Totales
    y += 10;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Subtotal', value: pdfService.formatCurrency(quote.subtotal, quote.currency) },
      { label: 'IVA', value: pdfService.formatCurrency(quote.tax || 0, quote.currency) },
      { label: 'Total', value: pdfService.formatCurrency(quote.total, quote.currency), isTotal: true },
    ], y);

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de orden de compra
   */
  async generatePurchaseOrderReport(order, items = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Orden de Compra - ${order.code}`,
        Subject: `Orden de compra a ${order.supplier?.name || 'Proveedor'}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'ORDEN DE COMPRA',
      subtitle: `Código: ${order.code}`,
    });

    // Información de la orden
    y = pdfService.addSectionTitle(doc, 'Información de la Orden', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: order.code },
      { label: 'Proveedor', value: order.supplier?.name || order.supplierName || '-' },
      { label: 'Fecha', value: pdfService.formatDate(order.orderDate || order.date) },
      { label: 'Fecha Entrega', value: pdfService.formatDate(order.expectedDeliveryDate) },
      { label: 'Estado', value: order.status },
      { label: 'Proyecto', value: order.project?.name || '-' },
      { label: 'Almacén Destino', value: order.warehouse?.name || '-' },
      { label: 'Condiciones de Pago', value: order.paymentTerms || '-' },
    ], y, { columns: 2 });

    // Items de la orden
    if (items.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Detalle de Items', y);

      const headers = ['Item', 'Cantidad', 'Precio Unit.', 'Total'];
      const rows = items.map(i => [
        i.description || i.item?.name || '-',
        i.quantity?.toString() || '-',
        pdfService.formatCurrency(i.unitPrice, order.currency),
        pdfService.formatCurrency(i.total || (i.quantity * i.unitPrice), order.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.40,
        pageWidth * 0.15,
        pageWidth * 0.22,
        pageWidth * 0.23,
      ];

      y = pdfService.createTable(doc, {
        headers,
        rows,
        startY: y,
        columnWidths,
        options: {
          columnAligns: ['left', 'center', 'right', 'right'],
        },
      });
    }

    // Totales
    y += 10;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Subtotal', value: pdfService.formatCurrency(order.subtotal, order.currency) },
      { label: 'IVA', value: pdfService.formatCurrency(order.tax || 0, order.currency) },
      { label: 'Total', value: pdfService.formatCurrency(order.total, order.currency), isTotal: true },
    ], y);

    // Notas
    if (order.notes) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Notas', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(order.notes, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de pago a contratista
   */
  async generateContractorPaymentReport(payment) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Comprobante de Pago - ${payment.code}`,
        Subject: `Pago a ${payment.contractor?.companyName || 'Contratista'}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'COMPROBANTE DE PAGO A CONTRATISTA',
      subtitle: `Código: ${payment.code}`,
    });

    // Información del pago
    y = pdfService.addSectionTitle(doc, 'Información del Pago', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: payment.code },
      { label: 'Contratista', value: payment.contractor?.companyName || '-' },
      { label: 'RIF', value: payment.contractor?.rif || '-' },
      { label: 'Fecha de Pago', value: pdfService.formatDate(payment.paymentDate) },
      { label: 'Método de Pago', value: payment.paymentMethod || '-' },
      { label: 'Referencia', value: payment.referenceNumber || '-' },
      { label: 'Proyecto', value: payment.project?.name || '-' },
      { label: 'Factura', value: payment.invoice?.invoiceNumber || '-' },
    ], y, { columns: 2 });

    // Monto
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto del Pago', value: pdfService.formatCurrency(payment.amount, payment.currency), isTotal: true },
    ], y, { alignRight: false, width: 250 });

    // Descripción
    if (payment.description || payment.notes) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Descripción', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(payment.description || payment.notes, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de factura de contratista
   */
  async generateContractorInvoiceReport(invoice) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Factura - ${invoice.invoiceNumber}`,
        Subject: `Factura de ${invoice.contractor?.companyName || 'Contratista'}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'FACTURA DE CONTRATISTA',
      subtitle: `N° ${invoice.invoiceNumber}`,
    });

    // Información de la factura
    y = pdfService.addSectionTitle(doc, 'Información de la Factura', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: invoice.code },
      { label: 'N° Factura', value: invoice.invoiceNumber },
      { label: 'Contratista', value: invoice.contractor?.companyName || '-' },
      { label: 'RIF', value: invoice.contractor?.rif || '-' },
      { label: 'Fecha Factura', value: pdfService.formatDate(invoice.invoiceDate) },
      { label: 'Fecha Vencimiento', value: pdfService.formatDate(invoice.dueDate) },
      { label: 'Proyecto', value: invoice.project?.name || '-' },
      { label: 'Estado', value: invoice.status },
    ], y, { columns: 2 });

    // Totales
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Subtotal', value: pdfService.formatCurrency(invoice.subtotal, invoice.currency) },
      { label: 'IVA', value: pdfService.formatCurrency(invoice.tax || 0, invoice.currency) },
      { label: 'Total Factura', value: pdfService.formatCurrency(invoice.total, invoice.currency) },
      { label: 'Monto Pagado', value: pdfService.formatCurrency(invoice.paidAmount || 0, invoice.currency) },
      { label: 'Saldo Pendiente', value: pdfService.formatCurrency(invoice.pendingAmount || invoice.total - (invoice.paidAmount || 0), invoice.currency), isTotal: true },
    ], y, { alignRight: false, width: 300 });

    pdfService.addFooter(doc, { pageNumber: 1 });

    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de vehículo
   */
  async generateVehicleReport(vehicle, maintenances = [], fuelLogs = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Vehículo - ${vehicle.plate}`,
        Subject: `Información del vehículo ${vehicle.brand} ${vehicle.model}`,
      },
    });

    const statusLabels = { AVAILABLE: 'Disponible', IN_USE: 'En Uso', MAINTENANCE: 'En Mantenimiento', OUT_OF_SERVICE: 'Fuera de Servicio' };
    
    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE VEHÍCULO',
      subtitle: `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`,
      entityInfo: `Conductor: ${vehicle.driver ? `${vehicle.driver.firstName} ${vehicle.driver.lastName}` : 'Sin asignar'} | Estado: ${statusLabels[vehicle.status] || vehicle.status}`,
    });

    // Información del vehículo
    y = pdfService.addSectionTitle(doc, 'Información del Vehículo', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Placa', value: vehicle.plate },
      { label: 'Marca', value: vehicle.brand },
      { label: 'Modelo', value: vehicle.model },
      { label: 'Año', value: vehicle.year?.toString() || '-' },
      { label: 'Color', value: vehicle.color || '-' },
      { label: 'Tipo', value: vehicle.vehicleType || '-' },
      { label: 'Estado', value: vehicle.status },
      { label: 'Kilometraje', value: vehicle.currentMileage ? `${vehicle.currentMileage} km` : '-' },
      { label: 'Conductor', value: vehicle.driver ? `${vehicle.driver.firstName} ${vehicle.driver.lastName}` : '-' },
      { label: 'VIN', value: vehicle.vin || '-' },
    ], y, { columns: 2 });

    // Últimos mantenimientos
    if (maintenances.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Últimos Mantenimientos', y);

      const headers = ['Fecha', 'Tipo', 'Descripción', 'Costo'];
      const rows = maintenances.slice(0, 10).map(m => [
        pdfService.formatDate(m.maintenanceDate || m.date),
        m.maintenanceType || '-',
        (m.description || '-').substring(0, 30),
        pdfService.formatCurrency(m.cost, m.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.20,
        pageWidth * 0.20,
        pageWidth * 0.40,
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
   * Generar reporte de listado de transacciones
   */
  async generateTransactionsListReport(transactions, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Transacciones',
        Subject: 'Reporte de transacciones financieras',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE TRANSACCIONES',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const income = transactions.filter(t => t.transactionType === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const expense = transactions.filter(t => t.transactionType === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Transacciones', value: transactions.length.toString() },
      { label: 'Total Ingresos', value: pdfService.formatCurrency(income) },
      { label: 'Total Egresos', value: pdfService.formatCurrency(expense) },
      { label: 'Balance', value: pdfService.formatCurrency(income - expense) },
    ], y, { columns: 4 });

    y += 10;

    // Tabla
    const headers = ['Fecha', 'Código', 'Tipo', 'Cuenta', 'Descripción', 'Monto'];
    const rows = transactions.map(t => [
      pdfService.formatDate(t.transactionDate || t.date),
      t.code || '-',
      t.transactionType === 'INCOME' ? 'Ingreso' : 'Egreso',
      t.account?.name || t.account?.bankName || '-',
      (t.description || '-').substring(0, 30),
      pdfService.formatCurrency(t.amount, t.currency),
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.18,
      pageWidth * 0.28, pageWidth * 0.18,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['center', 'left', 'center', 'left', 'left', 'right'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de préstamos
   */
  async generateLoansListReport(loans, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Préstamos',
        Subject: 'Reporte de préstamos a empleados',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE PRÉSTAMOS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalAmount = loans.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
    const totalRemaining = loans.reduce((sum, l) => sum + (parseFloat(l.remainingAmount) || 0), 0);
    const activeLoans = loans.filter(l => l.status === 'ACTIVE').length;

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Préstamos', value: loans.length.toString() },
      { label: 'Activos', value: activeLoans.toString() },
      { label: 'Monto Total', value: pdfService.formatCurrency(totalAmount) },
      { label: 'Saldo Pendiente', value: pdfService.formatCurrency(totalRemaining) },
    ], y, { columns: 4 });

    y += 10;

    // Tabla
    const headers = ['Código', 'Empleado', 'Tipo', 'Monto', 'Cuota', 'Pagado', 'Pendiente', 'Estado'];
    const rows = loans.map(l => [
      l.code || '-',
      l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : '-',
      l.loanType || '-',
      pdfService.formatCurrency(l.amount, l.currency),
      pdfService.formatCurrency(l.installmentAmount, l.currency),
      `${l.paidInstallments || 0}/${l.totalInstallments || 0}`,
      pdfService.formatCurrency(l.remainingAmount, l.currency),
      l.status,
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.10, pageWidth * 0.20, pageWidth * 0.10, pageWidth * 0.12,
      pageWidth * 0.12, pageWidth * 0.10, pageWidth * 0.14, pageWidth * 0.12,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['left', 'left', 'center', 'right', 'right', 'center', 'right', 'center'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de cuenta bancaria
   */
  async generateBankAccountReport(account, transactions = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Reporte de Cuenta - ${account.accountNumber}`,
        Subject: `Estado de cuenta ${account.bankName}`,
      },
    });

    const statusLabels = { ACTIVE: 'Activa', INACTIVE: 'Inactiva', CLOSED: 'Cerrada' };
    const accountTypeLabels = { CHECKING: 'Corriente', SAVINGS: 'Ahorro', CREDIT: 'Crédito' };
    
    let y = pdfService.addHeader(doc, {
      title: 'ESTADO DE CUENTA BANCARIA',
      subtitle: `${account.bankName} - ${account.accountNumber}`,
      entityInfo: `Tipo: ${accountTypeLabels[account.accountType] || account.accountType} | Saldo: ${pdfService.formatCurrency(account.currentBalance, account.currency)}`,
    });

    // Información de la cuenta
    y = pdfService.addSectionTitle(doc, 'Información de la Cuenta', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Banco', value: account.bankName },
      { label: 'Número de Cuenta', value: account.accountNumber },
      { label: 'Tipo de Cuenta', value: account.accountType },
      { label: 'Moneda', value: account.currency },
      { label: 'Estado', value: account.status },
      { label: 'Saldo Actual', value: pdfService.formatCurrency(account.currentBalance, account.currency) },
    ], y, { columns: 2 });

    // Últimas transacciones
    if (transactions.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Últimas Transacciones', y);

      const headers = ['Fecha', 'Tipo', 'Descripción', 'Monto'];
      const rows = transactions.slice(0, 20).map(t => [
        pdfService.formatDate(t.date),
        t.type === 'INCOME' ? 'Ingreso' : 'Egreso',
        (t.description || '-').substring(0, 35),
        pdfService.formatCurrency(t.amount, t.currency),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.18, pageWidth * 0.15, pageWidth * 0.47, pageWidth * 0.20];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['center', 'center', 'left', 'right'] },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de movimiento de caja chica
   */
  async generatePettyCashEntryReport(entry) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Comprobante de Caja Chica - ${entry.code || entry.id}`,
        Subject: `Movimiento de caja chica`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: entry.type === 'EXPENSE' ? 'COMPROBANTE DE GASTO' : 'COMPROBANTE DE DEPÓSITO',
      subtitle: `Caja Chica: ${entry.pettyCash?.name || 'N/A'}`,
    });

    // Información del movimiento
    y = pdfService.addSectionTitle(doc, 'Información del Movimiento', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: entry.code || entry.id },
      { label: 'Tipo', value: entry.type === 'EXPENSE' ? 'Gasto' : 'Depósito' },
      { label: 'Fecha', value: pdfService.formatDate(entry.date || entry.createdAt) },
      { label: 'Categoría', value: entry.category || '-' },
      { label: 'Responsable', value: entry.employee ? `${entry.employee.firstName} ${entry.employee.lastName}` : '-' },
      { label: 'Proyecto', value: entry.project?.name || '-' },
    ], y, { columns: 2 });

    // Monto
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Monto', value: pdfService.formatCurrency(entry.amount, entry.currency), isTotal: true },
    ], y, { alignRight: false, width: 250 });

    // Descripción
    if (entry.description) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Descripción', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(entry.description, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de combustibles
   */
  async generateFuelLogsReport(fuelLogs, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Recargas de Combustible',
        Subject: 'Reporte de consumo de combustible',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE RECARGAS DE COMBUSTIBLE',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalLiters = fuelLogs.reduce((sum, f) => sum + (parseFloat(f.liters) || 0), 0);
    const totalCost = fuelLogs.reduce((sum, f) => sum + (parseFloat(f.totalCost) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Recargas', value: fuelLogs.length.toString() },
      { label: 'Total Litros', value: `${totalLiters.toFixed(2)} L` },
      { label: 'Costo Total', value: pdfService.formatCurrency(totalCost) },
    ], y, { columns: 3 });

    y += 10;

    // Tabla
    const headers = ['Fecha', 'Vehículo', 'Conductor', 'Litros', 'Precio/L', 'Total', 'Km'];
    const rows = fuelLogs.map(f => [
      pdfService.formatDate(f.date),
      f.vehicle?.plate || '-',
      f.driver ? `${f.driver.firstName} ${f.driver.lastName}` : '-',
      `${f.liters || 0} L`,
      pdfService.formatCurrency(f.pricePerLiter, f.currency),
      pdfService.formatCurrency(f.totalCost, f.currency),
      f.mileage ? `${f.mileage.toLocaleString()} km` : '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.22, pageWidth * 0.10,
      pageWidth * 0.14, pageWidth * 0.15, pageWidth * 0.15,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['center', 'left', 'left', 'right', 'right', 'right', 'right'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de detalle de combustible
   */
  async generateFuelLogDetailReport(fuelLog) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Recarga de Combustible - ${fuelLog.code || fuelLog.id}`,
        Subject: `Detalle de recarga de combustible`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'COMPROBANTE DE RECARGA DE COMBUSTIBLE',
      subtitle: `Vehículo: ${fuelLog.vehicle?.plate || 'N/A'}`,
    });

    // Información
    y = pdfService.addSectionTitle(doc, 'Información de la Recarga', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: fuelLog.code || fuelLog.id },
      { label: 'Fecha', value: pdfService.formatDate(fuelLog.date) },
      { label: 'Vehículo', value: fuelLog.vehicle ? `${fuelLog.vehicle.brand} ${fuelLog.vehicle.model} (${fuelLog.vehicle.plate})` : '-' },
      { label: 'Conductor', value: fuelLog.driver ? `${fuelLog.driver.firstName} ${fuelLog.driver.lastName}` : '-' },
      { label: 'Tipo de Combustible', value: fuelLog.fuelType || '-' },
      { label: 'Estación', value: fuelLog.station || '-' },
      { label: 'Kilometraje', value: fuelLog.mileage ? `${fuelLog.mileage.toLocaleString()} km` : '-' },
    ], y, { columns: 2 });

    // Detalle
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Litros', value: `${fuelLog.liters || 0} L` },
      { label: 'Precio por Litro', value: pdfService.formatCurrency(fuelLog.pricePerLiter, fuelLog.currency) },
      { label: 'Costo Total', value: pdfService.formatCurrency(fuelLog.totalCost, fuelLog.currency), isTotal: true },
    ], y, { alignRight: false, width: 280 });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de mantenimientos
   */
  async generateMaintenancesReport(maintenances, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Mantenimientos',
        Subject: 'Reporte de mantenimientos de vehículos',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE MANTENIMIENTOS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalCost = maintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Mantenimientos', value: maintenances.length.toString() },
      { label: 'Costo Total', value: pdfService.formatCurrency(totalCost) },
    ], y, { columns: 2 });

    y += 10;

    // Tabla
    const headers = ['Fecha', 'Vehículo', 'Tipo', 'Descripción', 'Costo', 'Estado'];
    const rows = maintenances.map(m => [
      pdfService.formatDate(m.maintenanceDate || m.date),
      m.vehicle?.plate || '-',
      m.maintenanceType || '-',
      (m.description || '-').substring(0, 30),
      pdfService.formatCurrency(m.cost, m.currency),
      m.status || '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.15, pageWidth * 0.31,
      pageWidth * 0.15, pageWidth * 0.15,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['center', 'left', 'center', 'left', 'right', 'center'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de detalle de mantenimiento
   */
  async generateMaintenanceDetailReport(maintenance) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Mantenimiento - ${maintenance.code || maintenance.id}`,
        Subject: `Detalle de mantenimiento`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'COMPROBANTE DE MANTENIMIENTO',
      subtitle: `Vehículo: ${maintenance.vehicle?.plate || 'N/A'}`,
    });

    // Información
    y = pdfService.addSectionTitle(doc, 'Información del Mantenimiento', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: maintenance.code || maintenance.id },
      { label: 'Fecha', value: pdfService.formatDate(maintenance.maintenanceDate || maintenance.date) },
      { label: 'Vehículo', value: maintenance.vehicle ? `${maintenance.vehicle.brand} ${maintenance.vehicle.model} (${maintenance.vehicle.plate})` : '-' },
      { label: 'Tipo', value: maintenance.maintenanceType || '-' },
      { label: 'Estado', value: maintenance.status || '-' },
      { label: 'Kilometraje', value: maintenance.mileage ? `${maintenance.mileage.toLocaleString()} km` : '-' },
      { label: 'Proveedor', value: maintenance.provider || '-' },
      { label: 'Próximo Mantenimiento', value: pdfService.formatDate(maintenance.nextMaintenanceDate) },
    ], y, { columns: 2 });

    // Costo
    y += 20;
    y = pdfService.addSummaryBox(doc, [
      { label: 'Costo Total', value: pdfService.formatCurrency(maintenance.cost, maintenance.currency), isTotal: true },
    ], y, { alignRight: false, width: 250 });

    // Descripción
    if (maintenance.description) {
      y += 20;
      y = pdfService.addSectionTitle(doc, 'Descripción', y);
      
      doc.font(pdfService.fonts.regular)
         .fontSize(10)
         .fillColor(pdfService.colors.text)
         .text(maintenance.description, doc.page.margins.left, y, {
           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
         });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de cotizaciones
   */
  async generateQuotesListReport(quotes, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Cotizaciones',
        Subject: 'Reporte de cotizaciones',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE COTIZACIONES',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalAmount = quotes.reduce((sum, q) => sum + (parseFloat(q.total) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Cotizaciones', value: quotes.length.toString() },
      { label: 'Monto Total', value: pdfService.formatCurrency(totalAmount) },
    ], y, { columns: 2 });

    y += 10;

    // Tabla
    const headers = ['Código', 'Fecha', 'Proveedor', 'Proyecto', 'Total', 'Estado'];
    const rows = quotes.map(q => [
      q.code || '-',
      pdfService.formatDate(q.quoteDate || q.date),
      q.supplier?.name?.substring(0, 20) || '-',
      q.project?.name?.substring(0, 20) || '-',
      pdfService.formatCurrency(q.total, q.currency),
      q.status || '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.22, pageWidth * 0.22,
      pageWidth * 0.17, pageWidth * 0.15,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['left', 'center', 'left', 'left', 'right', 'center'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de órdenes de compra
   */
  async generatePurchaseOrdersListReport(orders, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Órdenes de Compra',
        Subject: 'Reporte de órdenes de compra',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE ÓRDENES DE COMPRA',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalAmount = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Órdenes', value: orders.length.toString() },
      { label: 'Monto Total', value: pdfService.formatCurrency(totalAmount) },
    ], y, { columns: 2 });

    y += 10;

    // Tabla
    const headers = ['Código', 'Fecha', 'Proveedor', 'Proyecto', 'Total', 'Estado'];
    const rows = orders.map(o => [
      o.code || '-',
      pdfService.formatDate(o.orderDate || o.date),
      o.supplier?.name?.substring(0, 20) || '-',
      o.project?.name?.substring(0, 20) || '-',
      pdfService.formatCurrency(o.total, o.currency),
      o.status || '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.22, pageWidth * 0.22,
      pageWidth * 0.17, pageWidth * 0.15,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['left', 'center', 'left', 'left', 'right', 'center'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de facturas de contratistas
   */
  async generateContractorInvoicesListReport(invoices, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Facturas de Contratistas',
        Subject: 'Reporte de facturas de contratistas',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE FACTURAS DE CONTRATISTAS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalAmount = invoices.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const totalPaid = invoices.reduce((sum, i) => sum + (parseFloat(i.paidAmount) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Facturas', value: invoices.length.toString() },
      { label: 'Monto Total', value: pdfService.formatCurrency(totalAmount) },
      { label: 'Total Pagado', value: pdfService.formatCurrency(totalPaid) },
      { label: 'Pendiente', value: pdfService.formatCurrency(totalAmount - totalPaid) },
    ], y, { columns: 4 });

    y += 10;

    // Tabla
    const headers = ['N° Factura', 'Fecha', 'Contratista', 'Proyecto', 'Total', 'Pagado', 'Estado'];
    const rows = invoices.map(i => [
      i.invoiceNumber || '-',
      pdfService.formatDate(i.invoiceDate),
      i.contractor?.companyName?.substring(0, 18) || '-',
      i.project?.name?.substring(0, 15) || '-',
      pdfService.formatCurrency(i.total, i.currency),
      pdfService.formatCurrency(i.paidAmount || 0, i.currency),
      i.status || '-',
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.10, pageWidth * 0.18, pageWidth * 0.16,
      pageWidth * 0.14, pageWidth * 0.14, pageWidth * 0.16,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['left', 'center', 'left', 'left', 'right', 'right', 'center'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de listado de pagos a contratistas
   */
  async generateContractorPaymentsListReport(payments, filters = {}) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: 'Listado de Pagos a Contratistas',
        Subject: 'Reporte de pagos a contratistas',
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'LISTADO DE PAGOS A CONTRATISTAS',
      subtitle: this._buildFilterSubtitle(filters),
    });

    // Resumen
    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Total Pagos', value: payments.length.toString() },
      { label: 'Monto Total', value: pdfService.formatCurrency(totalAmount) },
    ], y, { columns: 2 });

    y += 10;

    // Tabla
    const headers = ['Código', 'Fecha', 'Contratista', 'Proyecto', 'Método', 'Monto'];
    const rows = payments.map(p => [
      p.code || '-',
      pdfService.formatDate(p.paymentDate),
      p.contractor?.companyName?.substring(0, 20) || '-',
      p.project?.name?.substring(0, 18) || '-',
      p.paymentMethod || '-',
      pdfService.formatCurrency(p.amount, p.currency),
    ]);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidths = [
      pageWidth * 0.12, pageWidth * 0.12, pageWidth * 0.22, pageWidth * 0.20,
      pageWidth * 0.15, pageWidth * 0.19,
    ];

    y = pdfService.createTable(doc, {
      headers, rows, startY: y, columnWidths,
      options: { columnAligns: ['left', 'center', 'left', 'left', 'center', 'right'] },
    });

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de item de inventario
   */
  async generateInventoryItemReport(item, stocks = [], movements = []) {
    const doc = pdfService.createDocument({
      info: {
        Title: `Item de Inventario - ${item.code || item.sku}`,
        Subject: `Detalle de item ${item.name}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE ITEM DE INVENTARIO',
      subtitle: `${item.code || item.sku} - ${item.name}`,
    });

    // Información del item
    y = pdfService.addSectionTitle(doc, 'Información del Item', y);
    
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Código', value: item.code || item.sku },
      { label: 'Nombre', value: item.name },
      { label: 'Categoría', value: item.category?.name || '-' },
      { label: 'Unidad', value: item.unit || '-' },
      { label: 'Precio Unitario', value: pdfService.formatCurrency(item.unitPrice, item.currency) },
      { label: 'Stock Mínimo', value: item.minStock?.toString() || '-' },
    ], y, { columns: 2 });

    // Stock por almacén
    if (stocks.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Stock por Almacén', y);

      const headers = ['Almacén', 'Cantidad', 'Stock Mín.', 'Estado'];
      const rows = stocks.map(s => [
        s.warehouse?.name || '-',
        s.quantity?.toString() || '0',
        s.minStock?.toString() || '-',
        s.quantity <= (s.minStock || 0) ? 'BAJO' : 'OK',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.40, pageWidth * 0.20, pageWidth * 0.20, pageWidth * 0.20];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'right', 'right', 'center'] },
      });
    }

    // Últimos movimientos
    if (movements.length > 0) {
      y += 10;
      y = pdfService.addSectionTitle(doc, 'Últimos Movimientos', y);

      const headers = ['Fecha', 'Tipo', 'Cantidad', 'Almacén'];
      const rows = movements.slice(0, 15).map(m => [
        pdfService.formatDate(m.createdAt),
        m.movementType || '-',
        m.quantity?.toString() || '0',
        m.sourceWarehouse?.name || m.destinationWarehouse?.name || '-',
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [pageWidth * 0.25, pageWidth * 0.25, pageWidth * 0.20, pageWidth * 0.30];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['center', 'center', 'right', 'left'] },
      });
    }

    pdfService.addFooter(doc, { pageNumber: 1 });
    return pdfService.generateBuffer(doc);
  }

  /**
   * Generar reporte de almacén
   */
  async generateWarehouseReport(warehouse, items = []) {
    const doc = pdfService.createDocument({
      size: 'LETTER',
      layout: 'landscape',
      info: {
        Title: `Reporte de Almacén - ${warehouse.name}`,
        Subject: `Inventario del almacén ${warehouse.name}`,
      },
    });

    let y = pdfService.addHeader(doc, {
      title: 'REPORTE DE ALMACÉN',
      subtitle: warehouse.name,
    });

    // Información del almacén
    y = pdfService.addKeyValuePairs(doc, [
      { label: 'Nombre', value: warehouse.name },
      { label: 'Código', value: warehouse.code || '-' },
      { label: 'Tipo', value: warehouse.warehouseType || '-' },
      { label: 'Ubicación', value: warehouse.location || '-' },
      { label: 'Estado', value: warehouse.status || '-' },
      { label: 'Total Items', value: items.length.toString() },
    ], y, { columns: 3 });

    y += 10;

    // Tabla de items
    if (items.length > 0) {
      const headers = ['Código', 'Producto', 'Categoría', 'Cantidad', 'Unidad', 'P. Unitario', 'Valor Total'];
      const rows = items.map(i => [
        i.code || i.sku || '-',
        i.name?.substring(0, 25) || '-',
        i.category?.name || '-',
        i.quantity?.toString() || '0',
        i.unit || '-',
        pdfService.formatCurrency(i.unitPrice),
        pdfService.formatCurrency((i.quantity || 0) * (i.unitPrice || 0)),
      ]);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidths = [
        pageWidth * 0.10, pageWidth * 0.25, pageWidth * 0.15, pageWidth * 0.10,
        pageWidth * 0.08, pageWidth * 0.14, pageWidth * 0.18,
      ];

      y = pdfService.createTable(doc, {
        headers, rows, startY: y, columnWidths,
        options: { columnAligns: ['left', 'left', 'left', 'right', 'center', 'right', 'right'] },
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
    if (filters.type) parts.push(`Tipo: ${filters.type}`);
    if (filters.maintenanceType) parts.push(`Tipo: ${filters.maintenanceType}`);
    if (filters.startDate && filters.endDate) {
      parts.push(`${pdfService.formatDate(filters.startDate)} - ${pdfService.formatDate(filters.endDate)}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'Todos los registros';
  }
}

module.exports = new ReportService();
