const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReserveCategory = sequelize.define('ReserveCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    estimate_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'reserve_estimates',
        key: 'id',
      },
    },
    category: {
      type: DataTypes.ENUM(
        '1P', '2P', '3P',           // Reserves (Proved, Probable, Possible)
        '1C', '2C', '3C',           // Contingent Resources
        'PROSPECTIVE',              // Prospective Resources
        'UNRECOVERABLE'             // Unrecoverable
      ),
      allowNull: false,
    },
    sub_category: {
      type: DataTypes.ENUM(
        'DEVELOPED_PRODUCING',      // PDP
        'DEVELOPED_NON_PRODUCING',  // PDNP
        'UNDEVELOPED',              // PUD
        'BEHIND_PIPE',
        'SHUT_IN',
        'N/A'
      ),
      allowNull: true,
      defaultValue: 'N/A',
    },
    oil_volume: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: 0,
      comment: 'Oil volume in MMbbl (million barrels)',
    },
    gas_volume: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: 0,
      comment: 'Gas volume in Bcf (billion cubic feet)',
    },
    condensate_volume: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: 0,
      comment: 'Condensate volume in MMbbl',
    },
    ngl_volume: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: 0,
      comment: 'NGL volume in MMbbl',
    },
    boe_volume: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      defaultValue: 0,
      comment: 'Barrels of oil equivalent (calculated)',
    },
    recovery_factor: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Recovery factor percentage',
    },
    ooip: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      comment: 'Original Oil In Place (MMbbl)',
    },
    ogip: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: true,
      comment: 'Original Gas In Place (Bcf)',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'reserve_categories',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['estimate_id'] },
      { fields: ['category'] },
      { unique: true, fields: ['estimate_id', 'category', 'sub_category'] },
    ],
  });

  return ReserveCategory;
};
