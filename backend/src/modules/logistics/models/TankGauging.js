const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TankGauging = sequelize.define('TankGauging', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tank_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'storage_tanks',
        key: 'id',
      },
    },
    gauging_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Volume in barrels',
    },
    temperature: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Temperature in Fahrenheit',
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
    level_inches: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Tank level in inches',
    },
    gauged_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    gauging_method: {
      type: DataTypes.ENUM('MANUAL', 'AUTOMATIC', 'RADAR', 'ULTRASONIC'),
      allowNull: false,
      defaultValue: 'MANUAL',
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
    tableName: 'tank_gaugings',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['tank_id'] },
      { fields: ['gauging_datetime'] },
      { fields: ['gauged_by'] },
    ],
  });

  return TankGauging;
};
