const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BankAccount = sequelize.define('BankAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Información básica
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre descriptivo de la cuenta',
    },
    accountType: {
      type: DataTypes.ENUM('CHECKING', 'SAVINGS', 'CRYPTO_WALLET', 'CASH', 'PAGO_MOVIL', 'ZELLE'),
      allowNull: false,
      field: 'account_type',
    },
    // Datos bancarios
    bankName: {
      type: DataTypes.STRING(100),
      field: 'bank_name',
      comment: 'Nombre del banco o plataforma',
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      field: 'account_number',
    },
    accountHolder: {
      type: DataTypes.STRING(150),
      field: 'account_holder',
      comment: 'Titular de la cuenta',
    },
    // Para cuentas venezolanas
    rif: {
      type: DataTypes.STRING(20),
      comment: 'RIF del titular',
    },
    phone: {
      type: DataTypes.STRING(20),
      comment: 'Teléfono para Pago Móvil',
    },
    // Para crypto wallets
    walletAddress: {
      type: DataTypes.STRING(255),
      field: 'wallet_address',
      comment: 'Dirección de wallet (encriptada)',
    },
    network: {
      type: DataTypes.STRING(50),
      comment: 'Red de la wallet (BSC, TRC20, etc.)',
    },
    // Moneda principal
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
      comment: 'USD, VES, USDT',
    },
    // Saldo actual
    currentBalance: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0,
      field: 'current_balance',
    },
    // Estado
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_default',
      comment: 'Cuenta por defecto para la moneda',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      field: 'created_by',
    },
  }, {
    tableName: 'bank_accounts',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['account_type'] },
      { fields: ['currency'] },
      { fields: ['is_active'] },
    ],
  });

  BankAccount.associate = (models) => {
    BankAccount.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    BankAccount.hasMany(models.Transaction, {
      foreignKey: 'accountId',
      as: 'transactions',
    });
  };

  return BankAccount;
};
