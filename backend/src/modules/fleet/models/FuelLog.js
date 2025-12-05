const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FuelLog = sequelize.define('FuelLog', {
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
    // Fecha y hora
    fuelDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fuel_date',
    },
    fuelTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'fuel_time',
    },
    // Tipo de combustible
    fuelType: {
      type: DataTypes.ENUM('GASOLINE_91', 'GASOLINE_95', 'DIESEL', 'ELECTRIC', 'GAS'),
      allowNull: false,
      field: 'fuel_type',
    },
    // Cantidad
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'quantity',
      comment: 'Litros o kWh',
    },
    // Precio
    unitPrice: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      field: 'unit_price',
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      field: 'currency',
    },
    // Kilometraje
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'mileage',
    },
    // Tanque lleno
    fullTank: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'full_tank',
    },
    // Estación de servicio
    station: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'station',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'location',
    },
    // Número de factura/recibo
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'receipt_number',
    },
    // Método de pago
    paymentMethod: {
      type: DataTypes.ENUM('CASH', 'CARD', 'FLEET_CARD', 'TRANSFER', 'PETTY_CASH'),
      allowNull: false,
      defaultValue: 'CASH',
      field: 'payment_method',
    },
    // Conductor
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'driver_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Proyecto asociado
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
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
    // Referencia a caja chica
    pettyCashEntryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'petty_cash_entry_id',
      references: {
        model: 'petty_cash_entries',
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
  }, {
    tableName: 'fuel_logs',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['vehicle_id'] },
      { fields: ['fuel_date'] },
      { fields: ['driver_id'] },
      { fields: ['project_id'] },
    ],
  });

  return FuelLog;
};
