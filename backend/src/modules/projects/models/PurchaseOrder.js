const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la orden (ej: OC-2025-001)',
    },
    // Tipo de orden
    orderType: {
      type: DataTypes.ENUM('PURCHASE', 'SERVICE', 'WORK'),
      allowNull: false,
      defaultValue: 'SERVICE',
      field: 'order_type',
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
    // Campo petrolero asociado
    fieldId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'field_id',
    },
    // Pozo asociado
    wellId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'well_id',
    },
    // Información de la orden
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fechas
    orderDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'order_date',
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'delivery_date',
      comment: 'Fecha de entrega esperada',
    },
    actualDeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'actual_delivery_date',
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
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    // Términos
    paymentTerms: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'payment_terms',
      comment: 'Condiciones de pago (ej: 50% anticipo, 50% contra entrega)',
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
    // Ubicación de entrega
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'delivery_address',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'DRAFT',          // Borrador
        'PENDING',        // Pendiente de aprobación
        'APPROVED',       // Aprobada
        'SENT',           // Enviada al contratista
        'CONFIRMED',      // Confirmada por contratista
        'IN_PROGRESS',    // En ejecución
        'PARTIAL',        // Entrega parcial
        'COMPLETED',      // Completada
        'CANCELLED'       // Cancelada
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Seguimiento de ejecución
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Porcentaje de avance (0-100)',
    },
    // Facturación
    invoicedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'invoiced_amount',
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'paid_amount',
    },
    // Aprobaciones
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'requested_by',
      comment: 'Usuario que solicita la orden',
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
    // Archivos
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
      comment: 'Documento de la orden',
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
    tableName: 'purchase_orders',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['contractor_id'] },
      { fields: ['project_id'] },
      { fields: ['order_type'] },
      { fields: ['order_date'] },
      { fields: ['status'] },
      { fields: ['delivery_date'] },
    ],
  });

  return PurchaseOrder;
};
