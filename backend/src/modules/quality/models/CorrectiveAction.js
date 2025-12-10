const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CorrectiveAction = sequelize.define('CorrectiveAction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la acción (ej: CA-001)',
    },
    // Relación con no conformidad
    nonConformanceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'non_conformance_id',
      references: {
        model: 'non_conformances',
        key: 'id',
      },
    },
    // Tipo de acción
    actionType: {
      type: DataTypes.ENUM('CORRECTIVE', 'PREVENTIVE', 'IMPROVEMENT'),
      allowNull: false,
      field: 'action_type',
    },
    // Información de la acción
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Fechas
    plannedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'planned_date',
    },
    completedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'completed_date',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLANNED',
    },
    // Responsable
    responsibleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'responsible_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Resultados
    results: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resultados de la acción',
    },
    // Efectividad
    effectivenessVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'effectiveness_verified',
    },
    effectivenessNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'effectiveness_notes',
    },
    verifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'verified_by_id',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'corrective_actions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['non_conformance_id'] },
      { fields: ['action_type'] },
      { fields: ['status'] },
      { fields: ['responsible_id'] },
      { fields: ['planned_date'] },
    ],
  });

  return CorrectiveAction;
};
