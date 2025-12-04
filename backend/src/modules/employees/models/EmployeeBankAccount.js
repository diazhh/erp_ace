const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmployeeBankAccount = sequelize.define('EmployeeBankAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Tipo de cuenta
    accountType: {
      type: DataTypes.ENUM('CHECKING', 'SAVINGS', 'PAGO_MOVIL', 'ZELLE', 'CRYPTO'),
      defaultValue: 'CHECKING',
      field: 'account_type',
    },
    // Banco
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'bank_name',
    },
    bankCode: {
      type: DataTypes.STRING(10),
      field: 'bank_code',
      comment: 'Código del banco (ej: 0102 para Venezuela)',
    },
    // Número de cuenta
    accountNumber: {
      type: DataTypes.STRING(30),
      field: 'account_number',
    },
    // Titular
    accountHolder: {
      type: DataTypes.STRING(200),
      field: 'account_holder',
    },
    // Identificación del titular
    holderIdType: {
      type: DataTypes.ENUM('V', 'E', 'J', 'P', 'G'),
      field: 'holder_id_type',
    },
    holderIdNumber: {
      type: DataTypes.STRING(20),
      field: 'holder_id_number',
    },
    // Para Pago Móvil
    phoneNumber: {
      type: DataTypes.STRING(20),
      field: 'phone_number',
    },
    // Para Zelle
    zelleEmail: {
      type: DataTypes.STRING(255),
      field: 'zelle_email',
    },
    // Para Crypto
    walletAddress: {
      type: DataTypes.STRING(100),
      field: 'wallet_address',
    },
    network: {
      type: DataTypes.STRING(20),
      comment: 'Red de la wallet (TRC20, ERC20, BEP20, etc.)',
    },
    // Moneda
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'VES',
    },
    // Es cuenta principal para pagos
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_primary',
    },
    // Porcentaje de pago (para dividir nómina)
    paymentPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 100,
      field: 'payment_percentage',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION'),
      defaultValue: 'ACTIVE',
    },
    // Verificación
    verifiedAt: {
      type: DataTypes.DATE,
      field: 'verified_at',
    },
    verifiedBy: {
      type: DataTypes.UUID,
      field: 'verified_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'employee_bank_accounts',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['account_type'] },
      { fields: ['is_primary'] },
      { fields: ['status'] },
    ],
  });

  // Hook para asegurar solo una cuenta primaria por empleado
  EmployeeBankAccount.beforeSave(async (account, options) => {
    if (account.isPrimary) {
      await EmployeeBankAccount.update(
        { isPrimary: false },
        { 
          where: { 
            employeeId: account.employeeId,
            id: { [require('sequelize').Op.ne]: account.id || null },
          },
          transaction: options.transaction,
        }
      );
    }
  });

  return EmployeeBankAccount;
};
