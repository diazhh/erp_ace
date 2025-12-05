const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentShare = sequelize.define('DocumentShare', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    document_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id',
      },
    },
    // Compartido con usuario
    shared_with_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Compartido con departamento
    shared_with_department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Nivel de acceso
    access_level: {
      type: DataTypes.ENUM('VIEW', 'DOWNLOAD', 'EDIT', 'FULL'),
      defaultValue: 'VIEW',
    },
    // Fecha de expiración del acceso
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    shared_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'document_shares',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['document_id'] },
      { fields: ['shared_with_user_id'] },
      { fields: ['shared_with_department_id'] },
      { fields: ['expires_at'] },
    ],
  });

  return DocumentShare;
};
