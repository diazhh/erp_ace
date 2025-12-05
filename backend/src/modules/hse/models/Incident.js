const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Incident = sequelize.define('Incident', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código del incidente (ej: INC-2025-001)',
    },
    // Tipo de incidente
    incidentType: {
      type: DataTypes.ENUM(
        'ACCIDENT',           // Accidente laboral
        'NEAR_MISS',          // Casi accidente
        'UNSAFE_CONDITION',   // Condición insegura
        'UNSAFE_ACT',         // Acto inseguro
        'ENVIRONMENTAL',      // Incidente ambiental
        'PROPERTY_DAMAGE',    // Daño a propiedad
        'OCCUPATIONAL_ILLNESS', // Enfermedad ocupacional
        'FIRST_AID',          // Primeros auxilios
        'OTHER'
      ),
      allowNull: false,
      field: 'incident_type',
    },
    // Severidad
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'LOW',
    },
    // Información del incidente
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Fecha y lugar
    incidentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'incident_date',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Lugar donde ocurrió el incidente',
    },
    // Relaciones
    reportedById: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reported_by_id',
      comment: 'Empleado que reporta el incidente',
    },
    affectedEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'affected_employee_id',
      comment: 'Empleado afectado (si aplica)',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto donde ocurrió (si aplica)',
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'vehicle_id',
      comment: 'Vehículo involucrado (si aplica)',
    },
    // Lesiones
    injuryType: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'injury_type',
      comment: 'Tipo de lesión (si hubo)',
    },
    bodyPartAffected: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'body_part_affected',
      comment: 'Parte del cuerpo afectada',
    },
    daysLost: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'days_lost',
      comment: 'Días perdidos por el incidente',
    },
    medicalAttention: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'medical_attention',
      comment: 'Requirió atención médica',
    },
    // Investigación
    rootCause: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'root_cause',
      comment: 'Causa raíz del incidente',
    },
    immediateActions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'immediate_actions',
      comment: 'Acciones inmediatas tomadas',
    },
    correctiveActions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'corrective_actions',
      comment: 'Acciones correctivas',
    },
    preventiveActions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'preventive_actions',
      comment: 'Acciones preventivas',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'REPORTED',       // Reportado
        'INVESTIGATING',  // En investigación
        'PENDING_ACTIONS', // Pendiente de acciones
        'IN_PROGRESS',    // Acciones en progreso
        'CLOSED',         // Cerrado
        'CANCELLED'       // Cancelado
      ),
      allowNull: false,
      defaultValue: 'REPORTED',
    },
    // Investigación
    investigatedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'investigated_by_id',
    },
    investigatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'investigated_at',
    },
    closedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'closed_by_id',
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at',
    },
    closureNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'closure_notes',
    },
    // Testigos
    witnesses: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nombres de testigos',
    },
    // Evidencias
    photos: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'URLs de fotos del incidente',
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
    tableName: 'incidents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['incident_type'] },
      { fields: ['severity'] },
      { fields: ['status'] },
      { fields: ['incident_date'] },
      { fields: ['reported_by_id'] },
      { fields: ['affected_employee_id'] },
      { fields: ['project_id'] },
    ],
  });

  Incident.associate = (models) => {
    Incident.belongsTo(models.Employee, {
      as: 'reportedBy',
      foreignKey: 'reportedById',
    });
    Incident.belongsTo(models.Employee, {
      as: 'affectedEmployee',
      foreignKey: 'affectedEmployeeId',
    });
    Incident.belongsTo(models.Employee, {
      as: 'investigatedBy',
      foreignKey: 'investigatedById',
    });
    Incident.belongsTo(models.Employee, {
      as: 'closedBy',
      foreignKey: 'closedById',
    });
    Incident.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });
    Incident.belongsTo(models.Vehicle, {
      as: 'vehicle',
      foreignKey: 'vehicleId',
    });
    Incident.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });
  };

  return Incident;
};
