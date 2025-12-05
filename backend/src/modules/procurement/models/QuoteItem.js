const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuoteItem = sequelize.define('QuoteItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quoteId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'quote_id',
    },
    // Información del ítem
    itemNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'item_number',
      comment: 'Número de línea',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'UND',
      comment: 'Unidad de medida (UND, M, M2, M3, KG, LT, HR, etc.)',
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      field: 'unit_price',
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    // Referencia a item de inventario (opcional)
    inventoryItemId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inventory_item_id',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'quote_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['quote_id'] },
      { fields: ['item_number'] },
      { fields: ['inventory_item_id'] },
    ],
  });

  return QuoteItem;
};
