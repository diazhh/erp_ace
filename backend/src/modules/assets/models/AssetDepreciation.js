const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssetDepreciation = sequelize.define('AssetDepreciation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'asset_id',
      references: {
        model: 'assets',
        key: 'id',
      },
    },
    // Período
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'year',
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'month',
      validate: {
        min: 1,
        max: 12,
      },
    },
    periodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_start',
    },
    periodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_end',
    },
    // Valores al inicio del período
    openingBookValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'opening_book_value',
    },
    openingAccumulatedDepreciation: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'opening_accumulated_depreciation',
    },
    // Depreciación del período
    depreciationAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'depreciation_amount',
    },
    // Valores al cierre del período
    closingBookValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'closing_book_value',
    },
    closingAccumulatedDepreciation: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'closing_accumulated_depreciation',
    },
    // Método utilizado
    depreciationMethod: {
      type: DataTypes.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
      allowNull: false,
      field: 'depreciation_method',
    },
    // Para método de unidades de producción
    unitsProduced: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'units_produced',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('CALCULATED', 'POSTED', 'REVERSED'),
      allowNull: false,
      defaultValue: 'CALCULATED',
      field: 'status',
    },
    // Transacción contable asociada
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      references: {
        model: 'transactions',
        key: 'id',
      },
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    // Auditoría
    calculatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'calculated_by',
    },
    postedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'posted_by',
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'posted_at',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'asset_depreciations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['asset_id'] },
      { fields: ['year', 'month'] },
      { fields: ['status'] },
      { unique: true, fields: ['asset_id', 'year', 'month'] },
    ],
  });

  return AssetDepreciation;
};
