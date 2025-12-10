const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Asset = sequelize.define('Asset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: 'code',
      comment: 'Código único del activo (ej: ACT-001)',
    },
    // Información básica
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
    // Clasificación
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'asset_categories',
        key: 'id',
      },
    },
    // Identificación
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'serial_number',
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'model',
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'brand',
    },
    // Datos de adquisición
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'acquisition_date',
    },
    acquisitionCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'acquisition_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      field: 'currency',
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'supplier_id',
      references: {
        model: 'contractors',
        key: 'id',
      },
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'invoice_number',
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'purchase_order_id',
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
    },
    // Depreciación
    depreciationMethod: {
      type: DataTypes.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
      allowNull: false,
      defaultValue: 'STRAIGHT_LINE',
      field: 'depreciation_method',
    },
    usefulLifeYears: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'useful_life_years',
      comment: 'Vida útil en años',
    },
    usefulLifeUnits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'useful_life_units',
      comment: 'Vida útil en unidades (para método de unidades de producción)',
    },
    salvageValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'salvage_value',
      comment: 'Valor residual/de rescate',
    },
    depreciationStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'depreciation_start_date',
    },
    accumulatedDepreciation: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'accumulated_depreciation',
    },
    currentUnits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'current_units',
      comment: 'Unidades acumuladas (para método de unidades de producción)',
    },
    // Valores calculados
    bookValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'book_value',
      comment: 'Valor en libros (costo - depreciación acumulada)',
    },
    // Ubicación
    locationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'location_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    locationDescription: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'location_description',
    },
    // Asignación actual
    assignedToEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    assignedToProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    assignedToDepartmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'ACTIVE',           // En uso
        'IN_MAINTENANCE',   // En mantenimiento
        'STORED',           // Almacenado
        'DISPOSED',         // Dado de baja
        'SOLD',             // Vendido
        'LOST',             // Perdido
        'DAMAGED'           // Dañado
      ),
      allowNull: false,
      defaultValue: 'ACTIVE',
      field: 'status',
    },
    condition: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
      allowNull: false,
      defaultValue: 'GOOD',
      field: 'condition',
    },
    // Garantía
    warrantyExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'warranty_expiry',
    },
    warrantyNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'warranty_notes',
    },
    // Disposición (cuando se vende o da de baja)
    disposalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'disposal_date',
    },
    disposalMethod: {
      type: DataTypes.ENUM('SOLD', 'SCRAPPED', 'DONATED', 'LOST', 'OTHER'),
      allowNull: true,
      field: 'disposal_method',
    },
    disposalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'disposal_amount',
    },
    disposalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'disposal_notes',
    },
    // Imagen
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'photo_url',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
    disposedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'disposed_by',
    },
  }, {
    tableName: 'assets',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['category_id'] },
      { fields: ['status'] },
      { fields: ['assigned_to_employee_id'] },
      { fields: ['assigned_to_project_id'] },
      { fields: ['assigned_to_department_id'] },
      { fields: ['location_id'] },
      { fields: ['acquisition_date'] },
      { fields: ['supplier_id'] },
    ],
  });

  return Asset;
};
