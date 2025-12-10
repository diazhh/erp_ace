const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssetMaintenance = sequelize.define('AssetMaintenance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'asset_id',
      references: {
        model: 'assets',
        key: 'id',
      },
    },
    // Tipo de mantenimiento
    maintenanceType: {
      type: DataTypes.ENUM('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'CALIBRATION', 'INSPECTION'),
      allowNull: false,
      field: 'maintenance_type',
    },
    // Información del mantenimiento
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
      field: 'total_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      field: 'currency',
    },
    // Proveedor de servicio
    serviceProviderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'service_provider_id',
      references: {
        model: 'contractors',
        key: 'id',
      },
    },
    serviceProviderName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'service_provider_name',
      comment: 'Nombre del proveedor si no está en el sistema',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
      field: 'status',
    },
    // Resultado
    result: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'result',
    },
    conditionAfter: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
      allowNull: true,
      field: 'condition_after',
    },
    // Próximo mantenimiento
    nextMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'next_maintenance_date',
    },
    // Transacción financiera asociada
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'transaction_id',
      references: {
        model: 'transactions',
        key: 'id',
      },
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
    completedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'completed_by',
    },
  }, {
    tableName: 'asset_maintenances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['asset_id'] },
      { fields: ['status'] },
      { fields: ['maintenance_type'] },
      { fields: ['scheduled_date'] },
      { fields: ['completed_date'] },
      { fields: ['service_provider_id'] },
    ],
    hooks: {
      beforeSave: (instance) => {
        // Calcular costo total
        const labor = parseFloat(instance.laborCost) || 0;
        const parts = parseFloat(instance.partsCost) || 0;
        const other = parseFloat(instance.otherCost) || 0;
        instance.totalCost = labor + parts + other;
      },
    },
  });

  return AssetMaintenance;
};
