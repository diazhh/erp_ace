const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmployeeLoan = sequelize.define('EmployeeLoan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Empleado
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Información del préstamo
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      comment: 'Código único del préstamo',
    },
    loanType: {
      type: DataTypes.ENUM('PERSONAL', 'ADVANCE', 'EMERGENCY', 'OTHER'),
      defaultValue: 'PERSONAL',
      field: 'loan_type',
      comment: 'PERSONAL=Préstamo personal, ADVANCE=Adelanto de sueldo, EMERGENCY=Emergencia, OTHER=Otro',
    },
    description: {
      type: DataTypes.STRING(255),
    },
    // Montos
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Monto total del préstamo',
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    // Cuotas
    totalInstallments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_installments',
      comment: 'Número total de cuotas',
    },
    installmentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'installment_amount',
      comment: 'Monto de cada cuota',
    },
    paidInstallments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'paid_installments',
      comment: 'Cuotas pagadas',
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(15, 2),
      field: 'remaining_amount',
      comment: 'Saldo pendiente',
    },
    // Fechas
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
      comment: 'Fecha de inicio del préstamo',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      field: 'end_date',
      comment: 'Fecha estimada de finalización',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PAID', 'CANCELLED', 'PAUSED'),
      defaultValue: 'ACTIVE',
    },
    // Aprobación
    approvedBy: {
      type: DataTypes.UUID,
      field: 'approved_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approvedAt: {
      type: DataTypes.DATE,
      field: 'approved_at',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
    // Usuario que creó
    createdBy: {
      type: DataTypes.UUID,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'employee_loans',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['status'] },
      { fields: ['code'] },
    ],
  });

  // Hook para calcular saldo restante
  EmployeeLoan.beforeSave(async (loan) => {
    loan.remainingAmount = loan.amount - (loan.paidInstallments * loan.installmentAmount);
    if (loan.remainingAmount <= 0) {
      loan.status = 'PAID';
      loan.remainingAmount = 0;
    }
  });

  return EmployeeLoan;
};
