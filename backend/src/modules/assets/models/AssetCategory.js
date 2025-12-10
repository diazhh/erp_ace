const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssetCategory = sequelize.define('AssetCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'code',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
    // Categoría padre (jerarquía)
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'parent_id',
      references: {
        model: 'asset_categories',
        key: 'id',
      },
    },
    // Configuración de depreciación por defecto
    defaultDepreciationMethod: {
      type: DataTypes.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
      allowNull: false,
      defaultValue: 'STRAIGHT_LINE',
      field: 'default_depreciation_method',
    },
    defaultUsefulLifeYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'default_useful_life_years',
      comment: 'Vida útil por defecto en años',
    },
    defaultSalvageValuePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 10.00,
      field: 'default_salvage_value_percent',
      comment: 'Porcentaje del valor residual por defecto',
    },
    // Cuenta contable asociada (para integración futura)
    accountCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'account_code',
    },
    depreciationAccountCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'depreciation_account_code',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'asset_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['parent_id'] },
      { fields: ['is_active'] },
    ],
  });

  return AssetCategory;
};
