const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AFEExpense = sequelize.define('AFEExpense', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    afe_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'afes',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'afe_categories',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vendor: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contractor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contractors',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      defaultValue: 1,
    },
    amount_usd: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Amount converted to USD',
    },
    expense_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id',
      },
    },
    purchase_order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID'),
      allowNull: false,
      defaultValue: 'PENDING',
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
    tableName: 'afe_expenses',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['afe_id'] },
      { fields: ['category_id'] },
      { fields: ['contractor_id'] },
      { fields: ['status'] },
      { fields: ['expense_date'] },
    ],
  });

  return AFEExpense;
};
