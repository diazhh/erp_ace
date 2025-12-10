const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClientContact = sequelize.define('ClientContact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'client_id',
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    // Información personal
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name',
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Cargo en la empresa',
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Departamento',
    },
    // Contacto
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
    // Tipo de contacto
    contactType: {
      type: DataTypes.ENUM('PRIMARY', 'BILLING', 'TECHNICAL', 'OPERATIONS', 'OTHER'),
      allowNull: false,
      defaultValue: 'PRIMARY',
      field: 'contact_type',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
    },
    // Estado
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
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
    tableName: 'client_contacts',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['client_id'] },
      { fields: ['email'] },
      { fields: ['is_primary'] },
      { fields: ['is_active'] },
    ],
  });

  return ClientContact;
};
