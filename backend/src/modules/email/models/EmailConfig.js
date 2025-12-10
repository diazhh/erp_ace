const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailConfig = sequelize.define('EmailConfig', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    smtpHost: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'smtp_host',
    },
    smtpPort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 587,
      field: 'smtp_port',
    },
    smtpSecure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'smtp_secure',
      comment: 'true for 465, false for other ports',
    },
    smtpUser: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'smtp_user',
    },
    smtpPassword: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'smtp_password',
    },
    fromEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'from_email',
    },
    fromName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'ERP System',
      field: 'from_name',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastTestedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_tested_at',
    },
    lastTestResult: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'last_test_result',
    },
    lastTestError: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'last_test_error',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'updated_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'email_config',
    timestamps: true,
    underscored: true,
  });

  return EmailConfig;
};
