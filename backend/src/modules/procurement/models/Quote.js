const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Quote = sequelize.define('Quote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la cotización (ej: COT-2025-001)',
    },
    // Tipo de cotización
    quoteType: {
      type: DataTypes.ENUM('PURCHASE', 'SERVICE', 'WORK'),
      allowNull: false,
      defaultValue: 'SERVICE',
      field: 'quote_type',
      comment: 'PURCHASE=Compra, SERVICE=Servicio, WORK=Obra',
    },
    // Relaciones
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    quoteRequestId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'quote_request_id',
      comment: 'Solicitud de cotización asociada',
    },
    // Información de la cotización
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fechas
    quoteDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'quote_date',
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'valid_until',
      comment: 'Fecha de vencimiento de la cotización',
    },
    deliveryTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'delivery_time',
      comment: 'Tiempo de entrega estimado',
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
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'tax_amount',
    },
    discount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    // Términos
    paymentTerms: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'payment_terms',
      comment: 'Condiciones de pago',
    },
    deliveryTerms: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'delivery_terms',
    },
    warranty: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Términos de garantía',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'DRAFT',          // Borrador
        'RECEIVED',       // Recibida
        'UNDER_REVIEW',   // En revisión
        'APPROVED',       // Aprobada
        'REJECTED',       // Rechazada
        'EXPIRED',        // Vencida
        'CONVERTED'       // Convertida a OC
      ),
      allowNull: false,
      defaultValue: 'RECEIVED',
    },
    // Comparación
    isPreferred: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_preferred',
      comment: 'Cotización preferida/seleccionada',
    },
    comparisonNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comparison_notes',
      comment: 'Notas de comparación con otras cotizaciones',
    },
    // Referencia a OC generada
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'purchase_order_id',
      comment: 'OC generada a partir de esta cotización',
    },
    // Archivos
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
      comment: 'Documento de la cotización',
    },
    // Aprobaciones
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reviewed_by',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
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
    tableName: 'quotes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['contractor_id'] },
      { fields: ['project_id'] },
      { fields: ['quote_type'] },
      { fields: ['quote_date'] },
      { fields: ['status'] },
      { fields: ['valid_until'] },
      { fields: ['is_preferred'] },
    ],
  });

  return Quote;
};
