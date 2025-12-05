const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Training = sequelize.define('Training', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código de la capacitación (ej: CAP-2025-001)',
    },
    // Tipo de capacitación
    trainingType: {
      type: DataTypes.ENUM(
        'INDUCTION',          // Inducción
        'SAFETY',             // Seguridad general
        'FIRE_SAFETY',        // Seguridad contra incendios
        'FIRST_AID',          // Primeros auxilios
        'PPE',                // Uso de EPP
        'HAZMAT',             // Materiales peligrosos
        'HEIGHTS',            // Trabajo en alturas
        'CONFINED_SPACES',    // Espacios confinados
        'ELECTRICAL',         // Seguridad eléctrica
        'ERGONOMICS',         // Ergonomía
        'ENVIRONMENTAL',      // Ambiental
        'DEFENSIVE_DRIVING',  // Manejo defensivo
        'EQUIPMENT_OPERATION', // Operación de equipos
        'EMERGENCY_RESPONSE', // Respuesta a emergencias
        'OTHER'
      ),
      allowNull: false,
      field: 'training_type',
    },
    // Información de la capacitación
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Objetivos de la capacitación',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Contenido/temario',
    },
    // Fechas
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'scheduled_date',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'end_time',
    },
    durationHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'duration_hours',
      comment: 'Duración en horas',
    },
    // Lugar
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_online',
    },
    onlineLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'online_link',
    },
    // Instructor
    instructorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'instructor_id',
      comment: 'Empleado instructor (si es interno)',
    },
    externalInstructor: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'external_instructor',
      comment: 'Nombre del instructor externo',
    },
    provider: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Proveedor de la capacitación',
    },
    // Proyecto relacionado
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'SCHEDULED',    // Programada
        'IN_PROGRESS',  // En progreso
        'COMPLETED',    // Completada
        'CANCELLED',    // Cancelada
        'POSTPONED'     // Pospuesta
      ),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
    // Evaluación
    hasEvaluation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'has_evaluation',
    },
    passingScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'passing_score',
      comment: 'Puntuación mínima para aprobar',
    },
    // Certificación
    hasCertificate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'has_certificate',
    },
    certificateValidityMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'certificate_validity_months',
      comment: 'Meses de validez del certificado',
    },
    // Capacidad
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_participants',
    },
    // Costo
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Materiales
    materials: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'URLs de materiales de la capacitación',
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
    tableName: 'trainings',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['training_type'] },
      { fields: ['status'] },
      { fields: ['scheduled_date'] },
      { fields: ['instructor_id'] },
      { fields: ['project_id'] },
    ],
  });

  Training.associate = (models) => {
    Training.belongsTo(models.Employee, {
      as: 'instructor',
      foreignKey: 'instructorId',
    });
    Training.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });
    Training.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });
    Training.hasMany(models.TrainingAttendance, {
      as: 'attendances',
      foreignKey: 'trainingId',
    });
  };

  return Training;
};
