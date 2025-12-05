const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectUpdate = sequelize.define('ProjectUpdate', {
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
    // Tipo de actualización
    updateType: {
      type: DataTypes.ENUM('PROGRESS', 'ISSUE', 'MILESTONE', 'PAYMENT', 'PHOTO', 'NOTE', 'APPROVAL'),
      allowNull: false,
      defaultValue: 'PROGRESS',
      field: 'update_type',
      comment: 'Tipo de actualización del proyecto',
    },
    // Información de la actualización
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título de la actualización',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción detallada',
    },
    // Progreso (si aplica)
    progressBefore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'progress_before',
      comment: 'Progreso antes de la actualización',
    },
    progressAfter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'progress_after',
      comment: 'Progreso después de la actualización',
    },
    // Referencia a pago (si es tipo PAYMENT)
    paymentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'payment_id',
      comment: 'ID del pago si es actualización de pago',
    },
    // Referencia a hito (si es tipo MILESTONE)
    milestoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'milestone_id',
      comment: 'ID del hito si es actualización de hito',
    },
    // Quién reporta
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reported_by',
      comment: 'Empleado que reporta la actualización',
    },
    // Fecha del reporte
    reportedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'reported_at',
    },
    // Visibilidad
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public',
      comment: 'Si es visible para todos o solo internos',
    },
    // Notas adicionales
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'project_updates',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['project_id'] },
      { fields: ['update_type'] },
      { fields: ['reported_by'] },
      { fields: ['reported_at'] },
      { fields: ['payment_id'] },
      { fields: ['milestone_id'] },
    ],
  });

  return ProjectUpdate;
};
