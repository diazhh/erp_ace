const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WellProduction = sequelize.define('WellProduction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    well_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'wells',
        key: 'id',
      },
    },
    production_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    oil_volume_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    gas_volume_mcf: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    water_volume_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    oil_rate_bopd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    gas_rate_mcfd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    water_rate_bwpd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    gross_volume_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    net_volume_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    bsw_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    api_gravity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    gor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    choke_size: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    tubing_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    casing_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    flowline_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    separator_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    temperature_f: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    hours_on: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      defaultValue: 24,
      validate: {
        min: 0,
        max: 24,
      },
    },
    downtime_hours: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      defaultValue: 0,
    },
    downtime_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    downtime_code: {
      type: DataTypes.ENUM('NONE', 'MECHANICAL', 'ELECTRICAL', 'WELLBORE', 'SURFACE', 'SCHEDULED', 'WEATHER', 'OTHER'),
      allowNull: true,
      defaultValue: 'NONE',
    },
    injection_volume_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    injection_pressure_psi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reported_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'well_productions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['well_id'] },
      { fields: ['production_date'] },
      { fields: ['status'] },
      { unique: true, fields: ['well_id', 'production_date'] },
    ],
  });

  return WellProduction;
};
