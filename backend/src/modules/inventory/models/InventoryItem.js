const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryItem = sequelize.define('InventoryItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del item (ej: ITM-001 o SKU)',
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment: 'SKU (Stock Keeping Unit)',
    },
    barcode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Código de barras',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre del item',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Categoría
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'category_id',
    },
    // Tipo de item
    itemType: {
      type: DataTypes.ENUM('PRODUCT', 'MATERIAL', 'TOOL', 'EQUIPMENT', 'CONSUMABLE', 'SPARE_PART'),
      allowNull: false,
      defaultValue: 'MATERIAL',
      field: 'item_type',
      comment: 'Tipo de item',
    },
    // Unidad de medida
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'UND',
      comment: 'Unidad de medida (UND, KG, M, L, etc.)',
    },
    // Precios
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    unitCost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'unit_cost',
      comment: 'Costo unitario promedio',
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'unit_price',
      comment: 'Precio de venta unitario',
    },
    // Stock global (suma de todos los almacenes)
    totalStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'total_stock',
      comment: 'Stock total en todos los almacenes',
    },
    reservedStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'reserved_stock',
      comment: 'Stock reservado para proyectos/órdenes',
    },
    availableStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'available_stock',
      comment: 'Stock disponible (total - reservado)',
    },
    // Niveles de stock
    minStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'min_stock',
      comment: 'Stock mínimo (alerta de reposición)',
    },
    maxStock: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'max_stock',
      comment: 'Stock máximo',
    },
    reorderPoint: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'reorder_point',
      comment: 'Punto de reorden',
    },
    reorderQuantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'reorder_quantity',
      comment: 'Cantidad a pedir al reordenar',
    },
    // Marca y modelo
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Marca',
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Modelo',
    },
    // Especificaciones
    specifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Especificaciones técnicas en JSON',
    },
    // Imagen
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'DISCONTINUED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Trazabilidad
    isSerialTracked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_serial_tracked',
      comment: 'Si requiere seguimiento por número de serie',
    },
    isLotTracked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_lot_tracked',
      comment: 'Si requiere seguimiento por lote',
    },
    // Proveedor preferido
    preferredSupplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'preferred_supplier_id',
      comment: 'Proveedor preferido (Contractor)',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'inventory_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['sku'], unique: true },
      { fields: ['barcode'] },
      { fields: ['category_id'] },
      { fields: ['item_type'] },
      { fields: ['status'] },
      { fields: ['name'] },
      { fields: ['brand'] },
    ],
  });

  return InventoryItem;
};
