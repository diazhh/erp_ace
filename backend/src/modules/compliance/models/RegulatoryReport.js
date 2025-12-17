const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RegulatoryReport = sequelize.define('RegulatoryReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('PRODUCTION', 'ENVIRONMENTAL', 'FISCAL', 'SAFETY', 'OPERATIONAL', 'FINANCIAL', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    entity: {
      type: DataTypes.ENUM('MENPET', 'SENIAT', 'INEA', 'MINEA', 'PDVSA', 'ANH', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
      comment: 'Government entity to submit to',
    },
    entity_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Custom entity name if OTHER',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    period_start: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    period_end: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    submitted_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'REVISION_REQUIRED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Report data in JSON format',
    },
    response_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Reference number from entity',
    },
    response_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    response_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submitted_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'regulatory_reports',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['entity'] },
      { fields: ['due_date'] },
      { fields: ['field_id'] },
      { fields: ['project_id'] },
    ],
  });

  return RegulatoryReport;
};
