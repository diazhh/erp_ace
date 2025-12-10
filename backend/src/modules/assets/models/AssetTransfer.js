const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AssetTransfer = sequelize.define('AssetTransfer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'asset_id',
      references: {
        model: 'assets',
        key: 'id',
      },
    },
    // Tipo de transferencia
    transferType: {
      type: DataTypes.ENUM(
        'LOCATION',     // Cambio de ubicación física
        'EMPLOYEE',     // Asignación a empleado
        'PROJECT',      // Asignación a proyecto
        'DEPARTMENT',   // Asignación a departamento
        'RETURN'        // Devolución a almacén
      ),
      allowNull: false,
      field: 'transfer_type',
    },
    // Origen
    fromLocationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_location_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    fromEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    fromProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    fromDepartmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Destino
    toLocationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_location_id',
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    toEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    toProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    toDepartmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Fechas
    transferDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'transfer_date',
    },
    expectedReturnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expected_return_date',
    },
    actualReturnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'actual_return_date',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
      field: 'status',
    },
    // Condición al momento de la transferencia
    conditionAtTransfer: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
      allowNull: true,
      field: 'condition_at_transfer',
    },
    conditionAtReturn: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
      allowNull: true,
      field: 'condition_at_return',
    },
    // Motivo
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reason',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    // Auditoría
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'requested_by',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
    deliveredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'delivered_by',
    },
    receivedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'received_by',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'asset_transfers',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['asset_id'] },
      { fields: ['transfer_type'] },
      { fields: ['status'] },
      { fields: ['transfer_date'] },
      { fields: ['from_employee_id'] },
      { fields: ['to_employee_id'] },
      { fields: ['from_project_id'] },
      { fields: ['to_project_id'] },
    ],
  });

  return AssetTransfer;
};
