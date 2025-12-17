const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkingInterest = sequelize.define('WorkingInterest', {
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
    party_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contract_parties',
        key: 'id',
      },
    },
    asset_type: {
      type: DataTypes.ENUM('FIELD', 'WELL', 'BLOCK', 'CONCESSION'),
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
    well_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'wells',
        key: 'id',
      },
    },
    concession_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'concessions',
        key: 'id',
      },
    },
    working_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Working interest percentage for this asset',
    },
    net_revenue_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Net revenue interest percentage',
    },
    cost_bearing_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'TRANSFERRED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    transfer_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Reference to transfer document if transferred',
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
    tableName: 'working_interests',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['contract_id'] },
      { fields: ['party_id'] },
      { fields: ['asset_type'] },
      { fields: ['field_id'] },
      { fields: ['well_id'] },
      { fields: ['concession_id'] },
      { fields: ['status'] },
      { fields: ['effective_date'] },
    ],
  });

  return WorkingInterest;
};
