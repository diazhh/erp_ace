const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectExpense = sequelize.define('ProjectExpense', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del gasto (ej: PRJ-001-EXP-001)',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
    },
    // Tipo de gasto
    expenseType: {
      type: DataTypes.ENUM('LABOR', 'MATERIALS', 'EQUIPMENT', 'SERVICES', 'TRAVEL', 'OTHER'),
      allowNull: false,
      field: 'expense_type',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Subcategoría del gasto',
    },
    // Datos del gasto
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'exchange_rate',
    },
    // Fecha del gasto
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'expense_date',
    },
    // Comprobante
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'receipt_number',
    },
    receiptImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'receipt_image_url',
    },
    // Proveedor
    vendor: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    vendorRif: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'vendor_rif',
    },
    // Empleado que realizó el gasto
    employeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'employee_id',
    },
    // Hito asociado (opcional)
    milestoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'milestone_id',
    },
    // Relación con transacción financiera
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      comment: 'Transacción financiera asociada',
    },
    // Relación con entrada de caja chica
    pettyCashEntryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'petty_cash_entry_id',
      comment: 'Entrada de caja chica asociada',
    },
    // Estado y aprobación
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
    },
    // Presupuestado vs Real
    isBudgeted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_budgeted',
      comment: 'Si estaba presupuestado',
    },
    budgetLineItem: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'budget_line_item',
      comment: 'Partida presupuestaria',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'project_expenses',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['expense_type'] },
      { fields: ['expense_date'] },
      { fields: ['status'] },
      { fields: ['employee_id'] },
      { fields: ['milestone_id'] },
    ],
  });

  return ProjectExpense;
};
