const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
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
    // Información básica
    plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'plate',
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'brand',
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'model',
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'year',
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'color',
    },
    vehicleType: {
      type: DataTypes.ENUM(
        'SEDAN',
        'SUV',
        'PICKUP',
        'VAN',
        'TRUCK',
        'MOTORCYCLE',
        'HEAVY_EQUIPMENT',
        'OTHER'
      ),
      allowNull: false,
      defaultValue: 'PICKUP',
      field: 'vehicle_type',
    },
    // Identificación
    vin: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      field: 'vin',
    },
    engineNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'engine_number',
    },
    // Especificaciones técnicas
    fuelType: {
      type: DataTypes.ENUM('GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS'),
      allowNull: false,
      defaultValue: 'GASOLINE',
      field: 'fuel_type',
    },
    tankCapacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'tank_capacity',
      comment: 'Capacidad del tanque en litros',
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mileage',
      comment: 'Kilometraje actual',
    },
    transmission: {
      type: DataTypes.ENUM('MANUAL', 'AUTOMATIC'),
      allowNull: true,
      field: 'transmission',
    },
    engineCapacity: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'engine_capacity',
      comment: 'Cilindraje (ej: 2.0L)',
    },
    passengers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'passengers',
    },
    loadCapacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'load_capacity',
      comment: 'Capacidad de carga en kg',
    },
    // Propiedad y adquisición
    ownershipType: {
      type: DataTypes.ENUM('OWNED', 'LEASED', 'RENTED'),
      allowNull: false,
      defaultValue: 'OWNED',
      field: 'ownership_type',
    },
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'acquisition_date',
    },
    acquisitionCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'acquisition_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      field: 'currency',
    },
    // Documentos y vencimientos
    insurancePolicy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'insurance_policy',
    },
    insuranceExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'insurance_expiry',
    },
    registrationExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'registration_expiry',
    },
    technicalReviewExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'technical_review_expiry',
    },
    // Mantenimiento
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_maintenance_date',
    },
    lastMaintenanceMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'last_maintenance_mileage',
    },
    nextMaintenanceMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'next_maintenance_mileage',
    },
    maintenanceIntervalKm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5000,
      field: 'maintenance_interval_km',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'AVAILABLE',
        'ASSIGNED',
        'IN_MAINTENANCE',
        'OUT_OF_SERVICE',
        'SOLD'
      ),
      allowNull: false,
      defaultValue: 'AVAILABLE',
      field: 'status',
    },
    // Ubicación
    currentLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'current_location',
    },
    // GPS
    gpsDeviceId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'gps_device_id',
    },
    // Imagen
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'photo_url',
    },
    // Notas
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
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
    tableName: 'vehicles',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['plate'] },
      { fields: ['status'] },
      { fields: ['vehicle_type'] },
    ],
  });

  return Vehicle;
};
