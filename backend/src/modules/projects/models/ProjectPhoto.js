const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectPhoto = sequelize.define('ProjectPhoto', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
    },
    // Vinculado a una actualización (opcional)
    updateId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'update_id',
      comment: 'ID de la actualización asociada',
    },
    // Información de la foto
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'photo_url',
      comment: 'URL de la foto',
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
      comment: 'URL de la miniatura',
    },
    caption: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Descripción de la foto',
    },
    // Categoría de la foto
    category: {
      type: DataTypes.ENUM('PROGRESS', 'BEFORE', 'AFTER', 'ISSUE', 'DELIVERY', 'INSPECTION', 'OTHER'),
      allowNull: false,
      defaultValue: 'PROGRESS',
      comment: 'Categoría de la foto',
    },
    // Metadatos
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'file_name',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'file_size',
      comment: 'Tamaño en bytes',
    },
    mimeType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'mime_type',
    },
    // Fecha de la foto
    takenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'taken_at',
      comment: 'Fecha en que se tomó la foto',
    },
    // Ubicación (si está disponible)
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    // Quién subió la foto
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by',
    },
    // Orden de visualización
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'project_photos',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['project_id'] },
      { fields: ['update_id'] },
      { fields: ['category'] },
      { fields: ['uploaded_by'] },
      { fields: ['taken_at'] },
      { fields: ['sort_order'] },
    ],
  });

  return ProjectPhoto;
};
