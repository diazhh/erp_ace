const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AFEVariance = sequelize.define('AFEVariance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    afe_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'afes',
        key: 'id',
      },
    },
    variance_type: {
      type: DataTypes.ENUM('COST', 'SCOPE', 'SCHEDULE'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    original_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Original estimated value',
    },
    new_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'New requested value',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Variance amount (new - original)',
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    requested_by: {
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
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'afe_variances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['afe_id'] },
      { fields: ['variance_type'] },
      { fields: ['status'] },
    ],
  });

  return AFEVariance;
};
