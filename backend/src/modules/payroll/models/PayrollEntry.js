const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PayrollEntry = sequelize.define('PayrollEntry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Referencias
    periodId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'period_id',
      references: {
        model: 'payroll_periods',
        key: 'id',
      },
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Salario base del período
    baseSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'base_salary',
    },
    // Días trabajados
    daysWorked: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      field: 'days_worked',
      comment: 'Días trabajados en el período',
    },
    totalDays: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      field: 'total_days',
      comment: 'Total días del período',
    },
    // Ingresos adicionales
    overtime: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Horas extra',
    },
    overtimeHours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      field: 'overtime_hours',
    },
    bonus: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Bonificaciones',
    },
    commission: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Comisiones',
    },
    foodAllowance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'food_allowance',
      comment: 'Cesta ticket / Bono alimentación',
    },
    transportAllowance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'transport_allowance',
      comment: 'Bono de transporte',
    },
    otherIncome: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'other_income',
    },
    otherIncomeDescription: {
      type: DataTypes.STRING(255),
      field: 'other_income_description',
    },
    // Total bruto
    grossPay: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'gross_pay',
    },
    // Deducciones legales (Venezuela)
    ssoDeduction: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'sso_deduction',
      comment: 'Seguro Social Obligatorio (4%)',
    },
    rpeDeduction: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'rpe_deduction',
      comment: 'Régimen Prestacional de Empleo (0.5%)',
    },
    favDeduction: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'fav_deduction',
      comment: 'FAOV - Ahorro Habitacional (1%)',
    },
    islrDeduction: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'islr_deduction',
      comment: 'ISLR - Impuesto sobre la renta',
    },
    // Deducciones por préstamos
    loanDeduction: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'loan_deduction',
      comment: 'Cuota de préstamo',
    },
    // Otras deducciones
    otherDeductions: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'other_deductions',
    },
    otherDeductionsDescription: {
      type: DataTypes.STRING(255),
      field: 'other_deductions_description',
    },
    // Total deducciones
    totalDeductions: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'total_deductions',
    },
    // Neto a pagar
    netPay: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'net_pay',
    },
    // Moneda y método de pago
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    paymentMethod: {
      type: DataTypes.ENUM('BANK_TRANSFER', 'CASH', 'BINANCE', 'PAGO_MOVIL', 'ZELLE', 'CHECK'),
      defaultValue: 'BANK_TRANSFER',
      field: 'payment_method',
    },
    paymentReference: {
      type: DataTypes.STRING(100),
      field: 'payment_reference',
    },
    // Estado del pago
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'PARTIAL', 'CANCELLED'),
      defaultValue: 'PENDING',
      field: 'payment_status',
    },
    paidAt: {
      type: DataTypes.DATE,
      field: 'paid_at',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'payroll_entries',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['period_id'] },
      { fields: ['employee_id'] },
      { fields: ['payment_status'] },
      { unique: true, fields: ['period_id', 'employee_id'] },
    ],
  });

  // Método para calcular totales
  PayrollEntry.prototype.calculateTotals = function() {
    // Calcular bruto
    const proportionalSalary = (this.baseSalary / this.totalDays) * this.daysWorked;
    this.grossPay = parseFloat(proportionalSalary) + 
                    parseFloat(this.overtime || 0) + 
                    parseFloat(this.bonus || 0) + 
                    parseFloat(this.commission || 0) + 
                    parseFloat(this.foodAllowance || 0) + 
                    parseFloat(this.transportAllowance || 0) + 
                    parseFloat(this.otherIncome || 0);
    
    // Calcular deducciones legales (sobre salario base proporcional)
    this.ssoDeduction = proportionalSalary * 0.04;  // 4% SSO
    this.rpeDeduction = proportionalSalary * 0.005; // 0.5% RPE
    this.favDeduction = proportionalSalary * 0.01;  // 1% FAOV
    
    // Total deducciones
    this.totalDeductions = parseFloat(this.ssoDeduction) + 
                           parseFloat(this.rpeDeduction) + 
                           parseFloat(this.favDeduction) + 
                           parseFloat(this.islrDeduction || 0) + 
                           parseFloat(this.loanDeduction || 0) + 
                           parseFloat(this.otherDeductions || 0);
    
    // Neto
    this.netPay = this.grossPay - this.totalDeductions;
    
    return this;
  };

  return PayrollEntry;
};
