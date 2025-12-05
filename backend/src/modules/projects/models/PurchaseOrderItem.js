const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'purchase_order_id',
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
    // Seguimiento de entrega
    deliveredQuantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'delivered_quantity',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'purchase_order_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['purchase_order_id'] },
      { fields: ['item_number'] },
    ],
  });

  return PurchaseOrderItem;
};
