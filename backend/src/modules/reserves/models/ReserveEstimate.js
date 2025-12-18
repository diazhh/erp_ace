const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReserveEstimate = sequelize.define('ReserveEstimate', {
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
    field_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    estimate_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    standard: {
      type: DataTypes.ENUM('PRMS', 'SEC', 'SPE', 'PDVSA', 'OTHER'),
      allowNull: false,
      defaultValue: 'PRMS',
    },
    evaluator: {
      type: DataTypes.ENUM('INTERNAL', 'EXTERNAL'),
      allowNull: false,
      defaultValue: 'INTERNAL',
    },
    evaluator_company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    evaluator_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    report_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    methodology: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assumptions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'SUPERSEDED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    superseded_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'reserve_estimates',
        key: 'id',
      },
    },
    superseded_at: {
      type: DataTypes.DATE,
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
  }, {
    tableName: 'reserve_estimates',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['field_id'] },
      { fields: ['status'] },
      { fields: ['estimate_date'] },
      { fields: ['standard'] },
    ],
  });

  return ReserveEstimate;
};
