const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExpenseReportItem = sequelize.define('ExpenseReportItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expenseReportId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'expense_report_id',
    },
    // Tipo de gasto
    itemType: {
      type: DataTypes.ENUM('INVENTORY', 'ASSET', 'FUEL', 'SERVICE', 'OTHER'),
      allowNull: false,
      field: 'item_type',
      comment: 'INVENTORY=compra inventario, ASSET=activo fijo, FUEL=combustible, SERVICE=servicio, OTHER=otro',
    },
    // Descripción
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    // Cantidad
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1,
    },
    // Unidad de medida
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Unidad de medida (unidad, litros, kg, etc.)',
    },
    // Precio unitario
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'unit_price',
    },
    // Monto total
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    // Datos del comprobante
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'receipt_number',
    },
    receiptDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'receipt_date',
    },
    vendor: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    vendorRif: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'vendor_rif',
    },
    // Referencias a entidades creadas
    inventoryItemId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inventory_item_id',
      comment: 'Item de inventario creado/actualizado',
    },
    inventoryMovementId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inventory_movement_id',
      comment: 'Movimiento de inventario creado',
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'asset_id',
      comment: 'Activo fijo creado',
    },
    fuelLogId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'fuel_log_id',
      comment: 'Registro de combustible creado',
    },
    // Estado de procesamiento
    processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si el item ya fue procesado',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'expense_report_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['expense_report_id'] },
      { fields: ['item_type'] },
      { fields: ['inventory_item_id'] },
      { fields: ['asset_id'] },
      { fields: ['fuel_log_id'] },
    ],
  });

  return ExpenseReportItem;
};
