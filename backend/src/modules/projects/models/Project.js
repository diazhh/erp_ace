const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del proyecto (ej: PRJ-001 para interno, PRJ-CTR-001 para contratado)',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre del proyecto',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Tipo de ejecución
    executionType: {
      type: DataTypes.ENUM('INTERNAL', 'OUTSOURCED'),
      allowNull: false,
      defaultValue: 'INTERNAL',
      field: 'execution_type',
      comment: 'INTERNAL: ejecutado por la empresa, OUTSOURCED: ejecutado por contratista',
    },
    // Cliente
    clientName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'client_name',
      comment: 'Nombre del cliente',
    },
    clientContact: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'client_contact',
      comment: 'Contacto del cliente',
    },
    clientEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'client_email',
    },
    clientPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'client_phone',
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
      comment: 'Fecha estimada de finalización',
    },
    actualEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'actual_end_date',
      comment: 'Fecha real de finalización',
    },
    // Presupuesto
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Presupuesto total del proyecto',
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'estimated_cost',
      comment: 'Costo estimado',
    },
    actualCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'actual_cost',
      comment: 'Costo real acumulado',
    },
    revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Ingresos del proyecto',
    },
    // Estado y progreso
    status: {
      type: DataTypes.ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLANNING',
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Porcentaje de avance (0-100)',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    // Tipo de proyecto
    projectType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'project_type',
      comment: 'Tipo de proyecto (ej: CONSTRUCTION, CONSULTING, MAINTENANCE)',
    },
    // Ubicación
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación del proyecto',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Responsable
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'manager_id',
      comment: 'Empleado gerente del proyecto',
    },
    // Departamento asociado
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'department_id',
    },
    // Caja chica asociada
    pettyCashId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'petty_cash_id',
      comment: 'Caja chica asignada al proyecto',
    },
    // Contratista asignado
    contractorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'contractor_id',
      comment: 'Contratista que ejecuta el proyecto',
    },
    // Monto acordado con el contratista
    contractAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'contract_amount',
      comment: 'Monto del contrato con el contratista',
    },
    // Pagos realizados al contratista
    paidToContractor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'paid_to_contractor',
      comment: 'Total pagado al contratista',
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
    tableName: 'projects',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['execution_type'] },
      { fields: ['status'] },
      { fields: ['manager_id'] },
      { fields: ['department_id'] },
      { fields: ['contractor_id'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
      { fields: ['priority'] },
    ],
  });

  return Project;
};
