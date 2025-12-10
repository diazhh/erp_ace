const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmQuoteItem = sequelize.define('CrmQuoteItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quoteId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'quote_id',
      references: {
        model: 'crm_quotes',
        key: 'id',
      },
    },
    // Orden de línea
    lineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'line_number',
    },
    // Tipo de ítem
    itemType: {
      type: DataTypes.ENUM('SERVICE', 'PRODUCT', 'OTHER'),
      allowNull: false,
      defaultValue: 'SERVICE',
      field: 'item_type',
    },
    // Descripción
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Cantidades
    quantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 1,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Unidad de medida (ej: HRS, UND, M2)',
    },
    // Precios
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'unit_price',
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'discount_percent',
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'crm_quote_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['quote_id'] },
      { fields: ['line_number'] },
    ],
    hooks: {
      beforeSave: (instance) => {
        // Calcular subtotal
        const quantity = parseFloat(instance.quantity) || 0;
        const unitPrice = parseFloat(instance.unitPrice) || 0;
        const discountPercent = parseFloat(instance.discountPercent) || 0;
        
        const lineTotal = quantity * unitPrice;
        instance.subtotal = lineTotal - (lineTotal * (discountPercent / 100));
      },
    },
  });

  return CrmQuoteItem;
};
