const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Concession = sequelize.define('Concession', {
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
    contract_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'og_contracts',
        key: 'id',
      },
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Venezuela',
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Polygon coordinates for the block',
    },
    area_km2: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    area_acres: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('EXPLORATION', 'DEVELOPMENT', 'PRODUCTION', 'MIXED'),
      allowNull: false,
      defaultValue: 'EXPLORATION',
    },
    basin: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Geological basin',
    },
    award_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    exploration_period_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    development_period_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    production_period_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'RELINQUISHED', 'EXPIRED', 'PENDING', 'SUSPENDED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    work_commitments: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Work program commitments',
    },
    minimum_expenditure: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Minimum expenditure commitment',
    },
    wells_committed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of wells committed to drill',
    },
    wells_drilled: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    seismic_km_committed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    seismic_km_acquired: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    surface_fee: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Annual surface fee',
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
    tableName: 'concessions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['contract_id'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['award_date'] },
      { fields: ['expiry_date'] },
    ],
  });

  return Concession;
};
