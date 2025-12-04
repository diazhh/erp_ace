const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectMilestone = sequelize.define('ProjectMilestone', {
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
    // Información del hito
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre del hito',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fechas
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date',
      comment: 'Fecha límite del hito',
    },
    completedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'completed_date',
      comment: 'Fecha real de completación',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    // Orden
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
      comment: 'Orden de visualización',
    },
    // Peso del hito en el progreso total
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100,
      },
      comment: 'Peso del hito para calcular progreso (1-100)',
    },
    // Responsable
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assignee_id',
      comment: 'Empleado responsable del hito',
    },
    // Entregables
    deliverables: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lista de entregables (texto o JSON)',
    },
    // Dependencias (hitos que deben completarse antes)
    dependsOn: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      field: 'depends_on',
      comment: 'IDs de hitos de los que depende',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    completedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'completed_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'project_milestones',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['project_id'] },
      { fields: ['status'] },
      { fields: ['due_date'] },
      { fields: ['assignee_id'] },
      { fields: ['sort_order'] },
    ],
  });

  return ProjectMilestone;
};
