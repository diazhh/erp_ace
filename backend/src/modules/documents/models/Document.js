const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Categoría del documento
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'document_categories',
        key: 'id',
      },
    },
    // Tipo de documento
    document_type: {
      type: DataTypes.ENUM(
        'CONTRACT',           // Contrato
        'AGREEMENT',          // Convenio
        'POLICY',             // Política
        'PROCEDURE',          // Procedimiento
        'MANUAL',             // Manual
        'FORM',               // Formulario
        'REPORT',             // Informe
        'CERTIFICATE',        // Certificado
        'LICENSE',            // Licencia
        'PERMIT',             // Permiso
        'INVOICE',            // Factura
        'RECEIPT',            // Recibo
        'LETTER',             // Carta
        'MEMO',               // Memorando
        'MINUTE',             // Acta
        'SPECIFICATION',      // Especificación
        'DRAWING',            // Plano/Dibujo
        'PHOTO',              // Fotografía
        'ID_DOCUMENT',        // Documento de identidad
        'OTHER'               // Otro
      ),
      defaultValue: 'OTHER',
    },
    // Estado del documento
    status: {
      type: DataTypes.ENUM(
        'DRAFT',              // Borrador
        'PENDING_REVIEW',     // Pendiente de revisión
        'APPROVED',           // Aprobado
        'REJECTED',           // Rechazado
        'EXPIRED',            // Vencido
        'ARCHIVED',           // Archivado
        'CANCELLED'           // Cancelado
      ),
      defaultValue: 'DRAFT',
    },
    // Entidad relacionada (polimórfica)
    entity_type: {
      type: DataTypes.ENUM(
        'EMPLOYEE',
        'PROJECT',
        'CONTRACTOR',
        'VEHICLE',
        'BANK_ACCOUNT',
        'PETTY_CASH',
        'INCIDENT',
        'TRAINING',
        'INSPECTION',
        'PURCHASE_ORDER',
        'INVOICE',
        'GENERAL'
      ),
      defaultValue: 'GENERAL',
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Archivo
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // URL externa (para documentos en la nube)
    external_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Fechas importantes
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Número de documento externo (ej: número de contrato, licencia, etc.)
    external_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Versión actual
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // Tags para búsqueda
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    // Metadatos adicionales
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    // Confidencialidad
    confidentiality_level: {
      type: DataTypes.ENUM('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'),
      defaultValue: 'INTERNAL',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    archived_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    archived_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'documents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['category_id'] },
      { fields: ['document_type'] },
      { fields: ['status'] },
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['expiry_date'] },
      { fields: ['confidentiality_level'] },
      { fields: ['created_by'] },
    ],
  });

  return Document;
};
