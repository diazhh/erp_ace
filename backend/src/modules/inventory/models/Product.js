const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del producto (ej: PROD-001 o SKU)',
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
      comment: 'Nombre del producto',
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
    // Tipo de producto
    productType: {
      type: DataTypes.ENUM('PRODUCT', 'MATERIAL', 'TOOL', 'EQUIPMENT', 'CONSUMABLE', 'SPARE_PART'),
      allowNull: false,
      defaultValue: 'MATERIAL',
      field: 'product_type',
      comment: 'Tipo de producto',
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
    // Conteo de unidades (calculado desde InventoryUnit)
    totalUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_units',
      comment: 'Total de unidades registradas',
    },
    availableUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'available_units',
      comment: 'Unidades disponibles en almacén',
    },
    assignedUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'assigned_units',
      comment: 'Unidades asignadas a empleados/proyectos',
    },
    inTransitUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'in_transit_units',
      comment: 'Unidades en tránsito',
    },
    damagedUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'damaged_units',
      comment: 'Unidades dañadas',
    },
    retiredUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'retired_units',
      comment: 'Unidades retiradas/dadas de baja',
    },
    // Niveles de stock
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'min_stock',
      comment: 'Stock mínimo (alerta de reposición)',
    },
    maxStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_stock',
      comment: 'Stock máximo',
    },
    reorderPoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reorder_point',
      comment: 'Punto de reorden',
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
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
    requiresSerialNumber: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'requires_serial_number',
      comment: 'Si cada unidad requiere número de serie único',
    },
    requiresLotNumber: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'requires_lot_number',
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
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['sku'], unique: true },
      { fields: ['barcode'] },
      { fields: ['category_id'] },
      { fields: ['product_type'] },
      { fields: ['status'] },
      { fields: ['name'] },
      { fields: ['brand'] },
    ],
  });

  return Product;
};
