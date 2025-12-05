const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContractorPayment = sequelize.define('ContractorPayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código del pago (ej: PAY-CTR-001)',
    },
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'invoice_id',
      comment: 'Factura que se está pagando',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto asociado',
    },
    // Cuenta bancaria destino
    bankAccountId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'bank_account_id',
      comment: 'Cuenta del contratista donde se deposita',
    },
    // Cuenta origen (de la empresa)
    sourceBankAccountId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'source_bank_account_id',
      comment: 'Cuenta de la empresa desde donde se paga',
    },
    // Transacción financiera
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      comment: 'Transacción en módulo de finanzas',
    },
    // Datos del pago
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'payment_date',
    },
    paymentMethod: {
      type: DataTypes.ENUM('TRANSFER', 'CHECK', 'CASH', 'WIRE', 'CRYPTO', 'OTHER'),
      allowNull: false,
      defaultValue: 'TRANSFER',
      field: 'payment_method',
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_number',
      comment: 'Número de referencia de la transferencia/cheque',
    },
    // Montos
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: true,
      field: 'exchange_rate',
      comment: 'Tasa de cambio si aplica',
    },
    amountInLocalCurrency: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'amount_in_local_currency',
    },
    // Concepto
    concept: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Concepto del pago',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Comprobante
    receiptUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'receipt_url',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    // Aprobación
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'processed_by',
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
    tableName: 'contractor_payments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['contractor_id'] },
      { fields: ['invoice_id'] },
      { fields: ['project_id'] },
      { fields: ['payment_date'] },
      { fields: ['status'] },
      { fields: ['payment_method'] },
    ],
  });

  return ContractorPayment;
};
