const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Warehouse = sequelize.define('Warehouse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único del almacén (ej: ALM-001)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del almacén',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Tipo de almacén
    warehouseType: {
      type: DataTypes.ENUM('MAIN', 'SECONDARY', 'TRANSIT', 'PROJECT'),
      allowNull: false,
      defaultValue: 'SECONDARY',
      field: 'warehouse_type',
      comment: 'MAIN: principal, SECONDARY: secundario, TRANSIT: tránsito, PROJECT: asignado a proyecto',
    },
    // Ubicación
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación física del almacén',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Responsable
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'manager_id',
      comment: 'Empleado encargado del almacén',
    },
    // Proyecto asociado (si es tipo PROJECT)
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
      comment: 'Proyecto asociado (solo para tipo PROJECT)',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'CLOSED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Capacidad
    capacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Capacidad en metros cuadrados',
    },
    // Contacto
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
    tableName: 'warehouses',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['warehouse_type'] },
      { fields: ['status'] },
      { fields: ['manager_id'] },
      { fields: ['project_id'] },
    ],
  });

  return Warehouse;
};
