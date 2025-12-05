const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attachment = sequelize.define('Attachment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Entidad relacionada (polimórfico)
    entityType: {
      type: DataTypes.ENUM(
        'transaction',
        'petty_cash_entry',
        'vehicle_maintenance',
        'fuel_log',
        'contractor_payment',
        'project_expense',
        'project',
        'incident',
        'inspection',
        'quote',
        'purchase_order',
        'contractor_invoice',
        'inventory_movement',
        'loan_payment',
        'employee_document',
        'training'
      ),
      allowNull: false,
      field: 'entity_type',
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entity_id',
    },
    // Información del archivo
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'file_name',
      comment: 'Nombre único del archivo en el servidor',
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'original_name',
      comment: 'Nombre original del archivo',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'file_size',
      comment: 'Tamaño en bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'mime_type',
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'file_url',
      comment: 'URL o path del archivo',
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
      comment: 'URL del thumbnail (solo para imágenes)',
    },
    // Categorización
    category: {
      type: DataTypes.ENUM(
        'RECEIPT',      // Recibo
        'INVOICE',      // Factura
        'PHOTO',        // Foto general
        'BEFORE',       // Foto antes
        'AFTER',        // Foto después
        'PROGRESS',     // Foto de avance
        'EVIDENCE',     // Evidencia
        'DOCUMENT',     // Documento general
        'CONTRACT',     // Contrato
        'REPORT',       // Informe
        'OTHER'         // Otro
      ),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Descripción del archivo',
    },
    // Metadatos adicionales
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Metadatos adicionales (EXIF, dimensiones, etc.)',
    },
    // Auditoría
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by',
    },
    // Orden de visualización
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    // Estado
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'attachments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['uploaded_by'] },
      { fields: ['category'] },
      { fields: ['mime_type'] },
      { fields: ['is_active'] },
      { fields: ['created_at'] },
    ],
  });

  return Attachment;
};
