const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContractorDocument = sequelize.define('ContractorDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    // Tipo de documento
    documentType: {
      type: DataTypes.ENUM(
        'RIF',                    // Registro de Información Fiscal
        'CONSTITUTIVE_ACT',       // Acta Constitutiva
        'COMMERCIAL_REGISTER',    // Registro Mercantil
        'TAX_COMPLIANCE',         // Solvencia SENIAT
        'SOCIAL_SECURITY',        // Solvencia IVSS
        'HOUSING_FUND',           // Solvencia FAOV/BANAVIH
        'INCE',                   // Solvencia INCE
        'INSURANCE_POLICY',       // Póliza de Seguro
        'PROFESSIONAL_LICENSE',   // Licencia Profesional
        'BANK_REFERENCE',         // Referencia Bancaria
        'COMMERCIAL_REFERENCE',   // Referencia Comercial
        'CONTRACT',               // Contrato
        'QUOTE',                  // Cotización
        'OTHER'
      ),
      allowNull: false,
      field: 'document_type',
    },
    // Información del documento
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre descriptivo del documento',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documentNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'document_number',
      comment: 'Número de documento (ej: número de póliza)',
    },
    // Fechas de vigencia
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'issue_date',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
    // Archivo
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'file_name',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'file_size',
      comment: 'Tamaño en bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mime_type',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'VALID', 'EXPIRED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    // Verificación
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'verified_by',
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
    tableName: 'contractor_documents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['contractor_id'] },
      { fields: ['document_type'] },
      { fields: ['status'] },
      { fields: ['expiry_date'] },
    ],
  });

  return ContractorDocument;
};
