const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentVersion = sequelize.define('DocumentVersion', {
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
    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Archivo de esta versión
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // URL externa
    external_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Descripción del cambio
    change_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Hash del archivo para verificar integridad
    file_hash: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    // Indica si es la versión actual
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Auditoría
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'document_versions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['document_id'] },
      { fields: ['version_number'] },
      { fields: ['is_current'] },
      { unique: true, fields: ['document_id', 'version_number'] },
    ],
  });

  return DocumentVersion;
};
