const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserEmail = sequelize.define('UserEmail', {
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    lastEmailSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_email_sent_at',
    },
  }, {
    tableName: 'user_email',
    timestamps: true,
    underscored: true,
  });

  return UserEmail;
};
