const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StopWorkAuthority = sequelize.define('StopWorkAuthority', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    permit_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'work_permits', key: 'id' },
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'fields', key: 'id' },
    },
    well_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'wells', key: 'id' },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM(
        'UNSAFE_CONDITION',
        'UNSAFE_ACT',
        'EQUIPMENT_FAILURE',
        'WEATHER',
        'PERMIT_VIOLATION',
        'EMERGENCY',
        'OTHER'
      ),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      defaultValue: 'MEDIUM',
    },
    immediate_actions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reported_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    reported_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'),
      defaultValue: 'OPEN',
    },
    lessons_learned: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    corrective_actions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    work_resumed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    work_resumed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  }, {
    tableName: 'stop_work_authorities',
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

  return StopWorkAuthority;
};
