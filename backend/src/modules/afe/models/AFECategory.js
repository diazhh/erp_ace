const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AFECategory = sequelize.define('AFECategory', {
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
    category: {
      type: DataTypes.ENUM('DRILLING', 'COMPLETION', 'FACILITIES', 'SERVICES', 'EQUIPMENT', 'MATERIALS', 'LABOR', 'CONTINGENCY', 'OTHER'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estimated_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    actual_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    committed_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Amount committed via POs but not yet spent',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'afe_categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['afe_id'] },
      { fields: ['category'] },
    ],
  });

  return AFECategory;
};
