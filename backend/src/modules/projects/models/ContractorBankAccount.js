const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContractorBankAccount = sequelize.define('ContractorBankAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'contractor_id',
    },
    // Información del banco
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'bank_name',
    },
    bankCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'bank_code',
      comment: 'Código del banco (ej: 0102 para Venezuela)',
    },
    // Cuenta
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'account_number',
    },
    accountType: {
      type: DataTypes.ENUM('CHECKING', 'SAVINGS', 'FOREIGN'),
      allowNull: false,
      defaultValue: 'CHECKING',
      field: 'account_type',
    },
    // Moneda
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'VES',
    },
    // Titular
    holderName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'holder_name',
      comment: 'Nombre del titular de la cuenta',
    },
    holderIdType: {
      type: DataTypes.ENUM('J', 'G', 'V', 'E', 'P'),
      allowNull: true,
      field: 'holder_id_type',
      comment: 'Tipo de documento: J=Jurídico, G=Gobierno, V=Venezolano, E=Extranjero, P=Pasaporte',
    },
    holderIdNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'holder_id_number',
    },
    // Para transferencias internacionales
    swiftCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'swift_code',
    },
    iban: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    routingNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'routing_number',
    },
    // Estado
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
      comment: 'Cuenta principal para pagos',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verified',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'verified_by',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'contractor_bank_accounts',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['contractor_id'] },
      { fields: ['bank_code'] },
      { fields: ['currency'] },
      { fields: ['is_primary'] },
      { fields: ['status'] },
    ],
  });

  return ContractorBankAccount;
};
