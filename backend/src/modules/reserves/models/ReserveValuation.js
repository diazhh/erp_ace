const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReserveValuation = sequelize.define('ReserveValuation', {
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
    estimate_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'reserve_estimates',
        key: 'id',
      },
    },
    valuation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    oil_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Oil price assumption USD/bbl',
    },
    gas_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Gas price assumption USD/Mcf',
    },
    condensate_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Condensate price assumption USD/bbl',
    },
    price_scenario: {
      type: DataTypes.ENUM('LOW', 'BASE', 'HIGH', 'STRIP', 'CUSTOM'),
      allowNull: false,
      defaultValue: 'BASE',
    },
    discount_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10.00,
      comment: 'Discount rate percentage (e.g., 10 for 10%)',
    },
    npv_1p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'NPV for 1P reserves (USD millions)',
    },
    npv_2p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'NPV for 2P reserves (USD millions)',
    },
    npv_3p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'NPV for 3P reserves (USD millions)',
    },
    pv10_1p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'PV10 for 1P reserves (USD millions)',
    },
    pv10_2p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'PV10 for 2P reserves (USD millions)',
    },
    pv10_3p: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'PV10 for 3P reserves (USD millions)',
    },
    undiscounted_cashflow: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'Undiscounted future net revenue (USD millions)',
    },
    capex_required: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      comment: 'Capital expenditure required (USD millions)',
    },
    opex_per_boe: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Operating cost per BOE (USD)',
    },
    royalty_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Royalty rate percentage',
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Tax rate percentage',
    },
    methodology: {
      type: DataTypes.ENUM('DCF', 'COMPARABLE', 'COST', 'OPTION', 'HYBRID'),
      allowNull: false,
      defaultValue: 'DCF',
    },
    assumptions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    sensitivity_analysis: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'SUPERSEDED'),
      allowNull: false,
      defaultValue: 'DRAFT',
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
    tableName: 'reserve_valuations',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['estimate_id'] },
      { fields: ['valuation_date'] },
      { fields: ['status'] },
    ],
  });

  return ReserveValuation;
};
