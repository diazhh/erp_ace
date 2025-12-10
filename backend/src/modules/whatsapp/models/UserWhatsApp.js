const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserWhatsApp = sequelize.define('UserWhatsApp', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'phone_number',
    },
    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '+58',
      field: 'country_code',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    verificationCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      field: 'verification_code',
    },
    verificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verification_expires',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'notifications_enabled',
    },
  }, {
    tableName: 'user_whatsapp',
    timestamps: true,
    underscored: true,
  });

  return UserWhatsApp;
};
