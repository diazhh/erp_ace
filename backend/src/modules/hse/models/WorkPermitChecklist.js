const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkPermitChecklist = sequelize.define('WorkPermitChecklist', {
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
    checklist_type: {
      type: DataTypes.ENUM('PRE_WORK', 'DURING', 'POST_WORK'),
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    completed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    all_passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'work_permit_checklists',
    timestamps: true,
    underscored: true,
  });

  return WorkPermitChecklist;
};
