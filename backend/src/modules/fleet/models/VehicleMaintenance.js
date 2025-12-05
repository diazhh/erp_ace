const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VehicleMaintenance = sequelize.define('VehicleMaintenance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'code',
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'vehicle_id',
      references: {
        model: 'vehicles',
        key: 'id',
      },
    },
    // Tipo de mantenimiento
    maintenanceType: {
      type: DataTypes.ENUM(
        'PREVENTIVE',      // Preventivo (cambio de aceite, filtros, etc.)
        'CORRECTIVE',      // Correctivo (reparaciones)
        'INSPECTION',      // Inspección
        'TIRE_SERVICE',    // Servicio de neumáticos
        'BODY_WORK',       // Carrocería
        'ELECTRICAL',      // Eléctrico
        'OTHER'
      ),
      allowNull: false,
      defaultValue: 'PREVENTIVE',
      field: 'maintenance_type',
    },
    // Descripción del servicio
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'description',
    },
    // Fechas
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'scheduled_date',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'start_date',
    },
    completedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'completed_date',
    },
    // Kilometraje
    mileageAtService: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'mileage_at_service',
    },
    // Proveedor/Taller
    serviceProvider: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'service_provider',
    },
    // Costos
    laborCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'labor_cost',
    },
    partsCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'parts_cost',
    },
    otherCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'other_cost',
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'total_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      field: 'currency',
    },
    // Partes/Repuestos utilizados
    partsUsed: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'parts_used',
      comment: 'Array de {name, quantity, unitCost}',
    },
    // Número de factura
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'invoice_number',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
      field: 'status',
    },
    // Próximo mantenimiento
    nextMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'next_maintenance_date',
    },
    nextMaintenanceMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'next_maintenance_mileage',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    // Referencia a transacción financiera
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      references: {
        model: 'transactions',
        key: 'id',
      },
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
    completedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'completed_by',
    },
  }, {
    tableName: 'vehicle_maintenances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['vehicle_id'] },
      { fields: ['maintenance_type'] },
      { fields: ['status'] },
      { fields: ['scheduled_date'] },
      { fields: ['completed_date'] },
    ],
  });

  return VehicleMaintenance;
};
