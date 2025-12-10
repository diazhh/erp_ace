const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QualityPlan = sequelize.define('QualityPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del plan de calidad (ej: QP-001)',
    },
    // Relación con proyecto
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    // Información del plan
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Estándares aplicables
    applicableStandards: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      field: 'applicable_standards',
      comment: 'Normas aplicables (ISO 9001, API, etc.)',
    },
    // Fechas
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'effective_date',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
    // Versión
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '1.0',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'OBSOLETE'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Objetivos de calidad
    qualityObjectives: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'quality_objectives',
    },
    // Criterios de aceptación generales
    acceptanceCriteria: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'acceptance_criteria',
    },
    // Responsable de calidad
    qualityManagerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'quality_manager_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Aprobaciones
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
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
    tableName: 'quality_plans',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['status'] },
      { fields: ['quality_manager_id'] },
    ],
  });

  return QualityPlan;
};
