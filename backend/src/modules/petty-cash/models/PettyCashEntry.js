const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PettyCashEntry = sequelize.define('PettyCashEntry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del movimiento (ej: CC-001-0001)',
    },
    pettyCashId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'petty_cash_id',
    },
    // Tipo de movimiento
    entryType: {
      type: DataTypes.ENUM('EXPENSE', 'REPLENISHMENT', 'ADJUSTMENT', 'INITIAL'),
      allowNull: false,
      field: 'entry_type',
      comment: 'EXPENSE=gasto, REPLENISHMENT=reposición, ADJUSTMENT=ajuste, INITIAL=apertura',
    },
    // Datos del movimiento
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
      comment: 'Tasa de cambio si aplica',
    },
    // Categorización
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Categoría del gasto (ej: OFFICE_SUPPLIES, TRANSPORT, FOOD)',
    },
    subcategory: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Descripción
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Descripción del gasto o movimiento',
    },
    // Comprobante
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'receipt_number',
      comment: 'Número de factura o recibo',
    },
    receiptDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'receipt_date',
    },
    receiptImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'receipt_image_url',
      comment: 'URL de la imagen del recibo',
    },
    vendor: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Proveedor o comercio',
    },
    vendorRif: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'vendor_rif',
      comment: 'RIF del proveedor',
    },
    // Fecha del movimiento
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'entry_date',
    },
    // Beneficiario (para gastos)
    beneficiaryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'beneficiary_id',
      comment: 'Empleado que recibió el dinero',
    },
    beneficiaryName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'beneficiary_name',
      comment: 'Nombre del beneficiario si no es empleado',
    },
    // Estado y aprobación
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'),
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
    // Pago
    paidBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'paid_by',
      comment: 'Usuario que realizó el pago',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
    paymentReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'payment_reference',
      comment: 'Referencia del pago (número de transferencia, cheque, etc.)',
    },
    // Saldo después del movimiento
    balanceAfter: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'balance_after',
      comment: 'Saldo de la caja después de este movimiento',
    },
    // Relación con transacción financiera (para reposiciones)
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      comment: 'Transacción de reposición asociada',
    },
    // Relación con proyecto (para trazabilidad de gastos)
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto asociado al gasto',
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
    tableName: 'petty_cash_entries',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['petty_cash_id'] },
      { fields: ['entry_type'] },
      { fields: ['entry_date'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['beneficiary_id'] },
      { fields: ['project_id'] },
    ],
  });

  return PettyCashEntry;
};
