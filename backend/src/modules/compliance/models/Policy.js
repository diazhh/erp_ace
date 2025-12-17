const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Policy = sequelize.define('Policy', {
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
    category: {
      type: DataTypes.ENUM('HSE', 'OPERATIONS', 'HR', 'FINANCE', 'IT', 'QUALITY', 'ENVIRONMENTAL', 'SECURITY', 'ETHICS', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '1.0',
    },
    effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'SUPERSEDED', 'ARCHIVED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Who/what the policy applies to',
    },
    responsibilities: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Roles and their responsibilities',
    },
    references: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Related documents, standards, regulations',
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id',
      },
      comment: 'Owning department',
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: 'Policy owner',
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_review_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    supersedes_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'policies',
        key: 'id',
      },
      comment: 'Previous version of this policy',
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
    tableName: 'policies',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['effective_date'] },
      { fields: ['department_id'] },
      { fields: ['owner_id'] },
      { fields: ['next_review_date'] },
    ],
  });

  return Policy;
};
