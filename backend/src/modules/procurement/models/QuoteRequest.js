const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuoteRequest = sequelize.define('QuoteRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la solicitud (ej: SOL-2025-001)',
    },
    // Tipo de solicitud
    requestType: {
      type: DataTypes.ENUM('PURCHASE', 'SERVICE', 'WORK'),
      allowNull: false,
      defaultValue: 'SERVICE',
      field: 'request_type',
    },
    // Relaciones
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'department_id',
    },
    // Información de la solicitud
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Justificación de la solicitud',
    },
    // Fechas
    requestDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'request_date',
    },
    requiredDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'required_date',
      comment: 'Fecha requerida de entrega',
    },
    quotesDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'quotes_deadline',
      comment: 'Fecha límite para recibir cotizaciones',
    },
    // Presupuesto estimado
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    estimatedBudget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'estimated_budget',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'DRAFT',          // Borrador
        'PENDING',        // Pendiente de aprobación
        'APPROVED',       // Aprobada
        'REJECTED',       // Rechazada
        'QUOTING',        // En proceso de cotización
        'EVALUATING',     // Evaluando cotizaciones
        'AWARDED',        // Adjudicada
        'CANCELLED'       // Cancelada
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Número de cotizaciones requeridas
    minQuotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'min_quotes',
      comment: 'Número mínimo de cotizaciones requeridas',
    },
    receivedQuotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'received_quotes',
    },
    // Cotización seleccionada
    selectedQuoteId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'selected_quote_id',
    },
    // OC generada
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'purchase_order_id',
    },
    // Aprobaciones
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'requested_by',
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
    tableName: 'quote_requests',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['department_id'] },
      { fields: ['request_type'] },
      { fields: ['request_date'] },
      { fields: ['status'] },
      { fields: ['requested_by'] },
    ],
  });

  return QuoteRequest;
};
