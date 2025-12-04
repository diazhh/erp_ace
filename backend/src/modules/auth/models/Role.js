const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isSystemRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system_role',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'roles',
    timestamps: true,
    underscored: true,
  });

  return Role;
};
