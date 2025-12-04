const { Op } = require('sequelize');
const PayrollService = require('../services/payrollService');
const { BadRequestError, NotFoundError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class PayrollController {
  // ==================== PAYROLL PERIODS ====================

  async createPeriod(req, res, next) {
    try {
      const { PayrollPeriod } = require('../../../database/models');
      const models = require('../../../database/models');
      const payrollService = new PayrollService(models);
      
      const { name, periodType, startDate, endDate, paymentDate, currency, exchangeRate, notes } = req.body;
      
      // Generar código
      const code = await payrollService.generatePeriodCode(periodType, new Date(startDate));
      
      const period = await PayrollPeriod.create({
        code,
        name,
        periodType,
        startDate,
        endDate,
        paymentDate,
        currency: currency || 'USD',
        exchangeRate: exchangeRate || 1,
        notes,
        createdBy: req.user.id,
      });
      
      logger.info(`Período de nómina creado: ${code}`);
      
      return res.status(201).json({
        success: true,
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPeriods(req, res, next) {
    try {
      const { PayrollPeriod, User } = require('../../../database/models');
      
      const { page = 1, limit = 10, status, year } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      if (status) where.status = status;
      if (year) {
        where.startDate = {
          [Op.gte]: `${year}-01-01`,
          [Op.lte]: `${year}-12-31`,
        };
      }
      
      const { count, rows } = await PayrollPeriod.findAndCountAll({
        where,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['startDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPeriodById(req, res, next) {
    try {
      const { PayrollPeriod, PayrollEntry, Employee, User } = require('../../../database/models');
      
      const period = await PayrollPeriod.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
          {
            model: PayrollEntry,
            as: 'entries',
            include: [
              { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber', 'position', 'department'] },
            ],
          },
        ],
      });
      
      if (!period) {
        throw new NotFoundError('Período no encontrado');
      }
      
      return res.json({
        success: true,
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener período con todas sus relaciones (trazabilidad completa)
  async getPeriodFullById(req, res, next) {
    try {
      const { PayrollPeriod, PayrollEntry, Employee, User, LoanPayment, EmployeeLoan, Transaction, AuditLog } = require('../../../database/models');
      const { sequelize } = require('../../../database');
      
      const period = await PayrollPeriod.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
          {
            model: PayrollEntry,
            as: 'entries',
            include: [
              { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber', 'position', 'department', 'bankName', 'bankAccountNumber'] },
            ],
          },
        ],
      });
      
      if (!period) {
        throw new NotFoundError('Período no encontrado');
      }
      
      // Obtener pagos de préstamos descontados en este período
      const entryIds = period.entries.map(e => e.id);
      const loanPayments = await LoanPayment.findAll({
        where: { payrollEntryId: { [Op.in]: entryIds } },
        include: [
          { 
            model: EmployeeLoan, 
            as: 'loan',
            attributes: ['id', 'code', 'loanType', 'amount', 'remainingAmount'],
            include: [
              { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
            ],
          },
        ],
      });
      
      // Obtener transacciones generadas por este período (pagos de nómina)
      const transactions = await Transaction.findAll({
        where: {
          reference: { [Op.like]: `%${period.code}%` },
        },
        attributes: ['id', 'code', 'transactionType', 'amount', 'currency', 'transactionDate', 'status'],
        order: [['transactionDate', 'DESC']],
      });
      
      // Calcular estadísticas del período
      const stats = {
        totalEmployees: period.entries.length,
        totalGrossSalary: period.entries.reduce((sum, e) => sum + parseFloat(e.grossSalary || 0), 0),
        totalDeductions: period.entries.reduce((sum, e) => sum + parseFloat(e.totalDeductions || 0), 0),
        totalNetSalary: period.entries.reduce((sum, e) => sum + parseFloat(e.netSalary || 0), 0),
        totalLoanDeductions: loanPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
        byDepartment: {},
        deductionBreakdown: {
          sso: period.entries.reduce((sum, e) => sum + parseFloat(e.ssoDeduction || 0), 0),
          rpe: period.entries.reduce((sum, e) => sum + parseFloat(e.rpeDeduction || 0), 0),
          faov: period.entries.reduce((sum, e) => sum + parseFloat(e.faovDeduction || 0), 0),
          islr: period.entries.reduce((sum, e) => sum + parseFloat(e.islrDeduction || 0), 0),
          loans: loanPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
          other: period.entries.reduce((sum, e) => sum + parseFloat(e.otherDeductions || 0), 0),
        },
      };
      
      // Agrupar por departamento
      period.entries.forEach(entry => {
        const dept = entry.employee?.department || 'Sin departamento';
        if (!stats.byDepartment[dept]) {
          stats.byDepartment[dept] = { count: 0, total: 0 };
        }
        stats.byDepartment[dept].count++;
        stats.byDepartment[dept].total += parseFloat(entry.netSalary || 0);
      });
      
      // Historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'PayrollPeriod',
          entityId: period.id,
        },
        limit: 30,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        }],
      });
      
      return res.json({
        success: true,
        data: {
          ...period.toJSON(),
          loanPayments,
          transactions,
          stats,
          auditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePeriod(req, res, next) {
    try {
      const { PayrollPeriod } = require('../../../database/models');
      
      const period = await PayrollPeriod.findByPk(req.params.id);
      if (!period) {
        throw new NotFoundError('Período no encontrado');
      }
      
      if (period.status === 'PAID') {
        throw new BadRequestError('No se puede modificar un período pagado');
      }
      
      const { name, periodType, startDate, endDate, paymentDate, currency, exchangeRate, notes } = req.body;
      
      await period.update({
        name,
        periodType,
        startDate,
        endDate,
        paymentDate,
        currency,
        exchangeRate,
        notes,
      });
      
      return res.json({
        success: true,
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePeriod(req, res, next) {
    try {
      const { PayrollPeriod } = require('../../../database/models');
      
      const period = await PayrollPeriod.findByPk(req.params.id);
      if (!period) {
        throw new NotFoundError('Período no encontrado');
      }
      
      if (period.status !== 'DRAFT') {
        throw new BadRequestError('Solo se pueden eliminar períodos en borrador');
      }
      
      await period.destroy();
      
      return res.json({
        success: true,
        message: 'Período eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async generateEntries(req, res, next) {
    try {
      const models = require('../../../database/models');
      const payrollService = new PayrollService(models);
      
      const { employeeIds } = req.body;
      const entries = await payrollService.generatePayrollEntries(req.params.id, employeeIds);
      
      logger.info(`Generadas ${entries.length} entradas para período ${req.params.id}`);
      
      return res.json({
        success: true,
        data: entries,
        message: `Se generaron ${entries.length} entradas de nómina`,
      });
    } catch (error) {
      next(error);
    }
  }

  async approvePeriod(req, res, next) {
    try {
      const { PayrollPeriod } = require('../../../database/models');
      
      const period = await PayrollPeriod.findByPk(req.params.id);
      if (!period) {
        throw new NotFoundError('Período no encontrado');
      }
      
      if (!['CALCULATING', 'PENDING_APPROVAL'].includes(period.status)) {
        throw new BadRequestError('El período no está listo para aprobación');
      }
      
      await period.update({
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date(),
      });
      
      logger.info(`Período ${period.code} aprobado por usuario ${req.user.id}`);
      
      return res.json({
        success: true,
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsPaid(req, res, next) {
    try {
      const models = require('../../../database/models');
      const payrollService = new PayrollService(models);
      
      const period = await payrollService.markPeriodAsPaid(req.params.id, req.user.id);
      
      logger.info(`Período ${period.code} marcado como pagado`);
      
      return res.json({
        success: true,
        data: period,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== PAYROLL ENTRIES ====================

  async getEntryById(req, res, next) {
    try {
      const { PayrollEntry, PayrollPeriod, Employee } = require('../../../database/models');
      
      const entry = await PayrollEntry.findByPk(req.params.id, {
        include: [
          { model: PayrollPeriod, as: 'period' },
          { model: Employee, as: 'employee' },
        ],
      });
      
      if (!entry) {
        throw new NotFoundError('Entrada no encontrada');
      }
      
      return res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEntry(req, res, next) {
    try {
      const { PayrollEntry, PayrollPeriod } = require('../../../database/models');
      
      const entry = await PayrollEntry.findByPk(req.params.id, {
        include: [{ model: PayrollPeriod, as: 'period' }],
      });
      
      if (!entry) {
        throw new NotFoundError('Entrada no encontrada');
      }
      
      if (entry.period.status === 'PAID') {
        throw new BadRequestError('No se puede modificar una entrada de período pagado');
      }
      
      const {
        daysWorked,
        overtime,
        overtimeHours,
        bonus,
        commission,
        foodAllowance,
        transportAllowance,
        otherIncome,
        otherIncomeDescription,
        otherDeductions,
        otherDeductionsDescription,
        paymentMethod,
        notes,
      } = req.body;
      
      await entry.update({
        daysWorked,
        overtime,
        overtimeHours,
        bonus,
        commission,
        foodAllowance,
        transportAllowance,
        otherIncome,
        otherIncomeDescription,
        otherDeductions,
        otherDeductionsDescription,
        paymentMethod,
        notes,
      });
      
      // Recalcular totales
      entry.calculateTotals();
      await entry.save();
      
      return res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== EMPLOYEE LOANS ====================

  async createLoan(req, res, next) {
    try {
      const { EmployeeLoan } = require('../../../database/models');
      const models = require('../../../database/models');
      const payrollService = new PayrollService(models);
      
      const { employeeId, loanType, description, amount, currency, totalInstallments, startDate, notes } = req.body;
      
      const code = await payrollService.generateLoanCode(employeeId);
      const installmentAmount = amount / totalInstallments;
      
      // Calcular fecha de fin estimada
      const start = new Date(startDate);
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + totalInstallments);
      
      const loan = await EmployeeLoan.create({
        employeeId,
        code,
        loanType,
        description,
        amount,
        currency: currency || 'USD',
        totalInstallments,
        installmentAmount,
        remainingAmount: amount,
        startDate,
        endDate,
        notes,
        createdBy: req.user.id,
      });
      
      logger.info(`Préstamo creado: ${code} para empleado ${employeeId}`);
      
      return res.status(201).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoans(req, res, next) {
    try {
      const { EmployeeLoan, Employee, User } = require('../../../database/models');
      
      const { page = 1, limit = 10, status, employeeId } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      if (status) where.status = status;
      if (employeeId) where.employeeId = employeeId;
      
      const { count, rows } = await EmployeeLoan.findAndCountAll({
        where,
        include: [
          { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'idNumber'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanById(req, res, next) {
    try {
      const { EmployeeLoan, Employee, LoanPayment, User } = require('../../../database/models');
      
      const loan = await EmployeeLoan.findByPk(req.params.id, {
        include: [
          { model: Employee, as: 'employee' },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName'] },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: LoanPayment, as: 'payments', order: [['installmentNumber', 'ASC']] },
        ],
      });
      
      if (!loan) {
        throw new NotFoundError('Préstamo no encontrado');
      }
      
      return res.json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveLoan(req, res, next) {
    try {
      const { EmployeeLoan } = require('../../../database/models');
      
      const loan = await EmployeeLoan.findByPk(req.params.id);
      if (!loan) {
        throw new NotFoundError('Préstamo no encontrado');
      }
      
      if (loan.status !== 'ACTIVE') {
        throw new BadRequestError('El préstamo ya fue procesado');
      }
      
      await loan.update({
        approvedBy: req.user.id,
        approvedAt: new Date(),
      });
      
      logger.info(`Préstamo ${loan.code} aprobado`);
      
      return res.json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelLoan(req, res, next) {
    try {
      const { EmployeeLoan } = require('../../../database/models');
      
      const loan = await EmployeeLoan.findByPk(req.params.id);
      if (!loan) {
        throw new NotFoundError('Préstamo no encontrado');
      }
      
      if (loan.status === 'PAID') {
        throw new BadRequestError('No se puede cancelar un préstamo pagado');
      }
      
      await loan.update({ status: 'CANCELLED' });
      
      return res.json({
        success: true,
        message: 'Préstamo cancelado',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== STATS ====================

  async getStats(req, res, next) {
    try {
      const models = require('../../../database/models');
      const payrollService = new PayrollService(models);
      
      const stats = await payrollService.getPayrollStats();
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PayrollController();
