const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OGContract = sequelize.define('OGContract', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('PSA', 'SERVICE', 'JOA', 'CONCESSION', 'FARMOUT', 'LEASE', 'OTHER'),
      allowNull: false,
      defaultValue: 'SERVICE',
      comment: 'PSA=Production Sharing Agreement, JOA=Joint Operating Agreement',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'TERMINATED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    operator_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id',
      },
      comment: 'Operating company (from CRM clients)',
    },
    government_entity: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Government entity (e.g., MENPET, PDVSA)',
    },
    royalty_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Royalty percentage',
    },
    cost_recovery_limit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Cost recovery limit percentage',
    },
    profit_oil_split: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Profit oil split percentage for contractor',
    },
    signature_bonus: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    total_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Total contract value if applicable',
    },
    terms_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    special_conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    termination_clause: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dispute_resolution: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Arbitration/jurisdiction',
    },
    governing_law: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    signed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    effective_date: {
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
  }, {
    tableName: 'og_contracts',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['operator_id'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
    ],
  });

  return OGContract;
};
