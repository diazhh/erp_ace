const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoanPayment = sequelize.define('LoanPayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Referencias
    loanId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'loan_id',
      references: {
        model: 'employee_loans',
        key: 'id',
      },
    },
    payrollEntryId: {
      type: DataTypes.UUID,
      field: 'payroll_entry_id',
      references: {
        model: 'payroll_entries',
        key: 'id',
      },
      comment: 'Referencia a la entrada de nómina si fue descontado automáticamente',
    },
    // Información del pago
    installmentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'installment_number',
      comment: 'Número de cuota',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    // Fecha de pago
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'payment_date',
    },
    // Método de pago
    paymentMethod: {
      type: DataTypes.ENUM('PAYROLL_DEDUCTION', 'CASH', 'BANK_TRANSFER', 'OTHER'),
      defaultValue: 'PAYROLL_DEDUCTION',
      field: 'payment_method',
    },
    reference: {
      type: DataTypes.STRING(100),
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'loan_payments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['loan_id'] },
      { fields: ['payroll_entry_id'] },
      { fields: ['payment_date'] },
    ],
  });

  return LoanPayment;
};
