const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContractorInvoice = sequelize.define('ContractorInvoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código interno de la factura (ej: INV-CTR-001)',
    },
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto asociado (opcional)',
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'purchase_order_id',
      comment: 'Orden de compra/procura asociada',
    },
    // Datos de la factura del contratista
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'invoice_number',
      comment: 'Número de factura del contratista',
    },
    controlNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'control_number',
      comment: 'Número de control fiscal',
    },
    invoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'invoice_date',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date',
    },
    // Montos
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 16.00,
      field: 'tax_rate',
      comment: 'Porcentaje de IVA',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'tax_amount',
    },
    retentionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'retention_rate',
      comment: 'Porcentaje de retención ISLR',
    },
    retentionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'retention_amount',
    },
    ivaRetentionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'iva_retention_rate',
      comment: 'Porcentaje de retención IVA',
    },
    ivaRetentionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'iva_retention_amount',
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Total de la factura',
    },
    netPayable: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'net_payable',
      comment: 'Monto neto a pagar (total - retenciones)',
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'paid_amount',
      comment: 'Monto pagado',
    },
    pendingAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'pending_amount',
      comment: 'Monto pendiente por pagar',
    },
    // Descripción
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Archivo de factura
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING', 'APPROVED', 'PARTIAL', 'PAID', 'CANCELLED', 'REJECTED'),
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
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
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
    tableName: 'contractor_invoices',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['contractor_id'] },
      { fields: ['project_id'] },
      { fields: ['purchase_order_id'] },
      { fields: ['invoice_number'] },
      { fields: ['invoice_date'] },
      { fields: ['due_date'] },
      { fields: ['status'] },
    ],
  });

  return ContractorInvoice;
};
