const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContractParty = sequelize.define('ContractParty', {
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
    party_type: {
      type: DataTypes.ENUM('OPERATOR', 'PARTNER', 'GOVERNMENT', 'NOC', 'CONTRACTOR'),
      allowNull: false,
      comment: 'NOC = National Oil Company',
    },
    party_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id',
      },
      comment: 'Link to CRM client if applicable',
    },
    contractor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contractors',
        key: 'id',
      },
      comment: 'Link to contractor if applicable',
    },
    working_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Working interest percentage (WI)',
    },
    cost_bearing_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Cost bearing interest percentage',
    },
    revenue_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Net revenue interest percentage (NRI)',
    },
    is_operator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    contact_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'contract_parties',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['contract_id'] },
      { fields: ['party_type'] },
      { fields: ['client_id'] },
      { fields: ['contractor_id'] },
      { fields: ['is_operator'] },
      { fields: ['status'] },
    ],
  });

  return ContractParty;
};
