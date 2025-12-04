const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectMember = sequelize.define('ProjectMember', {
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
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
    },
    // Rol en el proyecto
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Rol del empleado en el proyecto (ej: MANAGER, DEVELOPER, ANALYST)',
    },
    // Fechas de asignación
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
      comment: 'Fecha de inicio en el proyecto',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date',
      comment: 'Fecha de fin en el proyecto',
    },
    // Dedicación
    allocation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Porcentaje de dedicación al proyecto (0-100)',
    },
    // Tarifa horaria (si aplica)
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'hourly_rate',
      comment: 'Tarifa horaria para el proyecto',
    },
    // Horas trabajadas
    hoursWorked: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'hours_worked',
      comment: 'Total de horas trabajadas',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Permisos especiales en el proyecto
    canApproveExpenses: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'can_approve_expenses',
    },
    canEditMilestones: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'can_edit_milestones',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'project_members',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['project_id'] },
      { fields: ['employee_id'] },
      { fields: ['project_id', 'employee_id'], unique: true },
      { fields: ['status'] },
      { fields: ['role'] },
    ],
  });

  return ProjectMember;
};
