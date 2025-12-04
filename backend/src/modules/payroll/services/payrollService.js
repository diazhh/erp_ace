const { Op } = require('sequelize');
const { sequelize } = require('../../../database');

class PayrollService {
  constructor(models) {
    this.models = models;
  }

  /**
   * Genera código único para período de nómina
   */
  async generatePeriodCode(periodType, date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    let suffix = '';
    if (periodType === 'BIWEEKLY') {
      const day = date.getDate();
      suffix = day <= 15 ? 'Q1' : 'Q2';
    } else if (periodType === 'WEEKLY') {
      const weekNum = Math.ceil(date.getDate() / 7);
      suffix = `W${weekNum}`;
    }
    
    const baseCode = `NOM-${year}-${month}${suffix ? '-' + suffix : ''}`;
    
    // Verificar si existe
    const existing = await this.models.PayrollPeriod.findOne({
      where: { code: baseCode },
    });
    
    if (existing) {
      // Agregar sufijo numérico
      const count = await this.models.PayrollPeriod.count({
        where: { code: { [Op.like]: `${baseCode}%` } },
      });
      return `${baseCode}-${count + 1}`;
    }
    
    return baseCode;
  }

  /**
   * Genera código único para préstamo
   */
  async generateLoanCode(employeeId) {
    const employee = await this.models.Employee.findByPk(employeeId);
    const year = new Date().getFullYear();
    const count = await this.models.EmployeeLoan.count({
      where: { employeeId },
    });
    
    return `LOAN-${employee.employeeCode || employee.idNumber}-${year}-${count + 1}`;
  }

  /**
   * Calcula las deducciones legales venezolanas
   */
  calculateLegalDeductions(baseSalary, daysWorked, totalDays) {
    const proportionalSalary = (baseSalary / totalDays) * daysWorked;
    
    return {
      sso: proportionalSalary * 0.04,      // 4% Seguro Social Obligatorio
      rpe: proportionalSalary * 0.005,     // 0.5% Régimen Prestacional de Empleo
      fav: proportionalSalary * 0.01,      // 1% FAOV (Ahorro Habitacional)
      proportionalSalary,
    };
  }

  /**
   * Calcula ISLR (simplificado)
   */
  calculateISLR(annualIncome) {
    // Simplificación del ISLR venezolano
    // En producción, esto debería usar las tablas oficiales del SENIAT
    const ut = 0.40; // Valor de UT en USD (aproximado)
    const annualUT = annualIncome / ut;
    
    if (annualUT <= 1000) return 0;
    if (annualUT <= 1500) return (annualUT - 1000) * 0.06 * ut;
    if (annualUT <= 2000) return ((1500 - 1000) * 0.06 + (annualUT - 1500) * 0.09) * ut;
    if (annualUT <= 2500) return ((1500 - 1000) * 0.06 + (2000 - 1500) * 0.09 + (annualUT - 2000) * 0.12) * ut;
    
    return ((1500 - 1000) * 0.06 + (2000 - 1500) * 0.09 + (2500 - 2000) * 0.12 + (annualUT - 2500) * 0.16) * ut;
  }

  /**
   * Obtiene préstamos activos de un empleado
   */
  async getActiveLoans(employeeId) {
    return this.models.EmployeeLoan.findAll({
      where: {
        employeeId,
        status: 'ACTIVE',
      },
      order: [['startDate', 'ASC']],
    });
  }

  /**
   * Calcula la cuota de préstamo a descontar
   */
  async calculateLoanDeduction(employeeId) {
    const activeLoans = await this.getActiveLoans(employeeId);
    
    let totalDeduction = 0;
    const loanDetails = [];
    
    for (const loan of activeLoans) {
      totalDeduction += parseFloat(loan.installmentAmount);
      loanDetails.push({
        loanId: loan.id,
        code: loan.code,
        installmentAmount: loan.installmentAmount,
        remainingInstallments: loan.totalInstallments - loan.paidInstallments,
      });
    }
    
    return { totalDeduction, loanDetails };
  }

  /**
   * Genera entradas de nómina para un período
   */
  async generatePayrollEntries(periodId, employeeIds = null) {
    const period = await this.models.PayrollPeriod.findByPk(periodId);
    if (!period) throw new Error('Período no encontrado');
    
    // Obtener empleados activos
    const whereClause = { status: 'ACTIVE' };
    if (employeeIds && employeeIds.length > 0) {
      whereClause.id = { [Op.in]: employeeIds };
    }
    
    const employees = await this.models.Employee.findAll({
      where: whereClause,
    });
    
    const entries = [];
    const transaction = await sequelize.transaction();
    
    try {
      for (const employee of employees) {
        // Verificar si ya existe entrada
        const existing = await this.models.PayrollEntry.findOne({
          where: { periodId, employeeId: employee.id },
          transaction,
        });
        
        if (existing) continue;
        
        // Calcular días del período
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Calcular deducciones legales
        const legalDeductions = this.calculateLegalDeductions(
          employee.baseSalary,
          totalDays,
          totalDays
        );
        
        // Obtener deducción por préstamos
        const { totalDeduction: loanDeduction } = await this.calculateLoanDeduction(employee.id);
        
        // Crear entrada
        const entry = await this.models.PayrollEntry.create({
          periodId,
          employeeId: employee.id,
          baseSalary: employee.baseSalary,
          daysWorked: totalDays,
          totalDays,
          currency: employee.salaryCurrency || 'USD',
          paymentMethod: 'BANK_TRANSFER',
          ssoDeduction: legalDeductions.sso,
          rpeDeduction: legalDeductions.rpe,
          favDeduction: legalDeductions.fav,
          loanDeduction,
          grossPay: legalDeductions.proportionalSalary,
          totalDeductions: legalDeductions.sso + legalDeductions.rpe + legalDeductions.fav + loanDeduction,
          netPay: legalDeductions.proportionalSalary - (legalDeductions.sso + legalDeductions.rpe + legalDeductions.fav + loanDeduction),
        }, { transaction });
        
        entries.push(entry);
      }
      
      // Actualizar totales del período
      const totals = entries.reduce((acc, entry) => ({
        gross: acc.gross + parseFloat(entry.grossPay),
        deductions: acc.deductions + parseFloat(entry.totalDeductions),
        net: acc.net + parseFloat(entry.netPay),
      }), { gross: 0, deductions: 0, net: 0 });
      
      await period.update({
        totalGross: totals.gross,
        totalDeductions: totals.deductions,
        totalNet: totals.net,
        totalEmployees: entries.length,
        status: 'CALCULATING',
      }, { transaction });
      
      await transaction.commit();
      return entries;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Recalcula una entrada de nómina
   */
  async recalculateEntry(entryId) {
    const entry = await this.models.PayrollEntry.findByPk(entryId);
    if (!entry) throw new Error('Entrada no encontrada');
    
    entry.calculateTotals();
    await entry.save();
    
    return entry;
  }

  /**
   * Procesa pagos de préstamos al pagar nómina
   */
  async processLoanPayments(entryId, transaction) {
    const entry = await this.models.PayrollEntry.findByPk(entryId, { transaction });
    if (!entry || parseFloat(entry.loanDeduction) === 0) return [];
    
    const activeLoans = await this.getActiveLoans(entry.employeeId);
    const payments = [];
    
    for (const loan of activeLoans) {
      // Crear registro de pago
      const payment = await this.models.LoanPayment.create({
        loanId: loan.id,
        payrollEntryId: entryId,
        installmentNumber: loan.paidInstallments + 1,
        amount: loan.installmentAmount,
        currency: loan.currency,
        paymentDate: new Date(),
        paymentMethod: 'PAYROLL_DEDUCTION',
      }, { transaction });
      
      // Actualizar préstamo
      loan.paidInstallments += 1;
      await loan.save({ transaction });
      
      payments.push(payment);
    }
    
    return payments;
  }

  /**
   * Marca período como pagado
   */
  async markPeriodAsPaid(periodId, userId) {
    const period = await this.models.PayrollPeriod.findByPk(periodId, {
      include: [{ association: 'entries' }],
    });
    
    if (!period) throw new Error('Período no encontrado');
    if (period.status !== 'APPROVED') throw new Error('El período debe estar aprobado');
    
    const transaction = await sequelize.transaction();
    
    try {
      // Marcar todas las entradas como pagadas
      for (const entry of period.entries) {
        await entry.update({
          paymentStatus: 'PAID',
          paidAt: new Date(),
        }, { transaction });
        
        // Procesar pagos de préstamos
        await this.processLoanPayments(entry.id, transaction);
      }
      
      // Actualizar período
      await period.update({
        status: 'PAID',
      }, { transaction });
      
      await transaction.commit();
      return period;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de nómina
   */
  async getPayrollStats() {
    const currentYear = new Date().getFullYear();
    
    // Total pagado este año - usando consulta raw para evitar problemas con include
    const paidPeriods = await this.models.PayrollPeriod.findAll({
      where: {
        status: 'PAID',
        startDate: { [Op.gte]: `${currentYear}-01-01` },
      },
      attributes: ['id'],
    });
    
    let yearlyTotal = 0;
    if (paidPeriods.length > 0) {
      const periodIds = paidPeriods.map(p => p.id);
      yearlyTotal = await this.models.PayrollEntry.sum('net_pay', {
        where: { periodId: { [Op.in]: periodIds } },
      }) || 0;
    }
    
    // Períodos pendientes
    const pendingPeriods = await this.models.PayrollPeriod.count({
      where: { status: { [Op.in]: ['DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED'] } },
    });
    
    // Préstamos activos
    const activeLoans = await this.models.EmployeeLoan.count({
      where: { status: 'ACTIVE' },
    });
    
    const totalLoanAmount = await this.models.EmployeeLoan.sum('remaining_amount', {
      where: { status: 'ACTIVE' },
    });
    
    return {
      yearlyTotal: yearlyTotal || 0,
      pendingPeriods,
      activeLoans,
      totalLoanAmount: totalLoanAmount || 0,
    };
  }
}

module.exports = PayrollService;
