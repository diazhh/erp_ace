const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      comment: 'Formato: modulo:accion (ej: users:create, projects:read)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Módulo al que pertenece el permiso',
    },
  }, {
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
  });

  return Permission;
};
