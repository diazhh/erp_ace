const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WarehouseStock = sequelize.define('WarehouseStock', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Almacén
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'warehouse_id',
    },
    // Item
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'item_id',
    },
    // Cantidades
    quantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Cantidad total en este almacén',
    },
    reservedQuantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'reserved_quantity',
      comment: 'Cantidad reservada',
    },
    availableQuantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'available_quantity',
      comment: 'Cantidad disponible (quantity - reserved)',
    },
    // Ubicación dentro del almacén
    location: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Ubicación específica (ej: A-01-03)',
    },
    // Niveles específicos por almacén
    minStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'min_stock',
      comment: 'Stock mínimo en este almacén',
    },
    maxStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'max_stock',
      comment: 'Stock máximo en este almacén',
    },
    // Última actualización
    lastCountDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_count_date',
      comment: 'Fecha del último conteo físico',
    },
    lastCountQuantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'last_count_quantity',
      comment: 'Cantidad del último conteo',
    },
  }, {
    tableName: 'warehouse_stocks',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['warehouse_id', 'item_id'], unique: true },
      { fields: ['warehouse_id'] },
      { fields: ['item_id'] },
      { fields: ['location'] },
    ],
  });

  return WarehouseStock;
};
