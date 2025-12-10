const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Opportunity = sequelize.define('Opportunity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la oportunidad (ej: OPP-001)',
    },
    // Relaciones
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'client_id',
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    contactId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'contact_id',
      references: {
        model: 'client_contacts',
        key: 'id',
      },
    },
    // Información de la oportunidad
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Título/nombre de la oportunidad',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Pipeline/Etapa
    stage: {
      type: DataTypes.ENUM(
        'LEAD',           // Prospecto inicial
        'QUALIFIED',      // Calificado
        'PROPOSAL',       // Propuesta enviada
        'NEGOTIATION',    // En negociación
        'WON',            // Ganada
        'LOST'            // Perdida
      ),
      allowNull: false,
      defaultValue: 'LEAD',
    },
    // Valores
    estimatedValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'estimated_value',
      comment: 'Valor estimado de la oportunidad',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Probabilidad de cierre (%)',
    },
    weightedValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'weighted_value',
      comment: 'Valor ponderado (valor * probabilidad)',
    },
    // Fechas
    expectedCloseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expected_close_date',
    },
    actualCloseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'actual_close_date',
    },
    // Origen
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Origen de la oportunidad (Referido, Licitación, Web, etc.)',
    },
    // Competencia
    competitors: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Competidores identificados',
    },
    // Razón de pérdida (si aplica)
    lostReason: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'lost_reason',
    },
    lostToCompetitor: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'lost_to_competitor',
    },
    // Proyecto resultante (si se gana)
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    // Responsable
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Prioridad
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
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
    tableName: 'opportunities',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['client_id'] },
      { fields: ['stage'] },
      { fields: ['assigned_to_id'] },
      { fields: ['expected_close_date'] },
      { fields: ['priority'] },
    ],
    hooks: {
      beforeSave: (instance) => {
        // Calcular valor ponderado
        if (instance.estimatedValue && instance.probability) {
          instance.weightedValue = parseFloat(instance.estimatedValue) * (instance.probability / 100);
        }
      },
    },
  });

  return Opportunity;
};
