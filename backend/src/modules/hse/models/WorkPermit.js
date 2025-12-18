const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkPermit = sequelize.define('WorkPermit', {
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
    type: {
      type: DataTypes.ENUM(
        'HOT_WORK',
        'CONFINED_SPACE',
        'ELECTRICAL',
        'EXCAVATION',
        'LIFTING',
        'WORKING_AT_HEIGHT',
        'LOCKOUT_TAGOUT',
        'RADIOGRAPHY',
        'DIVING',
        'GENERAL'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    work_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hazards_identified: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    control_measures: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    ppe_required: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING',
        'APPROVED',
        'ACTIVE',
        'SUSPENDED',
        'CLOSED',
        'CANCELLED',
        'EXPIRED'
      ),
      defaultValue: 'DRAFT',
    },
    requested_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contractor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'contractors', key: 'id' },
    },
    max_workers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actual_workers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    supervisor_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    supervisor_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergency_contact: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    emergency_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gas_test_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gas_test_results: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isolation_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isolation_points: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    fire_watch_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fire_watch_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    closed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closure_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'work_permits',
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

  return WorkPermit;
};
