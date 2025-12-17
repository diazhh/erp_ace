const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CashCallResponse = sequelize.define('CashCallResponse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cash_call_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cash_calls',
        key: 'id',
      },
    },
    party_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contract_parties',
        key: 'id',
      },
    },
    working_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Working interest percentage at time of call',
    },
    requested_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    funded_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    funded_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'FUNDED', 'PARTIAL', 'DEFAULTED', 'EXCUSED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    default_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date partner was declared in default',
    },
    default_penalty: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Penalty amount for default',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'cash_call_responses',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['cash_call_id'] },
      { fields: ['party_id'] },
      { fields: ['status'] },
      { fields: ['funded_date'] },
    ],
  });

  return CashCallResponse;
};
