const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MorningReport = sequelize.define('MorningReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    report_date: {
      type: DataTypes.DATEONLY,
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
    report_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    total_oil_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_gas_mcf: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_water_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    wells_producing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    wells_shut_in: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    wells_drilling: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    wells_workover: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    wells_down: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    total_downtime_hours: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: true,
      defaultValue: 0,
    },
    downtime_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    production_vs_target_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    daily_target_bbl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    mtd_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    mtd_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    ytd_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    ytd_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    weather_conditions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    safety_incidents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    environmental_incidents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    issues: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actions_required: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    highlights: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    submitted_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    submitted_at: {
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
    tableName: 'morning_reports',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['report_date'] },
      { fields: ['field_id'] },
      { fields: ['status'] },
      { unique: true, fields: ['field_id', 'report_date'] },
    ],
  });

  return MorningReport;
};
