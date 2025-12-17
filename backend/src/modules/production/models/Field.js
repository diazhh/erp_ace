const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Field = sequelize.define('Field', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('ONSHORE', 'OFFSHORE'),
      allowNull: false,
      defaultValue: 'ONSHORE',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ABANDONED', 'UNDER_DEVELOPMENT'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Venezuela',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    area_km2: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discovery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    production_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    operator_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contractors',
        key: 'id',
      },
    },
    working_interest: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 100.00,
      validate: {
        min: 0,
        max: 100,
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
    basin: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    formation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    api_gravity_avg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    estimated_reserves_mmbbl: {
      type: DataTypes.DECIMAL(12, 2),
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
    tableName: 'fields',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
    ],
  });

  return Field;
};
