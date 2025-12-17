const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JIBLineItem = sequelize.define('JIBLineItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jib_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'joint_interest_billings',
        key: 'id',
      },
    },
    cost_category: {
      type: DataTypes.ENUM('DRILLING', 'COMPLETION', 'OPERATIONS', 'PRODUCTION', 'MAINTENANCE', 'G&A', 'TRANSPORTATION', 'PROCESSING', 'OTHER'),
      allowNull: false,
      defaultValue: 'OPERATIONS',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 2),
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
    expense_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'afe_expenses',
        key: 'id',
      },
      comment: 'Optional link to AFE expense',
    },
    invoice_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Supporting invoice number',
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    vendor_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    is_billable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'jib_line_items',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['jib_id'] },
      { fields: ['cost_category'] },
      { fields: ['afe_id'] },
      { fields: ['expense_id'] },
      { fields: ['is_billable'] },
    ],
  });

  return JIBLineItem;
};
