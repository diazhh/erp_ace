const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Código único
    code: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
      comment: 'Código único de transacción (TRX-YYYY-NNNN)',
    },
    // Tipo de transacción
    transactionType: {
      type: DataTypes.ENUM('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT'),
      allowNull: false,
      field: 'transaction_type',
    },
    // Categoría
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Categoría de la transacción',
    },
    subcategory: {
      type: DataTypes.STRING(50),
      comment: 'Subcategoría opcional',
    },
    // Cuenta origen/destino
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'account_id',
      references: {
        model: 'bank_accounts',
        key: 'id',
      },
    },
    // Para transferencias
    destinationAccountId: {
      type: DataTypes.UUID,
      field: 'destination_account_id',
      references: {
        model: 'bank_accounts',
        key: 'id',
      },
    },
    // Monto
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Tasa de cambio (si aplica)
    exchangeRate: {
      type: DataTypes.DECIMAL(20, 6),
      field: 'exchange_rate',
      comment: 'Tasa de cambio al momento de la transacción',
    },
    amountInUsd: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'amount_in_usd',
      comment: 'Monto equivalente en USD',
    },
    // Fecha de la transacción
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'transaction_date',
    },
    // Descripción
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    // Referencia externa
    reference: {
      type: DataTypes.STRING(100),
      comment: 'Número de referencia, factura, etc.',
    },
    // Beneficiario/Pagador
    counterparty: {
      type: DataTypes.STRING(150),
      comment: 'Nombre del beneficiario o pagador',
    },
    counterpartyDocument: {
      type: DataTypes.STRING(30),
      field: 'counterparty_document',
      comment: 'RIF/CI del beneficiario o pagador',
    },
    // Método de pago
    paymentMethod: {
      type: DataTypes.ENUM('BANK_TRANSFER', 'CASH', 'BINANCE', 'PAGO_MOVIL', 'ZELLE', 'CHECK', 'CRYPTO'),
      field: 'payment_method',
    },
    // Relaciones con otros módulos
    employeeId: {
      type: DataTypes.UUID,
      field: 'employee_id',
      comment: 'Si es pago de nómina',
    },
    payrollPeriodId: {
      type: DataTypes.UUID,
      field: 'payroll_period_id',
      comment: 'Período de nómina relacionado',
    },
    projectId: {
      type: DataTypes.UUID,
      field: 'project_id',
      comment: 'Proyecto relacionado',
    },
    pettyCashId: {
      type: DataTypes.UUID,
      field: 'petty_cash_id',
      comment: 'Caja chica relacionada',
    },
    // Evidencia documental
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array de URLs de archivos adjuntos',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'RECONCILED'),
      defaultValue: 'CONFIRMED',
    },
    // Conciliación
    isReconciled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_reconciled',
    },
    reconciledAt: {
      type: DataTypes.DATE,
      field: 'reconciled_at',
    },
    reconciledBy: {
      type: DataTypes.UUID,
      field: 'reconciled_by',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      field: 'created_by',
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['transaction_type'] },
      { fields: ['category'] },
      { fields: ['account_id'] },
      { fields: ['transaction_date'] },
      { fields: ['status'] },
      { fields: ['is_reconciled'] },
    ],
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.BankAccount, {
      foreignKey: 'accountId',
      as: 'account',
    });
    Transaction.belongsTo(models.BankAccount, {
      foreignKey: 'destinationAccountId',
      as: 'destinationAccount',
    });
    Transaction.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    Transaction.belongsTo(models.User, {
      foreignKey: 'reconciledBy',
      as: 'reconciler',
    });
    Transaction.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });
  };

  return Transaction;
};
