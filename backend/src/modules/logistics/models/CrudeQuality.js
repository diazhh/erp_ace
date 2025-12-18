const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrudeQuality = sequelize.define('CrudeQuality', {
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
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    tank_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'storage_tanks',
        key: 'id',
      },
    },
    sample_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sample_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sample_point: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    api_gravity: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    bsw: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
      comment: 'Basic Sediment and Water percentage',
    },
    sulfur_content: {
      type: DataTypes.DECIMAL(8, 4),
      allowNull: true,
      comment: 'Sulfur content percentage',
    },
    viscosity: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      comment: 'Viscosity in cSt at 100°F',
    },
    pour_point: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Pour point in Fahrenheit',
    },
    salt_content: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      comment: 'Salt content in PTB (pounds per thousand barrels)',
    },
    h2s_content: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      comment: 'H2S content in ppm',
    },
    reid_vapor_pressure: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'RVP in psi',
    },
    flash_point: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Flash point in Fahrenheit',
    },
    lab_report_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lab_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    sampled_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    analyzed_by: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ANALYZED', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
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
    tableName: 'crude_qualities',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['field_id'] },
      { fields: ['tank_id'] },
      { fields: ['sample_date'] },
      { fields: ['status'] },
    ],
  });

  return CrudeQuality;
};
