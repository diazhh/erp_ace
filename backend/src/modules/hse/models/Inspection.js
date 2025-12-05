const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inspection = sequelize.define('Inspection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la inspección (ej: INS-2025-001)',
    },
    // Tipo de inspección
    inspectionType: {
      type: DataTypes.ENUM(
        'WORKPLACE',          // Lugar de trabajo
        'EQUIPMENT',          // Equipos
        'VEHICLE',            // Vehículos
        'PPE',                // Equipos de protección personal
        'FIRE_SAFETY',        // Seguridad contra incendios
        'ELECTRICAL',         // Eléctrica
        'ENVIRONMENTAL',      // Ambiental
        'ERGONOMIC',          // Ergonómica
        'HOUSEKEEPING',       // Orden y limpieza
        'PRE_TASK',           // Pre-tarea
        'OTHER'
      ),
      allowNull: false,
      field: 'inspection_type',
    },
    // Información de la inspección
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fecha y lugar
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'scheduled_date',
    },
    completedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'completed_date',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    // Relaciones
    inspectorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'inspector_id',
      comment: 'Empleado que realiza la inspección',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'vehicle_id',
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'warehouse_id',
    },
    // Resultados
    status: {
      type: DataTypes.ENUM(
        'SCHEDULED',    // Programada
        'IN_PROGRESS',  // En progreso
        'COMPLETED',    // Completada
        'CANCELLED',    // Cancelada
        'OVERDUE'       // Vencida
      ),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
    result: {
      type: DataTypes.ENUM(
        'PASS',         // Aprobada
        'FAIL',         // Reprobada
        'CONDITIONAL',  // Condicional
        'PENDING'       // Pendiente
      ),
      allowNull: true,
      comment: 'Resultado de la inspección',
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Puntuación de la inspección (0-100)',
    },
    // Hallazgos
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Hallazgos de la inspección',
    },
    nonConformities: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'non_conformities',
      comment: 'Número de no conformidades encontradas',
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Recomendaciones',
    },
    // Acciones correctivas
    correctiveActionsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'corrective_actions_required',
    },
    correctiveActionsDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'corrective_actions_deadline',
    },
    correctiveActionsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'corrective_actions_completed',
    },
    // Checklist (items de la inspección)
    checklist: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Items del checklist con resultados',
    },
    // Evidencias
    photos: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'URLs de fotos de la inspección',
    },
    // Aprobación
    approvedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by_id',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'inspections',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['inspection_type'] },
      { fields: ['status'] },
      { fields: ['result'] },
      { fields: ['scheduled_date'] },
      { fields: ['inspector_id'] },
      { fields: ['project_id'] },
    ],
  });

  Inspection.associate = (models) => {
    Inspection.belongsTo(models.Employee, {
      as: 'inspector',
      foreignKey: 'inspectorId',
    });
    Inspection.belongsTo(models.Employee, {
      as: 'approvedBy',
      foreignKey: 'approvedById',
    });
    Inspection.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });
    Inspection.belongsTo(models.Vehicle, {
      as: 'vehicle',
      foreignKey: 'vehicleId',
    });
    Inspection.belongsTo(models.Warehouse, {
      as: 'warehouse',
      foreignKey: 'warehouseId',
    });
    Inspection.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });
  };

  return Inspection;
};
