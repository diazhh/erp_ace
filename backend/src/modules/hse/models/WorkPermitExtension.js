const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkPermitExtension = sequelize.define('WorkPermitExtension', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    permit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'work_permits', key: 'id' },
    },
    original_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    new_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'work_permit_extensions',
    timestamps: true,
    underscored: true,
  });

  return WorkPermitExtension;
};
