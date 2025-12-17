const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ComplianceAudit = sequelize.define('ComplianceAudit', {
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
      type: DataTypes.ENUM('INTERNAL', 'EXTERNAL', 'REGULATORY', 'CERTIFICATION', 'SURVEILLANCE'),
      allowNull: false,
      defaultValue: 'INTERNAL',
    },
    auditor_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    auditor_company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    lead_auditor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: 'Internal lead auditor',
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    criteria: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Audit criteria/standards',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLANNED',
    },
    findings: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Array of findings with severity and description',
    },
    findings_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    major_findings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minor_findings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    observations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    conclusion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    follow_up_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    follow_up_status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_REQUIRED'),
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
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'compliance_audits',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['start_date'] },
      { fields: ['field_id'] },
      { fields: ['project_id'] },
      { fields: ['department_id'] },
    ],
  });

  return ComplianceAudit;
};
