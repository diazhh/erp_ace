const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryCategory = sequelize.define('InventoryCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la categoría (ej: CAT-001)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre de la categoría',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Jerarquía
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'parent_id',
      comment: 'Categoría padre para jerarquía',
    },
    // Nivel en la jerarquía
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = raíz, 1 = subcategoría, etc.',
    },
    // Icono para UI
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Nombre del icono de Material UI',
    },
    // Color para UI
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Color hexadecimal para la categoría',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Orden de visualización
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
  }, {
    tableName: 'inventory_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['parent_id'] },
      { fields: ['status'] },
      { fields: ['sort_order'] },
    ],
  });

  return InventoryCategory;
};
