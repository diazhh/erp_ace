const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pipeline = sequelize.define('Pipeline', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('CRUDE', 'GAS', 'WATER', 'MULTIPHASE', 'CONDENSATE', 'DIESEL'),
      allowNull: false,
      defaultValue: 'CRUDE',
    },
    origin: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    origin_field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    destination: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    destination_field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    length_km: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    diameter_inches: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    wall_thickness_inches: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g., Carbon Steel, Stainless Steel',
    },
    capacity_bpd: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Capacity in barrels per day',
    },
    max_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    installation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    last_inspection_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    next_inspection_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'MAINTENANCE', 'SHUTDOWN', 'DECOMMISSIONED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    operator: {
      type: DataTypes.STRING(150),
      allowNull: true,
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
    tableName: 'pipelines',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['origin_field_id'] },
      { fields: ['destination_field_id'] },
    ],
  });

  return Pipeline;
};
