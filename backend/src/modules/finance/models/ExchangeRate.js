const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Fecha de la tasa
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Moneda origen
    fromCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'from_currency',
      defaultValue: 'USD',
    },
    // Moneda destino
    toCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'to_currency',
      defaultValue: 'VES',
    },
    // Tasa de cambio
    rate: {
      type: DataTypes.DECIMAL(20, 6),
      allowNull: false,
      comment: '1 fromCurrency = rate toCurrency',
    },
    // Fuente de la tasa
    source: {
      type: DataTypes.ENUM('BCV', 'PARALLEL', 'BINANCE', 'MANUAL'),
      defaultValue: 'MANUAL',
      comment: 'Fuente de la tasa de cambio',
    },
    // Si es la tasa activa para el día
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    // Notas
    notes: {
      type: DataTypes.STRING(255),
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      field: 'created_by',
    },
  }, {
    tableName: 'exchange_rates',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['date'] },
      { fields: ['from_currency', 'to_currency'] },
      { fields: ['is_active'] },
      { unique: true, fields: ['date', 'from_currency', 'to_currency', 'source'] },
    ],
  });

  ExchangeRate.associate = (models) => {
    ExchangeRate.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
  };

  return ExchangeRate;
};
