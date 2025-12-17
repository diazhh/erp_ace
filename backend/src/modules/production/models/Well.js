const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Well = sequelize.define('Well', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('PRODUCER', 'INJECTOR', 'OBSERVATION', 'DISPOSAL', 'EXPLORATION'),
      allowNull: false,
      defaultValue: 'PRODUCER',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SHUT_IN', 'ABANDONED', 'DRILLING', 'COMPLETING', 'WORKOVER'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    classification: {
      type: DataTypes.ENUM('OIL', 'GAS', 'OIL_GAS', 'WATER'),
      allowNull: true,
      defaultValue: 'OIL',
    },
    spud_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    first_production_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    total_depth_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    current_depth_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    perforation_top_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    perforation_bottom_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    api_gravity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    formation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    elevation_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    artificial_lift: {
      type: DataTypes.ENUM(
        'NONE',           // Flujo natural
        'ESP',            // Bomba Electrosumergible
        'ROD_PUMP',       // Bombeo Mecánico (Balancín)
        'GAS_LIFT',       // Levantamiento Artificial por Gas
        'PCP',            // Bomba de Cavidad Progresiva
        'JET_PUMP',       // Bomba Jet
        'PLUNGER',        // Plunger Lift
        'HYDRAULIC_PUMP', // Bomba Hidráulica
        'BCP'             // Bomba de Cavidad Progresiva (alias)
      ),
      allowNull: true,
      defaultValue: 'NONE',
    },
    pump_model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    pump_depth_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    motor_hp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    strokes_per_minute: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    gas_injection_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    casing_size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tubing_size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_workover_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    last_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cumulative_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },
    cumulative_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },
    cumulative_water_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
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
    tableName: 'wells',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['field_id'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['classification'] },
    ],
  });

  return Well;
};
