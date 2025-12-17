const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EnvironmentalPermit = sequelize.define('EnvironmentalPermit', {
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
      type: DataTypes.ENUM('EIA', 'WATER', 'EMISSIONS', 'WASTE', 'DRILLING', 'CONSTRUCTION', 'OPERATION', 'DISCHARGE', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
      comment: 'EIA=Environmental Impact Assessment',
    },
    issuing_authority: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    permit_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date when renewal process should start',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'PENDING_RENEWAL', 'REVOKED', 'SUSPENDED', 'PENDING_APPROVAL'),
      allowNull: false,
      defaultValue: 'PENDING_APPROVAL',
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Permit conditions and requirements',
    },
    monitoring_requirements: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Required monitoring activities',
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
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
    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
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
    tableName: 'environmental_permits',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['expiry_date'] },
      { fields: ['field_id'] },
      { fields: ['project_id'] },
      { fields: ['well_id'] },
    ],
  });

  return EnvironmentalPermit;
};
