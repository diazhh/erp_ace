const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryUnit = sequelize.define('InventoryUnit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Código único de la unidad (generado automáticamente)
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Código único de la unidad (ej: PROD-001-0001)',
    },
    // Producto al que pertenece
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
      comment: 'Producto al que pertenece esta unidad',
    },
    // Número de serie (opcional, para productos que lo requieren)
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'serial_number',
      comment: 'Número de serie único (si aplica)',
    },
    // Número de lote (opcional)
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'lot_number',
      comment: 'Número de lote',
    },
    // Fecha de vencimiento (si aplica)
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
      comment: 'Fecha de vencimiento',
    },
    // Estado actual de la unidad
    status: {
      type: DataTypes.ENUM(
        'AVAILABLE',      // Disponible en almacén
        'ASSIGNED',       // Asignada a empleado/proyecto
        'IN_TRANSIT',     // En tránsito entre almacenes
        'IN_USE',         // En uso activo
        'MAINTENANCE',    // En mantenimiento/reparación
        'DAMAGED',        // Dañada
        'LOST',           // Perdida
        'RETIRED',        // Dada de baja
        'RETURNED',       // Devuelta (pendiente de revisión)
        'RESERVED'        // Reservada para uso futuro
      ),
      allowNull: false,
      defaultValue: 'AVAILABLE',
      comment: 'Estado actual de la unidad',
    },
    // Condición física
    condition: {
      type: DataTypes.ENUM('NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED', 'UNUSABLE'),
      allowNull: false,
      defaultValue: 'NEW',
      comment: 'Condición física de la unidad',
    },
    // Almacén actual
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'warehouse_id',
      comment: 'Almacén donde se encuentra actualmente',
    },
    // Ubicación específica dentro del almacén
    warehouseLocation: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'warehouse_location',
      comment: 'Ubicación específica (ej: A-01-03)',
    },
    // Empleado asignado (si está asignada)
    assignedToEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_employee_id',
      comment: 'Empleado al que está asignada',
    },
    // Proyecto asignado (si está asignada a proyecto)
    assignedToProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_project_id',
      comment: 'Proyecto al que está asignada',
    },
    // Fecha de asignación
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'assigned_at',
      comment: 'Fecha y hora de asignación',
    },
    // Fecha esperada de devolución
    expectedReturnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expected_return_date',
      comment: 'Fecha esperada de devolución',
    },
    // Costo de adquisición de esta unidad específica
    acquisitionCost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'acquisition_cost',
      comment: 'Costo de adquisición de esta unidad',
    },
    // Moneda
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Fecha de adquisición
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'acquisition_date',
      comment: 'Fecha de adquisición/entrada al inventario',
    },
    // Proveedor de esta unidad
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'supplier_id',
      comment: 'Proveedor de esta unidad (Contractor)',
    },
    // Referencia de compra
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'purchase_order_id',
      comment: 'Orden de compra asociada',
    },
    // Referencia de factura
    invoiceReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'invoice_reference',
      comment: 'Número de factura del proveedor',
    },
    // Garantía
    warrantyExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'warranty_expiry',
      comment: 'Fecha de vencimiento de garantía',
    },
    // Última fecha de mantenimiento
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_maintenance_date',
    },
    // Próxima fecha de mantenimiento
    nextMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'next_maintenance_date',
    },
    // Notas adicionales
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Metadatos adicionales (JSON)
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Datos adicionales específicos del producto',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    // Fecha de baja (si aplica)
    retiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'retired_at',
    },
    retiredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'retired_by',
    },
    retiredReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'retired_reason',
    },
  }, {
    tableName: 'inventory_units',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete para mantener historial
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['product_id'] },
      { fields: ['serial_number'] },
      { fields: ['lot_number'] },
      { fields: ['status'] },
      { fields: ['condition'] },
      { fields: ['warehouse_id'] },
      { fields: ['assigned_to_employee_id'] },
      { fields: ['assigned_to_project_id'] },
      { fields: ['supplier_id'] },
      { fields: ['purchase_order_id'] },
      { fields: ['expiry_date'] },
      { fields: ['warranty_expiry'] },
      { fields: ['acquisition_date'] },
      // Índice compuesto para búsquedas comunes
      { fields: ['product_id', 'status'] },
      { fields: ['warehouse_id', 'status'] },
    ],
  });

  return InventoryUnit;
};
