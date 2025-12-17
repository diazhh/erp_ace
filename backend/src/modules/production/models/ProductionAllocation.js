const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductionAllocation = sequelize.define('ProductionAllocation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    period_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    period_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_water_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },
    metered_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    metered_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    allocated_oil_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    allocated_gas_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    oil_variance_bbl: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    gas_variance_mcf: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    variance_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    allocation_method: {
      type: DataTypes.ENUM('WELL_TEST', 'PRORATED', 'METERED', 'ESTIMATED'),
      allowNull: false,
      defaultValue: 'WELL_TEST',
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
    production_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    avg_oil_rate_bopd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    avg_gas_rate_mcfd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'CALCULATED', 'REVIEWED', 'APPROVED', 'SUBMITTED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    calculated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    calculated_at: {
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
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'production_allocations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['field_id'] },
      { fields: ['period_month', 'period_year'] },
      { fields: ['status'] },
      { unique: true, fields: ['field_id', 'period_month', 'period_year'] },
    ],
  });

  return ProductionAllocation;
};
