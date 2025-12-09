const reportService = require('../services/reportService');
const pdfService = require('../services/pdfService');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

/**
 * Controlador de reportes PDF
 */
class ReportController {
  /**
   * Generar y descargar reporte de proyecto individual
   */
  async downloadProjectReport(req, res, next) {
    try {
      const { id } = req.params;
      const { 
        Project, Employee, Department, Contractor,
        ProjectMember, ProjectMilestone, ProjectExpense,
        ContractorPayment, ProjectUpdate
      } = require('../../../database/models');

      const project = await Project.findByPk(id, {
        include: [
          { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
          { model: Department, as: 'department', attributes: ['id', 'name'] },
          { model: Contractor, as: 'contractor', attributes: ['id', 'name', 'companyName', 'rif'] },
        ],
      });

      if (!project) {
        throw new NotFoundError('Proyecto no encontrado');
      }

      // Obtener miembros del equipo
      let members = [];
      if (ProjectMember) {
        members = await ProjectMember.findAll({
          where: { project_id: id },
          include: [
            { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          ],
        });
      }

      // Obtener hitos
      let milestones = [];
      if (ProjectMilestone) {
        milestones = await ProjectMilestone.findAll({
          where: { project_id: id },
          order: [['due_date', 'ASC']],
        });
      }

      // Obtener gastos
      let expenses = [];
      if (ProjectExpense) {
        expenses = await ProjectExpense.findAll({
          where: { project_id: id },
          order: [['expense_date', 'DESC']],
          limit: 20,
        });
      }

      // Obtener pagos a contratista (para proyectos OUTSOURCED)
      let contractorPayments = [];
      if (ContractorPayment && project.executionType === 'OUTSOURCED') {
        contractorPayments = await ContractorPayment.findAll({
          where: { project_id: id },
          order: [['payment_date', 'DESC']],
        });
      }

      // Obtener actualizaciones recientes
      let updates = [];
      if (ProjectUpdate) {
        updates = await ProjectUpdate.findAll({
          where: { project_id: id },
          include: [
            { model: Employee, as: 'createdByEmployee', attributes: ['id', 'firstName', 'lastName'], required: false },
          ],
          order: [['created_at', 'DESC']],
          limit: 10,
        });
      }

      const pdfBuffer = await reportService.generateProjectReport(
        project.toJSON(),
        {
          members: members.map(m => m.toJSON()),
          milestones: milestones.map(m => m.toJSON()),
          expenses: expenses.map(e => e.toJSON()),
          contractorPayments: contractorPayments.map(p => p.toJSON()),
          updates: updates.map(u => u.toJSON()),
        }
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="proyecto-${project.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de proyectos
   */
  async downloadProjectsListReport(req, res, next) {
    try {
      const { Project, Employee, Department, Contractor } = require('../../../database/models');
      const { status, priority, executionType, departmentId, startDate, endDate } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (executionType) whereClause.executionType = executionType;
      if (departmentId) whereClause.departmentId = departmentId;

      const projects = await Project.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
          { model: Department, as: 'department', attributes: ['id', 'name'] },
          { model: Contractor, as: 'contractor', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'DESC']],
      });

      const pdfBuffer = await reportService.generateProjectsListReport(
        projects.map(p => p.toJSON()),
        { status, priority, executionType, startDate, endDate }
      );

      const filename = `proyectos-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar ficha de empleado
   */
  async downloadEmployeeReport(req, res, next) {
    try {
      const { id } = req.params;
      const { includeSalary } = req.query;
      const { Employee, Position, Department, PayrollEntry, PayrollPeriod, EmployeeLoan } = require('../../../database/models');

      const employee = await Employee.findByPk(id, {
        include: [
          { model: Position, as: 'positionRef', attributes: ['id', 'name'] },
          { model: Department, as: 'departmentRef', attributes: ['id', 'name'] },
          { model: Employee, as: 'supervisor', attributes: ['id', 'firstName', 'lastName'] },
        ],
      });

      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      // Obtener últimas nóminas
      let payrollEntries = [];
      if (PayrollEntry) {
        payrollEntries = await PayrollEntry.findAll({
          where: { employee_id: id },
          include: [
            { model: PayrollPeriod, as: 'period', attributes: ['id', 'name', 'startDate', 'endDate'] },
          ],
          order: [['created_at', 'DESC']],
          limit: 6,
        });
      }

      // Obtener préstamos
      let loans = [];
      if (EmployeeLoan) {
        loans = await EmployeeLoan.findAll({
          where: { employee_id: id },
          order: [['created_at', 'DESC']],
          limit: 5,
        });
      }

      // Mapear para el servicio de reportes
      const employeeData = {
        ...employee.toJSON(),
        position: employee.positionRef,
        department: employee.departmentRef,
      };

      const pdfBuffer = await reportService.generateEmployeeReport(
        employeeData,
        { 
          includeSalary: includeSalary === 'true',
          payrollEntries: payrollEntries.map(p => p.toJSON()),
          loans: loans.map(l => l.toJSON()),
        }
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="empleado-${employee.employeeCode}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de empleados
   */
  async downloadEmployeesListReport(req, res, next) {
    try {
      const { Employee, Position, Department } = require('../../../database/models');
      const { status, departmentId, positionId } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (departmentId) whereClause.department_id = departmentId;
      if (positionId) whereClause.position_id = positionId;

      const employees = await Employee.findAll({
        where: whereClause,
        include: [
          { model: Position, as: 'positionRef', attributes: ['id', 'name'] },
          { model: Department, as: 'departmentRef', attributes: ['id', 'name'] },
        ],
        order: [['last_name', 'ASC'], ['first_name', 'ASC']],
      });

      // Mapear para el servicio de reportes
      const employeesData = employees.map(e => ({
        ...e.toJSON(),
        position: e.positionRef,
        department: e.departmentRef,
      }));

      const pdfBuffer = await reportService.generateEmployeesListReport(
        employeesData,
        { status, departmentId }
      );

      const filename = `empleados-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de nómina
   */
  async downloadPayrollReport(req, res, next) {
    try {
      const { id } = req.params;
      const { PayrollPeriod, PayrollEntry, Employee } = require('../../../database/models');

      const payroll = await PayrollPeriod.findByPk(id);

      if (!payroll) {
        throw new NotFoundError('Nómina no encontrada');
      }

      const details = await PayrollEntry.findAll({
        where: { period_id: id },
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        ],
      });

      // Mapear campos para el servicio de reportes
      const payrollData = {
        ...payroll.toJSON(),
        period: payroll.name || payroll.period_name,
        status: payroll.status,
      };

      const pdfBuffer = await reportService.generatePayrollReport(
        payrollData,
        details.map(d => ({
          ...d.toJSON(),
          grossSalary: d.gross_salary,
          totalDeductions: d.total_deductions,
          netSalary: d.net_salary,
        }))
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="nomina-${payrollData.period || id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar recibo de pago individual
   */
  async downloadPayslipReport(req, res, next) {
    try {
      const { payrollId, employeeId } = req.params;
      const { PayrollEntry, PayrollPeriod, Employee, Position, Department } = require('../../../database/models');

      const payrollEntry = await PayrollEntry.findOne({
        where: { period_id: payrollId, employee_id: employeeId },
        include: [
          { model: PayrollPeriod, as: 'period' },
        ],
      });

      if (!payrollEntry) {
        throw new NotFoundError('Detalle de nómina no encontrado');
      }

      const employee = await Employee.findByPk(employeeId, {
        include: [
          { model: Position, as: 'positionRef', attributes: ['id', 'name'] },
          { model: Department, as: 'departmentRef', attributes: ['id', 'name'] },
        ],
      });

      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }

      // Mapear campos para el servicio de reportes
      const payrollDetailData = {
        ...payrollEntry.toJSON(),
        baseSalary: payrollEntry.base_salary,
        grossSalary: payrollEntry.gross_salary,
        totalDeductions: payrollEntry.total_deductions,
        netSalary: payrollEntry.net_salary,
        overtimeAmount: payrollEntry.overtime_amount || 0,
        bonuses: payrollEntry.bonuses || 0,
        commissions: payrollEntry.commissions || 0,
        socialSecurityEmployee: payrollEntry.social_security_employee || 0,
        incomeTax: payrollEntry.income_tax || 0,
        otherDeductions: payrollEntry.other_deductions || 0,
        payroll: payrollEntry.period ? {
          period: payrollEntry.period.name || payrollEntry.period.period_name,
        } : null,
      };

      const employeeData = {
        ...employee.toJSON(),
        position: employee.positionRef,
        department: employee.departmentRef,
      };

      const pdfBuffer = await reportService.generatePayslipReport(
        payrollDetailData,
        employeeData
      );

      const period = payrollDetailData.payroll?.period || 'recibo';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="recibo-${employee.employeeCode}-${period}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de inventario
   */
  async downloadInventoryReport(req, res, next) {
    try {
      const { warehouseId } = req.query;
      const { InventoryItem, Warehouse, InventoryCategory, WarehouseStock } = require('../../../database/models');

      let warehouse = null;
      if (warehouseId) {
        warehouse = await Warehouse.findByPk(warehouseId);
      }

      // Si hay warehouseId, obtener items con stock en ese almacén
      let items;
      if (warehouseId) {
        const stocks = await WarehouseStock.findAll({
          where: { warehouse_id: warehouseId },
          include: [
            { 
              model: InventoryItem, 
              as: 'item',
              include: [
                { model: InventoryCategory, as: 'category', attributes: ['id', 'name'], required: false },
              ],
            },
          ],
        });
        
        items = stocks.map(s => ({
          ...s.item?.toJSON(),
          quantity: s.quantity,
          minStock: s.min_stock,
        }));
      } else {
        items = await InventoryItem.findAll({
          include: [
            { model: InventoryCategory, as: 'category', attributes: ['id', 'name'], required: false },
          ],
          order: [['name', 'ASC']],
        });
        items = items.map(i => i.toJSON());
      }

      const pdfBuffer = await reportService.generateInventoryReport(
        items,
        warehouse?.toJSON()
      );

      const filename = warehouse 
        ? `inventario-${warehouse.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : `inventario-general-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de caja chica
   */
  async downloadPettyCashReport(req, res, next) {
    try {
      const { id } = req.params;
      const { PettyCash, PettyCashEntry, Employee, Project } = require('../../../database/models');

      const pettyCash = await PettyCash.findByPk(id, {
        include: [
          { model: Employee, as: 'custodian', attributes: ['id', 'firstName', 'lastName'] },
        ],
      });

      if (!pettyCash) {
        throw new NotFoundError('Caja chica no encontrada');
      }

      const entries = await PettyCashEntry.findAll({
        where: { petty_cash_id: id },
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'], required: false },
          { model: Project, as: 'project', attributes: ['id', 'name', 'code'], required: false },
        ],
        order: [['created_at', 'DESC']],
        limit: 100,
      });

      // Mapear entries para el servicio de reportes
      const transactions = entries.map(e => ({
        code: e.code,
        date: e.date || e.created_at,
        type: e.type,
        category: e.category,
        description: e.description,
        amount: e.amount,
        employee: e.employee ? `${e.employee.firstName} ${e.employee.lastName}` : null,
        project: e.project?.name || null,
      }));

      const pdfBuffer = await reportService.generatePettyCashReport(
        pettyCash.toJSON(),
        transactions
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="caja-chica-${pettyCash.name || pettyCash.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de flota
   */
  async downloadFleetReport(req, res, next) {
    try {
      const { status } = req.query;
      const { Vehicle, Employee } = require('../../../database/models');

      const whereClause = {};
      if (status) whereClause.status = status;

      const vehicles = await Vehicle.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'driver', attributes: ['id', 'firstName', 'lastName'], required: false },
        ],
        order: [['plate', 'ASC']],
      });

      const pdfBuffer = await reportService.generateFleetReport(
        vehicles.map(v => v.toJSON())
      );

      const filename = `flota-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte HSE
   */
  async downloadHSEReport(req, res, next) {
    try {
      const { startDate, endDate, severity } = req.query;
      const { Op } = require('sequelize');
      
      // Intentar cargar el modelo de incidentes HSE
      let HSEIncident;
      try {
        const models = require('../../../database/models');
        HSEIncident = models.HSEIncident || models.Incident;
      } catch (e) {
        // Si no existe el modelo, devolver reporte vacío
        logger.warn('Modelo HSEIncident no encontrado, generando reporte vacío');
      }

      let incidents = [];
      
      if (HSEIncident) {
        const whereClause = {};
        
        if (startDate && endDate) {
          whereClause.incidentDate = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          };
        }
        
        if (severity) {
          whereClause.severity = severity;
        }

        incidents = await HSEIncident.findAll({
          where: whereClause,
          order: [['incidentDate', 'DESC']],
        });
      }

      const period = startDate && endDate 
        ? `${pdfService.formatDate(startDate)} - ${pdfService.formatDate(endDate)}`
        : new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

      const pdfBuffer = await reportService.generateHSEReport(
        incidents.map(i => i.toJSON ? i.toJSON() : i),
        period
      );

      const filename = `hse-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar reporte financiero
   */
  async downloadFinancialReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        throw new BadRequestError('Se requieren fechas de inicio y fin');
      }

      // Aquí se integraría con el módulo de finanzas para obtener datos reales
      // Por ahora, estructura básica
      const data = {
        income: [],
        expenses: [],
        totalIncome: 0,
        totalExpenses: 0,
      };

      // Intentar cargar datos de transacciones financieras
      try {
        const { Op } = require('sequelize');
        const models = require('../../../database/models');
        
        if (models.FinancialTransaction) {
          const transactions = await models.FinancialTransaction.findAll({
            where: {
              date: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
              },
            },
          });

          transactions.forEach(t => {
            if (t.type === 'INCOME') {
              data.income.push({ description: t.description, amount: t.amount });
              data.totalIncome += parseFloat(t.amount) || 0;
            } else {
              data.expenses.push({ description: t.description, amount: t.amount });
              data.totalExpenses += parseFloat(t.amount) || 0;
            }
          });
        }
      } catch (e) {
        logger.warn('No se pudieron cargar transacciones financieras:', e.message);
      }

      const period = `${pdfService.formatDate(startDate)} - ${pdfService.formatDate(endDate)}`;
      const pdfBuffer = await reportService.generateFinancialReport(data, period);

      const filename = `financiero-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar comprobante de transacción
   */
  async downloadTransactionReport(req, res, next) {
    try {
      const { id } = req.params;
      const { Transaction, BankAccount, TransactionCategory } = require('../../../database/models');

      const transaction = await Transaction.findByPk(id, {
        include: [
          { model: BankAccount, as: 'bankAccount', required: false },
          { model: TransactionCategory, as: 'category', required: false },
        ],
      });

      if (!transaction) {
        throw new NotFoundError('Transacción no encontrada');
      }

      const pdfBuffer = await reportService.generateTransactionReport(transaction.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="transaccion-${transaction.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de préstamo
   */
  async downloadLoanReport(req, res, next) {
    try {
      const { id } = req.params;
      const { EmployeeLoan, Employee, LoanPayment } = require('../../../database/models');

      const loan = await EmployeeLoan.findByPk(id, {
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        ],
      });

      if (!loan) {
        throw new NotFoundError('Préstamo no encontrado');
      }

      const payments = await LoanPayment.findAll({
        where: { loan_id: id },
        order: [['payment_date', 'DESC']],
      });

      const pdfBuffer = await reportService.generateLoanReport(
        loan.toJSON(),
        payments.map(p => p.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="prestamo-${loan.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar cotización en PDF
   */
  async downloadQuoteReport(req, res, next) {
    try {
      const { id } = req.params;
      const { Quote, QuoteItem, Supplier, Project, InventoryItem } = require('../../../database/models');

      const quote = await Quote.findByPk(id, {
        include: [
          { model: Supplier, as: 'supplier', required: false },
          { model: Project, as: 'project', required: false },
        ],
      });

      if (!quote) {
        throw new NotFoundError('Cotización no encontrada');
      }

      const items = await QuoteItem.findAll({
        where: { quote_id: id },
        include: [
          { model: InventoryItem, as: 'item', required: false },
        ],
      });

      const pdfBuffer = await reportService.generateQuoteReport(
        quote.toJSON(),
        items.map(i => i.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cotizacion-${quote.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar orden de compra en PDF
   */
  async downloadPurchaseOrderReport(req, res, next) {
    try {
      const { id } = req.params;
      const { PurchaseOrder, PurchaseOrderItem, Supplier, Project, Warehouse, InventoryItem } = require('../../../database/models');

      const order = await PurchaseOrder.findByPk(id, {
        include: [
          { model: Supplier, as: 'supplier', required: false },
          { model: Project, as: 'project', required: false },
          { model: Warehouse, as: 'warehouse', required: false },
        ],
      });

      if (!order) {
        throw new NotFoundError('Orden de compra no encontrada');
      }

      const items = await PurchaseOrderItem.findAll({
        where: { purchase_order_id: id },
        include: [
          { model: InventoryItem, as: 'item', required: false },
        ],
      });

      const pdfBuffer = await reportService.generatePurchaseOrderReport(
        order.toJSON(),
        items.map(i => i.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="orden-compra-${order.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar comprobante de pago a contratista
   */
  async downloadContractorPaymentReport(req, res, next) {
    try {
      const { id } = req.params;
      const { ContractorPayment, Contractor, Project, ContractorInvoice } = require('../../../database/models');

      const payment = await ContractorPayment.findByPk(id, {
        include: [
          { model: Contractor, as: 'contractor', required: false },
          { model: Project, as: 'project', required: false },
          { model: ContractorInvoice, as: 'invoice', required: false },
        ],
      });

      if (!payment) {
        throw new NotFoundError('Pago no encontrado');
      }

      const pdfBuffer = await reportService.generateContractorPaymentReport(payment.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="pago-contratista-${payment.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar factura de contratista en PDF
   */
  async downloadContractorInvoiceReport(req, res, next) {
    try {
      const { id } = req.params;
      const { ContractorInvoice, Contractor, Project } = require('../../../database/models');

      const invoice = await ContractorInvoice.findByPk(id, {
        include: [
          { model: Contractor, as: 'contractor', required: false },
          { model: Project, as: 'project', required: false },
        ],
      });

      if (!invoice) {
        throw new NotFoundError('Factura no encontrada');
      }

      const pdfBuffer = await reportService.generateContractorInvoiceReport(invoice.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="factura-${invoice.invoiceNumber || invoice.code}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de vehículo
   */
  async downloadVehicleReport(req, res, next) {
    try {
      const { id } = req.params;
      const { Vehicle, Employee, VehicleMaintenance, FuelLog } = require('../../../database/models');

      const vehicle = await Vehicle.findByPk(id, {
        include: [
          { model: Employee, as: 'driver', required: false },
        ],
      });

      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      const maintenances = await VehicleMaintenance.findAll({
        where: { vehicle_id: id },
        order: [['maintenance_date', 'DESC']],
        limit: 10,
      });

      const fuelLogs = await FuelLog.findAll({
        where: { vehicle_id: id },
        order: [['date', 'DESC']],
        limit: 10,
      });

      const pdfBuffer = await reportService.generateVehicleReport(
        vehicle.toJSON(),
        maintenances.map(m => m.toJSON()),
        fuelLogs.map(f => f.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="vehiculo-${vehicle.plate}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de transacciones
   */
  async downloadTransactionsListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { Transaction, BankAccount } = require('../../../database/models');
      const { startDate, endDate, type, accountId } = req.query;

      const whereClause = {};
      if (type) whereClause.transaction_type = type;
      if (accountId) whereClause.account_id = accountId;
      if (startDate && endDate) {
        whereClause.transaction_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [
          { model: BankAccount, as: 'account', required: false },
        ],
        order: [['transaction_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateTransactionsListReport(
        transactions.map(t => t.toJSON()),
        { startDate, endDate, type }
      );

      const filename = `transacciones-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de préstamos
   */
  async downloadLoansListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { EmployeeLoan, Employee } = require('../../../database/models');
      const { status, startDate, endDate, employeeId } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (employeeId) whereClause.employee_id = employeeId;
      if (startDate && endDate) {
        whereClause.start_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const loans = await EmployeeLoan.findAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        ],
        order: [['start_date', 'DESC']],
      });

      const pdfBuffer = await reportService.generateLoansListReport(
        loans.map(l => l.toJSON()),
        { status, startDate, endDate }
      );

      const filename = `prestamos-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de cuenta bancaria con transacciones
   */
  async downloadBankAccountReport(req, res, next) {
    try {
      const { id } = req.params;
      const { BankAccount, Transaction, TransactionCategory } = require('../../../database/models');

      const account = await BankAccount.findByPk(id);

      if (!account) {
        throw new NotFoundError('Cuenta bancaria no encontrada');
      }

      const transactions = await Transaction.findAll({
        where: { bank_account_id: id },
        include: [
          { model: TransactionCategory, as: 'category', required: false },
        ],
        order: [['date', 'DESC']],
        limit: 100,
      });

      const pdfBuffer = await reportService.generateBankAccountReport(
        account.toJSON(),
        transactions.map(t => t.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cuenta-${account.accountNumber}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de movimiento de caja chica
   */
  async downloadPettyCashEntryReport(req, res, next) {
    try {
      const { id } = req.params;
      const { PettyCashEntry, PettyCash, Employee, Project } = require('../../../database/models');

      const entry = await PettyCashEntry.findByPk(id, {
        include: [
          { model: PettyCash, as: 'pettyCash', required: false },
          { model: Employee, as: 'employee', required: false },
          { model: Project, as: 'project', required: false },
        ],
      });

      if (!entry) {
        throw new NotFoundError('Movimiento de caja chica no encontrado');
      }

      const pdfBuffer = await reportService.generatePettyCashEntryReport(entry.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="movimiento-caja-${entry.code || entry.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de combustibles
   */
  async downloadFuelLogsReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { FuelLog, Vehicle, Employee } = require('../../../database/models');
      const { startDate, endDate, vehicleId } = req.query;

      const whereClause = {};
      if (vehicleId) whereClause.vehicle_id = vehicleId;
      if (startDate && endDate) {
        whereClause.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const fuelLogs = await FuelLog.findAll({
        where: whereClause,
        include: [
          { model: Vehicle, as: 'vehicle', required: false },
          { model: Employee, as: 'driver', required: false },
        ],
        order: [['date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateFuelLogsReport(
        fuelLogs.map(f => f.toJSON()),
        { startDate, endDate }
      );

      const filename = `combustibles-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar detalle de recarga de combustible
   */
  async downloadFuelLogReport(req, res, next) {
    try {
      const { id } = req.params;
      const { FuelLog, Vehicle, Employee } = require('../../../database/models');

      const fuelLog = await FuelLog.findByPk(id, {
        include: [
          { model: Vehicle, as: 'vehicle', required: false },
          { model: Employee, as: 'driver', required: false },
        ],
      });

      if (!fuelLog) {
        throw new NotFoundError('Registro de combustible no encontrado');
      }

      const pdfBuffer = await reportService.generateFuelLogDetailReport(fuelLog.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="combustible-${fuelLog.code || fuelLog.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de mantenimientos
   */
  async downloadMaintenancesReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { VehicleMaintenance, Vehicle } = require('../../../database/models');
      const { startDate, endDate, vehicleId, maintenanceType } = req.query;

      const whereClause = {};
      if (vehicleId) whereClause.vehicle_id = vehicleId;
      if (maintenanceType) whereClause.maintenance_type = maintenanceType;
      if (startDate && endDate) {
        whereClause.maintenance_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const maintenances = await VehicleMaintenance.findAll({
        where: whereClause,
        include: [
          { model: Vehicle, as: 'vehicle', required: false },
        ],
        order: [['maintenance_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateMaintenancesReport(
        maintenances.map(m => m.toJSON()),
        { startDate, endDate, maintenanceType }
      );

      const filename = `mantenimientos-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar detalle de mantenimiento
   */
  async downloadMaintenanceReport(req, res, next) {
    try {
      const { id } = req.params;
      const { VehicleMaintenance, Vehicle } = require('../../../database/models');

      const maintenance = await VehicleMaintenance.findByPk(id, {
        include: [
          { model: Vehicle, as: 'vehicle', required: false },
        ],
      });

      if (!maintenance) {
        throw new NotFoundError('Mantenimiento no encontrado');
      }

      const pdfBuffer = await reportService.generateMaintenanceDetailReport(maintenance.toJSON());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mantenimiento-${maintenance.code || maintenance.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de cotizaciones
   */
  async downloadQuotesListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { Quote, Supplier, Project } = require('../../../database/models');
      const { status, startDate, endDate, supplierId } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (supplierId) whereClause.supplier_id = supplierId;
      if (startDate && endDate) {
        whereClause.quote_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const quotes = await Quote.findAll({
        where: whereClause,
        include: [
          { model: Supplier, as: 'supplier', required: false },
          { model: Project, as: 'project', required: false },
        ],
        order: [['quote_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateQuotesListReport(
        quotes.map(q => q.toJSON()),
        { status, startDate, endDate }
      );

      const filename = `cotizaciones-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de órdenes de compra
   */
  async downloadPurchaseOrdersListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { PurchaseOrder, Supplier, Project } = require('../../../database/models');
      const { status, startDate, endDate, supplierId } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (supplierId) whereClause.supplier_id = supplierId;
      if (startDate && endDate) {
        whereClause.order_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const orders = await PurchaseOrder.findAll({
        where: whereClause,
        include: [
          { model: Supplier, as: 'supplier', required: false },
          { model: Project, as: 'project', required: false },
        ],
        order: [['order_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generatePurchaseOrdersListReport(
        orders.map(o => o.toJSON()),
        { status, startDate, endDate }
      );

      const filename = `ordenes-compra-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de facturas de contratistas
   */
  async downloadContractorInvoicesListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { ContractorInvoice, Contractor, Project } = require('../../../database/models');
      const { status, startDate, endDate, contractorId } = req.query;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (contractorId) whereClause.contractor_id = contractorId;
      if (startDate && endDate) {
        whereClause.invoice_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const invoices = await ContractorInvoice.findAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', required: false },
          { model: Project, as: 'project', required: false },
        ],
        order: [['invoice_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateContractorInvoicesListReport(
        invoices.map(i => i.toJSON()),
        { status, startDate, endDate }
      );

      const filename = `facturas-contratistas-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar listado de pagos a contratistas
   */
  async downloadContractorPaymentsListReport(req, res, next) {
    try {
      const { Op } = require('sequelize');
      const { ContractorPayment, Contractor, Project } = require('../../../database/models');
      const { startDate, endDate, contractorId } = req.query;

      const whereClause = {};
      if (contractorId) whereClause.contractor_id = contractorId;
      if (startDate && endDate) {
        whereClause.payment_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const payments = await ContractorPayment.findAll({
        where: whereClause,
        include: [
          { model: Contractor, as: 'contractor', required: false },
          { model: Project, as: 'project', required: false },
        ],
        order: [['payment_date', 'DESC']],
        limit: 500,
      });

      const pdfBuffer = await reportService.generateContractorPaymentsListReport(
        payments.map(p => p.toJSON()),
        { startDate, endDate }
      );

      const filename = `pagos-contratistas-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de item de inventario
   */
  async downloadInventoryItemReport(req, res, next) {
    try {
      const { id } = req.params;
      const { InventoryItem, InventoryCategory, WarehouseStock, Warehouse, InventoryMovement } = require('../../../database/models');

      const item = await InventoryItem.findByPk(id, {
        include: [
          { model: InventoryCategory, as: 'category', required: false },
        ],
      });

      if (!item) {
        throw new NotFoundError('Item de inventario no encontrado');
      }

      const stocks = await WarehouseStock.findAll({
        where: { item_id: id },
        include: [
          { model: Warehouse, as: 'warehouse', required: false },
        ],
      });

      const movements = await InventoryMovement.findAll({
        where: { item_id: id },
        include: [
          { model: Warehouse, as: 'sourceWarehouse', required: false },
          { model: Warehouse, as: 'destinationWarehouse', required: false },
        ],
        order: [['created_at', 'DESC']],
        limit: 50,
      });

      const pdfBuffer = await reportService.generateInventoryItemReport(
        item.toJSON(),
        stocks.map(s => s.toJSON()),
        movements.map(m => m.toJSON())
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="item-${item.code || item.sku}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generar y descargar reporte de almacén
   */
  async downloadWarehouseReport(req, res, next) {
    try {
      const { id } = req.params;
      const { Warehouse, WarehouseStock, InventoryItem, InventoryCategory } = require('../../../database/models');

      const warehouse = await Warehouse.findByPk(id);

      if (!warehouse) {
        throw new NotFoundError('Almacén no encontrado');
      }

      const stocks = await WarehouseStock.findAll({
        where: { warehouse_id: id },
        include: [
          { 
            model: InventoryItem, 
            as: 'item',
            include: [
              { model: InventoryCategory, as: 'category', required: false },
            ],
          },
        ],
      });

      const pdfBuffer = await reportService.generateWarehouseReport(
        warehouse.toJSON(),
        stocks.map(s => ({
          ...s.item?.toJSON(),
          quantity: s.quantity,
          minStock: s.min_stock,
        }))
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="almacen-${warehouse.code || warehouse.name}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar tipos de reportes disponibles
   */
  async listAvailableReports(req, res) {
    const reports = [
      {
        id: 'project',
        name: 'Reporte de Proyecto',
        description: 'Información detallada de un proyecto específico',
        endpoint: '/api/reports/projects/:id',
        method: 'GET',
        params: ['id'],
      },
      {
        id: 'projects-list',
        name: 'Listado de Proyectos',
        description: 'Lista de todos los proyectos con filtros opcionales',
        endpoint: '/api/reports/projects',
        method: 'GET',
        queryParams: ['status', 'priority', 'executionType', 'departmentId'],
      },
      {
        id: 'employee',
        name: 'Ficha de Empleado',
        description: 'Información completa de un empleado',
        endpoint: '/api/reports/employees/:id',
        method: 'GET',
        params: ['id'],
        queryParams: ['includeSalary'],
      },
      {
        id: 'employees-list',
        name: 'Listado de Empleados',
        description: 'Lista de empleados con filtros opcionales',
        endpoint: '/api/reports/employees',
        method: 'GET',
        queryParams: ['status', 'departmentId', 'positionId'],
      },
      {
        id: 'payroll',
        name: 'Reporte de Nómina',
        description: 'Resumen de nómina de un período',
        endpoint: '/api/reports/payroll/:id',
        method: 'GET',
        params: ['id'],
      },
      {
        id: 'payslip',
        name: 'Recibo de Pago',
        description: 'Recibo de pago individual de un empleado',
        endpoint: '/api/reports/payroll/:payrollId/employee/:employeeId',
        method: 'GET',
        params: ['payrollId', 'employeeId'],
      },
      {
        id: 'inventory',
        name: 'Reporte de Inventario',
        description: 'Estado del inventario',
        endpoint: '/api/reports/inventory',
        method: 'GET',
        queryParams: ['warehouseId'],
      },
      {
        id: 'petty-cash',
        name: 'Reporte de Caja Chica',
        description: 'Estado y movimientos de caja chica',
        endpoint: '/api/reports/petty-cash/:id',
        method: 'GET',
        params: ['id'],
      },
      {
        id: 'fleet',
        name: 'Reporte de Flota',
        description: 'Estado de la flota vehicular',
        endpoint: '/api/reports/fleet',
        method: 'GET',
        queryParams: ['status'],
      },
      {
        id: 'hse',
        name: 'Reporte HSE',
        description: 'Reporte de seguridad y salud ocupacional',
        endpoint: '/api/reports/hse',
        method: 'GET',
        queryParams: ['startDate', 'endDate', 'severity'],
      },
      {
        id: 'financial',
        name: 'Reporte Financiero',
        description: 'Resumen financiero de un período',
        endpoint: '/api/reports/financial',
        method: 'GET',
        queryParams: ['startDate', 'endDate'],
      },
    ];

    return res.json({
      success: true,
      data: reports,
    });
  }
}

module.exports = new ReportController();
