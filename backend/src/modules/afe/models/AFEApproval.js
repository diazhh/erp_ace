const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AFEApproval = sequelize.define('AFEApproval', {
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
    approver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approval_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    tableName: 'afe_approvals',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['afe_id'] },
      { fields: ['approver_id'] },
      { fields: ['status'] },
      { fields: ['approval_level'] },
    ],
  });

  return AFEApproval;
};
