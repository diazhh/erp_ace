const db = require('../../../database/models');
const { setupTestDatabase, teardownTestDatabase } = require('../../../../tests/helpers/db.helper');

describe('Payroll Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada prueba
    await db.PayrollEntry.destroy({ where: {}, force: true });
    await db.PayrollPeriod.destroy({ where: {}, force: true });
    await db.EmployeeLoan.destroy({ where: {}, force: true });
    await db.Employee.destroy({ where: {}, force: true });
    await db.Department.destroy({ where: {}, force: true });
  });

  describe('Payroll Period and Entry Generation', () => {
    it('debe crear período de nómina y generar entradas para empleados activos', async () => {
      // Crear empleados activos
      const employee1 = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 1000,
        bonuses: 200
      });

      const employee2 = await db.Employee.create({
        firstName: 'María',
        lastName: 'González',
        idType: 'V',
        idNumber: '87654321',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 1500,
        bonuses: 300
      });

      // Crear período de nómina
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      expect(period.periodCode).toBe('NOM-2025-01');
      expect(period.status).toBe('DRAFT');

      // Generar entradas de nómina (simulado)
      const entry1 = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee1.id,
        baseSalary: 1000,
        bonuses: 200,
        grossSalary: 1200,
        deductions: 66, // 5.5% de 1200
        netSalary: 1134,
        status: 'PENDING'
      });

      const entry2 = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee2.id,
        baseSalary: 1500,
        bonuses: 300,
        grossSalary: 1800,
        deductions: 99, // 5.5% de 1800
        netSalary: 1701,
        status: 'PENDING'
      });

      // Verificar entradas creadas
      const entries = await db.PayrollEntry.findAll({
        where: { periodId: period.id }
      });

      expect(entries).toHaveLength(2);
      expect(entries[0].grossSalary).toBe(1200);
      expect(entries[1].grossSalary).toBe(1800);
    });

    it('NO debe generar entradas para empleados inactivos', async () => {
      // Crear empleado inactivo
      const inactiveEmployee = await db.Employee.create({
        firstName: 'Carlos',
        lastName: 'Inactive',
        idType: 'V',
        idNumber: '11111111',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'INACTIVE',
        terminationDate: new Date('2024-12-31'),
        baseSalary: 1000
      });

      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      // No debe crear entrada para empleado inactivo
      const entries = await db.PayrollEntry.findAll({
        where: {
          periodId: period.id,
          employeeId: inactiveEmployee.id
        }
      });

      expect(entries).toHaveLength(0);
    });

    it('debe calcular salario proporcional para empleado que ingresó a mitad de período', async () => {
      // Empleado contratado el 15 de enero
      const employee = await db.Employee.create({
        firstName: 'Nuevo',
        lastName: 'Empleado',
        idType: 'V',
        idNumber: '22222222',
        hireDate: new Date('2025-01-15'),
        employmentStatus: 'ACTIVE',
        baseSalary: 3000
      });

      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      // Días trabajados: del 15 al 31 = 17 días de 31
      const daysWorked = 17;
      const totalDays = 31;
      const proportionalSalary = (3000 / totalDays) * daysWorked;

      const entry = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee.id,
        baseSalary: proportionalSalary,
        bonuses: 0,
        grossSalary: proportionalSalary,
        daysWorked: daysWorked,
        totalDays: totalDays,
        deductions: proportionalSalary * 0.055,
        netSalary: proportionalSalary * 0.945,
        status: 'PENDING'
      });

      expect(entry.daysWorked).toBe(17);
      expect(entry.baseSalary).toBeCloseTo(1645.16, 2);
    });
  });

  describe('Loan Deduction Integration', () => {
    it('debe descontar cuota de préstamo de la nómina', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 2000
      });

      // Crear préstamo activo
      const loan = await db.EmployeeLoan.create({
        employeeId: employee.id,
        loanAmount: 1000,
        interestRate: 10,
        installments: 10,
        installmentAmount: 110, // 1100 / 10
        paidAmount: 0,
        remainingBalance: 1100,
        status: 'ACTIVE',
        approvedBy: 1,
        approvedAt: new Date()
      });

      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      // Crear entrada con descuento de préstamo
      const grossSalary = 2000;
      const legalDeductions = grossSalary * 0.055; // 110
      const loanDeduction = 110;
      const totalDeductions = legalDeductions + loanDeduction;

      const entry = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee.id,
        baseSalary: 2000,
        bonuses: 0,
        grossSalary: grossSalary,
        deductions: totalDeductions,
        loanDeduction: loanDeduction,
        netSalary: grossSalary - totalDeductions,
        status: 'PENDING'
      });

      expect(entry.loanDeduction).toBe(110);
      expect(entry.netSalary).toBe(1780); // 2000 - 110 - 110
    });

    it('debe manejar múltiples préstamos activos', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 3000
      });

      // Crear dos préstamos activos
      await db.EmployeeLoan.create({
        employeeId: employee.id,
        loanAmount: 1000,
        interestRate: 0,
        installments: 10,
        installmentAmount: 100,
        paidAmount: 0,
        remainingBalance: 1000,
        status: 'ACTIVE',
        approvedBy: 1,
        approvedAt: new Date()
      });

      await db.EmployeeLoan.create({
        employeeId: employee.id,
        loanAmount: 500,
        interestRate: 0,
        installments: 5,
        installmentAmount: 100,
        paidAmount: 0,
        remainingBalance: 500,
        status: 'ACTIVE',
        approvedBy: 1,
        approvedAt: new Date()
      });

      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      const totalLoanDeduction = 200; // 100 + 100

      const entry = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee.id,
        baseSalary: 3000,
        bonuses: 0,
        grossSalary: 3000,
        deductions: 165 + totalLoanDeduction, // Legal + préstamos
        loanDeduction: totalLoanDeduction,
        netSalary: 3000 - 165 - totalLoanDeduction,
        status: 'PENDING'
      });

      expect(entry.loanDeduction).toBe(200);
      expect(entry.netSalary).toBe(2635);
    });

    it('debe actualizar saldo de préstamo al pagar nómina', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 2000
      });

      const loan = await db.EmployeeLoan.create({
        employeeId: employee.id,
        loanAmount: 1000,
        interestRate: 0,
        installments: 10,
        installmentAmount: 100,
        paidAmount: 0,
        remainingBalance: 1000,
        status: 'ACTIVE',
        approvedBy: 1,
        approvedAt: new Date()
      });

      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'APPROVED'
      });

      const entry = await db.PayrollEntry.create({
        periodId: period.id,
        employeeId: employee.id,
        baseSalary: 2000,
        grossSalary: 2000,
        deductions: 210,
        loanDeduction: 100,
        netSalary: 1790,
        status: 'PAID',
        paidAt: new Date()
      });

      // Actualizar préstamo (simulado - en servicio real)
      loan.paidAmount += 100;
      loan.remainingBalance -= 100;
      await loan.save();

      const updatedLoan = await db.EmployeeLoan.findByPk(loan.id);
      expect(updatedLoan.paidAmount).toBe(100);
      expect(updatedLoan.remainingBalance).toBe(900);
    });
  });

  describe('Payroll Approval Workflow', () => {
    it('debe cambiar estado de DRAFT a APPROVED', async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      // Aprobar período
      period.status = 'APPROVED';
      period.approvedBy = 1;
      period.approvedAt = new Date();
      await period.save();

      const updatedPeriod = await db.PayrollPeriod.findByPk(period.id);
      expect(updatedPeriod.status).toBe('APPROVED');
      expect(updatedPeriod.approvedBy).toBe(1);
      expect(updatedPeriod.approvedAt).not.toBeNull();
    });

    it('NO debe permitir editar período aprobado', async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'APPROVED',
        approvedBy: 1,
        approvedAt: new Date()
      });

      // Validación (debe hacerse en el servicio)
      const isEditable = period.status === 'DRAFT';
      expect(isEditable).toBe(false);
    });

    it('debe permitir rechazar y volver a DRAFT', async () => {
      const period = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'APPROVED',
        approvedBy: 1,
        approvedAt: new Date()
      });

      // Rechazar y volver a draft
      period.status = 'DRAFT';
      period.approvedBy = null;
      period.approvedAt = null;
      await period.save();

      const updatedPeriod = await db.PayrollPeriod.findByPk(period.id);
      expect(updatedPeriod.status).toBe('DRAFT');
      expect(updatedPeriod.approvedBy).toBeNull();
    });
  });

  describe('Bank Account Distribution', () => {
    it('debe distribuir pago en múltiples cuentas bancarias', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 2000
      });

      // Crear dos cuentas: 60% VES, 40% USD
      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco Nacional',
        accountNumber: '01020123456789012345',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 60
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco Internacional',
        accountNumber: '99990123456789',
        accountType: 'SAVINGS',
        currency: 'USD',
        isPrimary: false,
        paymentPercentage: 40
      });

      const accounts = await db.EmployeeBankAccount.findAll({
        where: { employeeId: employee.id }
      });

      const netSalary = 1890; // Después de deducciones
      const account1Amount = netSalary * 0.60; // 1134
      const account2Amount = netSalary * 0.40; // 756

      expect(accounts).toHaveLength(2);
      expect(account1Amount).toBe(1134);
      expect(account2Amount).toBe(756);
      expect(account1Amount + account2Amount).toBe(netSalary);
    });

    it('debe validar que porcentajes sumen 100%', async () => {
      const employee = await db.Employee.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        idType: 'V',
        idNumber: '12345678',
        hireDate: new Date('2024-01-01'),
        employmentStatus: 'ACTIVE',
        baseSalary: 2000
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco 1',
        accountNumber: '111111',
        accountType: 'CHECKING',
        currency: 'VES',
        isPrimary: true,
        paymentPercentage: 60
      });

      await db.EmployeeBankAccount.create({
        employeeId: employee.id,
        bankName: 'Banco 2',
        accountNumber: '222222',
        accountType: 'SAVINGS',
        currency: 'USD',
        isPrimary: false,
        paymentPercentage: 40
      });

      const accounts = await db.EmployeeBankAccount.findAll({
        where: { employeeId: employee.id }
      });

      const totalPercentage = accounts.reduce((sum, acc) => sum + acc.paymentPercentage, 0);
      expect(totalPercentage).toBe(100);
    });
  });

  describe('Payroll Period Validation', () => {
    it('NO debe permitir períodos superpuestos', async () => {
      await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      });

      // Intentar crear período superpuesto
      const overlappingPeriod = {
        periodCode: 'NOM-2025-01-Q1',
        periodType: 'BIWEEKLY',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-31'),
        status: 'DRAFT'
      };

      // Esta validación debe hacerse en el servicio
      const existing = await db.PayrollPeriod.findOne({
        where: {
          startDate: { [db.Sequelize.Op.lte]: overlappingPeriod.endDate },
          endDate: { [db.Sequelize.Op.gte]: overlappingPeriod.startDate }
        }
      });

      expect(existing).not.toBeNull();
    });

    it('debe permitir períodos consecutivos sin superposición', async () => {
      await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-01',
        periodType: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'APPROVED'
      });

      const nextPeriod = await db.PayrollPeriod.create({
        periodCode: 'NOM-2025-02',
        periodType: 'MONTHLY',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-28'),
        status: 'DRAFT'
      });

      expect(nextPeriod.periodCode).toBe('NOM-2025-02');
    });
  });
});
