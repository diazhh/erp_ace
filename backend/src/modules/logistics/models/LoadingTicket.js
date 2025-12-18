const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoadingTicket = sequelize.define('LoadingTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Format: TKT-YYYY-XXXX',
    },
    type: {
      type: DataTypes.ENUM('LOADING', 'UNLOADING', 'TRANSFER'),
      allowNull: false,
      defaultValue: 'LOADING',
    },
    source_tank_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'storage_tanks',
        key: 'id',
      },
    },
    destination_tank_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'storage_tanks',
        key: 'id',
      },
    },
    destination: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'External destination if not a tank',
    },
    vehicle_plate: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    driver_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    driver_id_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    carrier_company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    product_type: {
      type: DataTypes.ENUM('CRUDE', 'DIESEL', 'GASOLINE', 'WATER', 'CHEMICALS', 'CONDENSATE'),
      allowNull: false,
      defaultValue: 'CRUDE',
    },
    api_gravity: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    bsw: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
      comment: 'Basic Sediment and Water percentage',
    },
    temperature: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Temperature in Fahrenheit',
    },
    gross_volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Gross volume in barrels',
    },
    net_volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Net volume in barrels (after corrections)',
    },
    loading_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loading_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seal_numbers: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of seal numbers',
    },
    initial_tank_volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    final_tank_volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    authorized_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    received_by: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'VOID'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'loading_tickets',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['type'] },
      { fields: ['source_tank_id'] },
      { fields: ['destination_tank_id'] },
      { fields: ['product_type'] },
      { fields: ['status'] },
      { fields: ['loading_start'] },
      { fields: ['vehicle_plate'] },
    ],
  });

  return LoadingTicket;
};
