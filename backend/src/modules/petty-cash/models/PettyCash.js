const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PettyCash = sequelize.define('PettyCash', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la caja chica (ej: CC-001)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre descriptivo (ej: Caja Chica Oficina Principal)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Configuración financiera
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      comment: 'Moneda de la caja chica',
    },
    initialAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'initial_amount',
      comment: 'Monto inicial asignado',
    },
    currentBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'current_balance',
      comment: 'Saldo actual',
    },
    minimumBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'minimum_balance',
      comment: 'Saldo mínimo antes de reposición',
    },
    maximumExpense: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'maximum_expense',
      comment: 'Monto máximo por gasto individual',
    },
    // Responsable
    custodianId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'custodian_id',
      comment: 'Empleado responsable de la caja',
    },
    // Cuenta bancaria asociada para reposiciones
    bankAccountId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'bank_account_id',
      comment: 'Cuenta bancaria para reposiciones',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Configuración
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'requires_approval',
      comment: 'Requiere aprobación para gastos',
    },
    approvalThreshold: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'approval_threshold',
      comment: 'Monto a partir del cual requiere aprobación',
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
    tableName: 'petty_cash',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['custodian_id'] },
      { fields: ['status'] },
    ],
  });

  return PettyCash;
};
