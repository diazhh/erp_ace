const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AFE = sequelize.define('AFE', {
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('DRILLING', 'WORKOVER', 'FACILITIES', 'EXPLORATION', 'MAINTENANCE', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    field_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    well_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'wells',
        key: 'id',
      },
    },
    estimated_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    approval_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Current approval level required',
    },
    current_approval_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Current approval level reached',
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    final_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    variance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Difference between estimated and final cost',
    },
    variance_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
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
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'afes',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['project_id'] },
      { fields: ['field_id'] },
      { fields: ['well_id'] },
      { fields: ['created_by'] },
    ],
  });

  return AFE;
};
