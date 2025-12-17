const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JIBPartnerShare = sequelize.define('JIBPartnerShare', {
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
      comment: 'Working interest percentage',
    },
    share_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Calculated share amount',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'INVOICED', 'PAID', 'PARTIALLY_PAID', 'DISPUTED', 'WRITTEN_OFF'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    invoice_date: {
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
    payment_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    dispute_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dispute_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dispute_resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dispute_resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'jib_partner_shares',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['jib_id'] },
      { fields: ['party_id'] },
      { fields: ['status'] },
      { fields: ['invoice_number'] },
      { fields: ['payment_date'] },
    ],
  });

  return JIBPartnerShare;
};
