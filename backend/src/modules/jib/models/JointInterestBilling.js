const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JointInterestBilling = sequelize.define('JointInterestBilling', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Format: JIB-YYYY-MM-XXXX',
    },
    contract_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'og_contracts',
        key: 'id',
      },
    },
    billing_period_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    billing_period_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'DISPUTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    total_costs: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    operator_share: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Operator portion of costs',
    },
    partners_share: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Total partners portion of costs',
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
    sent_date: {
      type: DataTypes.DATEONLY,
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
    tableName: 'joint_interest_billings',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['contract_id'] },
      { fields: ['status'] },
      { fields: ['billing_period_year', 'billing_period_month'] },
      { fields: ['due_date'] },
      { fields: ['created_by'] },
    ],
  });

  return JointInterestBilling;
};
