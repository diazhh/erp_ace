const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StorageTank = sequelize.define('StorageTank', {
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
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('CRUDE', 'WATER', 'DIESEL', 'CHEMICALS', 'GAS', 'CONDENSATE'),
      allowNull: false,
      defaultValue: 'CRUDE',
    },
    capacity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Capacity in barrels',
    },
    current_volume: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Current volume in barrels',
    },
    diameter_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    height_ft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    last_gauging_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_inspection_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    next_inspection_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
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
    tableName: 'storage_tanks',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['field_id'] },
      { fields: ['type'] },
      { fields: ['status'] },
    ],
  });

  return StorageTank;
};
