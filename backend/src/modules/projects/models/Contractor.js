const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contractor = sequelize.define('Contractor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del contratista (ej: CTR-001)',
    },
    // Información de la empresa
    companyName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'company_name',
      comment: 'Razón social de la empresa contratista',
    },
    tradeName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'trade_name',
      comment: 'Nombre comercial',
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'tax_id',
      comment: 'RIF o identificación fiscal',
    },
    // Contacto principal
    contactName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'contact_name',
      comment: 'Nombre del contacto principal',
    },
    contactEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'contact_email',
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'contact_phone',
    },
    // Dirección
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Venezuela',
    },
    // Especialidades/Servicios
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Lista de especialidades (ej: CONSTRUCTION, ELECTRICAL, PLUMBING)',
    },
    // Datos bancarios
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'bank_name',
    },
    bankAccountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'bank_account_number',
    },
    bankAccountType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'bank_account_type',
      comment: 'CHECKING, SAVINGS',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Calificación/Rating
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
      comment: 'Calificación promedio (0-5)',
    },
    totalProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_projects',
      comment: 'Total de proyectos asignados',
    },
    completedProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'completed_projects',
      comment: 'Proyectos completados exitosamente',
    },
    // Documentación
    hasInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'has_insurance',
      comment: 'Tiene póliza de seguro vigente',
    },
    insuranceExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'insurance_expiry',
    },
    hasLicense: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'has_license',
      comment: 'Tiene licencia/permiso vigente',
    },
    licenseExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'license_expiry',
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
    tableName: 'contractors',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['company_name'] },
      { fields: ['tax_id'] },
      { fields: ['status'] },
      { fields: ['rating'] },
    ],
  });

  return Contractor;
};
