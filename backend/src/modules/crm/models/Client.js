const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del cliente (ej: CLI-001)',
    },
    // Tipo de cliente
    clientType: {
      type: DataTypes.ENUM('COMPANY', 'INDIVIDUAL'),
      allowNull: false,
      defaultValue: 'COMPANY',
      field: 'client_type',
    },
    // Información de empresa
    companyName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'company_name',
      comment: 'Razón social (para empresas)',
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
    // Información de persona (para INDIVIDUAL)
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name',
    },
    idNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'id_number',
      comment: 'Cédula de identidad',
    },
    // Industria/Sector
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Sector industrial (ej: Petrolero, Construcción)',
    },
    // Contacto principal
    contactName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'contact_name',
    },
    contactPosition: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'contact_position',
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(200),
      allowNull: true,
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
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'postal_code',
    },
    // Clasificación
    category: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: true,
      comment: 'Clasificación del cliente (A=Premium, B=Regular, C=Ocasional, D=Nuevo)',
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Origen del cliente (Referido, Web, Evento, etc.)',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PROSPECT', 'ACTIVE', 'INACTIVE', 'SUSPENDED'),
      allowNull: false,
      defaultValue: 'PROSPECT',
    },
    // Métricas
    totalRevenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_revenue',
      comment: 'Ingresos totales generados por este cliente',
    },
    totalProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_projects',
    },
    lastProjectDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_project_date',
    },
    // Condiciones comerciales
    creditLimit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'credit_limit',
    },
    paymentTerms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'payment_terms',
      comment: 'Días de crédito',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Responsable
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_id',
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Usuario responsable del cliente',
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
    tableName: 'clients',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['company_name'] },
      { fields: ['tax_id'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['assigned_to_id'] },
      { fields: ['industry'] },
    ],
  });

  return Client;
};
