const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentCategory = sequelize.define('DocumentCategory', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Categoría padre para jerarquía
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'document_categories',
        key: 'id',
      },
    },
    // Módulo al que pertenece (EMPLOYEE, PROJECT, CONTRACTOR, VEHICLE, etc.)
    module: {
      type: DataTypes.ENUM(
        'GENERAL',
        'EMPLOYEE',
        'PROJECT',
        'CONTRACTOR',
        'VEHICLE',
        'FINANCE',
        'HSE',
        'LEGAL',
        'ADMINISTRATIVE'
      ),
      defaultValue: 'GENERAL',
    },
    // Indica si los documentos de esta categoría requieren vencimiento
    requires_expiry: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Días de anticipación para alertar vencimiento
    expiry_alert_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    // Indica si es obligatorio para el módulo
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Orden de visualización
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'document_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['module'] },
      { fields: ['parent_id'] },
      { fields: ['is_active'] },
    ],
  });

  return DocumentCategory;
};
