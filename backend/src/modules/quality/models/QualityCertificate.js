const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QualityCertificate = sequelize.define('QualityCertificate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del certificado (ej: QC-001)',
    },
    // Relaciones
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    inspectionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inspection_id',
      references: {
        model: 'quality_inspections',
        key: 'id',
      },
    },
    // Tipo de certificado
    certificateType: {
      type: DataTypes.ENUM(
        'MATERIAL',       // Certificado de material
        'CONFORMITY',     // Certificado de conformidad
        'TEST',           // Certificado de prueba
        'CALIBRATION',    // Certificado de calibración
        'COMPLETION',     // Certificado de terminación
        'WARRANTY',       // Certificado de garantía
        'OTHER'           // Otro
      ),
      allowNull: false,
      field: 'certificate_type',
    },
    // Información del certificado
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Elemento certificado
    certifiedItem: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'certified_item',
    },
    // Fechas
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'issue_date',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
    // Número de certificado externo (si aplica)
    externalCertNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'external_cert_number',
    },
    // Emisor
    issuedBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'issued_by',
      comment: 'Organismo/persona que emite el certificado',
    },
    // Normas/Estándares
    standardsReference: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'standards_reference',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('DRAFT', 'ISSUED', 'EXPIRED', 'REVOKED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Archivo adjunto
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'quality_certificates',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['inspection_id'] },
      { fields: ['certificate_type'] },
      { fields: ['status'] },
      { fields: ['issue_date'] },
      { fields: ['expiry_date'] },
    ],
  });

  return QualityCertificate;
};
