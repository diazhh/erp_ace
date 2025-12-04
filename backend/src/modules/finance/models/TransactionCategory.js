const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionCategory = sequelize.define('TransactionCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Nombre de la categoría
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // Tipo (ingreso o gasto)
    type: {
      type: DataTypes.ENUM('INCOME', 'EXPENSE', 'BOTH'),
      allowNull: false,
    },
    // Categoría padre (para subcategorías)
    parentId: {
      type: DataTypes.UUID,
      field: 'parent_id',
    },
    // Código para reportes
    code: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    // Descripción
    description: {
      type: DataTypes.STRING(255),
    },
    // Color para UI
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#1976d2',
    },
    // Icono
    icon: {
      type: DataTypes.STRING(50),
    },
    // Orden de visualización
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
    },
    // Estado
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    // Si es categoría del sistema (no editable)
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system',
    },
  }, {
    tableName: 'transaction_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['parent_id'] },
      { fields: ['is_active'] },
    ],
  });

  TransactionCategory.associate = (models) => {
    TransactionCategory.belongsTo(models.TransactionCategory, {
      foreignKey: 'parentId',
      as: 'parent',
    });
    TransactionCategory.hasMany(models.TransactionCategory, {
      foreignKey: 'parentId',
      as: 'subcategories',
    });
  };

  return TransactionCategory;
};
