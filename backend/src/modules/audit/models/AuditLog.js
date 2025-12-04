const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.',
    },
    entityType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'entity_type',
      comment: 'Nombre del modelo/tabla afectado',
    },
    entityId: {
      type: DataTypes.UUID,
      field: 'entity_id',
    },
    oldValues: {
      type: DataTypes.JSONB,
      field: 'old_values',
    },
    newValues: {
      type: DataTypes.JSONB,
      field: 'new_values',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
    },
    metadata: {
      type: DataTypes.JSONB,
      comment: 'Datos adicionales del evento',
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    updatedAt: false, // Los logs de auditoría no se actualizan
    indexes: [
      { fields: ['user_id'] },
      { fields: ['entity_type'] },
      { fields: ['entity_id'] },
      { fields: ['action'] },
      { fields: ['created_at'] },
    ],
  });

  return AuditLog;
};
