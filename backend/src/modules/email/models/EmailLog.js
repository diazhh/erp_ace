const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailLog = sequelize.define('EmailLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'template_id',
      references: {
        model: 'email_templates',
        key: 'id',
      },
    },
    templateCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'template_code',
    },
    toEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'to_email',
    },
    toName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'to_name',
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
      defaultValue: 'PENDING',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sent_at',
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User who triggered the email',
    },
  }, {
    tableName: 'email_logs',
    timestamps: true,
    underscored: true,
  });

  return EmailLog;
};
