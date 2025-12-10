const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmActivity = sequelize.define('CrmActivity', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Relaciones polimórficas
    entityType: {
      type: DataTypes.ENUM('CLIENT', 'OPPORTUNITY', 'QUOTE'),
      allowNull: false,
      field: 'entity_type',
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entity_id',
    },
    // Tipo de actividad
    activityType: {
      type: DataTypes.ENUM(
        'CALL',           // Llamada telefónica
        'EMAIL',          // Correo electrónico
        'MEETING',        // Reunión
        'VISIT',          // Visita
        'TASK',           // Tarea
        'NOTE',           // Nota
        'WHATSAPP',       // Mensaje WhatsApp
        'FOLLOW_UP',      // Seguimiento
        'PRESENTATION',   // Presentación
        'OTHER'           // Otro
      ),
      allowNull: false,
      field: 'activity_type',
    },
    // Información de la actividad
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fechas
    activityDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'activity_date',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date',
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_date',
    },
    // Duración (para llamadas, reuniones)
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'duration_minutes',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLANNED',
    },
    // Resultado (para llamadas, reuniones)
    outcome: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Resultado de la actividad',
    },
    // Prioridad
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    // Contacto relacionado
    contactId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'contact_id',
      references: {
        model: 'client_contacts',
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
    // Recordatorio
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reminder_date',
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'reminder_sent',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
    completedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'completed_by',
    },
  }, {
    tableName: 'crm_activities',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['activity_type'] },
      { fields: ['status'] },
      { fields: ['activity_date'] },
      { fields: ['due_date'] },
      { fields: ['assigned_to_id'] },
      { fields: ['contact_id'] },
    ],
  });

  return CrmActivity;
};
