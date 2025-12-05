const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VehicleAssignment = sequelize.define('VehicleAssignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'vehicle_id',
      references: {
        model: 'vehicles',
        key: 'id',
      },
    },
    // Tipo de asignación
    assignmentType: {
      type: DataTypes.ENUM('EMPLOYEE', 'PROJECT', 'DEPARTMENT'),
      allowNull: false,
      field: 'assignment_type',
    },
    // Asignado a (uno de estos)
    employeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Fechas
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date',
    },
    // Kilometraje al inicio/fin
    startMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'start_mileage',
    },
    endMileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'end_mileage',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      field: 'status',
    },
    // Propósito
    purpose: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'purpose',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'vehicle_assignments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['vehicle_id'] },
      { fields: ['employee_id'] },
      { fields: ['project_id'] },
      { fields: ['department_id'] },
      { fields: ['status'] },
      { fields: ['start_date', 'end_date'] },
    ],
  });

  return VehicleAssignment;
};
