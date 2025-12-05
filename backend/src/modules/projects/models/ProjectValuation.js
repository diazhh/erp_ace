const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectValuation = sequelize.define('ProjectValuation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la valuación (ej: VAL-PRJ001-001)',
    },
    // Relaciones
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
    },
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    // Número de valuación
    valuationNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'valuation_number',
      comment: 'Número secuencial de valuación del proyecto (1, 2, 3...)',
    },
    // Período de la valuación
    periodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_start',
      comment: 'Inicio del período de medición',
    },
    periodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_end',
      comment: 'Fin del período de medición',
    },
    // Montos
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Avance acumulado anterior
    previousAccumulatedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'previous_accumulated_amount',
      comment: 'Monto acumulado de valuaciones anteriores',
    },
    previousAccumulatedPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'previous_accumulated_percent',
      comment: 'Porcentaje acumulado anterior',
    },
    // Avance de esta valuación
    currentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'current_amount',
      comment: 'Monto de esta valuación',
    },
    currentPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'current_percent',
      comment: 'Porcentaje de avance de esta valuación',
    },
    // Avance acumulado total
    totalAccumulatedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_accumulated_amount',
      comment: 'Monto acumulado total (anterior + actual)',
    },
    totalAccumulatedPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'total_accumulated_percent',
      comment: 'Porcentaje acumulado total',
    },
    // Descripción del trabajo realizado
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del trabajo ejecutado en este período',
    },
    // Observaciones de la inspección
    inspectionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'inspection_notes',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'DRAFT',           // Borrador
        'SUBMITTED',       // Enviada para revisión
        'UNDER_REVIEW',    // En revisión
        'APPROVED',        // Aprobada
        'REJECTED',        // Rechazada
        'INVOICED',        // Facturada
        'PAID'             // Pagada
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Fechas de proceso
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at',
    },
    submittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'submitted_by',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reviewed_by',
    },
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
    // Referencia a factura generada
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'invoice_id',
      comment: 'Factura generada a partir de esta valuación',
    },
    // Archivos adjuntos
    reportUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'report_url',
      comment: 'URL del informe de valuación',
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
    tableName: 'project_valuations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['contractor_id'] },
      { fields: ['project_id', 'valuation_number'], unique: true },
      { fields: ['status'] },
      { fields: ['period_start'] },
      { fields: ['period_end'] },
      { fields: ['invoice_id'] },
    ],
  });

  return ProjectValuation;
};
