const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoyaltyPayment = sequelize.define('RoyaltyPayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contract_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'og_contracts',
        key: 'id',
      },
    },
    period_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 12 },
    },
    period_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    production_oil_bbl: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Oil production in barrels',
    },
    production_gas_mcf: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Gas production in MCF',
    },
    oil_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Oil price per barrel',
    },
    gas_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Gas price per MCF',
    },
    production_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Total production value',
    },
    royalty_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Royalty rate applied',
    },
    royalty_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    government_receipt: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('CALCULATED', 'PENDING', 'PAID', 'OVERDUE', 'DISPUTED'),
      allowNull: false,
      defaultValue: 'CALCULATED',
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id',
      },
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
    paid_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'royalty_payments',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['contract_id'] },
      { fields: ['field_id'] },
      { fields: ['period_month', 'period_year'] },
      { fields: ['status'] },
      { fields: ['due_date'] },
      { fields: ['payment_date'] },
    ],
  });

  return RoyaltyPayment;
};
