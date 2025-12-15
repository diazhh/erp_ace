const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExpenseReport = sequelize.define('ExpenseReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del reporte (ej: RG-001)',
    },
    // Relación con el movimiento de caja chica
    pettyCashEntryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'petty_cash_entry_id',
    },
    // Empleado que reporta
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
    },
    // Fecha del reporte
    reportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'report_date',
    },
    // Monto original recibido
    amountReceived: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'amount_received',
      comment: 'Monto recibido de caja chica',
    },
    // Total gastado
    totalSpent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_spent',
      comment: 'Total gastado en compras',
    },
    // Vuelto devuelto
    changeReturned: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'change_returned',
      comment: 'Vuelto devuelto a caja chica',
    },
    // Diferencia
    difference: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Diferencia: total_spent - amount_received + change_returned',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Aprobación
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at',
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
    // Proyecto asociado
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
  }, {
    tableName: 'expense_reports',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['petty_cash_entry_id'] },
      { fields: ['employee_id'] },
      { fields: ['status'] },
      { fields: ['report_date'] },
      { fields: ['project_id'] },
    ],
  });

  return ExpenseReport;
};
