const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryMovement = sequelize.define('InventoryMovement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código único del movimiento (ej: MOV-001)',
    },
    // Tipo de movimiento
    movementType: {
      type: DataTypes.ENUM(
        'ENTRY',           // Entrada (compra, donación, etc.)
        'EXIT',            // Salida (uso, venta, etc.)
        'TRANSFER',        // Transferencia entre almacenes
        'ADJUSTMENT_IN',   // Ajuste positivo
        'ADJUSTMENT_OUT',  // Ajuste negativo
        'RETURN',          // Devolución
        'RESERVATION',     // Reserva para proyecto
        'RELEASE'          // Liberación de reserva
      ),
      allowNull: false,
      field: 'movement_type',
    },
    // Razón del movimiento
    reason: {
      type: DataTypes.ENUM(
        'PURCHASE',        // Compra
        'PROJECT_USE',     // Uso en proyecto
        'SALE',            // Venta
        'DAMAGE',          // Daño
        'LOSS',            // Pérdida
        'THEFT',           // Robo
        'EXPIRY',          // Vencimiento
        'COUNT_ADJUSTMENT',// Ajuste por conteo
        'TRANSFER',        // Transferencia
        'RETURN_SUPPLIER', // Devolución a proveedor
        'RETURN_PROJECT',  // Devolución de proyecto
        'DONATION',        // Donación recibida
        'OTHER'            // Otro
      ),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    // Item
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'item_id',
    },
    // Almacén origen (para salidas y transferencias)
    sourceWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'source_warehouse_id',
    },
    // Almacén destino (para entradas y transferencias)
    destinationWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'destination_warehouse_id',
    },
    // Cantidad
    quantity: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      comment: 'Cantidad movida',
    },
    // Costo unitario al momento del movimiento
    unitCost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'unit_cost',
      comment: 'Costo unitario al momento del movimiento',
    },
    // Costo total
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'total_cost',
      comment: 'Costo total del movimiento',
    },
    // Moneda
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Fecha del movimiento
    movementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'movement_date',
    },
    // Referencia externa
    referenceType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'reference_type',
      comment: 'Tipo de documento de referencia (PurchaseOrder, Project, etc.)',
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_id',
      comment: 'ID del documento de referencia',
    },
    referenceCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'reference_code',
      comment: 'Código del documento de referencia',
    },
    // Proyecto relacionado
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto relacionado con el movimiento',
    },
    // Empleado que recibe/entrega
    employeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'employee_id',
      comment: 'Empleado que recibe o entrega el material',
    },
    // Proveedor (para entradas por compra)
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'supplier_id',
      comment: 'Proveedor (Contractor) para compras',
    },
    // Número de serie o lote
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'serial_number',
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'lot_number',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
      comment: 'Fecha de vencimiento (si aplica)',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'COMPLETED',
    },
    // Descripción
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'inventory_movements',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['movement_type'] },
      { fields: ['reason'] },
      { fields: ['item_id'] },
      { fields: ['source_warehouse_id'] },
      { fields: ['destination_warehouse_id'] },
      { fields: ['project_id'] },
      { fields: ['employee_id'] },
      { fields: ['supplier_id'] },
      { fields: ['movement_date'] },
      { fields: ['status'] },
      { fields: ['reference_type', 'reference_id'] },
    ],
  });

  return InventoryMovement;
};
