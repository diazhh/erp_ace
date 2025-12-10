const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NonConformance = sequelize.define('NonConformance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la no conformidad (ej: NC-001)',
    },
    // Relaciones
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    inspectionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inspection_id',
      references: {
        model: 'quality_inspections',
        key: 'id',
      },
    },
    // Tipo de no conformidad
    ncType: {
      type: DataTypes.ENUM('MINOR', 'MAJOR', 'CRITICAL'),
      allowNull: false,
      field: 'nc_type',
    },
    // Categoría
    category: {
      type: DataTypes.ENUM(
        'MATERIAL',       // Material defectuoso
        'WORKMANSHIP',    // Mano de obra deficiente
        'DOCUMENTATION',  // Documentación incorrecta
        'PROCESS',        // Proceso no seguido
        'EQUIPMENT',      // Equipo defectuoso
        'DESIGN',         // Error de diseño
        'OTHER'           // Otro
      ),
      allowNull: false,
    },
    // Información de la no conformidad
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Elemento afectado
    affectedItem: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'affected_item',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    // Requisito incumplido
    requirementReference: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'requirement_reference',
      comment: 'Norma/especificación incumplida',
    },
    // Fechas
    detectedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'detected_date',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date',
      comment: 'Fecha límite para cierre',
    },
    closedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'closed_date',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'OPEN',           // Abierta
        'UNDER_ANALYSIS', // En análisis
        'ACTION_PENDING', // Acción pendiente
        'IN_PROGRESS',    // En progreso
        'VERIFICATION',   // En verificación
        'CLOSED',         // Cerrada
        'CANCELLED'       // Cancelada
      ),
      allowNull: false,
      defaultValue: 'OPEN',
    },
    // Análisis de causa raíz
    rootCauseAnalysis: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'root_cause_analysis',
    },
    rootCauseMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'root_cause_method',
      comment: '5 Whys, Ishikawa, etc.',
    },
    // Disposición inmediata
    immediateAction: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'immediate_action',
      comment: 'Acción inmediata tomada',
    },
    disposition: {
      type: DataTypes.ENUM(
        'USE_AS_IS',      // Usar como está
        'REWORK',         // Retrabajo
        'REPAIR',         // Reparar
        'SCRAP',          // Desechar
        'RETURN',         // Devolver
        'DOWNGRADE'       // Degradar
      ),
      allowNull: true,
    },
    // Responsables
    detectedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'detected_by_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    responsibleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'responsible_id',
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: 'Responsable de resolver la NC',
    },
    // Costo estimado
    estimatedCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'estimated_cost',
    },
    actualCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'actual_cost',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Verificación de cierre
    verifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'verified_by_id',
    },
    verificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'verification_notes',
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
    tableName: 'non_conformances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['inspection_id'] },
      { fields: ['nc_type'] },
      { fields: ['status'] },
      { fields: ['detected_date'] },
      { fields: ['responsible_id'] },
    ],
  });

  return NonConformance;
};
