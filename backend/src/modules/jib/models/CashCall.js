const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CashCall = sequelize.define('CashCall', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Format: CC-YYYY-XXXX',
    },
    contract_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'og_contracts',
        key: 'id',
      },
    },
    purpose: {
      type: DataTypes.ENUM('OPERATIONS', 'AFE', 'EMERGENCY', 'CAPITAL', 'ABANDONMENT', 'OTHER'),
      allowNull: false,
      defaultValue: 'OPERATIONS',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    afe_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'afes',
        key: 'id',
      },
      comment: 'Optional link to AFE',
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    funded_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    call_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SENT', 'PARTIALLY_FUNDED', 'FUNDED', 'OVERDUE', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
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
    tableName: 'cash_calls',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['contract_id'] },
      { fields: ['purpose'] },
      { fields: ['status'] },
      { fields: ['afe_id'] },
      { fields: ['due_date'] },
      { fields: ['created_by'] },
    ],
  });

  return CashCall;
};
